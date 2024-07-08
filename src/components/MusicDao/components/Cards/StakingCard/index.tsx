import React from 'react';
import Box from 'shared/ui-kit/Box';
import { stakingCardStyles } from './index.styles';
import { Avatar } from 'shared/ui-kit';
import { CraneIcon, GoldCraneIcon, GreenCraneIcon } from '../../Icons/SvgIcons';

export default function StakingCard({ user, rank = 1, type = 0 }) {
  const classes = stakingCardStyles();

  const getBackgroundGradient = (rank) => {
    if (type === 0) {
      return 'linear-gradient(180deg, #FAFEFF 26.72%, rgba(255, 255, 255, 0) 100%)';
    }
    if (type === 1) {
      if (rank === 1) {
        return 'linear-gradient(180deg, #FFAE11 26.72%, #FFFBE7 100%)';
      } else if (rank === 2) {
        return 'linear-gradient(180deg, #99B4FB 26.72%, rgba(177, 185, 255, 0.3) 100%)';
      } else {
        return 'linear-gradient(180deg, #A5E9FF 26.72%, rgba(217, 248, 255, 0.31) 100%)';
      }
    } else {
      if (rank === 1) {
        return 'linear-gradient(180deg, #83E781 26.72%, #F3FFE7 100%)';
      } else if (rank === 2) {
        return 'linear-gradient(180deg, #FBF799 26.72%, rgba(255, 247, 177, 0.3) 100%)';
      } else {
        return 'linear-gradient(180deg, #CD7AFF 26.72%, rgba(220, 217, 255, 0.31) 100%)';
      }
    }
  };

  const getRankBackground = () => {
    if (type !== 2) {
      if (rank === 1) {
        return '#FF6712';
      } else if (rank === 2) {
        return '#376AEE';
      } else {
        return '#37C2EE';
      }
    } else {
      if (rank === 1) {
        return '#00CC39';
      } else if (rank === 2) {
        return '#F7C000';
      } else {
        return '#7C37EE';
      }
    }
  };

  return (
    <Box textAlign="center">
      {rank === 1 &&
        (type === 0 ? (
          <CraneIcon />
        ) : type === 1 ? (
          <GoldCraneIcon />
        ) : (
          <GreenCraneIcon />
        ))}
      <Box
        style={{
          padding: type !== 0 && rank === 1 ? 8 : 0,
          border:
            type !== 0 && rank === 1
              ? '1px solid rgba(255, 142, 60, 0.2)'
              : 'none',
          borderRadius: 104
        }}
        mt={rank === 1 ? -1 : 0}
      >
        <Box
          className={classes.container}
          style={{ background: getBackgroundGradient(rank) }}
        >
          <Box className={classes.imageBox}>
            <Box
              className={classes.rankBox}
              style={{ backgroundColor: getRankBackground() }}
            >
              {rank}
            </Box>
            <img
              src={require('assets/backgrounds/music_art.webp')}
              className={classes.img}
            />
            <Box className={classes.avatarBox}>
              <Avatar size="medium" url={user.url} />
            </Box>
          </Box>
          <Box mt={2} className={classes.header1}>
            {user.name}
          </Box>
          <Box mt={2} className={classes.header3}>
            {`Owned by @${user.name}`}
          </Box>
          <Box className={classes.traxBox} mt={rank === 1 ? 3 : 2}>
            <Box className={classes.header2}>{user.trax} TRAX</Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
