import React from 'react';

import Input from '@material-ui/core/Input';
import Tooltip from '@material-ui/core/Tooltip';
import Fade from '@material-ui/core/Fade';
import makeStyles from '@material-ui/core/styles/makeStyles';

import { ReactComponent as InfoIcon } from 'assets/icons/info.svg';
import { DateInput } from '../DateTimeInput';
import { Color } from 'shared/constants/const';
const calendarIcon = require('assets/icons/calendar_icon.webp');

type TooltipWithInputProps = {
  labelName?: string;
  labelSuffix?: string;
  tooltip?: string;
  inputValue?: string | number;
  placeHolder?: string;
  required?: boolean;
  type?: string;
  onInputValueChange?: any;
  disabled?: boolean;
  maxValue?: string | number;
  minValue?: string | number;
  style?: any;
  overriedClasses?: string;
  hidden?: boolean;
  reference?: any;
  onKeyDown?: any;
  autoComplete?: string;
  accept?: string;
  theme?: 'dark' | 'light' | 'music dao' | 'music dao pod' | 'player search';
  endAdornment?: any;
  transparent?: boolean;
  minDate?: number;
  multiline?: boolean;
  referenceValue?: 'value' | 'object';
};

const useStyles = makeStyles((theme) => ({
  myTooltip: {
    '& .MuiTooltip-tooltip': {
      background: 'rgba(0, 0, 0, 0.8)',
      color: '#fff',
      fontSize: 12,
      lineHeight: '130%'
    },
    '& .MuiTooltip-arrow': {
      color: 'rgba(0, 0, 0, 0.8)'
    }
  },

  labelContainer: {
    display: 'flex',
    fontSize: '14px',
    fontStyle: 'normal',
    alignItems: 'center',
    fontWeight: 'normal',
    color: '#707582',

    '& svg': {
      height: '14px',
      width: '14px',
      marginTop: -theme.spacing(1),
      marginLeft: theme.spacing(0.5)
    }
  },
  labelContainerDark: {
    color: 'white',
    display: 'flex',
    fontSize: '14px',
    fontStyle: 'normal',
    alignItems: 'center',
    fontWeight: 'normal',
    '& svg': {
      height: '14px',
      width: '14px',
      marginLeft: '4px'
    }
  },
  labelContainerMusicDao: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '16px',
    fontStyle: 'normal',
    alignItems: 'center',
    fontWeight: 600,
    color: Color.MusicDAODark,

    '& svg': {
      height: '14px',
      width: '14px'
    }
  },
  labelContainerMusicPix: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    fontStyle: 'normal',
    alignItems: 'center',
    fontWeight: 400,
    color: '#1A1B1C',
    '& svg': {
      height: '14px',
      width: '14px'
    }
  },
  transparent: {
    background: 'transaprent !important',
    border: 'none !important'
  },
  inputBox: {
    color: '#181818',
    width: '100%',
    border: '1px solid #E0E4F3',
    height: '46px',
    padding: '11.5px 18px',
    fontSize: '14px',
    background: '#F7F9FE',
    boxSizing: 'border-box',
    marginTop: theme.spacing(1),
    borderRadius: '6px',
    outline: 'none',
    marginBottom: theme.spacing(2),
    '& input': {
      border: 'none',
      background: 'transparent',
      margin: 0,
      padding: 0
    },
    '& *': {
      color: '#181818'
    },
    [theme.breakpoints.down('xs')]: {
      padding: '11.5px 8px'
    }
  },
  inputBoxDark: {
    height: '56px',
    maxHeight: '56px',
    padding: '19px 16px',
    fontSize: '14px',
    color: 'white',
    marginTop: theme.spacing(1),
    outline: 'none',
    borderRadius: 6,
    width: '100%',
    border: 'none',
    background: 'rgba(95, 93, 93, 0.3)',
    '& input': {
      border: 'none',
      background: 'transparent',
      margin: 0,
      padding: 0
    },
    '& *': {
      color: 'white'
    }
  },
  inputBoxMusicDao: {
    color: '#2D3047',
    width: '100%',
    border: '1px solid #DADADB',
    height: '45px',
    padding: '11px 19px',
    fontSize: '14px',
    background: '#F2F4FB',
    boxSizing: 'border-box',
    marginTop: theme.spacing(1),
    borderRadius: '8px',
    outline: 'none',
    fontWeight: 500,
    '& input': {
      color: '#2D3047',
      fontWeight: 500,
      border: 'none',
      background: 'transparent',
      margin: 0,
      padding: 0
    },
    '& *': {
      color: 'rgba(45, 48, 71, 0.7)',
      fontWeight: 500
    }
  },
  inputBoxPlayerSearch: {
    color: '#2D3047',
    width: '100%',
    border: '1px solid #DADADB',
    height: '45px',
    padding: '11px 19px',
    fontSize: '14px',
    background: 'rgba(218, 230, 229, 0.4)',
    boxSizing: 'border-box',
    marginTop: theme.spacing(1),
    borderRadius: '8px',
    outline: 'none',
    fontWeight: 500,
    '& input': {
      color: '#fff',
      fontWeight: 500,
      border: 'none',
      background: 'transparent',
      margin: 0,
      padding: 0
    },
    '& *': {
      color: 'rgba(45, 48, 71, 0.7)',
      fontWeight: 500
    }
  },
  inputBoxMusicPix: {
    color: '#A4A4A4',
    width: '100%',
    border: '1px solid #181818',
    height: '37px',
    padding: '11px 19px',
    fontSize: '14px',
    background: 'transparent',
    boxSizing: 'border-box',
    marginTop: theme.spacing(1),
    borderRadius: '8px',
    outline: 'none',
    fontWeight: 400,
    '& input': {
      border: 'none',
      background: '#F7F9FE',
      margin: 0,
      padding: 0
    },
    '& *': {
      color: 'rgba(45, 48, 71, 0.7)',
      fontWeight: 400
    }
  },
  inputArea: {
    height: 'auto',
    resize: 'vertical',
    maxHeight: 'none',
    minHeight: '96px',
    '&::-webkit-scrollbar': {
      width: 10
    },
    '&::-webkit-scrollbar-thumb': {
      background: 'grey'
    }
  }
}));

export default function InputWithLabelAndTooltip({
  labelName,
  labelSuffix = '', // required - star symbol, other text
  tooltip,
  inputValue = '',
  placeHolder = '',
  type = 'textarea',
  onInputValueChange,
  required = false,
  disabled = false,
  maxValue,
  minValue = '0.01',
  style,
  overriedClasses,
  hidden = false,
  reference,
  onKeyDown,
  autoComplete = 'off',
  accept,
  theme = 'light',
  endAdornment,
  transparent,
  minDate = 0,
  multiline = false,
  referenceValue = 'value'
}: TooltipWithInputProps) {
  const classes = useStyles();
  return (
    <>
      {labelName && (
        <label
          className={
            theme === 'dark'
              ? classes.labelContainerDark
              : theme === 'music dao' || theme === 'music dao pod'
              ? classes.labelContainerMusicDao
              : classes.labelContainer
          }
        >
          <div style={{ position: 'relative' }}>
            {labelName}{' '}
            <span style={{ fontStyle: 'italic' }}>
              {labelSuffix && labelSuffix.length > 0 && labelSuffix !== '*'
                ? labelSuffix
                : ''}
            </span>
            {labelSuffix && labelSuffix === '*' && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  right: -10,
                  color: '#F43E5F'
                }}
              >
                {labelSuffix}
              </div>
            )}
          </div>
          {tooltip != undefined && tooltip != null && (
            <Tooltip
              TransitionComponent={Fade}
              TransitionProps={{ timeout: 600 }}
              arrow
              title={tooltip}
              classes={{ popper: classes.myTooltip }}
            >
              {theme !== 'music dao' ? (
                <InfoIcon
                  style={{ color: theme === 'dark' ? 'white' : 'grey' }}
                />
              ) : (
                <img
                  src={require('assets/icons/info_music_dao.webp')}
                  alt="info"
                />
              )}
            </Tooltip>
          )}
        </label>
      )}
      {type === 'text' || type === 'password' ? (
        <Input
          disableUnderline
          endAdornment={endAdornment}
          className={`${
            overriedClasses
              ? overriedClasses
              : theme === 'dark'
              ? classes.inputBoxDark
              : theme === 'music dao' || theme === 'music dao pod'
              ? classes.inputBoxMusicDao
              : theme === 'player search'
              ? classes.inputBoxPlayerSearch
              : classes.inputBox
          } ${transparent && !overriedClasses ? classes.transparent : ''}`}
          value={inputValue}
          onChange={(e) => (onInputValueChange ? onInputValueChange(e) : null)}
          required={required}
          type={type}
          placeholder={placeHolder}
          disabled={disabled}
          hidden={hidden}
          style={style ?? {}}
          inputRef={reference}
          onKeyDown={(e) => (onKeyDown ? onKeyDown(e) : null)}
          autoComplete={autoComplete}
          multiline={multiline}
        />
      ) : type === 'number' ? (
        <Input
          disableUnderline
          endAdornment={endAdornment}
          className={`${
            overriedClasses
              ? overriedClasses
              : theme === 'dark'
              ? classes.inputBoxDark
              : theme === 'music dao' || theme === 'music dao pod'
              ? classes.inputBoxMusicDao
              : classes.inputBox
          } ${transparent && !overriedClasses ? classes.transparent : ''}`}
          value={inputValue}
          onChange={(e) => (onInputValueChange ? onInputValueChange(e) : null)}
          required={required}
          type="number"
          inputProps={{
            min: minValue,
            max: maxValue
          }}
          placeholder={placeHolder}
          disabled={disabled}
          hidden={hidden}
          style={style ?? {}}
          inputRef={reference}
          onKeyDown={(e) => (onKeyDown ? onKeyDown(e) : null)}
        />
      ) : type === 'euro-number' ? (
        <Input
          disableUnderline
          endAdornment={endAdornment}
          className={`${
            overriedClasses
              ? overriedClasses
              : theme === 'dark'
              ? classes.inputBoxDark
              : theme === 'music dao' || theme === 'music dao pod'
              ? classes.inputBoxMusicDao
              : classes.inputBox
          } ${transparent && !overriedClasses ? classes.transparent : ''}`}
          value={inputValue}
          onChange={(e) => {
            if (!onInputValueChange) return;
            const targetValue = e.target.value.replace(',', '.');
            if (!targetValue || !isNaN(Number(targetValue))) {
              onInputValueChange(targetValue);
            }
          }}
          required={required}
          type="text"
          placeholder={placeHolder}
          disabled={disabled}
          hidden={hidden}
          style={style ?? {}}
          inputRef={reference}
          onKeyDown={(e) => (onKeyDown ? onKeyDown(e) : null)}
        />
      ) : type === 'file' ? (
        <input
          className={`${
            overriedClasses
              ? overriedClasses
              : theme === 'dark'
              ? classes.inputBoxDark
              : theme === 'music dao' || theme === 'music dao pod'
              ? classes.inputBoxMusicDao
              : classes.inputBox
          } ${transparent && !overriedClasses ? classes.transparent : ''}`}
          onChange={(e) => (onInputValueChange ? onInputValueChange(e) : null)}
          hidden={hidden}
          type="file"
          style={style ?? {}}
          ref={reference}
          onKeyDown={(e) => (onKeyDown ? onKeyDown(e) : null)}
          accept={accept}
          // endAdornment={endAdornment}
        />
      ) : type === 'date' ? (
        <DateInput
          theme={theme}
          minDate={minDate || new Date().setDate(new Date().getDate() + 1)}
          format="dd MMM yyyy"
          placeholder="Select date..."
          value={inputValue}
          onChange={onInputValueChange}
          keyboardIcon={
            <img
              className="iconCalendarCreatePod"
              src={calendarIcon}
              alt={'calendar'}
            />
          }
        />
      ) : (
        <textarea
          className={`${
            overriedClasses ??
            `${
              theme === 'dark'
                ? classes.inputBoxDark
                : theme === 'music dao' || theme === 'music dao pod'
                ? classes.inputBoxMusicDao
                : classes.inputBox
            } ${classes.inputArea}`
          }`}
          rows={style?.rows ? style.rows : 5}
          required
          onChange={(e) => (onInputValueChange ? onInputValueChange(e) : null)}
          placeholder={placeHolder}
          disabled={disabled}
          hidden={hidden}
          style={style ?? {}}
          ref={reference}
          value={inputValue}
          onKeyDown={(e) => (onKeyDown ? onKeyDown(e) : null)}
        />
      )}
    </>
  );
}
