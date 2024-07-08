import makeStyles from '@material-ui/core/styles/makeStyles';

export const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: '#FFFFFF',
    boxShadow: '0px 15px 35px -12px rgba(17, 32, 53, 0.02)',
    borderRadius: 30,
    maxHeight: '300px',
    padding: '20px 35px',
    position: 'relative',
    width: '100%'
  },
  playButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '100%',
    width: 48,
    height: 48,
    cursor: 'pointer',
    background:
      'linear-gradient(88.38deg, #4434FF 7.67%, #2B99FF 102.5%), linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)',
    '&.big': {
      width: 100,
      height: 100
    }
  },
  playTime: {
    fontSize: 14,
    fontWeight: 500,
    color: '#2D3047',
    lineHeight: '24px'
  },
  slider: {
    flex: 1,
    marginLeft: 24,
    '& > div:first-child': {
      '& span': {
        fontSize: 14,
        fontWeight: 800,

        color: '#2D3047'
      }
    }
  }
}));
