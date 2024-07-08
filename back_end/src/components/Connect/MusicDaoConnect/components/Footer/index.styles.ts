import { makeStyles } from '@material-ui/core/styles';

export const bottomStyles = makeStyles((theme) => ({
  contentBox: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: `110px ${theme.spacing(20)}px 100px`,
    width: '100%',
    background: '#F4F9FC',
    marginLeft: 'auto',
    marginRight: 'auto',
    [theme.breakpoints.down('md')]: {
      padding: `60px ${theme.spacing(2)}px 68px`
    },
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column'
    },
    [theme.breakpoints.down('xs')]: {
      justifyContent: 'flex-start',
      '& > div + div': {
        marginTop: 40
      }
    }
  },
  flexBox: {
    display: 'flex',
    alignItems: 'center'
  },
  header1: {
    fontSize: 22,
    fontWeight: 400,

    lineHeight: '190%',
    color: '#181818',
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline'
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 16
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 14
    }
  },
  title: {
    fontSize: 30,
    fontWeight: 400,

    lineHeight: '104%',
    color: '#65CB63'
  },
  title2: {
    fontSize: 30,
    fontWeight: 400,

    lineHeight: '104.5%',
    marginBottom: 32,
    [theme.breakpoints.down('sm')]: {
      fontSize: 24,
      marginBottom: 16
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 18
    }
  },
  bottomBox: {
    display: 'flex',
    justifyContent: 'center',
    borderTop: '1px solid #70758240',
    width: '100%'
  },
  snsBox: {
    width: 52,
    height: 52,
    background: 'linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)',
    borderRadius: '50%',
    marginRight: theme.spacing(2),
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    '& svg path': {
      fill: '#fff'
    },
    '&:hover': {
      boxShadow:
        '4px 4px 24px rgba(19, 45, 38, 0.25), 0px 31px 44px -13px rgba(0, 0, 0, 0.02)',
      transform: 'scale(1.02)'
    }
  },
  navs: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      marginTop: 24
    }
  }
}));
