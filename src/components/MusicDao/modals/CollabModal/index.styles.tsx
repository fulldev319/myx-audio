import { makeStyles } from '@material-ui/core/styles';

export const collabModalStyles = makeStyles((theme) => ({
  root: {
    maxWidth: '653px',
    background: 'white',
    overflow: 'visible'
  },
  contentBox: {
    padding: theme.spacing(1),
    paddingTop: theme.spacing(10),
    color: '#2D3047',
    textAlign: 'center'
  },
  avatar: {
    position: 'absolute',
    left: '50%',
    top: -26,
    transform: 'translate(-50%, -15%)'
  },
  percent: {
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: 19,
    lineHeight: '104.5%',
    textAlign: 'center',
    color: '#65CB63'
  },
  moreBox: {
    textAlign: 'center',
    padding: `${theme.spacing(1)}px ${theme.spacing(6)}px`,
    background: 'linear-gradient(0deg, #F2FBF6, #F2FBF6), #17172D',
    borderRadius: 16
  },
  header1: {
    fontSize: 22,
    fontWeight: 800,
    lineHeight: '28.6px',
    color: '#2D3047'
  },
  header2: {
    fontSize: 14,
    fontWeight: 500,
    lineHeight: '21px',
    color: '#54658F',
    padding: '0px 30px',
    opacity: 0.9
  }
}));
