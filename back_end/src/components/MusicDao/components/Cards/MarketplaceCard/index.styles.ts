import { makeStyles } from '@material-ui/core/styles';
import { Color } from 'shared/ui-kit';

export const marketplaceCardStyles = makeStyles((theme) => ({
  container: {
    position: 'relative',
    maxWidth: 400,
    cursor: 'pointer'
  },
  content: {
    width: '100%',
    position: 'absolute',
    left: '50%',
    top: '20%',
    transform: 'translate(-50%, 0%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    textAlign: 'center'
  },
  innerImage: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
    top: '2%',
    left: 0,
    '& img': {
      width: '95%'
    }
  },
  backImage: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'relative',
    borderTopLeftRadius: '24px',
    borderTopRightRadius: '24px',
    width: '100%',
    height: '100%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    padding: '15px 18px',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      backgroundImage:
        'linear-gradient(transparent 40%, rgba(255, 255, 255, 0.7))'
    }
  },
  innerBox: {
    position: 'absolute',
    width: 'calc(95% - 6px)',
    height: '50%',
    top: '35%',
    background: 'linear-gradient(180deg, #FF4F28 17.47%, #FFFFFF20 64.71%)',
    borderRadius: 11
  },
  avatar: {
    '& + &': {
      marginLeft: -16
    }
  },
  tag: {
    background: 'rgba(255, 255, 255, 0.5)',
    backdropFilter: 'blur(25.91px)',
    borderRadius: 6,
    fontSize: 14,
    color: Color.Black,
    padding: '5px 18px',
    fontWeight: 600
  },
  title: {
    fontSize: 16,
    fontWeight: 600,
    textAlign: 'center',
    paddingTop: 36
  },
  description: {
    fontSize: 13,
    textAlign: 'center'
  },
  itemText: {
    fontSize: 14,
    color: '#707582'
  },
  itemValue: {
    fontSize: 16,
    fontWeight: 600,
    color: '#2D3047'
  },
  divider: {
    background: 'rgba(84, 101, 143, 0.4)',
    height: '1px',
    width: 'calc(100% - 48px)',
    marginLeft: 24,
    marginRight: 24,
    opacity: 0.4,
    marginTop: 20,
    marginBottom: 28
  },
  boxHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 999,
    top: -12,
    left: 'calc(50% - 56px)'
  },
  detail: {
    marginTop: 32
  }
}));
