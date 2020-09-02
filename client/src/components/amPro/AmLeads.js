import React, { useState, useEffect, Fragment } from 'react'
import { connect } from 'react-redux';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/styles';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import BackupIcon from '@material-ui/icons/Backup';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
// import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
// import Divider from '@material-ui/core/Divider';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';


import { uploadLead } from '../../actions/am';
import { Checkbox } from '@material-ui/core';
import { getWechatIndex } from '../../actions/am';

const useStyles = makeStyles(theme => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: 200,
    },
    // display: 'flex',
    // flexDirection: 'column',
  },
  modalPopupButton: {
    marginTop: '30px',
    marginBottom: '30px',
    border: 'none',
    color: 'white',
    backgroundColor: '#a000a0',
    // width: '80px',
    height: '50px',
    borderRadius: '5px',
    fontWeight: '600',
    fontSize: '14px'
  },
  uploadIcon: {
    marginRight: '10px'
  },
  table: {
    minWidth: 650,
    // marginTop: '60px'
  },
  formBlock: {
    // display: 'flex',
    // justifyContent: 'center',
    // paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(3)
  },
  container: {
    // marginTop: '30px',
    marginBottom: '30px'
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  modalInnerUpload: {
    marginLeft: '40%',
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    // border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  }
}))

const Upload = ({ uploadLead, getWechatIndex }) => {
  const classes = useStyles()

  // wechat status
  const [formData, setFormData] = useState({
    wechat: '',
    status: '',
    college: '',
  })

  const {wechat, status, college} = formData

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
  const onSubmit = async e => {
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

    await uploadLead(wechat, status, checkedItem, college)

    setOpen(false);

    getTableData()
  }

  // upload modal popup
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
    setFormData({
      wechat: '',
      college: '',
      status: '',
    })
  };

  const handleClose = () => {
    setOpen(false);
  };

  // table data
  function createData(id, college, group, wechat, status, keywords) {
    return { id, college, group, wechat, status, keywords };
  }

  const [value, setValue] = useState()
  const getTableData = () => {
    getWechatIndex()
    .then(function(data) {
      // console.log(data)
      if (data) {
        data.forEach(e => {
          rows.push(createData(e._id, e.collegeDisplay, e.groupDisplay, e.wechatId, e.status, e.keywords))
          setValue('')
          setValue(rows)
        })
      }
    })
  }
  const rows = [];

  // 性能需要提升
  useEffect(() => {
    getTableData()
  }, []
  )

  // new lead form college dropdown
  const [collegeDropDown, setCollege] = useState('');
  const collgeChange = (e) => {
    setCollege(e.target.value)
    setFormData({
      ...formData,
      college: e.target.value
    })
  }


  return (
    <Fragment>
      <Button
        onClick={handleOpen}
        variant="contained"
        color="primary"
        className={classes.modalPopupButton}
      >
        <BackupIcon className={classes.uploadIcon} />
        Upload
      </Button>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align='center'>Data ID</TableCell>
              <TableCell align='center'>学校</TableCell>
              <TableCell align='center'>群</TableCell>
              <TableCell align='center'>微信号</TableCell>
              <TableCell align='center'>状态</TableCell>
              <TableCell align='center'>关键词</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {value ? value.map((e) => (
              <TableRow key={e.id}>
                <TableCell component="th" scope="row" align='center'>
                  {e.id}
                </TableCell>
                <TableCell align='center'>{e.college}</TableCell>
                <TableCell align='center'>{e.group}</TableCell>
                <TableCell align='center'>{e.wechat}</TableCell>
                <TableCell align='center'>{e.status}</TableCell>
                <TableCell align='center'>{e.keywords}</TableCell>
              </TableRow>
            )) : null}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <form
              noValidate
              autoComplete="off"
              onSubmit={e => onSubmit(e)}
              className={classes.root}
              autoComplete="off"
              >
              <div className={classes.formBlock}>
                <FormControl className={classes.formControl}>
                <InputLabel id="college">学校</InputLabel>
                <Select
                  labelId="college"
                  id="demo-simple-select-outlined"
                  value={collegeDropDown}
                  onChange={collgeChange}
                  label="college"
                >
                  <MenuItem value={'University of Southern California'}>University of Southern California</MenuItem>
                  <MenuItem value={'University of California, Riverside'}>University of California, Riverside</MenuItem>
                </Select>
              </FormControl>
              </div>
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
                  className={classes.modalInnerUpload}
                  type='submit'
                >
                  上传
                </Button>
              </div>
            </form>
          </div>
        </Fade>
      </Modal>
    </Fragment>
  )
}

export default connect( null, {uploadLead, getWechatIndex} )(Upload)