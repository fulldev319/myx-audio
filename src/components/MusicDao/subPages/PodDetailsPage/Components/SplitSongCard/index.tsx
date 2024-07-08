import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import CollabModal from 'components/MusicDao/modals/CollabModal';
import { Paragraph } from 'shared/ui-kit';
import Box from 'shared/ui-kit/Box';
import Avatar from 'shared/ui-kit/Avatar';
import { processImage } from 'shared/helpers';

import { useSplitSongCardStyles } from './index.styles';

export const SplitSongCard = ({
  artist,
  distribution,
  canDelete,
  handleDeleteCollab,
  numOfCollaborators
}) => {
  const classes = useSplitSongCardStyles();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const isTablet = useMediaQuery(theme.breakpoints.down('sm'));
  const isBigTablet = useMediaQuery(theme.breakpoints.down('md'));

  const [openCollabModal, setOpenCollabModal] = useState<boolean>(false);
  const history = useHistory();

  const getSocialButtons = () => (
    <Box className={classes.socialIcons}>
      {artist?.twitter && (
        <Box
          className={classes.socialButton}
          mr={2}
          onClick={(event) => {
            event.stopPropagation();
            window.open(`https://twitter.com/${artist?.twitter}`, '_blank');
          }}
        >
          <img
            src={require('assets/icons/social_twitter.webp')}
            alt="twitter"
          />
        </Box>
      )}
      {artist?.instagram && (
        <Box
          className={classes.socialButton}
          mr={2}
          onClick={(event) => {
            event.stopPropagation();
            window.open(
              `https://www.instagram.com/${artist?.instagram}`,
              '_blank'
            );
          }}
        >
          <img
            src={require('assets/icons/social_instagram.webp')}
            alt="instagram"
          />
        </Box>
      )}
      {artist?.tiktok && (
        <Box
          className={classes.socialButton}
          mr={2}
          onClick={() => {
            window.open(`https://www.tiktok.com/${artist?.tiktok}`, '_blank');
          }}
        >
          <img
            src={require('assets/snsIcons/tiktok_round.webp')}
            alt="tiktok"
          />
        </Box>
      )}
      {artist?.youtube && (
        <Box
          className={classes.socialButton}
          mr={2}
          onClick={() => {
            window.open(
              `https://www.youtube.com/user/${artist?.youtube}`,
              '_blank'
            );
          }}
        >
          <img
            src={require('assets/snsIcons/youtube_round.webp')}
            alt="youtube"
          />
        </Box>
      )}
      {/* {artist?.spotify && (
      <Box
        className={classes.socialButton}
        mr={2}
        style={{
          background:
            "linear-gradient(0deg, #1ed760, #1ed760), radial-gradient(93.71% 93.71% at -0.18% 88.78%, #FFC050 0%, #AE3AA3 57%, #5459CA 100%)",
        }}
        ml={1}
        onClick={() => {
          window.open(`https://open.spotify.com/user/${artist?.spotify}`, "_blank");
        }}
      >
        <SpotifyIcon />
      </Box>
    )} */}
      {/* {artist?.facebook && (
    <Box
      mr={2}
      onClick={() => {
        window.open(`https://www.facebook.com/${artist?.facebook}`, "_blank");
      }}
    >
      <img src={require("assets/icons/social_facebook.webp")} alt="facebook" />
    </Box>
  )} */}
    </Box>
  );

  return (
    <>
      {numOfCollaborators === 1 ? (
        <Box
          className={classes.oneCard}
          onClick={() => {
            history.push(`/profile/${artist.urlSlug}`);
          }}
        >
          {canDelete && (
            <Box
              className={classes.deleteBox}
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteCollab(artist.id);
              }}
            >
              <img
                src={require('assets/icons/delete_red.svg')}
                alt={'Delete Collab'}
              />
            </Box>
          )}
          <Box
            display={'flex'}
            alignItems="center"
            flexDirection={isMobile ? 'column' : 'row'}
          >
            <Box
              display="flex"
              alignItems="center"
              style={{
                cursor: 'pointer'
              }}
              onClick={() => {
                history.push(`/profile/${artist.urlSlug}`);
              }}
            >
              <Avatar
                image={processImage(artist.imageUrl)}
                size={109}
                rounded={true}
              />
              <Box ml={3.5} overflow="hidden">
                <Box
                  style={{
                    fontSize: 20,
                    fontWeight: 800,
                    color: '#081831',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    width: isTablet ? 120 : isBigTablet ? 180 : 260
                  }}
                >
                  {artist.name}
                </Box>
                <Box
                  style={{
                    fontSize: 13,
                    color: '#0D59EE',
                    overflow: 'hidden',
                    fontWeight: 700,
                    textOverflow: 'ellipsis'
                  }}
                >
                  @{artist.urlSlug}
                </Box>
                <Box
                  style={{
                    fontSize: 16,
                    color: '#54658F',
                    fontWeight: 700,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  #{artist.artistId}
                </Box>
                {getSocialButtons()}
              </Box>
            </Box>
            {artist.bio && (
              <Box display={'flex'} flexDirection="column" ml={5}>
                <Paragraph
                  style={{
                    color: '#54658F',
                    fontSize: 14,
                    fontWeight: 500,

                    lineHeight: '21px',
                    overflow: 'hidden'
                  }}
                >
                  {isTablet
                    ? artist.bio.slice(0, 50) + '...'
                    : artist.bio.slice(0, 100) + '...'}
                </Paragraph>
                <Box
                  py="4px"
                  display="flex"
                  alignItems="center"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setOpenCollabModal(true)}
                >
                  <Box mr={1} style={{ color: '#2D3047' }}>
                    See more
                  </Box>
                  <div>
                    <ArrowDown />
                  </div>
                </Box>
              </Box>
            )}
          </Box>
          {!!distribution && (
            <Box
              className={classes.moreBox}
              style={{
                height: 68,
                padding: isTablet ? '11px 24px' : '11px 40px',
                marginLeft: isMobile ? 0 : 16
              }}
            >
              <Box color="#181818" mb={0.5}>{`% ownership`}</Box>
              <div className={classes.percent}>{distribution}%</div>
            </Box>
          )}
        </Box>
      ) : numOfCollaborators === 2 ? (
        <Box
          className={classes.twoCard}
          onClick={() => {
            history.push(`/profile/${artist.urlSlug}`);
          }}
        >
          {canDelete && (
            <Box
              className={classes.deleteBox}
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteCollab(artist.id);
              }}
            >
              <img
                src={require('assets/icons/delete_red.svg')}
                alt={'Delete Collab'}
              />
            </Box>
          )}
          <Avatar
            image={processImage(artist.imageUrl)}
            size={109}
            rounded={true}
          />
          <Box
            display={'flex'}
            flexDirection="column"
            ml={3.5}
            flex={1}
            overflow="hidden"
          >
            <Box
              display="flex"
              style={{
                cursor: 'pointer'
              }}
              onClick={() => {
                history.push(`/profile/${artist.urlSlug}`);
              }}
            >
              <Box style={{ overflow: 'hidden' }} flex={1}>
                <Box
                  style={{
                    fontSize: 12,
                    color: '#7E7D95',
                    height: '16px',
                    lineHeight: '16px'
                  }}
                >
                  {artist.label ? 'Label' : ''}
                </Box>
                <Box
                  style={{
                    fontSize: 20,
                    fontWeight: 800,
                    color: '#081831',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {artist.name}
                </Box>
                <Box
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#0D59EE',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  @{artist.urlSlug}
                </Box>
                <Box
                  style={{
                    fontSize: 14,
                    height: '16px',
                    lineHeight: '16px',
                    fontWeight: 700,
                    color: '#54658F',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {artist.artistId ? `#${artist.artistId}` : ''}
                </Box>
              </Box>
              {getSocialButtons()}
            </Box>
            <Paragraph
              style={{
                color: '#54658F',
                height: 64,
                fontSize: 14,
                fontWeight: 500,

                lineHeight: '21px',
                overflow: 'hidden'
              }}
            >
              {artist.bio}
            </Paragraph>
            <Box
              py="4px"
              display="flex"
              alignItems="center"
              style={{ cursor: 'pointer' }}
              onClick={() => setOpenCollabModal(true)}
            >
              <Box mr={1} style={{ color: '#2D3047' }}>
                See more
              </Box>
              <div>
                <ArrowDown />
              </div>
            </Box>
            {!!distribution && (
              <Box py={1} className={classes.moreBox} mt={3}>
                <div style={{ color: '#181818', marginBottom: 8 }}>
                  % ownership
                </div>
                <div className={classes.percent}>{distribution}%</div>
              </Box>
            )}
          </Box>
        </Box>
      ) : numOfCollaborators > 2 ? (
        <Box
          className={classes.card}
          onClick={() => {
            history.push(`/profile/${artist.urlSlug}`);
          }}
        >
          {canDelete && (
            <Box
              className={classes.deleteBox}
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteCollab(artist.id);
              }}
            >
              <img
                src={require('assets/icons/delete_red.svg')}
                alt={'Delete Collab'}
              />
            </Box>
          )}
          <Box
            display="flex"
            height={84}
            style={{
              cursor: 'pointer'
            }}
            onClick={() => {
              history.push(`/profile/${artist.urlSlug}`);
            }}
          >
            <Avatar
              image={processImage(artist.imageUrl)}
              size={58}
              rounded={true}
            />
            <Box ml={1} style={{ overflow: 'hidden' }}>
              <Box
                style={{
                  color: '#181818',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {artist.name}
              </Box>
              <Box
                style={{
                  fontSize: 12,
                  color: '#707582',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                #{artist.artistId}
              </Box>
              <Box
                style={{
                  fontSize: 12,
                  color: '#0D59EE',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                @{artist.urlSlug}
              </Box>
            </Box>
            {getSocialButtons()}
          </Box>
          <Paragraph
            style={{
              color: '#54658F',
              height: 84,
              fontSize: 14,
              fontWeight: 500,
              lineHeight: '21px',
              overflow: 'hidden'
            }}
          >
            {artist.bio}
          </Paragraph>
          <Box
            py="4px"
            display="flex"
            alignItems="center"
            style={{ cursor: 'pointer' }}
            onClick={() => setOpenCollabModal(true)}
          >
            <Box mr={1} style={{ color: '#707582' }}>
              See more
            </Box>
            <div>
              <ArrowDown />
            </div>
          </Box>
          {distribution && (
            <Box py={1} className={classes.moreBox}>
              <div style={{ color: '#181818', marginBottom: 8 }}>
                % ownership
              </div>
              <div className={classes.percent}>{distribution}%</div>
            </Box>
          )}
        </Box>
      ) : (
        <></>
      )}
      {openCollabModal && (
        <CollabModal
          open={openCollabModal}
          collab={artist}
          distribution={distribution}
          handleClose={() => setOpenCollabModal(false)}
        />
      )}
    </>
  );
};

const VerifiedIcon = () => (
  <svg
    width="16"
    height="14"
    viewBox="0 0 16 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14.5626 7.66895C14.9052 7.28855 14.9052 6.71084 14.5626 6.33044L13.8409 5.52918C13.6511 5.3185 13.5597 5.03716 13.5894 4.75518L13.7024 3.68282C13.7561 3.17342 13.4161 2.70584 12.915 2.59975L11.861 2.3766C11.583 2.31775 11.3432 2.14343 11.2014 1.89718L10.6643 0.964095C10.4084 0.519632 9.85782 0.340764 9.38961 0.550015L8.40673 0.989276C8.14709 1.10531 7.85033 1.10531 7.59069 0.989276L6.60782 0.550015C6.1396 0.340764 5.58899 0.519631 5.33313 0.964095L4.79601 1.89718C4.65425 2.14343 4.41444 2.31775 4.13646 2.3766L3.0824 2.59975C2.58129 2.70584 2.24136 3.17342 2.29502 3.68282L2.40797 4.75518C2.43767 5.03716 2.34627 5.3185 2.15651 5.52918L1.43481 6.33045C1.0922 6.71084 1.0922 7.28855 1.4348 7.66894L2.15649 8.47021C2.34624 8.6809 2.43764 8.96223 2.40794 9.24421L2.29499 10.3166C2.24134 10.826 2.58126 11.2936 3.08237 11.3996L4.13643 11.6228C4.41441 11.6816 4.65422 11.856 4.79598 12.1022L5.3331 13.0353C5.58896 13.4798 6.13958 13.6586 6.60779 13.4494L7.59065 13.0101C7.8503 12.8941 8.14707 12.8941 8.40671 13.0101L9.38958 13.4494C9.85779 13.6586 10.4084 13.4798 10.6643 13.0353L11.2014 12.1022C11.3431 11.856 11.583 11.6816 11.8609 11.6228L12.915 11.3996C13.4161 11.2936 13.756 10.826 13.7024 10.3166L13.5894 9.24422C13.5597 8.96223 13.6511 8.68089 13.8409 8.47021L14.5626 7.66895Z"
      fill="url(#paint0_linear_11674_281782)"
    />
    <path
      d="M5.5 7.58936L7 9.08936L10.5 5.58936"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <defs>
      <linearGradient
        id="paint0_linear_11674_281782"
        x1="1.91699"
        y1="6.43609"
        x2="14.6081"
        y2="8.22302"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.179206" stopColor="#A0D800" />
        <stop offset="0.852705" stopColor="#0DCC9E" />
      </linearGradient>
    </defs>
  </svg>
);

const ArrowDown = () => (
  <svg
    width="8"
    height="5"
    viewBox="0 0 8 5"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1 1L4 4L7 1"
      stroke="#77788E"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
