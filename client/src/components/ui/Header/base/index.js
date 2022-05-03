import React from "react";

// CSS
import { Navbar, Container, Nav, Spinner, NavDropdown } from "react-bootstrap";

// Hooks
import { useAccount } from "components/hooks/web3";
import { useWeb3 } from "components/providers";

const Header = () => {
  const { account } = useAccount();
  const { connect } = useWeb3();

  const [isLoading, setIsLoading] = React.useState(false);

  const onClickConnect = () => {
    setIsLoading(true);
    connect().finally(() => setIsLoading(false));
  };

  return (
    <Navbar bg="dark" expand="lg" className="py-2 d-flex">
      <Container>
        <Navbar.Brand className="text-light poppins">
          Public Launchpad
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          className="shadow-none"
          color="light"
          style={{ color: "gray", borderWidth: 0 }}
        />

        <Navbar.Collapse className="justify-content-end gap-2">
          {account?.data ? (
            <>
              <Nav.Item
                className="text-light poppins bg-warning py-2 px-3 rounded-pill mt-2"
                style={{ cursor: "pointer" }}
              >
                Create Your IDO
              </Nav.Item>
              <Nav.Item
                className="text-light poppins bg-warning py-2 px-3 rounded-pill mt-2"
                style={{ cursor: "pointer" }}
              >
                My Portfolio
              </Nav.Item>
              <Nav.Item
                className="text-light poppins bg-warning py-2 px-3 rounded-pill mt-2"
                style={{ cursor: "pointer" }}
              >
                Connected as {account?.data.slice(0, 6)}...
              </Nav.Item>
            </>
          ) : (
            <Nav.Item
              className="text-light poppins bg-warning py-2 px-3 rounded-pill mt-2"
              style={{ cursor: "pointer" }}
              onClick={() => onClickConnect()}
            >
              {isLoading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "Connect to Metamask"
              )}
            </Nav.Item>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;

/**
 * <div>
      <p>Header</p>
      {account.data != undefined ? (
        <p>{account.data}</p>
      ) : (
        <p onClick={() => connect()}>Please connect</p>
      )}
    </div>
 */
