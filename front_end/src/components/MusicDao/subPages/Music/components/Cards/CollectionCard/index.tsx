import React from 'react';
import { useHistory } from 'react-router-dom';

import Box from '@material-ui/core/Box';

import SkeletonBox from 'shared/ui-kit/SkeletonBox';
import { processImage } from 'shared/helpers';

import { cardStyles } from './index.styles';
import { getDefaultBGImage } from 'shared/services/user/getUserAvatar';

export default function CollectionCard({
  item,
  isLoading = false
}: {
  item: any;
  isLoading?: boolean;
}) {
  const classes = cardStyles();
  const history = useHistory();

  return (
    <div
      className={classes.card}
      onClick={() => {
        if (!isLoading) {
          history.push(`/player/albums/${item.id}`);
        }
      }}
    >
      <Box
        width={1}
        display="flex"
        justifyContent="center"
        position={'relative'}
      >
        <SkeletonBox
          className={classes.album}
          loading={isLoading}
          image={
            item.Image && item.Image !== ''
              ? processImage(item.Image)
              : getDefaultBGImage()
          }
          height={1}
          style={{
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            overflow: 'hidden',
            borderRadius: '40px 40px 0 0',
            width: `100%`
          }}
        />
        <Box className={classes.playIconBox} onClick={(e) => {}}>
          {item.playingStatus === 1 ? ( // playing
            <PauseIcon />
          ) : (
            <PlayIcon />
          )}
        </Box>
      </Box>
      <Box
        bgcolor={'#13172C'}
        minHeight={80}
        width={1}
        display="flex"
        alignItems={'center'}
        pl={4}
      >
        <CollectionIcon />
        <Box className={classes.title} ml={3}>
          {item.Name && item.Name.length > 20
            ? item.Name.slice(0, 19) + '...'
            : item.Name}
        </Box>
      </Box>
      <Box width={1} height={'1px'} bgcolor="rgba(255, 255, 255, 0.08)" />
      <Box
        bgcolor={'#13172C'}
        minHeight={80}
        width={1}
        display="flex"
        alignItems={'center'}
        pl={4}
        borderRadius={'0 0 40px 40px'}
      >
        <MusicIcon />
        <Box className={classes.title} ml={3}>
          {'25 Songs'}
        </Box>
      </Box>

      {/* <div className={classes.description}>
        {item.Description ?? 'Description and creator name'}
      </div> */}
    </div>
  );
}

const CollectionIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12.3333 14.9733C12.0938 14.8419 11.8241 14.7755 11.5509 14.7805C11.2778 14.7856 11.0107 14.862 10.7762 15.0022C10.5417 15.1423 10.3479 15.3414 10.2141 15.5796C10.0803 15.8178 10.0111 16.0868 10.0133 16.36V20.5866C10.0136 20.859 10.0844 21.1266 10.2187 21.3634C10.353 21.6003 10.5463 21.7985 10.7798 21.9386C11.0133 22.0787 11.2791 22.156 11.5513 22.163C11.8235 22.17 12.0929 22.1065 12.3333 21.9786L16.2267 19.872C16.4778 19.7362 16.6876 19.535 16.8338 19.2897C16.98 19.0444 17.0572 18.7642 17.0572 18.4786C17.0572 18.1931 16.98 17.9129 16.8338 17.6676C16.6876 17.4223 16.4778 17.2211 16.2267 17.0853L12.3333 14.9733Z"
      stroke="white"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M23.4 26.3596C23.4005 26.6189 23.3498 26.8757 23.2509 27.1154C23.1519 27.3551 23.0065 27.5728 22.8232 27.7561C22.6399 27.9395 22.4221 28.0848 22.1825 28.1838C21.9428 28.2828 21.686 28.3335 21.4267 28.3329H5.64C5.38071 28.3335 5.12387 28.2828 4.88422 28.1838C4.64456 28.0848 4.42681 27.9395 4.24347 27.7561C4.06012 27.5728 3.91479 27.3551 3.81581 27.1154C3.71682 26.8757 3.66614 26.6189 3.66667 26.3596V10.5729C3.66614 10.3137 3.71682 10.0568 3.81581 9.81716C3.91479 9.57751 4.06012 9.35976 4.24347 9.17641C4.42681 8.99307 4.64456 8.84773 4.88422 8.74875C5.12387 8.64977 5.38071 8.59909 5.64 8.59961H21.4267C21.686 8.59909 21.9428 8.64977 22.1825 8.74875C22.4221 8.84773 22.6399 8.99307 22.8232 9.17641C23.0065 9.35976 23.1519 9.57751 23.2509 9.81716C23.3498 10.0568 23.4005 10.3137 23.4 10.5729V26.3596Z"
      stroke="white"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M8.60001 5.62699C8.60388 5.10605 8.81344 4.60775 9.18306 4.24063C9.55267 3.87352 10.0524 3.66733 10.5733 3.66699L26.3733 3.66699C26.8929 3.6677 27.3911 3.87442 27.7585 4.24184C28.1259 4.60926 28.3326 5.10738 28.3333 5.62699V21.427C28.333 21.9479 28.1268 22.4477 27.7597 22.8173C27.3926 23.1869 26.8943 23.3965 26.3733 23.4003"
      stroke="white"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const MusicIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.49335 28.3329C10.3711 28.3329 11.8934 26.8166 11.8934 24.9462C11.8934 23.0758 10.3711 21.5596 8.49335 21.5596C6.61558 21.5596 5.09335 23.0758 5.09335 24.9462C5.09335 26.8166 6.61558 28.3329 8.49335 28.3329Z"
      stroke="white"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M11.88 24.9467V8.38672"
      stroke="white"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M23.5067 23.6132C25.3844 23.6132 26.9067 22.0969 26.9067 20.2265C26.9067 18.3561 25.3844 16.8398 23.5067 16.8398C21.6289 16.8398 20.1067 18.3561 20.1067 20.2265C20.1067 22.0969 21.6289 23.6132 23.5067 23.6132Z"
      stroke="white"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M26.9067 20.227V3.66699"
      stroke="white"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M11.88 8.38699L26.9067 3.66699"
      stroke="white"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M12.3067 13.5066L26.9067 8.91992"
      stroke="white"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const PlayIcon = () => (
  <svg
    width={13}
    height={16}
    viewBox="0 0 13 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1.5241 0.937906C0.857828 0.527894 0 1.00724 0 1.78956V14.2104C0 14.9928 0.857827 15.4721 1.5241 15.0621L11.6161 8.85166C12.2506 8.46117 12.2506 7.53883 11.6161 7.14834L1.5241 0.937906Z"
      fill="#fff"
    />
  </svg>
);

const PauseIcon = () => (
  <svg
    version="1.1"
    id="Capa_1"
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    width={15}
    height={15}
    viewBox="0 0 277.338 277.338"
  >
    <g>
      <path
        d="M14.22,45.665v186.013c0,25.223,16.711,45.66,37.327,45.66c20.618,0,37.339-20.438,37.339-45.66V45.665
c0-25.211-16.721-45.657-37.339-45.657C30.931,0,14.22,20.454,14.22,45.665z"
        fill="#fff"
      />
      <path
        d="M225.78,0c-20.614,0-37.325,20.446-37.325,45.657V231.67c0,25.223,16.711,45.652,37.325,45.652s37.338-20.43,37.338-45.652
V45.665C263.109,20.454,246.394,0,225.78,0z"
        fill="#fff"
      />
    </g>
  </svg>
);
