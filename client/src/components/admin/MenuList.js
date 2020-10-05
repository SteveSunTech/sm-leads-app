import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import DashboardIcon from "@material-ui/icons/Dashboard";
// import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PeopleIcon from "@material-ui/icons/People";
import ImportContactsIcon from "@material-ui/icons/ImportContacts";
import List from "@material-ui/core/List";
import AssignmentIcon from "@material-ui/icons/Assignment";
import SchoolIcon from "@material-ui/icons/School";
import AssessmentIcon from "@material-ui/icons/Assessment";

export const MainListItems = ({ setMainComponent }) => {
  return (
    <List>
      <ListItem button onClick={() => setMainComponent("Dashboard")}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItem>
      <ListItem button onClick={() => setMainComponent("College")}>
        <ListItemIcon>
          <SchoolIcon />
        </ListItemIcon>
        <ListItemText primary="学校管理" />
      </ListItem>
      <ListItem button onClick={() => setMainComponent("Worker")}>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="用户管理" />
      </ListItem>
      <ListItem button onClick={() => setMainComponent("Lead")}>
        <ListItemIcon>
          <ImportContactsIcon />
        </ListItemIcon>
        <ListItemText primary="Leads管理" />
      </ListItem>
      <ListItem button onClick={() => setMainComponent("Analyze")}>
        <ListItemIcon>
          <AssessmentIcon />
        </ListItemIcon>
        <ListItemText primary="数据统计" />
      </ListItem>
    </List>
  );
};

export const secondaryListItems = (
  <div>
    <ListSubheader inset>Saved reports</ListSubheader>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Current month" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Last quarter" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Year-end sale" />
    </ListItem>
  </div>
);
