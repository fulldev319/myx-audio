import React from 'react';
import { Color } from 'shared/ui-kit';
import Box from 'shared/ui-kit/Box';
import { StyledButton } from 'components/MusicDao/modals/CreateBop';
import { bopsCombinCardStyles } from './index.styles';

export const BopsCombineCard = ({ pod }) => {
  const classes = bopsCombinCardStyles();

  return (
    <Box className={classes.container}>
      <Box>
        <Box className={classes.logoImage}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            mt={-1}
          >
            <CombineBack />
            <Box
              position="absolute"
              fontSize={8}
              color={Color.White}
              fontWeight={800}
            >
              COMBINING
            </Box>
          </Box>
          <Box
            display="flex"
            alignItems="flex-end"
            justifyContent="center"
            flex={1}
            pb={3}
          >
            <img
              src={require(`assets/musicDAOImages/Egg_${pod}.webp`)}
              alt="egg"
            />
          </Box>
          <Box display="flex" justifyContent="space-between" px={3}>
            <Box className={classes.timeTag}>4 Days</Box>
            <Box className={classes.timeTag}>22h</Box>
            <Box className={classes.timeTag}>12min</Box>
            <Box className={classes.timeTag}>10s</Box>
          </Box>
        </Box>
        <Box width={1} mt={2} px={1}>
          <Box
            bgcolor="rgba(84, 101, 143, 0.3)"
            height="1px"
            width={1}
            mb={1.5}
          />
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            width={1}
            mb={2.5}
          >
            <Box
              fontSize={14}
              fontWeight={500}
              color={Color.MusicDAODark}
              style={{ opacity: 0.7 }}
            >
              Breeds
            </Box>
            <Box fontSize={16} fontWeight={600} color={Color.MusicDAODark}>
              2455
            </Box>
          </Box>
          <Box
            bgcolor="rgba(84, 101, 143, 0.3)"
            height="1px"
            width={1}
            mb={1.5}
          />
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            width={1}
            mb={3}
          >
            <Box
              fontSize={14}
              fontWeight={500}
              color={Color.MusicDAODark}
              style={{ opacity: 0.7 }}
            >
              Polygonscan
            </Box>
            <Box display="flex" alignItems="center">
              <Box
                fontSize={13}
                fontWeight={600}
                color={Color.MusicDAODark}
                mr={2}
              >
                0xeec9...82f8
              </Box>
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.9042 1.39259L5.76702 9.22863M13.9042 1.39259L13.9042 6.09421M13.9042 1.39259L9.02192 1.39258M5.76705 1.39259H0.884766V13.9303H13.9042V9.22863"
                  stroke="#2D3047"
                  strokeWidth="1.17541"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Box>
          </Box>
        </Box>
        <Box display="flex" justifyContent="center">
          <StyledButton
            text="Breed"
            bgcolor="#2D3047"
            color="white"
            className={classes.button}
            onClick={() => {}}
          />
        </Box>
      </Box>
    </Box>
  );
};

const CombineBack = () => (
  <svg
    width="74"
    height="16"
    viewBox="0 0 74 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M73.2221 5.97173C73.9307 7.19903 73.9307 8.71112 73.2221 9.93841L70.9205 13.9248C70.212 15.1521 68.9024 15.9082 67.4853 15.9082L7.20409 15.9082C5.78693 15.9082 4.47742 15.1521 3.76885 13.9248L1.46728 9.93841C0.758697 8.71111 0.758697 7.19902 1.46728 5.97173L3.76885 1.98529C4.47743 0.757997 5.78694 0.00195218 7.20409 0.0019522L67.4853 0.0019529C68.9024 0.00195291 70.212 0.757999 70.9205 1.9853L73.2221 5.97173Z"
      fill="#00E031"
    />
    <path
      d="M73.2221 5.97173C73.9307 7.19903 73.9307 8.71112 73.2221 9.93841L70.9205 13.9248C70.212 15.1521 68.9024 15.9082 67.4853 15.9082L7.20409 15.9082C5.78693 15.9082 4.47742 15.1521 3.76885 13.9248L1.46728 9.93841C0.758697 8.71111 0.758697 7.19902 1.46728 5.97173L3.76885 1.98529C4.47743 0.757997 5.78694 0.00195218 7.20409 0.0019522L67.4853 0.0019529C68.9024 0.00195291 70.212 0.757999 70.9205 1.9853L73.2221 5.97173Z"
      fill="url(#paint0_linear)"
    />
    <defs>
      <linearGradient
        id="paint0_linear"
        x1="179.541"
        y1="-8.758"
        x2="179.258"
        y2="16.7841"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.179206" stopColor="#A0D800" />
        <stop offset="0.848958" stopColor="#0DCC9E" />
      </linearGradient>
    </defs>
  </svg>
);
