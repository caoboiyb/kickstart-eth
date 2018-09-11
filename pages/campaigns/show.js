import React, { Component } from 'react';
import { Router, Link } from '../../routes';
import Layout from '../../components/Layout/Layout';
import Campaign from '../../ethereum/campaign';
import web3 from '../../ethereum/web3';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import CircularProgress from '@material-ui/core/CircularProgress';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';

class CampaignShow extends Component {
  static async getInitialProps(props) {
    const campaign = Campaign(props.query.address);

    const summary = await campaign.methods.getSummary().call();

    return {
      address: props.query.address,
      minimumContribution: summary[0],
      balance: summary[1],
      requestsCount: summary[2],
      approversCount: summary[3],
      manager: summary[4],
    };
  }

  state = {
    amount: 0,
    errorMessage: '',
    loading: false,
  };

  handleChange = (event) => {
    this.setState({
      amount: event.target.value,
      errorMessage: '',
    });
  };

  _onSubmit = async () => {
    this.setState({
      loading: true,
      errorMessage: '',
    });

    try {
      const accounts = await web3.eth.getAccounts();
      const campaign = Campaign(this.props.address);
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.amount, 'ether'),
      });
      Router.replaceRoute(`/campaigns/${this.props.address}`);
    } catch (err) {
      this.setState({
        errorMessage: err.message,
        loading: false,
      });
    }

    this.setState({
      loading: false,
      amount: 0,
    });
  };

  render() {
    return (
      <Layout>
        <Typography gutterBottom variant="title">
          Contribute to this campaign
        </Typography>
        <form
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            marginTop: '30px',
          }}
          noValidate
          autoComplete="off"
        >
          <FormControl error={this.state.errorMessage.length > 0} fullWidth>
            <InputLabel>Amount to Contribute</InputLabel>
            <Input
              id="minimum"
              value={this.state.amount}
              onChange={this.handleChange}
              endAdornment={
                <InputAdornment position="end">ether</InputAdornment>
              }
              fullWidth
              required
            />
            <FormHelperText style={{ display: 'block' }}>
              {this.state.errorMessage}
            </FormHelperText>
          </FormControl>
          <Button
            style={{ marginTop: '10px', marginBottom: '20px', width: '150px' }}
            color="primary"
            variant="contained"
            onClick={this._onSubmit}
          >
            {this.state.loading ? (
              <CircularProgress style={{ color: 'white' }} size={20} />
            ) : (
              'Contribute'
            )}
          </Button>
        </form>
        <Typography gutterBottom variant="title">
          Campaign Detail
        </Typography>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          <Card style={{ width: '73%', marginBottom: 20 }}>
            <CardContent>
              <Typography
                style={{ overflowWrap: 'break-word' }}
                variant="title"
              >
                {this.props.manager}
              </Typography>
              <Typography noWrap variant="caption">
                Address of Manager
              </Typography>
              <Typography variant="body1">
                The manager created this campaign and must create request to
                withdraw money
              </Typography>
            </CardContent>
          </Card>
          <Card style={{ width: '35%', marginBottom: 20, marginRight: 20 }}>
            <CardContent>
              <Typography
                style={{ overflowWrap: 'break-word' }}
                variant="title"
              >
                {this.props.minimumContribution}
              </Typography>
              <Typography noWrap variant="caption">
                Minimum Contribution (wei)
              </Typography>
              <Typography variant="body1">
                You must contribute at least this much wei to become an approver
              </Typography>
            </CardContent>
          </Card>
          <Card style={{ width: '35%', marginBottom: 20, marginRight: 20 }}>
            <CardContent>
              <Typography
                style={{ overflowWrap: 'break-word' }}
                variant="title"
              >
                {this.props.requestsCount}
              </Typography>
              <Typography noWrap variant="caption">
                Number of Requests
              </Typography>
              <Typography variant="body1">
                Request tries to withdraw money from contract. Requests must be
                approved by approvers
              </Typography>
            </CardContent>
            <Link route={`/campaigns/${this.props.address}/requests`}>
              <Button
                style={{ marginLeft: 20, marginBottom: 10 }}
                href={`/campaigns/${this.props.address}/requests`}
                size="small"
              >
                View requests
              </Button>
            </Link>
          </Card>
          <Card style={{ width: '35%', marginBottom: 20, marginRight: 20 }}>
            <CardContent>
              <Typography
                style={{ overflowWrap: 'break-word' }}
                variant="title"
              >
                {this.props.approversCount}
              </Typography>
              <Typography noWrap variant="caption">
                Number of Apporvers
              </Typography>
              <Typography variant="body1">
                Number of people who have already donated to this campaign
              </Typography>
            </CardContent>
          </Card>
          <Card style={{ width: '35%', marginBottom: 20, marginRight: 20 }}>
            <CardContent>
              <Typography
                style={{ overflowWrap: 'break-word' }}
                variant="title"
              >
                {web3.utils.fromWei(this.props.balance, 'ether')} ETH
              </Typography>
              <Typography noWrap variant="caption">
                Campaign Balance
              </Typography>
              <Typography variant="body1">
                The balance is how much money this campaign has left
              </Typography>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }
}

export default CampaignShow;
