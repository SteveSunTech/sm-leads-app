import React from 'react'
import { connect } from 'react-redux';

import Button from '@material-ui/core/Button';
import { Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
// import Table from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
// import TableCell from '@material-ui/core/TableCell';
// import TableContainer from '@material-ui/core/TableContainer';
// import TableHead from '@material-ui/core/TableHead';
// import TableRow from '@material-ui/core/TableRow';
// import Paper from '@material-ui/core/Paper';

import { logout } from '../../actions/auth';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

const Dashboard = ({ user, logout }) => {

  const classes = useStyles();

  const logoutUser = () => {
    logout()
    return <Redirect to='/' />
  }

  return (
    <div className={classes.root}>
      User : { user.name }
      <Button
        color="primary"
        // variant='contained'
        onClick={() => logoutUser()}
      >
        Logout
      </Button>
    </div>
  );
}


const mapStateToProps = state => ({
  user: state.auth.user
})

export default connect( mapStateToProps, { logout })(Dashboard)
