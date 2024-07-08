import { makeStyles } from '@material-ui/core/styles';
import { Color } from 'shared/ui-kit';

export const podsPageStyles = makeStyles((theme) => ({
  content: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: '60px 168px 150px 168px',
    overflowY: 'auto',
    overflowX: 'hidden',
    position: 'relative',
    [theme.breakpoints.down('lg')]: {
      padding: '60px 140px 150px'
    },
    [theme.breakpoints.down('md')]: {
      padding: '60px 80px 150px'
    },
    [theme.breakpoints.down('sm')]: {
      padding: '60px 40px 150px'
    },
    [theme.breakpoints.down('xs')]: {
      padding: '60px 16px 150px'
    },

    '& ::-webkit-scrollbar': {
      width: 0
    }
  },
  green1: {
    position: 'absolute',
    width: '279px',
    right: '48px',
    top: '-60px'
  },
  green2: {
    position: 'absolute',
    width: '132px',
    left: '168px',
    top: '110px',
    [theme.breakpoints.down(1230)]: {
      top: 190
    },
    [theme.breakpoints.down(900)]: {
      top: 190,
      left: 10
    },
    [theme.breakpoints.down(600)]: {
      top: 190,
      left: -50
    }
  },
  flexBox: {
    display: 'flex',
    alignItems: 'center'
  },
  headerTitle: {
    fontSize: 58,
    color: '#ffffff',

    lineHeight: '75px',
    fontWeight: 400,
    '& span': {
      fontWeight: 900
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '52px'
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '40px'
    }
  },
  header1: {
    fontSize: 22,
    fontWeight: 800,

    lineHeight: '130%'
  },
  header2: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: 400,

    letterSpacing: '0.02em',
    lineHeight: '150%',
    marginBottom: 26,
    '& span': {
      fontWeight: 600
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '24px'
    },
    [theme.breakpoints.down(750)]: {
      fontSize: '20px'
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '14px'
    }
  },
  header3: {
    fontSize: 14,
    fontWeight: 600,

    lineHeight: '18px'
  },
  header4: {
    fontSize: 14,
    fontWeight: 600
  },
  header5: {
    fontSize: 16,
    fontWeight: 800,
    lineHeight: '130%'
  },
  filterContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
    zIndex: 1
    // [theme.breakpoints.down("xs")]: {
    //   marginTop: theme.spacing(2),
    //   marginBottom: theme.spacing(1),
    //   flexDirection: "column",
    //   rowGap: 10,
    //   alignItems: "flex-end",
    // },
  },
  optionSection: {
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      justifyContent: 'flex-end'
    }
  },
  filterButtonBox: {
    background: 'rgba(240, 245, 248, 0.7)',
    display: 'flex',
    alignItems: 'center',
    padding: `${theme.spacing(1)}px ${theme.spacing(1.5)}px`,
    borderRadius: theme.spacing(4),
    cursor: 'pointer',
    [theme.breakpoints.down('xs')]: {
      padding: '8px 14px'
    },
    color: Color.MusicDAODark
  }
}));
