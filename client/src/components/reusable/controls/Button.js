import React from "react";
import { Button as MuiButton, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(0.5),
  },
  label: {
    textTransform: "none",
  },
  greenButton: {
    backgroundColor: "#43a047",
    // "& :hover": {
    //   backgroundColor: "#81c784",
    // },
  },
}));

export default function Button(props) {
  const { text, size, color, variant, onClick, green, ...other } = props;
  const classes = useStyles();

  return (
    <MuiButton
      variant={variant || "contained"}
      size={size || "large"}
      color={color || "primary"}
      onClick={onClick}
      {...other}
      className={green ? classes.greenButton : null}
      classes={{ root: classes.root, label: classes.label }}
    >
      {text}
    </MuiButton>
  );
}
