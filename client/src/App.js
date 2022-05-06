import React from "react";

// React Router Dom
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// Pages
import { Home, Create } from "./pages";

import { Layout } from "components/ui";

function App() {
  return (
    <React.Fragment>
      <Router>
        <Layout>
          <Switch>
            <Route component={Create} path="/create" />
            <Route component={Home} path="/" />
          </Switch>
        </Layout>
      </Router>
    </React.Fragment>
  );
}

export default App;
