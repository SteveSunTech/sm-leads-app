import React, { useState, Fragment, useEffect } from "react";
import { connect } from "react-redux";

import {
  IconButton,
  TableBody,
  TableCell,
  TableRow,
  Paper,
  Box,
  Tooltip,
  Toolbar,
  InputAdornment,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

// Icons
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { Search } from "@material-ui/icons";
import AddIcon from "@material-ui/icons/Add";

// Reusable & Config
import useTable from "../../reusable/useTable";
import Controls from "../../reusable/controls/Controls";

// Components
import UserDetail from "./Show";

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
  { id: "email", label: "email" },
  { id: "area", label: "地区" },
  { id: "operation", label: "操作", disableSorting: true },
];

const AdminUsers = ({
  // State
  allUsers,
  // Action
}) => {
  const classes = useStyles();

  const [records, setRecords] = useState(allUsers);
  const [indexDisplay, setIndexDisplay] = useState("block");
  const [detailDisplay, setDetailDisplay] = useState("none");
  const [userID, setUserID] = useState();

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
  } = useTable(records, headCells, filterFn);

  const handleSearch = (e) => {
    let target = e.target;
    setFilterFn({
      fn: (items) => {
        if (target.value === "") return items;
        else {
          return items.filter((x) =>
            x.name.toLowerCase().includes(target.value)
          );
        }
      },
    });
  };

  useEffect(() => {
    setRecords(allUsers);
  }, [allUsers]);

  // Load user and handle display
  const loadUser = (user) => {
    setUserID(user._id);
    setIndexDisplay("none");
    setDetailDisplay("block");
  };

  const backToIndex = () => {
    setIndexDisplay("block");
    setDetailDisplay("none");
  };

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
      <Box display={indexDisplay}>
        <Paper className={classes.pageContent}>
          <Toolbar>
            <Controls.Input
              label="搜索用户"
              className={classes.searchInput}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              onChange={handleSearch}
            />
            <Controls.Button
              text="添加用户"
              variant="outlined"
              startIcon={<AddIcon />}
              className={classes.addNewButton}
            />
          </Toolbar>
          <TblContainer>
            <TblHead />
            <TableBody>
              {recordsAfterPagingAndSorting().map((item) => (
                <TableRow key={item.id}>
                  <TableCell align="center">{item.name}</TableCell>
                  <TableCell align="center">{item.email}</TableCell>
                  <TableCell align="center">{item.area}</TableCell>
                  <TableCell align="center">
                    <Box
                      component="span"
                      onClick={() => {
                        loadUser(item);
                      }}
                    >
                      <Tooltip title="编辑" arrow>
                        <IconButton>
                          <EditIcon color="primary" fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <Box component="span">
                      <Tooltip title="删除" arrow>
                        <IconButton>
                          <DeleteIcon color="secondary" fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </TblContainer>
          <TblPagination />
        </Paper>
      </Box>
      <Box display={detailDisplay}>
        <Paper className={classes.pageContent}>
          <UserDetail setOpen={backToIndex} userID={userID} />
        </Paper>
      </Box>
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  allUsers: state.admin.allUsers,
});

export default connect(mapStateToProps, {})(AdminUsers);
