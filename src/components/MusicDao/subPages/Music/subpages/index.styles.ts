import { makeStyles } from '@material-ui/core/styles';
import { Color } from 'shared/ui-kit';

export const musicSubPageStyles = makeStyles((theme) => ({
  page: {
    width: '100%',
    height: '100%',
    display: 'flex',
    overflowY: 'auto',
    flexDirection: 'column',
    alignItems: 'flex-start',
    position: 'relative',
    overflowX: 'hidden'
  },
  pageHeader: {
    width: '100%',
    height: '100%',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    overflowX: 'hidden',
    position: 'relative',
    background: '#F6F7FB'
  },
  content: {
    width: '100%',
    padding: '24px 40px',
    display: 'flex',
    flexDirection: 'column',
    height: 'fit-content'
  },
  loaderDiv: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '20px'
  },
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    '& h4': {
      fontStyle: 'normal',
      fontWeight: 800,
      fontSize: 30,
      lineHeight: '104.5%',
      color: '#181818',
      margin: 0
    },
    '& h5': {
      margin: '16px 0px 24px',
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: 18,
      lineHeight: '104.5%',
      color: '#181818'
    }
  },
  table: {
    width: '100%'
  },
  title: {
    display: 'flex',
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: 18,
    lineHeight: '104.5%',
    color: '#000000',
    marginBottom: 16,
    width: '100%',
    justifyContent: 'space-between',
    '& span': {
      fontStyle: 'normal',
      fontWeight: 800,
      fontSize: 11,
      color: '#707582',
      cursor: 'pointer'
    }
  },
  cards: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 'calc(100% + 20px)',
    marginLeft: -10,
    marginTop: -10,
    marginBottom: 38,
    flexWrap: 'wrap',
    overflow: 'hidden',
    padding: '10px 5px',
    minHeight: 280,
    '& > div': {
      width: '100%'
    }
  },
  cardsHide: {
    maxHeight: 280,
    overflow: 'hidden'
  },
  genreCards: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 'calc(100% + 20px)',
    marginLeft: -10,
    marginTop: -10,
    marginBottom: 38,
    flexWrap: 'wrap',
    overflow: 'hidden',
    padding: '10px 5px',
    minHeight: 142,
    '& > div': {
      width: '100%'
    }
  },
  genreCardsHide: {
    maxHeight: 175,
    overflow: 'hidden'
  },
  exploreCards: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 'calc(100% + 20px)',
    marginLeft: -10,
    marginTop: -10,
    marginBottom: 38,
    flexWrap: 'wrap',
    overflow: 'hidden',
    padding: '10px 5px',
    minHeight: 185,
    '& > div': {
      width: '100%'
    }
  },
  exploreCardsHide: {
    maxHeight: 185,
    overflow: 'hidden'
  },
  artistInfo: {
    height: 567,
    width: 'calc(100% + 24px * 2)',
    marginLeft: -24,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    '& h4': {
      fontStyle: 'normal',
      fontWeight: 800,
      fontSize: 22,
      lineHeight: '104.5%',
      color: '#ffffff',
      margin: '0px 0px 16px'
    },
    '& p': {
      fontStyle: 'normal',
      fontWeight: 800,
      fontSize: 18,
      lineHeight: '27px',
      color: '#ffffff',
      margin: 0
    }
  },
  filter: {
    width: '100%',
    height: '100%',
    padding: '0px 40px 40px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    '& p': {
      width: '50%'
    }
  },
  musicPlatform: {
    width: 132,
    cursor: 'pointer',
    marginBottom: 40
  },
  tab: {
    marginRight: 24,
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 18,
    lineHeight: '104.5%',
    color: '#707582',
    opacity: 0.5,
    cursor: 'pointer'
  },
  selectedTab: {
    color: '#181818',
    opacity: 1
  },
  paper: {
    minWidth: 163,
    marginLeft: -15,
    borderRadius: 0,
    margintop: 5,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.12)'
  },
  searcher: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxSizing: 'border-box',
    marginBottom: 45,
    width: '50%',
    [theme.breakpoints.down(376)]: {
      width: '100%'
    },
    '& input': {
      borderRadius: 6,
      border: '1px solid #181818'
    }
  },
  pointer: {
    cursor: 'pointer'
  },
  moreButton: {
    fontSize: '12px !important',
    lineHeight: '12px !important'
  },
  sectionTitle: {
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 40,
    lineHeight: '48px',
    color: '#FFFFFF',
    textShadow: '0px 0px 20px rgb(255 255 255 / 80%)'
  },
  showAll: {
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: 14,
    lineHeight: '104.5%',
    textTransform: 'uppercase',
    color: '#2D3047',
    cursor: 'pointer'
  },
  searchBox: {
    background: 'rgba(240, 245, 248, 0.7)',
    display: 'flex',
    alignItems: 'center',
    padding: `${theme.spacing(1)}px`,
    cursor: 'pointer',
    borderRadius: '100vh',
    border: '1px solid #ccc',
    color: Color.MusicDAODark,
    maxWidth: 300,
    [theme.breakpoints.down('xs')]: {
      padding: '8px'
    }
  },
  carouselContainer: {
    width: '100%',
    height: '100%',
    // maxWidth: "100vw",
    overflow: 'hidden',
    // marginLeft: `-${theme.spacing(21)}px`,

    // [theme.breakpoints.down("md")]: {
    //   marginLeft: `-${theme.spacing(4)}px`,
    // },

    '& .rec-slider-container': {
      margin: '0 0'
    },

    '& .rec-item-wrapper': {
      height: 380,
      display: 'flex',
      alignItems: 'center',
      padding: '0 6px 0 24px !important'
    }
  },
  carouselBox: {
    minWidth: `calc(100% - ${theme.spacing(21)}px * 2)`,
    width: `calc(100% - ${theme.spacing(21)}px * 2)`,
    height: 579,
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
        transform: 'translateY(-50%) translateX(-19%) scale(0.8) !important',
        zIndex: '1 !important',
        '@media (max-width: 750px)': {
          transform: 'translateY(-50%) translateX(-50%) scale(0.9) !important'
        }
      },

      '&:nth-child(2)': {
        zIndex: '2 !important',
        transform: 'translateY(-50%) translateX(-36%) scale(0.87) !important',
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
        transform: 'translateY(-50%) translateX(-64%) scale(0.87) !important',
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
        transform: 'translateY(-50%) translateX(-81%) scale(0.93) !important',
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
        transform: 'translateY(-50%) translateX(-81%) scale(0.8) !important',
        '@media (max-width: 750px)': {
          transform: 'translateY(-50%) translateX(-50%) scale(0.9) !important'
        }
      }

      // '& > div': {
      //   width: '100% !important',
      //   opacity: 0.8,
      //   minWidth: '380px !important',
      //   '@media (max-width: 900px)': {
      //     minWidth: '380px !important'
      //   },

      //   '& > div': {
      //     width: '100%'
      //   }
      // }
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
  }
}));
