import { makeStyles } from '@material-ui/core/styles';
import { BorderRadius } from 'shared/ui-kit';

export const playlistCardStyles = makeStyles((theme) => ({
  card: {
    width: '100%',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    padding: 8,
    // justifyContent: 'center',
    // alignItems: 'center',
    // padding: '0px 0px 16px',
    // background: '#ffffff',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.12)',
    height: 364,
    cursor: 'pointer',
    borderRadius: 12,
    background:
      'linear-gradient(#081047, #081047) padding-box, linear-gradient(122.33deg, #4C0CBD 13.31%, #2A9FE2 93.53%) border-box',
    border: '1px solid transparent',
    '&:hover': {
      boxShadow:
        '0px 0px 24px rgba(255, 255, 255, 0.65), 0px 31px 44px -13px rgba(0, 0, 0, 0.02)',
      transform: 'scale(1.02)'
    }
  },
  album: {
    // width: '100%',
    height: 275.46,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    marginBottom: 16,
    borderRadius: 8
  },
  bottomBox: {
    display: 'flex',
    alignItems: 'center',
    margin: '0 16px',
    flex: 1
  },
  playIconBox: {
    background: '#FF00C6',
    borderRadius: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    width: 40,
    height: 40
  },
  title: {
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: 16,
    lineHeight: '104.5%',
    display: 'flex',
    alignItems: 'center',
    // textAlign: 'center',
    color: '#fff',
    height: '30px'
  },
  songCount: {
    color: '#C7C7C7',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 14,
    lineHeight: '150%'
  },
  description: {
    fontStyle: 'normal',
    fontWeight: 400,
    padding: '0px 20px',
    fontSize: 14,
    lineHeight: '150%',
    // display: 'flex',
    // alignItems: 'center',
    // textAlign: 'center',
    color: '#707582',
    height: '25px',
    '-webkit-line-clamp': 1,
    '-webkit-box-orient': 'vertical',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    display: '-webkit-box'
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    border: '2px solid #fff',
    position: 'absolute',
    top: 16,
    right: 16
  },
  card2: {
    display: 'flex',
    padding: 8,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.12)',
    width: '75vw',
    height: 579,
    borderRadius: 18,
    background:
      'linear-gradient(#081047, #081047) padding-box, linear-gradient(122.33deg, #4C0CBD 13.31%, #2A9FE2 93.53%) border-box',
    border: '1px solid transparent'
    // '&:hover': {
    //   boxShadow:
    //     '4px 4px 24px rgba(19, 45, 38, 0.25), 0px 31px 44px -13px rgba(0, 0, 0, 0.02)',
    //   transform: 'scale(1.02)'
    // }
  },
  album2: {
    cursor: 'pointer',
    position: 'relative',
    height: '100%',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16
  },
  playButton: {
    position: 'absolute',
    color: '#fff',
    fontSize: 20,
    top: 32,
    left: 24
  },
  avatar2: {
    width: 65,
    height: 65,
    borderRadius: '50%',
    border: '2px solid #fff',
    position: 'absolute',
    top: 24,
    right: 24
  },
  title1: {
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: 56,
    lineHeight: '104.5%',
    display: 'flex',
    alignItems: 'center',
    // textAlign: 'center',
    color: '#fff',
    height: '30px'
  },
  songCount1: {
    color: '#C7C7C7',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 24,
    lineHeight: '150%'
  },
  tableBox: {
    width: '40%',
    background: '#fff',
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    fontSize: 16
  },
  tableContainer: {
    height: '100%'
  },
  tableHeader: {
    color: '#C7C7C7',
    display: 'flex',
    alignItems: 'center',
    borderBottom: '1px solid #C7C7C7',
    height: 60
  },
  tableContent: {
    height: 'calc(100% - 60px)'
  },
  trackRow: {
    display: 'flex',
    alignItems: 'center',
    margin: 16
  },
  colNumber: {
    flex: 1
  },
  colTrack: {
    flex: 6,
    display: 'flex',
    alignItems: 'center'
  },
  colPlatform: {
    flex: 3
  }
}));
