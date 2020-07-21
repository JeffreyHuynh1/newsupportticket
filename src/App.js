import React, { useEffect, useState } from "react";
import config from "./aws-exports";
import Amplify, { API, Auth } from "aws-amplify";
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
import "./App.css";
import { Row, Col, Button, ButtonGroup, ButtonToolbar } from "react-bootstrap";
import { createGlobalStyle } from "styled-components";

import Layout from "./components/Layout";
import Header from "./components/Header";
import NewTicket from "./components/NewTicket";
import TicketList from "./components/TicketList";

Amplify.configure(config);

const GlobalStyle = createGlobalStyle`
  body {
    background: #eee;
  }
  `;

function App() {
  //state for all tickets
  const [tickets, setTickets] = useState([]);
  const [openTickets, setOpenTickets] = useState([]);
  const [closedTickets, setClosedTickets] = useState([]);
  const [allTickets, setAllTickets] = useState([]);

  //state for user name
  const [userName, setUserName] = useState("");

  // gets inital state of all tickets associated with given user, updates when new ticket item is added
  useEffect(() => {
    const newOpenTickets = [];
    const newClosedTickets = [];
    const newAllTickets = [];

    //gets authenticated user info and sets state
    Auth.currentUserInfo().then((res) => {
      setUserName(res.username);

      //this call needs to be inside the response of Auth.currentUser to access the userID because the function is an async function
      API.get("ticketsAPI", "/tickets/ticketID").then((ticketRes) => {
        //looks for all tickets associated with the authenticated user
        ticketRes.forEach((cur) => {
          if (cur.userId === res.id) {
            newAllTickets.push(cur);
          }
        });

        //looks for all open tickets
        ticketRes.forEach((cur) => {
          if (cur.status === "Open" && cur.userId === res.id) {
            newOpenTickets.push(cur);
          }
        });
        //looks for all closed tickets
        ticketRes.forEach((cur) => {
          if (cur.status === "Closed" && cur.userId === res.id) {
            newClosedTickets.push(cur);
          }
        });

        console.log("open tickets", newOpenTickets);
        //set state for all open tickets associated with user
        setAllTickets(newAllTickets);

        //set state for tickets to all tickets
        setTickets(newAllTickets);

        //set state for open tickets
        setOpenTickets(newOpenTickets);

        //set state for closed tickets
        setClosedTickets(newClosedTickets);
      });
    });
  }, []);

  const handleDelete = (ticketID, status) => {
    let index = 0;
    let indexOpen = 0;
    let indexClosed = 0;
    let newTicketList = [...allTickets];
    let newTicketListOpen = [...openTickets];
    let newTicketListClosed = [...closedTickets];

    //gets index of the ticket item being deleted
    allTickets.forEach((ticket, ind) => {
      if (ticket.ticketID === ticketID) {
        index = ind;
      }
    });
    //creates a new list without deleted ticket item to set new state for open tickets
    newTicketList.splice(index, 1);

    //finds deleted element in the open tickets array and deletes it accordingly
    if (status === "Open") {
      openTickets.forEach((ticket, ind) => {
        if (ticket.ticketID === ticketID) {
          indexOpen = ind;
        }
      });
      newTicketListOpen.splice(indexOpen, 1);
    }
    //finds deleted element in the clsoed tickets array and deletes accordingly
    else if (status === "Closed") {
      closedTickets.forEach((ticket, ind) => {
        if (ticket.ticketID === ticketID) {
          indexClosed = ind;
        }
      });
      newTicketListClosed.splice(indexClosed, 1);
    }

    API.del("ticketsAPI", `/tickets/${ticketID}`)
      .then((res) => {
        setAllTickets(newTicketList);
        setTickets(newTicketList);
        //checks what the status is and updates the appropiate state
        if (status === "Open") {
          setOpenTickets(newTicketListOpen);
        } else if (status === "Closed") {
          setClosedTickets(newTicketListClosed);
        }
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
    }).then(() => {
      //ticket object to add to states
      const ticket = {
        ticketID: id,
        ticketTitle: title,
        ticketDescription: description,
        department: department,
        date: date,
        status: status,
        representativeID: representativeID,
      };
      //adds tickets to the appropiate states so that it will update
      setAllTickets([...allTickets, ticket]);
      setOpenTickets([...openTickets, ticket]);
      setTickets([...tickets, ticket]);
    });
  };

  return (
    <React.Fragment>
      <GlobalStyle />
      <div className="SignOutContainer">
        <AmplifySignOut />
      </div>
      <Layout>
        <Header />
        <hr />

        <ButtonToolbar
          className="justify-content-between"
          aria-label="Toolbar with Button groups"
        >
          <ButtonGroup>
            <Button
              variant="light "
              className="default"
              //changes the state of tickets to open tickets to display only open tickets
              onClick={(e) => {
                setTickets(allTickets);
              }}
            >
              {allTickets.length} All
            </Button>
            <Button
              variant="light "
              //changes the state of tickets to open tickets to display only open tickets
              onClick={(e) => {
                setTickets(openTickets);
              }}
            >
              {openTickets.length} Open
            </Button>
            <Button
              variant="light "
              //changes the state of tickets to closed tickets to display only closed tickets
              onClick={(e) => {
                setTickets(closedTickets);
              }}
            >
              {closedTickets.length} Closed
            </Button>
          </ButtonGroup>

          {/* New Ticket Button that triggers modal when clicked */}
          <NewTicket
            className="newticket__button"
            handleSubmit={handleSubmit}
          />
        </ButtonToolbar>

        <div className="padding"></div>

        {/* Begining of all the tickets*/}
        <Row>
          <Col md={12}>
            <TicketList
              ticketList={tickets}
              deleteTicket={handleDelete}
              userName={userName}
            />
          </Col>
        </Row>
      </Layout>
    </React.Fragment>
  );
}

export default withAuthenticator(App);
