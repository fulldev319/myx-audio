import { makeStyles } from '@material-ui/core/styles';
import { Color } from 'shared/ui-kit';

export const potionSongDetailPageStyle = makeStyles((theme) => ({
  container: {
    position: 'relative',
    background: 'linear-gradient(0deg, #EEF2F7, #EEF2F7), #F0F5F8',
    color: Color.MusicDAODark
  },
  backgroundBox: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '1050px',
    background:
      'linear-gradient(180deg, rgba(243, 254, 247, 0) 49.94%, #EEF2F6 96.61%), linear-gradient(97.63deg, #99CE00 26.36%, #0DCC9E 80%)'
  },
  body: {
    width: '100%',
    position: 'relative',
    margin: 'auto',
    marginTop: 100,
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: 40,
    zIndex: 2
  },
  cardBox: {
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: 'translate(-50%, 0)'
  },
  podCard: {
    background:
      'linear-gradient(172.76deg, #FFFFFF 51.5%, rgba(255, 255, 255, 0) 123.53%)',
    borderRadius: theme.spacing(2),
    clipPath: 'polygon(100% 0%, 100% 80%,  50% 100%, 0% 80%, 0% 0%)',
    padding: theme.spacing(2),
    position: 'relative'
  },
  innerBox: {
    background: 'linear-gradient(172.84deg, #FBFCFD 52.03%, #FAFBFC 123.27%)',
    borderRadius: theme.spacing(2),
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    clipPath: 'polygon(100% 0%, 100% 80%,  50% 100%, 0% 80%, 0% 0%)',
    boxShadow: '-4px 4px 4px rgba(0, 0, 0, 0.3)'
  },
  shadowBox: {
    background: 'rgba(0, 0, 0, 0.03)',
    borderRadius: theme.spacing(2),
    position: 'absolute',
    clipPath: 'polygon(100% 0%, 100% 80%,  50% 100%, 0% 80%, 0% 0%)',
    paddingBottom: theme.spacing(10),
    left: '15px',
    top: '15px',
    right: '15px',
    bottom: '15px',
    zIndex: -1
  },
  podImageContent: {
    height: '145px',
    borderRadius: theme.spacing(2),
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0
  },
  podImage: {
    width: '100%',
    height: '100%',
    borderRadius: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  bopAvatarBox: {
    position: 'absolute',
    top: theme.spacing(1),
    left: theme.spacing(2),
    display: 'flex',
    alignItems: 'center'
  },
  bopAvatar: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    borderRadius: '100%',
    border: '2px solid #ffffff',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.12)',
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  bopAvatar1: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    borderRadius: '100%',
    border: '2px solid #ffffff',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.12)',
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  podCardContent: {
    marginTop: '160px'
  },
  contentBox: {
    paddingLeft: 250,
    paddingRight: 250,
    [theme.breakpoints.down(1360)]: {
      paddingLeft: 180,
      paddingRight: 180,
      marginTop: 150
    },
    [theme.breakpoints.down('md')]: {
      paddingLeft: 125,
      paddingRight: 125,
      marginTop: 150
    },
    [theme.breakpoints.down(1090)]: {
      paddingLeft: 60,
      paddingRight: 60,
      marginTop: 150
    },
    [theme.breakpoints.down('sm')]: {
      paddingLeft: 28,
      paddingRight: 28,
      marginTop: 150
    },
    [theme.breakpoints.down('xs')]: {
      paddingLeft: 16,
      paddingRight: 16,
      marginTop: 150
    }
  },
  whiteBox: {
    background: 'rgba(255, 255, 255, 0.5)',
    borderRadius: theme.spacing(4)
  },
  songInfoHeader: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    background: 'linear-gradient(180deg, #ACF92F 0%, rgba(0, 198, 8, 0) 100%)',
    borderRadius: 24,
    padding: '80px 32px 120px',
    [theme.breakpoints.down(910)]: {
      padding: '210px 32px 60px'
    }
  },
  descriptionBox: {
    width: `calc(50% - ${theme.spacing(15)}px)`,
    [theme.breakpoints.down(910)]: {
      width: `calc(50% - ${theme.spacing(5)}px)`
    }
  },
  tagBox: {
    background: 'white',
    borderRadius: theme.spacing(0.5),
    padding: `${theme.spacing(0.5)}px ${theme.spacing(1)}px `
  },
  customButtonBox: {
    cursor: 'pointer',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(1),
    '& svg:first-child': {
      position: 'absolute',
      right: 0,
      top: 0,
      left: 0,
      transform: 'translate(0, 0)',
      height: '100%',
      zIndex: 0
    },
    '& svg': {
      position: 'absolute',
      right: theme.spacing(2),
      top: '50%',
      transform: 'translate(0, -50%)',
      zIndex: 1
    }
  },
  tabBarBox: {
    borderRadius: theme.spacing(2),
    border: '1px solid #DAE6E5',
    background: 'white',
    padding: theme.spacing(0.5),
    display: 'flex',
    justifyContent: 'center'
  },
  tabBarItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.8,
    padding: `${theme.spacing(1)}px ${theme.spacing(5)}px`,
    cursor: 'pointer',
    borderRadius: theme.spacing(2),
    minWidth: theme.spacing(35),
    fontSize: 15,
    fontWeight: 700,
    [theme.breakpoints.down(910)]: {
      minWidth: 200
    },
    [theme.breakpoints.down(560)]: {
      minWidth: 100
    }
  },
  tabBarItemActive: {
    opacity: 1,
    background: 'linear-gradient(0deg, #E4F8E8, #E4F8E8), #F0F5F8'
  },
  tabBarItemActive2: {
    opacity: 1,
    background: 'linear-gradient(0deg, #FBE8D7, #FBE8D7), #F0F5F8'
  },
  stakingBox: {
    background:
      'linear-gradient(180.03deg, rgba(229, 237, 242, 0.3) 18.11%, rgba(255, 255, 255, 0) 99.97%)',
    borderRadius: theme.spacing(3),
    padding: theme.spacing(2)
  },
  stackListItemBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${theme.spacing(2)}px ${theme.spacing(1.5)}px`,
    borderRadius: theme.spacing(4)
  },
  graphBox: {
    overflow: 'hidden',
    boxShadow: '0px 25px 36px -11px rgba(0, 0, 0, 0.02)',
    borderRadius: 20,
    padding: `${theme.spacing(3.5)}px ${theme.spacing(5)}px`,
    background: 'linear-gradient(0deg, #F2FBF6, #F2FBF6), #17172D',
    marginTop: 16,
    marginLeft: 80,
    marginRight: 80,
    [theme.breakpoints.down(800)]: {
      marginLeft: 16,
      marginRight: 16
    }
  },
  controlParentBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      alignItems: 'flex-start'
    },
    width: '100%'
  },
  liquidityBox: {
    display: 'flex',
    alignItems: 'center',
    background: 'white',
    borderRadius: theme.spacing(5),
    marginLeft: theme.spacing(1),
    [theme.breakpoints.down('xs')]: {
      marginTop: theme.spacing(1)
    },
    '& button': {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }
  },
  controlBox: {
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      alignItems: 'flex-end'
    }
  },
  header: {
    fontSize: 58,
    fontWeight: 400,
    marginBlock: 0,
    marginBottom: 26,
    color: Color.White,
    lineHeight: '60px',
    '& span': {
      fontWeight: 800
    },
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    columnGap: 10,
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column'
    }
  },
  header1: {
    fontSize: 26,
    fontWeight: 800,
    [theme.breakpoints.down(500)]: {
      fontSize: 17
    }
  },
  header2: {
    fontSize: 18,
    fontWeight: 800,
    [theme.breakpoints.down(440)]: {
      fontSize: 14
    }
  },
  header3: {
    fontSize: 18,
    fontWeight: 400
  },
  header4: {
    fontSize: 12,
    fontWeight: 700
  },
  tableHeader1: {
    fontSize: 16,
    fontWeight: 600
  },
  tableHeader2: {
    fontSize: 14,
    fontWeight: 600
  },
  tableHeader3: {
    fontSize: 14,
    fontWeight: 700
  },
  headerTitle: {
    fontSize: 27,
    color: Color.MusicDAODark,
    textAlign: 'center',
    fontWeight: 800,
    [theme.breakpoints.down('xs')]: {
      fontSize: 14
    }
  },
  buttons: {
    flexDirection: 'row',
    columnGap: 24,
    rowGap: 10,
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column'
    },
    '& button': {
      borderRadius: 48,
      width: 200,
      color: Color.MusicDAODark,
      backgroundColor: Color.White,
      border: 'none',
      fontSize: 18,
      height: 52
    },
    '& button:last-child': {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      color: Color.White,
      backgroundColor: Color.MusicDAODark,
      marginLeft: 0,
      '& svg': {
        marginLeft: 16
      }
    }
  },
  searchInput: {
    padding: '13px 19px 10px',
    fontSize: '14px',
    background: 'transparent',
    width: '100%',
    border: `1px solid ${Color.MusicDAOGreen}`,
    color: Color.MusicDAOLightBlue,
    boxSizing: 'border-box',
    borderRadius: 48,
    '&:focus-visible': {
      outline: 'none'
    }
  },
  filterContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 60,
    marginBottom: 30,
    [theme.breakpoints.down('xs')]: {
      marginTop: 20,
      marginBottom: 20,
      flexDirection: 'column',
      rowGap: 35,
      alignItems: 'flex-end'
    }
  },
  optionSection: {
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      justifyContent: 'flex-end'
    }
  },
  selectedButtonBox: {
    background: Color.MusicDAODark,
    display: 'flex',
    alignItems: 'center',
    padding: `${theme.spacing(1)}px ${theme.spacing(1.5)}px`,
    borderRadius: theme.spacing(4),
    cursor: 'pointer',
    color: 'white'
  },
  buttonBox: {
    background: 'rgba(240, 245, 248, 0.7)',
    display: 'flex',
    alignItems: 'center',
    padding: `${theme.spacing(1)}px ${theme.spacing(1.5)}px`,
    borderRadius: theme.spacing(4),
    cursor: 'pointer',
    [theme.breakpoints.down('xs')]: {
      padding: '8px 14px'
    },
    color: Color.MusicDAODark
  },

  searchInputBox: {
    position: 'relative',
    width: 400,
    [theme.breakpoints.down('xs')]: {
      width: '100%'
    }
  },
  select: {
    '& .MuiSelect-root': {
      paddingRight: 12
    },
    '& svg path': {
      stroke: '#2D3047'
    }
  },
  rankBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: theme.spacing(4),
    height: theme.spacing(4),
    borderRadius: theme.spacing(4),
    transform: 'translate(0, -50%)'
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    '& > *': {
      marginTop: theme.spacing(2)
    },
    '& > nav > ul > li > button': {
      color: '#2D3047',
      fontSize: 14,
      fontWeight: 600,
      '&.MuiPaginationItem-page.Mui-selected': {
        opacity: 0.38
      }
    },
    '& > nav > ul > li > div': {
      color: '#2D3047 !important',
      fontSize: 14,
      fontWeight: 600
    }
  },
  imgBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.spacing(1),
    position: 'relative'
  },
  img: {
    width: theme.spacing(8),
    height: theme.spacing(8),
    borderRadius: theme.spacing(2),
    objectFit: 'cover'
  },
  avatarBox: {
    position: 'absolute',
    right: -theme.spacing(2),
    bottom: -theme.spacing(2)
  },
  carouselBox: {
    maxWidth: '850px',
    width: `calc(100% - ${theme.spacing(18)}px)`,
    height: '350px',
    overflow: 'hidden'
  },
  arrowBox: {
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '100%',
    width: theme.spacing(6),
    height: theme.spacing(6),
    background: 'linear-gradient(0deg, #EEF2F7, #EEF2F7), #F0F5F8'
  }
}));
