import { makeStyles } from '@material-ui/core/styles';
import { Color } from 'shared/ui-kit';

export const unstackBopModalStyles = makeStyles((theme) => ({
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
  header4: {
    fontSize: 14,
    fontWeight: 500,
    color: Color.MusicDAOLightBlue
  },
  greenBox: {
    background: 'linear-gradient(0deg, #F2FBF6, #F2FBF6), #17172D',
    borderRadius: theme.spacing(1.5),
    padding: theme.spacing(2)
  },
  tokenSelect: {
    borderRadius: '44px !important',
    backgroundColor: 'rgba(218, 230, 229, 0.8) !important',
    '& .MuiSelect-root': {
      '& div': {
        fontSize: 14,
        color: '#181818',
        fontWeight: 600
      }
    }
  },
  tokenValue: {
    height: 50,
    background: 'rgba(218, 230, 229, 0.4)',
    border: '1px solid #7BCBB7',
    borderRadius: 44,
    paddingLeft: 18,
    paddingRight: 14,
    '& input': {
      color: '#2D3047',
      fontSize: 18,
      fontWeight: 500,
      outline: 'none',
      border: 'none',
      background: 'transparent',
      marginRight: 12
    },
    '& span': {
      fontSize: 14,
      color: '#54658F',
      whiteSpace: 'nowrap'
    }
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
