import React, { useEffect } from 'react';
import axios from '../apis/smCovered'
import { ThemeProvider } from '@material-ui/core/styles';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { UNKNOW_USER } from '../actions/types'

import Login from './auth/Login';
import Theme from './ui/Theme';
import Alert from './ui/Alert';
import { loadUser } from '../actions/auth';
import setAuthToken from '../utils/setAuthToken';
import Ambassador from './ambassador/main';
import Am from './amPro/Main';
import Admin from './admin/Main';

// Redux
import { Provider } from 'react-redux';
import store from '../store'

if (localStorage.token) {
	// console.log(localStorage.token);
	setAuthToken(localStorage.token);
}

// const App = () => {
// 	useEffect(() => {
// 		const temp = async () => {
// 			try {
// 				// console.log(axios.get('/api/auth'))
// 				// axios.get('/api/auth').then((e) => {
// 					// console.log(e)
// 					// console.log(e);
// 					// e.data.msg === 'authenticated' ?
// 					store.dispatch(loadUser())
// 					// store.dispatch({type: UNKNOW_USER, payload: {}})
// 				// }
// 				// )
// 			} catch (error) {
// 				console.log(error)							//@yuchen
// 			}
// 		}

// 		temp()
// 	}, [])

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, [])

	return (
		<Provider store={store}>
			<ThemeProvider theme={Theme}>
				<Router>
					<Alert />
					<Switch>
						<Route exact path='/' component={Login} />
						<Route exact path='/login' component={Login} />
						<Route exact path='/ambassador' component={Ambassador} />
						<Route exact path='/am' component={Am} />
						<Route exact path='/admin' component={Admin} />
					</Switch>
				</Router>
			</ThemeProvider>
		</Provider>
	);
}

export default App;
