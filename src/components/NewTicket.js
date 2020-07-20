import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import "../App.css";

export const NewTicket = ({ handleSubmit }) => {
  //states for values needed for post method
  const [ticketTitle, setTicketTitle] = useState("");
  const [ticketDescription, setTicketDescription] = useState("");

  //default state for department is IT in case user doesn't enter field
  const [department, setDepartment] = useState("IT");
  //states to trigger modal for new ticket
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div>
      <Button variant="success" onClick={handleShow} className="pull-right">
        New Ticket
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        animation={true}
        id={"newIssue"}
        tabIndex="-1"
        aria-labelledby="New Ticket"
      >
        <Modal.Dialog>
          <Modal.Header closeButton style={{ backgroud: "blue" }}>
            <Modal.Title>Create New Ticket</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder="Subject Title"
                  onChange={(e) => setTicketTitle(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder="Department: Marketing, Finance, Operations, Human Resources, IT"
                  onChange={(e) => setDepartment(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group>
                <Form.Control
                  as="textarea"
                  rows="4"
                  placeholder="Ticket Description"
                  onChange={(e) => setTicketDescription(e.target.value)}
                ></Form.Control>
              </Form.Group>
            </Form>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Discard
            </Button>
            <Button
              variant="primary"
              onClick={(e) => {
                handleSubmit(
                  e,
                  uuidv4(),
                  ticketTitle,
                  ticketDescription,
                  department,
                  new Date(),
                  "Open",
                  ""
                );
                handleClose();
              }}
            >
              Create
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal>
    </div>
  );
};

export default NewTicket;
