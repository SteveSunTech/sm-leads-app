import React, { Fragment, useState, useEffect } from "react";

import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/styles";

import { addNewUser } from "../../actions/admin";
import { AssignCollegeToUser } from "../../actions/admin";

const useStyles = makeStyles((theme) => ({
  new: {
    marginTop: "25px",
    marginBottom: "25px",
  },
  newBox: {
    marginBottom: "25px",
  },
  newBoxForm: {
    "& > *": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
  newBoxSubmit: {
    width: "30px",
    marginTop: "15px",
    backgroundColor: "#66CC00",
    color: "white",
    "&:hover": {
      backgroundColor: "green",
    },
  },
  table: {
    minWidth: 650,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  collegeInput: {
    width: "350px",
  },
}));

const UserManage = ({ addNewUser, getAllCollege, AssignCollegeToUser }) => {
  const classes = useStyles();

  // ***********************************************
  // New User
  // ***********************************************
  const [newUserForm, setNewUserForm] = useState({
    email: "",
    password: "",
    name: "",
    area: "",
  });
  const { email, password, name, area } = newUserForm;

  const [areaDropDown, setArea] = useState("");
  const areaChange = (e) => {
    setArea(e.target.value);
    setNewUserForm({
      ...newUserForm,
      area: e.target.value,
    });
  };

  const newUserOnChange = (e) =>
    setNewUserForm({
      ...newUserForm,
      [e.target.name]: e.target.value,
    });

  const newUserSubmit = (e) => {
    e.preventDefault();
    addNewUser(email, password, name, area);
  };

  // ***********************************************
  // 为用户分配学校
  // ***********************************************

  const assignCollegeToUserSubmit = (e) => {
    e.preventDefault();
    AssignCollegeToUser(email2, college2);
  };

  const [assignCollegeForm, setAssignCollegeForm] = useState({
    email2: "",
    college2: "",
  });
  const { email2, college2 } = assignCollegeForm;

  const assignCollegeOnChange = (e) => {
    setAssignCollegeForm({
      ...assignCollegeForm,
      [e.target.name]: e.target.value,
    });
  };

  const [allCollegeDropDown, setAllCollegeDropDown] = useState("");
  const allCollegeChange = (e) => {
    setAllCollegeDropDown(e.target.value);
    setAssignCollegeForm({
      ...assignCollegeForm,
      college2: e.target.value,
    });
  };

  // ***********************************************
  // Load all user and all school
  // not user now!!
  // ***********************************************

  // all colleges dropsown data
  function createAllCollegeDropdownData(name) {
    return {
      name,
    };
  }

  let rows = [];

  const [allCollegeValue, setAllCollegeValue] = useState();
  const allCollegeDropDownData = () => {
    getAllCollege().then(function (data) {
      if (data.data) {
        var bar = new Promise((resolve, reject) => {
          data.data.forEach(async (e) => {
            rows.push(createAllCollegeDropdownData(e.name));
            // console.log(e.name);
            if (data.data.length === rows.length) resolve();
          });
        });

        bar.then(() => {
          setAllCollegeValue("");
          setAllCollegeValue(rows);
        });
      }
    });
  };

  useEffect(() => {
    allCollegeDropDownData();
  }, []);

  return (
    <Fragment>
      <Box
        component="div"
        display="block"
        className={classes.newBox}
        // border={0.2}
        // {...newBoxProps}
      >
        <form
          className={classes.newBoxForm}
          noValidate
          autoComplete="off"
          onSubmit={(e) => newUserSubmit(e)}
        >
          <TextField
            id="email"
            name="email"
            label="email"
            variant="outlined"
            onChange={(e) => newUserOnChange(e)}
            className={classes.collegeInput}
          />
          <TextField
            id="password"
            name="password"
            label="password"
            variant="outlined"
            onChange={(e) => newUserOnChange(e)}
          />
          <TextField
            id="name"
            name="name"
            label="name"
            variant="outlined"
            onChange={(e) => newUserOnChange(e)}
          />
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="area">地区</InputLabel>
            <Select
              labelId="area"
              id="demo-simple-select-outlined"
              value={areaDropDown}
              onChange={areaChange}
              label="area"
            >
              <MenuItem value={"Western"}>西部</MenuItem>
              <MenuItem value={"Eastern"}>东部</MenuItem>
              <MenuItem value={"Middle"}>中南部</MenuItem>
            </Select>
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            // className={classes.newBoxSubmit}
          >
            添加用户
          </Button>
        </form>
      </Box>
      <Box
        component="div"
        display="block"
        className={classes.newBox}
        // border={0.2}
        // {...newBoxProps}
      >
        <form
          className={classes.newBoxForm}
          noValidate
          autoComplete="off"
          onSubmit={(e) => assignCollegeToUserSubmit(e)}
        >
          <TextField
            id="email2"
            name="email2"
            label="email"
            variant="outlined"
            onChange={(e) => assignCollegeOnChange(e)}
            className={classes.collegeInput}
          />
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="college2">学校</InputLabel>
            <Select
              labelId="college2"
              id="college2"
              value={allCollegeDropDown}
              onChange={allCollegeChange}
              label="college2"
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
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            // className={classes.newBoxSubmit}
          >
            AM分配学校
          </Button>
        </form>
      </Box>
    </Fragment>
  );
};

export default connect(null, {
  addNewUser,
  // getAllCollege,
  AssignCollegeToUser,
})(UserManage);
