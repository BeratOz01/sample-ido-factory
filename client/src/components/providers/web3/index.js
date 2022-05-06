import React from "react";

// Metamask Detect Provider
import detectEthereumProvider from "@metamask/detect-provider";

// Web3
import Web3 from "web3";

// Hooks
import { setupHooks } from "./hooks/setupHooks";
import { loadContract } from "utils/loadContract";

const Web3Context = React.createContext(null);

const createWeb3State = ({
  web3,
  provider,
  isLoading,
  payment,
  factory,
  project,
  creator,
}) => {
  return {
    web3,
    provider,
    isLoading,
    payment,
    factory,
    project,
    creator,
    hooks: setupHooks(web3, provider),
  };
};

export default function Web3Provider({ children }) {
  const [web3Api, setWeb3Api] = React.useState(
    createWeb3State({
      web3: null,
      provider: null,
      isLoading: true,
      payment: null,
      factory: null,
      project: null,
      creator: null,
    })
  );

  React.useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();

      if (provider) {
        const web3 = new Web3(provider);
        const payment = await loadContract("PaymentToken", web3);
        const factory = await loadContract("Factory", web3);
        const project = await loadContract("ProjectToken", web3);
        const creator = await loadContract("TokenCreator", web3);
        setWeb3Api(
          createWeb3State({
            web3,
            provider,
            isLoading: false,
            payment,
            factory,
            project,
            creator,
          })
        );
      } else {
        setWeb3Api((api) => ({
          ...api,
          isLoading: false,
        }));
        console.error("Please, install Metamask.");
      }
    };
    loadProvider();
  }, []);

  const _web3Api = React.useMemo(() => {
    const { web3, provider, isLoading } = web3Api;
    return {
      ...web3Api,
      isWeb3Loaded: web3 != null,
      requireInstall: !isLoading && !web3,
      connect: provider
        ? async () => {
            try {
              await provider.request({ method: "eth_requestAccounts" });
            } catch (error) {
              window.location.reload();
            }
          }
        : () => {
            console.error(
              "Can not connect to metamask, try to reload your browser please."
            );
          },
      switchNetwork: provider
        ? async () => {
            try {
              await provider.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: "0xa86a" }],
              });
            } catch (error) {
              window.location.reload();
            }
          }
        : () => {
            console.error("Can not change network");
          },
    };
  }, [web3Api]);

  return (
    <Web3Context.Provider value={_web3Api}>{children}</Web3Context.Provider>
  );
}

export function useWeb3() {
  return React.useContext(Web3Context);
}

export function useHooks(cb) {
  const { hooks } = useWeb3();

  return cb(hooks);
}
