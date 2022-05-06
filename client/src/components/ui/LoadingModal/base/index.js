import React from "react";

// Bootstrap
import { Spinner, Modal } from "react-bootstrap";
import { Audio } from "react-loader-spinner";

// Icons
import { BiError } from "react-icons/bi";
import { IoIosThumbsUp } from "react-icons/io";

const LoadingModal = ({ show, onHide, loading, error }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Body className="d-flex flex-column">
        {loading && (
          <>
            <p className="text-center poppins fs-4">Loading</p>
            <Audio
              height="150"
              width="80"
              color="#ffc107"
              wrapperClass="mx-auto"
            />
          </>
        )}
        {!loading && error && (
          <>
            <p className="text-center poppins fs-4 mb-0">An Error Occurred</p>
            <BiError className="mx-auto" size={80} color="red" />
          </>
        )}
        {!loading && !error && (
          <>
            <p className="text-center poppins fs-4">Successfully Created</p>
            <IoIosThumbsUp className="mx-auto" size={80} color="green" />
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default LoadingModal;
