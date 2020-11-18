import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

import { Grid, makeStyles } from "@material-ui/core";

// Reusable
import Controls from "../../reusable/controls/Controls";

const useStyle = makeStyles((theme) => ({
  actionButtonWrap: {
    marginTop: "-2px",
  },
}));

const NewRecord = ({
  // Func
  setOpenPopup,
  setNewRecordOpenPopup,
  setProfile,
  setNewRecordInitialValues,
}) => {
  const classes = useStyle();

  const [searchContent, setSearchContent] = useState();

  const dispatch = useDispatch();
  const allProfiles = useSelector((state) => state.am.allProfiles);

  const setInput = (e) => {
    setSearchContent(e.target.value);
  };

  let found;
  const searchProfiles = () => {
    const searchRedux = new Promise((resolve, reject) => {
      allProfiles.forEach((item, index, array) => {
        if (item.wechatId == searchContent) {
          found = item;
          resolve();
        }
        if (index === array.length - 1) resolve();
      });
    });
    searchRedux.then(async () => {
      if (found) {
        setProfile(found);
      } else {
        let otherUserLead = await axios.get(
          `/api/leadprofile/wechat/${searchContent}`
        );
        if (otherUserLead.data) {
          const { profile, leads } = otherUserLead.data;
          dispatch({
            type: "AM_UPLOAD_SINGLE_PROFILE",
            payload: profile[0],
          });
          const loadingLeads = new Promise((resolve, reject) => {
            leads.forEach((item, index, array) => {
              dispatch({
                type: "AM_UPLOAD_SINGLE_LEAD",
                payload: item,
              });
              if (index === array.length - 1) resolve();
            });
          });
          loadingLeads.then(() => {
            setProfile(profile[0]);
          });
        } else {
          let initialFValues = {
            wechat: searchContent,
            status: "",
            college: "",
            grade: "",
            country: "",
            otherKeywords: "",
            note: "",
            intention: "",
          };
          setNewRecordInitialValues(initialFValues);
          setNewRecordOpenPopup(true);
        }
      }
      setOpenPopup(false);
      setSearchContent();
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={8}>
        <Controls.Input name="search" label="微信号" onChange={setInput} />
      </Grid>
      <Grid item xs={4}>
        <Controls.Button
          className={classes.actionButtonWrap}
          text="确认"
          onClick={searchProfiles}
        />
      </Grid>
    </Grid>
  );
};

export default NewRecord;
