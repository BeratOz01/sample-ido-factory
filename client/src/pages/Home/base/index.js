import React from "react";

// CSS
import { Container } from "react-bootstrap";

// Hooks
import { useAccount, useNetwork } from "components/hooks/web3";

// Components
import {
  Information,
  Loading,
  PaymentTokenCard,
  WrongNetwork,
  Sales,
} from "components/ui";

const Home = () => {
  const { account } = useAccount();
  const { network } = useNetwork();

  return (
    <Container>
      {network?.hasInitialResponse ? (
        <>
          {network?.isSupported ? (
            <>
              <p className="text-center poppins mt-5">Information</p>
              <div className="d-flex flex-row">
                <PaymentTokenCard />
                <Information />
              </div>
              <Sales />
            </>
          ) : (
            <WrongNetwork />
          )}
        </>
      ) : (
        <Loading padding={5} />
      )}
    </Container>
  );
};

export default Home;
