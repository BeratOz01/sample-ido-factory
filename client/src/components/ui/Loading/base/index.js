import React from "react";

// CSS
import { Container } from "react-bootstrap";
import { Audio } from "react-loader-spinner";

const Loading = ({ padding }) => {
  return (
    <Container className={`d-flex flex-row mt-${padding}`}>
      <div className={`m-auto mt-${padding}`}>
        <p className="poppins justify-content-center fs-4">LOADING</p>
        <Audio height="150" width="100" color="#ffc107" ariaLabel="loading" />
      </div>
    </Container>
  );
};

export default Loading;
