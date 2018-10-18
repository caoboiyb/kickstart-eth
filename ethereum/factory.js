import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  '0x1fd80204ffa3cef9eb74ba7c9efbf464ffecf583',
);

export default instance;
