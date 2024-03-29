import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { connect, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import axios from "axios";

import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import Box from "@material-ui/core/Box";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

// Actions
import { loadUser } from "../../actions/auth";
import { logout } from "../../actions/auth";
import {
  getAllLeads,
  getAllProfiles,
  getStatistic,
  getAllColleges,
} from "../../actions/am";

// Components
import Dashboard from "./amDashboard/Main";
import BasicManage from "./BasicManage";
import AmLeads from "./AmLeads";
import SubAlert from "../ui/SubAlert";
import LeadFollowUp from "./leadsFollowUp/Main";
import { MainListItems } from "./MenuList";
import Profiles from "./profiles/index";
import Setting from "./setting/Main";
// import NewLeadForm from "./leads/LeadDetailForm";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://smcovered.com/">
        Student Medicover
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: "none",
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
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

const Main = ({
  // State
  logout,
  isAuthenticated,
  title,
  // Actions
  getAllLeads,
  getAllColleges,
  getAllProfiles,
  getStatistic,
}) => {
  const classes = useStyles();

  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);

  const [open, setOpen] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState();

  useEffect(() => {
    // getStatistic();
    getAllLeads();
    getAllColleges();
    getAllProfiles();
  }, [token]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  // const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const [mainComponent, setMainComponent] = useState("Dashboard");

  // Authentication
  if (isAuthenticated) {
    if (title === "basic") {
      return <Redirect to="/ambassador" />;
    } else if (title === "admin") {
      return <Redirect to="/admin" />;
    }
  } else {
    return <Redirect to="/" />;
  }

  const logoutUser = () => {
    logout();
    return <Redirect to="/" />;
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="absolute"
        className={clsx(classes.appBar, open && classes.appBarShift)}
      >
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(
              classes.menuButton,
              open && classes.menuButtonHidden
            )}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={classes.title}
          >
            {mainComponent}
          </Typography>
          <IconButton color="inherit">
            {/* <Badge badgeContent={4} color="secondary">
              <NotificationsIcon />
            </Badge> */}
            <Badge color="secondary">
              <ExitToAppIcon onClick={() => logoutUser()} />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <MainListItems
          setMainComponent={setMainComponent}
          mainComponent={mainComponent}
        />
        <Divider />
        {/* Add secondary list here is the future!  */}
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <SubAlert />
          {mainComponent === "Dashboard" ? (
            <Dashboard />
          ) : mainComponent === "College" ? (
            <div>college</div>
          ) : mainComponent === "校园大使" ? (
            <BasicManage />
          ) : mainComponent === "All Leads" ? (
            <AmLeads />
          ) : mainComponent === "Follow Up" ? (
            <LeadFollowUp />
          ) : mainComponent === "Test" ? (
            "Test"
          ) : mainComponent === "Profiles" ? (
            <Profiles />
          ) : mainComponent === "Setting" ? (
            <Setting />
          ) : null}
          <Box pt={4}>
            <Copyright />
          </Box>
        </Container>
      </main>
    </div>
  );
};

const mapStateToProps = (state) => ({
  // user: state.auth.user,
  isAuthenticated: state.auth.isAuthenticated,
  title: state.auth.title,
});

export default connect(mapStateToProps, {
  logout,
  loadUser,
  getAllLeads,
  getAllColleges,
  getAllProfiles,
  getStatistic,
})(Main);
