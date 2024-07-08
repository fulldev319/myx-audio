import React from 'react';

import Fade from '@material-ui/core/Fade';
import Tooltip from '@material-ui/core/Tooltip';
import makeStyles from '@material-ui/core/styles/makeStyles';

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
  }
}));

type InfoTooltipProps = {
  tooltip: string;
};

export const InfoTooltip = ({ tooltip }: InfoTooltipProps) => {
  const classes = useStyles();

  return (
    <Tooltip
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 600 }}
      arrow
      title={tooltip}
      classes={{ popper: classes.myTooltip }}
    >
      <img src={require('assets/icons/info_music_dao.webp')} alt="info" />
    </Tooltip>
  );
};
