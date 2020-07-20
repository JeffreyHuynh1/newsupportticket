import React from "react";
import logo from "./logo.svg";
import config from "./aws-exports";
import Amplify from "aws-amplify";
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
import "./App.css";
import Layout from "./components/Layout";
import Header from "./components/Header";
import { Row, Col } from "react-bootstrap";
import { createGlobalStyle } from "styled-components";

Amplify.configure(config);

function App() {
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
      </Layout>
    </React.Fragment>
  );
}

export default withAuthenticator(App);
