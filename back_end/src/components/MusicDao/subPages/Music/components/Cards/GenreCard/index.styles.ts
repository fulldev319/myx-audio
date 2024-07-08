import { makeStyles } from '@material-ui/core/styles';

export const genreCardStyles = makeStyles((theme) => ({
  cardContainer: {
    padding: '20px 0px 0px',
    '&:hover': {
      transform: 'scale(1.02)',
      '& .playIcon': {
        boxShadow:
          '0px 0px 24px rgba(255, 255, 255, 0.65), 0px 31px 44px -13px rgba(0, 0, 0, 0.02)'
      }
    }
  },
  card: {
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    width: '100%',
    height: 300,
    cursor: 'pointer',
    borderRadius: 10,
    '&:hover': {
      boxShadow:
        '0px 0px 24px rgba(255, 255, 255, 0.65), 0px 31px 44px -13px rgba(0, 0, 0, 0.02)'
    }
  },
  borderContainer: {
    background: 'linear-gradient(122.33deg, #4D08BC 13.31%, #2A9FE2 93.53%)',
    padding: 5,
    position: 'relative',
    borderRadius: 14
  },
  smallCard: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0px 0px 16px',
    background: '#ffffff',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.12)',
    height: 264,
    cursor: 'pointer',
    borderRadius: 8
  },
  playIconBoxContainer: {
    position: 'absolute',
    padding: theme.spacing(0.5),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    left: '50%',
    top: 0,
    transform: 'translate(-50%, -50%)'
  },
  playIconBox: {
    width: 40,
    height: 40,
    background: '#FF00C6',
    borderRadius: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  filter: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '8px 16px',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8
  },
  smallfilter: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '8px 16px',
    backgroundColor: 'rgba(0, 0, 0, 0.2)'
  },
  name: {
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: 40,
    lineHeight: '104.5%',
    color: '#ffffff',
    overflowWrap: 'anywhere',
    textAlign: 'center',
    textTransform: 'capitalize'
    // paddingBottom: 24
  },
  smallname: {
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: 22,
    lineHeight: '104.5%',
    color: '#ffffff'
  },
  album: {
    width: '100%',
    height: 175.46,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    marginBottom: 16
  },
  title: {
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: 14,
    lineHeight: '104.5%',
    padding: '0px 20px',
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    color: '#181818'
  },
  description: {
    marginTop: '10px',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 14,
    lineHeight: '120%',
    color: '#707582',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    height: '30px',
    width: 'calc(100% - 40px)',
    display: '-webkit-box',
    '-webkit-line-clamp': 2,
    '-webkit-box-orient': 'vertical'
  }
}));
