import { makeStyles } from '@material-ui/core/styles';

export const songCardStyles = makeStyles((theme) => ({
  container: {
    borderRadius: theme.spacing(2),
    background: 'white',
    boxShadow: '0px 15px 16px -11px rgba(0, 0, 0, 0.02)',
    padding: `${theme.spacing(2)}px 0`
  },
  topBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'rgba(238, 242, 247, 0.5)',
    borderRadius: theme.spacing(1),
    padding: theme.spacing(2),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2)
  },
  imgBox: {
    width: theme.spacing(15),
    height: theme.spacing(8),
    borderRadius: theme.spacing(1),
    overflow: 'hidden',
    objectFit: 'cover'
  },
  dataBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    borderBottom: '1px solid #00000022'
  },
  buttonBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  header1: {
    fontSize: 16,
    fontWeight: 600
  },
  header2: {
    fontSize: 14,
    fontWeight: 500
  },
  header3: {
    fontSize: 14,
    fontWeight: 600
  }
}));
