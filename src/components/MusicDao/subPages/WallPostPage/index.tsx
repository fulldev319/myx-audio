import React, { useEffect, useState } from 'react';
import Moment from 'react-moment';
import Axios from 'axios';
import { useHistory, useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';

import { useTypedSelector } from 'store/reducers/Reducer';

import Box from 'shared/ui-kit/Box';
import { Avatar, Color, Modal, PrimaryButton } from 'shared/ui-kit';
import InputWithLabelAndTooltip from 'shared/ui-kit/InputWithLabelAndTooltip';
import URL from 'shared/functions/getURL';
import { LoadingWrapper } from 'shared/ui-kit/Hocs';
import DiscordVideoFullScreen from 'shared/ui-kit/Page-components/Discord/DiscordVideoFullScreen/DiscordVideoFullScreen';
import { useAlertMessage } from 'shared/hooks/useAlertMessage';
import { SharePopup } from 'shared/ui-kit/SharePopup';
import { onGetNonDecrypt } from 'shared/ipfs/get';
import { _arrayBufferToBase64 } from 'shared/functions/commonFunctions';
import useIPFS from 'shared/utils-IPFS/useIPFS';
import { getDefaultAvatar } from 'shared/services/user/getUserAvatar';
import { processImage } from 'shared/helpers';

// import { ReactComponent as HeartIcon } from "assets/icons/heart-regular.svg";
import { wallPostPageStyles } from './index.styles';

export default function WallPostPage() {
  const classes = wallPostPageStyles();
  const params: any = useParams();
  const history = useHistory();
  const user = useTypedSelector((state) => state.user);
  const { showAlertMessage } = useAlertMessage();
  const [responseLoader, setResponseLoader] = useState(false);

  const [wallItem, setWallItem] = useState<any>(null);
  const [openModalDiscordVideoFullScreen, setOpenModalDiscordVideoFullScreen] =
    useState<boolean>(false);
  const [showAllMessage, setShowAllMessage] = useState<boolean>(false);
  const [comment, setComment] = useState<string>('');

  const [openShareMenu, setOpenShareMenu] = useState<boolean>(false);
  const anchorShareMenuRef = React.useRef<HTMLDivElement>(null);

  const [imageIPFS, setImageIPFS] = useState<any>(null);
  const [videoIPFS, setVideoIPFS] = useState<any>(null);

  const { downloadWithNonDecryption } = useIPFS();

  useEffect(() => {
    if (params.id) {
      Axios.get(`${URL()}/pod/discussion/wall/getPodPost/${params.id}/TRAX`)
        .then((res) => {
          const resp = res.data;
          if (resp.success) {
            setWallItem({
              ...resp.data,
              hasPhoto: resp.data.hasPhoto,
              photoUrl: resp.data.Url,
              creatorId: resp.data.author,
              authData: resp.data.authData,
              title: resp.data.title,
              shortDescription: resp.data.shortPreviewText,
              description: resp.data.descriptionArray || resp.data.description,
              replies: resp.data.responses,
              isPinned: resp.data.pinned,
              tags: resp.data.hashtags,
              created: resp.data.createdAt,
              videos: resp.data.videos || [],
              infoImage: resp.data.infoImage,
              infoVideo: resp.data.infoVideo
            });
          } else {
            showAlertMessage('Error getting post', { variant: 'error' });
            history.goBack();
          }
        })
        .catch((error) => {
          showAlertMessage('Error getting post', { variant: 'error' });
        });
    }
  }, [params.id]);

  useEffect(() => {
    if (
      wallItem?.infoImage?.newFileCID &&
      wallItem?.infoImage?.metadata?.properties?.name
    ) {
      getImageIPFS(
        wallItem.infoImage.newFileCID,
        wallItem.infoImage.metadata.properties.name
      );
    }
    if (
      wallItem?.infoVideo?.newFileCID &&
      wallItem?.infoVideo?.metadata?.properties?.name
    ) {
      getVideoIPFS(
        wallItem.infoVideo.newFileCID,
        wallItem.infoVideo.metadata.properties.name
      );
    }
  }, [wallItem]);

  const getImageIPFS = async (cid: string, fileName: string) => {
    let files = await onGetNonDecrypt(
      cid,
      fileName,
      (fileCID, fileName, download) =>
        downloadWithNonDecryption(fileCID, fileName, download)
    );

    if (files) {
      let base64String = _arrayBufferToBase64(files.buffer);
      if (fileName?.slice(-4) === '.gif') {
        setImageIPFS('data:image/gif;base64,' + base64String);
      } else {
        setImageIPFS('data:image/png;base64,' + base64String);
      }
    }
  };

  const getVideoIPFS = async (cid: string, fileName: string) => {
    let files = await onGetNonDecrypt(
      cid,
      fileName,
      (fileCID, fileName, download) =>
        downloadWithNonDecryption(fileCID, fileName, download)
    );
    if (files) {
      let base64String = _arrayBufferToBase64(files.buffer);
      setVideoIPFS('data:video/mp4;base64,' + base64String);
    }
  };

  const addResponse = () => {
    if (comment) {
      let body = {
        userId: user.id,
        response: comment,
        postId: params.id,
        userName: `${user.firstName ?? ''} ${user.lastName ?? ''}`,
        podType: 'TRAX'
      };
      setResponseLoader(true);
      Axios.post(`${URL()}/pod/discussion/wall/makeResponse`, body)
        .then((response) => {
          if (response.data.success) {
            setComment('');
            setWallItem((prev) => ({
              ...prev,
              replies: [
                {
                  ...body,
                  date: new Date().getTime(),
                  imageUrl: user?.anon
                    ? `/assets/anonAvatars/${user?.anonAvatar}`
                    : user?.urlIpfsImage || getDefaultAvatar()
                },
                ...prev.replies
              ]
            }));
            setResponseLoader(false);
          } else {
            setResponseLoader(false);
            showAlertMessage('Error making request', { variant: 'error' });
          }
        })
        .catch((error) => {
          console.log(error);
          setResponseLoader(false);
          showAlertMessage('Error making request', { variant: 'error' });
        });
    }
  };

  const isLiked = React.useMemo(() => {
    if (wallItem?.likes) {
      return wallItem?.likes.find((item) => item === user.id);
    }

    return false;
  }, [wallItem]);

  const handleLikes = () => {
    const body = {
      userId: user.id,
      userName: user.firstName,
      postId: params.id,
      podType: 'TRAX'
    };

    const url = isLiked
      ? `${URL()}/pod/discussion/wall/removeLikePost`
      : `${URL()}/pod/discussion/wall/likePost`;
    Axios.post(url, body).then((response) => {
      if (response.data.success) {
        let data = response.data.data;

        let itemCopy = { ...wallItem };
        itemCopy.likes = data.likes;
        itemCopy.dislikes = data.dislikes;
        itemCopy.numLikes = data.numLikes;
        itemCopy.numDislikes = data.numDislikes;
        setWallItem(itemCopy);
      }
    });
  };

  return (
    <Box
      className={classes.content}
      style={{
        background: `url(${require('assets/musicDAOImages/background.webp')}`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 50%'
      }}
    >
      <LoadingWrapper loading={!Boolean(wallItem)} theme={'blue'}>
        {wallItem && (
          <Box className={classes.subContent}>
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                history.goBack();
              }}
              mt={3}
            >
              <Box>
                <ArrowIcon color={'#54658F'} />
              </Box>
              <Box
                color="#54658F"
                fontSize={14}
                fontWeight={700}
                ml="5px"
                mb="4px"
              >
                BACK
              </Box>
            </Box>
            <Box className={classes.discussionDetailBox} mt={3}>
              <Box
                className={classes.title}
                style={{
                  fontSize: '42px',
                  fontWeight: 600
                }}
              >
                {wallItem.title}
              </Box>
              <Box
                className={classes.flexBox}
                mt={3}
                justifyContent="space-between"
                pb={2}
                style={{ borderBottom: '1px solid #18181822' }}
              >
                <Box className={classes.flexBox}>
                  <Box className={classes.avatarBox}>
                    <Avatar
                      size="medium"
                      url={
                        processImage(wallItem.authData?.imageUrl) ??
                        getDefaultAvatar()
                      }
                    />
                  </Box>
                  <Box ml={2}>
                    <Box className={classes.header2}>
                      {wallItem.authData?.name}
                    </Box>
                    <Moment
                      format="ddd DD MMM, YYYY"
                      className={classes.header3}
                    >
                      {new Date(Number(wallItem.created))}
                    </Moment>
                  </Box>
                </Box>
                <Box className={classes.flexBox}>
                  {wallItem?.tags.map((item, index) => (
                    <Box key={index} className={classes.tagBox} mr={1}>
                      <Box
                        className={classes.header2}
                        style={{
                          fontSize: '10px',
                          fontWeight: 600
                        }}
                      >
                        {item}
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
              <Box
                className={classes.header2}
                mt={3}
                style={{
                  fontSize: '16px',
                  fontWeight: 500
                }}
              >
                {wallItem.shortDescription}
              </Box>
              <Box className={classes.imgBox} mt={3} height="450px">
                <img
                  src={imageIPFS}
                  width="100%"
                  height="100%"
                  style={{ objectFit: 'cover' }}
                />
              </Box>
              <Box
                className={classes.header2}
                style={{
                  marginTop: '60px',
                  marginBottom: '60px',
                  fontSize: '14px',
                  fontWeight: 500
                }}
              >
                {wallItem.description &&
                Object.keys(wallItem.description).length > 0 ? (
                  <pre
                    dangerouslySetInnerHTML={{ __html: wallItem.description }}
                  />
                ) : (
                  <></>
                )}
              </Box>
              {videoIPFS && videoIPFS !== '' ? (
                <ReactPlayer
                  /*onClick={() => {
                    setOpenModalDiscordVideoFullScreen(true);
                  }}*/
                  url={videoIPFS || ''}
                  className={classes.reactPlayer}
                  progressInterval={200}
                  controls={true}
                />
              ) : null}
              <Box
                mt={3}
                className={classes.flexBox}
                style={{
                  borderTop: '1px solid #18181822',
                  paddingTop: '20px'
                }}
              >
                {/* <Box
                  className={classes.iconBox}
                  style={{
                    width: "24px",
                  }}
                  onClick={handleLikes}
                >
                  <HeartIcon style={{ color: isLiked ? "red" : "#181818" }} />
                </Box> */}
                <div
                  className={classes.iconBox}
                  style={{
                    // marginLeft: "30px",
                    width: '20px'
                  }}
                  ref={anchorShareMenuRef}
                  onClick={() => setOpenShareMenu(true)}
                >
                  <UploadIcon />
                </div>
                <SharePopup
                  item={{ ...wallItem, id: params.id }}
                  openMenu={openShareMenu}
                  anchorRef={anchorShareMenuRef}
                  handleCloseMenu={() => setOpenShareMenu(false)}
                />
              </Box>
            </Box>
            <Box className={classes.header1} mt={3} style={{ fontWeight: 800 }}>
              User replies
            </Box>
            <Box mt={2} width={1} py={2} px={3} className={classes.whiteBox}>
              <InputWithLabelAndTooltip
                placeHolder="Type your response here..."
                type="text"
                inputValue={comment}
                onInputValueChange={(e) => setComment(e.target.value)}
                style={{
                  background: 'rgba(218, 230, 229, 0.6)',
                  borderRadius: '6px',
                  border: '1px solid #65CB63',
                  fontSize: 12
                }}
              />
              <Box className={classes.flexBox} justifyContent="flex-end" mt={1}>
                <PrimaryButton
                  size="medium"
                  onClick={addResponse}
                  style={{ background: Color.MusicDAODark, color: 'white' }}
                  isRounded
                >
                  Add Comment
                </PrimaryButton>
              </Box>
            </Box>
            <Box mt={3}>
              <LoadingWrapper theme={'blue'} loading={responseLoader}>
                {wallItem.replies
                  .filter((_, index) => showAllMessage || index < 4)
                  .map((message, index) => (
                    <Box className={classes.flexBox} key={index} mb={1}>
                      <Box className={classes.flexBox}>
                        <Box className={classes.avatarBox}>
                          <Avatar
                            size="small"
                            url={
                              processImage(message.imageUrl) ??
                              getDefaultAvatar()
                            }
                          />
                        </Box>
                        <Box ml={2}>
                          <Box className={classes.header2}>
                            {message.userName}
                          </Box>
                          <Moment
                            format="ddd DD MMM, YYYY"
                            className={classes.header3}
                            style={{ color: '#54658F' }}
                          >
                            {new Date(Number(message.date))}
                          </Moment>
                        </Box>
                      </Box>
                      <Box
                        ml={2}
                        p={2}
                        className={`${classes.whiteBox} ${classes.header4}`}
                        style={{
                          background:
                            index % 2 === 1
                              ? 'rgba(255, 255, 255, 0.5)'
                              : 'white'
                        }}
                      >
                        {message.response}
                      </Box>
                    </Box>
                  ))}
              </LoadingWrapper>
            </Box>
            {!showAllMessage && wallItem.replies.length > 4 && (
              <Box className={classes.flexBox} justifyContent="center" mt={2}>
                <Box
                  className={classes.secondButtonBox}
                  onClick={() => setShowAllMessage(true)}
                >
                  <Box className={classes.header2} mt={0.5}>
                    Show All
                  </Box>
                  <ShortArrowIcon />
                </Box>
              </Box>
            )}
          </Box>
        )}
      </LoadingWrapper>
      {openModalDiscordVideoFullScreen && (
        <Modal
          size="medium"
          className={classes.reactPlayerModal}
          isOpen={openModalDiscordVideoFullScreen}
          onClose={() => setOpenModalDiscordVideoFullScreen(false)}
          showCloseIcon
          theme="dark"
        >
          <DiscordVideoFullScreen
            onCloseModal={() => setOpenModalDiscordVideoFullScreen(false)}
            url={videoIPFS || ''}
          />
        </Modal>
      )}
    </Box>
  );
}

const ArrowIcon = ({ color = 'white' }) => (
  <svg
    width="57"
    height="15"
    viewBox="0 0 57 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.29892 0.85612L7.15468 0.716853L7.01577 0.861441L0.855773 7.27344L0.72266 7.412L0.855773 7.55056L7.01577 13.9626L7.15218 14.1045L7.29628 13.9704L8.10828 13.2144L8.25661 13.0763L8.11656 12.9298L3.56791 8.172H55.756H55.956V7.972V6.852V6.652H55.756H3.56969L8.11618 1.92261L8.25449 1.77874L8.11092 1.64012L7.29892 0.85612Z"
      fill={color}
      stroke={color}
      strokeWidth="0.4"
    />
  </svg>
);

const UploadIcon = () => {
  return (
    <svg
      width="19"
      height="24"
      viewBox="0 0 19 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.096 15.4408C9.92246 15.618 9.71279 15.7065 9.46698 15.7065C9.22116 15.7065 9.0115 15.618 8.83798 15.4408C8.66446 15.2637 8.57771 15.0595 8.57771 14.8281V4.40628L8.65362 2.87716L7.98124 3.62545L6.49551 5.19795C6.33645 5.37869 6.13402 5.46907 5.8882 5.46907C5.66408 5.46907 5.47429 5.39677 5.31885 5.25217C5.16341 5.10757 5.08569 4.92321 5.08569 4.69909C5.08569 4.48219 5.17245 4.2906 5.34596 4.12431L8.7946 0.784122C8.91751 0.668445 9.03138 0.588917 9.13621 0.545537C9.24104 0.502158 9.3513 0.480469 9.46698 0.480469C9.58266 0.480469 9.69291 0.502158 9.79774 0.545537C9.90258 0.588917 10.0164 0.668445 10.1394 0.784122L13.588 4.12431C13.7615 4.2906 13.8483 4.48219 13.8483 4.69909C13.8483 4.92321 13.7687 5.10757 13.6097 5.25217C13.4506 5.39677 13.2627 5.46907 13.0458 5.46907C12.7927 5.46907 12.5903 5.37869 12.4384 5.19795L10.9527 3.62545L10.2912 2.88801L10.3562 4.40628V14.8281C10.3562 15.0595 10.2695 15.2637 10.096 15.4408ZM17.8337 22.9942C17.2806 23.5437 16.4546 23.8184 15.3557 23.8184H9.46187H3.56742C2.47571 23.8184 1.65151 23.5437 1.09481 22.9942C0.538115 22.4448 0.259766 21.6314 0.259766 20.5542V10.4034C0.259766 9.31896 0.538115 8.50199 1.09481 7.95252C1.65151 7.40305 2.47571 7.12832 3.56742 7.12832H6.38706V8.99362H3.64334C3.15894 8.99362 2.78479 9.12195 2.5209 9.37861C2.25701 9.63527 2.12507 10.0203 2.12507 10.5336V20.424C2.12507 20.9301 2.25701 21.3115 2.5209 21.5681C2.78479 21.8248 3.15894 21.9531 3.64334 21.9531H15.2798C15.7642 21.9531 16.1401 21.8248 16.4076 21.5681C16.6751 21.3115 16.8089 20.9301 16.8089 20.424V10.5336C16.8089 10.0203 16.6751 9.63527 16.4076 9.37861C16.1401 9.12195 15.7642 8.99362 15.2798 8.99362H12.5469V7.12832H15.3557C16.4546 7.12832 17.2806 7.40486 17.8337 7.95794C18.3868 8.51103 18.6634 9.32619 18.6634 10.4034V20.5542C18.6634 21.6314 18.3868 22.4448 17.8337 22.9942Z"
        fill="#181818"
      />
    </svg>
  );
};

const ShortArrowIcon = () => {
  return (
    <svg
      width="14"
      height="11"
      viewBox="0 0 14 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.40262 10.9386C8.59347 10.9386 8.76423 10.8658 8.9149 10.7201L13.6384 6.00419C13.7941 5.85854 13.8719 5.68025 13.8719 5.46931C13.8719 5.26339 13.7941 5.0851 13.6384 4.93443L8.9375 0.241071C8.85212 0.155692 8.76549 0.0941685 8.6776 0.0565011C8.5897 0.0188337 8.49805 0 8.40262 0C8.20173 0 8.03348 0.0652902 7.89788 0.195871C7.76228 0.326451 7.69448 0.492188 7.69448 0.69308C7.69448 0.793527 7.71205 0.887695 7.74721 0.975586C7.78237 1.06348 7.83259 1.14007 7.89788 1.20536L9.50251 2.83259L11.7139 4.8545L10.0374 4.75363L1.22321 4.75363C1.01228 4.75363 0.839007 4.82017 0.703404 4.95326C0.567801 5.08636 0.5 5.25837 0.5 5.46931C0.5 5.68527 0.567801 5.85979 0.703404 5.99289C0.839007 6.12598 1.01228 6.19252 1.22321 6.19252L10.0374 6.19252L11.7203 6.09264L9.50251 8.11356L7.89788 9.74079C7.83259 9.80608 7.78237 9.88267 7.74721 9.97056C7.71205 10.0585 7.69448 10.1526 7.69448 10.2531C7.69448 10.4489 7.76228 10.6122 7.89788 10.7427C8.03348 10.8733 8.20173 10.9386 8.40262 10.9386Z"
        fill="#181818"
      />
    </svg>
  );
};
