import React from 'react';
import styled from 'styled-components';

import { makeStyles } from '@material-ui/core/styles';
import { Gradient } from 'shared/ui-kit';
import { Color } from 'shared/constants/const';

export const profilePageStyles = makeStyles((theme) => ({
  mainContent: {
    width: '100%',
    height: '100vh',
    overflow: 'auto'
  },
  content: {
    maxWidth: 1600,
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: `96px ${theme.spacing(10)}px ${theme.spacing(5)}px`,
    [theme.breakpoints.down('md')]: {
      padding: `60px ${theme.spacing(2)}px ${theme.spacing(10)}px`
    }
  },
  navigation: {
    marginBottom: 28,
    fontSize: 14,
    display: 'flex'
  },
  tabCard: {
    marginRight: 80,
    color: '#707582',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 8,
    cursor: 'pointer',
    [theme.breakpoints.down('sm')]: {
      marginRight: 10
    },
    [theme.breakpoints.down('xs')]: {
      marginRight: 0
    }
  },
  tabCardSelected: {
    background: '#eff2f8',
    borderRadius: 8
  },
  subTab: {
    marginRight: 11,
    borderRadius: 26,
    padding: '11px 0px',
    display: 'flex',
    justifyContent: 'center',
    width: 110,
    fontWeight: 800,
    fontSize: 14,
    lineHeight: '18px',
    backdropFilter: 'blur(10px)',
    cursor: 'pointer',
    background: 'transparent',
    border: '1.5px solid #181818',
    color: '#181818',
    '&:last-child': {
      marginRight: 0
    }
  },
  subTabSelected: {
    marginRight: 11,
    borderRadius: 26,
    padding: '11px 0px',
    display: 'flex',
    justifyContent: 'center',
    width: 110,
    fontWeight: 800,
    fontSize: 14,
    lineHeight: '18px',
    backdropFilter: 'blur(10px)',
    cursor: 'pointer',
    color: '#ffffff',
    background: '#9EACF2',
    borderColor: '#9EACF2'
  },
  header: {
    height: 285,
    borderRadius: '16px 16px 0px 0px',
    background:
      'conic-gradient( from 111.31deg at 50% 51.67%, #b1ff00 -118.12deg, #00ff15 110.62deg, #b1ff00 241.88deg, #00ff15 470.63deg)',
    cursor: 'pointer'
  },
  avatar: {
    border: '4px solid #ffffff',
    marginLeft: 120,
    marginTop: -80,
    width: 160,
    height: 160,
    borderRadius: '50%',
    [theme.breakpoints.down('sm')]: {
      marginLeft: 90
    },
    [theme.breakpoints.down('xs')]: {
      width: 90,
      height: 90,
      marginLeft: 25,
      marginTop: -45
    }
  },
  statLine: {
    display: 'flex',
    alignItems: 'center',
    color: '#181818',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    columnGap: 30,
    [theme.breakpoints.down('md')]: {
      justifyContent: 'space-between'
    }
  },
  infoPaneMain: {
    padding: '0 180px 0 135px',
    marginTop: 40,
    marginBottom: 50,
    [theme.breakpoints.down('sm')]: {
      padding: '0 90px'
    },
    [theme.breakpoints.down('xs')]: {
      padding: '0 15px'
    }
  },
  indexBadge: {
    '& .hex': {
      marginRight: 0
    },
    width: 40,
    '&:not(:last-child)': {
      marginRight: -25
    }
  },
  badgeMore: {
    cursor: 'pointer',
    marginLeft: 10,
    zIndex: 2,
    background: Gradient.Green,
    color: 'white',
    borderRadius: 10,
    padding: '4px 8px'
  },
  chartContainer: {
    '& > div': {
      overflow: 'hidden',
      borderRadius: 8
    },
    '& h3': {
      marginTop: 0,
      fontWeight: 800,
      fontSize: 22,
      marginBottom: 30
    }
  },
  chartWrapper: {
    position: 'relative',
    height: 290,
    backgroundColor: 'rgba(158, 172, 242, 0.1)',
    opacity: 0.8,
    borderRadius: 8,
    '& canvas': {
      borderRadius: 8
    }
  },
  tradeInfoBox: {
    justifyContent: 'center',
    '& h2': {
      fontWeight: 800,
      fontSize: 22,
      color: Color.MusicDAOLightBlue,
      marginBottom: 10
    },
    '& span': {
      fontSize: 14,
      fontWeight: 500,
      color: Color.MusicDAOLightBlue
    }
  },
  chartInfo: {
    background: 'transparent',
    padding: '15px 20px',
    position: 'absolute',
    left: 28,
    top: 37,
    backgroundColor: '#ffffff'
  },
  tableSection: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 50,
    borderBottom: '1px solid #00000022',
    width: '100%',
    overflow: 'scroll',
    '&::-webkit-scrollbar': {
      width: 0,
      height: 0
    }
  },
  tabItem: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 800,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    textTransform: 'uppercase',
    '& + &': {
      marginLeft: theme.spacing(13)
    },
    [theme.breakpoints.down('sm')]: {
      '& + &': {
        marginLeft: theme.spacing(5)
      },
      fontSize: 18
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 14,
      '& + &': {
        marginLeft: theme.spacing(2)
      }
    }
  },
  tabItemActive: {
    color: '#65CB63',
    borderBottom: '2px solid #65CB63'
  },
  editProfile: {
    background: '#DDFF57 !important',
    borderRadius: '8px !important',
    width: '130px !important',
    color: '#431AB7 !important'
  },
  followButton: {
    background: '#65CB63',
    borderRadius: 8,
    padding: '8px 26px',
    color: '#FFFFFF',
    textTransform: 'none',
    lineHeight: '100%',
    '&:hover': {
      background: '#65CB63'
    },
    [theme.breakpoints.down('xs')]: {
      padding: '8px 10px',
      lineHeight: '110%'
    }
  },
  headerTitle: {
    fontSize: 58,
    lineHeight: '75px',
    color: '#FFFFFF',
    '& > b': {
      fontWeight: 800
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 45
    }
  },
  manageButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 26px !important',
    borderRadius: '50px !important',
    background: '#2D3047 !important',
    [theme.breakpoints.down('xs')]: {
      padding: '0 16px !important',
      width: '100%'
    }
  },
  shareButton: {
    padding: '0 26px !important',
    borderRadius: '50px !important',
    border: '1.5px solid #2D3047 !important',
    background: 'transparent !important',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('xs')]: {
      padding: '0 16px !important',
      width: '100%'
    },
    '& svg': {
      marginRight: 8
    }
  },
  headerSubTitle: {
    color: '#FFFFFF',
    fontSize: '22px',
    fontWeight: 800,
    [theme.breakpoints.down('sm')]: {
      fontSize: '18px'
    }
  },
  paper: {
    top: 20,
    borderRadius: 10,
    boxShadow: '0px 2px 20px rgba(0, 0, 0, 0.1)',
    position: 'inherit'
  },
  topNFTWrapper: {
    // backgroundColor: "#F6F5F8",
    // padding: "50px 0",
    // [theme.breakpoints.down(1200)]: {
    //   padding: "30px 0",
    // },
  },
  fitContent: {
    maxWidth: 1600,
    marginLeft: 'auto',
    marginRight: 'auto',
    [theme.breakpoints.down('sm')]: {
      //   paddingLeft: "16px !important",
      // paddingRight: "16px !important",
    }
  },
  carouselNav: {
    cursor: 'pointer',
    border: '1px solid #431AB7',
    borderRadius: '100%',
    width: 42,
    height: 42,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover': {
      border: 'none',
      background: '#431AB7',
      '& svg': {
        stroke: '#DDFF57'
      }
    }
  },
  topNFTContent: {
    display: 'flex',
    background: 'transparent',
    marginTop: 30,
    marginBottom: 50,
    position: 'relative',
    // marginLeft: -24,
    // marginRight: -24,
    [theme.breakpoints.down(769)]: {
      marginTop: 16
      // marginLeft: -16,
      // marginRight: -24,
    },
    '& button.rec-arrow-left': {
      position: 'absolute',
      top: -100,
      right: 200,

      [theme.breakpoints.down(1200)]: {
        right: 60
      },
      [theme.breakpoints.down(769)]: {
        // display: "none",
      }
    },
    '& button.rec-arrow-right': {
      position: 'absolute',
      top: -100,
      right: 140,

      [theme.breakpoints.down(1200)]: {
        right: 0
      },
      [theme.breakpoints.down(769)]: {
        display: 'none'
      }
    },
    '& .rec-slider-container': {
      margin: '0 0',
      '& .rec-carousel-item': {
        '& > .rec-item-wrapper': {
          // minWidth: 330,
          // maxWidth: 370,
          // width: "unset",
          overflow: 'unset',
          '& > div': {
            boxShadow: 'none'
          }
        }
      }
    }
  },
  allNFTSection: {
    width: '100%',
    marginBottom: 40
  },
  arrowBox: {
    display: 'flex',
    alignItems: 'center',
    background: 'white',
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    borderRadius: theme.spacing(4),
    boxShadow: '0px 10px 21px -9px rgba(105, 105, 105, 0.15)'
  },
  showAll: {
    width: '170px !important',
    border: `1px solid ${Color.MusicDAODark} !important`,
    backgroundColor: 'transparent !important',
    fontSize: '14px !important',
    color: `${Color.MusicDAODark} !important`,
    position: 'relative',
    [theme.breakpoints.down('xs')]: {
      width: '120px !important',
      fontSize: '11px !important'
    }
  },
  createSong: {
    width: '170px !important',
    backgroundColor: '#65CB63 !important',
    fontSize: '16px !important',
    color: '#fff !important',
    position: 'relative',
    [theme.breakpoints.down('xs')]: {
      width: '140px !important',
      fontSize: '14px !important'
    },
    lineHeight: 'unset !important'
  },
  verify: {
    fontWeight: 700,
    fontSize: '12px',
    color: '#65CB63'
  },
  socialIcons: {
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    marginTop: 10,
    marginLeft: 2,
    '& img': {
      width: 45,
      height: 45
    }
  },
  filterTag: {
    background: 'rgba(255, 255, 255)',
    borderRadius: '20px',
    color: '#2D3047',

    fontWeight: 600,
    fontSize: 12,
    lineHeight: '18px',
    padding: '8px 14px',
    cursor: 'pointer',
    '& + &': {
      marginLeft: 16,
      [theme.breakpoints.down('xs')]: {
        marginLeft: 0,
        marginTop: 16
      }
    }
  },
  filter: {
    display: 'flex',
    justifyContent: 'flex-end',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      justifyContent: 'flex-start'
    }
  },
  userName: {
    fontSize: 22,
    fontWeight: 800,
    color: '#2D3047',
    wordBreak: 'break-all',
    whiteSpace: 'normal',
    marginRight: 24,
    '-webkit-line-clamp': 1,
    '-webkit-box-orient': 'vertical',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    display: '-webkit-box'
  },
  socialButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '45px',
    height: '45px',
    borderRadius: '50%'
  }
}));

export type CardProps = React.PropsWithChildren<{
  noPadding?: boolean;
}>;

export const Card = styled.div<CardProps>`
  display: flex;
  flex-direction: column;
  color: #707582;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.12);
  border-radius: 16px;
  padding: ${(p) => (p.noPadding ? '0px' : '24px 28px')};
  background: white;
`;
