import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  makeStyles,
  Typography,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

import Controls from "./controls/Controls";

const useStyles = makeStyles((theme) => ({
  dialogwrapper: {
    padding: theme.spacing(2),
    porsiton: "absolute",
    top: theme.spacing(-8),
  },
  dialogTitle: {
    paddingRight: "0px",
  },
}));

export default function Popup(props) {
  const { title, children, openPopup, setOpenPopup, maxWidth } = props;
  const classes = useStyles();

  return (
    <Dialog
      open={openPopup}
      onClose={() => setOpenPopup(false)}
      maxWidth={maxWidth}
      classes={{ paper: classes.dialogwrapper }}
    >
      <DialogTitle className={classes.dialogTitle}>
        <div style={{ display: "flex" }}>
          <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
            {title}
          </Typography>
          <Controls.ActionButton
            color="secondary"
            onClick={() => setOpenPopup(false)}
          >
            <CloseIcon />
          </Controls.ActionButton>
        </div>
      </DialogTitle>
      <DialogContent dividers>{children}</DialogContent>
    </Dialog>
  );
}
