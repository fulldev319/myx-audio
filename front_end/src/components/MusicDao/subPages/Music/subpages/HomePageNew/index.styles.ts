import { makeStyles } from '@material-ui/core/styles';
import { Color } from 'shared/ui-kit';

export const homePageNewStyles = makeStyles((theme) => ({
  root: {
    padding: '24px 35px',
    overflowX: 'hidden',
    overflowY: 'auto'
  },
  topBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 70,
    '& span': {
      '&:last-child': {
        background: 'linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }
    }
  },
  title: {
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: 32,
    lineHeight: '104.5%',
    color: '#2D3047'
  },
  filterButtonBox: {
    background: 'rgba(240, 245, 248, 0.7)',
    display: 'flex',
    alignItems: 'center',
    padding: `${theme.spacing(1)}px`,
    cursor: 'pointer',
    borderRadius: '100vh',
    border: '1px solid #ccc',
    color: Color.MusicDAODark,
    [theme.breakpoints.down('xs')]: {
      padding: '8px'
    }
  },
  sectionTitle: {
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: 20,
    lineHeight: '104.5%',
    color: '#fff'
    // textTransform: 'uppercase'
  },
  showAll: {
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: 18,
    lineHeight: '104.5%',
    // textTransform: 'uppercase',
    color: '#fff',
    cursor: 'pointer'
  },
  flexBox: {
    display: 'flex',
    alignItems: 'center'
  }
}));
