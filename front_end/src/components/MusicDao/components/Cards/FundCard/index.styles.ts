import { makeStyles } from '@material-ui/core/styles';
import { Color } from 'shared/ui-kit';

export const FundCardStyles = makeStyles((theme) => ({
  root: {
    background: 'white',
    borderRadius: theme.spacing(2),
    boxShadow: '0px 18px 10px -10px rgba(19, 45, 38, 0.07)',
    padding: theme.spacing(3),
    marginTop: theme.spacing(2),
    width: 400,
    [theme.breakpoints.down('sm')]: {
      width: 'auto'
    }
  },
  header1: {
    fontSize: 14,
    fontWeight: 500,
    color: Color.MusicDAOLightBlue
  },
  header2: {
    fontSize: 16,
    fontWeight: 600,
    color: Color.Black,
    '& > span': {
      opacity: 0.7
    }
  },
  header3: {
    fontSize: 14,
    fontWeight: 600,
    color: Color.MusicDAOGreen
  },
  header4: {
    fontSize: 16,
    fontWeight: 500,
    color: '#707582',
    maxWidth: 180
  },
  flexBox: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  label: {
    backgroundColor: Color.MusicDAOGreen,
    color: Color.White,
    width: 'auto',
    minWidth: 48,
    height: 32,
    borderRadius: 6,
    lineHeight: '32px',
    padding: '0 16px',
    fontSize: 14,
    fontWeight: 700
  }
}));
