import { makeStyles } from '@material-ui/core/styles';
import { Color } from 'shared/ui-kit';

export const bopsCombinCardStyles = makeStyles((theme) => ({
  container: {
    background:
      'linear-gradient(180.22deg, #FFFFFF 30.61%, rgba(255, 255, 255, 0.3) 92.46%)',
    borderRadius: '0% 0% 80% 80% /80% 80% 20% 20%',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: '15px 14px',
    '& > div': {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      borderRadius: '0% 0% 80% 80% /80% 80% 20% 20%',
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      background: 'white',
      boxShadow: '0px 4.20639px 4.20639px rgba(0, 0, 0, 0.03)',
      paddingBottom: 36,
      paddingLeft: 12,
      paddingRight: 12
    }
  },
  logoImage: {
    display: 'flex',
    flexDirection: 'column',
    width: 315,
    height: 312,
    background:
      'linear-gradient(180deg, rgba(4, 197, 150, 0.3198) 19.67%, rgba(255, 255, 255, 0.41) 72.86%)',
    borderRadius: 16,
    paddingBottom: 16
  },
  button: {
    width: 170,
    minWidth: 170,
    maxWidth: 170,
    '& > div': {
      textTransform: 'unset !important'
    }
  },
  timeTag: {
    background: 'linear-gradient(87.82deg, #A0D800 20.18%, #0DCC9E 78.08%)',
    borderRadius: 6,
    padding: '7px 13px',
    color: 'white',
    fontSize: 16,
    fontWeight: 700
  }
}));
