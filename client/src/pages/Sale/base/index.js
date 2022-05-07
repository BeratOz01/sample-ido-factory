import React from "react";

// React-router-dom
import { useParams, useHistory } from "react-router-dom";

// Hooks
import { useWeb3 } from "components/providers";
import { useAccount } from "components/hooks/web3";

// Bootstrap
import { Button, Container, Table } from "react-bootstrap";
import { Loading, BuyModal } from "components/ui";

// web3uikit
import { Input } from "web3uikit";

// Utils
import { loadContractWithAddress } from "utils/loadContract";

// web3uikit
import { Widget } from "web3uikit";

const Sale = () => {
  const { web3, factory } = useWeb3();
  const { account } = useAccount();

  // Get address from parameters
  const { address } = useParams();

  // Get history
  const history = useHistory();

  // States
  const [error, setError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isValid, setIsValid] = React.useState(false);
  const [contract, setContract] = React.useState(null);
  const [sale, setSale] = React.useState();
  const [infoArr, setInfoArr] = React.useState();
  const [amount, setAmount] = React.useState();
  const [estimatedProjectToken, setEstimatedProjectToken] = React.useState(0);

  // Project Token Contract
  const [projectTokenContract, setProjectTokenContract] = React.useState(null);
  const [symbol, setSymbol] = React.useState("");

  // Modal States
  const [show, setShow] = React.useState(false);

  // Withdraw states
  const [withdrawLoading, setWithdrawLoading] = React.useState(false);
  const [isWithdrawable, setIsWithdrawable] = React.useState(false);

  React.useEffect(() => {
    async function fetchData() {
      // Check the validity of the sale address
      const isValidSaleAddress = await factory.methods
        .isSaleValid(address)
        .call();

      if (isValidSaleAddress === true) {
        setError(false);
        setIsValid(true);
      } else {
        setError(true);
      }
    }

    if (web3 && factory && address) {
      fetchData()
        .catch(() => {
          setError(true);
        })
        .finally(() => {
          if (error) setIsLoading(false); // If error, stop loading otherwise component will fetch contract data from chain
        });
    }
  }, [address, web3, factory, error]);

  // This useEffect hook will be invoke if the sale address is valid
  React.useEffect(() => {
    async function fetchData() {
      // Load the contract
      const c = await loadContractWithAddress("Sale", address, web3);
      setContract(c);

      // Get sale data
      const s = await c.methods.getSaleInfo().call();

      // Load the project token contract
      const p = await loadContractWithAddress(
        "ProjectToken",
        s._projectToken,
        web3
      );

      setProjectTokenContract(p);

      // Get symbol of project token
      let sy = await p.methods.symbol().call();
      setSymbol(sy);

      // Get information about user
      const infoArr = await c.methods
        .getInfo__sender()
        .call({ from: account?.data });

      // Check if user can withdraw depending on third state in infoArr
      for (let i = 0; i < infoArr.length; i++) {
        if (infoArr[i][3] === true && infoArr[i][2] === false)
          setIsWithdrawable(true);
      }

      setInfoArr(infoArr);
      setSale(s);
    }

    if (isValid === true && account?.data)
      fetchData().finally(() => {
        setIsLoading(false);
      });
  }, [address, isValid, web3, account?.data]);

  // Withdraw function
  const onWithdraw = async () => {
    setWithdrawLoading(true);
    await contract.methods
      .withdraw()
      .send({ from: account?.data })
      .finally(() => setWithdrawLoading(false));
    window.location.reload();
  };

  return (
    <Container className="d-flex flex-column mb-5">
      <BuyModal
        show={show}
        onHide={() => setShow(false)}
        contract={contract}
        amount={amount}
        projectTokenContract={projectTokenContract}
      />
      {isLoading ? (
        <Loading padding={5} />
      ) : (
        <>
          {error ? (
            <div className="mx-auto mt-5 d-flex flex-column">
              <p className="text-center poppins fs-5 mt-5">
                An error occurred. Please check address of Sale from URL.
              </p>
              <Button
                className="poppins w-75 mx-auto mt-3 shadow-none"
                variant="danger"
                onClick={() => history.goBack()}
              >
                Go Back
              </Button>
            </div>
          ) : (
            <>
              {sale && (
                <>
                  <div className="d-grid gap-4 mt-5 mx-auto w-100">
                    <section className="d-flex gap-2 poppins">
                      <Widget title="Name" info={sale._name} />
                    </section>
                    <section className="d-flex gap-2 poppins">
                      <Widget title="Sale ID" info={sale.id} />
                      <Widget
                        title="Token Address"
                        info={String(sale._projectToken)
                          .slice(0, 10)
                          .concat(["..."])}
                      >
                        <img
                          src="https://snowtrace.io/images/svg/brands/main.svg?v=22.5.1.0"
                          alt="snowtrace_logo"
                          width={20}
                          height={20}
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            window.open(
                              `https://testnet.snowtrace.io/token/${sale._projectToken}`,
                              "_blank"
                            )
                          }
                        />
                      </Widget>
                    </section>
                    <section className="d-flex gap-2 poppins">
                      <Widget
                        title="Price"
                        info={web3.utils
                          .fromWei(sale._price, "ether")
                          .concat([` $PTK Per Token`])}
                      />
                      <Widget
                        title="Total Number Of Participated Addresses"
                        info={sale._numberOfBuyers}
                      />
                      <Widget
                        title="Time Between Portions"
                        info={sale._timeBetweenPortions}
                      />
                    </section>
                    <section className="d-flex gap-2 poppins">
                      <Widget
                        title="Total Tokens Sold"
                        info={
                          web3.utils.fromWei(
                            sale._totalTokenForBuyed,
                            "ether"
                          ) + ` ${symbol}`
                        }
                      />
                      <Widget
                        title="Total Token Withdrawn"
                        info={
                          web3.utils.fromWei(
                            sale._totalTokenWithdrawn,
                            "ether"
                          ) + ` ${symbol}`
                        }
                      />
                    </section>
                  </div>
                  <div className="d-flex">
                    {infoArr?.length === 0 ? (
                      <div className="w-100 d-flex flex-column mt-5">
                        <p className="poppins text-center">
                          You haven't participated the sale yet
                        </p>
                        <div className="d-flex justify-content-around my-2 w-50 mx-auto">
                          <Input
                            label="Payment Token Amount (eth) eg. 1.5"
                            onChange={(e) => {
                              setAmount(e.target?.value);
                              try {
                                setEstimatedProjectToken(
                                  web3.utils.toWei(e.target?.value, "ether") /
                                    sale._price
                                );
                              } catch (e) {}
                            }}
                            type="number"
                            validation={{
                              numberMax: 10,
                              numberMin: 1,
                            }}
                          />
                          <p className="poppins my-auto ml-3">
                            {estimatedProjectToken} Project Token
                          </p>
                        </div>
                        <Button
                          variant="success"
                          className="poppins text-center mx-auto w-50 shadow-none my-5"
                          disabled={!amount}
                          onClick={() => {
                            if (amount !== "0") setShow(true);
                          }}
                        >
                          Buy !!
                        </Button>
                      </div>
                    ) : (
                      <div className="d-flex flex-column mx-auto mb-5">
                        <div className="d-flex flex-row mt-5 mx-auto">
                          <p className="poppins text-center">
                            You have participated the sale. You can see the
                            information in the table below.
                          </p>
                        </div>
                        <Table
                          borderless
                          hover
                          size="md"
                          className="w-100 poppins"
                        >
                          <thead className="text-center">
                            <tr>
                              <th>Amount (ETH)</th>
                              <th>Unlock Time</th>
                              <th>Is Claimed</th>
                              <th>Is Unlocked</th>
                            </tr>
                          </thead>
                          <tbody>
                            {infoArr.map((info, index) => (
                              <tr key={index}>
                                <td className="text-center">
                                  {web3.utils
                                    .fromWei(info[0], "ether")
                                    .slice(0, 6)}
                                </td>
                                <td className="text-center">
                                  {new Date(info[1] * 1000).toLocaleString()}
                                </td>
                                <td className="text-center">
                                  {info[2] ? "Yes" : "No"}
                                </td>
                                <td className="text-center">
                                  {info[3] ? "Yes" : "No"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                        <Button
                          variant="success"
                          onClick={onWithdraw}
                          className="poppins mt-2"
                          disabled={!isWithdrawable}
                        >
                          {withdrawLoading ? "In Progress..." : "Withdraw"}
                        </Button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </>
      )}
    </Container>
  );
};

export default Sale;
