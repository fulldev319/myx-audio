import makeStyles from '@material-ui/core/styles/makeStyles';

export const modalStyles = makeStyles(() => ({
  content: {
    padding: '16px 0px',
    display: 'flex',
    flexDirection: 'column'
  },
  tokenSelect: {
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
    borderRadius: 8,
    paddingLeft: 18,
    paddingRight: 14,
    marginRight: 0,
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
    fontWeight: 600
  },
  typo3: {
    color: '#54658F80',
    fontSize: 14,
    fontWeight: 500
  },
  maxButton: {
    cursor: 'pointer'
  }
}));
