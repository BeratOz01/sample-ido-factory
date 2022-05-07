import React from "react";

// Bootstrap
import { Container } from "react-bootstrap";

// Styles
import styles from "./style.module.css";

// Icons
import { AiOutlineInfoCircle } from "react-icons/ai";

// Components
import { CreatedTokens, ParticipatedSales, MySales } from "components/ui";

const Portfolio = () => {
  return (
    <Container className="mt-5">
      <div
        className={`d-flex w-75 ${styles.c_card} mx-auto my-5 poppins flex-column`}
      >
        <AiOutlineInfoCircle className="mx-auto my-2" size={50} />
        <p className="poppins text-center text-dark fs-6 mx-auto mt-2 w-75">
          Here is the fully decentralized native portfolio for Launchpad. Here
          you can see the current status of your sales, and created ERC20
          tokens. You can also create your own tokens and use them in your own
          sales.
        </p>
      </div>
      <ParticipatedSales />
      <CreatedTokens />
      <MySales />
    </Container>
  );
};

export default Portfolio;
