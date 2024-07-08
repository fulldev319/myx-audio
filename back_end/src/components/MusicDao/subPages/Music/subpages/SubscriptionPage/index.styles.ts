import { makeStyles } from '@material-ui/core/styles';

export const subscriptionPageStyles = makeStyles((theme) => ({
  card: {
    background: '#FFFFFF',
    boxShadow: '0px 15px 16px -11px rgba(0, 0, 0, 0.02)',
    borderRadius: '20px',
    padding: '48px 24px 40px'
  },
  largeTitle: {
    fontWeight: 800,
    fontSize: 30,
    color: '#2D3047'
  },
  title: {
    fontWeight: 800,
    fontSize: 22,
    color: '#2D3047'
  },
  smallTitle: {
    fontWeight: 800,
    fontSize: 19,
    color: '#2D3047'
  },
  subTitle1: {
    fontWeight: 500,
    fontSize: 16,
    color: '#54658F'
  },
  subTitle2: {
    fontWeight: 500,
    fontSize: 14,
    color: '#707582'
  },
  subTitle3: {
    fontWeight: 800,
    fontSize: 19,
    color: '#2D3047',
    opacity: 0.2,
    marginLeft: 5
  },
  greenCard: {
    background: 'linear-gradient(0deg, #F2FBF6, #F2FBF6), #17172D',
    borderRadius: 12
  },
  greenTypo: {
    fontWeight: 600,
    fontSize: 16,
    color: '#65CB63'
  },
  bottomBorder: {
    opacity: 0.1,
    border: '1px solid #000000',
    marginTop: 22
  },
  uppercase: {
    textTransform: 'uppercase'
  },
  button: {
    background: '#65CB63 !important',
    borderRadius: '48px !important',
    fontSize: 16,
    fontWeight: 'bold',
    height: 'fit-content !important',
    lineHeight: 'normal !important'
  },
  buttonSmall: {
    padding: '10px 60px !important'
  },
  buttonLarge: {
    padding: '19px 100px !important'
  },

  bold: {
    fontWeight: 800
  }
}));
