import React, { Component } from 'react';
import Layout from '../../../components/Layout/Layout';
import {
  Button,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@material-ui/core';
import { Link, Router } from '../../../routes';
import Campaign from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';

class Request extends Component {
  static async getInitialProps(props) {
    const { address } = props.query;
    const campaign = Campaign(address);
    const requestCount = await campaign.methods.getRequestsCount().call();
    const approversCount = await campaign.methods.approversCount().call();
    const requests = await Promise.all(
      Array(parseInt(requestCount))
        .fill()
        .map((element, index) => {
          return campaign.methods.requests(index).call();
        }),
    );

    console.log(requests);

    return {
      address,
      requests,
      requestCount,
      approversCount,
    };
  }

  onApprove = async () => {
    try {
      const accounts = await web3.eth.getAccounts();
      const campaign = Campaign(this.props.address);
      await campaign.methods.approveRequest().send({ from: accounts[0] });
      Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
    } catch (err) {
      alert(err.message);
    }
  };

  onFinalize = async () => {
    try {
      const accounts = await web3.eth.getAccounts();
      const campaign = Campaign(this.props.address);
      await campaign.methods.withdrawRequest().send({ from: accounts[0] });
      Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
    } catch (err) {
      alert(err.message);
    }
  };

  onCancel = async () => {
    try {
      const accounts = await web3.eth.getAccounts();
      const campaign = Campaign(this.props.address);
      await campaign.methods.cancelRequest().send({ from: accounts[0] });
      Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
    } catch (err) {
      alert(err.message);
    }
  };

  render() {
    return (
      <Layout>
        <Link route={`/campaigns/${this.props.address}/requests/new`}>
          <Button
            style={{ float: 'right' }}
            color="primary"
            variant="contained"
            href={`/campaigns/${this.props.address}/requests/new`}
          >
            Create Request
          </Button>
        </Link>
        <Typography style={{ marginTop: 20 }} variant="title">
          Requests
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="none">ID</TableCell>
              <TableCell padding="none">Description</TableCell>
              <TableCell padding="none">Amount</TableCell>
              <TableCell padding="none">Recipient</TableCell>
              <TableCell padding="none">Approvers Count</TableCell>
              <TableCell>Approve</TableCell>
              <TableCell>Finalize</TableCell>
              <TableCell>Cancel</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.props.requests.map((request, index) => (
              <TableRow>
                <TableCell padding="none">
                  <Typography
                    color={request.done ? 'textSecondary' : 'textPrimary'}
                  >
                    {index}
                  </Typography>
                </TableCell>
                <TableCell padding="none">
                  <Typography
                    color={request.done ? 'textSecondary' : 'textPrimary'}
                  >
                    {request.description}
                  </Typography>
                </TableCell>
                <TableCell padding="none">
                  <Typography
                    color={request.done ? 'textSecondary' : 'textPrimary'}
                  >
                    {web3.utils.fromWei(request.value, 'ether')}
                  </Typography>
                </TableCell>
                <TableCell padding="none">
                  <Typography
                    color={request.done ? 'textSecondary' : 'textPrimary'}
                  >
                    {request.recipient}
                  </Typography>
                </TableCell>
                <TableCell padding="none">
                  <Typography
                    color={request.done ? 'textSecondary' : 'textPrimary'}
                  >{`${request.approvalCount}/${
                    this.props.approversCount
                  }`}</Typography>
                </TableCell>
                <TableCell padding="none">
                  {request.complete ? null : (
                    <Button
                      disabled={request.done}
                      color="primary"
                      onClick={() => this.onApprove()}
                    >
                      Approve
                    </Button>
                  )}
                </TableCell>
                <TableCell padding="none">
                  {request.complete ? null : (
                    <Button
                      disabled={request.done}
                      color="secondary"
                      onClick={() => this.onFinalize()}
                    >
                      Finalize
                    </Button>
                  )}
                </TableCell>
                <TableCell padding="none">
                  {request.complete ? null : (
                    <Button
                      disabled={request.done}
                      variant="contained"
                      color="secondary"
                      onClick={() => this.onCancel()}
                    >
                      Cancel
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Layout>
    );
  }
}

export default Request;
