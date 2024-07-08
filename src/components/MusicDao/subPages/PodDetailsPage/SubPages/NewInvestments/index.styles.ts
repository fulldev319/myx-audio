import makeStyles from '@material-ui/core/styles/makeStyles';

export const investmentStyles = makeStyles((theme) => ({
  investmentTab: {},
  addressSection: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(101, 203, 99, 0.15)',
    borderRadius: 6,
    padding: '4px 6px'
  },
  totalAmountSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'linear-gradient(0deg, #F2FBF6, #F2FBF6), #17172D',
    border: '1px solid #DAE6E5',
    borderRadius: 12,
    padding: 37,
    marginTop: 35,
    position: 'relative'
  },
  priceSection: {
    display: 'flex',
    background:
      'linear-gradient(259.56deg, #ECF100 10.86%, #00C5A1 22.17%, #2CC2FF 43.77%, #6B53FF 77.23%), linear-gradient(95.88deg, #A0D800 -1.09%, #0DCC9E 59.49%)',
    borderRadius: 20,
    padding: 32,
    marginTop: 18,
    position: 'relative',
    '& img': {
      borderRadius: 14
    }
  },
  lineBarBox: {
    height: 17,
    width: 510,
    background: '#2D304720',
    borderRadius: '100px',
    padding: 3
  },
  innerLineBarBox: {
    height: 11,
    width: 420,
    background:
      'linear-gradient(90deg, #FFFFFF 9.05%, rgba(255, 255, 255, 0) 99.04%)',
    borderRadius: '100px'
  },
  investorsBox: {
    background:
      'linear-gradient(174.93deg, rgba(255, 255, 255, 0) -13.7%, #FFFFFF 71.39%), linear-gradient(116.14deg, #0184FC -7.88%, #2CC2FF 24.37%, #536FFF 46.4%)',
    borderRadius: 19,
    width: '60%',
    marginRight: 32
  },
  profileSection: {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 19,
    border: '2px solid #9ABFF6',
    background: '#fff'
  },
  recentInvestSection: {
    display: 'flex',
    flexDirection: 'column',
    background: '#fff',
    border: '1px solid rgba(84, 101, 143, 0.3)',
    borderRadius: 20,
    padding: '38px 38px 10px 38px'
  },
  carouselWrapper: {
    height: '260px',
    flex: 1,
    [theme.breakpoints.down('md')]: {
      minWidth: `calc(100% - ${theme.spacing(4)}px * 2)`,
      margin: `0 ${theme.spacing(4)}px`
    },

    '& > div': {
      width: `calc(100% - ${theme.spacing(21)}px * 2)`,
      marginLeft: `${theme.spacing(21)}px`,

      [theme.breakpoints.down('md')]: {
        width: `calc(100% - ${theme.spacing(4)}px * 2)`,
        marginLeft: `${theme.spacing(4)}px`
      }
    },

    '& > div > div': {
      transform: 'scale(0.8)',
      opacity: '1 !important',
      borderRadius: '20px',

      '&:first-child': {
        transform: 'translateY(100%) translateX(-50%) scale(0.8) !important',
        zIndex: '1 !important'
      },

      '&:nth-child(2)': {
        zIndex: '2 !important',
        transform: 'translateY(40%) translateX(-50%) scale(0.87) !important',
        '@media (max-width: 1050px)': {
          transform: 'translateY(-50%) translateX(-50%) scale(0.9) !important'
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
          '@media (max-width: 600px)': {
            '&:last-child': {
              transform:
                'translateY(-50%) translateX(-50%) scale(0.8) !important',
              '& > div': {
                opacity: 0.8
              }
            }
          }
        }
      },

      '&:nth-child(4)': {
        zIndex: '3 !important',
        transform: 'translateY(40%) translateX(-50%) scale(0.87) !important',
        '@media (max-width: 1050px)': {
          zIndex: '2 !important',
          transform: 'translateY(-50%) translateX(-50%) scale(0.9) !important',
          '& > div': {
            opacity: 0.8
          }
        }
      },
      '&:last-child': {
        zIndex: '1 !important',
        transform: 'translateY(100%) translateX(-50%) scale(0.8) !important'
      },
      '& > div': {
        width: '100% !important',
        minWidth: '260px !important',

        '& > div': {
          width: '100%'
        }
      }
    }
  },
  stampImg: {
    position: 'absolute',
    right: '-35px',
    top: '140px',
    transform: 'translate(-50%, -60%)',
    width: 200
  },
  typo1: {
    fontSize: 22,
    fontWeight: 800,

    color: '#2D3047'
  },
  typo2: {
    fontSize: 14,
    fontWeight: 600,

    color: '#65CB63'
  },
  typo3: {
    fontSize: 16,
    fontWeight: 500,

    color: '#707582'
  },
  typo4: {
    fontSize: 28,
    fontWeight: 800,

    color: '#081831'
  },
  typo5: {
    fontSize: 16,
    fontWeight: 800,

    color: '#fff'
  },
  typo6: {
    fontSize: 37,
    fontWeight: 800,

    color: '#fff',
    '& span': {
      color: '#ffffff50'
    }
  },
  typo7: {
    fontSize: 18,
    fontWeight: 400,

    color: '#fff'
  },
  typo8: {
    fontSize: 22,
    fontWeight: 700,

    color: '#fff'
  },
  typo9: {
    fontSize: 16,
    fontWeight: 500,

    color: '#54658F'
  },
  typo10: {
    fontSize: 19,
    fontWeight: 800,

    color: '#000'
  },
  typo11: {
    fontSize: 20,
    fontWeight: 800,

    color: '#2D3047'
  },
  typo12: {
    fontSize: 12,
    fontWeight: 700,

    color: '#65CB63'
  },
  typo13: {
    fontSize: 13,
    fontWeight: 500,

    color: '#2D3047'
  }
}));
