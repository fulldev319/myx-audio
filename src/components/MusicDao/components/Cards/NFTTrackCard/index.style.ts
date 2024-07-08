import { makeStyles } from '@material-ui/core/styles';

export const nftTrackCardStyles = makeStyles((theme) => ({
  container: {
    fontStyle: 'normal',
    color: '#2D3047',
    borderRadius: 20,
    background: 'white',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
    border: '1px solid rgba(84, 101, 143, 0.3)',
    '&:hover': {
      boxShadow:
        '0px 16px 24px rgba(19, 45, 38, 0.25), 0px 31px 44px -13px rgba(0, 0, 0, 0.02)',
      transform: 'scale(1.02)'
    }
  },
  imageContainer: {
    width: '100%',
    padding: 8,
    position: 'relative'
  },
  image: {
    height: 192,
    width: '100%',
    borderRadius: 14,
    position: 'relative',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    overflow: 'hidden',
    [theme.breakpoints.down('md')]: {
      height: 222,
      borderRadius: 20
    },
    [theme.breakpoints.down('xs')]: {
      height: 109,
      borderRadius: 20
    }
  },
  tag: {
    position: 'absolute',
    top: 8,
    right: 8,
    background: 'rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(25.91px)',
    borderRadius: 7,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 24,
    padding: '0px 8px',
    fontWeight: 600,
    fontSize: 14,
    textTransform: 'uppercase',
    color: '#FFFFFF',
    [theme.breakpoints.down('md')]: {
      top: 10,
      right: 10,
      height: 24,
      fontSize: 14
    },
    [theme.breakpoints.down('xs')]: {
      top: 12,
      right: 12,
      height: 18,
      fontSize: 8
    }
  },
  avatarContainer: {
    padding: '11px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  avatar: {
    height: 32,
    width: 32
  },
  priceContainer: {
    display: 'flex',
    alignItems: 'center',
    gridGap: 7,
    fontSize: 14
  },
  priceLable: {
    fontWeight: 500
  },
  priceValue: {
    fontWeight: 700
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: 'rgba(84, 101, 143, 0.3)',
    opacity: 0.4
  },
  infoContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '15px 18px 11px',
    width: '100%',
    [theme.breakpoints.down('md')]: {
      padding: '15px 20px 7px'
    },
    [theme.breakpoints.down('xs')]: {
      padding: '15px 10px 7px'
    }
  },
  skel_infoContainer: {
    width: '100%',
    height: 38,
    [theme.breakpoints.down('md')]: {
      height: 43
    },
    [theme.breakpoints.down('xs')]: {
      height: 32
    }
  },
  tracNftName: {
    fontWeight: 600,
    fontSize: 14,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    [theme.breakpoints.down('md')]: {
      fontSize: 18
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 12
    }
  },
  collectionName: {
    fontWeight: 500,
    fontSize: 13,
    opacity: '0.7',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    [theme.breakpoints.down('md')]: {
      fontSize: 13
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 10
    }
  },
  chainContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    marginLeft: 18,
    marginBottom: 14,
    width: '100%',
    [theme.breakpoints.down('md')]: {
      marginRight: 20,
      marginBottom: 21
    },
    [theme.breakpoints.down('xs')]: {
      marginRight: 12,
      marginBottom: 12
    }
  },
  chain: {
    width: 22,
    height: 22,
    background: 'linear-gradient(0deg, #FFFFFF, #FFFFFF), #17172D',
    border: '1px solid rgba(168, 168, 168, 0.38)',
    borderRadius: 24,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    [theme.breakpoints.down('md')]: {
      width: 22,
      height: 22,
      border: '4px solid #FFFFFF',
      boxShadow: '1px 4px 4px rgba(0, 0, 0, 0.14)'
    },
    [theme.breakpoints.down('xs')]: {
      width: 14,
      height: 14,
      border: '4px solid #FFFFFF',
      boxShadow: '1px 4px 4px rgba(0, 0, 0, 0.14)'
    }
  },
  skel_chain: {
    width: 22,
    height: 22,
    borderRadius: 24,
    [theme.breakpoints.down('md')]: {
      width: 22,
      height: 22,
      boxShadow: '1px 4px 4px rgba(0, 0, 0, 0.14)'
    },
    [theme.breakpoints.down('xs')]: {
      boxShadow: '1px 4px 4px rgba(0, 0, 0, 0.14)'
    }
  }
}));
