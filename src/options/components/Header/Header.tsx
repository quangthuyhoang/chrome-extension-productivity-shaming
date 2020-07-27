import React, { useState } from "react";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from  '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    backgroundColor: '#e58e24', // main color theme,
    boxShadow: 'none',
  }
});

function Header() {
  const classes = useStyles();
  return (
 
    <AppBar classes={{root: classes.root}} position="relative">
      <Toolbar variant="dense">
        <Typography variant="h6" color="inherit">
          Options
        </Typography>
      </Toolbar>
    </AppBar>
  )
};

export default Header;