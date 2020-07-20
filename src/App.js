import React, { useEffect, useState } from "react";
import config from "./aws-exports";
import Amplify, { API } from "aws-amplify";
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
import "./App.css";
import { Row, Col } from "react-bootstrap";
import { createGlobalStyle } from "styled-components";

import Layout from "./components/Layout";
import Header from "./components/Header";
import NewTicket from "./components/NewTicket";
import TicketList from "./components/TicketList";

Amplify.configure(config);

function App() {
  //state for all tickets
  const [tickets, setTickets] = useState([]);

  // gets inital state of all tickets associated with given user, updates when new ticket item is added
  useEffect(() => {
    API.get("ticketsAPI", "/tickets/ticketID").then((ticketRes) => {
      console.log(ticketRes);
      setTickets([...tickets, ...ticketRes]);
    });
  }, []);

  const handleDelete = (ticketID) => {
    let index = 0;
    const newTicketList = [...tickets];

    //gets index of the ticket item being deleted
    tickets.forEach((ticket, ind) => {
      if (ticket.ticketID === ticketID) {
        index = ind;
      }
    });
    //creates a new list without deleted ticket item to set new state
    newTicketList.splice(index, 1);

    API.del("ticketsAPI", `/tickets/ticketID/${ticketID}`)
      .then((res) => {
        setTickets(newTicketList);
        console.log(res.response);
      })
      .catch((err) => console.log(err.response));
  };

  // handles post method  to the api when ticket is added
  const handleSubmit = (
    e,
    id,
    title,
    description,
    department,
    date,
    status,
    representativeID
  ) => {
    e.preventDefault();

    API.post("ticketsAPI", "/tickets", {
      body: {
        ticketID: id,
        ticketTitle: title,
        ticketDescription: description,
        department: department,
        date: date,
        status: status,
        representativeID: representativeID,
      },
      //adds the new ticket to the state
    }).then(() => {
      setTickets([
        ...tickets,
        {
          ticketID: id,
          ticketTitle: title,
          ticketDescription: description,
          department: department,
          date: date,
          status: status,
          representativeID: representativeID,
        },
      ]);
    });
  };

  const GlobalStyle = createGlobalStyle`
  body {
    background: #eee;
  }
  `;

  return (
    <React.Fragment>
      <GlobalStyle />
      <div className="SignOutContainer">
        <AmplifySignOut />
      </div>
      <Layout>
        <Header />
        <hr />

        {/* New Ticket Button that triggers modal when clicked */}
        <NewTicket handleSubmit={handleSubmit} />

        {/* Begining of all the tickets*/}
        <Row>
          <Col md={12}>
            <TicketList ticketList={tickets} deleteTicket={handleDelete} />
          </Col>
        </Row>
      </Layout>
    </React.Fragment>
  );
}

export default withAuthenticator(App);
