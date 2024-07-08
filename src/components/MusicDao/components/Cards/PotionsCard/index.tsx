import React from 'react';
import { useHistory } from 'react-router-dom';
import Box from 'shared/ui-kit/Box';
import { potionsCardStyles } from './index.styles';
import { WhiteArrowIcon } from '../../Icons/SvgIcons';
import { getRandomAvatar } from 'shared/services/user/getUserAvatar';

export default function PotionsCard({ pod }) {
  const history = useHistory();
  const styles = potionsCardStyles();

  const parentNode = React.useRef<any>();

  return (
    <Box textAlign="center">
      <Box className={styles.podCard} mb={1}>
        <Box className={styles.innerBox}>
          <Box className={styles.podImageContent}>
            <div
              className={styles.podImage}
              style={{
                backgroundImage: `url("${
                  pod.album_image || getRandomImageUrl()
                }")`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                overflow: 'hidden'
              }}
              ref={parentNode}
            />
            <Box className={styles.bopAvatarBox}>
              {pod.artists && pod.artists.length > 0 ? (
                pod.artists.map((artist, index) => (
                  <Box
                    className={
                      index === 0 ? styles.bopAvatar : styles.bopAvatar1
                    }
                    key={index}
                    ml={index > 0 ? -1 : 0}
                    zIndex={pod.artists.length - index}
                  >
                    <img
                      src={artist.avatar ?? getRandomAvatar()}
                      width="100%"
                      height="100%"
                      style={{ borderRadius: '100%' }}
                      title={artist.name || ''}
                    />
                  </Box>
                ))
              ) : (
                <Box className={styles.bopAvatar}>
                  <img
                    src={pod.artist_image}
                    width="100%"
                    height="100%"
                    style={{ borderRadius: '100%' }}
                    title={pod.artist_name || ''}
                  />
                </Box>
              )}
            </Box>
            <Box className={styles.genreBox}>{pod.genres ?? 'pop'}</Box>
            <Box
              className={styles.socialButtons}
              style={{ cursor: 'pointer' }}
              onClick={() => history.push(`/potions/${pod.song_name}`)}
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box color="white" textAlign="start" width="85%">
                  <Box
                    className={styles.header1}
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {pod.artist_name}
                  </Box>
                  <Box
                    className={styles.header2}
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {pod.song_name}
                  </Box>
                </Box>
                <WhiteArrowIcon />
              </Box>
            </Box>
          </Box>
          <Box className={styles.podInfo}>
            <Box className={styles.podMainInfo}>
              <Box className={styles.flexBox}>
                <Box display="flex" alignItems="center">
                  <img
                    src={require('assets/tokenImages/COMP.webp')}
                    width="32px"
                  />
                  <Box ml={2}>Bops Generated</Box>
                </Box>
                <Box style={{ color: 'black' }}>
                  {(pod.Reproductions ?? 34, 589)}
                </Box>
              </Box>
              <Box className={styles.divider} />
              <Box className={styles.flexBox}>
                <Box display="flex" alignItems="center">
                  <Box
                    style={{
                      borderRadius: '50%',
                      height: '32px',
                      width: '32px',
                      backgroundColor: '#65CB63'
                    }}
                  >
                    <img
                      src={require('assets/musicDAOImages/potions_3.webp')}
                      width="32px"
                    />
                  </Box>
                  <Box ml={2}>Levels</Box>
                </Box>
                <Box style={{ color: 'black' }}>
                  {pod.totalReproductions ?? '1'}
                </Box>
              </Box>
              <Box className={styles.divider} />
              <Box className={styles.flexBox}>
                <Box display="flex" alignItems="center">
                  <Box
                    style={{
                      borderRadius: '50%',
                      height: '32px',
                      width: '32px',
                      backgroundColor: '#F8F0E5'
                    }}
                  >
                    <img
                      src={require('assets/musicDAOImages/potions_4.webp')}
                      width="32px"
                    />
                  </Box>
                  <Box ml={2}>Beats Awarded</Box>
                </Box>
                <Box style={{ color: 'black' }}>
                  {pod.Reproductions ?? '0.24 USD'}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

const getRandomImageUrl = () => {
  return require(`assets/podImages/${Math.floor(Math.random() * 15 + 1)}.webp`);
};
