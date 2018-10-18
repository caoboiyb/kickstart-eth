import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Link } from '../../routes';

const card = (props) => (
  <Card style={{ width: '70%', marginBottom: 20 }}>
    <CardContent>
      <Typography noWrap variant="headline">
        {props.name}
      </Typography>
    </CardContent>

    <Link route={`/campaigns/${props.address}`}>
      <Button
        style={{ marginLeft: 20, marginBottom: 10 }}
        href={`/campaigns/${props.address}`}
        size="small"
      >
        View Campaigns
      </Button>
    </Link>
  </Card>
);

export default card;
