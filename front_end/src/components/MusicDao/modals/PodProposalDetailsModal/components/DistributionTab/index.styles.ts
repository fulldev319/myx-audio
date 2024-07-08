import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
  generalNftMediaTab: {
    padding: '46px 280px',
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.down('sm')]: {
      padding: '46px 40px'
    }
  },
  infoSection: {
    padding: '32px',
    background: 'rgba(255, 255, 255, 0.4)',
    border: '1px solid rgba(84, 101, 143, 0.3)',
    boxShadow: '0px 15px 20px -6px rgba(29, 103, 84, 0.11)',
    borderRadius: 30
  },
  table: {
    borderSpacing: '0 12px',
    borderCollapse: 'separate',

    '& .MuiTableCell-head': {
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: '14px',
      lineHeight: '18px',
      color: '#2D3047',
      border: 'none',
      textAlign: 'center'
    },
    '& .MuiTableBody-root': {
      '& .MuiTableRow-root': {
        background: 'rgba(236, 240, 244, 0.4)',
        borderRadius: 8
      },
      '& .MuiTableCell-body': {
        border: 'none',
        paddingTop: 12,
        paddingBottom: 12,
        '&:first-child': {
          paddingLeft: 12,
          borderTopLeftRadius: 8,
          borderBottomLeftRadius: 8
        },
        '&:last-child': {
          paddingRight: 12,
          borderTopRightRadius: 8,
          borderBottomRightRadius: 8
        }
      }
    }
  },
  nameTypo: {
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: '104.5%',
    color: '#181818',
    width: '100%',
    maxWidth: 100,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  slugTypo: {
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: '14px',
    lineHeight: '104.5%',
    color: '#65CB63',
    width: 100,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  box: {
    background: 'rgba(218, 230, 229, 0.4)',
    border: '1px solid #DADADB',
    borderRadius: '8px',
    padding: '10px 50px',
    [theme.breakpoints.down('xs')]: {
      padding: '8px 10px'
    },

    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '14px',
    lineHeight: '160%',
    textAlign: 'center',
    color: '#2D3047',
    opacity: '0.8'
  },
  bigBox: {
    fontWeight: 600,
    fontSize: '18px'
  },
  investorBox: {
    background: '#D1F8D0',
    borderRadius: 8,
    padding: '12px 12px 12px 28px',
    marginTop: 24,
    '& div:first-child': {
      fontStyle: 'normal',
      fontWeight: 600,
      fontSize: '16px',
      lineHeight: '104.5%',
      color: '#181818'
    }
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
  }
}));
