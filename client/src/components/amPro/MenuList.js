import React from "react";

import { ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

// Icons
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import DashboardIcon from "@material-ui/icons/Dashboard";
import PeopleIcon from "@material-ui/icons/People";
import AssessmentIcon from "@material-ui/icons/Assignment";
import SchoolIcon from "@material-ui/icons/School";
import ImportContactsIcon from "@material-ui/icons/ImportContacts";
import List from "@material-ui/core/List";
import SettingsIcon from "@material-ui/icons/Settings";

const useStyle = makeStyles((theme) => ({
  selectedItem: {
    background: theme.palette.primary.light,
    color: theme.palette.primary.main,
  },
}));

export const MainListItems = ({ mainComponent, setMainComponent }) => {
  const classes = useStyle();

  return (
    <List>
      <ListItem
        className={mainComponent === "Dashboard" ? classes.selectedItem : null}
        button
        onClick={() => setMainComponent("Dashboard")}
      >
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItem>
      <ListItem
        className={mainComponent === "Profiles" ? classes.selectedItem : null}
        button
        onClick={() => setMainComponent("Profiles")}
      >
        <ListItemIcon>
          <AccountBoxIcon />
        </ListItemIcon>
        <ListItemText primary="Profiles" />
      </ListItem>
      <ListItem
        className={mainComponent === "All Leads" ? classes.selectedItem : null}
        button
        onClick={() => setMainComponent("All Leads")}
      >
        <ListItemIcon>
          <ImportContactsIcon />
        </ListItemIcon>
        <ListItemText primary="All Leads" />
      </ListItem>
      <ListItem
        className={mainComponent === "Follow Up" ? classes.selectedItem : null}
        button
        onClick={() => setMainComponent("Follow Up")}
      >
        <ListItemIcon>
          <AssessmentIcon />
        </ListItemIcon>
        <ListItemText primary="Follow Up Leads" />
      </ListItem>
      <ListItem
        className={mainComponent === "College" ? classes.selectedItem : null}
        button
        onClick={() => setMainComponent("College")}
      >
        <ListItemIcon>
          <SchoolIcon />
        </ListItemIcon>
        <ListItemText primary="College" />
      </ListItem>
      <ListItem
        className={mainComponent === "校园大使" ? classes.selectedItem : null}
        button
        onClick={() => setMainComponent("校园大使")}
      >
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="校园大使" />
      </ListItem>
      <ListItem
        className={mainComponent === "Setting" ? classes.selectedItem : null}
        button
        onClick={() => setMainComponent("Setting")}
      >
        <ListItemIcon>
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText primary="Setting" />
      </ListItem>
    </List>
  );
};
