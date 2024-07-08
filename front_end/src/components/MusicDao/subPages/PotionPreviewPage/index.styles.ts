import { makeStyles } from '@material-ui/core/styles';
import { Color } from 'shared/ui-kit';

export const potionPreviewStyles = makeStyles((theme) => ({
  container: {
    position: 'relative'
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    background:
      'linear-gradient(180deg, rgba(243, 254, 247, 0) -0.92%, #EEF2F6 63.74%), linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)',
    width: '100%',
    height: '100vh'
  },
  mainBox: {
    position: 'relative',
    zIndex: 1,
    padding: '0 160px',
    marginTop: 50,
    fontWeight: 600,
    [theme.breakpoints.down('xs')]: {
      padding: '0 20px'
    }
  },
  title1: {
    fontSize: 22,
    fontWeight: 800,
    color: Color.MusicDAODark
  },
  title2: {
    fontSize: 18,
    fontWeight: 800,
    color: Color.MusicDAODark
  },
  text1: {
    fontSize: 13,
    fontWeight: 500,
    color: '#707582'
  },
  text2: {
    fontSize: 16,
    color: '#2D3047'
  },
  avatar: {
    width: '100%',
    height: 200,
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    borderRadius: 20
  },
  tag: {
    backgroundColor: 'white',
    borderRadius: 5,
    fontSize: 10,
    color: Color.MusicDAODark,
    padding: '5px 10px',
    '& + &': {
      marginLeft: 4
    }
  },
  detailBox: {
    border: '1px solid rgba(84, 101, 143, 0.3)',
    borderRadius: 12,
    '& span': {
      fontWeight: 600
    }
  },
  card: {
    background: '#FFFFFF',
    boxShadow: '0px 15px 35px -12px rgba(17, 32, 53, 0.02)',
    borderRadius: 40,
    padding: '25px 40px',
    '& + &': {
      marginTop: 24
    }
  },
  leftGrid: {
    borderRight: '1px solid rgba(84, 101, 143, 0.3)'
  },
  button: {
    position: 'relative',
    background: 'linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)',
    borderRadius: 54,
    width: 237
  },
  sliderNav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
    background: 'linear-gradient(0deg, #EEF2F7, #EEF2F7), #F0F5F8',
    borderRadius: '100%',
    cursor: 'pointer'
  },
  parent: {
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column'
    }
  }
}));
