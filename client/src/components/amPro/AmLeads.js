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
// import BackupIcon from "@material-ui/icons/Backup";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { Search } from "@material-ui/icons";
import AddIcon from "@material-ui/icons/Add";
// import EditOutlinedIcon from "@material-ui/icons/EditOutlined";

import { uploadLead } from "../../actions/am";
import { updateSingleLead } from "../../actions/lead";
import { deleteSingleLead } from "../../actions/lead";
import Popup from "../reusable/Popup";
import LeadDetailForm from "./leads/LeadDetailForm";
import NewLeadForm from "./leads/NewLeadForm";
import { intentionOptions } from "../config/Leads";
import useTable from "../reusable/useTable";
import Controls from "../reusable/controls/Controls";
import ConfirmDialog from "../reusable/ConfirmDialog";

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
    width: "75%",
  },
  addNewButton: {
    position: "absolute",
    right: "10px",
  },
}));

const headCells = [
  { id: "college", label: "学校" },
  { id: "wechat", label: "微信号", disableSorting: true },
  { id: "status", label: "状态" },
  { id: "country", label: "地区" },
  { id: "createdDateDisplay", label: "创建时间" },
  { id: "updateDateDisplay", label: "更新时间" },
  { id: "operation", label: "操作", disableSorting: true },
];

const AmLeads = ({
  // State
  allLeads,
  // Action
  deleteSingleLead,
}) => {
  const classes = useStyles();

  const [newLeadOpenPopup, setNewLeadOpenPopup] = useState(false);
  const [leadDetialOpenPopup, setLeadDetailOpenPopup] = useState(false);

  //***************************************************************
  // All leads list table
  // **************************************************************
  const [records, setRecords] = useState(allLeads);
  // Disc List with update date
  // let sortedList = records;
  // console.log(allLeads);
  // sortedList = sortedList.map((el, index) => [el, index]);
  // sortedList = sortedList.sort((a, b) => {
  //   return b["updateDateDisplay"] - a["updateDateDisplay"];
  // });
  // setRecords(sortedList);

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

  useEffect(() => {
    setRecords(allLeads);
  }, [allLeads]);

  //***************************************************************
  // lead detail
  // **************************************************************

  const [leadDetail, setLeadDetail] = useState({});

  const loadLeadDetail = (id) => {
    // Find exact lead in redux
    let lead = null;
    var findSingleLead = new Promise((resolve, reject) => {
      allLeads.forEach((value) => {
        if (value._id === id) {
          lead = value;
          resolve();
        }
      });
    });
    findSingleLead.then(() => {
      // console.log(lead);
      // Setup Keywords
      let keywordsChange = "";
      if (!lead.keywords) {
        keywordsChange = lead.otherKeywords;
      } else if (!lead.otherKeywords) {
        keywordsChange = lead.keywords;
      } else if (lead.keywords && lead.otherKeywords) {
        keywordsChange = lead.keywords + " " + lead.otherKeywords;
      }

      let intention = "";
      if (lead.intention && lead.intention !== null)
        intention = intentionOptions()[lead.intention - 1].title;

      setLeadDetail({
        wechat: lead.wechatId,
        college: lead.collegeDisplay,
        status: lead.status,
        intention,
        grade: lead.grade,
        country: lead.country,
        otherKeywords: keywordsChange,
        note: lead.note,
        createdDate: lead.createdDateDisplay,
        updatedDate: lead.updateDateDisplay,
        followUpDate: lead.followUpDate,
        leadID: lead._id,
      });

      setLeadDetailOpenPopup(true);
      // );
    });
  };

  //***************************************************************
  // delete single lead
  // **************************************************************
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });
  const onDelete = (id) => {
    deleteSingleLead(id);
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
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
      <Paper className={classes.pageContent}>
        <Toolbar>
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
          <Controls.Button
            text="上传"
            variant="outlined"
            startIcon={<AddIcon />}
            className={classes.addNewButton}
            // onClick={() => setNewLeadOpenPopup(true)}
          />
        </Toolbar>
        <TblContainer>
          <TblHead />
          <TableBody>
            {recordsAfterPagingAndSorting().map((item) => (
              <TableRow key={item._id}>
                <TableCell align="center">{item.collegeDisplay}</TableCell>
                <TableCell align="center">{item.wechatId}</TableCell>
                <TableCell align="center">{item.status}</TableCell>
                <TableCell align="center">{item.country}</TableCell>
                <TableCell align="center">{item.createdDateDisplay}</TableCell>
                <TableCell align="center">{item.updateDateDisplay}</TableCell>
                <TableCell align="center">
                  <Box
                    component="span"
                    onClick={() => {
                      loadLeadDetail(item._id);
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
                      setConfirmDialog({
                        isOpen: true,
                        title: "Are you sure to delete this Lead?",
                        subTitle: "You can't undo this operation",
                        onConfirm: () => onDelete(item._id),
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
      {/* Lead upload modal */}
      <Popup
        openPopup={newLeadOpenPopup}
        setOpenPopup={setNewLeadOpenPopup}
        title="Lead Upload"
        maxWidth="md"
      >
        <NewLeadForm
          setOpenPopup={setNewLeadOpenPopup}
          // initialFValues={newRecordInitialValues}
          // makeProfile={false}
        />
      </Popup>
      {/* Lead Detail modal */}
      <Popup
        openPopup={leadDetialOpenPopup}
        setOpenPopup={setLeadDetailOpenPopup}
        title="Lead Detail"
        maxWidth="md"
      >
        <LeadDetailForm
          setOpenPopup={setLeadDetailOpenPopup}
          initialFValues={leadDetail}
        />
      </Popup>
      {/* Delete Confirm */}
      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  allColleges: state.am.allColleges,
  allLeads: state.am.allLeads,
});

export default connect(mapStateToProps, {
  uploadLead,
  updateSingleLead,
  deleteSingleLead,
})(AmLeads);
