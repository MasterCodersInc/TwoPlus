import { createMuiTheme } from '@material-ui/core/styles';


const colorOne = "#5B56E9";
const colorTwo = "#889DE2";
const colorThree = "#9CCBF4";
const colorFour = "#BEBEBE";
const colorFive = "#F5F5FA";
const colorWhite = "#fff";
const colorRed = '#f44336'; 
const colorGreen = '#68b36b'; //6fbf73
const colorRedHover = '#aa2e25'; 
const colorGreenHover = '#357a38'; 


export default createMuiTheme({
  spacing: 4,
  palette: {
    common: {
      colorOne: colorOne,
      colorTwo: colorTwo,
      colorThree: colorThree,
      colorFour: colorFour,
      colorFive: colorFive,
      colorWhite: colorWhite,
      colorRed: colorRed,
      colorGreen: colorGreen,
      colorRedHover: colorRedHover, 
      colorGreenHover: colorGreenHover
    },
    primary: {
      main: colorOne,
    },
    secondary: {
      main: colorTwo,
    },
  },
  typography: {
    h1: {
      fontFamily: "Krona One",
      letterSpacing: 5,
      fontSize: '2.25em',
      fontWeight: '600',
    },
    body1: {
      fontFamily: 'Montserrat',
      fontWeight: 600,
      letterSpacing: 2,
      fontSize: '1em',
    },
    body2: {
      fontSize: '.8em',
      fontWeight: 400,
      fontFamily: "Lato",
      letterSpacing: 2,

    },
  },
});
