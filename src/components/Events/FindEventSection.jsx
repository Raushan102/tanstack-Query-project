import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchEvents } from "../../util/https";
import ErrorBlock from "../UI/ErrorBlock";
import EventItem from "./EventItem";
import LoadingIndicator from "../UI/LoadingIndicator";

export default function FindEventSection() {
  const [searchTerm, setSearchTerm] = useState();
  const searchElement = useRef();

  function handleSubmit(event) {
    event.preventDefault();

    setSearchTerm(searchElement.current.value);
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["events", { search: searchTerm }],
    queryFn: ({ signal }) => fetchEvents({ searchTerm, signal }),
    enabled: searchTerm !== undefined,
  });

  let content = "please enter a search term and to find events";

  if (isLoading) {
    content = <LoadingIndicator />;
  }

  if (isError) {
    content = (
      <ErrorBlock
        title="Am error occurred"
        message={error.info?.message || "failed to fetch data"}
      />
    );
  }

  if (data) {
    content = (
      <ul className="events-list">
        {data.map((event) => {
          return (
            <li key={event}>
              <EventItem event={event} />
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <section className="content-section" id="all-events-section">
      <header>
        <h2>Find your next event!</h2>
        <form onSubmit={handleSubmit} id="search-form">
          <input
            type="search"
            placeholder="Search events"
            ref={searchElement}
          />
          <button>Search</button>
        </form>
      </header>

      {content}
    </section>
  );
}
