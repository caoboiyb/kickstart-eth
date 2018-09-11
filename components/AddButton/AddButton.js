import React from 'react';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import { Link } from '../../routes';

const addButton = (props) => (
  <Link route="/campaigns/new">
    <Button
      style={{ float: 'right', marginLeft: '30px' }}
      variant="extendedFab"
      color="primary"
      aria-label="Add"
      href="/campaigns/new"
    >
      <AddIcon />
      Create Campaign
    </Button>
  </Link>
);

export default addButton;
