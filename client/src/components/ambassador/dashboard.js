import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import { get } from '../../actions/basic';


const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function createData(id, college, group, wechat, status) {
  return { id, college, group, wechat, status };
}

const Dashboard = ({ wechats, get }) => {
  const [value, setValue] = useState()

  const rows = [];

  // 性能需要提升
  useEffect(() => {
    get()
    .then(function(data) {
      // console.log(data)
      data.forEach(e => {
        rows.push(createData(e._id, e.collegeDisplay, e.groupDisplay, e.wechatId, e.status))
        setValue('')
        setValue(rows)
      })
    })
  }, [ wechats ]
  )


  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align='center'>Data Id</TableCell>
            <TableCell align='center'>学校</TableCell>
            <TableCell align='center'>群</TableCell>
            <TableCell align='center'>微信号</TableCell>
            <TableCell align='center'>状态</TableCell>
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
            </TableRow>
          )) : null}
        </TableBody>
      </Table>
    </TableContainer>
  );
}


const mapStateToProps = state => ({
  wechats: state.basicWeChat
})

export default connect( mapStateToProps, { get } )(Dashboard)
