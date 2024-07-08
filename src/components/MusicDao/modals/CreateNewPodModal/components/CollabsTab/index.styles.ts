import { makeStyles } from '@material-ui/core/styles';
import { Color } from 'shared/ui-kit';

export const collabsTabStyles = makeStyles((theme) => ({
  inputContainer: {
    background: 'rgba(255, 255, 255, 0.4)',
    border: '1px solid #DADADB',
    boxSizing: 'border-box',
    borderRadius: '48px',
    height: '56px',
    width: '100%',
    padding: '14px 20px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    '& img': {
      width: '17px',
      height: '17px'
    }
  },
  addRound: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    background: Color.MusicDAOBlue,
    width: '29px',
    height: '29px',
    marginLeft: '12px',
    '& svg': {
      width: '10px',
      height: '10px'
    }
  },
  addButton: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '6px 15px 6px 6px',
    margin: '50px 0px 0px',
    background: '#F0F5F8',
    borderRadius: '41px',
    color: '#2D3047',
    fontSize: '14px',
    fontWeight: 800,
    '& svg': {
      marginRight: '10px',
      width: '10px',
      height: '10px'
    }
  },
  removeButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    marginLeft: theme.spacing(1),
    border: '1.5px solid red',
    borderRadius: '50%',
    width: theme.spacing(3),
    height: theme.spacing(3),
    background: 'none',
    '& svg': {
      width: '10px',
      height: '10px'
    }
  },
  userTile: {
    padding: '20px 0px',
    color: '#404658',

    fontSize: '16px',
    borderBottom: '1px solid #00000021',
    '& + &': {
      border: 'none'
    }
  },
  invitationSentBtn: {
    fontSize: 14,

    fontWeight: 500,
    lineHeight: '17px',
    color: '#FF8E3C'
  },
  urlSlug: {
    fontSize: 16,
    color: '#404658',
    maxWidth: 120,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    marginLeft: 10,
    whiteSpace: 'nowrap',
    fontWeight: 500
  },
  renderItemBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 26px',
    width: '100%',
    [theme.breakpoints.down(560)]: {
      paddingLeft: '8px',
      paddingRight: '8px'
    }
  },
  inviteBox: {
    [theme.breakpoints.down(560)]: {
      display: 'none'
    }
  },
  radioSection: {
    position: 'relative',
    textAlign: 'center',

    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: 16,
    lineHeight: '104.5%',
    borderRadius: 8,
    border: '1px solid #DAE6E5',
    padding: '20px 0'
  },
  orDivider: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    '& span': {
      flex: 1,
      height: 1,
      border: '1px solid #DAE6E5'
    },
    '& div': {
      flex: 0.6,
      textAlign: 'center'
    }
  }
}));

export const useAutocompleteStyles = makeStyles(() => ({
  root: {
    width: '100%',
    background: 'rgba(255, 255, 255, 0.4)',
    border: '1px solid rgba(78, 76, 132, 0.8)',
    borderRadius: 8,
    '& .MuiInputBase-root': {
      padding: '0 24px',
      width: '100%'
    }
  },
  paper: {
    borderRadius: 24,
    boxShadow:
      '0px 8px 8px -4px rgba(86, 101, 123, 0.15), 0px 24px 35px -1px rgba(42, 52, 65, 0.12)'
  },
  listbox: {
    borderRadius: 20,
    background: 'linear-gradient(0deg, #FFFFFF, #FFFFFF), #17172D',
    border: '1px solid #DEE7DA',
    padding: 0
  },
  option: {
    padding: 0,
    borderBottom: '1px solid #00000021',
    '&:last-child': {
      borderBottom: 'none'
    }
  },
  input: {
    height: 58,
    boxSizing: 'border-box',

    fontStyle: 'normal',
    fontWeight: 60,
    fontSize: '16px',
    lineHeight: '160%',
    color: '#7E7D95'
  }
}));
