import React, { useState, useEffect, Fragment } from "react";
import { connect, useSelector } from "react-redux";

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
  Grid,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
// import BackupIcon from "@material-ui/icons/Backup";

// Icons
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { Search } from "@material-ui/icons";
import AddIcon from "@material-ui/icons/Add";

// Reusable
import useTable from "../../reusable/useTable";
import Controls from "../../reusable/controls/Controls";
import Popup from "../../reusable/Popup";
import ConfirmDialog from "../../reusable/ConfirmDialog";

// Component
import ProfileDetail from "./show";
import NewRecord from "./new";
import NewLeadForm from "../leads/NewLeadForm";

// Actions
import {
  deleteSingleProfile,
  setCurrentProfile,
} from "../../../actions/profile";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: 200,
    },
  },
  uploadModalPopupButton: {
    marginTop: "30px",
    marginBottom: "30px",
    border: "none",
    color: "white",
    backgroundColor: theme.palette.primary.main,
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
  },
  container: {
    marginBottom: "30px",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(6, 6, 6),
  },
  pageContent: {
    padding: theme.spacing(3),
  },
  searchInput: {
    width: "120%",
  },
  addNewButton: {
    // position: "absolute",
    // right: "10px",
    marginTop: "-10px",
  },
}));

const headCells = [
  { id: "ProfileID", label: "ID" },
  { id: "college", label: "学校" },
  { id: "wechatId", label: "微信号" },
  { id: "grade", label: "年级" },
  { id: "country", label: "地区" },
  { id: "createdDateDisplay", label: "创建时间" },
  { id: "updateDateDisplay", label: "更新时间" },
  { id: "operation", label: "操作", disableSorting: true },
];

const AmProfiles = ({
  // State
  // allLeads,
  // Action
  deleteSingleProfile,
  setCurrentProfile,
}) => {
  const classes = useStyles();

  const allProfiles = useSelector((state) => state.am.allProfiles);

  const [records, setRecords] = useState(allProfiles);
  const [indexDisplay, setIndexDisplay] = useState("block");
  const [detailDisplay, setDetailDisplay] = useState("none");
  const [profileID, setProfileID] = useState();
  const [newRecordOpenPopup, setNewRecordOpenPopup] = useState(false);
  const [newLeadOpenPopup, setNewLeadOpenPopup] = useState(false);
  const [newRecordInitialValues, setNewRecordInitialValues] = useState();
  const [deleteProfileConfirmDialog, setDeleteProfileConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });

  useEffect(() => {
    setRecords(allProfiles);
  }, [allProfiles]);

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
    let fieldName = e.target.name;
    setFilterFn({
      fn: (items) => {
        if (target.value == "") return items;
        else {
          return items.filter((x) =>
            x[fieldName].toLowerCase().includes(target.value)
          );
        }
      },
    });
  };

  // Handle Display
  const loadLeadProfile = (profile) => {
    setProfileID(profile.ProfileID);
    setCurrentProfile(profile);
    setIndexDisplay("none");
    setDetailDisplay("block");
  };
  const backToIndex = () => {
    setIndexDisplay("block");
    setDetailDisplay("none");
  };

  // Delete Single Profile
  const onDeleteProfile = (id) => {
    deleteSingleProfile(id);
    setDeleteProfileConfirmDialog({
      ...deleteProfileConfirmDialog,
      isOpen: false,
    });
  };

  return (
    <Fragment>
      <Box display={indexDisplay}>
        <Paper className={classes.pageContent}>
          <Toolbar>
            <Grid container spacing={5}>
              <Grid item xs={8}>
                <Controls.Input
                  label="搜索微信号"
                  className={classes.searchInput}
                  name="wechatId"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                  onChange={handleSearch}
                />
              </Grid>
              <Grid item xs={2}></Grid>
              <Grid item xs={2}>
                <Controls.Button
                  text="新建"
                  variant="outlined"
                  startIcon={<AddIcon />}
                  className={classes.addNewButton}
                  onClick={() => setNewRecordOpenPopup(true)}
                />
              </Grid>
            </Grid>
          </Toolbar>
          <TblContainer>
            <TblHead />
            <TableBody>
              {recordsAfterPagingAndSorting().map((item) => (
                <TableRow key={item._id}>
                  <TableCell align="center">{item.ProfileID}</TableCell>
                  <TableCell align="center">{item.collegeDisplay}</TableCell>
                  <TableCell align="center">{item.wechatId}</TableCell>
                  <TableCell align="center">{item.grade}</TableCell>
                  <TableCell align="center">{item.country}</TableCell>
                  <TableCell align="center">
                    {item.createdDateDisplay}
                  </TableCell>
                  <TableCell align="center">{item.updateDateDisplay}</TableCell>
                  <TableCell align="center">
                    <Box
                      component="span"
                      onClick={() => {
                        loadLeadProfile(item);
                      }}
                    >
                      <Tooltip title="编辑" arrow>
                        <IconButton>
                          <EditIcon color="primary" fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <Box
                      component="span"
                      onClick={() => {
                        setDeleteProfileConfirmDialog({
                          isOpen: true,
                          title: "Are you sure to delete this Profile?",
                          subTitle:
                            "All related leads will be deleted too! You can't undo this operation",
                          onConfirm: () => onDeleteProfile(item._id),
                        });
                      }}
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
        </Paper>
      </Box>
      <Box display={detailDisplay}>
        <Paper className={classes.pageContent}>
          <ProfileDetail setOpen={backToIndex} profileID={profileID} />
        </Paper>
      </Box>
      {/* New record qurey modal */}
      <Popup
        openPopup={newRecordOpenPopup}
        setOpenPopup={setNewRecordOpenPopup}
        title="New Profile & Leads"
        maxWidth="md"
      >
        <NewRecord
          setOpenPopup={setNewRecordOpenPopup}
          setNewRecordOpenPopup={setNewLeadOpenPopup}
          setProfile={loadLeadProfile}
          setNewRecordInitialValues={setNewRecordInitialValues}
          // setProfileDisplay={setDetailDisplay}
          // setIndexDisplay={setIndexDisplay}
        />
      </Popup>
      {/* Upload new record modal */}
      <Popup
        openPopup={newLeadOpenPopup}
        setOpenPopup={setNewLeadOpenPopup}
        title="New Lead & Profile"
        maxWidth="md"
      >
        <NewLeadForm
          setOpenPopup={setNewLeadOpenPopup}
          initialFValues={newRecordInitialValues}
          makeProfile={true}
        />
      </Popup>
      {/* Delete Profile Confirm */}
      <ConfirmDialog
        confirmDialog={deleteProfileConfirmDialog}
        setConfirmDialog={setDeleteProfileConfirmDialog}
      />
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  // allProfiles: state.am.allProfiles,
  // allLeads: state.am.allLeads,
});

export default connect(mapStateToProps, {
  deleteSingleProfile,
  setCurrentProfile,
})(AmProfiles);
