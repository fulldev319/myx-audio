import { makeStyles } from '@material-ui/core/styles';
import { Color } from 'shared/ui-kit';

export const searchPageStyles = makeStyles((theme) => ({
  page: {
    width: '100%',
    height: '100%',
    display: 'flex',
    overflowY: 'auto',
    flexDirection: 'column',
    alignItems: 'flex-start',
    position: 'relative',
    overflowX: 'hidden'
  },
  content: {
    width: '100%',
    padding: '0 24px 24px',
    display: 'flex',
    flexDirection: 'column',
    height: 'fit-content'
  },
  searchBox: {
    background: 'rgba(240, 245, 248, 0.7)',
    display: 'flex',
    alignItems: 'center',
    padding: `${theme.spacing(1)}px`,
    cursor: 'pointer',
    borderRadius: '100vh',
    border: '1px solid #ccc',
    color: Color.MusicDAODark,
    maxWidth: 300,
    [theme.breakpoints.down('xs')]: {
      padding: '8px'
    }
  },
  sectionTitle: {
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: 18,
    lineHeight: '104.5%',
    color: '#2D3047',
    textTransform: 'uppercase'
  },
  showAll: {
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 14,
    lineHeight: '104.5%',
    textTransform: 'uppercase',
    color: '#fff',
    cursor: 'pointer'
  },
  empty: {
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    '& h4': {
      fontStyle: 'normal',
      fontWeight: 800,
      fontSize: 30,
      lineHeight: '104.5%',
      color: '#fff',
      margin: 0
    },
    '& h5': {
      margin: '16px 0px 24px',
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: 18,
      lineHeight: '104.5%',
      color: '#fff'
    }
  }
}));
