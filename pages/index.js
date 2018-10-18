import React, { Component } from 'react';
import factory from '../ethereum/factory';
import Campaign from '../ethereum/campaign';
import Layout from '../components/Layout/Layout';
import Card from '../components/Card/Card';
import AddButton from '../components/AddButton/AddButton';
import Typography from '@material-ui/core/Typography';

class Home extends Component {
  static async getInitialProps() {
    let name = [];
    const campaigns = await factory.methods.getAllCampaigns().call();
    console.log(campaigns);
    for (let i = 0; i < campaigns.length; i++) {
      const campaign = Campaign(campaigns[i]);
      const tempName = await campaign.methods.name().call();
      name.push(tempName);
    }
    return { campaigns, name };
  }

  renderCampaigns = () => {
    return this.props.campaigns.map((campaign, index) => (
      <Card name={this.props.name[index]} key={campaign} address={campaign} />
    ));
  };

  render() {
    return (
      <Layout>
        <div>
          <Typography variant="subheading" gutterBottom>
            Open Campaigns
          </Typography>
          <AddButton />

          {this.renderCampaigns()}
        </div>
      </Layout>
    );
  }
}

export default Home;
