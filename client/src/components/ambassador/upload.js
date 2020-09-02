import React, { useState } from 'react'
import { connect } from 'react-redux';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/styles';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Divider from '@material-ui/core/Divider';


import { upload } from '../../actions/basic';
import { Checkbox } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: 200,
    },
    display: 'flex',
    flexDirection: 'column',
  },
  formBlock: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2)
  },
  container: {
    // marginTop: '30px',
    marginBottom: '30px'
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  button: {
    // marginLeft: '25px',
    // maxHeight: '35px',
    marginTop: '20px'
  }
}))

const Upload = ({ upload }) => {
  const classes = useStyles()

  // wechat status
  const [formData, setFormData] = useState({
    wechat: '',
    status: '',
  })

  const {wechat, status} = formData

  const onChangeStatus = e => setFormData({
    ...formData,
    status: e.target.value
  })

  const onChangeWeChat = e => setFormData({
    ...formData,
    wechat: e.target.value
  })

  // check box
  const [checked, setChecked] = useState({
    checked1: false,
    checked2: false,
    checked3: false,
    checked4: false
  })

  const { checked1, checked2, checked3, checked4 } = checked

  const checkedChange = e => {
    setChecked({ ...checked, [e.target.name]: e.target.checked})
  }

  // submit form
  const onSubmit = e => {
    e.preventDefault()

    let checkedItem = []
    if (checked1 === true) {
      checkedItem.push('疫苗')
    }
    if (checked2 === true) {
      checkedItem.push('体检')
    }
    if (checked3 === true) {
      checkedItem.push('看病')
    }
    if (checked4 === true) {
      checkedItem.push('报销')
    }

    upload(wechat, status, checkedItem)
  }



  return (
    <div className={classes.container}>
      <form
        noValidate
        autoComplete="off"
        onSubmit={e => onSubmit(e)}
        className={classes.root}
        autoComplete="off"
      >
        <div className={classes.formBlock}>
          <TextField
              label="微信号"
              id="wechat"
              // defaultValue="Normal"
              // variant="outlined"
              onChange={e => onChangeWeChat(e)}
              required
          />
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">状态</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={status}
              onChange={e => onChangeStatus(e)}
              required
            >
              <MenuItem value={'已购买'}>已购买</MenuItem>
              <MenuItem value={'未购买'}>未购买</MenuItem>
              <MenuItem value={'无意向购买'}>无意向购买</MenuItem>
            </Select>
          </FormControl>
        </div>
        {/* <Divider /> */}
        <div className={classes.formBlock}>
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
            label="报销"
          />
        </div>
        {/* <Divider /> */}
        <div className={classes.formBlock}>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            type='submit'
          >
            上传
          </Button>
        </div>
      </form>
    </div>
  )
}

export default connect( null, {upload} )(Upload)