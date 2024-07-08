import React from 'react';

import Tooltip from '@material-ui/core/Tooltip';
import Fade from '@material-ui/core/Fade';
import makeStyles from '@material-ui/core/styles/makeStyles';

type TooltipWithButtonProps = {
  btnTitle?: string;
  btnDescription?: string;
  tooltip?: string;
  style?: any;
  overriedClasses?: string;
  isActive?: boolean;
  reference?: any;
  theme?: 'dark' | 'light';
};

const useStyles = makeStyles((theme) => ({
  btnNormal: {},
  btnNormalActive: {
    background: '#2D3047'
  },
  btnDark: {},
  btnDarkActive: {
    background: '#2D3047'
  },

  titleNormal: {
    color: '#181818',
    fontWeight: 600,
    fontSize: 14,
    lineHeight: '104.5%'
  },
  titleNormalActive: {
    color: '#fff',
    fontWeight: 600,
    fontSize: 14,
    lineHeight: '104.5%'
  },
  titleDark: {
    color: '#181818',
    fontWeight: 600,
    fontSize: 14,
    lineHeight: '104.5%'
  },
  titleDarkActive: {
    color: '#fff',
    fontWeight: 600,
    fontSize: 14,
    lineHeight: '104.5%'
  },

  descNormal: {
    color: '#7E7D95',
    fontWeight: 500,
    fontSize: 12,
    lineHeight: '104.5%'
  },
  descNormalActive: {
    color: 'rgba(255,255,255,0.6)',
    fontWeight: 500,
    fontSize: 12,
    lineHeight: '104.5%'
  },
  descDark: {
    color: '#7E7D95',
    fontWeight: 500,
    fontSize: 12,
    lineHeight: '104.5%'
  },
  descDarkActive: {
    color: 'rgba(255,255,255,0.6)',
    fontWeight: 500,
    fontSize: 12,
    lineHeight: '104.5%'
  },

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
  }
}));

export default function CustomButtonWithTooltip({
  btnTitle = '',
  btnDescription = '',
  tooltip,
  style,
  overriedClasses,
  isActive = false,
  reference,
  theme = 'dark'
}: TooltipWithButtonProps) {
  const classes = useStyles();
  return (
    <>
      {tooltip != undefined && tooltip != null ? (
        <Tooltip
          TransitionComponent={Fade}
          TransitionProps={{ timeout: 600 }}
          arrow
          title={tooltip}
          classes={{ popper: classes.myTooltip }}
        >
          <div
            className={`${overriedClasses ? overriedClasses : ''}
                ${
                  theme === 'dark'
                    ? isActive
                      ? classes.btnDarkActive
                      : classes.btnDark
                    : isActive
                    ? classes.btnNormal
                    : classes.btnNormalActive
                }`}
            style={style}
          >
            <div
              className={
                theme === 'dark'
                  ? isActive
                    ? classes.titleDarkActive
                    : classes.titleDark
                  : isActive
                  ? classes.titleNormal
                  : classes.titleNormalActive
              }
            >
              {btnTitle}
            </div>
            <div
              className={
                theme === 'dark'
                  ? isActive
                    ? classes.descDarkActive
                    : classes.descDark
                  : isActive
                  ? classes.descNormal
                  : classes.descNormalActive
              }
            >
              {btnDescription}
            </div>
          </div>
        </Tooltip>
      ) : (
        <div
          className={
            overriedClasses
              ? overriedClasses
              : theme === 'dark'
              ? isActive
                ? classes.btnDarkActive
                : classes.btnDark
              : isActive
              ? classes.btnNormal
              : classes.btnNormalActive
          }
          style={style}
        >
          <div
            className={
              theme === 'dark'
                ? isActive
                  ? classes.titleDarkActive
                  : classes.titleDark
                : isActive
                ? classes.titleNormal
                : classes.titleNormalActive
            }
          >
            {btnTitle}
          </div>
          <div
            className={
              theme === 'dark'
                ? isActive
                  ? classes.descDarkActive
                  : classes.descDark
                : isActive
                ? classes.descNormal
                : classes.descNormalActive
            }
          >
            {btnDescription}
          </div>
        </div>
      )}
    </>
  );
}
