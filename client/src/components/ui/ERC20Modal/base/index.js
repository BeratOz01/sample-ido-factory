import React from "react";

// Bootstrap
import { Modal, Form, Button, Spinner } from "react-bootstrap";

// Hooks
import { useWeb3 } from "components/providers";
import { useAccount } from "components/hooks/web3";
import { Loading } from "components/ui/Loading";

const ERC20Modal = ({ show, onHide }) => {
  const { web3, creator } = useWeb3();
  const { account } = useAccount();

  const [erc20s, setERC20s] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);

  const [progress, setProgress] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [isCreated, setIsCreated] = React.useState(false);

  // ERC20 Instances
  const [name, setName] = React.useState("");
  const [symbol, setSymbol] = React.useState("");
  const [totalSupply, setTotalSupply] = React.useState(0);

  const [cooldown, setCooldown] = React.useState(0);

  // On Click Create
  const onClickCreate = async () => {
    setProgress(true);
    await creator.methods
      .createToken(name.toString(), symbol.toString(), totalSupply.toString())
      .send({ from: account?.data })
      .catch((e) => setError(true))
      .then(() => setIsCreated(true))

      .finally(() => setProgress(false));
  };

  React.useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      let arr = await creator.methods
        .getMyTokens()
        .call({ from: account?.data });
      setERC20s(arr);

      let c = await creator.methods
        .getMyCooldown()
        .call({ from: account?.data });

      setCooldown(c);

      setIsLoading(false);
    }
    if (web3 && account?.data && show === true) fetchData();
  }, [web3, account?.data, creator, show]);

  return (
    <Modal
      show={show}
      centered
      onHide={() => {
        onHide();
        window.location.reload();
      }}
    >
      <Modal.Body>
        {isLoading ? (
          <Loading padding={0}></Loading>
        ) : (
          <>
            <p className="poppins text-center fs-5">ERC20 Token Generator</p>
            <p className="poppins text-center">
              Currently have {erc20s?.length} created ERC20s.{" "}
              <a href="/portfolio"> For details</a>
            </p>

            <Form.Group className="mb-3 d-flex flex-column">
              <Form.Label className="text-center poppins mx-auto">
                Name Of Token
              </Form.Label>
              <Form.Control
                className="text-center poppins shadow-none"
                type="text"
                placeholder="Name Of Token"
                onChange={(e) => {
                  setName(e.target?.value);
                  setError(false);
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3 d-flex flex-column">
              <Form.Label className="text-center poppins mx-auto">
                Symbol Of Token
              </Form.Label>
              <Form.Control
                className="text-center poppins shadow-none"
                type="text"
                placeholder="Symbol Of Token"
                onChange={(e) => {
                  setSymbol(e.target?.value);
                  setError(false);
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3 d-flex flex-column">
              <Form.Label className="text-center poppins mx-auto">
                Total Supply (eth)
              </Form.Label>
              <Form.Control
                className="text-center poppins shadow-none"
                type="number"
                placeholder="Total Supply (eth)"
                onChange={(e) => {
                  setTotalSupply(e.target?.value);
                  setError(false);
                }}
              />
            </Form.Group>

            <div className="d-flex justify-content-center align-items-center">
              {erc20s?.length === 5 ? (
                <Button className="text-center poppins" variant="danger">
                  Already reached max amount
                </Button>
              ) : (
                <Button
                  className="text-center poppins"
                  variant="success"
                  disabled={name === "" || symbol === "" || totalSupply === 0}
                  onClick={() => {
                    if (!isCreated) onClickCreate();
                  }}
                >
                  {progress && !error ? (
                    <Spinner animation="grow" className="m-auto m-0" />
                  ) : !progress && error ? (
                    "An error occurred"
                  ) : isCreated ? (
                    "Successfully created"
                  ) : (
                    "Create"
                  )}
                </Button>
              )}
            </div>

            {cooldown === "0" ? (
              <p className="w-75 text-center poppins mx-auto mt-3 mb-0 text-danger">
                You can create ERC20 Token every 10 minutes and 5 in total.
              </p>
            ) : (
              <p className="w-75 text-center poppins mx-auto mt-3 mb-0">
                Need to wait {cooldown} seconds for create token
              </p>
            )}
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ERC20Modal;
