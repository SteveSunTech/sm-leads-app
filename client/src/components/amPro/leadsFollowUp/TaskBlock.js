import React, { useState, useEffect } from "react";
import clsx from "clsx";

import {
  Box,
  Paper,
  Typography,
  Grid,
  IconButton,
  TableBody,
  TableCell,
  TableRow,
  Tooltip,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

// Icons
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import UnfoldMoreIcon from "@material-ui/icons/UnfoldMore";

// Actions
// import { updateSingleLead } from "../../../actions/lead";
import { deleteSingleLead } from "../../../actions/lead";

// Components
import LeadDetailForm from "../leads/LeadDetailForm";
import { intentionOptions } from "../../config/Leads";

// Reusable
import Popup from "../../reusable/Popup";
import useTable from "../../reusable/useTable";
import ConfirmDialog from "../../reusable/ConfirmDialog";

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
    "&:hover": {
      backgroundColor: "#fffbf2",
      cursor: "pointer",
    },
  },
  fixedHeight: {
    height: 60,
  },
  blockBox: {
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 650,
  },
  tablePaper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[2],
    padding: theme.spacing(2, 2, 2),
    marginTop: theme.spacing(2),
  },
}));

const headCells = [
  { id: "college", label: "学校" },
  { id: "wechat", label: "微信号", disableSorting: true },
  { id: "status", label: "状态" },
  { id: "createdDateDisplay", label: "创建时间" },
  { id: "updateDateDisplay", label: "更新时间" },
  { id: "followUpDate", label: "Follow Up" },
  { id: "operation", label: "操作", disableSorting: true },
];

const TaskBlock = ({ title, index }) => {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const [records, setRecords] = useState(index);
  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      return items;
    },
  });
  const [tableDisplay, setTableDisplay] = useState("none");
  const [leadDetialOpenPopup, setLeadDetailOpenPopup] = useState(false);

  useEffect(() => {
    if (index) {
      setRecords(index);
    }
  }, [index]);

  const {
    TblContainer,
    TblHead,
    TblPagination,
    recordsAfterPagingAndSorting,
  } = useTable(records, headCells, filterFn);

  //***************************************************************
  // lead detail
  // **************************************************************

  const [leadDetail, setLeadDetail] = useState({});

  const loadLeadDetail = (id) => {
    // Find exact lead in redux
    let lead = null;
    var findSingleLead = new Promise((resolve, reject) => {
      index.forEach((value) => {
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

  const toggleTable = () => {
    if (index.length > 0 && tableDisplay === "none") {
      setTableDisplay("block");
    } else {
      setTableDisplay("none");
    }
  };

  return (
    <Box className={classes.blockBox}>
      <Paper className={fixedHeightPaper}>
        <Grid container spacing={2}>
          <Grid item xs={5}>
            <Typography variant="body1" color="primary" noWrap>
              {title}
            </Typography>
          </Grid>
          <Grid item xs={5}>
            <Typography variant="body1" color="primary" noWrap>
              数量：{index ? index.length : null}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <IconButton style={{ marginTop: "-10px" }}>
              <UnfoldMoreIcon
                color="primary"
                onClick={() => {
                  toggleTable();
                }}
              />
            </IconButton>
          </Grid>
        </Grid>
      </Paper>
      <Box display={tableDisplay}>
        <Paper className={classes.tablePaper}>
          <TblContainer>
            <TblHead />
            <TableBody>
              {recordsAfterPagingAndSorting().map((item) => (
                <TableRow key={item._id}>
                  <TableCell align="center">{item.collegeDisplay}</TableCell>
                  <TableCell align="center">{item.wechatId}</TableCell>
                  <TableCell align="center">{item.status}</TableCell>
                  <TableCell align="center">
                    {item.createdDateDisplay}
                  </TableCell>
                  <TableCell align="center">{item.updateDateDisplay}</TableCell>
                  <TableCell align="center">{item.followUpDate}</TableCell>
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
      </Box>
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
    </Box>
  );
};

export default TaskBlock;
