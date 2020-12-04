import React, { useState } from "react";
import { connect, useSelector } from "react-redux";
import clsx from "clsx";

import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Typography, Paper } from "@material-ui/core";

// Reusable
import Controls from "../../reusable/controls/Controls";
import { useForm, Form } from "../../reusable/useForm";

// Functions
import { pagenationRowsOptions } from "../../config/Am";

// Actions
import { updatingUserSetting } from "../../../actions/am";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  formActionButtonWrap: {
    display: "flex",
    justifyContent: "center",
    // marginTop: theme.spacing(3),
    gap: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    fontSize: "14px",
  },
  saveButton: { marginRight: theme.spacing(2) },
  resetButton: { marginLeft: theme.spacing(2) },
  fixedHeight: {
    height: 900,
  },
  informationBox: {
    marginTop: theme.spacing(3),
    padding: theme.spacing(3),
  },
  blockTitle: {
    marginBottom: theme.spacing(4),
  },
}));

const Main = ({
  // Actions
  updatingUserSetting,
}) => {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const user = useSelector((state) => state.auth.user);

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("name" in fieldValues)
      temp.name = fieldValues.name ? "" : "用户名不能为空！";
    if ("paginationRows" in fieldValues)
      temp.paginationRows = fieldValues.paginationRows ? "" : "行数不能为空！";
    setErrors({
      ...temp,
    });

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === "");
  };

  // Use Form
  const initialFValues = {
    name: user.name,
    paginationRows: user.preference.table.paginationRows,
  };

  const {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    resetForm,
  } = useForm(initialFValues, true, validate);

  // Parse Values
  let { name, paginationRows } = values;

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    user.name = values.name;
    user.preference.table.paginationRows = Number(values.paginationRows);
    updatingUserSetting(user);
  };

  return (
    <div className={classes.root}>
      <Paper className={fixedHeightPaper}>
        <Form onSubmit={(e) => handleSubmit(e)}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box className={classes.formActionButtonWrap}>
                <Controls.Button
                  text="保存修改"
                  variant="outlined"
                  type="submit"
                />
                <Controls.Button
                  text="重置修改"
                  variant="outlined"
                  color="default"
                  onClick={() => {
                    resetForm();
                  }}
                />
              </Box>
              <Box
                border={1}
                borderColor="primary.light"
                className={classes.informationBox}
              >
                <Box className={classes.blockTitle}>
                  <Typography variant="h5" color="primary">
                    个人信息
                  </Typography>
                </Box>
                <Grid container spacing={1}>
                  <Grid item xs={4}>
                    <Controls.Input
                      name="name"
                      label="用户名 *"
                      value={name}
                      onChange={handleInputChange}
                      error={errors.name}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Controls.Button
                      text="修改密码"
                      variant="outlined"
                      // startIcon={<ArrowBackIcon />}
                      // className={(classes.center, classes.resetButton)}
                      // onClick={() => {
                      //   resetForm();
                      // }}
                    />
                  </Grid>
                </Grid>
              </Box>
              <Box
                border={1}
                borderColor="primary.light"
                className={classes.informationBox}
              >
                <Box className={classes.blockTitle}>
                  <Typography variant="h5" color="primary">
                    列表显示
                  </Typography>
                </Box>
                <Grid container spacing={1}>
                  <Grid item xs={4}>
                    <Controls.Select
                      name="paginationRows"
                      label="每页显示行数"
                      value={paginationRows}
                      onChange={handleInputChange}
                      options={pagenationRowsOptions()}
                      error={errors.paginationRows}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Form>
      </Paper>
    </div>
  );
};

export default connect(null, { updatingUserSetting })(Main);
