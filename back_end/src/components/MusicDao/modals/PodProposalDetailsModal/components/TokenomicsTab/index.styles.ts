import { makeStyles } from '@material-ui/core/styles';

export const tokenomicsTabStyles = makeStyles((theme) => ({
  tokenomicsTab: {
    padding: '46px 280px',
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.down('sm')]: {
      padding: '46px 40px'
    }
  },
  infoSection: {
    padding: '47px 32px 64px',
    background: 'rgba(255, 255, 255, 0.4)',
    border: '1px solid rgba(84, 101, 143, 0.3)',
    boxShadow: '0px 15px 20px -6px rgba(29, 103, 84, 0.11)',
    borderRadius: 30
  },
  typo1: {
    fontSize: 16,
    fontWeight: 700,
    color: '#65CB63',
    textTransform: 'uppercase'
  },
  typo2: {
    fontSize: 22,
    fontWeight: 800,
    color: '#2D304790',

    textAlign: 'center'
  },
  typo3: {
    fontSize: 16,
    fontWeight: 600,
    color: '#54658F',

    lineHeight: '104.5%'
  },
  typo4: {
    fontSize: 24,
    fontWeight: 800,
    color: '#2D3047',

    lineHeight: '130%'
  },
  typo5: {
    fontSize: 16,
    fontWeight: 600,
    color: '#2D304790',

    lineHeight: '104.5%'
  },
  typo6: {
    fontSize: 20,
    fontWeight: 800,
    color: '#65CB63',

    lineHeight: '24px',
    letterSpacing: '0.02em'
  }
}));
