import React, { Component } from 'react';
import moment from 'moment';
import Layout from '../../components/Layout/Layout';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import CircularProgress from '@material-ui/core/CircularProgress';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';
import { TextField } from '@material-ui/core';

class CampaignNew extends Component {
  state = {
    name: '',
    minimumContribution: 0,
    goal: 0,
    date: '',
    errorMessage: '',
    loading: false,
  };

  handleChangeName = (event) => {
    this.setState({
      name: event.target.value,
      errorMessage: '',
    });
  };

  handleChangeMin = (event) => {
    this.setState({
      minimumContribution: event.target.value,
      errorMessage: '',
    });
  };

  handleChangeGoal = (event) => {
    this.setState({
      goal: event.target.value,
      errorMessage: '',
    });
  };

  handleChangeDate = (event) => {
    this.setState({
      date: event.target.value,
      errorMessage: '',
    });
  };

  _onSubmit = async () => {
    this.setState({
      loading: true,
      errorMessage: '',
    });

    if (
      Math.round(
        (moment(this.state.date).valueOf() - moment().valueOf()) * 0.001,
      ) < 0
    ) {
      this.setState({
        errorMessage: 'Cannot create campaign in the past!!',
        loading: false,
      });
    } else {
      try {
        const accounts = await web3.eth.getAccounts();
        await factory.methods
          .createCampaign(
            web3.utils.toWei(this.state.goal, 'ether'),
            this.state.name,
            Math.round(
              (moment(this.state.date).valueOf() - moment().valueOf()) * 0.001,
            ),
            this.state.minimumContribution,
          )
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
            <TextField
              id="name"
              label="Name"
              style={{ margin: 8 }}
              placeholder="Name of the campaign"
              value={this.state.name}
              onChange={this.handleChangeName}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              id="goal"
              label="Goal (ETH)"
              style={{ margin: 8 }}
              placeholder="ETH"
              value={this.state.goal}
              onChange={this.handleChangeGoal}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              id="minimum"
              label="Minimum Contribution (Wei)"
              style={{ margin: 8 }}
              placeholder="Wei"
              value={this.state.minimumContribution}
              onChange={this.handleChangeMin}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              id="date"
              label="Estimated time"
              type="date"
              style={{ margin: 8 }}
              margin="normal"
              fullWidth
              onChange={this.handleChangeDate}
              value={this.state.date}
              InputLabelProps={{
                shrink: true,
              }}
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
            disabled={this.state.loading}
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
