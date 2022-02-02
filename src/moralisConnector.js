import Moralis from "moralis/node";

export const moralisData = {
  serverUrl: process.env.REACT_APP_SERVER_URL,
  appId: process.env.REACT_APP_APP_ID,
};

export async function moralisStartAndGetNFTs(authorization) {
  let serverUrl = moralisData.serverUrl;
  let appId = moralisData.appId;
  Moralis.start({ serverUrl, appId });
  const NFTs = await Moralis.Web3API.account.getNFTs({
    chain: "polygon",
    address: authorization,
  });
  return NFTs;
}

const moralisConnector = {
  moralisData,
  moralisStartAndGetNFTs,
};

export default moralisConnector;
