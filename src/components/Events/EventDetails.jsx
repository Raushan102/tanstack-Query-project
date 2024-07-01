import { Link, Outlet, useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchEvent } from "../../util/https.jsx";
import LoadingIndicator from "../UI/LoadingIndicator.jsx";
import ErrorBlock from "../UI/ErrorBlock.jsx";
import { deleteEvent } from "../../util/https.jsx";
import { queryClient } from "../../util/https.jsx";
import { useState } from "react";
import Model from "../UI/Modal.jsx";

import Header from "../Header.jsx";

export default function EventDetails() {
  const [isDeleting, setIsDeleting] = useState(false);

  const { id } = useParams();

  const navigate = useNavigate();

  const { data, isPending, isError, error } = useQuery({
    queryKey: [`detail?${id}`],
    queryFn: ({ signal }) => fetchEvent({ id, signal }),
  });

  const {
    mutate,
    isPending: isPendingDelete,
    isError: isErrorDelete,
    error: errorDelete,
  } = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["events"],
        refetchType: "none",
      }),
        navigate("/events");
    },
  });

  function handleStartDeleting() {
    setIsDeleting(true);
  }

  function handleStopDeleting() {
    setIsDeleting(false);
  }

  function deleteEventHandler() {
    mutate({ id: id });
  }

  let content = "detail is not available now please wait";

  if (isPending) {
    content = (
      <div className="center">
        <LoadingIndicator />;
      </div>
    );
  }

  if (data) {
    content = (
      <article id="event-details">
        <header>
          <h1>{data.title}</h1>
          <nav>
            <button onClick={handleStartDeleting}>Delete</button>
            <Link to="edit">Edit</Link>
          </nav>
        </header>
        <div id="event-details-content">
          <img src={`http://localhost:3000/${data.image}`} alt={data.title} />
          <div id="event-details-info">
            <div>
              <p id="event-details-location">{data.location}</p>
              <time dateTime={`Todo-DateT$Todo-Time`}>
                {" "}
                {data.date} {data.time}
              </time>
            </div>
            <p id="event-details-description">{data.description}</p>
          </div>
        </div>
      </article>
    );
  }

  if (isError) {
    content = (
      <ErrorBlock
        title="An error occurred"
        message={error.info?.message || "unable to fetch events"}
      />
    );
  }

  return (
    <>
      <Outlet />
      {isDeleting && (
        <Model onClose={handleStopDeleting}>
          <h1>Are you sure</h1>
          <p>
            Surely you want to delete the event this event is still not deleted
          </p>

          <div className="form-actions">
            {isPendingDelete && <p>Delete is underProcess....</p>}
            {!isPendingDelete && (
              <>
                <button onClick={handleStopDeleting} className="button-text">
                  Cancel
                </button>
                <button onClick={deleteEventHandler} className="button">
                  Delete
                </button>
              </>
            )}
          </div>

          {isErrorDelete && (
            <ErrorBlock
              title="An error occurred"
              message={errorDelete.info?.message || "unable to fetch events"}
            />
          )}
        </Model>
      )}
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>

      {content}
    </>
  );
}
