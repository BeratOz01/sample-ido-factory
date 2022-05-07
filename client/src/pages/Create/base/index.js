import React from "react";

// CSS
import styles from "./style.module.css";

// Bootstrap
import { Container, Form, Button, Spinner } from "react-bootstrap";

// Hooks
import { useWeb3 } from "components/providers";
import { useAccount } from "components/hooks/web3";

// Loading Modal
import { LoadingModal, ERC20Modal } from "components/ui";

const Create = () => {
  const { factory, project, creator, web3 } = useWeb3();
  const { account } = useAccount();

  const [name, setName] = React.useState("");
  const [numberOfPortion, setNumberOfPortion] = React.useState(0);
  const [price, setPrice] = React.useState(0);
  const [timeBetweenPortions, setTimeBetweenPortions] = React.useState(0);
  const [projectToken, setProjectToken] = React.useState("");
  const [isSample, setIsSample] = React.useState(false);

  const [isLoading, setIsLoading] = React.useState(false);
  const [show, setShow] = React.useState(false);
  const [error, setError] = React.useState(false);

  const [showERC20Modal, setShowERC20Modal] = React.useState(false);
  const [createdTokens, setCreatedTokens] = React.useState();
  const [isCreatedToken, setIsCreatedToken] = React.useState("");

  const [isLoadingTokens, setIsLoadingTokens] = React.useState(true);

  const onHideERC20Modal = () => setShowERC20Modal(false);

  const onHide = () => setShow(false);

  const onClickCreate = async () => {
    var add = "";
    if (isCreatedToken.length !== 0) add = isCreatedToken;
    else add = projectToken;

    setIsLoading(true);
    setShow(true);
    await factory.methods
      .createSale(
        name,
        numberOfPortion,
        timeBetweenPortions,
        price.toString(),
        add
      )
      .send({
        from: account?.data,
      })
      .then(() => {
        setIsLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
        setError(true);
      });
  };

  React.useEffect(() => {
    async function fetchData() {
      let tokens = await creator.methods
        .getMyTokens()
        .call({ from: account?.data });

      setCreatedTokens(tokens);
      setIsLoadingTokens(false);
    }
    if (web3 && account?.data && creator) fetchData();
  }, [web3, account?.data, creator]);

  return (
    <Container className="d-flex flex-column">
      <LoadingModal
        show={show}
        loading={isLoading}
        onHide={onHide}
        error={error}
        content="You can checkout your sale from your portfolio and do not forget to send project token to your sale contract from your portfolio. Otherwise contract will throw error."
      />
      <ERC20Modal show={showERC20Modal} onHide={onHideERC20Modal} />
      <p className="text-center poppins fs-3 mt-5">Create Your Own IDO</p>
      <p className="text-center poppins fs-5 mt-3 w-75 mx-auto">
        You can also create your own IDO with your own token. Fundraise your
        project in decentralized way. And keep track of your IDO from Portfolio
        Page.
      </p>

      <Form className="w-75 mx-auto mt-5">
        <Form.Group className="mb-3 d-flex flex-column">
          <Form.Label className="text-center poppins mx-auto fs-5">
            Sale Name
          </Form.Label>
          <Form.Control
            as={"input"}
            className="text-center poppins shadow-none"
            type="text"
            placeholder="Sale Name"
            onChange={(e) => setName(e.target?.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3 d-flex flex-column">
          <Form.Label className="text-center poppins mx-auto fs-5">
            Number Of Portion
          </Form.Label>
          <Form.Control
            className="text-center poppins shadow-none"
            type="number"
            placeholder="Number Of Portion"
            onChange={(e) => setNumberOfPortion(e.target?.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3 d-flex flex-column">
          <Form.Label className="text-center poppins mx-auto fs-5">
            Time Between Portions (ms)
          </Form.Label>
          <Form.Control
            className="text-center poppins shadow-none"
            type="number"
            placeholder="Time Between Portions (ms)"
            onChange={(e) => setTimeBetweenPortions(e.target?.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3 d-flex flex-column">
          <Form.Label className="text-center poppins mx-auto fs-5">
            Price of Token in Payment Token (wei)
          </Form.Label>
          <Form.Control
            className="text-center poppins shadow-none"
            type="number"
            placeholder="Price (wei)"
            onChange={(e) => setPrice(e.target?.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3 d-flex flex-column">
          <Form.Label className="text-center poppins mx-auto fs-5">
            Project Token
          </Form.Label>
          <Form.Control
            className="text-center poppins shadow-none"
            type="text"
            placeholder="Project Token"
            disabled={isSample || isCreatedToken}
            onChange={(e) => setProjectToken(e.target?.value)}
          />
        </Form.Group>

        {createdTokens?.length !== 0 && (
          <Form.Group className="mb-3 d-flex flex-column">
            <Form.Label className="text-center poppins mx-auto fs-5">
              Or Select From Created Tokens
            </Form.Label>
            <Form.Select
              className="shadow-none poppins"
              onChange={(e) => {
                setIsCreatedToken(e.target?.value);
              }}
            >
              <option value={""}></option>
              {createdTokens?.map((elem) => (
                <option value={elem[3]} className="text-center" key={elem[3]}>
                  Name: {elem[0]} ------- TotalSupply: {elem[2]}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        )}

        <p className="text-center poppins">
          !! You can also use sample project token for progress. !!
        </p>
        <div className="d-flex flex-row justify-content-center gap-4">
          <Button
            className="text-center poppins shadow-none"
            variant={isSample ? "success" : "danger"}
            onClick={() => {
              setIsSample(!isSample);
              setProjectToken(project?._address);
            }}
            disabled={isCreatedToken}
          >
            Use Sample Project Token
          </Button>

          {isLoadingTokens ? (
            <Spinner animation="border" variant="primary" />
          ) : (
            <>
              {isSample ? (
                <p className="poppins my-auto">
                  Now using project{" "}
                  <a
                    href={`https://testnet.snowtrace.io/address/${project?._address}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    token
                  </a>
                </p>
              ) : (
                <Button
                  className="text-center poppins shadow-none"
                  variant={"outline-dark"}
                  onClick={() => setShowERC20Modal(true)}
                >
                  Or Create New ERC20 Token
                </Button>
              )}
            </>
          )}
        </div>

        <div className="d-flex my-3">
          <Button
            size="lg"
            className="text-center poppins mx-auto shadow-none"
            variant={"outline-primary"}
            onClick={onClickCreate}
            disabled={
              name === "" ||
              numberOfPortion === 0 ||
              price === 0 ||
              timeBetweenPortions === 0
            }
          >
            Create IDO
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default Create;
