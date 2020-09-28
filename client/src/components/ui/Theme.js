import { createMuiTheme } from "@material-ui/core/styles";

const mmkPurple = "#a000a0";

// red #cd0000
// purplt #a000a0

export default createMuiTheme({
  palette: {
    // common: {
    //   purple: `${mmkPurple}`,
    // },
    primary: {
      main: "#333996",
      light: "#3c44b126",
    },
    secondary: {
      main: "#f83245",
      light: "#f8324526",
    },
    green: {
      main: "#43a047",
      light: "#81c784",
      dark: "#2e7d32",
    },
    cancel: {
      main: "#616161",
    },
    background: {
      default: "#f4f5fd",
    },
  },
  props: {
    MuiIconButton: {
      disableRipple: true,
    },
  },
});
