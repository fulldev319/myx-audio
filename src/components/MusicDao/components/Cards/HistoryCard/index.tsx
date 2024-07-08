import React, { useState, useEffect } from 'react';

import { formatDateDefault } from 'shared/helpers';
import { SecondaryButton } from 'shared/ui-kit';
import Box from 'shared/ui-kit/Box';
import { historyCardStyles } from './index.styles';

export default function HistoryCard({
  item,
  isRepaid = false,
  unStake,
  isActiveCard = true
}) {
  const classes = historyCardStyles(isActiveCard);

  const [endingTime, setEndingTime] = useState<any>();

  useEffect(() => {
    const timerId = setInterval(() => {
      const now = new Date();
      let delta = Math.floor(item.endTime - now.getTime() / 1000);
      if (delta < 0) {
        setEndingTime({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        });
        clearInterval(timerId);
      } else {
        let days = Math.floor(delta / 86400);
        delta -= days * 86400;

        // calculate (and subtract) whole hours
        let hours = Math.floor(delta / 3600) % 24;
        delta -= hours * 3600;

        // calculate (and subtract) whole minutes
        let minutes = Math.floor(delta / 60) % 60;
        delta -= minutes * 60;

        // what's left is seconds
        let seconds = delta % 60;
        setEndingTime({
          days,
          hours,
          minutes,
          seconds
        });
      }
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

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
          {item.tokenName}
          <span style={{ marginLeft: '8px' }}>
            <img
              src={require(`assets/tokenImages/${item.tokenName}.webp`)}
              width="28px"
              height="28px"
            />
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
        <Box className={classes.header2_1}>
          {endingTime && (
            <span>
              {endingTime.hours > 0 && (
                <span>{String(endingTime.hours).padStart(2, '0')}h</span>
              )}
              &nbsp;
              {endingTime.minutes > 0 && (
                <span>{String(endingTime.minutes).padStart(2, '0')}m</span>
              )}
              &nbsp;
              <span>{String(endingTime.seconds).padStart(2, '0')}s</span>
            </span>
          )}
        </Box>
      </Box>
      <Box className={classes.flexBox}>
        <Box
          className={classes.header2}
          color="2D3047"
          style={{ opacity: 0.7 }}
        >
          Amount
        </Box>
        <Box className={classes.header2_1}>${item.amount}</Box>
      </Box>
      <Box className={!isRepaid ? classes.flexBox : classes.flexBox_1}>
        <Box
          className={classes.header2}
          color="2D3047"
          style={{ opacity: 0.7 }}
        >
          Date
        </Box>
        <Box className={classes.header2_1}>{formatDateDefault(item.date)}</Box>
      </Box>
      {!isRepaid && (
        <Box display="flex" justifyContent="center" mt={4} px={4}>
          <SecondaryButton
            size="medium"
            onClick={() => unStake(item)}
            isRounded
            style={{
              width: '100%',
              background: isActiveCard
                ? '#ffffff'
                : 'linear-gradient(0deg, #F4F8FC, #F4F8FC), #F0F6FB',
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
}
