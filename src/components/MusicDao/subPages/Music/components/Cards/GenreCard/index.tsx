import React, { useEffect, useState, useContext } from 'react';

import { genreCardStyles } from './index.styles';
import { useHistory } from 'react-router-dom';
import SkeletonBox from 'shared/ui-kit/SkeletonBox';
import CircularProgress from '@material-ui/core/CircularProgress';
import { MediaPlayerKeyContext } from 'shared/contexts/MediaPlayerKeyContext';

export default function GenreCard({
  item,
  size = 'small',
  isLoading = false,
  handlePlayGenre = (id) => {}
}: {
  item: any;
  size?: string;
  isLoading?: boolean;
  handlePlayGenre?: (id: string) => void;
}) {
  const classes = genreCardStyles();
  const history = useHistory();

  const [loadingCardSongs, setLoadingCardSongs] = useState<boolean>(false);
  useEffect(() => {
    setLoadingCardSongs(false);
  }, [item.playingStatus]);

  const { selectedSong, setSelectedSong, playerState, setPlayerState } =
    useContext(MediaPlayerKeyContext);

  if (size === 'large') {
    return (
      <div className={classes.cardContainer}>
        <div className={classes.borderContainer}>
          <SkeletonBox
            className={classes.card}
            onClick={() => {
              if (isLoading) return;
              history.push(`/player/genres/${item.id}`);
            }}
            loading={isLoading}
            image={
              item.imgUrl?.length > 0
                ? item.imgUrl
                : item.id && Number(item.id) < 29
                ? require(`assets/genreImages/${item.id}.webp`)
                : require(`assets/genreImages/default.webp`)
            }
            width={1}
            height={1}
            style={{
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className={classes.playIconBoxContainer}>
              <div
                style={{
                  height: '29px',
                  width: '58px',
                  left: -5,
                  bottom: -5,
                  background: '#081047',
                  position: 'absolute',
                  borderBottomLeftRadius: '63px',
                  borderBottomRightRadius: '63px',
                  border: '5px solid #4D08BC',
                  borderTop: 0
                }}
              ></div>
              <div
                className={`${classes.playIconBox} playIcon`}
                style={{ zIndex: 1 }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (item.id) {
                    if (!item.songs && item.playingStatus === 0)
                      setLoadingCardSongs(true);
                    handlePlayGenre(item.id);
                  }
                }}
              >
                {(item.playingStatus === 1 && playerState.loading) ||
                loadingCardSongs ? (
                  <CircularProgress
                    style={{ width: 20, height: 20, color: '#fff' }}
                  />
                ) : item.playingStatus === 1 ? (
                  <PauseIcon />
                ) : (
                  <PlayIcon />
                )}
              </div>
            </div>
            <div className={classes.filter}>
              <div className={classes.name}>{item.name}</div>
            </div>
          </SkeletonBox>
        </div>
      </div>
    );
  } else {
    return (
      <div
        className={classes.smallCard}
        onClick={() => {
          history.push(`/player/genre/${item.id}`);
        }}
      >
        <SkeletonBox
          className={classes.album}
          loading={isLoading}
          image={
            item.imgUrl?.length > 0
              ? item.imgUrl
              : item.id && Number(item.id) < 29
              ? require(`assets/genreImages/${item.id}.webp`)
              : require(`assets/genreImages/default.webp`)
          }
          width={1}
          height={1}
          style={{
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            overflow: 'hidden'
          }}
        />
        <div className={classes.title}>{item.name ?? 'Title'}</div>
        <div className={classes.description}>
          {item.genre_description ?? 'Description or creator name'}
        </div>
      </div>
    );
  }
}

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

const PauseIcon = ({ color = '#fff', size = 1 }) => (
  <svg
    version="1.1"
    id="Capa_1"
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    width={15 * size}
    height={15 * size}
    viewBox="0 0 277.338 277.338"
  >
    <g>
      <path
        d="M14.22,45.665v186.013c0,25.223,16.711,45.66,37.327,45.66c20.618,0,37.339-20.438,37.339-45.66V45.665
c0-25.211-16.721-45.657-37.339-45.657C30.931,0,14.22,20.454,14.22,45.665z"
        fill={color}
      />
      <path
        d="M225.78,0c-20.614,0-37.325,20.446-37.325,45.657V231.67c0,25.223,16.711,45.652,37.325,45.652s37.338-20.43,37.338-45.652
V45.665C263.109,20.454,246.394,0,225.78,0z"
        fill={color}
      />
    </g>
  </svg>
);
