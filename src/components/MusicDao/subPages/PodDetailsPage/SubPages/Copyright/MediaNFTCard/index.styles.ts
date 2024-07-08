import makeStyles from '@material-ui/core/styles/makeStyles';

export const useMediaNFTCardStyles = makeStyles((theme) => ({
  container: {
    position: 'relative',
    background:
      'linear-gradient(180.27deg, #FFFFFF 72.48%, rgba(255, 255, 255, 0) 127.21%)',
    boxShadow:
      '0px 2px 4px rgba(45, 48, 71, 0.04), 0px 7px 19px rgba(129, 129, 162, 0.15)',
    borderRadius: 28,
    color: '#2D3047',
    paddingTop: 196,
    paddingLeft: 14,
    paddingRight: 14,
    paddingBottom: 18,
    overflow: 'hidden',
    zIndex: 0
  },
  podInfoContainer: {
    background:
      'linear-gradient(180deg, #6FC700 21.14%, rgba(255, 255, 255, 0) 78.29%)',
    boxShadow: '0px 4.24967px 4.24967px rgba(0, 0, 0, 0.03)',
    borderRadius: '11px 11px 28px 28px',
    display: 'flex',
    flexDirection: 'column',
    padding: '21px 20px 65px 26px'
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 256,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    zIndex: -1,
    '&::before': {
      content: "''",
      position: 'absolute',
      zIndex: -1,
      transform: 'scale(5)',
      transformOrigin: 'top left',
      filter: 'blur(2px)'
    }
  },
  title: {
    fontSize: 20,
    fontWeight: 600,
    color: 'white',
    textAlign: 'center'
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 500
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 600
  },
  address: {
    fontSize: 13,
    fontWeight: 500,
    maringRight: 12
  },
  divider: {
    width: '100%',
    height: 1,
    background: 'rgba(84, 101, 143, 0.3)',
    opacity: 0.4,
    marginTop: 27,
    marginBottom: 25
  }
}));
