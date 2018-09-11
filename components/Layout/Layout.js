import React from 'react';
import Header from '../Header/Header';
import Grid from '@material-ui/core/Grid';

const layout = (props) => (
  <div
    style={{
      width: '100%',
    }}
  >
    <Header />
    <div style={{ width: '90%', margin: 'auto' }}>{props.children}</div>
  </div>
);

export default layout;
