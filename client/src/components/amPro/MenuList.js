import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import DashboardIcon from "@material-ui/icons/Dashboard";
// import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PeopleIcon from "@material-ui/icons/People";
import AssessmentIcon from "@material-ui/icons/Assignment";
import SchoolIcon from "@material-ui/icons/School";
import ImportContactsIcon from "@material-ui/icons/ImportContacts";
import List from "@material-ui/core/List";

export const MainListItems = ({ setMainComponent }) => {
  return (
    <List>
      <ListItem button onClick={() => setMainComponent("Dashboard")}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItem>
      <ListItem button onClick={() => setMainComponent("Profiles")}>
        <ListItemIcon>
          <AccountBoxIcon />
        </ListItemIcon>
        <ListItemText primary="Profiles" />
      </ListItem>
      <ListItem button onClick={() => setMainComponent("All Leads")}>
        <ListItemIcon>
          <SchoolIcon />
        </ListItemIcon>
        <ListItemText primary="All Leads" />
      </ListItem>
      <ListItem button onClick={() => setMainComponent("Follow Up")}>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Follow Up Leads" />
      </ListItem>
      <ListItem button onClick={() => setMainComponent("College")}>
        <ListItemIcon>
          <ImportContactsIcon />
        </ListItemIcon>
        <ListItemText primary="College" />
      </ListItem>
      <ListItem button onClick={() => setMainComponent("校园大使")}>
        <ListItemIcon>
          <AssessmentIcon />
        </ListItemIcon>
        <ListItemText primary="校园大使" />
      </ListItem>
    </List>
  );
};
