import { makeStyles } from '@material-ui/core/styles';

export const wallItemStyles = makeStyles((theme) => ({
  item: {
    borderRadius: theme.spacing(2.5),
    boxShadow: '0px 4px 8px #9EACF2',
    background: 'white',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    cursor: 'pointer',
    position: 'relative'
  },
  image: {
    borderTopLeftRadius: theme.spacing(2.5),
    borderTopRightRadius: theme.spacing(2.5),
    width: '100%',
    height: 'auto',
    minHeight: '124px'
  },
  userImage: {
    marginLeft: theme.spacing(2),
    marginTop: -16
  },
  header1: {
    fontSize: 14,
    fontWeight: 600,
    color: '#081831',

    lineHeight: '130%',
    padding: '0px 10px 24px 16px'
  },
  header2: {
    fontSize: 14,
    fontWeight: 500,
    color: '#707582',

    lineHeight: '104.5%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: '100%'
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    padding: '15px 19px',
    borderTop: '1px solid #70758222'
  }
}));
