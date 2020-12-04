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
    delay: [],
    today: [],
    weekLater: [],
  });

  const calculateLeads = () => {
    let delay = [];
    let today = [];
    let weekLater = [];

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
              delay.push(item);
            } else if (leadSum === todaySum) {
              today.push(item);
            } else {
              weekLater.push(item);
            }
          }
          if (index === array.length - 1) resolve();
        });
      });

      processing.then(() => {
        setLeadsIndex({
          delay,
          today,
          weekLater,
        });
      });
    }
  };

  useEffect(() => {
    calculateLeads();
  }, [allLeads]);

  return (
    <div className={classes.root}>
      <TaskBlock title={"延迟的任务"} index={leadsIndex.delay} />
      <TaskBlock title={"今日任务"} index={leadsIndex.today} />
      <TaskBlock title={"未来一周任务"} index={leadsIndex.weekLater} />
    </div>
  );
};

export default LeadFollowUp;
