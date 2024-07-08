import { makeStyles } from '@material-ui/core/styles';

export const freeMusicPageStyles = makeStyles((theme) => ({
  content: {
    background: 'linear-gradient(180.15deg, #FFFFFF 2.8%, #EEF2F6 89.51%)',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: '60px 168px 150px 168px',
    overflowY: 'auto',
    overflowX: 'hidden',
    position: 'relative',
    [theme.breakpoints.down('md')]: {
      padding: `${theme.spacing(2)}px ${theme.spacing(2)}px`
    }
  },
  gradient: {
    position: 'absolute',
    width: '100%',
    height: '1200px',
    left: 0,
    top: 0
  },
  flexBox: {
    display: 'flex',
    alignItems: 'center'
  },
  headerTitle: {
    fontSize: '58px',
    fontWeight: 400,
    color: 'white',
    [theme.breakpoints.down('xs')]: {
      fontSize: '40px',
      lineHeight: '52px'
    }
  },
  header1: {
    fontSize: 30,
    fontWeight: 700,
    [theme.breakpoints.down('xs')]: {
      fontSize: 20
    }
  },
  header1_1: {
    fontSize: 28,
    fontWeight: 700,
    color: '#2D3047',
    [theme.breakpoints.down('sm')]: {
      fontSize: 24
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 22
    }
  },
  header1_2: {
    fontSize: 30,
    fontWeight: 700,
    color: '#2D3047',
    [theme.breakpoints.down('xs')]: {
      fontSize: 23
    }
  },
  header1_3: {
    fontSize: 30,
    fontWeight: 700,
    color: '#2D3047',
    [theme.breakpoints.down('xs')]: {
      fontSize: 26
    }
  },
  header2: {
    fontSize: 26,
    fontWeight: 400,
    lineHeight: '39px',
    [theme.breakpoints.down('xs')]: {
      fontSize: 16,
      lineHeight: '24px'
    }
  },
  header2_1: {
    fontSize: 24,
    fontWeight: 700,
    lineHeight: '29px',
    [theme.breakpoints.down('sm')]: {
      fontSize: 22,
      lineHeight: '26.82px'
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 20,
      lineHeight: '24.38px'
    }
  },
  header2_2: {
    fontSize: 24,
    fontWeight: 700,
    lineHeight: '29px',
    [theme.breakpoints.down('xs')]: {
      fontSize: 20
    },
    [theme.breakpoints.down(500)]: {
      fontSize: 18
    },
    [theme.breakpoints.down(405)]: {
      fontSize: 16
    },
    [theme.breakpoints.down(400)]: {
      fontSize: 24
    }
  },
  header2_3: {
    fontSize: 22,
    fontWeight: 800,
    lineHeight: '29px',
    [theme.breakpoints.down('sm')]: {
      fontSize: 20,
      lineHeight: '26px'
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 18,
      lineHeight: '23.4px'
    }
  },
  header2_4: {
    fontSize: 24,
    fontWeight: 400,
    color: '#404658'
  },
  header3: {
    fontSize: 18,
    fontWeight: 700,
    [theme.breakpoints.down('sm')]: {
      fontSize: 15
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 14
    }
  },
  header3_1: {
    fontSize: 18,
    fontWeight: 700,
    [theme.breakpoints.down('sm')]: {
      fontSize: 15
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 14
    }
  },
  header3_2: {
    fontSize: 16,
    fontWeight: 700
  },
  header4: {
    fontSize: 14,
    fontWeight: 600,
    lineHeight: '18px'
  },
  header5: {
    fontSize: 13,
    fontWeight: 600,
    color: '#54658F'
  },
  header6: {
    fontSize: 12,
    fontWeight: 600,
    color: '#ffffff',
    marginLeft: 6
  },
  horizontalScrollBox: {
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    overflow: 'scroll',
    paddingBottom: theme.spacing(6),
    '&::-webkit-scrollbar': {
      display: 'none'
    }
  },
  whiteBox: {
    height: 205,
    minWidth: 257,
    borderRadius: theme.spacing(4),
    background: 'white',
    boxShadow: '0px 33px 35px -18px rgba(29, 103, 84, 0.13)',
    padding: '26px 36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    [theme.breakpoints.down('sm')]: {
      minWidth: 226,
      padding: '26px 22px 32px 30px',
      textAlign: 'center'
    },
    [theme.breakpoints.down(750)]: {
      minWidth: 164,
      padding: '26px 16px 32px 16px',
      textAlign: 'center'
    },
    [theme.breakpoints.down(650)]: {
      minWidth: 164,
      padding: '22px 14px 16px 14px',
      textAlign: 'center'
    },
    [theme.breakpoints.down('xs')]: {
      minWidth: 164,
      padding: '26px 19px 32px 18px',
      textAlign: 'center'
    }
  },
  percentValueBox: {
    padding: '4px 14px',
    borderRadius: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      padding: '4px 10px'
    }
  },
  secondButtonBox: {
    padding: '10px 16px',
    borderRadius: theme.spacing(4),
    cursor: 'pointer',
    border: '1px solid #7977D1',
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      padding: '6px 12px'
    }
  },
  showAllBtnBox: {
    padding: '14px 32px 14px 48px',
    borderRadius: theme.spacing(4),
    cursor: 'pointer',
    border: '1px solid #65CB63',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  graphBox: {
    background: '#ffffff',
    borderRadius: theme.spacing(4),
    padding: theme.spacing(4),
    [theme.breakpoints.down('xs')]: {
      padding: '22px 12px 45px 12px'
    }
  },
  headerControlBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: '#F0F5F8',
    borderRadius: theme.spacing(4),
    [theme.breakpoints.down(400)]: {
      marginTop: theme.spacing(2)
    }
  },
  controlBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: '#F0F5F8',
    borderRadius: theme.spacing(4)
  },
  buttonBox: {
    borderRadius: theme.spacing(4),
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    color: '#2D3047',
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 500,
    [theme.breakpoints.down('xs')]: {
      fontSize: 11,
      textAlign: 'center'
    }
  },
  selectedButtonBox: {
    background: '#2D3047',
    color: 'white',
    fontSize: 14,
    fontWeight: 500,
    [theme.breakpoints.down('xs')]: {
      fontSize: 11,
      textAlign: 'center'
    }
  },
  graphTobBox: {
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: '1px solid #00000022',
    paddingBottom: 24,
    [theme.breakpoints.down(400)]: {
      flexDirection: 'column'
    }
  },
  graphFilterBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 24,
    [theme.breakpoints.down('xs')]: {
      paddingLeft: 16
    }
  }
}));
