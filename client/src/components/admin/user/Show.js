import React, { Fragment, useEffect, useState } from "react";
import { connect, useSelector, useDispatch } from "react-redux";

import {
  Grid,
  Box,
  Typography,
  TableBody,
  TableCell,
  Tooltip,
  TableRow,
  IconButton,
  TextField,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { makeStyles } from "@material-ui/styles";

// Reusable
import Controls from "../../reusable/controls/Controls";
import useTable from "../../reusable/useTable";
import Popup from "../../reusable/Popup";
import ConfirmDialog from "../../reusable/ConfirmDialog";

// Icon
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import PlaylistAddIcon from "@material-ui/icons/PlaylistAdd";

// Actions
import { setAlert } from "../../../actions/subAlert";
import { set } from "lodash";
import { AssignCollegeToUser } from "../../../actions/admin";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    "& .MuiTextField-root": {
      margin: theme.spacing(2),
      width: 200,
    },
  },
  informationBox: {
    marginTop: theme.spacing(3),
    padding: theme.spacing(3),
  },
  informationTag: {
    fontWeight: "600",
    marginBottom: theme.spacing(2),
  },
  informationContent: {
    fontWeight: "600",
    marginBottom: theme.spacing(2),
  },
  addNewButton: {
    marginLeft: "50px",
  },
}));

// College head
const headCells = [
  { id: "collegeId", label: "ID" },
  { id: "collegeDisplay", label: "名称" },
  { id: "operation", label: "操作", disableSorting: true },
];

const UserDetail = ({
  setOpen,
  userID,
  // Actions
  AssignCollegeToUser,
}) => {
  const classes = useStyles();

  const dispatch = useDispatch();
  const allUsers = useSelector((state) => state.admin.allUsers);
  const allColleges = useSelector((state) => state.admin.allColleges);

  const [userDisplay, setUserDisplay] = useState({
    name: "",
    email: "",
    area: "",
  });
  const [assignCollege, setAssignCollege] = useState();
  const [collegeIndex, setCollegeIndex] = useState([]);

  useEffect(() => {
    if (userID) {
      loadUser();
    }
  }, [userID, allUsers]);

  // Load current user
  const loadUser = () => {
    const processing = new Promise((resolve, reject) => {
      allUsers.forEach((item, index, array) => {
        if (item._id === userID) resolve(item);
        if (index === array.length - 1) resolve(false);
      });
    });
    processing.then((res) => {
      if (res) {
        setUserDisplay(res);
        setCollegeIndex(res.college);
      } else {
        setOpen();
        dispatch(setAlert("无法获取该用户信息！", "error"));
      }
    });
  };

  // handle assign college
  const handleAssignCollege = (email) => {
    // console.log(email);

    const processing = new Promise((resolve, reject) => {
      userDisplay.college.forEach((item, index, array) => {
        if (item.collegeDisplay === assignCollege) resolve(false);
        if (index === array.length - 1) resolve(true);
      });

      if (userDisplay.college.length === 0) resolve(true);
    });
    processing.then((res) => {
      if (res) {
        AssignCollegeToUser(email, assignCollege);
      } else {
        dispatch(
          setAlert(`${assignCollege} 已属于该用户，分配失败！`, "warning")
        );
      }
    });
  };

  // College index table
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
  } = useTable(collegeIndex, headCells, filterFn);

  return (
    <Fragment>
      <Box>
        <Controls.Button
          text="Back"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          className={classes.goBackButton}
          onClick={() => setOpen()}
        />
      </Box>

      <Box
        border={1}
        borderColor="primary.light"
        className={classes.informationBox}
      >
        <Box>
          <Typography variant="h4" color="primary">
            基本信息
          </Typography>
        </Box>
        <Box style={{ marginTop: "24px" }}>
          <Grid container className={classes.root} spacing={0}>
            <Grid item xs={6}>
              <Grid container>
                <Grid item xs={3}>
                  <Typography className={classes.informationTag}>
                    Email
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography className={classes.informationContent}>
                    {userDisplay.email}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={3}>
                  <Typography className={classes.informationTag}>
                    Name
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography className={classes.informationContent}>
                    {userDisplay.name}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={3}>
                  <Typography className={classes.informationTag}>
                    Area
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography className={classes.informationContent}>
                    {userDisplay.area}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Box
        border={1}
        borderColor="primary.light"
        className={classes.informationBox}
      >
        <Box>
          <Typography variant="h4" color="primary">
            分配学校
          </Typography>
        </Box>
        <Box style={{ marginTop: "24px" }}>
          <Grid container className={classes.root} spacing={2}>
            <Grid item xs={6}>
              <Autocomplete
                id="CollegeList"
                options={allColleges}
                getOptionLabel={(option) => option.name}
                onChange={(event, value = {}) => {
                  console.log("value", value);
                  typeof value === "object" && setAssignCollege(value.name);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="选择学校"
                    variant="outlined"
                    style={{ width: "80%" }}
                    // onInput={(e) => {
                    //   setAssignCollege(e.target.value);
                    // }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={3} style={{ marginTop: "15px" }}>
              <Controls.Button
                text="分配"
                variant="outlined"
                startIcon={<PlaylistAddIcon />}
                onClick={() => handleAssignCollege(userDisplay.email)}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Box
        border={1}
        borderColor="primary.light"
        className={classes.informationBox}
      >
        <Box>
          <Typography variant="h4" color="primary">
            学校列表
          </Typography>
        </Box>
        <TblContainer>
          <TblHead />
          <TableBody>
            {recordsAfterPagingAndSorting().map((item) => (
              <TableRow key={item._id}>
                <TableCell align="center">{item.collegeId}</TableCell>
                <TableCell align="center">{item.collegeDisplay}</TableCell>
                <TableCell align="center">
                  <Box
                    component="span"
                    // onClick={() => {
                    //   loadLeadDetail(item._id);
                    // }}
                    key={1}
                  >
                    <Tooltip title="编辑" arrow>
                      <IconButton>
                        <EditIcon color="primary" fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Box
                    component="span"
                    key={2}
                    // onClick={() => {
                    //   setConfirmDialog({
                    //     isOpen: true,
                    //     title: "Are you sure to delete this Lead?",
                    //     subTitle: "You can't undo this operation",
                    //     onConfirm: () => onDelete(item._id),
                    //   });
                    // }}
                  >
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
      </Box>
    </Fragment>
  );
};

export default connect(null, { AssignCollegeToUser })(UserDetail);
