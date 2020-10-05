import React, { Fragment, useEffect } from "react";
import { connect } from "react-redux";
import clsx from "clsx";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";

import Chart from "./Chart";
import { userAnalyze } from "../../../actions/admin";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: 240,
  },
}));

const AdminDashboardMain = ({
  // state
  allUsers,
  allLeads,
  // action
  // userAnalyze,
}) => {
  const classes = useStyles();

  useEffect(() => {
    // console.log(allLeads);
    // console.log(allUsers);
    // setTimeout(() => console.log(allLeads), 1000);
  }, [allLeads.length]);

  // setTimeout(() => console.log(allLeads), 1000);

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  return (
    <Fragment>
      <Grid container spacing={3}>
        {/* Chart */}
        <Grid item xs={12} md={8} lg={9}>
          <Paper className={fixedHeightPaper}>
            <Chart />
          </Paper>
        </Grid>
        {/* Recent Deposits */}
        <Grid item xs={12} md={4} lg={3}>
          <Paper className={fixedHeightPaper}>
            {/* <Deposits /> */}
            User: Admin
            {/* Title: {title} */}
          </Paper>
        </Grid>
        {/* Recent Orders */}
        <Grid item xs={12}>
          <Paper className={classes.paper}>{/* <Orders /> */}</Paper>
        </Grid>
      </Grid>
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  allUsers: state.admin.allUsers,
  allLeads: state.admin.allLeads,
});

export default connect(mapStateToProps, {})(AdminDashboardMain);
