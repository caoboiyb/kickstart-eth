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

  onApprove = async (index) => {
    try {
      const accounts = await web3.eth.getAccounts();
      const campaign = Campaign(this.props.address);
      await campaign.methods.approveRequest(index).send({ from: accounts[0] });
      Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
    } catch (err) {
      alert(err.message);
    }
  };

  onFinalize = async (index) => {
    try {
      const accounts = await web3.eth.getAccounts();
      const campaign = Campaign(this.props.address);
      await campaign.methods.finalizeRequest(index).send({ from: accounts[0] });
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
            </TableRow>
          </TableHead>
          <TableBody>
            {this.props.requests.map((request, index) => (
              <TableRow>
                <TableCell padding="none">{index}</TableCell>
                <TableCell padding="none">{request.description}</TableCell>
                <TableCell padding="none">
                  {web3.utils.fromWei(request.value, 'ether')}
                </TableCell>
                <TableCell padding="none">{request.recipient}</TableCell>
                <TableCell padding="none">{`${request.approvalCount}/${
                  this.props.approversCount
                }`}</TableCell>
                <TableCell padding="none">
                  {request.comlete ? null : (
                    <Button
                      color="primary"
                      onClick={() => this.onApprove(index)}
                    >
                      Approve
                    </Button>
                  )}
                </TableCell>
                <TableCell padding="none">
                  {request.complete ? null : (
                    <Button
                      color="secondary"
                      onClick={() => this.onFinalize(index)}
                    >
                      Finalize
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
