import React, {Fragment} from './node_modules/react';
import { connect } from './node_modules/react-redux';
import clsx from './node_modules/clsx';

import Grid from './node_modules/@material-ui/core/Grid';
import Paper from './node_modules/@material-ui/core/Paper';
import { makeStyles } from './node_modules/@material-ui/core/styles';

import Chart from './Chart';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
}))

const Main = ({ user }) => {

  const classes = useStyles();

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  return (
    <Fragment >
      <Grid container spacing={3}>
        {/* Chart */}
        <Grid item xs={12} md={8} lg={9}>
          <Paper className={fixedHeightPaper}>
            {/* <Chart /> */}
          </Paper>
        </Grid>
        {/* Recent Deposits */}
        <Grid item xs={12} md={4} lg={3}>
          <Paper className={fixedHeightPaper}>
            {/* <Deposits /> */}
            {/* User: {user.name} */}

            {/* Title: {title} */}
          </Paper>
        </Grid>
        {/* Recent Orders */}
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            {/* <Orders /> */}
          </Paper>
        </Grid>
      </Grid>
    </Fragment>
  )
}

const mapStateToProps = state => ({
  user: state.auth.user,
})

export default connect( mapStateToProps )(Main)