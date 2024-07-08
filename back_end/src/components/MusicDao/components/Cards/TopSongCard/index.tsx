import React from 'react';
import { processImage } from 'shared/helpers';
import {
  getDefaultAvatar,
  getDefaultBGImage
} from 'shared/services/user/getUserAvatar';
import Avatar from 'shared/ui-kit/Avatar';
import Box from 'shared/ui-kit/Box';
import { topSongCardStyles } from './index.style';

const TopSongCard = ({ data, setSelected, isSelected = false }) => {
  const classes = topSongCardStyles();

  const imagePath = React.useMemo(() => {
    return processImage(data?.Image || data?.image) || getDefaultBGImage();
  }, [data]);

  return (
    <Box
      className={classes.container}
      style={{
        background: `url(${imagePath})`,
        backgroundSize: 'cover',
        border: isSelected ? '2px solid #65CB63' : 'none'
      }}
      onClick={() => setSelected && setSelected()}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box className={classes.avatarsBox}>
          {data?.artists?.map((artist, index) => (
            <Avatar
              size={index === 0 ? 40 : 30}
              image={processImage(artist.imageUrl) || getDefaultAvatar()}
              rounded
              bordered
              style={{ marginLeft: index === 0 ? 0 : -12 }}
            />
          ))}
        </Box>
        {data.genre && <Box className={classes.genreBox}>{data.genre}</Box>}
      </Box>
      {/* {isSelected && (
        <Box className={classes.playerButton}>
          <PlayerIcon />
        </Box>
      )} */}
    </Box>
  );
};

export default TopSongCard;

const PlayerIcon = () => (
  <svg
    width="27"
    height="33"
    viewBox="0 0 27 33"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g filter="url(#filter0_d_15558_8138)">
      <path
        d="M2.71094 1.95911C6.84903 10.238 6.91777 19.9671 2.89707 28.3036L2.71094 28.6896L24.0953 15.3243L2.71094 1.95911Z"
        fill="#F0F5F8"
      />
      <path
        d="M2.71094 1.95911C6.84903 10.238 6.91777 19.9671 2.89707 28.3036L2.71094 28.6896L24.0953 15.3243L2.71094 1.95911Z"
        fill="#EEF2F7"
      />
    </g>
    <defs>
      <filter
        id="filter0_d_15558_8138"
        x="0.0378926"
        y="0.622584"
        width="26.7304"
        height="32.0766"
        filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
      >
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="1.33652" />
        <feGaussianBlur stdDeviation="1.33652" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_15558_8138"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_15558_8138"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);
