import makeStyles from '@material-ui/core/styles/makeStyles';

export const usePageStyles = makeStyles((theme) => ({
  background: {
    overflow: 'auto',
    background: '#F0F5F8',
    position: 'relative'
  },
  gradientBox: {
    width: '100%',
    height: '200%',
    maxHeight: 2000,
    background:
      'linear-gradient(180deg, rgba(243, 254, 247, 0) 25.89%, #EEF2F6 81.71%), conic-gradient(from 71.57deg at 43.63% 99.9%, #2B99FF -34.07deg, #B234FF 21.26deg, #4434FF 224.01deg, #250EB3 256.07deg, #2B99FF 325.93deg, #B234FF 381.26deg), linear-gradient(97.63deg, #99CE00 26.36%, #0DCC9E 80%)',
    position: 'absolute',
    left: 0,
    top: 0,
    [theme.breakpoints.down('sm')]: {
      height: 800
    }
  },
  content: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    maxWidth: 1600,
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: `100px ${theme.spacing(10)}px 150px`,
    [theme.breakpoints.down('md')]: {
      padding: `60px ${theme.spacing(2)}px 150px`
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
    background: '#2D3047',
    padding: '18px 21px',
    borderRadius: '100px',
    cursor: 'pointer'
  },
  controlBox: {
    borderRadius: theme.spacing(4),
    background: 'rgba(45, 48, 71, 0.2)'
  },
  filterBtn: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 43,
    padding: '11px 20px',
    cursor: 'pointer'
  },
  filterButtonBox: {
    background: 'rgba(240, 245, 248, 0.7)',
    display: 'flex',
    alignItems: 'center',
    padding: `${theme.spacing(1)}px ${theme.spacing(1.5)}px`,
    borderRadius: theme.spacing(4),
    cursor: 'pointer',
    marginLeft: 8,
    color: '#2D3047',
    [theme.breakpoints.down('xs')]: {
      padding: '8px 14px'
    }
  },
  title: {
    fontSize: 32,
    fontWeight: 800,
    lineHeight: '104.5%',
    color: '#fff'
  },
  typo1: {
    fontSize: 14,
    fontWeight: 600,
    color: '#000'
  }
}));
