import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
// import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
// import Paper from '@material-ui/core/Paper';

// import FindWechat from './findWechat'
import Upload from './upload'
import WechatIndex from './wechatIndex'
import SubAlert from '../ui/SubAlert';
import Dashboard from './dashboard'

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`wrapped-tabpanel-${index}`}
      aria-labelledby={`wrapped-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box div={3} style={{ 'padding': '20px'}}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `wrapped-tab-${index}`,
    'aria-controls': `wrapped-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function TabsWrappedLabel() {
  const classes = useStyles();
  const [value, setValue] = React.useState('one');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="wrapped label tabs example"
          variant="fullWidth"
          centered
          >
          <Tab
            value="one"
            label="上传"
            wrapped
            {...a11yProps('one')}
          />
          <Tab value="two" label="追踪" {...a11yProps('two')} />
          <Tab value="three" label="Dashboard" {...a11yProps('three')} />
        </Tabs>
      </AppBar>
      <SubAlert />
      <TabPanel value={value} index="one">
        <Upload />
      </TabPanel>
      <TabPanel value={value} index="two">
        <WechatIndex />
      </TabPanel>
      <TabPanel value={value} index="three">
        <Dashboard />
      </TabPanel>
    </div>
  );
}
