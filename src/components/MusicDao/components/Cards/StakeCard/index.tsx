import React from 'react';
import Moment from 'react-moment';
import { SecondaryButton } from 'shared/ui-kit';
import Box from 'shared/ui-kit/Box';
import { historyCardStyles } from './index.styles';
import { IMediaStaking } from 'shared/types/Stake';

interface IStakeCardProps {
  item: IMediaStaking;
  isRepaid?: boolean;
  handleClickUnstake: any;
  isActiveCard?: boolean;
}

const StakeCard: React.FC<IStakeCardProps> = ({
  item,
  isRepaid = false,
  handleClickUnstake,
  isActiveCard = true
}) => {
  const classes = historyCardStyles(isActiveCard);

  const getHoursForAmount = () => {
    return Math.floor(item.Amount * 0.3);
  };

  return (
    <Box className={classes.card}>
      <Box className={classes.header1} ml={3}>
        Staking Position
      </Box>
      <Box className={classes.flexBox}>
        <Box
          className={classes.header2}
          color="2D3047"
          style={{ opacity: 0.7 }}
        >
          Pool
        </Box>
        <Box
          className={classes.header2_1}
          justifyContent="flex-start"
          style={{ display: 'flex', alignItems: 'center' }}
        >
          {item.TokenSymbol}
          <span style={{ marginLeft: '8px' }}>
            {item.TokenSymbol && (
              <img
                src={require(`assets/tokenImages/${item.TokenSymbol}.webp`)}
                width="48px"
              />
            )}
          </span>
        </Box>
      </Box>
      <Box className={classes.flexBox}>
        <Box
          className={classes.header2}
          color="2D3047"
          style={{ opacity: 0.7 }}
        >
          Hours of music left
        </Box>
        <Box className={classes.header2_1}>{getHoursForAmount()} hrs</Box>
      </Box>
      <Box className={classes.flexBox}>
        <Box
          className={classes.header2}
          color="2D3047"
          style={{ opacity: 0.7 }}
        >
          Amount
        </Box>
        <Box className={classes.header2_1}>{item.Amount} TRAX</Box>
      </Box>
      <Box className={!isRepaid ? classes.flexBox : classes.flexBox_1}>
        <Box
          className={classes.header2}
          color="2D3047"
          style={{ opacity: 0.7 }}
        >
          Date
        </Box>
        <Moment className={classes.header2_1} format="DD MMM YYYY hh:mm a">
          {item.CreationDate}
        </Moment>
      </Box>
      {!isRepaid && (
        <Box display="flex" justifyContent="center" mt={4} px={4}>
          <SecondaryButton
            size="medium"
            onClick={() => handleClickUnstake(item)}
            isRounded
            style={{
              width: '100%',
              backgroundColor: isActiveCard ? 'transprent' : '#F4F8FC',
              fontSize: 14,
              fontWeight: 600,
              color: '#2D3047',
              border: '1px solid #00000022'
            }}
          >
            Unstake
          </SecondaryButton>
        </Box>
      )}
    </Box>
  );
};

export default StakeCard;
