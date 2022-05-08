import React from "react";

// Header
import { Header } from "components/ui";

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default Layout;
