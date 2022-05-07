import React from "react";

// Hooks
import { useAccount } from "components/hooks/web3";
import { useWeb3 } from "components/providers";

// CSS
import styles from "./style.module.css";
import { Container, Button, Spinner } from "react-bootstrap";

const PaymentTokenCard = () => {
  const { payment, web3 } = useWeb3();
  const { account } = useAccount();

  const [balance, setBalance] = React.useState(0);
  const [canRequest, setCanRequest] = React.useState(null);
  const [cooldown, setCooldown] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    async function fetchData() {
      const balance = await payment.methods.balanceOf(account?.data).call();
      setBalance(web3.utils.fromWei(balance, "ether"));

      const cooldown = await payment.methods
        .getRemainingCooldown__sender()
        .call({ from: account?.data });

      if (parseInt(cooldown) === 0) setCanRequest(true);
      else {
        setCanRequest(false);
        setCooldown(cooldown);
      }
    }
    if (account?.data && payment && web3) fetchData();
  }, [payment, account?.data, balance, web3]);

  React.useEffect(() => {
    let timer;

    if (cooldown && parseInt(cooldown) !== 0) {
      timer = setInterval(() => {
        setCooldown(cooldown - 1);
      }, 1000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [cooldown]);

  const onClickRequest = async () => {
    setIsLoading(true);
    await payment.methods
      .requestPaymentToken()
      .send({ from: account?.data })
      .finally(() => setIsLoading(false));

    const balance = await payment.methods.balanceOf(account?.data).call();
    setBalance(web3.utils.fromWei(balance, "ether"));
  };

  return (
    <Container>
      <div className={`${styles.c_card}`}>
        <div className={`${styles.informationDiv}`}>
          <div className="m-auto d-flex flex-column">
            <p className="poppins text-center mx-auto fs-6 w-75">
              You need to have test AVAX for send transaction in FUJI Testnet.
              Here is the link for faucet
            </p>
            <Button
              variant={"warning"}
              className="poppins align-self-center shadow-none"
              onClick={() =>
                window.open("https://faucet.avax-test.network/", "_blank")
              }
            >
              Go Faucet
            </Button>
          </div>
        </div>
        <div className={`${styles.informationDiv}`}>
          <div className="m-auto d-flex flex-column">
            <p className="poppins text-center mx-auto fs-6 w-75 mb-1">
              You need to request payment token to participate IDOs. But you can
              request it every 10 minutes.
            </p>
            <p className="poppins text-center my-0">
              Current balance : {balance} PTK
            </p>
            <Button
              variant={canRequest ? "warning" : "dark"}
              className="poppins align-self-center shadow-none"
              onClick={() => onClickRequest()}
              disabled={!canRequest}
            >
              {isLoading ? (
                <Spinner animation="border" variant="light" size="sm" />
              ) : (
                "Request PTK"
              )}
            </Button>
            {!canRequest && (
              <p className="poppins text-center mt-2">
                Wait for {cooldown?.toString()} seconds.
              </p>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default PaymentTokenCard;
