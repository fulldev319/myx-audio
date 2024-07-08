import { makeStyles } from '@material-ui/core/styles';
import { Color } from 'shared/ui-kit';

export const useCarouselSongCardStyles = makeStyles((theme) => ({
  card: {
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    borderRadius: 16,

    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: 16,
    lineHeight: '20px',
    height: 325,
    width: '100%',
    minWidth: 250,
    marginRight: 24,
    position: 'relative',
    cursor: 'pointer'
  },
  bgImg: {
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    overflow: 'hidden',
    borderRadius: 16
  },
  nameBar: {
    width: '100%',
    height: 65,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    color: '#fff',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16
  },
  stampImg: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -60%)',
    width: 200
  },
  typo: {
    fontSize: 12,
    fontWeight: 800,

    lineHeight: '166%',
    letterSpacing: '0.255em',
    textTransform: 'uppercase',
    transform: 'rotate(-90deg)',
    color: '#fff',
    zIndex: 1
  }
}));
