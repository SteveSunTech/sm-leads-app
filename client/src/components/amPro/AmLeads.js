import React, { useState, useEffect, Fragment } from "react";
import { connect } from "react-redux";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/styles";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import BackupIcon from "@material-ui/icons/Backup";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
// import TableContainer from '@material-ui/core/TableContainer';
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
// import Divider from "@material-ui/core/Divider";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
// import FormHelperText from '@material-ui/core/FormHelperText';
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import FormLabel from "@material-ui/core/FormLabel";
import Box from "@material-ui/core/Box";

import { uploadLead } from "../../actions/am";
import { Checkbox, FormGroup } from "@material-ui/core";
import { getWechatIndex } from "../../actions/am";
import { getCollegeIndexOfCurrentUser } from "../../actions/am";
// import { set } from "mongoose";
import { getSingleLead } from "../../actions/lead";
import { updateSingleLead } from "../../actions/lead";
import { deleteSingleLead } from "../../actions/lead";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: 200,
    },
    // display: 'flex',
    // flexDirection: 'column',
  },
  modalPopupButton: {
    marginTop: "30px",
    marginBottom: "30px",
    border: "none",
    color: "white",
    backgroundColor: "#a000a0",
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
  formBlock: {
    // display: 'flex',
    // justifyContent: 'center',
    // paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(3),
  },
  formBlockLast: {
    marginTop: theme.spacing(3),
  },
  container: {
    // marginTop: '30px',
    marginBottom: "30px",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  modalInnerUpload: {
    marginLeft: "40%",
  },
  modalInnerUpload2: {
    backgroundColor: "green",
    color: "white",
    "&:hover": {
      backgroundColor: "lightgreen",
    },
  },
  modalInnerUpload3: {
    backgroundColor: "red",
    color: "white",
    "&:hover": {
      backgroundColor: "lightpink",
    },
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    // border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(6, 6, 6),
  },
  uploadTextarea: {
    width: "100%",
    padding: theme.spacing(1),
  },
  formLable: {
    marginBottom: "10px",
  },
  updateTime: {
    marginLeft: "30px",
  },
}));

const Upload = ({
  subAlert,
  uploadLead,
  getWechatIndex,
  getSingleLead,
  updateSingleLead,
  deleteSingleLead,
  getCollegeIndexOfCurrentUser,
}) => {
  const classes = useStyles();

  //***************************************************************
  // upload new lead
  // **************************************************************

  // wechat status
  const [formData, setFormData] = useState({
    wechat: "",
    status: "",
    college: "",
    grade: "",
    country: "",
    otherKeywords: "",
    note: "",
    intention: "",
  });

  const {
    wechat,
    status,
    college,
    grade,
    country,
    otherKeywords,
    note,
    intention,
  } = formData;

  const onChangeStatus = (e) => {
    setFormData({
      ...formData,
      status: e.target.value,
    });
    if (e.target.value === "未购买") {
      setIntentionDisplay("inline");
      setPurchaseIntention("");
    } else {
      setIntentionDisplay("none");
    }
  };

  const onChangeWeChat = (e) =>
    setFormData({
      ...formData,
      wechat: e.target.value,
    });

  // check box
  const [checked, setChecked] = useState({
    checked1: false,
    checked2: false,
    checked3: false,
    checked4: false,
    checked5: false,
    checked6: false,
  });

  const {
    checked1,
    checked2,
    checked3,
    checked4,
    checked5,
    checked6,
  } = checked;

  const checkedChange = (e) => {
    setChecked({
      ...checked,
      [e.target.name]: e.target.checked,
    });
  };

  // submit form
  const onSubmit = async (e) => {
    e.preventDefault();

    if (wechat === "" || status === "" || college === "") {
      return;
    }

    let checkedItem = [];
    if (checked1 === true) {
      checkedItem.push("疫苗");
    }
    if (checked2 === true) {
      checkedItem.push("体检");
    }
    if (checked3 === true) {
      checkedItem.push("看病");
    }
    if (checked4 === true) {
      checkedItem.push("理赔");
    }
    if (checked5 === true) {
      checkedItem.push("价格");
    }
    if (checked6 === true) {
      checkedItem.push("Waive");
    }

    await uploadLead(
      wechat,
      status,
      checkedItem,
      college,
      grade,
      country,
      otherKeywords,
      note,
      intention
    );

    setOpen(false);

    getTableData();
  };

  // upload modal popup
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
    setCollege("");
    setCountry("");
    setGrade("");
    setPurchaseIntention("");
    setFormData({
      wechat: "",
      college: "",
      status: "",
      grade: "",
      country: "",
      note: "",
      otherKeywords: "",
    });
    setChecked({
      checked1: false,
      checked2: false,
      checked3: false,
      checked4: false,
      checked5: false,
      checked6: false,
    });
  };

  const handleClose = () => {
    setOpen(false);
    setIntentionDisplay("none");
  };

  // new lead form college dropdown
  const [collegeDropDown, setCollege] = useState("");
  const collgeChange = (e) => {
    setCollege(e.target.value);
    setFormData({
      ...formData,
      college: e.target.value,
    });
  };

  // new lead form grade dropdown
  const [gradeDropDown, setGrade] = useState("");
  const gradeChange = (e) => {
    setGrade(e.target.value);
    setFormData({
      ...formData,
      grade: e.target.value,
    });
  };

  // new lead form country dropdown
  const [countryDropDown, setCountry] = useState("");
  const countryChange = (e) => {
    setCountry(e.target.value);
    setFormData({
      ...formData,
      country: e.target.value,
    });
  };

  // upload textarea change
  const onChangeUploadTextarea = (e) =>
    setFormData({
      ...formData,
      note: e.target.value,
    });

  // upload other keywords change
  const onChangeUploadOtherKeywords = (e) =>
    setFormData({
      ...formData,
      otherKeywords: e.target.value,
    });

  //***************************************************************
  // change lead status
  // **************************************************************

  const [open2, setOpen2] = useState(false);

  const handleOpen2 = () => {
    setOpen2(true);
  };

  const handleClose2 = () => {
    setOpen2(false);
    setIntentionDisplay2("none");
  };

  // edit lead dropdown
  // const edit

  // lead change form
  const [formData2, setFormData2] = useState({
    wechat2: "",
    status2: "",
    college2: "",
    grade2: "",
    country2: "",
    otherKeywords2: "",
    note2: "",
    intention2: "",
  });

  const {
    wechat2,
    status2,
    college2,
    grade2,
    country2,
    otherKeywords2,
    note2,
    intention2,
  } = formData2;

  // change lead form college dropdown
  const [collegeDropDown2, setCollege2] = useState("");
  const collgeChange2 = (e) => {
    setCollege2(e.target.value);
    setFormData2({
      ...formData2,
      college2: e.target.value,
    });
  };

  // change lead form grade dropdown
  const [gradeDropDown2, setGrade2] = useState("");
  const gradeChange2 = (e) => {
    setGrade2(e.target.value);
    setFormData2({
      ...formData2,
      grade2: e.target.value,
    });
  };

  // change lead form country dropdown
  const [countryDropDown2, setCountry2] = useState("");
  const countryChange2 = (e) => {
    setCountry2(e.target.value);
    setFormData2({
      ...formData2,
      country2: e.target.value,
    });
  };

  // change lead upload textarea change
  const onChangeUploadTextarea2 = (e) =>
    setFormData2({
      ...formData2,
      note2: e.target.value,
    });

  const [statusDropDown2, setStatus2] = useState("");
  const onChangeStatus2 = (e) => {
    setStatus2(e.target.value);
    setFormData2({
      ...formData2,
      status2: e.target.value,
    });
    if (e.target.value === "未购买") {
      setIntentionDisplay2("inline");
      setPurchaseIntention2("");
    } else {
      setIntentionDisplay2("none");
    }
  };

  const onChangeWeChat2 = (e) =>
    setFormData2({
      ...formData2,
      wechat2: e.target.value,
    });

  // keywords change
  const onChangeUploadOtherKeywords2 = (e) =>
    setFormData2({
      ...formData2,
      otherKeywords2: e.target.value,
    });

  const onSubmit2 = async (e) => {
    e.preventDefault();

    if (wechat2 === "" || status2 === "" || college2 === "") {
      return;
    }

    await updateSingleLead(
      wechat2,
      status2,
      college2,
      grade2,
      country2,
      otherKeywords2,
      note2,
      leadID,
      intention2
    );

    setOpen2(false);
    getTableData();
  };

  //***************************************************************
  // lead detail
  // **************************************************************

  const [leadData, setLeadData] = useState({});
  const [leadID, setLeadID] = useState("");

  const loadLeadDetail = (id) => {
    getSingleLead(id).then(function (data) {
      setLeadData({});

      let keywordsChange = "";
      if (!data.keywords) {
        keywordsChange = data.otherKeywords;
      } else if (!data.otherKeywords) {
        keywordsChange = data.keywords;
      } else if (data.keywords && data.otherKeywords) {
        keywordsChange = data.keywords + " " + data.otherKeywords;
      }

      let dataCash = {
        wechat: data.wechatId,
        college: data.collegeDisplay,
        country: data.country,
        grade: data.grade,
        group: data.groupDisplay,
        status: data.status,
        create: data.createdDateDisplay,
        update: data.updateDateDisplay,
        keywordsChange,
        note: data.note,
      };

      setCollege2(dataCash.college);
      setGrade2(dataCash.grade);
      setCountry2(dataCash.country);
      setStatus2(dataCash.status);
      setLeadData(dataCash);

      setFormData2({
        wechat2: dataCash.wechat,
        status2: dataCash.status,
        college2: dataCash.college,
        grade2: dataCash.grade,
        country2: dataCash.country,
        otherKeywords2: dataCash.keywordsChange,
        note2: dataCash.note,
      });

      if (data.intention) {
        setIntentionDisplay2("inline");
        setPurchaseIntention2(data.intention);
        setFormData2({
          ...formData2,
          intention2: data.intention,
        });
      }

      handleOpen2();
    });
  };

  // function LeadDetail() {
  //   var leadDeatailLoad = new Promise((resolve, reject) => {
  //     getSingleLead(leadID).then(function (data) {
  //       resolve(data);
  //     });
  //   });

  //   leadDeatailLoad.then((data) => {
  //     console.log(data);
  //     return (
  //       <Fragment>
  //         <p>hello</p>
  //       </Fragment>
  //     );
  //   });
  // }

  //***************************************************************
  // delete single lead
  // **************************************************************
  const deleteLead = () => {
    deleteSingleLead(leadID);
    setTimeout(() => getTableData(), 200);
    setOpen2(false);
  };

  //***************************************************************
  // 购买意向
  // **************************************************************

  const [purchaseIntention, setPurchaseIntention] = useState("");
  const [intentionDisplay, setIntentionDisplay] = useState("none");
  const onChangePurchaseIntention = (e) => {
    setPurchaseIntention(e.target.value);
    setFormData({
      ...formData,
      intention: e.target.value,
    });
  };

  const [purchaseIntention2, setPurchaseIntention2] = useState("");
  const [intentionDisplay2, setIntentionDisplay2] = useState("none");
  const onChangePurchaseIntention2 = (e) => {
    setPurchaseIntention2(e.target.value);
    setFormData2({
      ...formData2,
      intention2: e.target.value,
    });
  };

  //***************************************************************
  // get college list belong to current user
  // **************************************************************

  function createAllCollegeDropdownData(name) {
    return {
      name,
    };
  }

  let rowsForCollege = [];

  const [allCollegeValue, setAllCollegeValue] = useState();

  const getCollegeList = () => {
    getCollegeIndexOfCurrentUser().then(function (data) {
      // console.log(data.data);
      if (data.data) {
        var bar = new Promise((resolve, reject) => {
          data.data.forEach(async (e) => {
            rowsForCollege.push(createAllCollegeDropdownData(e.collegeDisplay));
            if (data.data.length === rowsForCollege.length) resolve();
          });
        });

        bar.then(() => {
          setAllCollegeValue("");
          setAllCollegeValue(rowsForCollege);
        });
      }
    });
  };

  //***************************************************************
  // lead index
  // **************************************************************

  // table data
  function createData(id, college, wechat, status, country, created, update) {
    return {
      id,
      college,
      wechat,
      status,
      country,
      created,
      update,
    };
  }

  const [value, setValue] = useState();
  const getTableData = () => {
    getWechatIndex().then(function (data) {
      if (data.length !== 0) {
        data.forEach((e) => {
          rows.push(
            createData(
              e._id,
              e.collegeDisplay,
              // e.groupDisplay,
              e.wechatId,
              e.status,
              e.country,
              e.createdDateDisplay,
              e.updateDateDisplay
            )
          );
          setValue("");
          setValue(rows);
        });
      } else {
        const table = document.getElementById("all-leads-table");
        if (table.tBodies[0].rows.length === 1) {
          table.removeChild(table.getElementsByTagName("tbody")[0]);
          setValue([]);
        }
      }
    });
  };
  const rows = [];

  // 性能需要提升
  useEffect(() => {
    getTableData();
    getCollegeList();
  }, []);

  return (
    <Fragment>
      <Button
        onClick={handleOpen}
        variant="contained"
        color="primary"
        className={classes.modalPopupButton}
      >
        <BackupIcon className={classes.uploadIcon} />
        Upload
      </Button>
      <TableContainer component={Paper}>
        <Table className={classes.table} id="all-leads-table">
          <TableHead>
            <TableRow>
              <TableCell align="center"> 学校 </TableCell>
              <TableCell align="center"> 微信号 </TableCell>
              <TableCell align="center"> 状态 </TableCell>
              <TableCell align="center"> 地区 </TableCell>
              <TableCell align="center"> 创建时间 </TableCell>
              <TableCell align="center"> 更新时间 </TableCell>
              <TableCell align="center"> 操作 </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {value
              ? value.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell component="th" scope="row" align="center">
                      {e.college}
                    </TableCell>
                    <TableCell align="center"> {e.wechat} </TableCell>
                    <TableCell align="center"> {e.status} </TableCell>
                    <TableCell align="center"> {e.country} </TableCell>
                    <TableCell align="center"> {e.created} </TableCell>
                    <TableCell align="center"> {e.update} </TableCell>
                    <TableCell
                      key={e.id}
                      align="center"
                      onMouseEnter={() => setLeadID(e.id)}
                    >
                      <FormControl
                        variant="outlined"
                        className={classes.formControl}
                      >
                        <InputLabel id="edit-single-lead">Edit</InputLabel>
                        <Select
                          labelId="edit-single-lead"
                          id="edit-single-lead"
                          label="Edit"
                          value={""}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              loadLeadDetail(e.id);
                            }}
                          >
                            修改
                          </MenuItem>
                          <MenuItem
                            onClick={async () => {
                              setTimeout(() => deleteLead(), 2000);
                            }}
                          >
                            删除
                          </MenuItem>
                        </Select>
                      </FormControl>
                      {/* <Button
                        color="primary"
                        onClick={() => {
                          loadLeadDetail(e.id);
                          setLeadID(e.id);
                        }}
                      >
                        更多
                      </Button> */}
                    </TableCell>
                  </TableRow>
                ))
              : null}
          </TableBody>
        </Table>
      </TableContainer>
      {/* upload modal */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <form
              noValidate
              autoComplete="off"
              onSubmit={(e) => onSubmit(e)}
              className={classes.root}
              autoComplete="off"
            >
              <div className={classes.formBlock}>
                <FormControl required className={classes.formControl}>
                  <InputLabel id="college"> 学校 </InputLabel>
                  <Select
                    labelId="college"
                    id="demo-simple-select-outlined"
                    value={collegeDropDown}
                    onChange={collgeChange}
                    label="college"
                  >
                    <MenuItem value="">
                      <em>无信息</em>
                    </MenuItem>
                    {allCollegeValue
                      ? allCollegeValue.map((e) => (
                          <MenuItem
                            key={Math.floor(Math.random() * 100000)}
                            value={e.name}
                          >
                            {e.name}
                          </MenuItem>
                        ))
                      : null}
                  </Select>
                  {/* <FormHelperText>必/FormHelperText> */}
                </FormControl>
                <FormControl className={classes.formControl}>
                  <InputLabel id="grade"> 年级 </InputLabel>
                  <Select
                    labelId="grade"
                    id="demo-simple-select-outlined"
                    value={gradeDropDown}
                    onChange={gradeChange}
                    label="grade"
                  >
                    <MenuItem value="">
                      <em>无信息</em>
                    </MenuItem>
                    <MenuItem value={"大一"}> 大一 </MenuItem>{" "}
                    <MenuItem value={"大二"}> 大二 </MenuItem>{" "}
                    <MenuItem value={"大三"}> 大三 </MenuItem>{" "}
                    <MenuItem value={"大四"}> 大四 </MenuItem>{" "}
                    <MenuItem value={"研一"}> 研一 </MenuItem>{" "}
                    <MenuItem value={"研二"}> 研二 </MenuItem>{" "}
                    <MenuItem value={"博士"}> 博士 </MenuItem>
                  </Select>
                </FormControl>
                <FormControl className={classes.formControl}>
                  <InputLabel id="country"> 地理位置 </InputLabel>
                  <Select
                    labelId="country"
                    id="demo-simple-select-outlined"
                    value={countryDropDown}
                    onChange={countryChange}
                    label="country"
                  >
                    <MenuItem value="">
                      <em>无信息</em>
                    </MenuItem>
                    <MenuItem value={"国内"}> 国内 </MenuItem>
                    <MenuItem value={"美国"}> 美国 </MenuItem>{" "}
                  </Select>
                </FormControl>
              </div>
              <div className={classes.formBlock}>
                {/* <FormControl required className={classes.formControl}> */}
                <TextField
                  label="微信号"
                  id="wechat"
                  // defaultValue="Normal"
                  // variant="outlined"
                  onChange={(e) => onChangeWeChat(e)}
                  required
                />
                {/* <FormHelperText>必填*</FormHelperText> */}
                {/* </FormControl> */}
                <FormControl required className={classes.formControl}>
                  <InputLabel id="demo-simple-select-label"> 状态 </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={status}
                    onChange={(e) => onChangeStatus(e)}
                  >
                    <MenuItem value={"已购买"}> 已购买 </MenuItem>
                    <MenuItem value={"未购买"}> 未购买 </MenuItem>
                    <MenuItem value={"无意向购买"}> 无意向购买 </MenuItem>
                  </Select>
                </FormControl>
                <Box display={intentionDisplay}>
                  <FormControl className={classes.formControl}>
                    <InputLabel id="demo-simple-select-label">
                      购买意向
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={purchaseIntention}
                      onChange={(e) => onChangePurchaseIntention(e)}
                    >
                      <MenuItem value={"1"}>
                        还未询问，回应冷淡（一周后follow）
                      </MenuItem>
                      <MenuItem value={"2"}>
                        询问较多问题，有明显兴趣（3天后follow）
                      </MenuItem>
                      <MenuItem value={"3"}>
                        强烈购买意向，马上购买（2天后follow）
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </div>
              {/* <Divider /> */}
              <div className={classes.formBlock}>
                <FormControl
                  component="fieldset"
                  className={classes.formControl}
                >
                  <FormLabel component="legend"> 关键词： </FormLabel>
                  <FormGroup row>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={checked.checked1}
                          onChange={checkedChange}
                          name="checked1"
                          color="primary"
                        />
                      }
                      label="疫苗"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={checked.checked2}
                          onChange={checkedChange}
                          name="checked2"
                          color="primary"
                        />
                      }
                      label="体检"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={checked.checked3}
                          onChange={checkedChange}
                          name="checked3"
                          color="primary"
                        />
                      }
                      label="看病"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={checked.checked4}
                          onChange={checkedChange}
                          name="checked4"
                          color="primary"
                        />
                      }
                      label="理赔"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={checked.checked5}
                          onChange={checkedChange}
                          name="checked5"
                          color="primary"
                        />
                      }
                      label="价格"
                    />
                  </FormGroup>
                  <FormGroup row>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={checked.checked6}
                          onChange={checkedChange}
                          name="checked6"
                          color="primary"
                        />
                      }
                      label="Waive"
                    />
                  </FormGroup>
                  <FormGroup row>
                    <FormControlLabel
                      control={
                        <TextField
                          label="其他关键词"
                          id="uploadOtherKeywords"
                          onChange={onChangeUploadOtherKeywords}
                        />
                      }
                    />
                  </FormGroup>
                </FormControl>
              </div>{" "}
              {/* <Divider /> */}
              <div className={classes.formBlock}>
                <TextareaAutosize
                  aria-label="minimum height"
                  rowsMin={3}
                  placeholder="备注信息"
                  className={classes.uploadTextarea}
                  onChange={onChangeUploadTextarea}
                />
              </div>
              <div className={classes.formBlock}>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.modalInnerUpload}
                  type="submit"
                >
                  上传
                </Button>
              </div>
            </form>
          </div>
        </Fade>
      </Modal>
      {/* **************************************************
      lead change modal
      ************************************************** */}
      <Modal
        className={classes.modal}
        open={open2}
        onClose={handleClose2}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open2}>
          <div className={classes.paper}>
            <form
              noValidate
              autoComplete="off"
              onSubmit={(e) => onSubmit2(e)}
              className={classes.root}
              autoComplete="off"
            >
              <div className={classes.formBlock}>
                <FormControl required className={classes.formControl}>
                  <InputLabel id="college"> 学校 </InputLabel>
                  <Select
                    labelId="college"
                    id="demo-simple-select-outlined"
                    value={collegeDropDown2}
                    onChange={(e) => collgeChange2(e)}
                    label="college"
                  >
                    {allCollegeValue
                      ? allCollegeValue.map((e) => (
                          <MenuItem
                            key={Math.floor(Math.random() * 100000)}
                            value={e.name}
                          >
                            {e.name}
                          </MenuItem>
                        ))
                      : null}
                  </Select>
                  {/* <FormHelperText>必/FormHelperText> */}
                </FormControl>
                <FormControl className={classes.formControl}>
                  <InputLabel id="grade"> 年级 </InputLabel>
                  <Select
                    labelId="grade"
                    id="demo-simple-select-outlined"
                    value={gradeDropDown2}
                    onChange={(e) => gradeChange2(e)}
                    label="grade"
                  >
                    <MenuItem value={"大一"}> 大一 </MenuItem>
                    <MenuItem value={"大二"}> 大二 </MenuItem>
                    <MenuItem value={"大三"}> 大三 </MenuItem>
                    <MenuItem value={"大四"}> 大四 </MenuItem>
                    <MenuItem value={"研一"}> 研一 </MenuItem>
                    <MenuItem value={"研二"}> 研二 </MenuItem>
                    <MenuItem value={"博士"}> 博士 </MenuItem>
                  </Select>
                </FormControl>
                <FormControl className={classes.formControl}>
                  <InputLabel id="country"> 地理位置 </InputLabel>
                  <Select
                    labelId="country"
                    id="demo-simple-select-outlined"
                    value={countryDropDown2}
                    onChange={(e) => countryChange2(e)}
                    label="country"
                  >
                    <MenuItem value={"国内"}> 国内 </MenuItem>
                    <MenuItem value={"美国"}> 美国 </MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className={classes.formBlock}>
                {/* <FormControl required className={classes.formControl}> */}
                <TextField
                  label="微信号"
                  id="wechat"
                  // defaultValue="Normal"
                  // variant="outlined"
                  onChange={(e) => onChangeWeChat2(e)}
                  required
                  // variant="outlined"
                  defaultValue={leadData.wechat}
                />
                {/* <FormHelperText>必填*</FormHelperText> */}
                {/* </FormControl> */}
                <FormControl required className={classes.formControl}>
                  <InputLabel id="demo-simple-select-label"> 状态 </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={statusDropDown2}
                    onChange={(e) => onChangeStatus2(e)}
                  >
                    <MenuItem value={"已购买"}> 已购买 </MenuItem>
                    <MenuItem value={"未购买"}> 未购买 </MenuItem>
                    <MenuItem value={"无意向购买"}> 无意向购买 </MenuItem>
                  </Select>
                  {/* <FormHelperText>必填*</FormHelperText> */}
                </FormControl>
                <Box display={intentionDisplay2}>
                  <FormControl className={classes.formControl}>
                    <InputLabel id="demo-simple-select-label">
                      购买意向
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={purchaseIntention2}
                      onChange={(e) => onChangePurchaseIntention2(e)}
                    >
                      <MenuItem value={"1"}>
                        还未询问，回应冷淡（一周后follow）
                      </MenuItem>
                      <MenuItem value={"2"}>
                        询问较多问题，有明显兴趣（3天后follow）
                      </MenuItem>
                      <MenuItem value={"3"}>
                        强烈购买意向，马上购买（2天后follow）
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </div>
              {/* <Divider /> */}
              <div className={classes.formBlock}>
                <FormLabel component="legend" className={classes.formLable}>
                  关键词：
                </FormLabel>
                <TextareaAutosize
                  aria-label="minimum height"
                  rowsMin={2}
                  placeholder="关键词"
                  className={classes.uploadTextarea}
                  onChange={onChangeUploadOtherKeywords2}
                  defaultValue={leadData.keywordsChange}
                />
              </div>
              {/* <Divider /> */}
              <div className={classes.formBlock}>
                <FormLabel component="legend" className={classes.formLable}>
                  备注信息：
                </FormLabel>
                <TextareaAutosize
                  aria-label="minimum height"
                  rowsMin={3}
                  placeholder="备注信息"
                  className={classes.uploadTextarea}
                  onChange={onChangeUploadTextarea2}
                  defaultValue={leadData.note}
                />
              </div>
              <div className={classes.formBlock}>
                创建时间：{leadData.create}
                <span className={classes.updateTime}>
                  最后更新：{leadData.update}
                </span>
              </div>
              <div className={classes.formBlockLast}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "80px",
                  }}
                >
                  <Button
                    variant="contained"
                    // color="primary"
                    className={classes.modalInnerUpload2}
                    type="submit"
                  >
                    更新
                  </Button>
                  <Button
                    variant="contained"
                    // color="primary"
                    className={classes.modalInnerUpload3}
                    type="button"
                    onClick={() => deleteLead()}
                  >
                    删除
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </Fade>
      </Modal>
      {/* data change modal */}
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  subAlert: state.subAlert,
});

export default connect(mapStateToProps, {
  uploadLead,
  getWechatIndex,
  getSingleLead,
  updateSingleLead,
  deleteSingleLead,
  getCollegeIndexOfCurrentUser,
})(Upload);
