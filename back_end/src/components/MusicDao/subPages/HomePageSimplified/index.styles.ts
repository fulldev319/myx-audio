import makeStyles from '@material-ui/core/styles/makeStyles';
import { Color } from 'shared/ui-kit';

export const homePageStyles = makeStyles((theme) => ({
  contentBox: {
    padding: `96px ${theme.spacing(10)}px ${theme.spacing(5)}px`,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: 1600,
    marginLeft: 'auto',
    marginRight: 'auto',
    [theme.breakpoints.down('md')]: {
      padding: `60px ${theme.spacing(2)}px ${theme.spacing(10)}px`
    }
  },
  musicBox1: {
    position: 'absolute',
    top: -90,
    right: 300,
    opacity: 0.7,
    [theme.breakpoints.down('sm')]: {
      top: -60,
      right: 150,
      width: 120
    }
  },
  musicBox2: {
    position: 'absolute',
    top: 20,
    right: 80,
    [theme.breakpoints.down('sm')]: {
      right: 0,
      top: -36,
      width: 200
    }
  },
  flexBox: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  header: {
    color: `${Color.White} !important`,
    textAlign: 'center',
    margin: 0,
    fontSize: 58,
    [theme.breakpoints.down('md')]: {
      fontSize: 52
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 36
    },
    fontWeight: 800,

    lineHeight: '62px',
    '& span': {
      fontWeight: 400
    }
  },
  headerTitle: {
    fontSize: '26px !important',
    textAlign: 'center',
    [theme.breakpoints.down('md')]: {
      fontSize: '22px !important'
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '18px !important'
    }
  },
  bgLinearGreen: {
    background: 'linear-gradient(140.41deg, #2DE0AA 6.28%, #00ABBF 103.2%)',
    borderRadius: 20
  },
  bgLinearOrange: {
    background: 'linear-gradient(131.53deg, #FFD914 -6.52%, #F1A025 58.06%)',
    borderRadius: 20
  },
  bgLinearBlue: {
    background: 'linear-gradient(140.41deg, #7BB3E8 6.28%, #6A86E8 103.2%)',
    borderRadius: 20
  },
  stakingValue: {
    fontSize: '26px !important',
    '& span': {
      opacity: 0.4
    }
  },
  stakingTitle: {
    textTransform: 'uppercase'
  },
  carouselContainer: {
    width: '100%',
    // maxWidth: "100vw",
    overflow: 'hidden'
    // marginLeft: `-${theme.spacing(21)}px`,

    // [theme.breakpoints.down("md")]: {
    //   marginLeft: `-${theme.spacing(4)}px`,
    // },
  },
  carouselBox: {
    minWidth: `calc(100% - ${theme.spacing(21)}px * 2)`,
    width: `calc(100% - ${theme.spacing(21)}px * 2)`,
    height: 448,
    flex: 1,
    margin: `0 ${theme.spacing(21)}px`,

    // [theme.breakpoints.down("md")]: {
    //   minWidth: `calc(100% - ${theme.spacing(4)}px * 2)`,
    //   margin: `0 ${theme.spacing(4)}px`,
    // },

    // "& > div": {
    //   width: `calc(100% - ${theme.spacing(21)}px * 2)`,
    //   marginLeft: `${theme.spacing(21)}px`,

    //   [theme.breakpoints.down("md")]: {
    //     width: `calc(100% - ${theme.spacing(4)}px * 2)`,
    //     marginLeft: `${theme.spacing(4)}px`,
    //   },
    // },

    '& > div > div': {
      transform: 'scale(0.8)',
      opacity: '1 !important',
      background: 'white',
      borderRadius: '20px',

      '&:first-child': {
        transform: 'translateY(-50%) translateX(-50%) scale(0.8) !important',
        zIndex: '1 !important',
        '@media (max-width: 750px)': {
          transform: 'translateY(-50%) translateX(-50%) scale(0.9) !important'
        }
      },

      '&:nth-child(2)': {
        zIndex: '2 !important',
        transform: 'translateY(-50%) translateX(-50%) scale(0.87) !important',
        '@media (max-width: 1050px)': {
          transform: 'translateY(-50%) translateX(-50%) scale(0.9) !important',
          '@media (max-width: 750px)': {
            transform: 'translateY(-50%) translateX(-50%) scale(1) !important',
            '& > div': {
              opacity: 1
            }
          }
        }
      },

      '&:nth-child(3)': {
        zIndex: '4 !important',
        transform: 'translateY(-50%) translateX(-50%) scale(1) !important',
        '& > div': {
          opacity: 1
        },
        '@media (max-width: 1050px)': {
          transform: 'translateY(-50%) translateX(-50%) scale(1) !important',
          '& > div': {
            opacity: 1
          },
          '@media (max-width: 750px)': {
            '&:last-child': {
              transform:
                'translateY(-50%) translateX(-50%) scale(0.9) !important',
              '& > div': {
                opacity: 0.8
              }
            }
          }
        }
      },

      '&:nth-child(4)': {
        zIndex: '3 !important',
        transform: 'translateY(-50%) translateX(-50%) scale(0.87) !important',
        '@media (max-width: 1050px)': {
          zIndex: '2 !important',
          transform: 'translateY(-50%) translateX(-50%) scale(0.9) !important',
          '& > div': {
            opacity: 0.8
          }
        }
      },

      '&:nth-child(5)': {
        zIndex: '3 !important',
        transform: 'translateY(-50%) translateX(-50%) scale(0.93) !important',
        '@media (max-width: 1050px)': {
          zIndex: '1 !important',

          '&:last-child': {
            transform: 'translateY(-50%) translateX(-50%) scale(0.8) !important'
          }
        }
      },

      '&:nth-child(6)': {
        zIndex: '2 !important',

        transform: 'translateY(-50%) translateX(-50%) scale(0.87) !important'
      },

      '&:last-child': {
        zIndex: '1 !important',
        transform: 'translateY(-50%) translateX(-50%) scale(0.8) !important',
        '@media (max-width: 750px)': {
          transform: 'translateY(-50%) translateX(-50%) scale(0.9) !important'
        }
      },

      '& > div': {
        width: '100% !important',
        opacity: 0.8,
        minWidth: '380px !important',
        '@media (max-width: 900px)': {
          minWidth: '380px !important'
        },

        '& > div': {
          width: '100%'
        }
      }
    },

    [theme.breakpoints.down('sm')]: {
      width: '100%',
      margin: `0px ${theme.spacing(10)}px`,
      padding: '0 75px'
    },
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      margin: `0px ${theme.spacing(5)}px`
    }
  },
  arrowBox: {
    display: 'flex',
    alignItems: 'center',
    background: 'white',
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    borderRadius: theme.spacing(4),
    boxShadow: '0px 10px 21px -9px rgba(105, 105, 105, 0.15)'
  },
  whiteBox: {
    position: 'relative',
    borderRadius: theme.spacing(2.5),
    padding: theme.spacing(4),
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  stackTopBox: {
    background:
      'linear-gradient(97.63deg, #4DCCC4 12.09%, #48B6BD 64.41%), linear-gradient(131.53deg, #14FF80 -6.52%, #25C0F1 66.53%)',
    borderRadius: theme.spacing(2.5),
    boxShadow: '0px 22px 21px -16px rgba(25, 75, 91, 0.12)',
    display: 'flex',
    position: 'relative',
    overflow: 'hidden'
  },
  stackTopImage1: {
    position: 'absolute',
    bottom: -theme.spacing(2),
    left: '50%',
    transform: 'rotate(-30deg)'
  },
  stackTopImage2: {
    position: 'absolute',
    top: theme.spacing(2),
    right: 0,
    width: theme.spacing(8)
  },
  footerBox: {
    marginTop: 16
  },
  topBtnRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing(4),
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column'
    },
    '& > button': {
      minWidth: 270,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }
}));
