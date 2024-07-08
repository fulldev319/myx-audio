import { makeStyles } from '@material-ui/core/styles';

export const newWallPostModalStyles = makeStyles((theme) => ({
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
    fontSize: '15px',
    fontWeight: 500,
    color: '#54658F'
  },
  hashTagBox: {
    padding: theme.spacing(1),
    background: 'rgba(218, 230, 229, 0.4)',
    borderRadius: theme.spacing(1),
    border: '1px solid #DADADB',
    '& > div:last-child': {
      background: 'transparent',
      border: 'none'
    }
  },
  tagBox: {
    padding: `${theme.spacing(0.5)}px ${theme.spacing(1)}px`,
    borderRadius: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    background: '#DAE6E5',
    fontSize: 10
  },
  controlBox: {
    background: '#DAE6E5',
    borderRadius: theme.spacing(4),
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`
  },
  datepicker: {
    width: '100%',
    '& .MuiOutlinedInput-adornedEnd': {
      paddingRight: 0,
      '& .MuiInputAdornment-positionEnd': {
        marginLeft: 0
      }
    }
  },
  hashtagsRow: {
    marginTop: 10,
    display: 'flex',
    alignItems: 'center',
    marginRight: 20
  },
  hashtagPill: {
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 14.5,
    textAlign: 'center',
    color: '#949bab',
    padding: '6px 12px',
    borderRadius: 36,
    border: '1px solid #949bab',
    marginRight: 6,
    cursor: 'pointer'
  }
}));
