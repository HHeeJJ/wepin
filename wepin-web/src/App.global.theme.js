import { createTheme } from "@mui/material";
import { grey } from "@mui/material/colors";

const theme = createTheme({
  breakpoints: {
    keys: ["xs", "sm", "md", "lg", "xl"],
    values: { xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920 },
  },
  direction: "ltr",
  mixins: {
    toolbar: {
      minHeight: 56,
      "@media (min-width:0px) and (orientation: landscape)": {
        minHeight: 48,
      },
      "@media (min-width:600px)": { minHeight: 64 },
    },
  },
  typography: {
    fontFamily:
      "'Pretendard', -apple-system, BlinkMacSystemFont, 'Malgun Gothic', '맑은 고딕', helvetica, 'Apple SD Gothic Neo', sans-serif",
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
  },
  palette: {
    mode: "light",
    primary: {
      main: "#297FFF",
      color: "#fff",
    },
    secondary: {
      main: "#222",
    },
    error: {
      light: "#e57373",
      main: "#FF3838",
      dark: "#d32f2f",
      contrastText: "#fff",
    },
    warning: {
      light: "#ffb74d",
      main: "#ff9800",
      dark: "#f57c00",
      contrastText: "rgba(0, 0, 0, 0.87)",
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        variant: "contained",
      },
      styleOverrides: {
        root: {
          fontWeight: "400",
          boxShadow: "none !important",
          "&.Mui-disabled": {
            backgroundColor: "#c6c6c6",
            color: "#fff",
          },
          "&.MuiButton-sizeSmall": {
            minWidth: "auto",
            height: "1.75rem",
            fontSize: "0.75rem",
            padding: "0 0.75rem",
          },
          "&.MuiButton-sizeMedium": {
            minWidth: "auto",
            height: "2rem",
            padding: "0 0.75rem",
            fontSize: "0.875rem",
          },
          "&.MuiButton-sizeLarge": {
            height: "3rem",
            fontSize: "1rem",
            fontWeight: "600",
          },
        },
        startIcon: {
          marginRight: "0.25rem",
          marginLeft: "-0.125rem",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          position: "unset",
          maxWidth: "100%",
          marginBottom: "0.75rem",
          transform: "unset",
          textAlign: "left",
          fontSize: "0.875rem",
          fontWeight: "600",
          color: "#222",
        },
      },
    },
    MuiOutlinedInput: {
      defaultProps: {
        inputProps: {},
      },
      styleOverrides: {
        root: {
          padding: "0.9375rem 0.75rem",
          color: "#222",
          "&.Mui-focused": {
            ".MuiOutlinedInput-notchedOutline": {
              borderColor: "#222",
            },
          },
          "&.Mui-error": {
            ".MuiOutlinedInput-notchedOutline": {
              borderColor: "#FF3838",
            },
          },
          "&.MuiInputBase-sizeSmall": {
            padding: "0.625rem",
          },
        },
        input: {
          padding: 0,
          font: "1rem 'Pretendard', -apple-system, BlinkMacSystemFont, 'Malgun Gothic', '맑은 고딕', helvetica, 'Apple SD Gothic Neo', sans-serif",
          "&::placeholder": {
            opacity: 1,
            color: "#ababab",
          },
        },
        notchedOutline: {
          borderWidth: "1px !important",
          borderColor: "#ebebeb",
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          margin: "0.25rem 0 0",
          fontSize: "0.75rem",
          color: "#949494",
        },
      },
    },
    MuiModal: {
      styleOverrides: {
        backdrop: {
          backgroundColor: "rgba(0, 0, 0, 0.6)",
        },
      },
    },
    MuiLoadingButton: {
      styleOverrides: {
        root: {
          flexShrink: 0,
          "&:not(.MuiLoadingButton-loading)": {
            ".MuiButton-startIcon": {
              display: "none",
            },
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        root: {
          zIndex: "1400",
        },
        paper: {
          borderRadius: "16px 16px 0px 0px",
          boxShadow: "0px -4px 30px 0px rgba(0, 0, 0, 0.12)",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          color: "#999",
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          padding: "0 8px",
          color: "#E9E9E9",
          "& .MuiSvgIcon-root": {
            fontSize: 28,
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          padding: "0 8px",
          color: "#949494",
          "& .MuiSvgIcon-root": {
            margin: "2px",
            fontSize: 24,
          },
        },
      },
    },
  },
});

export default theme;
