import makeStyles from '@material-ui/core/styles/makeStyles';

export const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    padding: '0px 54px'
  },
  playButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '100%',
    width: 64,
    height: 64,
    cursor: 'pointer',
    background:
      'linear-gradient(88.38deg, #4434FF 7.67%, #2B99FF 102.5%), linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)',
    '&.big': {
      width: 100,
      height: 100
    }
  },
  playTime: {
    fontSize: 16,
    fontWeight: 500,
    color: '#fff',
    lineHeight: '24px'
  },
  slider: {
    flex: 1,
    marginLeft: 16,
    marginRight: 16,
    '& > div:first-child': {
      '& span': {
        fontSize: 14,
        fontWeight: 800,
        color: '#2D3047'
      }
    }
  }
}));
