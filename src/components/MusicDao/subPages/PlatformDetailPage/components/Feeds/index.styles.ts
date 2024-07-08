import { makeStyles } from '@material-ui/core/styles';

export const usePageStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    color: '#2D3047'
  },
  feedTypeBtn: {
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: '11px 15px',
    fontSize: 14,
    fontWeight: 600,

    textTransform: 'capitalize',
    marginLeft: 8,
    cursor: 'pointer'
  },
  activeFeedTypeBtn: {
    background: '#fff'
  },
  feedContainer: {
    display: 'flex',
    flexDirection: 'column',
    background: '#fff',
    borderRadius: 20
  },
  feedHeader: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 20,
    fontWeight: 600,
    color: '#000',
    borderBottom: '1px solid #00000010',
    textTransform: 'uppercase',
    [theme.breakpoints.down('md')]: {
      fontSize: 8
    }
  },
  transferType: {
    width: 'fit-content',
    borderRadius: '34px',
    display: 'flex',
    padding: '9px 17px',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 12,
    fontWeight: 600,
    color: '#fff'
  },
  listLoading: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    borderRadius: 16,
    padding: 12,
    background: 'rgba(255, 255, 255, 0.1) !important',
    '& .MuiSkeleton-root': {
      backgroundColor: '#505050',
      borderRadius: 6
    }
  },
  typo1: {
    fontSize: 32,
    fontWeight: 800,
    lineHeight: '104.5%'
  },
  typo2: {
    fontSize: 14,
    fontWeight: 600,

    [theme.breakpoints.down('md')]: {
      fontSize: 10
    }
  },
  typo3: {
    fontSize: 10,
    fontWeight: 400,

    [theme.breakpoints.down('md')]: {
      fontSize: 8
    }
  },
  typo4: {
    fontSize: 14,
    fontWeight: 500,

    color: '#74D073',
    [theme.breakpoints.down('md')]: {
      fontSize: 10
    }
  }
}));
