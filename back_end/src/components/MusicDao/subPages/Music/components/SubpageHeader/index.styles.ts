import { makeStyles } from '@material-ui/core/styles';
import { Color, Gradient } from 'shared/ui-kit';

export const subpageHeaderStyles = makeStyles((theme) => ({
  headerContainer: {
    width: '100%',
    display: 'flex'
  },
  fixedHeader: {
    position: 'fixed',
    zIndex: 0,
    height: 104,
    width: 'calc(100% - 10px)',
    right: 10
  },
  filter: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    padding: '0px 48px'
  },
  header: {
    width: '100%',
    zIndex: 1,
    position: 'relative',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    '& label': {
      fontStyle: 'normal',
      fontWeight: 800,
      fontSize: 14,
      lineHeight: '104.5%',
      marginBottom: 16
    },
    '& div > b': {
      margin: '0px 8px'
    },
    '& div > span': {
      margin: '0px 8px'
    }
  },
  albumImage: {
    width: 240,
    height: 240,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  },
  avatar: {
    width: 32,
    height: 32,
    minWidth: 32,
    borderRadius: '50%',
    marginRight: 6.6,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: 80,
    lineHeight: '120.5%',
    color: '#ffffff',
    // flex: 'none',
    order: 0,
    flexGrow: 0,
    margin: 0,
    textTransform: 'capitalize'
  },
  infoTxt: {
    display: 'flex',
    alignItems: 'center',
    fontFamily: 'Pangram',
    fontWeight: 400,
    fontSize: 24,
    lineHeight: '104.5%',
    color: '#C7C7C7'
  },
  transparentButton: {
    backgroundColor: 'transparent',
    border: '1.5px solid white',
    color: 'white',
    backdropFilter: 'blur(10px)',
    width: 'fit-content'
  },
  revenue: {
    position: 'absolute',
    top: 32,
    right: 10,
    background: 'transparent',
    color: '#fff',
    padding: '8px 16px',
    borderRadius: 8,
    width: 330,
    fontSize: 20,
    lineHeight: '24px'
    // display: 'flex'
    // alignItems: 'center',
    // justifyContent: 'space-between',
  }
}));
