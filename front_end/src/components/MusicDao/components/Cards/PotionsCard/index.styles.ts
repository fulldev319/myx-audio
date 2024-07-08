import { makeStyles } from '@material-ui/core/styles';

export const potionsCardStyles = makeStyles((theme) => ({
  podCard: {
    background:
      'linear-gradient(171.66deg, #FFFFFF 58.39%, rgba(255, 255, 255, 0) 140.06%)',
    borderRadius: 27,
    padding: theme.spacing(2),
    position: 'relative'
  },

  innerBox: {
    background: 'linear-gradient(171.57deg, #FBFCFD 60.24%, #FAFBFC 142.71%)',
    borderRadius: 27,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    // clipPath: "polygon(100% 0%, 100% 80%,  50% 100%, 0% 80%, 0% 0%)",
    // paddingBottom: theme.spacing(10),
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.03)'
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

  genreBox: {
    position: 'absolute',
    padding: `${theme.spacing(0.25)}px ${theme.spacing(1)}px`,
    color: 'white',
    fontSize: 12,
    fontWeight: 600,
    top: theme.spacing(1.5),
    right: theme.spacing(2),
    background: 'rgba(2, 2, 2, 0.7)',
    backdropFilter: 'blur(14px)',
    borderRadius: theme.spacing(0.5)
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
    marginTop: '226px',
    padding: `${theme.spacing(3)}px 0 ${theme.spacing(2)}px`,
    flexGrow: 1,
    justifyContent: 'space-between',
    display: 'flex',
    flexDirection: 'column'
  },

  header1: {
    fontSize: 20,
    fontWeight: 600
  },

  header2: {
    fontSize: 14,
    fontWeight: 500
  },

  podMainInfo: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: `0 ${theme.spacing(2)}px`,
    marginTop: theme.spacing(1),

    '& span': {
      fontSize: '14px',
      fontWeight: 600,
      color: '#2D3047'
    },

    '& p': {
      fontSize: '18px',
      fontWeight: 800,
      color: '#65CB63',
      margin: 0
    }
  },
  flexBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',

    '& div': {
      fontSize: '14px',
      color: '#707582'
    }
  },
  divider: {
    width: '100%',
    height: '1px',
    background: '#000',
    opacity: 0.05,
    margin: '16px 0'
  },
  socialButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    borderBottomLeftRadius: theme.spacing(2),
    borderBottomRightRadius: theme.spacing(2),
    background:
      'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.8) 68.66%)'
  },
  clickable: {
    cursor: 'pointer'
  }
}));
