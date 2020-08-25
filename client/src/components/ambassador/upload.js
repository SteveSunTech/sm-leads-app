import React, { useState } from 'react'
import { connect } from 'react-redux';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/styles';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';


import { upload } from '../../actions/basic';

const useStyles = makeStyles(theme => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: 200,
    },
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'center',
    // flexDirection: 'column'
  },
  container: {
    marginTop: '30px',
    marginBottom: '30px'
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  button: {
    marginLeft: '25px',
    maxHeight: '35px',
    marginTop: '20px'
  }
}))

const Upload = ({ upload }) => {
  const classes = useStyles()

  const [formData, setFormData] = useState({
    wechat: '',
    status: '',
  })

  const {wechat, status} = formData

  const onSubmit = e => {
    e.preventDefault()
    upload(wechat, status)
  }


  const onChangeStatus = e => setFormData({
    ...formData,
    status: e.target.value
  })

  const onChangeWeChat = e => setFormData({
    ...formData,
    wechat: e.target.value
  })

  return (
    <div className={classes.container}>
      <form
        noValidate
        autoComplete="off"
        onSubmit={e => onSubmit(e)}
        className={classes.root}
      >
        <div>
          <TextField
              label="微信号"
              id="wechat"
              // defaultValue="Normal"
              // variant="outlined"
              onChange={e => onChangeWeChat(e)}
          />
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">状态</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={status}
              onChange={e => onChangeStatus(e)}
            >
              <MenuItem value={'已拉进群'}>已拉进群</MenuItem>
              <MenuItem value={'转换中'}>转换中</MenuItem>
              <MenuItem value={'已购买'}>已购买</MenuItem>
              <MenuItem value={'潜在用户'}>潜在用户</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div>
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