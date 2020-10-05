import React, { useState, Fragment, useEffect } from "react";
import { connect } from "react-redux";

import { TableBody, TableCell, TableRow, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import useTable from "../../reusable/useTable";
// import Controls from "../../reusable/controls/Controls";

import { userAnalyze } from "../../../actions/admin";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: 200,
    },
    // display: 'flex',
    // flexDirection: 'column',
  },
  uploadModalPopupButton: {
    marginTop: "30px",
    marginBottom: "30px",
    border: "none",
    color: "white",
    backgroundColor: theme.palette.primary.main,
    // width: '80px',
    height: "50px",
    borderRadius: "5px",
    fontWeight: "600",
    fontSize: "14px",
  },
  uploadIcon: {
    marginRight: "10px",
  },
  table: {
    minWidth: 650,
    // marginTop: '60px'
  },
  container: {
    // marginTop: '30px',
    marginBottom: "30px",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    // border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(6, 6, 6),
  },
  pageContent: {
    // margin: theme.spacing(2),
    padding: theme.spacing(3),
  },
  searchInput: {
    width: "75%",
  },
  addNewButton: {
    position: "absolute",
    right: "10px",
  },
}));

const headCells = [
  { id: "name", label: "姓名" },
  { id: "totalLeads", label: "上传总数" },
  { id: "已购买", label: "已购买" },
  { id: "无意向购买", label: "无意向购买" },
  { id: "未购买", label: "未购买" },
  { id: "国内", label: "国内" },
  { id: "美国", label: "美国" },
];

const AdminAnalyze = ({
  // State
  // allLeads,
  // allUsers,
  userReport,
  // Action
  // userAnalyze,
}) => {
  const classes = useStyles();
  const [records, setRecords] = useState(userReport);

  // const test = () => {
  //   setTimeout(
  //     () => setRecords(userReport, () => console.log(userReport)),
  //     500
  //   );
  // };

  // if (allUsers.length > 0 && allLeads.length > 0) {
  //   userAnalyze(allUsers, allLeads);
  // }

  // useEffect(() => {
  //   console.log(userReport);
  // }, [userReport]);

  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      return items;
    },
  });

  const {
    TblContainer,
    TblHead,
    TblPagination,
    recordsAfterPagingAndSorting,
  } = useTable(userReport, headCells, filterFn);

  return (
    <Fragment>
      {/* <Button
        onClick={() => setNewLeadOpenPopup(true)}
        variant="contained"
        color="primary"
        className={classes.uploadModalPopupButton}
      >
        <BackupIcon className={classes.uploadIcon} />
        Upload
      </Button> */}
      <Paper className={classes.pageContent}>
        <TblContainer>
          <TblHead />
          <TableBody>
            {records
              ? recordsAfterPagingAndSorting().map((item) => (
                  <TableRow key={item.id}>
                    <TableCell align="center">{item.name}</TableCell>
                    <TableCell align="center">{item.totalLeads}</TableCell>
                    <TableCell align="center">{item["已购买"]}</TableCell>
                    <TableCell align="center">{item["无意向购买"]}</TableCell>
                    <TableCell align="center">{item["未购买"]}</TableCell>
                    <TableCell align="center">{item["国内"]}</TableCell>
                    <TableCell align="center">{item["美国"]}</TableCell>
                  </TableRow>
                ))
              : "报告生成中..."}
          </TableBody>
        </TblContainer>
        <TblPagination />
      </Paper>
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  allUsers: state.admin.allUsers,
  allLeads: state.admin.allLeads,
  userReport: state.admin.userAnalyze,
});

export default connect(mapStateToProps, { userAnalyze })(AdminAnalyze);
