import makeStyles from '@material-ui/core/styles/makeStyles';

export const artistPageStyles = makeStyles((theme) => ({
  content: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    maxWidth: 1600,
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: `60px ${theme.spacing(10)}px 150px`,
    [theme.breakpoints.down('md')]: {
      padding: `60px ${theme.spacing(2)}px 150px`
    }
  },
  background: {
    overflow: 'auto'
  },
  gradientBox: {
    width: '100%',
    height: '300%',
    position: 'absolute',
    left: 0,
    top: 0,
    [theme.breakpoints.down('sm')]: {
      height: 800
    }
  },
  carouselContainer: {
    width: '100%',
    overflow: 'hidden'
  },
  carouselBox: {
    minWidth: `calc(100% - ${theme.spacing(21)}px * 2)`,
    width: `calc(100% - ${theme.spacing(21)}px * 2)`,
    height: 448,
    flex: 1,
    margin: `0 ${theme.spacing(21)}px`,

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

  controlBox: {
    borderRadius: theme.spacing(4),
    background: 'rgba(45, 48, 71, 0.2)'
  },
  topBox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    [theme.breakpoints.down(750)]: {
      flexDirection: 'column'
    }
  },
  topControlBox: {
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down(750)]: {
      width: '100%'
    }
  },
  filterBox: {
    borderRadius: theme.spacing(4),
    background: 'rgba(45, 48, 71, 0.2)',
    padding: `${theme.spacing(0.5)}px ${theme.spacing(2)}px`
  },
  avatar: {
    marginLeft: -12
  }
}));
