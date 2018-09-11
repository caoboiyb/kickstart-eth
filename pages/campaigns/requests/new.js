import React, { Component } from 'react';
import Layout from '../../../components/Layout/Layout';
import {
  Typography,
  Button,
  Input,
  InputLabel,
  FormControl,
  FormGroup,
  CircularProgress,
} from '@material-ui/core';
import Campaign from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';
import { Router, Link } from '../../../routes';

class RequestNew extends Component {
  static getInitialProps(props) {
    const { address } = props.query;

    return {
      address,
    };
  }

  state = {
    description: '',
    amount: '',
    address: '',
    loading: false,
  };

  _onSubmit = async () => {
    this.setState({
      loading: true,
    });

    const campaign = Campaign(this.props.address);
    const { description, amount, address } = this.state;
    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .createRequest(description, web3.utils.toWei(amount, 'ether'), address)
        .send({ from: accounts[0] });
      Router.pushRoute(`/campaigns/${this.props.address}/requests`);
    } catch (err) {
      alert(err.message);
    }

    this.setState({
      loading: false,
    });
  };

  render() {
    return (
      <Layout>
        <Link route={`/campaigns/${this.props.address}/requests`}>
          <Button color="primary">Back</Button>
        </Link>
        <Typography style={{ marginTop: 20 }} variant="title">
          Create a Request
        </Typography>
        <FormGroup>
          <FormControl style={{ marginTop: 10 }} fullWidth>
            <InputLabel>Description</InputLabel>
            <Input
              id="des"
              value={this.state.description}
              onChange={(event) =>
                this.setState({ description: event.target.value })
              }
            />
          </FormControl>
          <FormControl style={{ marginTop: 10 }} fullWidth>
            <InputLabel>Amount in Ether</InputLabel>
            <Input
              id="amount"
              value={this.state.amount}
              onChange={(event) =>
                this.setState({ amount: event.target.value })
              }
            />
          </FormControl>
          <FormControl style={{ marginTop: 10 }} fullWidth>
            <InputLabel>Recipient</InputLabel>
            <Input
              id="addr"
              value={this.state.address}
              onChange={(event) =>
                this.setState({ address: event.target.value })
              }
            />
          </FormControl>
          <Button
            style={{ marginTop: '20px', width: '120px' }}
            color="primary"
            variant="contained"
            onClick={this._onSubmit}
          >
            {this.state.loading ? (
              <CircularProgress style={{ color: 'white' }} size={20} />
            ) : (
              'Create'
            )}
          </Button>
        </FormGroup>
      </Layout>
    );
  }
}

export default RequestNew;
