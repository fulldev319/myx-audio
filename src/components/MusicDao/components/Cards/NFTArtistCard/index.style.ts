import { makeStyles } from '@material-ui/core/styles';

export const nftArtistCardStyles = makeStyles((theme) => ({
  container: {
    fontStyle: 'normal',
    color: '#74D073',
    position: 'relative',
    width: '100%',
    padding: '70px 0px',
    cursor: 'pointer',
    '&:hover': {
      transform: 'scale(1.02)'
    }
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
  mainContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  image: {
    height: 150,
    width: 150,
    margin: 'auto',
    borderRadius: 80,
    position: 'relative',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    zIndex: 1,
    overflow: 'hidden',
    [theme.breakpoints.down('md')]: {
      height: 100,
      width: 100
    },
    [theme.breakpoints.down('xs')]: {
      height: 68,
      width: 69
    }
  },
  name: {
    fontWeight: 500,
    marginTop: 30,
    fontSize: 28,
    zIndex: 1,
    color: '#000',
    whiteSpace: 'nowrap',
    overflow: 'hidden !important',
    textOverflow: 'ellipsis',
    [theme.breakpoints.down('md')]: {
      marginTop: 24,
      fontSize: 28
    },
    [theme.breakpoints.down('xs')]: {
      marginTop: 10,
      fontSize: 20
    }
  },
  address: {
    display: 'flex',
    alignItems: 'center',
    fontWeight: 500,
    marginTop: 20,
    fontSize: 18,
    zIndex: 1,
    [theme.breakpoints.down('md')]: {
      marginTop: 24,
      fontSize: 18
    },
    [theme.breakpoints.down('xs')]: {
      marginTop: 10,
      fontSize: 14
    }
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: '#E6E6E6',
    marginTop: 42,
    zIndex: 1,
    [theme.breakpoints.down('md')]: {
      marginTop: 43
    },
    [theme.breakpoints.down('xs')]: {
      marginTop: 47
    }
  },
  infoContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    padding: '24px 33px 36px',
    zIndex: 1,
    [theme.breakpoints.down('md')]: {
      padding: '24px 46px 36px'
    },
    [theme.breakpoints.down('xs')]: {
      padding: '20px 15px 39px'
    }
  },
  infoSub: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gridGap: 8
  },
  infoLable: {
    fontWeight: 400,
    fontSize: 9,
    color: '#000000',
    [theme.breakpoints.down('md')]: {
      fontSize: 9
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 8
    }
  },
  infoValue: {
    fontWeight: 500,
    fontSize: 20,
    [theme.breakpoints.down('md')]: {
      fontSize: 20
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 15
    }
  }
}));
