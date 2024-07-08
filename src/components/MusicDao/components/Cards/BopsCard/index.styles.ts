import { makeStyles } from '@material-ui/core/styles';
import { Color } from 'shared/ui-kit';

export const bopsCardStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(1),
    borderRadius: theme.spacing(2),
    border: '1.5px solid #4A4A4A22',
    minWidth: theme.spacing(35)
  },
  content: {
    borderRadius: theme.spacing(1.5),
    border: '1.5px solid #4A4A4A22'
  },
  header1: {
    fontSize: 18,
    fontWeight: 800
  },
  header2: {
    fontSize: 14,
    fontWeight: 600,
    color: Color.MusicDAODark
  },
  header3: {
    fontSize: 16,
    fontWeight: 500,
    color: 'rgba(186, 184, 207, 1)'
  }
}));
