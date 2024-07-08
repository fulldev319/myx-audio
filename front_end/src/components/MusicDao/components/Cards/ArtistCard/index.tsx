import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';

import Box from 'shared/ui-kit/Box';
import { Text } from '../../ui-kit';
import { Color, PrimaryButton } from 'shared/ui-kit';
import { useTypedSelector } from 'store/reducers/Reducer';
import { getUser } from 'store/selectors';
import { useUserConnections } from 'shared/contexts/UserConnectionsContext';
import SkeletonBox from 'shared/ui-kit/SkeletonBox';
import { getDefaultAvatar } from 'shared/services/user/getUserAvatar';
import { useAuth } from 'shared/contexts/AuthContext';

const useStyles = makeStyles({
  container: {
    position: 'relative',
    height: '100%',
    background: Color.White,
    boxShadow: '0px 10px 20px rgba(19, 45, 38, 0.07)',
    borderRadius: 20,
    overflow: 'hidden',
    minHeight: '400px !important',
    '&:hover': {
      boxShadow:
        '0px 10px 24px rgba(19, 45, 38, 0.25), 0px 31px 44px -13px rgba(0, 0, 0, 0.02)',
      transform: 'scale(1.02)'
    }
  },
  footer: {
    position: 'relative',
    borderTop: '1px solid rgba(255, 255, 255, 0.12)',
    height: 100
  },
  footerBack: {
    position: 'absolute',
    width: '100%',
    height: 200,
    background:
      'linear-gradient(180deg, rgba(28, 31, 41, 0) 0%, #242D43 54.55%)',
    bottom: 0,
    left: 0
  },
  follow: {
    background: `${Color.White} !important`,
    color: `${Color.MusicDAODark} !important`
  },
  socialButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    marginRight: '5px',
    '& img': {
      cursor: 'pointer',
      width: '32px',
      height: '32px'
    }
  }
});

export default function ArtistCard({
  data,
  customSize,
  isLoading = false
}: {
  data: any;
  customSize?: any;
  isLoading?: boolean;
}) {
  console.log(data)
  const classes = useStyles();
  const history = useHistory();
  const userSelector = useTypedSelector(getUser);
  const [artist, setArtist] = useState<any>(data);

  const { followUser, unfollowUser, isUserFollowed } = useUserConnections();
  const [isFollowing, setIsFollowing] = useState<number>(
    data.id ? isUserFollowed(data.id) : 0
  );
  const [isFollowProcessing, setIsFollowProcessing] = useState<boolean>(false);

  const { isSignedin } = useAuth();

  useEffect(() => {
    setArtist(data);
    setIsFollowing(data.id ? isUserFollowed(data.id) : 0);
  }, [data]);

  const handleFollow = () => {
    setIsFollowProcessing(true);
    if (!isFollowing) {
      followUser(artist.id, true)
        .then((_) => setIsFollowing(2))
        .then(() => {
          setArtist((prev) => {
            const newFollowers = [
              ...prev.followers,
              {
                user: userSelector.id,
                accepted: false
              }
            ];
            return { ...prev, followers: newFollowers };
          });
        })
        .finally(() => {
          setIsFollowProcessing(false);
        });
    } else {
      unfollowUser(artist.id)
        .then((_) => setIsFollowing(0))
        .then(() => {
          setArtist((prev) => {
            let newFollowers = [...prev.followers];
            newFollowers = newFollowers.filter(
              (user) => user.user !== userSelector.id
            );
            return {
              ...prev,
              numFollowers: (prev.numFollowers || 1) - 1,
              followers: newFollowers
            };
          });
        })
        .finally(() => {
          setIsFollowProcessing(false);
        });
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      className={classes.container}
      style={{
        width: customSize?.width ? `${customSize.width} !important` : '',
        height: customSize?.height ? `${customSize.height} !important` : '',
        cursor: 'pointer'
      }}
    >
      <SkeletonBox
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        loading={isLoading}
        image={data.creatorImageUrl ?? getDefaultAvatar()}
        style={{
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
        flex={1}
        px={2}
        py={3}
        onClick={() => {
          if (!isLoading) history.push(`/profile/${artist.urlSlug}`);
        }}
      >
        <div className={classes.footerBack} />
        {isLoading ? (
          <SkeletonBox loading width="50%" height="30px" />
        ) : (
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box
              fontSize="18px"
              color="#fff"
              style={{
                padding: '5px 13px',
                background:
                  'linear-gradient(0deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3))',
                borderRadius: '6px'
              }}
            >
              {artist.name && artist.name.length > 17
                ? artist.name.substr(0, 13) +
                  '...' +
                  artist.name.substr(artist.name.length - 3, 3)
                : artist.name}
                <br/>
              {artist.artistId ? ` #${artist.artistId}` : ''}
            </Box>
            {/* {artist.twitterVerified && <CheckIcon />} */}
          </Box>
        )}
      </SkeletonBox>
      <Box
        className={classes.footer}
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        px={2}
      >
        {isLoading ? (
          <SkeletonBox loading width="50%" height="30px" />
        ) : (
          <>
            <Box display="flex">
              {artist.twitter &&
                <Box
                className={classes.socialButton}
                onClick={(event) => {
                  event.stopPropagation();
                  window.open(`https://twitter.com/${artist.twitter}`, '_blank');
                }}
                >
                <img
                  src={require('assets/icons/social_twitter.webp')}
                  alt="twitter"
                />
                </Box>
              }
              {artist?.instagram && (
                <Box
                  className={classes.socialButton}
                  onClick={(event) => {
                    event.stopPropagation();
                    window.open(`https://www.instagram.com/${artist?.instagram}`, '_blank');
                  }}
                >
                  <img
                    src={require('assets/icons/social_instagram.webp')}
                    alt="instagram"
                  />
                </Box>
              )}
            </Box>
            {artist.id !== userSelector.id && isSignedin && (
              <PrimaryButton
                className={classes.follow}
                size="small"
                isRounded
                onClick={handleFollow}
                disabled={isFollowProcessing}
              >
                {isFollowing === 2
                  ? 'Unfollow'
                  : isFollowing === 1
                  ? 'Pending'
                  : 'Follow'}
              </PrimaryButton>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}

const CheckIcon = () => (
  <svg width="21" height="20" viewBox="0 0 21 20" fill="none">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M20.1218 9.00966C20.6293 9.57311 20.6293 10.4288 20.1218 10.9923L19.0528 12.1791C18.7717 12.4912 18.6363 12.908 18.6803 13.3256L18.8476 14.914C18.9271 15.6686 18.4236 16.3612 17.6813 16.5183L16.12 16.8489C15.7083 16.936 15.3531 17.1942 15.1431 17.559L14.3475 18.9411C13.9685 19.5995 13.1529 19.8644 12.4594 19.5544L11.0035 18.9038C10.6189 18.7319 10.1794 18.7319 9.79476 18.9038L8.33891 19.5544C7.64538 19.8644 6.82978 19.5995 6.4508 18.9411L5.65519 17.559C5.44522 17.1942 5.09 16.936 4.67825 16.8489L3.11694 16.5183C2.37468 16.3612 1.87117 15.6686 1.95064 14.9141L2.11795 13.3256C2.16195 12.9079 2.02656 12.4912 1.74549 12.1792L0.676509 10.9923C0.169025 10.4288 0.169029 9.57312 0.676517 9.00967L1.74552 7.8228C2.0266 7.51073 2.16199 7.09401 2.11799 6.67633L1.95069 5.0879C1.87121 4.33337 2.37472 3.64077 3.11698 3.48363L4.67829 3.15309C5.09004 3.06592 5.44526 2.80771 5.65523 2.44295L6.45084 1.06084C6.82982 0.402487 7.64541 0.137544 8.33895 0.447493L9.79482 1.09814C10.1794 1.27002 10.619 1.27002 11.0036 1.09814L12.4594 0.447493C13.153 0.137544 13.9686 0.402488 14.3475 1.06084L15.1431 2.44295C15.3531 2.80771 15.7083 3.06592 16.1201 3.15309L17.6814 3.48363C18.4236 3.64077 18.9272 4.33337 18.8477 5.08791L18.6803 6.67632C18.6364 7.094 18.7717 7.51073 19.0528 7.82281L20.1218 9.00966ZM14.8883 8.69675C15.3221 8.26291 15.3221 7.55951 14.8883 7.12566C14.4545 6.69182 13.7511 6.69182 13.3172 7.12566L8.91844 11.5244L7.48213 10.0881C7.04829 9.65429 6.34489 9.65429 5.91105 10.0881C5.4772 10.522 5.4772 11.2254 5.91105 11.6592L8.1329 13.8811C8.34123 14.0894 8.6238 14.2064 8.91844 14.2064C9.21307 14.2064 9.49564 14.0894 9.70398 13.8811L14.8883 8.69675Z"
      fill="white"
    />
  </svg>
);
