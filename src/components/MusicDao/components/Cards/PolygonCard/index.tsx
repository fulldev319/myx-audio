import React from 'react';
import Box from 'shared/ui-kit/Box';
import { polygonCardStyles } from './index.styles';

const PolygonCard = ({
  isStaking = true,
  type = 0,
  value = '',
  description = ''
}) => {
  const classes = polygonCardStyles();

  const getBackgroundImage = () => {
    if (isStaking) {
      switch (type) {
        case 0:
          return 'rounded_polygon';
        case 1:
        case 3:
          return 'rounded_polygon_green';
        default:
          return 'rounded_polygon_blue';
      }
    } else {
      return 'rounded_polygon_grey';
    }
  };

  const getTokenImages = () => {
    if (isStaking) {
      switch (type) {
        case 0:
          return (
            <img
              src={require('assets/musicDAOImages/music1.webp')}
              width="32px"
            />
          );
        case 1:
          return (
            <Box
              className={classes.circleBox}
              style={{ background: '#65CB63' }}
            >
              <img src={require('assets/tokenImages/USDT.webp')} width="32px" />
            </Box>
          );
        case 2:
          return (
            <Box
              className={classes.circleBox}
              style={{ background: '#E5E5F8' }}
              pr={0.5}
            >
              <img
                src={require('assets/musicDAOImages/reward.webp')}
                width="40px"
                style={{ marginLeft: '-2px', marginTop: '2px' }}
              />
            </Box>
          );
        default:
          return (
            <Box
              className={classes.circleBox}
              style={{ background: '#65CB63' }}
            >
              <img
                src={require('assets/musicDAOImages/beats.webp')}
                width="32px"
              />
            </Box>
          );
      }
    } else {
      switch (type) {
        case 0:
          return (
            <Box
              className={classes.circleBox}
              style={{ background: '#F8F0E5' }}
            >
              <img
                src={require('assets/musicDAOImages/music_play.webp')}
                width="32px"
              />
            </Box>
          );
        case 1:
          return (
            <Box
              className={classes.circleBox}
              style={{ background: '#E5F4F8' }}
            >
              <img
                src={require('assets/musicDAOImages/music_arrow.webp')}
                width="32px"
              />
            </Box>
          );
        default:
          return (
            <Box className={classes.circleBox}>
              <img
                src={require('assets/musicDAOImages/music_fruit.webp')}
                width="32px"
              />
            </Box>
          );
      }
    }
  };

  return (
    <Box className={classes.container} mx={2}>
      <img
        src={require(`assets/musicDAOImages/${getBackgroundImage()}.svg`)}
        width="100%"
        height="100%"
      />
      <Box className={classes.content} zIndex={1}>
        {getTokenImages()}
        <Box className={classes.header1} mt={2}>
          {value}
        </Box>
        <Box className={classes.header2} mt={2}>
          {description}
        </Box>
      </Box>
    </Box>
  );
};

export default PolygonCard;
