import React, { useState } from "react";
import { connect, useSelector } from "react-redux";
import _ from "lodash";

// Actions
import {
  setCurrentProfile,
  updateSingleProfile,
} from "../../../actions/profile";
import { uploadLead } from "../../../actions/am";

import { makeStyles } from "@material-ui/styles";
import {
  // Tooltip,
  Grid,
  FormGroup,
  FormControlLabel,
  FormLabel,
  Divider,
  FormControl,
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
  keywordsCheckbox,
} from "../../config/Leads";

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
}));

const initialCheckbox = keywordsCheckbox().reduce(
  (ac, a) => ({ ...ac, [a]: false }),
  {}
);

const NewLeadForm = ({
  allColleges,
  uploadLead,
  setOpenPopup,
  initialFValues,
  makeProfile,
  ProfileID,
  setCurrentProfile,
  updateSingleProfile,
}) => {
  const classes = useStyle();

  const currentProfile = useSelector((state) => state.profile.currentProfile);
  const user = useSelector((state) => state.auth.user);

  initialFValues = Object.assign({}, initialFValues, initialCheckbox);

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("wechat" in fieldValues)
      temp.wechat = fieldValues.wechat ? "" : "必须输入微信号！";
    if ("college" in fieldValues)
      temp.college = fieldValues.college ? "" : "必须选择学校！";
    if ("status" in fieldValues)
      temp.status = fieldValues.status ? "" : "必须选择状态！";
    if ("intention" in fieldValues && status === "未购买")
      temp.intention = fieldValues.intention ? "" : "必须选择购买意向！";
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

  // Handle keywords Checkbox
  let checkNum = -1;

  // Handle intention box display
  const [intentionDisplay, setIntentionDisplay] = useState("none");
  const handleIntentionDisplay = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
      intention: "",
    });

    if (e.target.value === statusOptions()[1].title)
      setIntentionDisplay("block");
    else setIntentionDisplay("none");
  };

  // reset Text area
  const resetOtherArea = () => {
    document.getElementById("am-lead-upload-note").value = "";
    document.getElementById("am-lead-upload-otherKeywords").value = "";
    setIntentionDisplay("none");
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

    // Create checked item array
    let checkedItem = [];
    Object.keys(values).forEach((key) => {
      if (values[key] === true) checkedItem.push(key);
    });

    if (validate()) {
      uploadLead(
        wechat,
        status,
        checkedItem,
        college,
        grade,
        country,
        otherKeywords,
        note,
        intentionID,
        makeProfile,
        ProfileID
      );
      setOpenPopup(false);
      resetOtherArea();
      resetForm();
    }

    if (ProfileID) {
      // console.log(currentProfile);
      // console.log(user.email);
      const payload = {
        collegeDisplay: college,
        country,
        grade,
        updateDateUser: user.email,
      };
      _.extend(currentProfile, payload);
      setCurrentProfile(currentProfile);
      updateSingleProfile(currentProfile);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Grid container>
        <Grid item xs={6}>
          {/* <FormControl className={classes.FormControl}> */}
          <Controls.Input
            name="wechat"
            label="微信号 *"
            value={values.wechat}
            onChange={handleInputChange}
            error={errors.wechat}
          />
          {/* </FormControl> */}
          {/* <FormControl> */}
          <Controls.Select
            name="college"
            label="学校 *"
            value={values.college}
            onChange={handleInputChange}
            options={allColleges}
            error={errors.college}
          />
          {/* </FormControl> */}
          {/* <FormControl> */}
          <Controls.Select
            name="status"
            label="状态 *"
            value={values.status}
            onChange={
              handleIntentionDisplay
              // handleInputChange(e);
            }
            options={statusOptions()}
            error={errors.status}
          />
          {/* </FormControl> */}
          {/* <FormControl> */}
          <Box display={intentionDisplay}>
            <Controls.Select
              name="intention"
              label="购买意向"
              value={values.intention}
              onChange={handleInputChange}
              options={intentionOptions()}
              error={errors.intention}
            />
          </Box>

          {/* </FormControl> */}
          {/* <FormControl> */}
          <Controls.Select
            name="grade"
            label="年级"
            value={values.grade}
            onChange={handleInputChange}
            options={gradeOptions()}
          />
          {/* </FormControl> */}
          {/* <FormControl> */}
          <Controls.Select
            name="country"
            label="地理位置"
            value={values.country}
            onChange={handleInputChange}
            options={countryOptions()}
          />
          {/* </FormControl> */}
        </Grid>
        <Grid item xs={6}>
          <FormControl>
            <FormLabel component="legend" className={classes.keywordsLable}>
              关键词：
            </FormLabel>
            <FormGroup row>
              {keywordsCheckbox()
                ? keywordsCheckbox().map((item) => {
                    checkNum++;
                    return (
                      <FormControlLabel
                        key={item}
                        control={
                          <Controls.Checkbox
                            name={`${item}`}
                            value={values[keywordsCheckbox()[checkNum]]}
                            onChange={handleInputChange}
                          />
                        }
                        label={`${item}`}
                      />
                    );
                  })
                : "暂无关键词可选"}
            </FormGroup>
            <FormGroup>
              <Controls.Textarea
                id="am-lead-upload-otherKeywords"
                name="otherKeywords"
                value={values.otherKeywords}
                rows={2}
                placeholder="其他关键词"
                onChange={handleInputChange}
                className={classes.block}
              />
            </FormGroup>
          </FormControl>
          <Divider className={classes.divider} />
          <FormControl>
            <Controls.Textarea
              id="am-lead-upload-note"
              name="note"
              rows={4}
              value={values.note}
              placeholder="备注信息"
              onChange={handleInputChange}
              className={classes.block}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <div className={classes.actionButtonWrap}>
            {/* <FormControl> */}
            {/* <Tooltip title="上传Lead至数据库" arrow> */}
            <Controls.Button type="submit" text="上传" />
            {/* </Tooltip> */}
            {/* <Tooltip title="重置所有当前填写内容" arrow> */}
            <Controls.Button
              text="重置"
              color="default"
              onClick={() => {
                resetOtherArea();
                resetForm();
              }}
            />
            {/* </Tooltip> */}
            {/* </FormControl> */}
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
  uploadLead,
  setCurrentProfile,
  updateSingleProfile,
})(NewLeadForm);
