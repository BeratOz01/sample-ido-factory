import React from "react";

// CSS
import styles from "./style.module.css";

// Hooks
import { useWeb3 } from "components/providers";
import { Spinner } from "react-bootstrap";

const Information = () => {
  const { payment, web3, factory } = useWeb3();

  const [totalRequested, setTotalRequested] = React.useState(0);
  const [totalSalesAmount, setTotalSalesAmount] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      console.log("xd");
      await payment.methods
        .totalRequestedTokenAmount()
        .call()
        .then((resp) => setTotalRequested(web3.utils.fromWei(resp, "ether")));

      await factory.methods
        .getSalesLength()
        .call()
        .then((resp) => setTotalSalesAmount(resp))
        .finally(() => setIsLoading(false));
    }
    if (payment) fetchData();
  }, [payment, web3.utils, factory]);

  return (
    <div className={`${styles.c_card}`}>
      <div className="d-flex flex-column text-danger">
        <p className="poppins fs-5 mb-0">Total Requested PTK</p>
        {isLoading ? (
          <Spinner
            animation="border"
            variant="warning"
            className="mx-auto mt-2"
          />
        ) : (
          <p className="poppins text-center fs-2">{totalRequested} PTK</p>
        )}
      </div>
      <div className="d-flex flex-column text-primary">
        <p className="poppins fs-5 mb-0">Total Sales</p>
        {isLoading ? (
          <Spinner
            animation="border"
            variant="warning"
            className="mx-auto mt-2"
          />
        ) : (
          <p className="poppins text-center fs-2">{totalSalesAmount}</p>
        )}
      </div>
    </div>
  );
};

export default Information;
