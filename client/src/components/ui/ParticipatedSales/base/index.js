import React from "react";

// CSS
import styles from "./style.module.css";

// Hooks
import { useWeb3 } from "components/providers";
import { useAccount } from "components/hooks/web3";

// Components
import { Loading } from "components/ui/Loading";

// Bootstrap
import { Accordion, Card, Table } from "react-bootstrap";

// web3uikit
import { Typography, Widget } from "web3uikit";

// Progress bar
import ProgressBar from "@ramonak/react-progress-bar";

const ParticipatedSales = () => {
  const { account } = useAccount();
  const { web3, portfolio } = useWeb3();

  const [isLoading, setIsLoading] = React.useState(true);
  const [sales, setSales] = React.useState();

  React.useEffect(() => {
    async function fetchData() {
      const s = await portfolio.methods
        .getMyPortfolio()
        .call({ from: account?.data })
        .finally(() => setIsLoading(false));
      setSales(s);
    }
    if (web3 && account?.data && portfolio) fetchData();
  }, [web3, account?.data, portfolio]);

  return (
    <Accordion defaultActiveKey="0">
      <Accordion.Item className={`${styles.accordion_item} shadow-none my-5`}>
        <Accordion.Header className="poppins border-0">
          Participated Sales
        </Accordion.Header>
        <Accordion.Body>
          {isLoading ? (
            <Loading />
          ) : (
            <div className="d-flex flex-column gap-4">
              {sales?.length > 0 ? (
                sales.map((elem) => (
                  <Card key={elem.saleId} className="shadow-none">
                    <Card.Header className="d-flex border-0 justify-content-center gap-4 align-items-end mt-2">
                      <p className="mb-0 poppins fs-4 mb-auto">
                        {elem.saleName}
                      </p>
                      <Typography
                        className="mb-0 poppins fs-6 mb-auto"
                        variant="caption12"
                      >
                        #{elem.saleId}
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
                            info={web3.utils.fromWei(
                              elem.vestedAmount,
                              "ether"
                            )}
                            title="Vested Amount In Project Token"
                          />
                          <Widget
                            info={web3.utils.fromWei(
                              elem.withdrawnAmount,
                              "ether"
                            )}
                            title="Withdrawn Amount In Project Token"
                          />
                        </section>
                        <section style={{ display: "flex", gap: "20px" }}>
                          <Widget
                            info={String(elem.tokenAddress)
                              .slice(0, 6)
                              .concat("....")}
                            title="Project Token Address"
                          >
                            <img
                              src="https://snowtrace.io/images/svg/brands/main.svg?v=22.5.1.0"
                              alt="snowtrace_logo"
                              width={20}
                              height={20}
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                window.open(
                                  `https://testnet.snowtrace.io/token/${elem.tokenAddress}`,
                                  "_blank"
                                )
                              }
                            />
                          </Widget>
                          <Widget
                            info={String(elem.saleAddress)
                              .slice(0, 6)
                              .concat("....")}
                            title="Sale Address"
                          >
                            <img
                              src="https://www.svgrepo.com/show/101168/go-back-arrow.svg"
                              alt="go_sale"
                              width={20}
                              height={20}
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                window.open(`/sale/${elem.saleAddress}`)
                              }
                            />
                            <img
                              src="https://snowtrace.io/images/svg/brands/main.svg?v=22.5.1.0"
                              alt="snowtrace_logo"
                              width={20}
                              height={20}
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                window.open(
                                  `https://testnet.snowtrace.io/token/${elem.tokenAddress}`,
                                  "_blank"
                                )
                              }
                            />
                          </Widget>
                          <Widget
                            info={web3.utils.fromWei(elem.price, "ether")}
                            title="Price"
                          />
                        </section>
                        <section style={{ display: "flex", gap: "20px" }}>
                          <Widget title="Distribution Dates">
                            <Table borderless className="mx-auto">
                              <tbody>
                                {elem.distributionDates.map((date, idx) => (
                                  <tr key={date}>
                                    <td>{idx + 1}.</td>
                                    <td>
                                      {new Date(date * 1000).toLocaleString()}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </Table>
                          </Widget>
                          <Widget
                            info={elem.isFinished ? "Finished" : "Waiting"}
                            title="Status"
                          />
                        </section>
                      </div>
                      <div className="d-flex mt-2">
                        <div className="w-50 mx-auto">
                          <p className="poppins fs-5 mt-2 mb-1">Progress</p>
                          <ProgressBar
                            completed={
                              100 *
                              (elem.isPortionWithdrawn.filter((x) => x === true)
                                .length /
                                elem.isPortionWithdrawn.length)
                            }
                            labelColor={"black"}
                          />
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                ))
              ) : (
                <p className="poppins text-center w-75 fs-6 mx-auto my-2">
                  Can not find any participated sales for this address.{" "}
                  <a href="/">Go</a> and participate some!
                </p>
              )}
            </div>
          )}
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

export default ParticipatedSales;

/**
 * [
    [
        "0",
        "Berat_Sale",
        "0x8689C598Bb39a092a244bD95a47c8A258C5B14c2",
        "1000000000000000000",
        "11",
        "10000000",
        "0x53468fD17b3d8b5D1F7B527647b5104d93A2bD5d"
    ]
]
 */
