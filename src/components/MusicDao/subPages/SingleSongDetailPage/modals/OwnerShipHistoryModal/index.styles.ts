import makeStyles from '@material-ui/core/styles/makeStyles';

export const modalStyles = makeStyles(() => ({
  root: {
    padding: '10px 0px 20px'
  },
  container: {
    width: '100%',
    '& .MuiTableCell-root': {
      paddingLeft: 46,
      paddingRight: 46
    },
    '& tr td:last-child': {
      width: '1%',
      whiteSpace: 'nowrap'
    }
  },
  title: {
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: 16,
    lineHeight: '130%',
    textTransform: 'uppercase',
    color: '#2D3047',
    textAlign: 'center',
    padding: 24
  }
}));
