import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { makeStyles } from "@material-ui/core/styles";

// Utils
import { getDate } from "../../config/Date";

// Components
import TaskBlock from "./TaskBlock";

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
  fixedHeight: {
    height: 60,
  },
  blockBox: {
    marginBottom: theme.spacing(2),
  },
}));

const LeadFollowUp = () => {
  const classes = useStyles();

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
    let monthFinishTask = [];

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
      <TaskBlock title={"延迟的任务"} index={leadsIndex.delayTask} />
      <TaskBlock title={"今日任务"} index={leadsIndex.todayTask} />
      <TaskBlock title={"今日已完成"} index={leadsIndex.todayFinishTask} />
      <TaskBlock title={"未来一周任务"} index={leadsIndex.weekLaterTask} />
    </div>
  );
};

export default LeadFollowUp;
