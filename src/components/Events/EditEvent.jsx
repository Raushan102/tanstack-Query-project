import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchEvent } from "../../util/https.jsx";
import { queryClient } from "../../util/https.jsx";
import { updateEvent } from "../../util/https.jsx";

import ErrorBlock from "../UI/ErrorBlock.jsx";

import Modal from "../UI/Modal.jsx";
import EventForm from "./EventForm.jsx";

export default function EditEvent() {
  let content = "please wait.......";
  const navigate = useNavigate();
  const { id } = useParams();

  const { data, isError, error} = useQuery({
    queryKey: ["events", id],
    
    queryFn: ({ signal }) => fetchEvent({ id, signal }),

  });

 

  const {
    mutate, isPending
  } = useMutation({
    mutationFn: updateEvent,
    // onMutate: async (data)=>{
    //    const updatedData=data.event
        
    //     await queryClient.cancelQueries({queryKey:["events", id]})
    //    const previousData = queryClient.getQueryData(["events", id]);

    //    queryClient.setQueryData(["events", id], updatedData);

    //    return {previousData}
    // },
    // onError:(error,data,context)=>{
    //     queryClient.setQueryData(["events", id],context.previousData);
    // },
    // onSettled:()=>{
    //   queryClient.invalidateQueries(["events", id]);
      
    // }
    onSuccess:()=>{
     queryClient.invalidateQueries(['events'])
     navigate('../')
    }


  
  });

  function handleSubmit(formData) {
    mutate({ id, event: formData });
    // navigate('../')
  }

  function handleClose() {
    navigate("../");
  }
  

  

  if (data) {
    content = (
      <EventForm inputData={data} onSubmit={handleSubmit}>
        <Link to="../" className="button-text">
          Cancel
        </Link>
        <button type="submit" className="button">
          {isPending ? "updating..." : 'update'}
        </button>
        
      </EventForm>
    );
  }
  if (isError) {
    content = (
      <ErrorBlock
        title={"an error occurred"}
        message={
          error.info?.message ||
          "there are some thing wrong unable to fetch data"
        }
      />
    );
  }

  return <Modal onClose={handleClose}>{content}</Modal>;
}
