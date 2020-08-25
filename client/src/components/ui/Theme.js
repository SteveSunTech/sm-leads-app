import { createMuiTheme } from '@material-ui/core/styles';

const mmkPurple = '#a000a0';

// red #cd0000

export default createMuiTheme({
  palette: {
    common: {
      purple: `${mmkPurple}`,
      green: '#4caf50'
    },
    primary: {
      main: `${mmkPurple}`
    },
    secondary: {
      main: '#FFFFFF'
    }
  },
  // mixins: {
  //   toolbar: {
  //     minHeight: 50
  //   }
  // }
})

