import React from "react";

// CSS
import { Container, Button } from "react-bootstrap";

// Icons
import { GrCircleInformation } from "react-icons/gr";

// Hooks
import { useWeb3 } from "components/providers";

const WrongNetwork = () => {
  const { switchNetwork } = useWeb3();
  return (
    <Container className="d-flex mt-5">
      <div className="mx-auto d-flex flex-column mt-5">
        <p className="poppins fs-5">
          Wrong network! Please Change It to FUJI Testnet
        </p>
        <GrCircleInformation
          size={"60"}
          color={"red"}
          className="mt-2 text-warning mx-auto"
        />
        <Button
          className="rounded-pill poppins mt-3"
          variant="warning"
          onClick={() => switchNetwork()}
        >
          Switch Network
        </Button>
      </div>
    </Container>
  );
};

export default WrongNetwork;
