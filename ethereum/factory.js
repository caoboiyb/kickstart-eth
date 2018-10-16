import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  "0xAa6cFf3E41514Dccf6C18ad5355417e17958BE9C"
);

export default instance;
