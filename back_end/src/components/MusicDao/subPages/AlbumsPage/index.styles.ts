import { makeStyles } from '@material-ui/core/styles';
import { Color } from 'shared/ui-kit';

export const AlbumsPageStyles = makeStyles((theme) => ({
  content: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    maxWidth: 1600,
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: `60px ${theme.spacing(10)}px 150px`,
    [theme.breakpoints.down('md')]: {
      padding: `60px ${theme.spacing(2)}px 150px`
    }
  },
  background: {
    overflow: 'auto'
  },
  flexBox: {
    display: 'flex',
    alignItems: 'center'
  },
  header1: {
    fontSize: 22,
    fontWeight: 800,

    lineHeight: '28.6px',
    // color: "white",
    [theme.breakpoints.down('xs')]: {
      fontSize: 20
    }
  },
  optionSection: {
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      // width: "100%",
      flex: 1,
      justifyContent: 'flex-end'
    }
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
  arrowBox: {
    display: 'flex',
    alignItems: 'center',
    background: 'white',
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    borderRadius: theme.spacing(4),
    boxShadow: '0px 10px 21px -9px rgba(105, 105, 105, 0.15)'
  },
  carousel: {
    '& .rec.rec-slider-container': {
      margin: 0,
      width: 'calc(100% + 16px)',
      marginLeft: -8,
      marginRight: -8,
      '& .rec.rec-item-wrapper': {
        overflow: 'unset',
        transform: 'scale(0.98)'
      }
    }
  }
}));
