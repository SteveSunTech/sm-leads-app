import React, { Fragment } from "react";
import { connect } from "react-redux";
import clsx from "clsx";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";

import Chart from "./Chart";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    fontSize: "14px",
  },
  paper2: {
    padding: theme.spacing(3),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    fontSize: "14px",
    lineHeight: "30px",
  },
  fixedHeight: {
    height: 240,
  },
}));

const Main = ({ user }) => {
  const classes = useStyles();

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8} lg={9}>
          <Paper className={fixedHeightPaper}>
            <Chart />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4} lg={3}>
          <Paper className={fixedHeightPaper}>
            User: {user.name}
            {/* Title: {title} */}
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.paper2}>
            <div>今日Follow Up数量：0</div>
            <div>已完成：0</div>
            <div>待完成：0</div>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.paper2}>
            <div>
              <strong>2020.9.20 更新：</strong>
            </div>
            <div>1. 添加了Lead Follow Up每日提醒功能。</div>
            <div>2. 添加左边菜单栏Selected和Hover效果。</div>
            <div>
              3.
              修复了在使用过程中APP意外崩溃白屏的问题。如果还有类似的BUG发生，请第一时间联系IT部门。
            </div>
            <div>
              4.
              更新了添加校园大使时学校的选项。由于校园大使模块目前还在开发中，目前仍然不建议使用此功能。
            </div>
            <div>
              5.
              显著优化了用户体验，现在在删除或更新一个Lead后，列表刷新更快更及时。
            </div>
            <div>
              6.
              优化了对单个Lead进行操作的逻辑，非必选项的下拉菜单增加了未确定选项。
            </div>
            <div>7. 优化了一些操作逻辑。</div>
            <div>
              <strong>使用提示：</strong>
            </div>
            <div>
              在上传Lead时，只有带有*号的内容为必选项，其他均为
              <strong>选填。</strong>
            </div>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(Main);
