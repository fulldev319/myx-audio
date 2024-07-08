import { makeStyles } from '@material-ui/core/styles';

export const usePageStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    color: '#2D3047'
  },
  ownersContainer: {
    display: 'flex',
    flexDirection: 'column',
    background: '#fff',
    borderRadius: 20,
    marginTop: 40
  },
  ownersTableHeader: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 16,
    fontWeight: 600,

    color: '#000',
    padding: '25px 50px',
    borderBottom: '1px solid #00000010',
    textTransform: 'uppercase'
  },
  typo1: {
    fontSize: 32,
    fontWeight: 800,
    lineHeight: '104.5%'
  },
  typo2: {
    fontSize: 18,
    fontWeight: 600
  },
  typo3: {
    fontSize: 14,
    fontWeight: 500,

    color: '#74D073'
  },
  typo4: {
    fontSize: 14,
    fontWeight: 500
  }
}));
