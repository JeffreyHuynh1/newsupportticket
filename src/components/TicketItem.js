import React, { useState } from "react";
import { ListGroupItem, Modal, Button, Row, Col } from "react-bootstrap";

import { faBriefcase } from "@fortawesome/free-solid-svg-icons";
import { faLaptopCode } from "@fortawesome/free-solid-svg-icons";
import { faCogs } from "@fortawesome/free-solid-svg-icons";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//given department, gives proper icon
const icons = (department) => {
  if (department === "Finance") {
    return <FontAwesomeIcon icon={faBriefcase} />;
  } else if (department === "Marketing") {
    return <FontAwesomeIcon icon={faPen} />;
  } else if (department === "Operation Management") {
    return <FontAwesomeIcon icon={faCogs} />;
  } else if (department === "Human Resource") {
    return <FontAwesomeIcon icon={faUsers} />;
  } else {
    return <FontAwesomeIcon icon={faLaptopCode} />;
  }
};

//takes in ticket item as parameter
export const TicketItem = ({ item, deleteTicket, userName }) => {
  //states to handle modal open and close
  const [show, setShow] = useState(false);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  //takes date string and returns a date object to parse the date for given month, day, year
  const date = new Date(item.date);
  const day = date.getDate();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return (
    <>
      <ListGroupItem as="li" onClick={handleShow}>
        <div className="media">
          <div className="icon" pull="left">
            {icons(item.department)}
          </div>
          <div className="media-body" style={{ paddingLeft: "10px" }}>
            <strong>{item.ticketTitle}</strong>{" "}
            <span style={{ float: "right" }}> Status: {item.status}</span>
            <p className="info">
              Opened By {userName} On{" "}
              {`${month}-${day}-${year} ${hours}:${minutes}`}{" "}
            </p>
          </div>
        </div>
      </ListGroupItem>

      {/* activates whenever show state is set to true, triggers on click of a list item */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{item.ticketTitle}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row>
            <Col md={12}>
              <p>
                TicketID: <strong>{item.ticketID}</strong>{" "}
              </p>
              <p>{item.ticketDescription}</p>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="danger"
            onClick={(e) => {
              deleteTicket(item.ticketID, item.status);
              handleClose();
            }}
          >
            Delete
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TicketItem;
