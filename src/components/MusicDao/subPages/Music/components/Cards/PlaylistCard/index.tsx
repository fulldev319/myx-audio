import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import SkeletonBox from 'shared/ui-kit/SkeletonBox';
import {
  getDefaultAvatar,
  getDefaultBGImage
} from 'shared/services/user/getUserAvatar';
import { processImage } from 'shared/helpers';
import Box from 'shared/ui-kit/Box';

import { playlistCardStyles } from './index.styles';

import CircularProgress from '@material-ui/core/CircularProgress';
import { MediaPlayerKeyContext } from 'shared/contexts/MediaPlayerKeyContext';

export default function PlaylistCard({
  item,
  index = 1,
  isLoading = false,
  size = 'small',
  handlePlaylistPlay = (id) => {}
}: {
  item: any;
  index?: number;
  isLoading?: boolean;
  size?: 'small' | 'large';
  handlePlaylistPlay?: (id: string) => void;
}) {
  const classes = playlistCardStyles();
  const history = useHistory();

  const [loadingCardSongs, setLoadingCardSongs] = useState<boolean>(false);
  useEffect(() => {
    setLoadingCardSongs(false);
  }, [item.playingStatus]);

  const { selectedSong, setSelectedSong, playerState, setPlayerState } =
    useContext(MediaPlayerKeyContext);

  if (size === 'large') {
    return (
      <div className={classes.card2}>
        <SkeletonBox
          className={classes.album2}
          loading={isLoading}
          image={
            item.ImageUrl && item.ImageUrl !== ''
              ? processImage(item.ImageUrl)
              : getDefaultBGImage()
          }
          height={1}
          style={{
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            overflow: 'hidden',
            flex: 1
          }}
          onClick={() => {
            if (isLoading) return;
            history.push(`/player/playlist/${item.id}`);
          }}
        >
          <div
            style={{
              height: '100%',
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              background:
                'linear-gradient(180deg, rgba(0, 0, 0, 0) 26.9%, rgba(13, 25, 85, 0.82) 88.63%), linear-gradient(180deg, rgba(0, 0, 0, 0) 62.52%, #000000 100%), rgba(0, 0, 0, 0.4)'
            }}
          >
            <Box className={classes.title1} mt={20}>
              #{index}
            </Box>
            <Box my={4} className={classes.title1}>
              {item.Title}
            </Box>
            <Box className={classes.songCount1}>
              {item.creatorFirstName + ' ' + item.creatorLastName} |{' '}
              {item.songCount} Songs |{' '}
              {item.duration > 0
                ? `${Math.floor((item.duration % 3600) / 60)}:${
                    Math.floor(item.duration % 60) < 10 ? '0' : ''
                  }${Math.floor(item.duration % 60).toFixed(0)}`
                : '0:00'}{' '}
              Duration
            </Box>
          </div>
          <Box
            onClick={(e) => {
              e.stopPropagation();
              if (item.id) {
                handlePlaylistPlay(item.id);
              }
            }}
            className={classes.playButton}
          >
            {item.playingStatus === 1 ? ( // playing
              <div
                style={{
                  width: 48,
                  height: 48,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '100vh',
                  background: 'FF00C6',
                  cursor: 'pointer'
                }}
              >
                <PauseIcon />
              </div>
            ) : (
              <div
                style={{
                  height: 48,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#FF00C6',
                  width: 'fit-content',
                  padding: '0 24px',
                  borderRadius: '100vh',
                  cursor: 'pointer'
                }}
              >
                <PlayIcon />
                <Box ml={2}>Play Now</Box>
              </div>
            )}
          </Box>
          <SkeletonBox
            className={classes.avatar2}
            loading={isLoading}
            image={
              item.creatorImageUrl && item.creatorImageUrl !== ''
                ? item.creatorImageUrl
                : getDefaultAvatar()
            }
            style={{
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              overflow: 'hidden'
            }}
          />
        </SkeletonBox>
        <Box className={classes.tableBox}>
          <Box className={classes.tableContainer}>
            <Box mx={2} className={classes.tableHeader}>
              <Box className={classes.colNumber}>#</Box>
              <Box className={classes.colTrack}>Track</Box>
              <Box className={classes.colPlatform}>PLATFORM</Box>
            </Box>
            <Box className={classes.tableContent}>
              {item.listSongs?.map((song, i) => (
                <Box
                  className={classes.trackRow}
                  key={`song-${song.Name ?? ''}-${i}`}
                >
                  <Box className={classes.colNumber}>
                    {('0' + (i + 1)).slice(-2)}
                  </Box>
                  <Box className={classes.colTrack}>
                    <Box
                      style={{
                        width: 80,
                        height: 80,
                        minWidth: 80,
                        minHeight: 80,
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundImage: `url(${processImage(song?.Image)})`
                      }}
                    />

                    <Box
                      ml={2}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        height: 60
                      }}
                    >
                      <Box fontSize={18}>{song.Name}</Box>
                      <Box fontSize={14} style={{ color: '#C7C7C7' }}>
                        {song.Artist}
                      </Box>
                    </Box>
                  </Box>
                  <Box className={classes.colPlatform}>{song.Source}</Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </div>
    );
  } else if (size === 'small') {
    return (
      <div
        className={classes.card}
        onClick={() => {
          if (isLoading) return;
          history.push(`/player/playlist/${item.id}`);
        }}
      >
        <SkeletonBox
          className={classes.album}
          loading={isLoading}
          image={
            item.ImageUrl && item.ImageUrl !== ''
              ? processImage(item.ImageUrl)
              : getDefaultBGImage()
          }
          height={1}
          style={{
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            overflow: 'hidden'
          }}
        />
        <div className={classes.bottomBox}>
          <Box
            className={classes.playIconBox}
            onClick={(e) => {
              e.stopPropagation();
              if (item.id) {
                if (
                  !item.songs &&
                  item.playingStatus === 0 &&
                  item.songCount > 0
                ) {
                  setLoadingCardSongs(true);
                  handlePlaylistPlay(item.id);
                }
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
          </Box>
          <Box ml={2}>
            <div className={classes.title}>{item.Title ?? 'Title'}</div>
            <div className={classes.songCount}>{item.songCount ?? 0} Songs</div>
            {/* <div className={classes.description}>
            {item.Description ?? 'Description'}
            </div>
            <div className={classes.description}>
              {item.creatorFirstName + ' ' + item.creatorLastName}
            </div> */}
          </Box>
        </div>
        <SkeletonBox
          className={classes.avatar}
          loading={isLoading}
          image={
            item.creatorImageUrl && item.creatorImageUrl !== ''
              ? item.creatorImageUrl
              : getDefaultAvatar()
          }
          style={{
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            overflow: 'hidden'
          }}
        />
      </div>
    );
  } else return null;
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
