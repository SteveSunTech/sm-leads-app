import React, { Fragment, useState } from 'react'

import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme) => ({
  new: {
    marginTop: '25px',
    marginBottom: '25px'
  },
  newBox: {
    marginBottom: '25px'
  },
  newBoxForm: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    }
  },
  newBoxSubmit: {
    width: '30px',
    marginTop: '15px',
    backgroundColor: '#66CC00',
    color: 'white',
    '&:hover': {
      backgroundColor: 'green'
    }
  },
  table: {
    minWidth: 650,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  collegeInput: {
    width: '350px'
  }
}));

const Main = ()=> {

  const classes = useStyles();

  const [formData, setFormData] = useState({
    college: '',
    area:''
  })
  const {college, area} = formData;

  const [areaDropDown, setArea] = useState('');
  const areaChange = (e) => {
    setArea(e.target.value)
    setFormData({
      ...formData,
      area: e.target.value
    })
  }

  const newOnChange = e => setFormData({
    ...formData,
    [e.target.name]: e.target.value
  })

  const newBasicSubmit = e => {
    e.preventDefault();
    // newBasic( email, password, name, college )
  }


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
          onSubmit={e => newBasicSubmit(e)}
        >
          <TextField
            id="college"
            name="college"
            label="学校"
            variant="outlined"
            onChange={e => newOnChange(e)}
            className={classes.collegeInput}
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
              <MenuItem value={'Western'}>西部</MenuItem>
              <MenuItem value={'Eastern'}>东部</MenuItem>
              <MenuItem value={'Middle'}>中南部</MenuItem>
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
    </Fragment>
  )
}

export default Main