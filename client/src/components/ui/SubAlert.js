import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
// import { makeStyles } from '@material-ui/core/styles';
import Alert from "@material-ui/lab/Alert";

// const useStyles = makeStyles((theme) => ({
//   root: {
//     width: '100%',
//     '& > * + *': {
//       marginTop: theme.spacing(2),
//     },
//   },
// }));

const SubAlert = ({ alerts }) =>
  // const classes = useStyles();

  // const alertContent = ({ alerts }) =>

  alerts !== null &&
  alerts.length > 0 &&
  alerts.map((alert) => (
    <div
      key={alert.id}
      style={{ width: "100%", marginBottom: "10px", marginTop: "-10px" }}
    >
      <Alert severity={`${alert.alertType}`}>{alert.msg}</Alert>
    </div>
  ));

// return (
//   <div className={classes.root}>
//     <alertContent alerts={alerts} />
//   </div>
// )

SubAlert.propTypes = {
  alerts: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  alerts: state.subAlert,
});

export default connect(mapStateToProps)(SubAlert);
