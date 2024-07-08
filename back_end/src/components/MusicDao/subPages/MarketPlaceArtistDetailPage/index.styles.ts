import { makeStyles } from '@material-ui/core/styles';

export const usePageStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '100vh',
    overflow: 'auto',
    background: 'effef6'
  },
  headerContainer: {
    background: `url(${require('assets/musicDAOImages/marketplace_artist_detail_header_bg.webp')})`,
    width: '100%',
    backgroundSize: '100% 100%'
  },
  mainContainer: {
    width: '100%'
  },
  subContainer: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'visible',
    position: 'relative',
    maxWidth: 1600,
    marginLeft: 'auto',
    marginRight: 'auto',
    color: '#2D3047',
    padding: `36px 80px 30px`,
    [theme.breakpoints.down('md')]: {
      padding: `36px 64px 30px`
    },
    [theme.breakpoints.down('xs')]: {
      padding: '30px 20px 30px'
    }
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    overflowX: 'hidden',
    position: 'relative',
    maxWidth: 1600,
    marginLeft: 'auto',
    marginRight: 'auto',
    color: '#2D3047',
    padding: `60px 80px 150px`,
    [theme.breakpoints.down('md')]: {
      padding: `60px 64px 150px`
    },
    [theme.breakpoints.down('xs')]: {
      padding: '60px 20px'
    },
    '& .infinite-scroll-component': {
      overflow: 'visible !important'
    }
  },
  image: {
    backgroundRepeat: 'no-repeat !important',
    backgroundSize: 'cover !important',
    backgroundPosition: 'center !important'
  },
  songs: {
    height: 59,
    border: '1px solid rgba(84, 101, 143, 0.3)',
    boxSizing: 'border-box',
    borderRadius: 12,
    display: 'flex',
    gridGap: 12,
    alignItems: 'center',
    padding: 12,
    justifyContent: 'space-evenly'
  },
  checkOpenSea: {
    height: 59,
    background: 'rgba(33, 130, 226, 0.11)',
    borderRadius: 12,
    display: 'flex',
    gridGap: 12,
    alignItems: 'center',
    padding: 12,
    justifyContent: 'space-evenly',
    cursor: 'pointer'
  },
  typo1: {
    fontStyle: 'normal',
    textShadow: '0px 0px 20px rgba(255, 255, 255, 0.3)',
    fontWeight: 800,
    fontSize: 14,
    color: '#54658F'
  },
  typo2: {
    fontStyle: 'normal',
    textShadow: '0px 0px 20px rgba(255, 255, 255, 0.3)',
    fontWeight: 800,
    fontSize: 44,
    color: '#081831',
    marginTop: 10,
    [theme.breakpoints.down('md')]: {
      fontSize: 33
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 22
    }
  },
  typo3: {
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: 14,
    textDecorationLine: 'underline',
    color: '#2D3047',
    [theme.breakpoints.down('md')]: {
      fontSize: 12
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 8
    }
  },
  typo4: {
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: 24,
    color: '#2D3047',
    [theme.breakpoints.down('md')]: {
      fontSize: 20
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 16
    }
  },
  typo5: {
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: 14,
    color: '#2D3047',
    [theme.breakpoints.down('md')]: {
      fontSize: 12
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 10
    }
  },
  typo6: {
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: 12,
    color: '#2081E2',
    [theme.breakpoints.down('md')]: {
      fontSize: 11
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 9
    }
  },
  typo7: {
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: 22,
    color: '#fff',
    [theme.breakpoints.down('md')]: {
      fontSize: 20
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 18
    }
  },
  socialButtonBox: {
    display: 'flex',
    // position: 'absolute',
    // top: 0,
    // right: 0
  },
  socialButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    marginRight: '2px',
    '& img': {
      cursor: 'pointer',
      width: '28px',
      height: '28px'
    }
  },
  typo8: {},
  typo9: {},
  typo10: {},
  typo11: {},
  typo12: {}
}));
