import React from 'react';
import Box from 'shared/ui-kit/Box';
import { bopsCardStyles } from './index.styles';

export const BopsCard = ({ data }) => {
  const classes = bopsCardStyles();

  const background = React.useMemo(() => {
    switch (data.level) {
      case 1:
        return '#B7FFB0';
      case 2:
        return 'linear-gradient(0deg, #FFCFBA, #FFCFBA), #FFFBF2';
      case 3:
        return '#9483FF';
      default:
        return '#F2FBFF';
    }
  }, [data]);

  const color = React.useMemo(() => {
    switch (data.level) {
      case 1:
        return '#23B000';
      case 2:
        return '#E27A00';
      case 3:
        return '#5200D7';
      default:
        return '#32C0FF';
    }
  }, [data]);

  return (
    <Box className={classes.container} style={{ background: background }}>
      <Box className={classes.content}>
        <Box p={2} style={{ borderBottom: '1.5px solid #4A4A4A22' }}>
          <Box
            className={classes.header1}
            textAlign="center"
            color={color}
          >{`Level ${data.level} Bops`}</Box>
        </Box>
        <Box p={2}>
          <Box className={classes.header2}>55</Box>
          <Box className={classes.header3} mt={1}>
            Number of Bops lvl
          </Box>
          <Box className={classes.header2} mt={2}>
            55
          </Box>
          <Box className={classes.header3} mt={1}>
            Number of Bops lvl
          </Box>
          <Box className={classes.header2} mt={2}>
            55
          </Box>
          <Box className={classes.header3} mt={1}>
            Number of Bops lvl
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
