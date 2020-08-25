import React from 'react';
import { connect } from 'react-redux';
// import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

import { setAlert } from '../../actions/alert';
import Header from './header'

const Ambassador = ({ isAuthenticated, title }) => {
  if (!isAuthenticated) {
    return <Redirect to='/' />
  } else {
    if ( title === 'admin' ) {
      return <Redirect to='/admin' />
    } else if ( title === 'basic' ) {
      return <Redirect to='/ambassador' />
    }
  }

  return(
    <div>
      <Header />
    </div>
  )
}

const mapSateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  title: state.auth.title
})

export default connect(mapSateToProps, { setAlert })(Ambassador);