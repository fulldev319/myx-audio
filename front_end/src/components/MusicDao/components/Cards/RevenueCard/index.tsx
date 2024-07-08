import React from 'react';
import Box from 'shared/ui-kit/Box';
import { revenueCardStyles } from './index.styles';

const RevenueCard = ({
  isStaking = true,
  type = 0,
  value = '',
  description = '',
  tag = ''
}) => {
  const classes = revenueCardStyles();

  const getBackground = () => {
    if (isStaking) {
      switch (type) {
        case 0:
          return 'radial-gradient(143.09% 111.42% at 37.31% 22.83%, #725EC9 0%, #3D23AE 97.88%)';
        case 1:
          return 'radial-gradient(91.13% 92.55% at 37.92% 21.27%, #A0D800 0%, #0DCC9E 85.27%)';
        default:
          return 'radial-gradient(104.79% 106.41% at 36.85% 15.84%, #16D2DE 0%, #5A7FFF 94.75%)';
      }
    } else {
      switch (type) {
        case 0:
          return 'radial-gradient(91.13% 92.55% at 37.92% 21.27%, #A0D800 0%, #0DCC9E 85.27%)';
        case 1:
          return 'radial-gradient(114.52% 84.31% at 37.31% 22.83%, #70A8DC 0%, #5653F7 97.88%)';
        default:
          return 'radial-gradient(104.79% 106.41% at 36.85% 15.84%, #56E9C1 0%, #218267 94.75%)';
      }
    }
  };

  const getTokenImages = () => {
    if (isStaking) {
      switch (type) {
        case 0:
          return (
            <img src={require('assets/tokenImages/USDT.webp')} height="44px" />
          );
        case 1:
          return (
            <img
              src={require('assets/musicDAOImages/potions_3.webp')}
              height="44px"
            />
          );
        default:
          return (
            <img
              src={require('assets/musicDAOImages/reward.webp')}
              height="44px"
            />
          );
      }
    } else {
      switch (type) {
        case 0:
          return (
            <img
              src={require('assets/musicDAOImages/potions_3.webp')}
              height="44px"
            />
          );
        case 1:
          return (
            <img
              src={require('assets/musicDAOImages/product_1.webp')}
              height="44px"
            />
          );
        default:
          return (
            <img
              src={require('assets/musicDAOImages/potions_5.webp')}
              height="44px"
            />
          );
      }
    }
  };

  return (
    <Box className={classes.container} style={{ background: getBackground() }}>
      {getTokenImages()}
      <Box className={classes.header1} mt={1}>
        {value}
      </Box>
      <Box display="flex">
        <Box className={classes.header3}>{tag}</Box>
      </Box>
      <Box className={classes.header2} mt={4}>
        {description}
      </Box>
    </Box>
  );
};

export default RevenueCard;
