import React, { Fragment, useState, useEffect } from "react";
import { connect, useSelector } from "react-redux";

import {
  Grid,
  Box,
  Typography,
  TableBody,
  TableCell,
  Tooltip,
  TableRow,
  IconButton,
  Toolbar,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

// Reusable
import Controls from "../../reusable/controls/Controls";
import useTable from "../../reusable/useTable";
import Popup from "../../reusable/Popup";
import ConfirmDialog from "../../reusable/ConfirmDialog";

// Components
import { intentionOptions } from "../../config/Leads";
import LeadDetailForm from "../leads/LeadDetailForm";
import NewLeadForm from "../leads/NewLeadForm";

// Icon
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";

// Actions
import { deleteSingleLead } from "../../../actions/lead";
import { addUserToProfile } from "../../../actions/profile";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    "& .MuiTextField-root": {
      margin: theme.spacing(2),
      width: 200,
    },
    // display: 'flex',
    // flexDirection: 'column',
  },
  informationBox: {
    marginTop: theme.spacing(3),
    padding: theme.spacing(3),
  },
  informationTag: {
    fontWeight: "600",
    // color: theme.palette.primary.main,
    marginBottom: theme.spacing(2),
  },
  informationContent: {
    fontWeight: "600",
    // color: theme.palette.primary.main,
    marginBottom: theme.spacing(2),
  },
  addNewButton: {
    // position: "absolute",
    // right: "10px",
    marginLeft: "50px",
  },
  participantButton: {
    marginTop: "-15px",
  },
}));

// Leads head
const headCells = [
  { id: "college", label: "学校" },
  { id: "wechat", label: "微信号", disableSorting: true },
  { id: "status", label: "状态" },
  { id: "country", label: "地区" },
  { id: "createdDateDisplay", label: "创建时间" },
  { id: "updateDateDisplay", label: "更新时间" },
  { id: "operation", label: "操作", disableSorting: true },
];

const ProfileDetail = ({
  setOpen,
  profileID,
  // action
  deleteSingleLead,
  addUserToProfile,
}) => {
  const classes = useStyles();

  const allLeads = useSelector((state) => state.am.allLeads);
  const currentProfile = useSelector((state) => state.profile.currentProfile);
  const user = useSelector((state) => state.auth.user);

  const [leadDetialOpenPopup, setLeadDetailOpenPopup] = useState(false);
  const [leads, setLeads] = useState();
  const [leadDetail, setLeadDetail] = useState({});
  const [newSimpleLeadOpenPopup, setNewSimpleLeadOpenPopup] = useState(false);
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });
  const [profileDisplay, setProfileDisplay] = useState(currentProfile);
  const [
    profileBelongsToCurrentUser,
    setProfileBelongsToCurrentUser,
  ] = useState(true);

  const initialProfileDisplay = () => {
    setProfileDisplay(currentProfile);
  };

  const loadLeads = () => {
    let leadsTemp = [];
    var findLead = new Promise((resolve, reject) => {
      allLeads.forEach((e, index) => {
        if (
          e.profileID === profileID ||
          e.profileID === currentProfile.ProfileID
        ) {
          leadsTemp.push(e);
        }
        if (index === allLeads.length - 1) resolve();
      });
    });
    findLead.then(() => {
      setLeads(leadsTemp);
    });
  };

  const reloadingLeads = () => {
    if (currentProfile && !leads) {
      loadLeads();
    }
  };

  // check if current profile belongs to current user
  const checkUser = () => {
    if (
      (currentProfile.participateUser === "" ||
        currentProfile.participateUser.length === 0) &&
      user.email !== currentProfile.createdUser
    ) {
      setProfileBelongsToCurrentUser(false);
    } else {
      if (user.email === currentProfile.createdUser)
        setProfileBelongsToCurrentUser(true);
      else {
        const processing = new Promise((resolve, reject) => {
          currentProfile.participateUser.forEach((item, index, array) => {
            if (item.UserDisplay === user.email) {
              resolve(true);
            }
            if (index === array.length - 1 || array.length === 0)
              resolve(false);
          });
        });
        processing.then((res) => {
          if (!res) {
            setProfileBelongsToCurrentUser(false);
          } else {
            setProfileBelongsToCurrentUser(true);
          }
        });
      }
    }
  };

  // add current user to current profile
  const participateProfile = () => {
    let id = profileID ? profileID : currentProfile.ProfileID;
    addUserToProfile(id);
  };

  useEffect(() => {
    loadLeads();
    initialProfileDisplay();
    checkUser();
  }, [allLeads, currentProfile]);

  // Leads Table
  const {
    TblContainer,
    TblHead,
    // TblPagination,
    // recordsAfterPagingAndSorting,
  } = useTable(leadDetail, headCells);

  // Load Lead Detail
  const loadLeadDetail = (id) => {
    // Find exact lead in redux
    let lead = null;
    var findSingleLead = new Promise((resolve, reject) => {
      leads.forEach((value) => {
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
      // console.log(leadDetail);
      setLeadDetailOpenPopup(true);
    });
  };

  const onDelete = (id) => {
    deleteSingleLead(id);
    setDeleteConfirmDialog({
      ...deleteConfirmDialog,
      isOpen: false,
    });
  };

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
        {profileBelongsToCurrentUser ? null : (
          <Box>
            <Typography
              style={{ display: "inline", fontWeight: "bold" }}
              color="secondary"
            >
              当前还未参与到此Profile中, 无法进行新建、修改Lead操作！
            </Typography>
            <Controls.Button
              text="立即参与"
              variant="outlined"
              onClick={() => participateProfile()}
            />
          </Box>
        )}
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
                    ID:
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography className={classes.informationContent}>
                    {profileDisplay.ProfileID}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={3}>
                  <Typography className={classes.informationTag}>
                    微信号:
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography className={classes.informationContent}>
                    {profileDisplay.wechatId}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={3}>
                  <Typography className={classes.informationTag}>
                    学校:
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography className={classes.informationContent}>
                    {profileDisplay.collegeDisplay}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={3}>
                  <Typography className={classes.informationTag}>
                    年级:
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography className={classes.informationContent}>
                    {profileDisplay.grade}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={3}>
                  <Typography className={classes.informationTag}>
                    地区:
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography className={classes.informationContent}>
                    {profileDisplay.country}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Grid container>
                <Grid item xs={3}>
                  <Typography className={classes.informationTag}>
                    创建者:
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography className={classes.informationContent}>
                    {profileDisplay.createdUser}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={3}>
                  <Typography className={classes.informationTag}>
                    创建时间:
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography className={classes.informationContent}>
                    {profileDisplay.createdDateDisplay}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={3}>
                  <Typography className={classes.informationTag}>
                    最后更新者:
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography className={classes.informationContent}>
                    {profileDisplay.updateDateUser
                      ? profileDisplay.updateDateUser
                      : profileDisplay.createdUser}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={3}>
                  <Typography className={classes.informationTag}>
                    最后更新时间:
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography className={classes.informationContent}>
                    {profileDisplay.updateDateDisplay}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={3}>
                  <Typography className={classes.informationTag}>
                    参与者:
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography className={classes.informationContent}>
                    {profileDisplay.participateUser === ""
                      ? "无"
                      : profileDisplay.participateUser.map(
                          (item) => item.UserDisplay
                        )}
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
          <Toolbar>
            <Grid container>
              <Grid item xs={2}>
                <Typography variant="h4" color="primary">
                  Lead
                </Typography>
              </Grid>
              <Grid item xs={8}></Grid>
              <Grid item xs={2}>
                {profileBelongsToCurrentUser ? (
                  <Controls.Button
                    text="上传"
                    variant="outlined"
                    startIcon={<AddIcon />}
                    className={classes.addNewButton}
                    onClick={() => setNewSimpleLeadOpenPopup(true)}
                  />
                ) : null}
              </Grid>
            </Grid>
          </Toolbar>
          <TblContainer>
            <TblHead />
            <TableBody>
              {leads
                ? leads.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell align="center">
                        {item.collegeDisplay}
                      </TableCell>
                      <TableCell align="center">{item.wechatId}</TableCell>
                      <TableCell align="center">{item.status}</TableCell>
                      <TableCell align="center">{item.country}</TableCell>
                      <TableCell align="center">
                        {item.createdDateDisplay}
                      </TableCell>
                      <TableCell align="center">
                        {item.updateDateDisplay}
                      </TableCell>
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
                            setDeleteConfirmDialog({
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
                  ))
                : reloadingLeads()}
            </TableBody>
          </TblContainer>
        </Box>
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
      {/* Lead upload modal */}
      <Popup
        openPopup={newSimpleLeadOpenPopup}
        setOpenPopup={setNewSimpleLeadOpenPopup}
        title="Lead Upload"
        maxWidth="md"
      >
        <NewLeadForm
          setOpenPopup={setNewSimpleLeadOpenPopup}
          initialFValues={{
            wechat: currentProfile.wechatId,
            status: "",
            college: currentProfile.collegeDisplay,
            grade: currentProfile.grade,
            country: currentProfile.country,
            otherKeywords: "",
            note: "",
            intention: "",
          }}
          makeProfile={false}
          ProfileID={profileID}
        />
      </Popup>
      {/* Delete Lead Confirm */}
      <ConfirmDialog
        confirmDialog={deleteConfirmDialog}
        setConfirmDialog={setDeleteConfirmDialog}
      />
    </Fragment>
  );
};

export default connect(null, { deleteSingleLead, addUserToProfile })(
  ProfileDetail
);
