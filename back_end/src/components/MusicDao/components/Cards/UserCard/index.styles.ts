import { makeStyles } from '@material-ui/core/styles';

export const userCardStyles = makeStyles((theme) => ({
  container: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 166,
    minWidth: 160,
    height: 200,
    background: '#ffffff',
    boxShadow: '0px 18px 10px -10px rgba(19, 45, 38, 0.07)',
    borderRadius: 18,
    userSelect: 'none',
    cursor: 'pointer',
    padding: '32px 8px 18px',
    '&:not(:first-child)': {
      marginLeft: '22px'
    }
  },
  avatar: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
    cursor: 'pointer',
    '& img': {
      border: 'none',
      height: 58,
      width: 58
    }
  },
  title: {
    fontSize: 14,

    fontWeight: 400,
    color: '#181818',
    textAlign: 'center',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  userName: {
    fontWeight: 700,
    fontSize: 11,

    color: '#65CB63',
    textAlign: 'center',
    marginTop: 5,
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  iconContainer: {
    display: 'flex',
    justifyContent: 'center'
  },
  icon: {
    width: 24,
    height: 24
  },
  statusVerify: {
    fontSize: 12,
    fontWeight: 500,

    color: '#707582',
    marginLeft: 7
  },
  deleteIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 16
  }
}));
