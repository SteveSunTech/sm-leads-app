import React, { useState, useEffect, Fragment } from "react";
import { connect, useSelector } from "react-redux";

import { makeStyles } from "@material-ui/styles";
import {
  // Tooltip,
  Grid,
  // FormGroup,
  // FormControlLabel,
  FormLabel,
  Divider,
  // FormControl,
  // FormHelperText,
  Typography,
  Box,
} from "@material-ui/core";

// Reusable
import Controls from "../../reusable/controls/Controls";
import { useForm, Form } from "../../reusable/useForm";
import Popup from "../../reusable/Popup";
import {
  statusOptions,
  intentionOptions,
  gradeOptions,
  countryOptions,
} from "../../config/Leads";

// Actions
import { updateSingleLead } from "../../../actions/lead";

// Components
import LogDetail from "./LogDetail";

const useStyle = makeStyles((theme) => ({
  keywordsLable: {
    marginBottom: theme.spacing(1),
  },
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  actionButtonWrap: {
    display: "flex",
    justifyContent: "center",
    marginTop: theme.spacing(3),
    gap: "24px",
  },
  dateWrapper: {
    marginTop: theme.spacing(2),
  },
  dateGap: {
    marginRight: theme.spacing(2),
  },
  logBlock: {
    padding: theme.spacing(1),
  },
}));

const LeadDetailForm = ({
  initialFValues,
  allColleges,
  updateSingleLead,
  setOpenPopup,
}) => {
  // console.log(initialFValues);
  // console.log(allColleges);
  allColleges.push({
    title: initialFValues.college,
  });
  const classes = useStyle();

  const allLeads = useSelector((state) => state.am.allLeads);
  const [followUpDate, setFollowUpDate] = useState(initialFValues.followUpDate);
  const [log, setLog] = useState();
  const [logDetailOpenPopup, setLogDetailOpenPopup] = useState(false);
  const [logDetail, setLogDetail] = useState();

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("wechat" in fieldValues)
      temp.wechat = fieldValues.wechat ? "" : "必须输入微信号！";
    if ("college" in fieldValues)
      temp.college = fieldValues.college ? "" : "必须选择学校！";
    if ("status" in fieldValues)
      temp.status = fieldValues.status ? "" : "必须选择状态！";
    setErrors({
      ...temp,
    });

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === "");
  };

  // Use Form
  const {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    resetForm,
  } = useForm(initialFValues, true, validate);

  // Parse Values
  let {
    college,
    country,
    grade,
    intention,
    note,
    otherKeywords,
    status,
    wechat,
  } = values;

  // Handle intention box display
  const [intentionDisplay, setIntentionDisplay] = useState("none");
  const handleIntentionDisplay = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
    if (e.target.value === statusOptions()[1].title)
      setIntentionDisplay("block");
    else setIntentionDisplay("none");
  };

  // Handle follow up days change
  const handleIntention = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
    // To be finished
    // if (e.target.value) {

    // }
  };

  // console.log(initialFValues);
  // Handle initial intention value
  const initialIntentionDisplay = () => {
    if (intention) {
      setIntentionDisplay("block");
      setFollowUpDate(initialFValues.followUpDate);
    }
  };
  // console.log(initialFValues);
  useEffect(() => {
    initialIntentionDisplay();
    prepareLogData();
  }, [initialFValues.leadID]);

  // reset Text area
  const resetOtherArea = () => {
    document.getElementById("am-lead-update-note").value = initialFValues.note;
    document.getElementById("am-lead-update-otherKeywords").value =
      initialFValues.otherKeywords;
    initialIntentionDisplay();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Set purchase intention number
    let intentionID = "";
    if (status === statusOptions()[1].title) {
      intentionOptions().forEach((item) => {
        if (item.title === intention) {
          intentionID = item.id;
        }
      });
    }

    if (validate()) {
      const updatedData = {
        wechat,
        status,
        college,
        grade,
        country,
        otherKeywords,
        note,
        _id: initialFValues.leadID,
        intentionID,
      };
      // console.log(updatedData);
      // console.log(initialFValues);
      findDifferent(updatedData, initialFValues);
    }
  };

  // Find different to generate log data
  const findDifferent = (updated, original) => {
    let differentArray = [];
    const processing = new Promise((resolve, reject) => {
      if (updated.intentionID >= 1) {
        updated.intention = intentionOptions()[updated.intentionID - 1].title;
        // delete updated.intentionID;
      }
      Object.keys(updated).forEach((item, index, array) => {
        if (item !== "_id" && item !== "intentionID") {
          if (updated[item] !== original[item]) {
            differentArray.push({
              name: item,
              old: original[item],
              new: updated[item],
            });
          }
        }
        if (index === array.length - 1) resolve();
      });
    });
    processing.then(() => {
      // console.log(differentArray);
      const {
        wechat,
        status,
        college,
        grade,
        country,
        otherKeywords,
        note,
        intentionID,
      } = updated;
      updateSingleLead(
        wechat,
        status,
        college,
        grade,
        country,
        otherKeywords,
        note,
        initialFValues.leadID,
        intentionID,
        differentArray
      );
      setOpenPopup(false);
      resetOtherArea();
      resetForm();
    });
  };

  // Prepare log data
  const prepareLogData = () => {
    const processing = new Promise((resolve, reject) => {
      if (allLeads) {
        allLeads.forEach((item) => {
          if (item._id === initialFValues.leadID) resolve(item);
        });
      }
      resolve();
    });
    processing.then((result) => {
      setLog(result.updatedLog);
    });
  };

  // Load log detail
  const loadLogDetail = (log) => {
    setLogDetail(log);
    setLogDetailOpenPopup(true);
  };

  return (
    <Fragment>
      <Form onSubmit={handleSubmit}>
        <Grid container>
          <Grid item xs={6}>
            <Controls.Input
              name="wechat"
              label="微信号 *"
              value={wechat}
              onChange={handleInputChange}
              error={errors.wechat}
            />
            <Controls.Select
              name="college"
              label="学校 *"
              value={college}
              onChange={handleInputChange}
              options={allColleges}
              error={errors.college}
            />
            <Controls.Select
              name="status"
              label="状态 *"
              value={status}
              onChange={(e) => {
                handleIntentionDisplay(e);
                // handleInputChange(e);
              }}
              options={statusOptions()}
              error={errors.status}
            />
            {/* {typeof intention === ("number" || undefined) ? null : ( */}
            <Box display={intentionDisplay}>
              <Controls.Select
                name="intention"
                label="购买意向"
                value={intention}
                onChange={(e) => handleIntention(e)}
                options={intentionOptions()}
                error={errors.intention}
              />
            </Box>
            {/* )} */}
            <Controls.Select
              name="grade"
              label="年级"
              value={grade}
              onChange={handleInputChange}
              options={gradeOptions()}
            />
            <Controls.Select
              name="country"
              label="地理位置"
              value={country}
              onChange={handleInputChange}
              options={countryOptions()}
            />
          </Grid>
          <Grid item xs={6}>
            <FormLabel component="legend" className={classes.keywordsLable}>
              关键词：
            </FormLabel>
            <Controls.Textarea
              id="am-lead-update-otherKeywords"
              name="otherKeywords"
              // value={otherKeywords}
              defaultValue={otherKeywords}
              rows={2}
              placeholder="关键词"
              onChange={handleInputChange}
              className={classes.block}
            />
            <Divider className={classes.divider} />
            <Controls.Textarea
              id="am-lead-update-note"
              name="note"
              rows={4}
              // value={note}
              defaultValue={note}
              placeholder="备注信息"
              onChange={handleInputChange}
              className={classes.block}
            />
            <Divider className={classes.divider} />
            <Box
              border={1}
              borderColor="primary.light"
              width={"100%"}
              className={classes.logBlock}
            >
              <Typography variant={"body1"} color={"primary"}>
                Log:
              </Typography>
              {log
                ? log.map((item) => (
                    <Box
                      border={1}
                      borderColor="primary.light"
                      width={"100%"}
                      // className={classes.logInnerBlock}
                    >
                      <Grid container className={classes.logBlock}>
                        <Grid item xs={5}>
                          时间：{item.updateDateDisplay}
                        </Grid>
                        <Grid item xs={5}>
                          用户：{item.UserDisplay}
                        </Grid>
                        <Grid item xs={2}>
                          <Controls.Button
                            text="查看"
                            size={"small"}
                            // style={{ marginTop: "-2px" }}
                            onClick={() => loadLogDetail(item)}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  ))
                : null}
            </Box>
            <Box className={classes.dateWrapper}>
              <Grid container>
                <Grid item xs={6}>
                  <Typography variant={"body1"} color={"primary"}>
                    创建时间：{initialFValues.createdDate}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant={"body1"} color={"primary"}>
                    更新时间：{initialFValues.updatedDate}
                  </Typography>
                </Grid>
                <Grid item xs={6} className={classes.dateWrapper}>
                  <Typography variant={"body1"} color={"primary"}>
                    Follow up：
                    {followUpDate ? followUpDate : "未指定"}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <div className={classes.actionButtonWrap}>
              {/* <Controls.Button type="submit" text="更新" /> */}
              <Controls.Button type="submit" text="Follow Up" green={true} />
              <Controls.Button
                text="重置修改"
                color="default"
                onClick={() => {
                  resetForm();
                  resetOtherArea();
                }}
              />
            </div>
          </Grid>
        </Grid>
      </Form>
      {/* Log Detail modal */}
      <Popup
        openPopup={logDetailOpenPopup}
        setOpenPopup={setLogDetailOpenPopup}
        title="Log Detail"
        maxWidth="md"
      >
        <LogDetail log={logDetail} />
      </Popup>
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  allColleges: state.am.allColleges,
});

export default connect(mapStateToProps, {
  updateSingleLead,
})(LeadDetailForm);
