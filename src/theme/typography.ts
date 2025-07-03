import { TypographyOptions } from '@material-ui/core/styles/createTypography';

const typography: TypographyOptions = {
  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  fontSize: 14,
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 700,
  h1: {
    fontWeight: 600,
    fontSize: 36,
    letterSpacing: '-0.5px',
    lineHeight: 1.2,
  },
  h2: {
    fontWeight: 600,
    fontSize: 30,
    letterSpacing: '-0.25px',
    lineHeight: 1.3,
  },
  h3: {
    fontWeight: 600,
    fontSize: 24,
    letterSpacing: '0px',
    lineHeight: 1.4,
  },
  h4: {
    fontWeight: 600,
    fontSize: 20,
    letterSpacing: '0.15px',
    lineHeight: 1.4,
  },
  h5: {
    fontWeight: 600,
    fontSize: 16,
    letterSpacing: '0.15px',
    lineHeight: 1.5,
  },
  h6: {
    fontWeight: 600,
    fontSize: 14,
    letterSpacing: '0.15px',
    lineHeight: 1.6,
  },
  subtitle1: {
    fontSize: 16,
    letterSpacing: '0.15px',
    lineHeight: 1.75,
  },
  subtitle2: {
    fontSize: 14,
    letterSpacing: '0.1px',
    lineHeight: 1.75,
  },
  body1: {
    fontSize: 16,
    letterSpacing: '0.5px',
    lineHeight: 1.5,
  },
  body2: {
    fontSize: 14,
    letterSpacing: '0.25px',
    lineHeight: 1.5,
  },
  button: {
    fontSize: 14,
    letterSpacing: '0.75px',
    fontWeight: 600,
    textTransform: 'capitalize', // Changed from uppercase for a more modern look
  },
  caption: {
    fontSize: 12,
    letterSpacing: '0.4px',
    lineHeight: 1.5,
  },
  overline: {
    fontSize: 12,
    letterSpacing: '1px',
    lineHeight: 2.5,
    fontWeight: 500,
    textTransform: 'uppercase',
  },
};

export { typography };
