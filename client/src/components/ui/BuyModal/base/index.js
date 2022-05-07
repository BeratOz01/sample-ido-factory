import React from "react";

// Bootstrap Modal
import { Modal } from "react-bootstrap";

// Hooks
import { useWeb3 } from "components/providers";
import { useAccount } from "components/hooks/web3";

// web3uikit
import { Typography, Button } from "web3uikit";

// utils
import { loadContractWithAddress } from "utils/loadContract";

const BuyModal = ({ show, onHide, contract, amount, projectTokenContract }) => {
  // Hooks
  const { web3, payment } = useWeb3();
  const { account } = useAccount();

  // Approve States
  const [needApprove, setNeedApprove] = React.useState(true);
  const [approveLoading, setApproveLoading] = React.useState(false);
  const [approveError, setApproveError] = React.useState(false);

  // Buy States
  const [paymentLoading, setPaymentLoading] = React.useState(false);
  const [paymentError, setPaymentError] = React.useState(false);

  // Does contract has enough token for distribution
  const [hasEnoughToken, setHasEnoughToken] = React.useState(true);

  // On click approve button
  const onApprove = async () => {
    setApproveLoading(true);
    await payment.methods
      .approve(contract._address, web3.utils.toWei(amount, "ether"))
      .send({ from: account?.data })
      .catch(() => setApproveError(true))
      .then(() => setNeedApprove(false))
      .finally(() => setApproveLoading(false));
  };

  // On click buy button
  const onBuy = async () => {
    setPaymentLoading(true);
    await contract.methods
      .buy(web3.utils.toWei(amount, "ether"))
      .send({ from: account?.data })
      .catch(() => setPaymentError(true))
      .then(() => {
        setPaymentLoading(false);
      });
  };

  React.useEffect(() => {
    async function fetchData() {
      // Fetch payment token address from contract
      let price = await contract.methods.price().call();

      // Minimum balance of project amount token to buy
      let expectedMinimumBalance = web3.utils.toWei(amount, "ether") / price;

      // Balance of project token of sale contract
      let balanceOfSaleContract = await projectTokenContract.methods
        .balanceOf(contract._address)
        .call();

      // If balance of project token of sale contract is less than expected minimum balance then set hasEnoughToken to false
      if (balanceOfSaleContract < expectedMinimumBalance) {
        setHasEnoughToken(false);
      }

      let allowance = await payment.methods
        .allowance(account?.data, contract._address)
        .call();

      if (allowance >= web3.utils.toWei(amount, "ether")) {
        setNeedApprove(false);
      }
    }

    if (web3 && account?.data && show === true && contract && payment)
      fetchData();
  }, [
    web3,
    account?.data,
    show,
    contract,
    amount,
    payment,
    projectTokenContract,
  ]);

  return (
    <Modal
      show={show}
      centered
      size="md"
      onHide={() => {
        onHide();
        setPaymentError(false);
        setApproveError(false);
        window.location.reload();
      }}
      className="poppins"
      contentClassName="p-4 d-flex"
    >
      <div className="d-flex justify-content-around">
        <Typography variant="subtitle1" className="my-auto">
          Approve
        </Typography>
        <Button
          onClick={onApprove}
          size="large"
          text={
            approveLoading ? "Loading..." : approveError ? "Error" : "Approve"
          }
          theme="primary"
          type="button"
          className="my-auto"
          disabled={!needApprove}
        ></Button>
      </div>
      {needApprove && (
        <div className="d-flex justify-content-center mt-1">
          <Typography variant="caption12" weight="700" className="my-auto">
            You need to approve {amount} PTK to Sale Contract.
          </Typography>
        </div>
      )}
      <div className="d-flex justify-content-around mt-3">
        <Typography variant="subtitle1" className="my-auto">
          Buy
        </Typography>
        <Button
          onClick={onBuy}
          size="large"
          text={paymentLoading ? "Loading..." : paymentError ? "Error" : "Buy"}
          theme="primary"
          type="button"
          className="my-auto"
          disabled={needApprove}
        ></Button>
      </div>
      {!hasEnoughToken && (
        <div className="d-flex justify-content-center mt-1 text-center w-75 m-auto">
          <Typography variant="caption12" weight="700" className="my-auto">
            Contract doesn't have enough token for distribution. Please try
            again later.
          </Typography>
        </div>
      )}
    </Modal>
  );
};

export default BuyModal;
