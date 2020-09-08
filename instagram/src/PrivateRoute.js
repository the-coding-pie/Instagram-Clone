import React from 'react';
import { Route, Redirect } from 'react-router-dom';
const { checkAuth } = require("./utils");

const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (checkAuth()) {
          return <Component {...props} />;
        } else {
          return <Redirect
          to={{
            pathname: "/login"
          }}
        />;
        }
      }
      }
    />
  );
}

export default PrivateRoute;