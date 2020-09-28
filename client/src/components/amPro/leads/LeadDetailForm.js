import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

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
  Box,
} from "@material-ui/core";

import Controls from "../../reusable/controls/Controls";
import { useForm, Form } from "../../reusable/useForm";
import {
  statusOptions,
  intentionOptions,
  gradeOptions,
  countryOptions,
} from "../../config/Leads";
import { updateSingleLead } from "../../../actions/lead";

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
    marginTop: theme.spacing(1),
  },
  dateGap: {
    marginRight: theme.spacing(2),
  },
}));

const LeadDetailForm = ({
  initialFValues,
  allColleges,
  updateSingleLead,
  setOpenPopup,
}) => {
  const classes = useStyle();

  const [followUpDate, setFollowUpDate] = useState(initialFValues.followUpDate);

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

  console.log(initialFValues);
  // Handle initial intention value
  const initialIntentionDisplay = () => {
    if (intention) {
      setIntentionDisplay("block");
      setFollowUpDate(initialFValues.followUpDate);
    }
  };

  useEffect(() => {
    initialIntentionDisplay();
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
      updateSingleLead(
        wechat,
        status,
        college,
        grade,
        country,
        otherKeywords,
        note,
        initialFValues.leadID,
        intentionID
      );
      setOpenPopup(false);
      resetOtherArea();
      resetForm();
    }
  };

  return (
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
          <Box className={classes.dateWrapper}>
            <Box component="span" className={classes.dateGap}>
              创建时间：{initialFValues.createdDate}
            </Box>
            <Box component="span">更新时间：{initialFValues.updatedDate}</Box>
          </Box>
          <Box className={classes.dateWrapper}>
            Follow up：
            {followUpDate ? followUpDate : "未指定"}
            <Box component="span"></Box>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <div className={classes.actionButtonWrap}>
            <Controls.Button type="submit" text="更新" />
            <Controls.Button
              text="取消修改"
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
  );
};

const mapStateToProps = (state) => ({
  allColleges: state.am.allColleges,
});

export default connect(mapStateToProps, {
  updateSingleLead,
})(LeadDetailForm);
