import makeStyles from '@material-ui/core/styles/makeStyles';

export const modalStyles = makeStyles(() => ({
  content: {
    padding: '16px 0px',
    display: 'flex',
    flexDirection: 'column'
  },
  chartSection: {
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: 76,
    borderBottom: '1px solid #00000010',
    marginTop: 30
  },
  amountSection: {
    background: 'linear-gradient(0deg, #F2FBF6, #F2FBF6), #17172D',
    borderRadius: 12,
    height: 155,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '30px 0px',
    marginTop: 26,
    marginBottom: 25
  },
  tokenSection: {
    border: '1px solid #7BCBB7',
    background: 'rgba(218, 230, 229, 0.4)',
    borderRadius: '55px',
    padding: '8px',
    height: 45,
    width: 245,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  selectSection: {
    marginLeft: 4,
    background: '#DAE6E5',
    height: 45,
    width: '100%',
    borderRadius: 55,
    paddingLeft: 20,
    paddingRight: 20
  },
  typo1: {
    color: '#2D3047',
    fontSize: 22,
    fontWeight: 800,

    textAlign: 'center'
  },
  typo2: {
    color: '#54658F',
    fontSize: 18,
    fontWeight: 600,

    textAlign: 'center'
  },
  typo3: {
    color: '#2D3047',
    fontSize: 14,
    fontWeight: 600
  },
  typo4: {
    color: '#1ABB00',
    fontSize: 26,
    fontWeight: 800
  },
  typo5: {
    color: '#2D3047',
    fontSize: 16,
    fontWeight: 600,

    textAlign: 'right'
  }
}));
