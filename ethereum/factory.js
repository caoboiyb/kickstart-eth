import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  '0xDD1A9157f253A7FbCB5AADBFDbA9744C2F0CbD75',
);

export default instance;
