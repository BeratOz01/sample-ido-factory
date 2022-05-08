import React from "react";

// Bootstrap
import { Accordion, Button, Card } from "react-bootstrap";

// Styles
import styles from "./style.module.css";

// Hooks
import { useWeb3 } from "components/providers";
import { useAccount } from "components/hooks/web3";

// Components
import { Loading } from "components/ui/Loading";

// web3uikit
import { Typography, Widget } from "web3uikit";

const MySales = () => {
  const { web3, factory } = useWeb3();
  const { account } = useAccount();

  const [sales, setSales] = React.useState();
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchData() {
      const s = await factory.methods
        .getMySales()
        .call({ from: account?.data })
        .finally(() => setIsLoading(false));
      console.log(s);
      setSales(s);
    }
    if (web3 && account?.data && factory) fetchData();
  }, [web3, account?.data, factory]);

  return (
    <Accordion defaultActiveKey="0">
      <Accordion.Item className={`${styles.accordion_item} shadow-none my-5`}>
        <Accordion.Header className="poppins border-0">
          My Sales
        </Accordion.Header>

        <Accordion.Body>
          {isLoading ? (
            <Loading />
          ) : (
            <div className="d-flex flex-column gap-4">
              {sales?.length > 0 ? (
                sales.map((elem) => (
                  <Card key={elem.saleAddress}>
                    <Card.Header className="d-flex border-0 justify-content-center gap-4 align-items-end mt-2">
                      <p className="mb-0 poppins fs-4 mb-auto">{elem.name}</p>
                      <Typography
                        className="mb-0 poppins fs-6 mb-auto"
                        variant="caption12"
                      >
                        #{elem.id}
                      </Typography>
                    </Card.Header>
                    <Card.Body>
                      <div
                        style={{
                          display: "grid",
                          gap: "20px",
                        }}
                      >
                        <section style={{ display: "flex", gap: "20px" }}>
                          <Widget
                            info={elem.saleAddress.slice(0, 6).concat("...")}
                            title="Sale Address"
                          >
                            <img
                              src="https://snowtrace.io/images/svg/brands/main.svg?v=22.5.1.0"
                              alt="snowtrace_logo"
                              width={20}
                              height={20}
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                window.open(
                                  `https://testnet.snowtrace.io/token/${elem.saleAddress}`,
                                  "_blank"
                                )
                              }
                            />
                          </Widget>
                          <Widget
                            info={elem.projectToken.slice(0, 6).concat("...")}
                            title="Token Address"
                          >
                            <img
                              src="https://snowtrace.io/images/svg/brands/main.svg?v=22.5.1.0"
                              alt="snowtrace_logo"
                              width={20}
                              height={20}
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                window.open(
                                  `https://testnet.snowtrace.io/token/${elem.projectToken}`,
                                  "_blank"
                                )
                              }
                            />
                          </Widget>
                        </section>
                        <section style={{ display: "flex", gap: "20px" }}>
                          <Widget
                            info={elem.numberOfPortions}
                            title="Number Of Portions"
                          />
                          <Widget
                            info={elem.timeBetweenPortions}
                            title="Time Between Portions"
                          />
                          <Widget
                            info={web3.utils
                              .fromWei(elem.price, "ether")
                              .concat(" PTK")}
                            title="Price"
                          />
                        </section>
                      </div>
                      <div className="d-flex w-100">
                        <Button
                          variant="success poppins mt-4 mb-2 mx-auto shadow-none"
                          onClick={() =>
                            window.open(`/sale/${elem.saleAddress}`)
                          }
                        >
                          Go Sale
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                ))
              ) : (
                <p className="poppins text-center w-75 fs-6 mx-auto my-2">
                  Can not find any sales for this address.{" "}
                  <a href="/create">Go</a> and create one!
                </p>
              )}
            </div>
          )}
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

export default MySales;
