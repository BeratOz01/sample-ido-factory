export const loadContract = async (name, web3) => {
  let contract = null;

  try {
    const res = await fetch(`/contracts/${name}.json`);
    const Artifact = await res.json();

    let networkId = 43113; // FUJI Testnet
    // let networkId = 1337; // Ganache-cli

    contract = new web3.eth.Contract(
      Artifact.abi,
      Artifact.networks[networkId].address
    );
    console.log(`Contract ${name} successfully loaded.`);
  } catch (e) {
    console.log(`Contract ${name} not found`);
    console.log(e);
  }

  return contract;
};

export const loadContractWithAddress = async (name, address, web3) => {
  let contract = null;

  try {
    const res = await fetch(`/contracts/${name}.json`);
    const Artifact = await res.json();

    contract = new web3.eth.Contract(Artifact.abi, address);
    console.log(
      `Contract ${name} successfully loaded from address ${address}.`
    );
  } catch (e) {
    console.log(`Contract ${name} not found`);
  }

  return contract;
};
