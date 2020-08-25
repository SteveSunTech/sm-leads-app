import React, { useState } from 'react'
import { connect } from 'react-redux';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/styles';

import { single } from '../../actions/basic';

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: '50px',
    marginBottom: '50px'
  },
  content: {
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'center'
  },
  button: {
    marginLeft: '25px',
    maxHeight: '35px',
    marginTop: '10px'
  }
}))

const FindWechat = ({ single }) => {
  const classes = useStyles()

  const [value, setValue] = useState()

  const onSubmit = e => {
    e.preventDefault()
    single(value)
  }

  const onChange = e => {
    setValue(e.target.value)
  }

  return (
    <div className={classes.container}>
      <form
        noValidate
        autoComplete="off"
        onSubmit={e => onSubmit(e)}
      >
        <div className={classes.content}>
          <TextField
              label="Wechat ID"
              id="outlined-size-normal"
              // defaultValue="Normal"
              variant="outlined"
              onChange={e => onChange(e)}
          />
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            type='submit'
          >
            查询
          </Button>
        </div>
      </form>
    </div>
  )
}

export default connect( null, {single} )(FindWechat)