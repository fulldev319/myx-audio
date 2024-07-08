import { makeStyles } from '@material-ui/core/styles';

export const notificationButtonStyles = makeStyles({
  darkButton: {
    border: 'none',
    background:
      'linear-gradient(102.54deg, #00bfff -9.09%, #8d2eff 56.17%, #ff00c1 112.56%)',
    '-webkit-background-clip': 'text',
    '-webkit-text-fill-color': 'transparent',
    minHeight: 'auto',
    width: 'auto',
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: 14,
    lineHeight: '104.5%',
    padding: 0
  },
  blueButton: {
    background: '#0D59EE !important'
  },
  emptyStyle: {},
  commentInNotification: {
    borderLeft: '2px solid grey',
    paddingLeft: 10,
    marginTop: 10,
    marginBottom: 10,
    fontSize: 14,
    color: 'grey',
    minHeight: 30
  }
});
