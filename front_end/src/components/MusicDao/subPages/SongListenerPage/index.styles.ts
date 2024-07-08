import makeStyles from '@material-ui/core/styles/makeStyles';

export const songListenerPageStyles = makeStyles((theme) => ({
  root: {
    background:
      'linear-gradient(180deg, rgba(243, 254, 247, 0) -0.92%, #EEF2F6 63.74%), linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)',
    width: '100%',
    height: '100vh'
  },
  infoContainer: {
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    overflowX: 'hidden',
    position: 'relative',
    maxWidth: 1600,
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: `60px ${theme.spacing(10)}px 150px`,
    [theme.breakpoints.down('md')]: {
      padding: `60px ${theme.spacing(2)}px 150px`
    }
  },
  title: {
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: '24px',
    lineHeight: '122%',
    textAlign: 'center',
    color: '#2D3047',
    textShadow: '0px 0px 20px rgba(255, 255, 255, 0.3)',
    [theme.breakpoints.down('sm')]: {
      fontSize: 16
    },
    [theme.breakpoints.down('xs')]: {
      textAlign: 'left'
    }
  },
  reviewInfo: {
    background: '#FFFFFF',
    borderRadius: 20,
    display: 'flex',
    alignItems: 'center',
    padding: '32px 32px',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column'
    },
    '& > div': {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      '& > div': {
        display: 'flex',
        flexDirection: 'column',
        '& span:first-child': {
          fontWeight: 600,
          fontSize: 14,
          color: '#54658F',
          marginBottom: 8,
          [theme.breakpoints.down('sm')]: {
            fontSize: 12
          },
          [theme.breakpoints.down('xs')]: {
            fontSize: 14
          }
        },
        '& span:last-child': {
          fontStyle: 'normal',
          fontWeight: '800',
          fontSize: '20px',
          lineHeight: '120%',
          color: '#2D3047',
          [theme.breakpoints.down('sm')]: {
            fontSize: 16
          },
          [theme.breakpoints.down('xs')]: {
            fontSize: 20
          }
        }
      },
      [theme.breakpoints.down('xs')]: {
        flex: 'unset',
        width: '100%',
        justifyContent: 'left'
      }
    },
    '& > div + div': {
      borderLeft: '1px solid #1818181A',
      [theme.breakpoints.down('xs')]: {
        marginTop: 16,
        paddingTop: 16,
        borderLeft: 'none',
        borderTop: '1px solid #1818181A'
      }
    }
  },
  tabContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 50
  },
  tableSection: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    borderBottom: '1px solid #00000022',
    overflow: 'scroll',
    '&::-webkit-scrollbar': {
      width: 0,
      height: 0
    }
  },
  tabItem: {
    fontSize: 14,
    fontWeight: 800,
    cursor: 'pointer',
    color: '#2D304780',
    whiteSpace: 'nowrap',
    textTransform: 'uppercase',
    '& + &': {
      marginLeft: theme.spacing(13)
    },
    [theme.breakpoints.down('sm')]: {
      '& + &': {
        marginLeft: theme.spacing(5)
      }
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 12,
      '& + &': {
        marginLeft: theme.spacing(2)
      }
    }
  },
  tabItemActive: {
    color: '#2D3047',
    borderBottom: '2px solid #2D3047'
  },
  buttons: {
    display: 'flex',
    alignItems: 'center',
    '& button': {
      borderRadius: 30,
      fontSize: 16,
      height: 40
    }
  },
  table: {
    '& .MuiTableRow-root.MuiTableRow-head': {
      backgroundColor: 'transparent',
      '& .MuiTableCell-root.MuiTableCell-head': {
        fontSize: 14,
        color: '#2D3047',
        padding: '0 16px'
      }
    }
  },
  tableText: {
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: '14px',
    color: '#181818'
  }
}));
