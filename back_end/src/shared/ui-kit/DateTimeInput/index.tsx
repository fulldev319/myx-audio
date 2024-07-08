import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

const calendarIcon = require('assets/icons/calendar_icon.webp');
const calendarIconWhite = require('assets/icons/calendar_icon_white.webp');

const useStyles = makeStyles((theme) => ({
  datePickerInput: {
    height: '100%',
    padding: '10px 16px',
    borderRadius: 8,
    border: '1px solid #e0e4f3',
    backgroundColor: '#f7f9fe',
    color: '#181818',
    fontSize: 14,
    fontWeight: 400,
    '& .MuiInputAdornment-root': {
      '& .MuiButtonBase-root': {
        padding: 0
      }
    }
  },
  datePickerInputDark: {
    padding: '14px 23px',
    borderRadius: 8,
    background: '#DAE6E5',
    color: '#2D3047',
    fontSize: 14,
    fontWeight: 500,
    height: '51px',
    '& .MuiInputAdornment-root': {
      '& .MuiButtonBase-root': {
        padding: 0
      }
    }
  },
  datePickerModal: {
    '& .MuiPickersModal-dialogRoot': {
      borderRadius: 16,
      '& .MuiPickersBasePicker-container': {
        '& .MuiToolbar-root': {
          background: 'linear-gradient(97.4deg, #29E8DC 14.43%, #03EAA5 79.45%)'
        },
        '& .MuiPickersBasePicker-pickerView': {
          '& .MuiPickersDay-daySelected': {
            background:
              'linear-gradient(97.4deg, #29E8DC 14.43%, #03EAA5 79.45%)'
          }
        }
      },
      '& .MuiDialogActions-root': {
        '& .MuiButtonBase-root': {
          color: '#03EAA5'
        }
      }
    }
  },
  datePickerInputMusicDao: {
    padding: '11px 19px',
    borderRadius: '8px',
    border: '1px solid #DADADB',
    background: 'rgba(218, 230, 229, 0.4)',
    color: 'rgba(45, 48, 71, 0.7)',
    fontSize: 14,
    fontWeight: 500,
    height: '45px',
    '& .MuiInputAdornment-root': {
      '& .MuiButtonBase-root': {
        padding: 0
      }
    }
  },
  datePickerModalDark: {
    '& .MuiPickersModal-dialogRoot': {
      borderRadius: 0,
      '& .MuiPickersBasePicker-container': {
        '& .MuiToolbar-root': {
          background:
            'linear-gradient(102.54deg, #00BFFF -9.09%, #8D2EFF 56.17%, #FF00C1 112.56%)'
        },
        '& .MuiPickersBasePicker-pickerView': {
          '& .MuiPickersDay-daySelected': {
            background:
              'linear-gradient(102.54deg, #00BFFF -9.09%, #8D2EFF 56.17%, #FF00C1 112.56%)'
          }
        }
      },
      '& .MuiDialogActions-root': {
        '& .MuiButtonBase-root': {
          color: '#03EAA5'
        }
      }
    }
  }
}));

export const DateInput = ({
  width,
  height,
  customStyle,
  format,
  theme,
  ...props
}: any) => {
  const classes = useStyles();

  const rootStyle = customStyle ?? {};

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
        {...props}
        InputProps={{
          disableUnderline: true,
          className:
            theme === 'dark'
              ? classes.datePickerInputDark
              : theme === 'music dao'
              ? classes.datePickerInputMusicDao
              : classes.datePickerInput
        }}
        DialogProps={{
          className:
            theme === 'dark'
              ? classes.datePickerModalDark
              : classes.datePickerModal
        }}
        format={format || 'MM.dd.yyyy'}
        keyboardIcon={<img src={calendarIcon} alt={'calendar'} />}
        style={{
          color: '#000',
          width: width || '100%',
          height: height || 'auto',
          ...rootStyle
        }}
      />
    </MuiPickersUtilsProvider>
  );
};
