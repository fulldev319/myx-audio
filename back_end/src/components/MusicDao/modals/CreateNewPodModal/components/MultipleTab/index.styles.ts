import { makeStyles } from '@material-ui/core/styles';
import { Color } from 'shared/ui-kit';

export const multipleTabStyles = makeStyles((theme) => ({
  title: {
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: '32px',
    lineHeight: '130%',
    color: '#2D3047',
    [theme.breakpoints.down('sm')]: {
      fontSize: 24
    }
  },
  input: {
    background: '#F0F5F5',
    borderRadius: 8,
    paddingLeft: 16,
    paddingRight: 16,
    width: '100%',
    '& .MuiInputBase-input': {
      height: 45,
      paddingTop: 0,
      paddingBottom: 0,

      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: '25px',
      lineHeight: '104.5%',
      color: '#707582'
    }
  },
  radioButton: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    border: '1px solid #DAE6E5',
    borderRadius: 8,
    '& div': {
      flex: 1,
      textAlign: 'center',
      padding: '30px 0',
      '&:first-child': {
        borderRight: '1px solid #DAE6E5'
      }
    },
    '& .MuiRadio-colorSecondary': {
      color: `${Color.MusicDAOBlue} !important`
    },
    '& .MuiFormControlLabel-label': {
      fontStyle: 'normal',
      fontWeight: 600,
      fontSize: '16px',
      lineHeight: '104.5%',
      color: '#2D3047',
      opacity: '0.9'
    }
  },
  tooltip: {
    '& svg': {
      color: 'grey',
      width: '14px',
      '& circle': {
        stroke: 'none',
        fill: '#DAE6E5'
      }
    }
  }
}));
