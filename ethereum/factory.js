import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  '0x5e3F0b6752eC6cF65d68b513b96b0ca38D8899F3',
);

export default instance;
