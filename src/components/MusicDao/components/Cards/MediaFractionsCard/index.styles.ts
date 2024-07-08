import { makeStyles } from '@material-ui/core/styles';
import { Color } from 'shared/ui-kit';

export const mediaFractionsCardStyles = makeStyles((theme) => ({
  page: {
    height: '842px',
    width: '595px',
    /* to centre page on screen*/
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '20px',
    marginBottom: '20px',
    border: '1px solid black',
    padding: '30px',
    backgroundColor: 'white'
  },
  header1: {
    fontSize: '22px',
    fontStyle: 'normal',
    fontWeight: 800,
    lineHeight: '128%',
    letterSpacing: '0em',
    textAlign: 'left',
    color: '#2D3047'
    //color: "rgba(45, 48, 71, 1)"
  },
  header2: {
    fontSize: '17px',
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: '22px',
    letterSpacing: '0em',
    textAlign: 'left'
    //color: "rgba(45, 48, 71, 1)"
  },
  topInfo: {
    display: 'flex'
  },
  topInfoPart1: {
    width: '80%'
  },
  topInfoPart2: {
    width: '20%',
    height: '70px',
    textAlign: 'right'
  },
  qrImg: {
    height: '70px',
    width: 'auto',
    cursor: 'pointer'
  },
  squareInfo: {
    height: '270px',
    left: '0px',
    top: '0px',
    borderRadius: '2px',
    padding: '10px'
  },
  firstRowInfo: {
    display: 'flex',
    height: '250px'
  },
  secondRowInfo: {
    display: 'flex',
    height: '54px',
    width: '100%',
    marginTop: '30px',
    background: '#2E2E2E'
  },
  firstColInfo: {
    width: '226px',
    height: '100%',
    paddingRight: '12px',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  secondColInfo: {
    width: 'calc(100% - 226px)',
    height: '100%',
    paddingLeft: '12px'
  },
  mainImg: {
    height: 'auto',
    width: '100%',
    cursor: 'pointer'
  },
  firstColSecondRowInfo: {
    width: '350px',
    paddingLeft: '18px',
    borderRight: '1px solid #4F4F4F',
    display: 'flex',
    alignItems: 'center',
    marginTop: '10px',
    marginBottom: '10px'
  },
  secondColSecondRowInfo: {
    width: 'calc(100% - 350px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '10px',
    marginBottom: '10px'
  },
  bigSquareInput: {
    border: '1px solid #000000',
    boxSizing: 'border-box',
    borderRadius: '1px',
    height: '53px',
    width: '100%',
    marginTop: '15px',
    display: 'flex'
  },
  bigSquareInputTitle: {
    width: '40%',

    fontSize: '11px',
    fontStyle: 'normal',
    fontWeight: 800,
    lineHeight: '14px',
    letterSpacing: '0em',
    textAlign: 'left',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '22px'
  },
  bigSquareInputValue: {
    width: '70%',
    textAlign: 'right',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'right',
    paddingRight: '22px'
  },
  inputBigSquareInputValue: {
    width: '100%',
    border: 'none',
    background: 'transparent',
    '-webkit-appearance': 'none',
    outline: 'none',
    textAlign: 'right',
    fontSize: '12px'
  },
  bigInputBigSquareInputValue: {
    width: '80px',
    border: 'none',
    background: 'transparent',
    '-webkit-appearance': 'none',
    outline: 'none',
    textAlign: 'right',

    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: '16px',
    color: 'rgba(24, 24, 24, 1)'
  },
  blueSquareInfo: {
    background: 'rgba(191, 206, 253, 1)',
    border: '1px solid #9FB7FF',
    boxSizing: 'border-box',
    borderRadius: '1px',
    marginTop: '15px',
    width: '100%',
    height: '230px',

    fontSize: '11px',
    fontStyle: 'normal',
    lineHeight: '18px',
    letterSpacing: '0em',
    textAlign: 'left',
    padding: '10px 20px'
  },
  inputWithTitle: {
    borderBottom: '1px solid rgba(255, 255, 255, 0.6)',
    marginTop: '7px'
  },
  titleComponentInputWithTitle: {
    fontSize: '7px',
    fontStyle: 'normal',
    fontWeight: 700,
    lineHeight: '9px',
    letterSpacing: '0.5px',
    textAlign: 'left',
    marginBottom: '1px',
    color: '#000000',
    opacity: 0.7
  },
  valueComponentInputWithTitle: {},
  inputValueComponentInputWithTitle: {
    width: '100%',
    border: 'none',
    background: 'transparent',
    '-webkit-appearance': 'none',
    outline: 'none',
    marginBottom: '7px',
    color: 'black'
  },
  listInfo: {
    width: '100%',
    height: '150px',
    overflow: 'hidden',
    textAlign: 'left',
    display: 'flex',
    marginTop: '12px'
  },
  listWithItems: {
    width: '50%'
  },
  titleList: {
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: '7px',
    lineHeight: '9px',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    color: '#000000',
    marginBottom: '2px'
  },
  itemList: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '10px',
    lineHeight: '150%',
    color: '#000000',
    marginBottom: '2px'
  },
  moreInfoButton: {
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: '11px',
    lineHeight: '150%',
    color: '#2D3047',
    textDecoration: 'none'
  }
}));
