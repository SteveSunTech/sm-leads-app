import React, { useState, useEffect } from "react";
import { connect, useSelector } from "react-redux";
import clsx from "clsx";
import { getDate } from "../../config/Date";

import { Grid, Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { Chart } from "./Chart";

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
  fixedHeight1: {
    height: 300,
  },
  fixedHeight2: {
    height: 240,
  },
  informationContent: {
    marginBottom: theme.spacing(2),
  },
}));

const Main = ({ user, weeklyReport }) => {
  const classes = useStyles();

  const fixedHeightPaper1 = clsx(classes.paper, classes.fixedHeight1);
  const fixedHeightPaper2 = clsx(classes.paper, classes.fixedHeight2);

  const allLeads = useSelector((state) => state.am.allLeads);
  const [leadsIndex, setLeadsIndex] = useState({
    delayTask: [],
    todayTask: [],
    weekLaterTask: [],
    todayFinishTask: [],
  });

  const calculateLeads = () => {
    let delayTask = [];
    let todayTask = [];
    let weekLaterTask = [];
    let todayFinishTask = [];

    const todayDate = getDate();
    const todayYear = todayDate.split("-")[0];
    const todayMonth = todayDate.split("-")[1];
    const todayDay = todayDate.split("-")[2];
    const todaySum = todayYear * 10000 + todayMonth * 100 + todayDay * 1;

    if (allLeads.length > 0) {
      const processing = new Promise((resolve, reject) => {
        allLeads.forEach((item, index, array) => {
          if (item.followUpDate) {
            const leadDate = item.followUpDate;
            const leadYear = leadDate.split("-")[0];
            const leadMonth = leadDate.split("-")[1];
            const leadDay = leadDate.split("-")[2];
            const leadSum = leadYear * 10000 + leadMonth * 100 + leadDay * 1;

            if (leadSum < todaySum) {
              delayTask.push(item);
            } else if (leadSum === todaySum) {
              todayTask.push(item);
            } else {
              weekLaterTask.push(item);
            }
          }

          if (item.updatedLog.length > 0) {
            const logDate =
              item.updatedLog[item.updatedLog.length - 1].updateDateDisplay;
            if (logDate === todayDate) {
              todayFinishTask.push(item);
            }
          }

          if (index === array.length - 1) resolve();
        });
      });

      processing.then(() => {
        setLeadsIndex({
          delayTask,
          todayTask,
          weekLaterTask,
          todayFinishTask,
        });
      });
    }
  };

  useEffect(() => {
    calculateLeads();
  }, [allLeads]);

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={9} lg={9}>
          <Paper className={fixedHeightPaper1}>
            {weeklyReport
              ? Object.keys(weeklyReport).map((item, index) => (
                  <Typography
                    variant="body1"
                    color="primary"
                    noWrap
                    className={classes.informationContent}
                    key={index}
                  >
                    {item}: {weeklyReport[item]}
                  </Typography>
                ))
              : null}
          </Paper>
        </Grid>
        <Grid item xs={12} md={3} lg={3}>
          <Paper className={fixedHeightPaper2}>
            <Typography
              variant="body1"
              color="primary"
              noWrap
              className={classes.informationContent}
            >
              User: {user.name}
            </Typography>
            <Typography
              variant="body1"
              color="primary"
              noWrap
              className={classes.informationContent}
            >
              今日待完成：{leadsIndex.todayTask.length}
            </Typography>
            <Typography
              variant="body1"
              color="primary"
              noWrap
              className={classes.informationContent}
            >
              今日已完成：{leadsIndex.todayFinishTask.length}
            </Typography>
            <Typography
              variant="body1"
              color="primary"
              noWrap
              className={classes.informationContent}
            >
              延迟未完成：{leadsIndex.delayTask.length}
            </Typography>
            <Typography
              variant="body1"
              color="primary"
              noWrap
              className={classes.informationContent}
            >
              未来一周需完成：{leadsIndex.weekLaterTask.length}
            </Typography>
          </Paper>
        </Grid>
        {/* <Grid item xs={12}>
          <Paper className={classes.paper2}>
            <div>今日Follow Up数量：0</div>
            <div>已完成：0</div>
            <div>待完成：0</div>
          </Paper>
        </Grid> */}
        {/* <Grid item xs={12}>
          <Paper className={classes.paper2}>
            <div>
              <strong>2020.9.28 更新：</strong>
            </div>
            <div>1. 添加了Lead部分选项Sort和按微信号搜索功能。</div>
            <div>2. 添加了Table的Pagination功能。</div>
            <div>3. 优化了一些界面和逻辑。</div>
            <div>4. 修复了一些已知问题。</div>
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
          </Paper>
        </Grid> */}
      </Grid>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(Main);
