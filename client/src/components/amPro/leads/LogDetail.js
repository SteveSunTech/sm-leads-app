import React, { Fragment, useEffect, useState } from "react";

import {
  TableBody,
  TableCell,
  TableRow,
  Paper,
  Grid,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

// Reusable
import useTable from "../../reusable/useTable";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: 200,
    },
  },
  pageContent: {
    padding: theme.spacing(3),
  },
  informationBox: {
    padding: theme.spacing(2),
  },
  informationItem: {
    marginTop: theme.spacing(2),
  },
}));

const headCells = [
  { id: "name", label: "名称", disableSorting: true },
  { id: "old", label: "原始", disableSorting: true },
  { id: "new", label: "修改后", disableSorting: true },
];

const convert = {
  wechat: "微信号",
  status: "状态",
  college: "学校",
  grade: "年级",
  country: "地区",
  otherKeywords: "关键词",
  note: "备注",
  intention: "购买意向",
};

const LogDetail = ({ log }) => {
  const classes = useStyles();

  const [records, setRecords] = useState(log.content);
  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      return items;
    },
  });

  useEffect(() => {
    if (log) {
      if (log.content) {
        setRecords(log.content);
      }
    }
  }, [log]);

  const { TblContainer, TblHead, recordsAfterPagingAndSorting } = useTable(
    records,
    headCells,
    filterFn
  );

  return (
    <Fragment>
      <Paper className={classes.pageContent}>
        <TblContainer>
          <TblHead />
          <TableBody>
            {recordsAfterPagingAndSorting().map((item) => (
              <TableRow key={item._id}>
                <TableCell align="center">{convert[item.name]}</TableCell>
                <TableCell align="center">{item.old}</TableCell>
                <TableCell align="center">{item.new}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TblContainer>
      </Paper>
      <Grid container spacing={2} className={classes.informationBox}>
        <Grid item xs={12} className={classes.informationItem}>
          <Typography variant={"body1"} color={"primary"} noWrap>
            修改者：{log ? log.UserDisplay : null}
          </Typography>
        </Grid>
        <Grid item xs={12} className={classes.informationItem}>
          <Typography variant={"body1"} color={"primary"} noWrap>
            修改时间：{log ? log.updateDateDisplay : null}
          </Typography>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default LogDetail;
