import { makeStyles } from '@material-ui/core/styles';
import { Color } from 'shared/ui-kit';

export const usePageStyles = makeStyles((theme) => ({
  collectionsRoot: {
    overflow: 'auto',
    height: '100%',
    position: 'relative'
  },
  content: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    maxWidth: 1600,
    marginLeft: 'auto',
    marginRight: 'auto',
    color: '#2D3047',
    padding: '100px 80px 150px',
    [theme.breakpoints.down('md')]: {
      padding: `60px 16px 150px`
    },
    [theme.breakpoints.down('xs')]: {
      padding: `60px 16px 150px`
    }
  },
  nftCollectionSection: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 32
  },
  filterButtonBox: {
    background: 'rgba(240, 245, 248, 0.7)',
    display: 'flex',
    alignItems: 'center',
    padding: `${theme.spacing(1)}px ${theme.spacing(1.5)}px`,
    borderRadius: theme.spacing(4),
    cursor: 'pointer',
    marginLeft: 8,
    color: Color.MusicDAODark,
    [theme.breakpoints.down('xs')]: {
      padding: '8px 14px'
    }
  },
  title: {
    fontSize: 32,
    fontWeight: 800,
    color: '#fff',
    lineHeight: '104.5%'
  },
  typo1: {
    fontSize: 14,
    fontWeight: 600,
    color: '#000'
  }
}));
