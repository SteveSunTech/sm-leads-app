import React from "react";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import { makeStyles } from "@material-ui/styles";

const useStyle = makeStyles((theme) => ({
  textarea: {
    width: "100%",
    padding: theme.spacing(2),
  },
}));

export default function Textarea(props) {
  const {
    id,
    name,
    rows,
    placeholder,
    defaultValue,
    error = null,
    onChange,
  } = props;
  const classes = useStyle();
  return (
    <TextareaAutosize
      id={id}
      name={name}
      rowsMin={rows}
      placeholder={placeholder}
      onChange={onChange}
      defaultValue={defaultValue}
      className={classes.textarea}
      // classes={{ width: width || "100%" }}
      {...(error && { error: true, helperText: error })}
    />
  );
}
