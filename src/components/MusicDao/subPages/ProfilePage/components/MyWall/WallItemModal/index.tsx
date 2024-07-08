import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import Moment from 'react-moment';
import { useDispatch, useSelector } from 'react-redux';
import ReactPlayer from 'react-player';
import { useHistory } from 'react-router-dom';

import { RootState } from 'store/reducers/Reducer';
import { setSelectedUser } from 'store/actions/SelectedUser';
import { GreenText } from 'components/MusicDao/index.styles';
import MorePicturesModal from './MorePicturesModal';

import { Avatar, Modal } from 'shared/ui-kit';
import Box from 'shared/ui-kit/Box';
import URL from 'shared/functions/getURL';
import { LoadingWrapper } from 'shared/ui-kit/Hocs';
import {
  getAnonAvatarUrl,
  getDefaultAvatar
} from 'shared/services/user/getUserAvatar';
import DiscordVideoFullScreen from 'shared/ui-kit/Page-components/Discord/DiscordVideoFullScreen/DiscordVideoFullScreen';
import { useAuth } from 'shared/contexts/AuthContext';
import { processImage } from 'shared/helpers';

const chatGreyIcon = require('assets/icons/message_gray.webp');
import styles from './index.module.css';

export default function WallItemModal({
  item,
  open,
  onClose,
  comments,
  setComments,
  creatorImage,
  imageWallIPFS,
  videoWallIPFS
}) {
  if (item)
    return (
      <Modal
        isOpen={open}
        theme="light"
        size="medium"
        showCloseIcon
        onClose={onClose}
        className={styles.root}
      >
        <WallPostModalContent
          item={item}
          urlMainPhoto={imageWallIPFS}
          videoUrl={videoWallIPFS}
          comments={comments}
          creatorImage={creatorImage}
          setComments={setComments}
        />
      </Modal>
    );
  else return null;
}

const ResponseWallPost = ({ response }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  return (
    <Box
      display="flex"
      alignItems="center"
      className={styles.responseContainer}
    >
      <div className={styles.userCardImageWallPost}>
        <div
          className={styles.authorPhotoWallPost}
          style={{
            backgroundImage: `url("${
              processImage(response.imageUrl) ?? getDefaultAvatar()
            }")`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            cursor: 'pointer'
          }}
          onClick={() => {
            history.push(`/profile/${response.urlSlug}`);
            dispatch(setSelectedUser(response.userId));
          }}
        />
        <Box ml="8px" className={styles.commentUserInfo}>
          <Box
            fontSize="18px"
            textOverflow="ellipsis"
            overflow="hidden"
            whiteSpace="nowrap"
            maxWidth="170px"
          >
            {response.userName}
          </Box>
          <GreenText fontSize="12px" bold className={styles.userUrlSlug}>
            @{response?.urlSlug}
          </GreenText>
        </Box>
      </div>

      <Box display="flex" flexDirection="column" alignItems="flex-end">
        <div className={styles.response}>{response.response}</div>
        <Moment fromNow>{response.date}</Moment>
      </Box>
    </Box>
  );
};

export const WallPostModalContent = ({
  item,
  onlyDisplay,
  videoUrl,
  urlMainPhoto,
  creatorImage,
  comments,
  setComments,
  user
}: {
  item: any;
  onlyDisplay?: boolean;
  videoUrl: string;
  urlMainPhoto: string;
  creatorImage: string;
  comments: any[];
  setComments: any;
  user?: any;
}) => {
  const userSelector = useSelector((state: RootState) => state.user);
  const history = useHistory();
  const { isSignedin } = useAuth();

  const [isListed, setIsListed] = useState(false);
  const [response, setResponse] = useState('');
  const [responseLoader, setResponseLoader] = useState(false);

  const [openMorePicturesModal, setOpenMorePicturesModal] =
    useState<boolean>(false);
  const handleOpenMorePicturesModal = () => {
    setOpenMorePicturesModal(true);
  };
  const handleCloseMorePicturesModal = () => {
    setOpenMorePicturesModal(false);
  };

  useEffect(() => {
    if (!onlyDisplay) {
      if (item.Catalog) {
        if (
          item.Catalog.some((listItem) => listItem.userId === userSelector.id)
        ) {
          setIsListed(true);
        }
      } else {
        setIsListed(false);
      }
    }
  }, [item]);

  const makeResponse = () => {
    if (response) {
      let body = {
        blogPostId: item.id,
        userId: userSelector.id,
        userName: userSelector.firstName,
        response: response,
        urlSlug: userSelector.urlSlug,
        imageUrl: userSelector.urlIpfsImage
      };
      setResponseLoader(true);
      Axios.post(`${URL()}/user/wall/makeResponse`, body)
        .then((response) => {
          if (response.data.success) {
            if (response.data.success) {
              let responses: any[] = [...response.data.data];
              setComments && setComments(responses);
              setResponse('');
              setResponseLoader(false);
            } else {
              setResponseLoader(false);
            }
          }
        })
        .catch((error) => {
          console.log(error);
          setResponseLoader(false);
        });
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      makeResponse();
    }
  };

  const [openModalDiscordVideoFullScreen, setOpenModalDiscordVideoFullScreen] =
    useState<boolean>(false);
  // const handleOpenModalDiscordVideoFullScreen = () => {
  //   setOpenModalDiscordVideoFullScreen(true);
  // };
  const handleCloseModalDiscordVideoFullScreen = () => {
    setOpenModalDiscordVideoFullScreen(false);
  };

  return (
    <>
      <Moment className={styles.date} fromNow>
        {!onlyDisplay ? item?.createdAt : new Date()}
      </Moment>
      {(urlMainPhoto ||
        (item.descriptionImages && item.descriptionImages.length > 0)) && (
        <Box className={styles.postImages} mt="24px">
          {urlMainPhoto && urlMainPhoto !== '' && (
            <div
              className={styles.photoPost}
              style={{
                backgroundImage: `url(${urlMainPhoto})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain',
                backgroundPosition: 'center'
              }}
            />
          )}
          {item.descriptionImages && item.descriptionImages.length > 0 && (
            <Box
              className={styles.postDescriptionImages}
              style={{
                marginLeft: urlMainPhoto && urlMainPhoto !== '' ? '4px' : 0,
                flexDirection:
                  urlMainPhoto && urlMainPhoto !== '' ? 'column' : 'row'
              }}
              width={urlMainPhoto && urlMainPhoto !== '' ? '50%' : '100%'}
            >
              {item.descriptionImages &&
                item.descriptionImages.length > 0 &&
                item.descriptionImages
                  .filter((im, ind) => ind < 2)
                  .map((image, index) => (
                    <div
                      className={styles.photoPost}
                      style={{
                        width:
                          urlMainPhoto && urlMainPhoto !== '' ? '100%' : '50%',
                        backgroundImage: image
                          ? `url(${URL()}/user/wall/getDescriptionPostPhoto/${image})`
                          : 'none',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover',
                        marginTop:
                          urlMainPhoto && urlMainPhoto !== '' && index === 1
                            ? '4px'
                            : 0,
                        marginLeft: !urlMainPhoto && index === 1 ? '4px' : 0,
                        height:
                          urlMainPhoto && urlMainPhoto !== '' ? '50%' : '100%',
                        backgroundPosition: 'center',
                        borderRadius:
                          index === 0
                            ? urlMainPhoto && urlMainPhoto !== ''
                              ? item.descriptionImages.length > 1
                                ? `0px 67px 0px 0px`
                                : `0px 67px 67px 0px`
                              : item.descriptionImages.length > 1
                              ? `67px 0px 0px 67px`
                              : `67px 67px 67px 67px`
                            : urlMainPhoto && urlMainPhoto !== ''
                            ? '0px 0px 67px 0px'
                            : `0px 67px 67px 0px`
                      }}
                    />
                  ))}
            </Box>
          )}

          {item.descriptionImages && item.descriptionImages.length > 2 && (
            <div
              className={styles.moreImages}
              style={{
                marginTop: urlMainPhoto && urlMainPhoto !== '' ? '4px' : 0,
                marginLeft: !urlMainPhoto ? '4px' : 0,
                borderRadius:
                  urlMainPhoto && urlMainPhoto !== ''
                    ? '0px 0px 67px 0px'
                    : `0px 67px 67px 0px`,
                height: urlMainPhoto && urlMainPhoto !== '' ? '50%' : '100%'
              }}
              onClick={handleOpenMorePicturesModal}
            >
              +{item.descriptionImages.length - 2}
            </div>
          )}
        </Box>
      )}

      <Box
        display="flex"
        alignItems="flex-end"
        justifyContent="space-between"
        mb={'48px'}
        flexWrap="wrap"
      >
        <Box
          className={styles.userInfo}
          onClick={() =>
            history.push(`/profile/${item.userInfo?.urlSlug ?? item.createdBy}`)
          }
        >
          <Avatar
            url={
              user === undefined
                ? creatorImage ?? getDefaultAvatar()
                : user.anon
                ? getAnonAvatarUrl(user.anonAvatar)
                : user.urlIpfsImage ?? getDefaultAvatar()
            }
            size={'large'}
          />
          <Box ml={'36px'}>
            <Box fontSize="22px" fontWeight={800}>
              {user === undefined ? item.userInfo?.name : user.name}
            </Box>
            <Box display="flex" alignItems="center" flexWrap="wrap">
              <GreenText fontSize="14px">
                @{user === undefined ? item.userInfo?.urlSlug : user.urlSlug}
              </GreenText>
            </Box>
          </Box>
        </Box>
        {item.hashtags && item.hashtags.length > 0 && (
          <Box display="flex" alignItems="center" flexWrap="wrap">
            {item.hashtags.map((hashtag, i) => {
              return (
                <div key={i} className={styles.hashtag}>
                  {hashtag}
                </div>
              );
            })}
          </Box>
        )}
      </Box>

      <Box mb="48px">
        <h3 className={styles.title}>{item.name}</h3>
        {item.textShort && <p className={styles.textShort}>{item.textShort}</p>}
        {item.descriptionArray && (
          <div
            className={styles.description}
            dangerouslySetInnerHTML={{
              __html:
                typeof item.descriptionArray === 'string'
                  ? item.descriptionArray
                  : item.description
            }}
          />
        )}
      </Box>

      {videoUrl ? (
        <Box display="flex" justifyContent="center" mt={3} mb={3}>
          <ReactPlayer
            // onClick={() => {
            //   handleOpenModalDiscordVideoFullScreen();
            // }}
            url={videoUrl}
            className={styles.reactPlayer}
            progressInterval={200}
            controls
          />
          {openModalDiscordVideoFullScreen && (
            <Modal
              size="small"
              className={styles.reactPlayerModal}
              isOpen={openModalDiscordVideoFullScreen}
              onClose={handleCloseModalDiscordVideoFullScreen}
              showCloseIcon
            >
              <DiscordVideoFullScreen
                onCloseModal={handleCloseModalDiscordVideoFullScreen}
                url={videoUrl}
              />
            </Modal>
          )}
        </Box>
      ) : null}

      <Box
        mb="48px"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        {comments && comments.length ? (
          <div className={styles.numResponsesWallPost}>
            <img src={chatGreyIcon} alt={'chat bubble'} />
            {comments.length ?? 0} comments
          </div>
        ) : (
          <div />
        )}
      </Box>

      <LoadingWrapper theme="green" loading={responseLoader}>
        <>
          {!onlyDisplay && comments && comments.length > 0 ? (
            <div className={styles.commentsSection}>
              {comments.map((item, i) => (
                <ResponseWallPost key={i} response={item} />
              ))}
            </div>
          ) : null}
          {!onlyDisplay && isSignedin ? (
            <div className={styles.inputResponseWallPost}>
              <input
                value={response}
                placeholder="Write a message..."
                onChange={(e) => {
                  let res = e.target.value;
                  setResponse(res);
                }}
                onKeyDown={handleKeyDown}
                type="text"
                disabled={onlyDisplay}
              />
              <img
                src={require('assets/icons/send_gray.webp')}
                alt={'send'}
                onClick={makeResponse}
              />
            </div>
          ) : (
            <></>
          )}
        </>
      </LoadingWrapper>
      {item.descriptionImages && item.descriptionImages.length > 2 && (
        <MorePicturesModal
          open={openMorePicturesModal}
          onClose={handleCloseMorePicturesModal}
          picturesArray={item.descriptionImages}
        />
      )}
    </>
  );
};
