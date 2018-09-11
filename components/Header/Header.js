import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import { Link } from '../../routes';

const header = (props) => (
  <div
    style={{
      marginBottom: '30px',
      marginTop: '10px',
    }}
  >
    <AppBar position="static" color="default">
      <Toolbar>
        <Link route="/">
          <Button href="/">Kickstarter</Button>
        </Link>
        <div style={{ flexGrow: 1 }} />
        <Link route="/">
          <Button href="/">Campaigns</Button>
        </Link>
        <Link route="/campaigns/new">
          <Button href="/campaigns/new">
            <AddIcon />
          </Button>
        </Link>
      </Toolbar>
    </AppBar>
  </div>
);

export default header;
