import React, { Component } from 'react';
import Layout from '../../components/Layout/Layout';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import CircularProgress from '@material-ui/core/CircularProgress';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';

class CampaignNew extends Component {
  state = {
    minimumContribution: 0,
    errorMessage: '',
    loading: false,
  };

  handleChange = (event) => {
    this.setState({
      minimumContribution: event.target.value,
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
      await factory.methods
        .createCampaign(this.state.minimumContribution)
        .send({
          from: accounts[0],
        });
      Router.pushRoute('/');
    } catch (err) {
      this.setState({
        errorMessage: err.message,
        loading: false,
      });
    }
  };

  render() {
    return (
      <Layout>
        <Typography gutterBottom variant="title">
          Create Campaign
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
            <InputLabel>Minimum Contribution</InputLabel>
            <Input
              id="minimum"
              value={this.state.minimumContribution}
              onChange={this.handleChange}
              endAdornment={<InputAdornment position="end">Wei</InputAdornment>}
              fullWidth
              required
            />
            <FormHelperText style={{ display: 'block' }}>
              {this.state.errorMessage}
            </FormHelperText>
          </FormControl>
          <Button
            style={{ marginTop: '20px', width: '180px' }}
            color="primary"
            variant="contained"
            onClick={this._onSubmit}
          >
            {this.state.loading ? (
              <CircularProgress style={{ color: 'white' }} size={20} />
            ) : (
              'Create Campaign'
            )}
          </Button>
        </form>
      </Layout>
    );
  }
}

export default CampaignNew;
