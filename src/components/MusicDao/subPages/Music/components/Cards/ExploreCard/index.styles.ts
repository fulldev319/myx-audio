import { makeStyles } from '@material-ui/core/styles';

export const exploreCardStyles = makeStyles((theme) => ({
  card: {
    minWidth: 175,
    minHeight: 175,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    width: '100%',
    height: 175,
    cursor: 'pointer'
  },
  filter: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)'
  },
  name: {
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: 22,
    lineHeight: '104.5%',
    color: '#ffffff',
    textAlign: 'center',
    paddingLeft: '5px',
    paddingRight: '5px'
  }
}));
