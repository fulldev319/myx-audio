import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { RootState } from 'store/reducers/Reducer';
import WallItemModal from 'components/MusicDao/subPages/ProfilePage/components/MyWall/WallItemModal';
import RemovePostModal from 'components/MusicDao/subPages/SingleSongDetailPage/modals/RemovePostModal';

import { Avatar, Color, StyledDivider } from 'shared/ui-kit';
// import { FruitSelect } from 'shared/ui-kit/Select/FruitSelect';
import Box from 'shared/ui-kit/Box';
import getPhotoIPFS from 'shared/functions/getPhotoIPFS';
import useIPFS from 'shared/utils-IPFS/useIPFS';
import { getDefaultAvatar } from 'shared/services/user/getUserAvatar';
// import { musicDaoFruitPost } from 'shared/services/API';
import { useAlertMessage } from 'shared/hooks/useAlertMessage';
import { useAuth } from 'shared/contexts/AuthContext';
import { processImage } from 'shared/helpers';

import { wallFeedCardStyles } from './index.styles';

const FeedMessages = {
  liked: 'liked this wall',
  posted: 'posted this wall',
  commented: 'commented on this wall'
};

export default function WallFeedCard({
  item,
  feedItem,
  type,
  delRefresh
}: {
  item: any;
  feedItem?: boolean;
  type?: string;
  delRefresh?: any;
}) {
  const userSelector = useSelector((state: RootState) => state.user);
  const { isSignedin } = useAuth();

  const classes = wallFeedCardStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const { showAlertMessage } = useAlertMessage();

  const [post, setPost] = useState<any>(item);

  const [comments, setComments] = useState<any[]>(item.responses || []);

  const [openWallItemModal, setOpenWallItemModal] = useState<any>(false);
  const [openRemovePostModal, setOpenRemovePostModal] = useState<any>(false);

  const [imageWallIPFS, setImageWallIPFS] = useState<any>(null);
  const [videoWallIPFS, setVideoWallIPFS] = useState<any>(null);

  const { isIPFSAvailable, downloadWithNonDecryption } = useIPFS();

  useEffect(() => {
    if (item?.infoImage && isIPFSAvailable) {
      getPhotos();
    } else {
      setImageWallIPFS(null);
      setVideoWallIPFS(null);
    }
  }, [item?.infoImage, isIPFSAvailable]);

  useEffect(() => {
    if (item.responses) {
      setComments(item.responses);
    }
  }, [item.responses?.length]);

  const getPhotos = async () => {
    if (
      item.infoImage?.newFileCID &&
      item.infoImage?.metadata?.properties?.name
    ) {
      let imageUrl = await getPhotoIPFS(
        item.infoImage.newFileCID,
        item.infoImage.metadata.properties.name,
        downloadWithNonDecryption
      );
      setImageWallIPFS(imageUrl);
    }

    if (
      item.infoVideo?.newFileCID &&
      item.infoVideo?.metadata?.properties?.name
    ) {
      let videoUrl = await getPhotoIPFS(
        item.infoVideo.newFileCID,
        item.infoVideo.metadata.properties.name,
        downloadWithNonDecryption,
        item.infoVideo.metadata.object_type
      );
      setVideoWallIPFS(videoUrl);
    }
  };

  const handleOpenWallItemModal = () => {
    setOpenWallItemModal(true);
  };

  const handleCloseWallItemModal = () => {
    setOpenWallItemModal(false);
  };

  const handleOpenRemovePostModal = (e) => {
    e.stopPropagation();
    e.preventDefault();

    setOpenRemovePostModal(true);
  };

  // const handleFruit = (type) => {
  //   if (
  //     post.fruits
  //       ?.filter((f) => f.fruitId === type)
  //       ?.find((f) => f.userId === userSelector.id)
  //   ) {
  //     showAlertMessage('You had already given this fruit.', {
  //       variant: 'info'
  //     });
  //     return;
  //   }
  //   musicDaoFruitPost(userSelector.id, post.id, type).then((res) => {
  //     if (res.success) {
  //       const itemCopy = { ...post };
  //       itemCopy.fruits = [
  //         ...(itemCopy.fruits || []),
  //         { userId: userSelector.id, fruitId: type, date: new Date().getTime() }
  //       ];
  //       setPost(itemCopy);
  //     }
  //   });
  // };

  return (
    <>
      <div className={classes.wallItem} onClick={handleOpenWallItemModal}>
        {userSelector.id === item.userId && isSignedin && (
          <div
            className={classes.removeIcon}
            onClick={handleOpenRemovePostModal}
          >
            <RemoveIcon />
          </div>
        )}
        {feedItem && (
          <Box mb={'16px'} fontSize={12} display="flex" alignItems="center">
            <Avatar
              size="small"
              className={classes.actorAvatar}
              url={processImage(item.actorInfo?.imageUrl) || getDefaultAvatar()}
            />
            {item.actorInfo.name.replace(/\s+$/, '')}&nbsp;
            {FeedMessages[item.feedType]}
            {/* {item.name === ` ` && item.textShort === ` `
              ? userSelector.id !== item.createdBy
                ? ` sent `
                : ` posted `
              : item.selectedFormat === 2
              ? ` shared on `
              : ` wrote on `}
            {ownUserWall
              ? item.name === ` ` && item.textShort === ` `
                ? userSelector.id !== item.createdBy
                  ? "you"
                  : ""
                : "your"
              : ""}
            <span>{!ownUserWall ? `${item.userName || "his/her"}` : ""}</span>
            {feedItem && item.name === ` ` && item.textShort === ` `
              ? ` an image`
              : feedItem
              ? `${!ownUserWall && item.userName ? "'s" : ""} wall`
              : ""} */}
          </Box>
        )}
        {feedItem && (
          <Box mb={'16px'} display="flex" alignItems="center">
            <Avatar
              size={'small'}
              url={processImage(item.userInfo?.imageUrl) || getDefaultAvatar()}
            />
            <Box ml="8px" fontSize="14px" fontWeight={600}>
              {userSelector.id !== item.createdBy ? (
                <span>{item.userInfo?.name || ''}</span>
              ) : (
                'You'
              )}
            </Box>
          </Box>
        )}
        <Box
          mb={'16px'}
          display="flex"
          alignItems="flex-start"
          flexDirection="column"
          gridColumnGap={16}
        >
          {imageWallIPFS && (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              width={1}
            >
              <img
                onClick={handleOpenWallItemModal}
                src={imageWallIPFS ? imageWallIPFS : ''}
                className={classes.feedImg}
                alt={'wall'}
                style={{ width: '100%', objectFit: 'cover' }}
              />
            </Box>
          )}

          <Box className={classes.feedText}>
            {item.name && item.name !== ` ` ? <h3>{item.name}</h3> : null}
            {item.textShort && item.textShort !== ` ` && (
              <div className={classes.desc}>{item.textShort}</div>
            )}
          </Box>
        </Box>

        {!isMobile && (
          <Box width="100%" onClick={handleOpenWallItemModal}>
            <StyledDivider
              margin={2}
              type="solid"
              color={Color.GrayInputBorderSelected}
            />
          </Box>
        )}

        {!isMobile && (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box display="flex" alignItems="center">
              {/* <div className={classes.fruitsContainer}>
                {isSignedin && (
                  <FruitSelect
                    fruitObject={post}
                    members={[]}
                    onGiveFruit={handleFruit}
                  />
                )}
              </div> 
              <TwitterShareButton
                className={classes.shareButton}
                title={item.name + "\n" + item.textShort + "\n\n"}
                url={window.location.href}
                onClick={(e)=>{
                  e.stopPropagation();
                  e.preventDefault();
                }}
              >
                <TwitterIcon />
              </TwitterShareButton>
              <FacebookShareButton
                className={classes.shareButton}
                title={item.name + "\n" + item.textShort + "\n\n"}
                url={window.location.href}
                onClick={(e)=>{
                  e.stopPropagation();
                  e.preventDefault();
                }}
              >
                <FacebookIcon />
              </FacebookShareButton>
              <InstapaperShareButton
                className={classes.shareButton}
                title={item.name + "\n" + item.textShort + "\n\n"}
                url={window.location.href}
                onClick={(e)=>{
                  e.stopPropagation();
                  e.preventDefault();
                }}
              >
                <InstagramIcon />
              </InstapaperShareButton> */}
            </Box>

            {item.comments && (
              <Box
                fontSize="12px"
                onClick={handleOpenWallItemModal}
                color="#431AB7"
              >
                {comments && comments.length
                  ? `${comments.length} comment${
                      comments.length > 1 ? 's' : ''
                    }`
                  : `0 comments`}
              </Box>
            )}
          </Box>
        )}
      </div>
      {openWallItemModal && (
        <WallItemModal
          open={openWallItemModal}
          onClose={handleCloseWallItemModal}
          item={item}
          comments={comments}
          setComments={setComments}
          creatorImage={
            processImage(item.userInfo?.imageUrl) ?? getDefaultAvatar()
          }
          imageWallIPFS={imageWallIPFS}
          videoWallIPFS={videoWallIPFS}
        />
      )}
      {openRemovePostModal && (
        <RemovePostModal
          open={openRemovePostModal}
          onClose={() => setOpenRemovePostModal(false)}
          refresh={delRefresh}
          userId={userSelector.id}
          creatorId={item.userId}
          postId={item.id}
        />
      )}
    </>
  );
}

const RemoveIcon = () => (
  <svg
    width="30"
    height="29"
    viewBox="0 0 30 29"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0.5 14.5C0.5 6.49187 6.99187 0 15 0C23.0081 0 29.5 6.49187 29.5 14.5C29.5 22.5081 23.0081 29 15 29C6.99187 29 0.5 22.5081 0.5 14.5Z"
      fill="#F0F5F8"
    />
    <path
      d="M0.5 14.5C0.5 6.49187 6.99187 0 15 0C23.0081 0 29.5 6.49187 29.5 14.5C29.5 22.5081 23.0081 29 15 29C6.99187 29 0.5 22.5081 0.5 14.5Z"
      fill="#EEF2F7"
    />
    <path
      d="M12.7332 9.16404C12.7332 8.90819 12.9406 8.70078 13.1964 8.70078H16.5629C16.8187 8.70078 17.0261 8.90819 17.0261 9.16404C17.0261 9.41989 16.8187 9.62729 16.5629 9.62729H13.1964C12.9406 9.62729 12.7332 9.41989 12.7332 9.16404Z"
      fill="#54658F"
    />
    <path
      d="M9.25879 11.4179H10.4941L11.2662 20.0654C11.2825 20.309 11.4852 20.4985 11.7295 20.4979H18.0293C18.2736 20.4985 18.4763 20.309 18.4926 20.0654L19.2647 11.4179H20.5V10.4914H9.25879V11.4179Z"
      fill="#54658F"
    />
  </svg>
);
