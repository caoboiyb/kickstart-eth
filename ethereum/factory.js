import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  "0xC6e8fA1980A9aeA4C0E168364Ca4bbb1b36AE05b"
);

export default instance;
