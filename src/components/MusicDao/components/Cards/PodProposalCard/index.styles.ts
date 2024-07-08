import { makeStyles } from '@material-ui/core/styles';

export const PodProposalCardStyles = makeStyles((theme) => ({
  podCard: {
    background: '#ffffff',
    boxShadow: '0px 10px 20px rgba(19, 45, 38, 0.07)',
    borderRadius: theme.spacing(2.5),
    display: 'flex',
    padding: theme.spacing(2),
    [theme.breakpoints.down('xs')]: {
      // marginLeft: '-16px',
      // marginRight: '-16px'
    },
    '&:hover': {
      boxShadow:
        '0px 16px 24px rgba(19, 45, 38, 0.25), 0px 31px 44px -13px rgba(0, 0, 0, 0.02)'
    }
  },
  podImageContent: {
    width: '285px',
    height: '220px',
    borderRadius: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.down('xs')]: {
      width: '138px',
      height: '100%'
    }
  },
  podImage: {
    width: '100%',
    height: '100%',
    borderRadius: theme.spacing(2)
  },
  header1: {
    fontSize: 14,
    fontWeight: 600
  },
  header2: {
    fontSize: 24,
    fontWeight: 700,
    [theme.breakpoints.down('xs')]: {
      fontSize: 16
    }
  },
  header3: {
    fontSize: 14,
    fontWeight: 500
  },
  flexBox: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    width: theme.spacing(4.5),
    height: theme.spacing(4.5),
    [theme.breakpoints.down('xs')]: {
      width: 32,
      height: 32
    },
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  botWrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'start',
      marginTop: 0
    }
  },
  username: {
    // [theme.breakpoints.down("xs")]: {
    //   maxWidth: 80
    // }
  }
}));
