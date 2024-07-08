import { makeStyles } from '@material-ui/core/styles';

export const nftCardStyles = makeStyles((theme) => ({
  podCard: {
    background: '#ffffff',
    boxShadow: '0px 10px 20px rgba(19, 45, 38, 0.07)',
    borderRadius: 20,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    '&:hover': {
      boxShadow:
        '0px 16px 24px rgba(19, 45, 38, 0.25), 0px 31px 44px -13px rgba(0, 0, 0, 0.02)',
      transform: 'scale(1.02)'
    }
  },

  podImageContent: {
    height: '200px',
    margin: 8,
    position: 'relative'
  },

  podImage: {
    position: 'relative',
    width: '100%',
    height: '100%',
    borderRadius: 14,
    cursor: 'pointer',
    overflow: 'hidden'
  },

  avatar: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    borderRadius: '100%',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.12)',
    backgroundColor: 'white'
  },

  podInfo: {
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px ${theme.spacing(
      1
    )}px`,
    flexGrow: 1,
    justifyContent: 'space-between',
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
    position: 'relative'
  },

  podInfoName: {
    fontWeight: 700,
    fontSize: '16px',
    color: '#2D3047',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },

  podInfoAlbum: {
    fontWeight: 500,
    fontSize: '13px',
    color: '#2D3047',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    marginTop: 0
  },

  price: {
    background: 'linear-gradient(0deg, #EEF2F7, #EEF2F7), #F0F5F8',
    borderRadius: 36,
    padding: '4px 8px',
    fontSize: 12,
    color: '#2D3047',
    '& span': {
      fontWeight: 800
    }
  },

  divider: {
    marginRight: -theme.spacing(2),
    margin: `12px -${theme.spacing(2)}px`,
    height: 1,
    backgroundColor: 'rgba(84, 101, 143, 0.3)',
    opacity: 0.4
  },

  name: {
    background: 'linear-gradient(0deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3))',
    backdropFilter: 'blur(25.91px)',
    borderRadius: '100vh',
    padding: '5px 13px',
    color: 'white',
    fontSize: 13,
    fontWeight: 600,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    textTransform: 'uppercase',
    marginRight: 10
  },
  tag: {
    background: 'linear-gradient(0deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3))',
    backdropFilter: 'blur(25.91px)',
    borderRadius: 6,
    padding: '5px 13px',
    color: 'white',
    fontSize: 13,
    fontWeight: 600,
    textTransform: 'uppercase',
    maxWidth: '45%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  removeIcon: {
    width: 32,
    height: 32,
    borderRadius: 32,
    background: 'linear-gradient(0deg, #EEF2F7, #EEF2F7), #F0F5F8;'
  },
  stampWrap: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 'calc(100% - 16px)',

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
}));
