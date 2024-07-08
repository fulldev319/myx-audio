import { makeStyles } from '@material-ui/core/styles';

export const potionsCardStyles = makeStyles((theme) => ({
  podCard: {
    background:
      'linear-gradient(172.76deg, #FFFFFF 51.5%, rgba(255, 255, 255, 0) 123.53%)',
    borderRadius: theme.spacing(2),
    clipPath: 'polygon(100% 0%, 100% 80%,  50% 91%, 0% 80%, 0% 0%)',
    padding: 8,
    position: 'relative',
    height: 540
    // width: 363
  },
  innerBox: {
    background: 'linear-gradient(180deg, #BCEBFF 17.47%, #FFFFFF 64.71%)',
    borderRadius: theme.spacing(2),
    position: 'absolute',
    top: 200,
    display: 'flex',
    flexDirection: 'column',
    clipPath: 'polygon(100% 0%, 100% 80%,  50% 100%, 0% 80%, 0% 0%)',
    paddingBottom: theme.spacing(10),
    height: 280,
    width: '95%'
  },
  podImageContent: {
    height: '226px',
    borderRadius: theme.spacing(2),
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0
  },
  podImage: {
    width: '100%',
    height: '100%',
    borderRadius: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },

  bopAvatarBox: {
    position: 'absolute',
    top: theme.spacing(1),
    left: theme.spacing(2),
    display: 'flex',
    alignItems: 'center'
  },
  bopAvatar: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    borderRadius: '100%',
    border: '2px solid #ffffff',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.12)',
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  bopAvatar1: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    borderRadius: '100%',
    border: '2px solid #ffffff',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.12)',
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  podInfo: {
    padding: '24px 24px 10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
}));
