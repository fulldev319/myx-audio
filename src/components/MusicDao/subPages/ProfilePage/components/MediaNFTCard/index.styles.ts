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
    padding: '8px 8px 40px',
    overflow: 'hidden',
    zIndex: 0,
    '&:hover': {
      boxShadow:
        '0px 16px 24px rgba(19, 45, 38, 0.25), 0px 31px 44px -13px rgba(0, 0, 0, 0.02)',
      transform: 'scale(1.02)'
    }
  },
  podInfoContainer: {
    display: 'flex',
    flexDirection: 'column',
    padding: '16px 10px 0'
  },
  image: {
    position: 'relative',
    width: '100%',
    height: 186,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderRadius: 14
  },
  title: {
    fontSize: 16,
    fontWeight: 600
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 500
  },
  infoValue: {
    fontSize: 14,
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
    marginTop: 13,
    marginBottom: 13
  },
  tag: {
    position: 'absolute',
    top: 8,
    right: 18,
    background: 'linear-gradient(0deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3))',
    backdropFilter: 'blur(25.91px)',
    borderRadius: 6,
    padding: '5px 13px',
    color: 'white',
    fontSize: 13,
    fontWeight: 600,
    textTransform: 'uppercase'
  },
  price: {
    padding: '4px 8px',
    background: 'linear-gradient(0deg, #EEF2F7, #EEF2F7), #F0F5F8',
    borderRadius: 36,
    fontWeight: 500,
    fontSize: 14,
    '& span': {
      fontWeight: 'bold'
    }
  }
}));
