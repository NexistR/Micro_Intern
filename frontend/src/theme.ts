import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  cssVariables: true,
  palette: {
    primary: {
      main: "#00695c",
      dark: "#004d40",
    },
    secondary: {
      main: "#b26a00",
    },
    background: {
      default: "#f5f7f8",
      paper: "#ffffff",
    },
    text: {
      primary: "#17201f",
      secondary: "#5b6765",
    },
    divider: "#dce3e1",
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 650,
        },
      },
    },
  },
  shape: {
    borderRadius: 6,
  },
  typography: {
    fontFamily: "Arial, Helvetica, sans-serif",
  },
});

export default theme;
