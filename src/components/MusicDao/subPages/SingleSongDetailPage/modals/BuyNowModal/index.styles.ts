import makeStyles from '@material-ui/core/styles/makeStyles';

export const modalStyles = makeStyles(() => ({
  content: {
    padding: '16px 0px',
    display: 'flex',
    flexDirection: 'column'
  },
  tokenSelect: {
    borderRadius: '44px !important',
    backgroundColor: 'rgba(218, 230, 229, 0.8) !important',
    '& .MuiSelect-root': {
      '& div': {
        fontSize: 14,
        color: '#181818',
        fontWeight: 600
      }
    }
  },
  tokenValue: {
    height: 50,
    background: 'rgba(218, 230, 229, 0.4)',
    border: '1px solid #7BCBB7',
    borderRadius: 44,
    paddingLeft: 18,
    paddingRight: 14,
    '& input': {
      color: '#2D3047',
      fontSize: 18,
      fontWeight: 500,
      outline: 'none',
      border: 'none',
      background: 'transparent',
      marginRight: 12
    },
    '& span': {
      fontSize: 14,
      color: '#54658F',
      whiteSpace: 'nowrap'
    }
  },
  typo1: {
    color: '#2D3047',
    fontSize: 22,
    fontWeight: 800,

    textAlign: 'center'
  },
  typo2: {
    color: '#2D304790',
    fontSize: 16,
    fontWeight: 600,

    marginTop: 41,
    textAlign: 'center'
  },
  typo3: {
    color: '#2D3047',
    fontSize: 14,
    fontWeight: 500
  },
  typo4: {
    color: '#65CB63',
    fontSize: '18px',
    fontWeight: 700,

    lineHeight: '18.81px',
    display: 'flex',
    justifyContent: 'center'
  },
  typo5: {
    color: '#2D3047',
    fontSize: '28px',
    fontWeight: 800,

    lineHeight: '29.26px',
    marginRight: '6px'
  },
  typo6: {
    color: 'lightgray',
    fontSize: '28px',
    fontWeight: 800,

    lineHeight: '29.26px'
  },
  priceContainer: {
    background: 'linear-gradient(0deg, #F2FBF6, #F2FBF6), #17172D',
    padding: '37px',
    marginTop: '12px'
  },
  maxButton: {
    cursor: 'pointer'
  }
}));
