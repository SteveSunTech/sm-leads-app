import React, { useState } from "react";
import { useSelector } from "react-redux";

import { Box, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

// Config
import {
  statusOptions,
  intentionOptions,
  gradeOptions,
  countryOptions,
} from "../../config/Leads";

// Reusable
import Controls from "../../reusable/controls/Controls";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiFormControl-root": {
      width: "80%",
      margin: theme.spacing(1),
    },
  },
  filterBox: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
    width: "100%",
  },
}));

const initialState = {
  collegeDisplay: "",
  status: "",
  country: "",
};

const FilterBar = ({ handleSearch }) => {
  const classes = useStyles();

  const allColleges = useSelector((state) => state.am.allColleges);

  const [input, setInput] = useState(initialState);

  const handleSearchChange = (e) => {
    const { value, name } = e.target;
    setInput({
      ...input,
      [name]: value,
    });
  };

  const search = () => {
    handleSearch(input);
  };

  const reset = () => {
    setInput(initialState);
    handleSearch(initialState);
  };

  return (
    // <Grid container spacing={2}>
    //   <Grid item xs={6}>
    <Box border={1} borderColor="primary.light" className={classes.filterBox}>
      <form className={classes.root} autoComplete="off">
        <Grid container spacing={0}>
          <Grid item xs={4}>
            <Controls.Select
              name="collegeDisplay"
              label="学校"
              options={allColleges}
              value={input.collegeDisplay}
              onChange={handleSearchChange}
            />
          </Grid>
          <Grid item xs={3}>
            <Controls.Select
              name="status"
              label="状态"
              options={statusOptions()}
              value={input.status}
              onChange={handleSearchChange}
            />
          </Grid>
          <Grid item xs={3}>
            <Controls.Select
              name="country"
              label="地理位置"
              options={countryOptions()}
              value={input.country}
              onChange={handleSearchChange}
            />
          </Grid>
          <Grid item xs={1}>
            <Controls.Button
              type="button"
              text="查找"
              onClick={() => search()}
            />
          </Grid>
          <Grid item xs={1}>
            <Controls.Button
              type="button"
              text="重置"
              color="default"
              onClick={() => reset()}
            />
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default FilterBar;
