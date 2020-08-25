import React from 'react';
import { connect } from 'react-redux';
// import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

import { setAlert } from '../../actions/alert';

const AdminDashboard = ({ isAuthenticated, title }) => {
  if (!isAuthenticated) {
    return <Redirect to='/' />
  } else {
    // console.log(title)
    if (title === 'basic') {
      return <Redirect to='/ambassador' />
    }
  }

  return(
    <div>
      Admin Dashboard
    </div>
  )
}

const mapSateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  title: state.auth.title
})

export default connect(mapSateToProps, { setAlert })(AdminDashboard);