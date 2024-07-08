import { makeStyles } from '@material-ui/core/styles';
import { Color } from 'shared/ui-kit';

export const ProposalsStyle = makeStyles((theme) => ({
  title: {
    fontSize: 22,
    fontWeight: 800,

    color: Color.MusicDAODark,
    [theme.breakpoints.down('xs')]: {
      fontSize: 20
    }
  }
}));
