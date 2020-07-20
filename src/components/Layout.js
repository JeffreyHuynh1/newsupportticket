import React from "react";
import { Container, Row, Col } from "react-bootstrap";

// Creates a container with appropiate layout
// ticket items will be placed in this container
export const Layout = (props) => (
  <Container>
    <section className="content">
      <Row>
        <Col md={12}>
          <div className="grid support-content">
            <div className="grid-body">{props.children}</div>
          </div>
        </Col>
      </Row>
    </section>
  </Container>
);

export default Layout;
