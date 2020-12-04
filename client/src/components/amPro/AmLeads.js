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

// Actions
import { uploadLead } from "../../actions/am";
import { updateSingleLead } from "../../actions/lead";
import { deleteSingleLead } from "../../actions/lead";

// Components
import LeadDetailForm from "./leads/LeadDetailForm";
import NewLeadForm from "./leads/NewLeadForm";
import { intentionOptions } from "../config/Leads";
import FilterBar from "./leads/filterBar";

// Reusable
import Popup from "../reusable/Popup";
import useTable from "../reusable/useTable";
import Controls from "../reusable/controls/Controls";
import ConfirmDialog from "../reusable/ConfirmDialog";

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

  const handleSearch = (indexList) => {
    const copyList = { ...indexList };
    Object.keys(copyList).forEach((item) => {
      if (copyList[item] === "") delete copyList[item];
    });
    setFilterFn({
      fn: (items) => {
        console.log(indexList);
        if (Object.keys(copyList).length === 0) return items;
        else {
          const t1 = indexList.collegeDisplay;
          const t2 = indexList.status;
          const t3 = indexList.country;
          return items.filter((item) => {
            // console.log(item);
            if (
              (t1 !== "" && t1 !== item.collegeDisplay) ||
              (t2 !== "" && t2 !== item.status) ||
              (t3 !== "" && t3 !== item.country)
            ) {
              return false;
            } else {
              return true;
            }

            // Object.keys(indexList).forEach((key, index, array) => {
            //   // console.log(indexList[key]);
            //   // console.log(item[key]);
            //   if (indexList[key] !== "") {
            //     if (indexList[key] !== item[key]) {
            //       console.log(false);
            //       return false;
            //     }
            //   }

            //   if (index === array.length - 1) {
            //     console.log(true);
            //     return item;
            //   }
            // });
          });
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
      <Paper className={classes.pageContent}>
        <Toolbar>
          <FilterBar handleSearch={handleSearch} />
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
