import { makeStyles } from '@material-ui/core/styles';
import { Color } from 'shared/ui-kit';

export const unravelBopStyles = makeStyles((theme) => ({
  root: {
    textAlign: 'center'
  },
  title: {
    fontSize: 22,
    fontWeight: 800,
    '& span': {
      fontWeight: 400
    }
  },
  header1: {
    fontSize: 16,
    fontWeight: 600,
    color: '#54658F'
  },
  header2: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#65CB63'
  },
  header3: {
    fontSize: 28,
    fontWeight: 800,
    color: Color.MusicDAODark,
    '& span': {
      color: Color.MusicDAOGray
    }
  },
  greenBox: {
    background: 'linear-gradient(0deg, #F2FBF6, #F2FBF6), #17172D',
    borderRadius: theme.spacing(1.5),
    padding: theme.spacing(2)
  },
  customButtonBox: {
    cursor: 'pointer',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(1),
    '& svg': {
      position: 'absolute',
      right: 0,
      top: 0,
      left: 0,
      transform: 'translate(0, 0)',
      height: '100%',
      zIndex: 0
    }
  }
}));
