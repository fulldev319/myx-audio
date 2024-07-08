import { makeStyles } from '@material-ui/core/styles';
import { Gradient } from 'shared/ui-kit';

export const musicTabStyles = makeStyles((theme) => ({
  musicTabMain: {
    padding: '46px 110px',
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.down('sm')]: {
      padding: '46px 40px'
    }
  },
  nftItemSection: {
    display: 'flex',
    background: 'rgba(255, 255, 255, 0.4)',
    border: '1px solid rgba(84, 101, 143, 0.3)',
    boxShadow: '0px 15px 20px -6px rgba(29, 103, 84, 0.11)',
    borderRadius: 30,
    padding: '35px 42px',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column'
    }
  },
  streamingMark: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 0px',
    fontSize: 11,

    fontWeight: 700,
    color: '#65CB63',
    textTransform: 'uppercase',
    background: 'linear-gradient(0deg, #F2FBF6, #F2FBF6), #17172D',
    letterSpacing: '0.33em',
    marginTop: 8
  },
  tag: {
    background: '#65CB63',
    borderRadius: 8,
    padding: '10px 16px 8px',
    fontSize: 16,
    fontWeight: 600,
    color: '#fff',
    textTransform: 'uppercase'
  },
  actionBtn: {
    display: 'flex',
    alignItems: 'center',
    padding: '5px 8px',
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 700,

    textTransform: 'uppercase',
    cursor: 'pointer'
  },
  typo1: {
    fontSize: 16,
    fontWeight: 600
  },
  typo2: {
    fontSize: 22,
    fontWeight: 800,
    color: '#2D304790',

    textAlign: 'center'
  },
  typo3: {
    fontSize: 27,
    fontWeight: 800,
    color: '#2D3047',

    lineHeight: '35px'
  },
  typo4: {
    fontSize: 20,
    fontWeight: 600,
    color: '#181818'
  },
  typo5: {
    fontSize: 20,
    fontWeight: 800,
    color: '#65CB63'
  },
  typo6: {
    fontSize: 20,
    fontWeight: 400,
    color: '#181818'
  },
  typo7: {
    fontSize: 18,
    fontWeight: 500,
    color: '#707582'
  },
  typo8: {
    fontSize: 28,
    fontWeight: 600,
    color: '#65CB63'
  },
  typo10: {
    fontSize: 32,
    fontWeight: 800,
    color: '#858585'
  },
  regularLabel: {
    fontWeight: 500,
    fontSize: 18,
    [theme.breakpoints.down('xs')]: {
      fontSize: 12
    }
  },
  regularAmount: {
    fontWeight: 800,
    fontSize: 50,
    color: 'transparent',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    background: Gradient.Green1
  },
  editionRow: {
    '& > div': {
      flex: 1
    },
    '& > div:first-child': {
      flex: 3
    }
  }
}));
