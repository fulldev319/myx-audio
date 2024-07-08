import React, { useContext, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import { RootState } from 'store/reducers/Reducer';

import { Gradient, PrimaryButton, SecondaryButton } from 'shared/ui-kit';
import URL from 'shared/functions/getURL';
import { getDefaultAvatar } from 'shared/services/user/getUserAvatar';
import SkeletonBox from 'shared/ui-kit/SkeletonBox';
import Box from 'shared/ui-kit/Box';
import { useUserConnections } from 'shared/contexts/UserConnectionsContext';
import { processImage } from 'shared/helpers';

import { artistCardStyles } from './index.styles';

export default function ArtistCard({
  item,
  isLoading = false
}: {
  item: any;
  isLoading?: boolean;
}) {
  const classes = artistCardStyles();
  const history = useHistory();

  const userSelector = useSelector((state: RootState) => state.user);
  // const [isFollowing, setIsFollowing] = React.useState<number>(0);
  // const [following, setFollowing] = useState<boolean>(
  //   !userSelector || !item.followers ? false : item.followers.find(v => v.user.toLowerCase() === userSelector.id.toLowerCase())
  // );

  // const [followingCount, setFollowingCount] = useState(
  //   item?.likes?.length > 0 ? Number(item.likes) : 0
  // );
  const [handlingLike, setHandlingLike] = useState<boolean>(false);
  const [artistData, setArtistData] = useState<any>(item);

  // const { /*followUser, unfollowUser,*/ isUserFollowed } = useUserConnections();
  // useEffect(() => {
  //   if (item.id) {
  //     // setIsFollowing(isUserFollowed(item.id));
  //     setFollowingCount(item?.numFollowers ?? 0);
  //   }
  // }, [item, isUserFollowed]);

  useEffect(() => {
    setArtistData(item);
  }, [item]);

  const handleFollow = (e, type) => {
    e.stopPropagation();
    e.preventDefault();

    if (handlingLike) return;

    const itemCopy = { ...artistData };
    if (type === 'like') {
      itemCopy.likes = [
        ...(itemCopy.likes || []),
        { userId: userSelector.id, date: new Date().getTime() }
      ];
    } else {
      itemCopy.likes = itemCopy.likes.filter(
        (v) => v.userId !== userSelector?.id
      );
    }
    setArtistData(itemCopy);

    try {
      setHandlingLike(true);
      const podAddress = artistData.id;
      const api = '/musicDao/artist/like';

      axios
        .post(`${URL()}${api}`, {
          userId: userSelector.id,
          id: podAddress,
          type
        })
        .then((res) => {
          if (res.data.success) {
            setHandlingLike(false);
          } else {
            setHandlingLike(false);
            if (type === 'like') {
              itemCopy.likes = itemCopy.likes.filter(
                (v) => v.userId !== userSelector?.id
              );
            } else {
              itemCopy.likes = [
                ...(itemCopy.likes || []),
                { userId: userSelector.id, date: new Date().getTime() }
              ];
            }
            setArtistData(itemCopy);
          }
        });
    } catch (error) {
      setHandlingLike(false);
      if (type === 'like') {
        itemCopy.likes = itemCopy.likes.filter(
          (v) => v.userId !== userSelector?.id
        );
      } else {
        itemCopy.likes = [
          ...(itemCopy.likes || []),
          { userId: userSelector.id, date: new Date().getTime() }
        ];
      }
      setArtistData(itemCopy);
    }
  };

  return (
    <div className={classes.card}>
      <div
        className={classes.avatarBox}
        onClick={() => {
          if (!isLoading && item.id) {
            history.push(`/player/artists/${item.Address}`);
          }
        }}
      >
        <SkeletonBox
          className={classes.avatar}
          loading={isLoading}
          image={
            item.ImageUrl && item.ImageUrl !== ''
              ? processImage(item.ImageUrl)
              : getDefaultAvatar()
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
      </div>
      {/* <div
        className={classes.avatar}
        style={{
          backgroundImage: item.creatorImageUrl ? `url(${item.creatorImageUrl})` : `url(${getDefaultAvatar()})`,
          // backgroundImage: `url(${getDefaultAvatar()})`
        }}
      /> */}
      {isLoading ? (
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Box mb={1} width="70%">
            <SkeletonBox loading height="30px" />
          </Box>
          <Box width="70%">
            <SkeletonBox loading height="30px" />
          </Box>
        </div>
      ) : (
        <>
          <div className={classes.name}>{item.ArtistName ?? 'Artist Name'}</div>
          <div className={classes.followers}>{`${
            (artistData?.likes?.length ?? 0) > 1000000
              ? ((artistData?.likes?.length ?? 0) / 1000000).toFixed(1)
              : (artistData?.likes?.length ?? 0) > 1000
              ? ((artistData?.likes?.length ?? 0) / 1000).toFixed(1)
              : artistData?.likes?.length ?? 0
          }${
            (artistData?.likes?.length ?? 0) > 1000000
              ? 'M'
              : (artistData?.likes?.length ?? 0) > 1000
              ? 'K'
              : ''
          }
        Followers`}</div>
          {!artistData?.likes?.find((v) => v.userId === userSelector?.id) ? (
            <PrimaryButton
              className={classes.followButton}
              style={{ background: Gradient.Blue, color: '#fff' }}
              size="medium"
              onClick={(e) => {
                handleFollow(e, 'like');
              }}
            >
              Follow
            </PrimaryButton>
          ) : (
            <SecondaryButton
              className={classes.followButton}
              style={{ border: '1px solid #5046BB' }}
              size="medium"
              onClick={(e) => {
                handleFollow(e, 'dislike');
              }}
            >
              Unfollow
            </SecondaryButton>
          )}
        </>
      )}
    </div>
  );
}
