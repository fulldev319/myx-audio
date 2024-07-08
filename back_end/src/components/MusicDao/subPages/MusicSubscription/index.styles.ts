import { makeStyles } from '@material-ui/core/styles';
import { Color } from 'shared/ui-kit';

export const musicSubscriptionStyles = makeStyles((theme) => ({
  container: {
    position: 'relative',
    background: 'linear-gradient(0deg, #EEF2F7, #EEF2F7), #F0F5F8'
  },
  backgroundBox: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '1050px',
    background:
      'linear-gradient(180deg, rgba(243, 254, 247, 0) 49.94%, #EEF2F6 96.61%), linear-gradient(97.63deg, #99CE00 26.36%, #0DCC9E 80%)'
  },
  body: {
    width: '100%',
    position: 'relative',
    margin: 'auto',
    marginTop: 12,
    padding: '0 160px',
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: 40,
    zIndex: 2
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    background: '#FFFFFF',
    boxShadow: '0px 6px 36px -11px rgba(0, 0, 0, 0.02)',
    borderRadius: 20,
    padding: '45px 38px 40px 38px',
    marginTop: 85
  },
  title: {
    fontSize: 22,
    fontWeight: 800,
    color: Color.MusicDAODark
  },
  titleDescription: {
    fontSize: 16,
    fontWeight: 500,
    color: Color.MusicDAOLightBlue
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: Color.MusicDAODark
  },
  tokenSelect: {
    borderRadius: '44px !important',
    background: 'linear-gradient(0deg, #FFFFFF, #FFFFFF), #17172D',
    boxShadow: '0px 8px 8px -4px rgba(86, 123, 103, 0.15)',
    '& .MuiSelect-root': {
      '& div': {
        fontSize: 14,
        color: '#181818',
        fontWeight: 600
      }
    }
  },
  tokenValue: {
    height: 50,
    background: 'rgba(218, 230, 229, 0.4)',
    border: '1px solid #7BCBB7',
    borderRadius: 44,
    paddingLeft: 18,
    paddingRight: 14,
    '& input': {
      flex: 1,
      color: '#2D3047',
      fontSize: 18,
      fontWeight: 500,
      outline: 'none',
      border: 'none',
      background: 'transparent',
      marginRight: 12,
      marginLeft: 12
    },
    '& span': {
      fontSize: 14,
      color: '#54658F',
      whiteSpace: 'nowrap'
    }
  },
  cardBox: {
    background: 'linear-gradient(0deg, #F2FBF6, #F2FBF6), #17172D',
    borderRadius: 12,
    padding: '32px 30px',
    '& button': {
      marginTop: 32,
      background: `${Color.MusicDAOGreen} !important`,
      fontSize: '16px !important',
      textTransform: 'uppercase',
      maxWidth: 537,
      minWidth: 250
    }
  },
  cardBoxTitle: {
    color: Color.MusicDAOGreen,
    fontSize: 16,
    fontWeight: 800,
    textTransform: 'uppercase'
  },
  cardBoxValue: {
    color: '#707582',
    fontSize: 24,
    fontWeight: 800,
    '& span': {
      color: Color.MusicDAODark
    }
  },
  secondButtonBox: {
    position: 'relative',
    padding: `${theme.spacing(1)}px ${theme.spacing(10)}px`,
    borderRadius: theme.spacing(4),
    cursor: 'pointer',
    border: '1px solid #65CB63',

    '& svg': {
      position: 'absolute',
      right: '16px',
      width: '16px',
      transform: 'translateY(-150%)'
    }
  }
}));
