import React from "react";

// CSS
import styles from "./style.module.css";

// Hooks
import { useWeb3 } from "components/providers";
import { useAccount } from "components/hooks/web3";

// Components
import { Loading } from "components/ui/Loading";

// web3uikit
import { Accordion, Card, Modal, Button, Form } from "react-bootstrap";
import { loadContractWithAddress } from "utils/loadContract";

const CreatedTokens = () => {
  const { web3, portfolio, factory } = useWeb3();
  const { account } = useAccount();

  const [tokens, setTokens] = React.useState();
  const [isLoading, setIsLoading] = React.useState(true);

  const [show, setShow] = React.useState();
  const [selectedToken, setSelectedToken] = React.useState({
    address: "",
    symbol: "",
  });
  const [userBalance, setUserBalance] = React.useState();
  const [amount, setAmount] = React.useState(0);
  const [contract, setContract] = React.useState();
  const [sendingError, setSendingError] = React.useState(false);
  const [sendingSuccess, setSendingSuccess] = React.useState(false);

  const [possibleSaleContracts, setPossibleSaleContracts] = React.useState([]);
  const [isLoadingPossibleSaleContracts, setIsLoadingPossibleSaleContracts] =
    React.useState(true);
  const [selectedSaleContract, setSelectedSaleContract] = React.useState();
  const [isSending, setIsSending] = React.useState(false);

  const onClickSend = () => setShow(true);

  React.useEffect(() => {
    async function fetchData() {
      const t = await portfolio.methods
        .getMyERC20s()
        .call({ from: account?.data })
        .finally(() => setIsLoading(false));
      setTokens(t);
    }
    if (web3 && account?.data && portfolio) fetchData();
  }, [web3, account?.data, portfolio]);

  React.useEffect(() => {
    async function fetchData() {
      let poss = await factory.methods
        .getMySales()
        .call({ from: account?.data });

      for (let sale of poss) {
        if (sale.projectToken === selectedToken.address)
          setPossibleSaleContracts((old) => [
            ...old,
            { address: sale.saleAddress, name: sale.name },
          ]);
      }
      setIsLoadingPossibleSaleContracts(false);

      // Initialize Project Token Contract
      let c = await loadContractWithAddress(
        "ProjectToken",
        selectedToken.address,
        web3
      );
      setContract(c);

      let balance = await c.methods.balanceOf(account?.data).call();
      setUserBalance(balance);
    }

    if (selectedToken && show && web3 && account?.data && factory) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedToken, show, web3, account?.data, factory]);

  const onClickSendModal = async () => {
    setIsSending(true);
    await contract.methods
      .transfer(selectedSaleContract, web3.utils.toWei(amount.toString()))
      .send({ from: account?.data })
      .then(() => setSendingSuccess(true))
      .catch((e) => setSendingError(true));
    setIsSending(false);
  };

  return (
    <>
      <Modal show={show} onHide={() => setShow(!show)} centered>
        <Modal.Body>
          <p className="poppins text-center mb-0">Selected Token</p>
          {selectedToken && userBalance && (
            <>
              <p className="poppins text-center mt-2 mb-0">
                {selectedToken.address.slice(0, 16)}...
              </p>
              <p className="poppins text-center mb-0">
                Current Balance: {web3.utils.fromWei(userBalance, "ether")}{" "}
                {selectedToken.symbol}
              </p>
            </>
          )}
          {isLoadingPossibleSaleContracts ? (
            <p className="poppins text-center mt-4 fs-2">Loading...</p>
          ) : possibleSaleContracts?.length > 0 ? (
            <Form.Group className="mb-3 d-flex flex-column">
              <Form.Label className="text-center poppins mx-auto">
                Select Destination Contract
              </Form.Label>
              <Form.Select
                className="shadow-none poppins text-center"
                onChange={(e) => {
                  setSelectedSaleContract(e.target?.value);
                  console.log(e.target?.value);
                }}
              >
                <option value={""}></option>
                {possibleSaleContracts.map((sale) => (
                  <option value={sale.address} key={sale.address}>
                    Name : {sale.name} Address : {sale.address.slice(0, 6)}...
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          ) : (
            <p className="text-center poppins mt-3">
              Can not find any sale contract with selected token.
            </p>
          )}
          <div className="d-flex flex-column w-100 gap-4">
            <Form.Group className="mb-3 d-flex flex-column">
              <Form.Label className="text-center poppins mx-auto">
                Amount (ETH)
              </Form.Label>
              <Form.Control
                className="text-center poppins shadow-none"
                type="number"
                defaultValue={amount}
                onChange={(e) => {
                  setAmount(e.target?.value);
                }}
              />
            </Form.Group>

            <Button
              variant="success"
              className="poppins text-center m-auto shadow-none"
              disabled={!selectedSaleContract}
              onClick={onClickSendModal}
            >
              {isSending
                ? "In Progress..."
                : !sendingError && sendingSuccess
                ? "Success"
                : sendingError
                ? "An error occurred."
                : "Send"}
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      <Accordion defaultActiveKey={0}>
        <Accordion.Item className={`${styles.accordion_item} shadow-none my-5`}>
          <Accordion.Header className="poppins border-0">
            Created Tokens
          </Accordion.Header>
          <Accordion.Body>
            {isLoading ? (
              <Loading />
            ) : (
              <div>
                {tokens?.length > 0 ? (
                  tokens.map((elem) => (
                    <Card key={elem.name}>
                      <p className="text-center poppins mt-2">
                        Token Name: {elem.name}
                      </p>
                      <p className="text-center poppins">
                        Token Symbol: {elem.symbol}
                      </p>
                      <p className="text-center poppins">
                        Total Supply: {elem.totalSupply}
                      </p>
                      <p className="text-center poppins">
                        Address: {elem.tokenAddress.slice(0, 6)}...
                      </p>
                      <Button
                        variant="secondary"
                        className="w-25 border-pill poppins text-light mx-auto my-2 shadow-none"
                        onClick={() => {
                          setSelectedToken({
                            address: elem.tokenAddress,
                            symbol: elem.symbol,
                          });
                          onClickSend();
                        }}
                      >
                        Send Tokens
                      </Button>
                    </Card>
                  ))
                ) : (
                  <p className="text-center poppins mb-0">No tokens created</p>
                )}
              </div>
            )}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>
  );
};

export default CreatedTokens;
