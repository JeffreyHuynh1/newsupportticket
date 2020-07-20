import React from "react";
import { ListGroup } from "react-bootstrap";
import TicketItem from "./TicketItem";
//import Amplify, {API} from "aws-amplify";

//ticketList is the array of tickets that is being passed in
export const TicketList = ({ ticketList, deleteTicket }) => {
  return (
    <ListGroup as="ul">
      {ticketList.map((ticket) => (
        <TicketItem
          key={ticket.ticketID}
          item={ticket}
          deleteTicket={deleteTicket}
        />
      ))}
    </ListGroup>
  );
};

export default TicketList;
