import { makeStyles } from '@material-ui/core/styles';

export const newVoteModalStyles = makeStyles((theme) => ({
  contentBox: {
    padding: theme.spacing(1)
  },
  flexBox: {
    display: 'flex',
    alignItems: 'center'
  },
  title: {
    fontSize: '22px',
    fontWeight: 800
  },
  header1: {
    fontSize: '16px',
    fontWeight: 600
  },
  header2: {
    fontSize: '14px',
    color: '#54658F',
    fontWeight: 600
  },
  controlBox: {
    display: 'flex',
    alignItems: 'center',
    background: '#DAE6E5',
    borderRadius: theme.spacing(4),
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    height: 51
  },
  datepicker: {
    width: '100%',
    margin: 0,
    '& .MuiOutlinedInput-adornedEnd': {
      paddingRight: 0,
      '& .MuiInputAdornment-positionEnd': {
        marginLeft: 0
      }
    },
    '& .MuiInputBase-input': {
      padding: 0
    }
  },
  addAnswerBtn: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px 32px !important',
    border: '1px solid #65CB63 !important',
    borderRadius: '60px !important',
    marginTop: 36,
    fontSize: '14px !important'
  }
}));
