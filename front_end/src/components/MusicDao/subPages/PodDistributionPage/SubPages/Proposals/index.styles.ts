import { makeStyles } from '@material-ui/core/styles';
import { Color } from 'shared/ui-kit';

export const ProposalsStyle = makeStyles((theme) => ({
  title: {
    fontSize: 22,
    fontWeight: 800,
    color: Color.MusicDAODark
  },
  header1: {
    fontSize: 18,
    fontWeight: 500,
    lineHeight: '140%'
  },
  borderBox: {
    textAlign: 'center',
    background: 'inear-gradient(0deg, #EEF2F7, #EEF2F7), #F0F5F8',
    border: '1px dashed #788BA2',
    borderRadius: theme.spacing(2),
    padding: theme.spacing(6)
  }
}));
