import { makeStyles } from '@material-ui/core/styles';
import { Color, Gradient } from 'shared/ui-kit';

export const useGeneralTabStyles = makeStyles((theme) => ({
  titleBar: {
    height: 94,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 30px',

    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: 18,
    lineHeight: '130%',
    color: '#2D3047',
    borderBottom: '1px solid #DAE6E5'
  },
  workSpace: {
    background:
      'linear-gradient(180deg, rgba(218, 230, 229, 0.2) 16.84%, rgba(255, 255, 255, 0) 49.69%), linear-gradient(0deg, #FFFFFF, #FFFFFF), #DAE6E5',
    display: 'flex',
    justifyContent: 'center',
    height: 'calc(100vh - 216px)',
    overflowY: 'auto'
  },
  footerBar: {
    width: '100%',
    position: 'fixed',
    bottom: 0,
    height: 122,
    border: '1px solid #DAE6E5',
    display: 'flex',
    [theme.breakpoints.down('xs')]: {
      padding: '0 16px'
    }
  },
  buttons: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    // marginTop: "32px",
    '& button': {
      width: '300px',
      height: '59px',
      borderRadius: '48px',

      fontWeight: 800,
      lineHeight: '20px',
      border: 'none',
      maxWidth: 'auto',
      '&:first-child': {
        background: '#FFFFFF',
        color: '#2D3047',
        border: '1px solid #2D3047',
        marginRight: 32,
        [theme.breakpoints.down('xs')]: {
          marginRight: 4
        }
      },
      '&:last-child': {
        marginLeft: 32,
        [theme.breakpoints.down('xs')]: {
          marginLeft: 4
        }
      }
    }
  },
  tabsWrap: {
    display: 'flex',
    height: 'fit-content',
    background: '#F0F5F8',
    padding: 8,
    borderRadius: '100vh'
  },
  tabBox: {
    padding: '10px 24px',
    borderRadius: '100vh',
    // color: "#181818",
    // fontWeight: 500,
    // fontSize: 14,
    cursor: 'pointer',
    '& + &': {
      marginLeft: 36
    },
    [theme.breakpoints.down('sm')]: {
      padding: '8px',
      '& + &': {
        marginLeft: 18
      }
    },
    [theme.breakpoints.down('xs')]: {
      padding: '6px 5px',
      '& + &': {
        marginLeft: 8
      }
    }
  },
  flexBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column'
    }
  },
  whiteBox: {
    background: 'white',
    borderRadius: theme.spacing(2.5),
    maxWidth: 320,
    height: 295,
    padding: theme.spacing(2),
    textAlign: 'center',
    lineHeight: '24.7px',
    color: Color.MusicDAODark,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    marginBottom: theme.spacing(2),
    cursor: 'pointer',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'
  },
  header1: {
    fontSize: '19px',
    fontWeight: 800,
    color: Color.MusicDAODark
  },
  header2: {
    fontSize: '19px',
    fontWeight: 800,
    color: 'transparent',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    background: Gradient.Green
  },
  header3: {
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: '22.4px',
    color: Color.MusicDAODark
  },
  header21: {
    fontSize: '19px',
    fontWeight: 800,
    color: 'transparent',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    background: Gradient.BlueMagenta
  }
}));
