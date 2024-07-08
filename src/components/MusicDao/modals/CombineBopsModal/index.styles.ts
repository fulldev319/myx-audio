import { makeStyles } from '@material-ui/core/styles';
import { Color } from 'shared/ui-kit';

export const combineBopsModalStyles = makeStyles((theme) => ({
  root: {
    textAlign: 'center',
    background: 'linear-gradient(0deg, #EEF2F7, #EEF2F7), #F0F5F8'
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
    color: Color.MusicDAOLightBlue
  },
  header2: {
    fontSize: 18,
    fontWeight: 800,
    color: Color.MusicDAODeepGreen
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
    fontSize: 12,
    fontWeight: 500,
    color: Color.MusicDAODark
  },
  greenBox: {
    borderRadius: theme.spacing(1.5),
    padding: theme.spacing(2),
    background: 'linear-gradient(0deg, #F2FBF6, #F2FBF6), #17172D',
    textTransform: 'uppercase'
  },
  bottomBox: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative'
  },
  spreadImg: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    height: '100%'
  },
  customButtonBox: {
    cursor: 'pointer',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    padding: theme.spacing(1),
    minWidth: '180px',
    '& svg': {
      position: 'absolute',
      right: 0,
      top: 0,
      left: 0,
      transform: 'translate(0, 0)',
      height: '100%',
      zIndex: 0
    }
  },
  select: {
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    background: '#DAE6E5',
    borderRadius: theme.spacing(10),
    width: '100%'
  },
  paper: {
    borderRadius: theme.spacing(2),
    background: 'linear-gradient(0deg, #F2FBF6, #F2FBF6), #17172D',
    boxShadow:
      '0px 13px 19px -4px rgba(73, 73, 73, 0.15), 0px 24px 39px -1px rgba(1, 1, 1, 0.12)'
  },
  imgBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.spacing(1),
    position: 'relative'
  },
  img: {
    width: theme.spacing(6),
    height: theme.spacing(6),
    borderRadius: theme.spacing(2),
    objectFit: 'cover'
  },
  avatarBox: {
    position: 'absolute',
    right: -theme.spacing(2),
    bottom: -theme.spacing(2)
  },
  tableCell: {
    width: theme.spacing(15),
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  mixBox: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center'
  },
  screBox: {
    zIndex: 1,
    position: 'absolute',
    left: '30%',
    top: 0,
    width: '30%',
    height: '100%',
    transform: 'skew(-20deg)',
    background: 'linear-gradient(0deg, #EEF2F7, #EEF2F7), #F0F5F8'
  },
  circleGroupBox: {
    zIndex: 2,
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-60%, -50%)'
  },
  resultBorderBox: {
    border: '1px solid #00000022',
    borderLeft: 'none',
    borderTopRightRadius: theme.spacing(2),
    borderBottomRightRadius: theme.spacing(2),
    padding: theme.spacing(2)
  },
  circleBox: {
    borderRadius: '100%',
    background: '#6FB4CA22',
    width: theme.spacing(6),
    height: theme.spacing(6),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
}));
