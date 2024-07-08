import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
// import axios from "axios";

import Box from 'shared/ui-kit/Box';
import { Color } from 'shared/ui-kit';
import { useTypedSelector } from 'store/reducers/Reducer';
import { getUser } from 'store/selectors';
// import { FruitSelect } from "shared/ui-kit/Select/FruitSelect";
import { useUserConnections } from 'shared/contexts/UserConnectionsContext';
import SkeletonBox from 'shared/ui-kit/SkeletonBox';
import { getDefaultAvatar } from 'shared/services/user/getUserAvatar';
import { useAuth } from 'shared/contexts/AuthContext';

const useStyles = makeStyles((theme) => ({
  container: {
    background: Color.White,
    boxShadow: '0px 25px 36px -11px rgba(0, 0, 0, 0.02)',
    borderRadius: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    [theme.breakpoints.down(560)]: {
      flexDirection: 'column',
      alignItems: 'flex-start'
    }
  },
  nameBox: {
    borderRight: '1px solid rgba(0, 0, 0, 0.1)',
    minWidth: 220,
    maxWidth: 220,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: 18,
    paddingRight: 16,
    [theme.breakpoints.down(560)]: {
      minWidth: 0
    }
  },
  followBox: {
    border: `1px solid ${Color.MusicDAODark}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: `8px 16px`,
    marginLeft: theme.spacing(1),
    borderRadius: theme.spacing(4),
    width: theme.spacing(20),
    cursor: 'pointer'
  }
}));

const ListArtistCard = ({ data, isLoading = false }) => {
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
  }, [data]);

  const handleFollow = () => {
    if (isFollowProcessing) return;
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

  // const handleFruit = type => {
  //   const token: string = Cookies.get('accessToken') || "";
  //   const body = {
  //     userId: userSelector.id,
  //     podAddress: artist.id,
  //     fruitId: type,
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   };

  //   axios.post(`${URLTraxMicroservice()}/artists/fruit`, body).then(res => {
  //     const resp = res.data;
  //     if (resp.success) {
  //       const artistCopy = { ...artist };
  //       artistCopy.fruits = [
  //         ...(artistCopy.fruits || []),
  //         { userId: userSelector.id, fruitId: type, date: new Date().getTime() },
  //       ];

  //       setArtist(artistCopy);
  //     }
  //   });
  // };

  return (
    <Box className={classes.container} borderRadius={14} px={2} py={1.5} mb={1}>
      <Box display="flex" flexDirection="row" alignItems="center">
        <Box width={84} height={63}>
          <SkeletonBox
            width="100%"
            height="100%"
            loading={isLoading}
            image={data.creatorImageUrl ?? getDefaultAvatar()}
            style={{
              backgroundSize: 'contain',
              backgroundPosition: 'center center',
              backgroundRepeat: 'no-repeat'
            }}
          />
        </Box>
        <Box
          mx={2}
          className={classes.nameBox}
          onClick={() => {
            if (!isLoading) history.push(`/profile/${artist.urlSlug}`);
          }}
        >
          {isLoading ? (
            <SkeletonBox loading width="100px" height="30px" />
          ) : (
            <>
              {artist.name}
              <br />
              {artist.artistId ? ` #${artist.artistId}` : ''}
            </>
          )}
        </Box>
      </Box>
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        width={1}
      >
        <Box style={{ fontWeight: 'bold' }}>
          {isLoading ? (
            <SkeletonBox loading width="100px" height="30px" />
          ) : (
            `Followers: ${artist.numFollowers || 0}`
          )}
        </Box>
        {userSelector.id !== artist.id && isSignedin && (
          <Box display="flex" flexDirection="row" alignItems="center">
            {/* <FruitSelect fruitObject={artist} onGiveFruit={handleFruit} theme="music dao" /> */}
            {isLoading ? (
              <SkeletonBox loading width="100px" height="30px" />
            ) : (
              <Box className={classes.followBox} onClick={handleFollow}>
                {isFollowing === 2
                  ? 'Unfollow'
                  : isFollowing === 1
                  ? 'Requested'
                  : 'Follow'}
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ListArtistCard;
