import React from "react";

// CSS
import styles from "./style.module.css";

// Bootstrap
import { Container, Row, Col, Table, Button } from "react-bootstrap";

// Hooks
import { useWeb3 } from "components/providers";

// Spinner
import { Grid } from "react-loader-spinner";

const SaleCard = ({ index }) => {
  const { web3, factory } = useWeb3();
  const [contract, setContract] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [sale, setSale] = React.useState(null);

  const url = `https://picsum.photos/id/${index}/300/300`;

  React.useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      await factory.methods
        .getSale(index)
        .call()
        .then((r) => {
          setSale(r);
        })
        .finally(() => setIsLoading(false));
    }

    if (web3 && factory) fetchData();

    return () => setIsLoading(false);
  }, [web3, factory, index]);

  return (
    <Container fluid className={`d-flex w-75 mx-auto ${styles.card}`}>
      <Row className="w-100">
        <Col
          md="4"
          className="d-flex justify-content-center align-items-center"
          style={{ overflow: "hidden" }}
        >
          <img src={url} alt="product" loading="lazy" />
        </Col>
        <Col md="8" className="d-flex">
          {isLoading ? (
            <Grid
              height="150"
              width="100"
              color="#ffc107"
              ariaLabel="loading"
              wrapperClass="m-auto"
            />
          ) : (
            <>
              {sale && (
                <div className="d-flex flex-column w-100 justify-content-center">
                  <Table responsive className="w-75 m-auto poppins">
                    <tbody>
                      <tr>
                        <td>Sale Name</td>
                        <td>{sale.name}</td>
                      </tr>
                      <tr>
                        <td>Sale ID</td>
                        <td>{sale.id}</td>
                      </tr>
                      <tr>
                        <td>Number Of Portion</td>
                        <td>{sale.numberOfPortions}</td>
                      </tr>
                      <tr>
                        <td>Price</td>
                        <td>
                          {web3.utils.fromWei(sale.price, "ether")} Per Project
                          Token
                        </td>
                      </tr>
                      <tr>
                        <td>Project Token</td>
                        <td>
                          <a
                            href={`https://testnet.snowtrace.io/address/${sale.projectToken}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Token
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                  <Button
                    variant="success"
                    className="poppins text-center w-50 mx-auto mt-2 shadow-none"
                    onClick={() => {}}
                  >
                    Go Sale!
                  </Button>
                </div>
              )}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default SaleCard;
