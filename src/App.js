import React from "react";
import logo from "./logo.svg";
import config from "./aws-exports";
import Amplify from "aws-amplify";
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
import "./App.css";

Amplify.configure(config);

function App() {
  return (
    <div className="App">
      <header className="App-header">
        Hello
        <AmplifySignOut />
      </header>
      <AmplifySignOut />
    </div>
  );
}

export default withAuthenticator(App);
