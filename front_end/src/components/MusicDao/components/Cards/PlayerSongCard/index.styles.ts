import { makeStyles } from '@material-ui/core/styles';

export const useCardStyles = makeStyles((theme) => ({
  card: {
    display: 'flex',
    flexDirection: 'column',
    padding: '1px',
    background: 'linear-gradient(138.25deg, #4D08BC 6.68%, #2A9FE2 100%)',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.12)',
    height: 364,
    cursor: 'pointer',
    borderRadius: 12,
    '&:hover': {
      boxShadow:
        '0px 0px 24px rgba(255, 255, 255, 0.65), 0px 31px 44px -13px rgba(0, 0, 0, 0.02)',
      transform: 'scale(1.02)'
    }
  },
  cardBox: {
    background: '#081047',
    padding: 8,
    height: '100%',
    borderRadius: 12,
    position: 'relative'
  },
  album: {
    height: '100%',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderRadius: 12
  },
  contentBox: {
    background:
      '#081047 linear-gradient(96.49deg, rgba(255, 255, 255, 0.4) 25.34%, rgba(255, 255, 255, 0.1) 125.79%)',
    backdropFilter: 'blur(40px)',
    position: 'absolute',
    paddingTop: 12,
    paddingBottom: 12,
    bottom: 8,
    left: 8,
    right: 8,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  title: {
    fontStyle: 'normal',
    fontWeight: 800,
    padding: '0px 20px',
    fontSize: 20,
    lineHeight: '28.8px',
    // display: 'flex',
    // alignItems: 'center',
    // textAlign: 'center',
    color: '#fff',
    height: '25px',
    '-webkit-line-clamp': 1,
    '-webkit-box-orient': 'vertical',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    display: '-webkit-box'
  },
  description: {
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 14,
    lineHeight: '20.52px',
    color: '#fff',
    height: '25px',
    '-webkit-line-clamp': 1,
    '-webkit-box-orient': 'vertical',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    display: '-webkit-box',
    flex: 1,
    marginRight: 16
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    border: '2px solid #fff',
    position: 'absolute',
    top: 8,
    left: 8
  },
  tag: {
    background:
      'linear-gradient(96.49deg, rgba(255, 255, 255, 0.4) 25.34%, rgba(255, 255, 255, 0.1) 125.79%)',
    borderRadius: 24,
    padding: '4px 20px',
    position: 'absolute',
    top: 16,
    left: 16,
    fontSize: 14,
    color: 'white'
  },
  name: {
    fontSize: 18,
    fontWeight: 400,
    color: '#9598A3'
  },
  playBtn: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    '& > div': {
      background: 'transparent'
    }
  },
  likedIcon: {
    cursor: 'pointer'
  },
  paper: {
    // background: '#181818',
    borderRadius: 12,
    '& .MuiListItem-root.MuiMenuItem-root': {
      // color: 'white',
      '& > svg': {
        marginRight: 12
      }
    },
    minWidth: 197,
    marginLeft: -197,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.12)'
  },
  marker: {
    position: 'absolute',
    top: 12,
    right: 16,
    background: '#fff',
    width: 32,
    height: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%'
  }
}));
