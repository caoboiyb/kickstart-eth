import React, { Component } from 'react';
import factory from '../ethereum/factory';
import Layout from '../components/Layout/Layout';
import Card from '../components/Card/Card';
import AddButton from '../components/AddButton/AddButton';
import Typography from '@material-ui/core/Typography';

class Home extends Component {
  static async getInitialProps() {
    const campaigns = await factory.methods.getDeployedCampaigns().call();

    return { campaigns };
  }

  renderCampaigns = () => {
    return this.props.campaigns.map((campaign) => (
      <Card key={campaign} address={campaign} />
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
