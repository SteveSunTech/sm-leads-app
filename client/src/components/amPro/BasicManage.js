import React, { useEffect, useState, Fragment } from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";

import { newBasic, getAllBasic } from "../../actions/am";
import { getCollegeIndexOfCurrentUser } from "../../actions/am";
// import Modal from '../ui/Modal';

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
}));

// const newBoxProps = {
//   bgcolor: 'background.paper',
//   m: 1,
//   style: { width: '90%', height: '5rem' },
//   borderColor: 'text.primary',
// };

const BasicManage = ({
  basics,
  newBasic,
  getAllBasic,
  getCollegeIndexOfCurrentUser,
}) => {
  const classes = useStyles();

  // new basic form
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    college: "",
  });
  const { email, password, name, college } = formData;

  const newOnChange = (e) =>
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  // new basic form college dropdown
  let rowsForCollege = [];
  const [allCollegeValue, setAllCollegeValue] = useState();
  const [collegeDropDown2, setCollege2] = useState("");
  const collgeChange2 = (e) => {
    setCollege2(e.target.value);
    setFormData({
      ...formData,
      college: e.target.value,
    });
  };

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

  function createAllCollegeDropdownData(name) {
    return {
      name,
    };
  }

  // basic list
  const [tableValue, setTableValue] = useState();
  const rows = [];

  function createData(id, college, email, name, createdDate, status) {
    return { id, college, email, name, createdDate, status };
  }

  // console.log(basics)

  // 性能需要提升
  useEffect(() => {
    getCollegeList();
    getAllBasic().then(function (data) {
      // console.log(data)
      // data.forEach(e => {
      //   if (e) {
      //     let status = ''
      //     if (e.status === true) {
      //       status = '已激活'
      //     }
      //     rows.push(createData(e._id, e.collegeDisplay, e.email, e.name, e.dateDisplay, status))
      //     setTableValue('')
      //     setTableValue(rows)
      //   }
      // })
      if (data) {
        let setTableData = new Promise((resolve, reject) => {
          data.forEach(async (e) => {
            if (e) {
              let status = "";
              if (e.status === true) {
                status = "已激活";
              }
              rows.push(
                createData(
                  e._id,
                  e.collegeDisplay,
                  e.email,
                  e.name,
                  e.dateDisplay,
                  status
                )
              );
            }
            resolve();
          });
        });

        setTableData.then(() => {
          setTableValue("");
          setTableValue(rows);
        });
      }
    });
  }, [basics]);

  const newBasicSubmit = (e) => {
    e.preventDefault();
    newBasic(email, password, name, college);
  };

  return (
    <Fragment>
      {/* <Modal /> */}
      {/* <Button
        variant="contained"
        color="primary"
        className={classes.new}
      >
        添加校园大使
      </Button> */}
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
          onSubmit={(e) => newBasicSubmit(e)}
        >
          <TextField
            id="email"
            name="email"
            label="邮箱"
            variant="outlined"
            onChange={(e) => newOnChange(e)}
          />
          <TextField
            id="name"
            name="name"
            label="姓名"
            variant="outlined"
            onChange={(e) => newOnChange(e)}
          />
          <TextField
            id="password"
            name="password"
            label="密码"
            variant="outlined"
            onChange={(e) => newOnChange(e)}
          />
          {/*
              hard code 学校， 需要添加获取学校API！！
            */}
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="college">学校</InputLabel>
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
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            className={classes.newBoxSubmit}
          >
            添加
          </Button>
        </form>
      </Box>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Data Id</TableCell>
              <TableCell align="center">学校</TableCell>
              <TableCell align="center">邮箱</TableCell>
              <TableCell align="center">姓名</TableCell>
              <TableCell align="center">创建时间</TableCell>
              <TableCell align="center">状态</TableCell>
              <TableCell align="center">操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableValue
              ? tableValue.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell component="th" scope="row" align="center">
                      {e.id}
                    </TableCell>
                    <TableCell align="center">{e.college}</TableCell>
                    <TableCell align="center">{e.email}</TableCell>
                    <TableCell align="center">{e.name}</TableCell>
                    <TableCell align="center">{e.createdDate}</TableCell>
                    <TableCell align="center">{e.status}</TableCell>
                    <TableCell align="center">
                      <Button variant="contained" color="primary">
                        修改
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              : null}
          </TableBody>
        </Table>
      </TableContainer>
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  basics: state.amNewBasic.basic,
});

export default connect(mapStateToProps, {
  newBasic,
  getAllBasic,
  getCollegeIndexOfCurrentUser,
})(BasicManage);
