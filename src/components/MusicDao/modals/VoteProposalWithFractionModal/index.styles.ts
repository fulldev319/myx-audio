import makeStyles from '@material-ui/core/styles/makeStyles';

export const useVoteProposalWithFractionModalStyles = makeStyles((theme) => ({
  root: {
    color: '#2D3047'
  },
  title: {
    fontSize: 22,
    fontWeight: 800
  },
  text1: {
    fontSize: 18,
    fontWeight: 500,
    color: '#54658F'
  },
  text2: {
    fontSize: 16,
    fontWeight: 600,
    color: '#54658F'
  },
  text3: {
    fontSize: 18,
    fontWeight: 600,
    color: '#54658F'
  },
  button: {
    borderRadius: '48px !important',
    height: '61px !important',
    fontSize: '16px !important',
    padding: '8px 20px !important'
  },
  divider: {
    backgroundColor: 'black',
    opacity: 0.1,
    width: '100%',
    height: '1px'
  },
  secondGrid: {
    borderLeft: '1px solid #1818181A',
    [theme.breakpoints.down('xs')]: {
      borderLeft: 'none',
      borderTop: '1px solid #1818181A'
    }
  },
  box: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 125,
    background: '#F2FBF6',
    borderRadius: 12
  },
  token: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(218, 230, 229, 0.4)',
    border: '1px solid #7BCBB7',
    borderRadius: 55,
    padding: 8,
    height: 45,
    '& input': {
      border: 'none',
      outline: 'none',
      background: 'transparent',
      flex: 1,
      marginLeft: 8,
      marginRigth: 8
    },
    '& span': {
      color: '#2D3047',
      fontSize: 14,
      fontWeight: 600,
      opacity: 0.7
    }
  },
  select: {
    background: '#DAE6E5',
    borderRadius: 55,
    height: 45,
    width: '100%',
    paddingLeft: 16,
    paddingRight: 16
  },
  progressTitle: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    top: 0,
    left: 0
  }
}));
