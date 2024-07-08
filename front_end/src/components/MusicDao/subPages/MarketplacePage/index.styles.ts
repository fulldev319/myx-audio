import { makeStyles } from '@material-ui/core/styles';

export const usePageStyles = makeStyles((theme) => ({
  marketplaceRoot: {
    overflow: 'auto',
    height: '100%',
    position: 'relative'
  },
  content: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    maxWidth: 1600,
    marginLeft: 'auto',
    marginRight: 'auto',
    color: '#2D3047',
    padding: '100px 80px 150px',
    [theme.breakpoints.down('md')]: {
      padding: `60px 16px 150px`
    },
    [theme.breakpoints.down('xs')]: {
      padding: `60px 16px 150px`
    }
  },
  headerSection: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 66,
    gridGap: 20,
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column'
    },
    [theme.breakpoints.down('xs')]: {
      marginTop: 13
    }
  },
  leftHeaderSection: {
    display: 'flex',
    flexDirection: 'column',
    background: '#fff',
    borderRadius: 20,
    padding: '21px 21px 28px',
    position: 'relative',
    width: '58%',
    height: 600,
    [theme.breakpoints.down('md')]: {
      width: '100%',
      height: 'auto'
    }
  },
  leftHeaderCollectionImg: {
    width: '100%',
    height: 290,
    borderRadius: 11,
    objectFit: 'cover',
    [theme.breakpoints.down('xs')]: {
      height: 197
    }
  },
  rightHeaderSection: {
    display: 'flex',
    flexDirection: 'column',
    background:
      'linear-gradient(179.38deg, rgba(16, 0, 109, 0.6) 27.99%, rgba(9, 48, 188, 0.39) 107.76%)',
    borderRadius: 20,
    padding: '46px 20px',
    width: '42%',
    height: 600,
    color: '#fff',
    [theme.breakpoints.down('md')]: {
      width: '100%'
    },
    [theme.breakpoints.down('xs')]: {
      padding: '46px 8px'
    }
  },
  transferHistoryHeader: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 14,
    fontWeight: 600,

    marginTop: 27,
    paddingTop: 8,
    paddingBottom: 8,
    color: '#ffffff60',
    borderTop: '1px solid #0C785740',
    borderBottom: '1px solid #0C785740'
  },
  transferHistoryContent: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: 14,

    fontWeight: 600,
    height: 400,
    overflowY: 'scroll',
    '&::-webkit-scrollbar': {
      width: 5
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#00000019'
    }
  },
  transferType: {
    borderRadius: '34px',
    display: 'flex',
    padding: '9px 17px',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 12,
    fontWeight: 600,
    color: '#fff'
  },
  topArtistSection: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 60
  },
  topArtists: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    [theme.breakpoints.down('md')]: {
      justifyContent: 'flex-start',
      gridGap: 24,
      flexWrap: 'wrap'
    },
    [theme.breakpoints.down('xs')]: {
      flexWrap: 'nowrap',
      overflow: 'scroll',
      '&::-webkit-scrollbar': {
        height: 0
      }
    }
  },
  nftCollectionSection: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 60
  },
  newlyMintedSongSection: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 60,
    '& .infinite-scroll-component': {
      overflow: 'visible !important'
    }
  },
  title1: {
    fontSize: 32,
    fontWeight: 700,
    lineHeight: '33.44px',
    color: '#FFFFFF',
    textShadow: '0px 0px 20px rgba(255, 255, 255, 0.3)',
  },
  title: {
    fontSize: 62,
    fontWeight: 800,
    lineHeight: '74.4px',
    color: '#FFFFFF',
    textShadow: '0px 0px 20px rgba(255, 255, 255, 0.3)',
    [theme.breakpoints.down('md')]: {
      fontSize: 36,
      lineHeight: '43.2px'
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 26,
      lineHeight: '31.2px'
    }
  },
  description: {
    fontSize: 22,
    fontWeight: 400,
    lineHeight: '30.8px',
    color: '#FFFFFF',
    marginTop: '16px',
    textAlign: 'center',
    [theme.breakpoints.down('md')]: {
      fontSize: 18,
      lineHeight: '25.2px'
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 16,
      lineHeight: '22.4px'
    }
  },
  topBtnRow: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '32px'
  },
  avatar: {
    marginRight: 18,
    '& img': {
      width: 34,
      height: 34,
      borderRadius: 23
    }
  },
  typo1: {
    fontSize: 28,
    fontWeight: 800,

    lineHeight: '100%',
    letterSpacing: '0.02em',
    textTransform: 'capitalize',
    [theme.breakpoints.down('xs')]: {
      fontSize: 20
    }
  },
  typo2: {
    fontSize: 16,
    fontWeight: 600,
    color: '#6C6E7E',
    [theme.breakpoints.down('xs')]: {
      fontSize: 11
    }
  },
  typo3: {
    fontSize: 17,
    fontWeight: 500,

    color: '#6C6E7E',
    display: '-webkit-box',
    '-webkit-line-clamp': 2,
    '-webkit-box-orient': 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    [theme.breakpoints.down('xs')]: {
      fontSize: 12
    }
  },
  typo4: {
    fontSize: 20,
    fontWeight: 800,

    color: '#fff',
    textTransform: 'capitalize',
    letterSpacing: '0.02em',
    [theme.breakpoints.down('xs')]: {
      fontSize: 16
    }
  },
  typo5: {
    fontSize: 14,
    fontWeight: 700,
    color: '#fff',
    textTransform: 'uppercase',
    cursor: 'pointer',
    [theme.breakpoints.down('xs')]: {
      fontSize: 10
    }
  },
  typo6: {
    fontSize: 14,
    fontWeight: 600,
    color: '#2D3047',
    whiteSpace: 'nowrap'
  },
  typo7: {
    fontSize: 13,
    fontWeight: 500,
    color: '#2D304770'
  },
  typo8: {
    fontSize: 22,
    fontWeight: 500,
    color: '#000'
  },
  typo9: {
    fontSize: 32,
    fontWeight: 800,
    lineHeight: '100%',
    letterSpacing: '0.02em',
    textTransform: 'capitalize'
  },
  typo10: {
    fontSize: 16,
    fontWeight: 700
  },
  typo11: {
    fontSize: 16,
    fontWeight: 500,
    color: '#74D073',
    [theme.breakpoints.down('xs')]: {
      fontSize: 12
    }
  },
  arrowBox: {
    display: 'flex',
    alignItems: 'center',
    background: 'white',
    padding: '11px 24px 6px',
    borderRadius: theme.spacing(4),
    boxShadow: '0px 10px 21px -9px rgba(105, 105, 105, 0.15)'
  },
  sideNo: {
    fontWeight: 600,
    fontSize: 20,
    color: '#FFFFFF',
    position: 'absolute',
    top: 12,
    left: 19,
    [theme.breakpoints.down('md')]: {
      fontSize: 14,
      top: 12,
      left: 19
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 10,
      top: 11,
      left: 11
    }
  },
  sliderContainer: {
    width: '100%',
    '& .rec-slider-container': {
      margin: '0px -8px',
      '& .rec-item-wrapper': {
        padding: '0px 8px !important'
      }
    }
  },
  sliderContainer1: {
    zIndex: 1,
    width: '100%',
    '& *': {
      overflow: 'visible !important'
    },
    overflow: 'hidden',
    '& .rec-slider-container': {
      margin: '0px -8px',
      '& .rec-item-wrapper': {
        padding: '0px 8px !important'
      }
    }
  },
  topPlatformsCarouselWrapper: {
    height: 290,
    marginTop: 60,
    overflow: 'hidden',
    filter: 'drop-shadow(0px 34px 55px rgba(25, 91, 220, 0.25))',
    [theme.breakpoints.down('md')]: {
      minWidth: `calc(100% - ${theme.spacing(4)}px * 2)`,
      margin: `0 ${theme.spacing(4)}px`,
      marginTop: 60
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      margin: `0px 0px`,
      marginTop: 72
    },
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      margin: `0px 0px`,
      marginTop: 72
    },
    '& > div > div': {
      transform: 'scale(0.8)',
      opacity: '1 !important',
      borderRadius: '20px',
      '&:first-child': {
        zIndex: '2 !important',
        transform: 'translateY(-50%) translateX(-50%) scale(0.85) !important',
        left: '10% !important',
        width: '243px !important',
        borderRadius: '11px',
        '@media (max-width: 1050px)': {
          transform: 'translateY(-50%) translateX(-50%) scale(0.9) !important'
        },
        '@media (max-width: 600px)': {
          left: '50% !important'
        }
      },
      '&:nth-child(2)': {
        width: '290px !important',
        borderRadius: '11px',
        left: '50% !important',
        zIndex: '4 !important',
        transform: 'translateY(-50%) translateX(-50%) scale(1) !important',
        '& > div': {
          opacity: 1
        },
        '@media (max-width: 1050px)': {
          transform: 'translateY(-50%) translateX(-50%) scale(1) !important',
          '& > div': {
            opacity: 1
          }
        },
        '@media (max-width: 600px)': {
          opacity: '0 !important',
          left: '125% !important',
          '&:last-child': {
            transform:
              'translateY(-50%) translateX(-50%) scale(0.8) !important',
            '& > div': {
              opacity: 0.8
            }
          }
        }
      },
      '&:nth-child(3)': {
        zIndex: '3 !important',
        transform: 'translateY(-50%) translateX(-50%) scale(0.85) !important',
        left: '90% !important',
        width: '243px !important',
        borderRadius: '11px',
        '@media (max-width: 1050px)': {
          zIndex: '2 !important',
          transform: 'translateY(-50%) translateX(-50%) scale(0.9) !important',
          '& > div': {
            opacity: 0.8
          }
        },
        '@media (max-width: 600px)': {
          opacity: '0 !important'
        }
      },
      '&:nth-child(4)': {
        opacity: '0 !important'
      },
      '&:nth-child(5)': {
        opacity: '0 !important'
      }
    }
  },
  topArtistsCarouselWrapper: {
    height: '230px',
    marginTop: theme.spacing(10),
    overflow: 'hidden',
    [theme.breakpoints.down('md')]: {
      minWidth: `calc(100% - ${theme.spacing(4)}px * 2)`,
      margin: `0 ${theme.spacing(4)}px`,
      marginTop: theme.spacing(10)
    },
    '& > div > div': {
      transform: 'scale(0.8)',
      opacity: '1 !important',
      borderRadius: '20px',
      '&:first-child': {
        transform: 'translateY(-50%) translateX(-50%) scale(0.4) !important',
        zIndex: '1 !important',
        '@media (max-width: 600px)': {
          opacity: '0 !important'
        }
      },
      '&:nth-child(2)': {
        zIndex: '2 !important',
        transform: 'translateY(-50%) translateX(-50%) scale(0.7) !important',
        left: '20% !important',
        width: '228px !important',
        background: 'lightgrey',
        borderRadius: '114px',
        '@media (max-width: 1050px)': {
          transform: 'translateY(-50%) translateX(-50%) scale(0.7) !important'
        },
        '@media (max-width: 600px)': {
          opacity: '0 !important'
        }
      },
      '&:nth-child(3)': {
        background: 'linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)',
        width: '230px !important',
        borderRadius: '114px',
        zIndex: '4 !important',
        transform: 'translateY(-50%) translateX(-50%) scale(1) !important',
        '& > div': {
          opacity: 1
        },
        '@media (max-width: 1050px)': {
          transform: 'translateY(-50%) translateX(-50%) scale(0.9) !important'
        },
        '@media (max-width: 600px)': {
          transform: 'translateY(-50%) translateX(-116%) scale(0.9) !important'
        }
      },
      '&:nth-child(4)': {
        zIndex: '3 !important',
        transform: 'translateY(-50%) translateX(-50%) scale(0.7) !important',
        left: '80% !important',
        width: '228px !important',
        background: 'lightgrey',
        borderRadius: '114px',
        '@media (max-width: 1050px)': {
          transform: 'translateY(-50%) translateX(-50%) scale(0.7) !important'
        },
        '@media (max-width: 600px)': {
          opacity: '0 !important'
        }
      },
      '&:nth-child(5)': {
        zIndex: '3 !important',
        transform: 'translateY(-50%) translateX(-50%) scale(0.4) !important',
        '@media (max-width: 1050px)': {},
        '@media (max-width: 600px)': {
          opacity: '0 !important'
        }
      }
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      margin: `0px 0px`,
      marginTop: 72
    },
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      margin: `0px 0px`,
      marginTop: 72
    }
  },
  arrowBoxContent: {
    display: 'flex',
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      margin: 0
    }
  },
  leftHeaderArtistArrowBox: {
    display: 'flex',
    alignItems: 'center',
    background: 'white',
    padding: '11px 19px 4px',
    borderRadius: theme.spacing(4),
    boxShadow: '0px 7.50401px 15.7584px -6.75361px rgba(105, 105, 105, 0.15)',
    border: '1px solid rgba(84, 101, 143, 0.3)',
    zIndex: 5
  },
  noHistory: {
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '17px',
    lineHeight: '140%',
    color: '#FFFFFF',
    opacity: '0.9'
  }
}));
