import { makeStyles } from '@material-ui/core/styles';

export const voteSortStyles = makeStyles((theme) => ({
  content: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    cursor: 'pointer',
    justifyContent: 'center'
  },
  popUpSection: {
    fontSize: 12,
    fontWeight: 600,
    marginRight: 7,
    textTransform: 'uppercase',
    marginTop: 3
  },
  popUpMenu: {
    zIndex: 100,
    top: '12px !important'
  },
  popUpMenu1: {
    zIndex: 100,
    top: '12px !important',
    left: 0
  },
  label: {
    marginTop: 3
  },
  popUpMenuContent: {
    padding: '8px',
    background: '#FFFFFF',
    boxShadow: '0px 15px 35px -31px rgba(16, 66, 53, 0.19)',
    borderRadius: 17,
    maxHeight: '310px',
    overflow: 'scroll',
    '& li': {
      color: '#2D3047',
      borderBottom: '0.5px solid #E0DFF0',
      opacity: 0.6,
      textTransform: 'uppercase',
      '&:hover': {
        opacity: 1
      },
      '&:last-child': {
        borderBottom: 'none'
      }
    }
  }
}));
