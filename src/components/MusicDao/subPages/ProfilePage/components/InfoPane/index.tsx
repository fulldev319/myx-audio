import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

import CircularProgress from '@material-ui/core/CircularProgress';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Button from '@material-ui/core/Button';
import useTheme from '@material-ui/core/styles/useTheme';

import { RootState } from 'store/reducers/Reducer';
import { setUser } from 'store/actions/User';

import Box from 'shared/ui-kit/Box';
import { useAuth } from 'shared/contexts/AuthContext';
import * as UserConnectionsAPI from 'shared/services/API/UserConnectionsAPI';
import { LoadingWrapper } from 'shared/ui-kit/Hocs';
import {
  getAnonAvatarUrl,
  getDefaultAvatar
} from 'shared/services/user/getUserAvatar';
import InputWithLabelAndTooltip from 'shared/ui-kit/InputWithLabelAndTooltip';
import URL from 'shared/functions/getURL';
import { useUserConnections } from 'shared/contexts/UserConnectionsContext';
import useIPFS from 'shared/utils-IPFS/useIPFS';
import getIPFSURL from 'shared/functions/getIPFSURL';
import { onUploadNonEncrypt } from 'shared/ipfs/upload';
import { _arrayBufferToBase64 } from 'shared/functions/commonFunctions';
import getPhotoIPFS from 'shared/functions/getPhotoIPFS';
import { usePageRefreshContext } from 'shared/contexts/PageRefreshContext';
import SkeletonBox from 'shared/ui-kit/SkeletonBox';
import { checkObjectEmpty } from 'shared/functions/utilsMusicDao';

import ProfileFollowsModal from '../../modals/FollowingsFollowers';
import ChangeProfileBackgroundModal from '../../modals/ChangeProfileBackgroundModal/ChangeProfileBackgroundModal';
import ChangeAnonAvatarModal from '../../modals/ChangeAnonAvatarModal/ChangeAnonAvatarModal';
import { Card, profilePageStyles } from '../../index.styles';
import ImageCropModal from '../../modals/ImageCropModal';

const Default_BG = 'profile_bg_004.webp';

const arePropsEqual = (prevProps, currProps) => {
  return (
    prevProps.userProfile === currProps.userProfile &&
    prevProps.ownUser === currProps.ownUser &&
    prevProps.userId === currProps.userId &&
    prevProps.myBadges === currProps.myBadges
  );
};

const InfoPane = React.memo(
  ({
    userProfile,
    ownUser,
    userId,
    setStatus,
    myBadges,
    getUserStats,
    setUserProfile
  }: {
    userProfile: any;
    ownUser: boolean;
    userId: string;
    setStatus: any;
    myBadges: any[];
    getUserStats: () => void;
    setUserProfile: (userProfile: any) => void;
  }) => {
    const classes = profilePageStyles();
    const dispatch = useDispatch();

    const { followUser, unfollowUser, isUserFollowed } = useUserConnections();
    const [isFollowing, setIsFollowing] = React.useState<number>(0);

    const user = useSelector((state: RootState) => state.user);
    const { isSignedin } = useAuth();

    const theme = useTheme();
    const isTablet = useMediaQuery(theme.breakpoints.down('sm'));

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoadingFollows, setIsLoadingFollows] = useState(false);
    const [isLoadingUser, setIsLoadingUser] = useState(false);

    const [openModalFollows, setOpenModalFollows] = useState(false);
    const [openModalChangeBG, setOpenModalChangeBG] = useState(false);
    const [openModalChangeAnonAvatar, setOpenModalChangeAnonAvatar] =
      useState(false);
    const [selectedListFollows, setSelectedListFollows] = useState<any[]>([]);
    const [selectedHeaderFollows, setSelectedHeaderFollows] = useState<
      'Followings' | 'Followers'
    >('Followers');
    const [profileBG, setProfileBG] = useState<string>(Default_BG);
    const [anonAvatar, setAnonAvatar] = useState<string>('');

    const inputRef = useRef<any>();

    const {
      setMultiAddr,
      uploadWithNonEncryption,
      downloadWithNonDecryption,
      isIPFSAvailable
    } = useIPFS();

    const [imageIPFS, setImageIPFS] = useState<any>(null);

    const { profileAvatarChanged, setProfileAvatarChanged } =
      usePageRefreshContext();

    const [openAvartaImageCropModal, setOpenAvartaImageCropModal] =
      useState<boolean>(false);
    const [imageFile, setImageFile] = useState<any>();

    useEffect(() => {
      setMultiAddr(`${getIPFSURL()}/api/v0`);
    }, []);

    useEffect(() => {
      if (userId) {
        setIsFollowing(isUserFollowed(userId));
      }
    }, [userId, isUserFollowed]);

    useEffect(() => {
      if (isIPFSAvailable && Object.entries(userProfile).length) {
        setImageIPFS(null);
        getPhotoUser();
      } else if (!Object.entries(userProfile).length) {
        setImageIPFS(getDefaultAvatar());
      }
    }, [
      isIPFSAvailable,
      userProfile.anonAvatar,
      userProfile?.infoImage?.newFileCID,
      profileAvatarChanged
    ]);

    const getPhotoUser = async () => {
      if (userProfile?.infoImage?.urlIpfsImage) {
        setImageIPFS(userProfile.infoImage.urlIpfsImage);
      } else if (
        userProfile?.infoImage?.newFileCID &&
        userProfile?.infoImage?.metadata?.properties?.name
      ) {
        setImageIPFS(
          await getPhotoIPFS(
            userProfile.infoImage.newFileCID,
            userProfile.infoImage.metadata.properties.name,
            downloadWithNonDecryption
          )
        );
      } else {
        setImageIPFS(getDefaultAvatar());
      }
    };

    useEffect(() => {
      if (user.backgroundURL) {
        setProfileBG(user.backgroundURL.replace('.jpeg', '.webp'));
      }

      if (user.anonAvatar) {
        setAnonAvatar(
          require(`assets/anonAvatars/${user.anonAvatar.replace(
            '.jpg',
            '.webp'
          )}`)
        );
      }
    }, [user.backgroundURL, user.anonAvatar]);

    useEffect(() => {
      getFollowers();
    }, [userId, ownUser]);

    const handleOpenModalFollows = () => {
      setOpenModalFollows(true);
    };
    const handleCloseModalFollows = () => {
      setOpenModalFollows(false);
    };

    const handleOpenModalChangeBG = () => {
      if (ownUser) {
        setOpenModalChangeBG(true);
      }
    };
    const handleCloseModalChangeBG = () => {
      setOpenModalChangeBG(false);
    };

    const handleOpenModalChangeAnonAvatar = () => {
      setOpenModalChangeAnonAvatar(true);
    };
    const handleCloseModalChangeAnonAvatar = () => {
      setOpenModalChangeAnonAvatar(false);
    };

    const showFollowersList = async () => {
      if (!isSignedin || !ownUser) return;

      setSelectedHeaderFollows('Followers');
      handleOpenModalFollows();

      await getFollowers();
    };

    const showFollowingList = async () => {
      if (!isSignedin || !ownUser) return;

      setSelectedHeaderFollows('Followings');
      handleOpenModalFollows();

      await getFollowing();
    };

    const getFollowing = async () => {
      try {
        setIsLoadingFollows(true);
        const following = (await UserConnectionsAPI.getFollowings(
          userId,
          ownUser
        )) as any[];
        setSelectedListFollows(following || []);
      } catch (error) {
        setStatus({
          msg: 'Error getting followers',
          key: Math.random(),
          variant: 'error'
        });
      }
      setIsLoadingFollows(false);
    };

    const getFollowers = async () => {
      try {
        setIsLoadingFollows(true);
        const followers = (await UserConnectionsAPI.getFollowers(
          userId,
          ownUser
        )) as any[];
        setSelectedListFollows(followers || []);
      } catch (error) {
        setStatus({
          msg: 'Error getting followers',
          key: Math.random(),
          variant: 'error'
        });
      }
      setIsLoadingFollows(false);
    };

    const fileInput = (e) => {
      e.preventDefault();
      const files = e.target.files;
      if (files.length) {
        // handleFiles(files);
        setImageFile(files[0]);
        setOpenAvartaImageCropModal(true);
      }
    };

    const handleImage = async (file: any) => {
      // if (validateFile(files[0])) {
      let metadataID = await onUploadNonEncrypt(file, (file) =>
        uploadWithNonEncryption(file)
      );

      axios
        .post(
          `${URL()}/user/changeProfilePhoto/saveMetadata/${user.id}`,
          metadataID
        )
        .then((res) => {
          if (res.data.data) {
            setUserProfile({
              ...userProfile,
              infoImage: {
                ...res.data.data,
                urlIpfsImage: res.data.data.urlIpfsImage
              }
            });
            let setterUser: any = user;
            setterUser.infoImage = res.data.data;
            if (res.data.data.urlIpfsImage) {
              setterUser.urlIpfsImage = res.data.data.urlIpfsImage;
            }
            setterUser.hasPhoto = true;
            if (setterUser.id) {
              dispatch(setUser(setterUser));
            }
            setProfileAvatarChanged(Date.now());
          }
        })
        .catch((error) => {
          console.log('Error', error);
          setStatus({
            msg: 'Error change user profile photo',
            key: Math.random(),
            variant: 'error'
          });
        });
      // } else {
      //   files[0]["invalid"] = true;
      // }
    };

    // const handleImage = async (file: any) => {
    //   let metadataID = await onUploadNonEncrypt(file, file => uploadWithNonEncryption(file));

    //   axios
    //     .post(`${URL()}/user/changeProfilePhoto/saveMetadata/${user.id}`, metadataID)
    //     .then(async res => {
    //       if (res.data.data) {
    //         let setterUser: any = {
    //           ...user,
    //           infoImage: res.data.data.body,
    //           urlIpfsImage: res.data.data.urlIpfsImage,
    //         };

    //         setterUser.hasPhoto = true;
    //         if (setterUser.id) {
    //           if (setterUser?.infoImage?.newFileCID && setterUser?.infoImage?.metadata?.properties?.name) {
    //             setterUser.ipfsImage = await getPhotoIPFS(
    //               setterUser.infoImage.newFileCID,
    //               setterUser.infoImage.metadata.properties.name,
    //               downloadWithNonDecryption
    //             );
    //           }
    //           dispatch(setUser(setterUser));
    //         }
    //         setProfileAvatarChanged(Date.now());
    //       }
    //     })
    //     .catch(error => {
    //       console.log("Error", error);
    //       setStatus({
    //         msg: "Error change user profile photo",
    //         key: Math.random(),
    //         variant: "error",
    //       });
    //     });
    // };

    const validateFile = (file) => {
      const validTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/x-icon'
      ];
      if (validTypes.indexOf(file.type) === -1) {
        return false;
      }
      return true;
    };

    const onFollowUser = (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (!userId) return;

      setIsLoading(true);
      if (!isFollowing) {
        followUser(userId, true).then((_) => {
          setIsFollowing(2);
          setIsLoading(false);
        });
      } else {
        unfollowUser(userId).then((_) => {
          setIsFollowing(0);
          setIsLoading(false);
        });
      }
    };

    const userName = React.useMemo(() => {
      const user = userProfile.urlSlug ?? userProfile.id ?? userId ?? '';
      return user.length > 17
        ? user.substr(0, 13) + '...' + user.substr(user.length - 3, 3)
        : user;
    }, [userProfile]);

    return (
      <Card noPadding>
        <div
          className={classes.header}
          onClick={handleOpenModalChangeBG}
          style={{
            backgroundImage: profileBG
              ? `url(${require(`assets/backgrounds/profile/${profileBG}`)})`
              : '',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <SkeletonBox
          className={classes.avatar}
          style={{
            cursor: ownUser ? 'pointer' : 'auto',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
          image={
            userProfile.anon
              ? getAnonAvatarUrl(userProfile.anonAvatar)
              : imageIPFS
          }
          loading={userProfile.anon ? !userProfile.anonAvatar : !imageIPFS}
          onClick={() => {
            if (ownUser) {
              if (userProfile.anon) {
                handleOpenModalChangeAnonAvatar();
              } else {
                if (inputRef && inputRef.current) {
                  inputRef.current.value = '';
                  inputRef.current.click();
                }
              }
            }
          }}
        />
        <InputWithLabelAndTooltip
          hidden
          type="file"
          style={{ display: 'none' }}
          accept="image/*"
          onInputValueChange={fileInput}
          reference={inputRef}
        />
        <LoadingWrapper loading={!Object.keys(userProfile).length}>
          <Box className={classes.infoPaneMain}>
            <Box
              display="flex"
              flexDirection={isTablet ? 'column' : 'row'}
              justifyContent="space-between"
            >
              <Box
                flex={1}
                mr={isTablet ? 0 : 9}
                mb={isTablet ? 3 : 0}
                maxWidth={isTablet ? '100%' : '50%'}
              >
                <Box display="flex" justifyContent="space-between">
                  <Box display="flex" flexDirection="column">
                    {userProfile?.twitterVerified && (
                      <Box display="flex" alignItems="center">
                        <img
                          src={require('assets/icons/verified_filled_gradient.webp')}
                          style={{ marginRight: '4px' }}
                        />
                        <div className={classes.verify}>VERIFIED PROFILE</div>
                      </Box>
                    )}
                    <Box className={classes.userName}>
                      {`${
                        userProfile.name ??
                        `${userProfile.firstName || ''} ${
                          userProfile.lastName || ''
                        }`
                      }`}
                      {userProfile?.artistId ? `#${userProfile?.artistId}` : ''}
                    </Box>
                    {userName && (
                      <Box
                        fontWeight={800}
                        fontSize={16}
                        color="#65CB63"
                      >{`@${userName}`}</Box>
                    )}
                    <Box
                      mt={2}
                      fontSize={14}
                      fontWeight={400}
                      color="#2D3047"
                      whiteSpace="pre-wrap"
                      style={{
                        overflow: 'auto',
                        maxHeight: 200
                      }}
                    >
                      {userProfile.bio}
                    </Box>
                  </Box>
                  {isSignedin &&
                    (isLoading ? (
                      <CircularProgress style={{ color: '#B1FF00' }} />
                    ) : (
                      !ownUser && (
                        <Button
                          className={classes.followButton}
                          onClick={onFollowUser}
                        >
                          {isFollowing === 0
                            ? 'Follow'
                            : isFollowing === 1
                            ? 'Cancel request'
                            : 'Unfollow'}
                        </Button>
                      )
                    ))}
                </Box>
              </Box>
              <Box flex={1}>
                <div className={classes.statLine}>
                  {isLoadingUser ? (
                    <CircularProgress style={{ color: '#B1FF00' }} />
                  ) : (
                    <>
                      <div
                        onClick={showFollowersList}
                        style={{
                          cursor:
                            !localStorage.getItem('userId') || !ownUser
                              ? 'auto'
                              : 'pointer'
                        }}
                      >
                        <Box
                          fontSize={14}
                          fontWeight={400}
                          color={'#2D3047'}
                          mb={1}
                          whiteSpace="nowrap"
                        >
                          🌟 Followers
                        </Box>
                        <SkeletonBox
                          loading={checkObjectEmpty(userProfile)}
                          fontSize={35}
                          color={'#2D3047'}
                          fontWeight={800}
                          display="flex"
                          height={46}
                          width={1}
                        >
                          {userProfile.numFollowers || 0}
                        </SkeletonBox>
                      </div>
                      <div
                        onClick={showFollowingList}
                        style={{
                          cursor:
                            !localStorage.getItem('userId') || !ownUser
                              ? 'auto'
                              : 'pointer'
                        }}
                      >
                        <Box
                          fontSize={14}
                          fontWeight={400}
                          color={'#2D3047'}
                          mb={1}
                          whiteSpace="nowrap"
                        >
                          💫 Following
                        </Box>
                        <SkeletonBox
                          loading={checkObjectEmpty(userProfile)}
                          fontSize={35}
                          color={'#2D3047'}
                          fontWeight={800}
                          display="flex"
                          height={46}
                          width={1}
                        >
                          {userProfile.numFollowings || 0}
                        </SkeletonBox>
                      </div>
                    </>
                  )}
                </div>
                <div className={classes.socialIcons}>
                  {userProfile?.twitter && (
                    <Box
                      className={classes.socialButton}
                      mr={2}
                      onClick={() => {
                        window.open(
                          `https://twitter.com/${userProfile?.twitter}`,
                          '_blank'
                        );
                      }}
                    >
                      <img
                        src={require('assets/icons/social_twitter.webp')}
                        alt="twitter"
                      />
                    </Box>
                  )}
                  {userProfile?.instagram && (
                    <Box
                      className={classes.socialButton}
                      mr={2}
                      onClick={() => {
                        window.open(
                          `https://www.instagram.com/${userProfile?.instagram}`,
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
                  {userProfile?.tiktok && (
                    <Box
                      className={classes.socialButton}
                      mr={2}
                      onClick={() => {
                        window.open(
                          `https://www.tiktok.com/${userProfile?.tiktok}`,
                          '_blank'
                        );
                      }}
                    >
                      <img
                        src={require('assets/snsIcons/tiktok_round.webp')}
                        alt="tiktok"
                      />
                    </Box>
                  )}
                  {userProfile?.youtube && (
                    <Box
                      className={classes.socialButton}
                      mr={2}
                      onClick={() => {
                        window.open(
                          `https://www.youtube.com/user/${userProfile?.youtube}`,
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
                  {/* {userProfile?.spotify && (
                    <Box
                      className={classes.socialButton}
                      mr={2}
                      style={{
                        background:
                          "linear-gradient(0deg, #1ed760, #1ed760), radial-gradient(93.71% 93.71% at -0.18% 88.78%, #FFC050 0%, #AE3AA3 57%, #5459CA 100%)",
                      }}
                      ml={1}
                      onClick={() => {
                        window.open(`https://open.spotify.com/user/${userProfile?.spotify}`, "_blank");
                      }}
                    >
                      <SpotifyIcon />
                    </Box>
                  )} */}
                  {/* {userProfile?.facebook && (
                  <Box
                    mr={2}
                    onClick={() => {
                      window.open(`https://www.facebook.com/${userProfile?.facebook}`, "_blank");
                    }}
                  >
                    <img src={require("assets/icons/social_facebook.webp")} alt="facebook" />
                  </Box>
                )} */}
                </div>
                {/* <Box display="flex" flexDirection="row" justifyContent="flex-end" mt={5}>
                <PrimaryButton
                  size="medium"
                  // onClick={handleOpenEditProfileModal}
                  className={classes.manageButton}
                >
                  Go to Wall
                </PrimaryButton>
              </Box> */}
              </Box>
            </Box>
          </Box>
        </LoadingWrapper>
        {openModalChangeBG && (
          <ChangeProfileBackgroundModal
            open={openModalChangeBG}
            onClose={handleCloseModalChangeBG}
          />
        )}
        {openModalChangeAnonAvatar && (
          <ChangeAnonAvatarModal
            open={openModalChangeAnonAvatar}
            onClose={handleCloseModalChangeAnonAvatar}
          />
        )}
        {openModalFollows && (
          <ProfileFollowsModal
            open={openModalFollows}
            onClose={handleCloseModalFollows}
            header={selectedHeaderFollows}
            list={selectedListFollows}
            refreshFollowers={getFollowers}
            refreshFollowings={getFollowing}
            isLoadingFollows={isLoadingFollows}
            ownUser={ownUser}
            userProfile={userProfile}
            userId={userId}
          />
        )}
        {openAvartaImageCropModal && (
          <ImageCropModal
            imageFile={imageFile}
            open={openAvartaImageCropModal}
            aspect={3 / 3}
            onClose={() => setOpenAvartaImageCropModal(false)}
            setCroppedImage={(file) => {
              handleImage(file);
            }}
          />
        )}
      </Card>
    );
  },
  arePropsEqual
);

const SpotifyIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 1333.33 1333.3"
    shape-rendering="geometricPrecision"
    text-rendering="geometricPrecision"
    image-rendering="optimizeQuality"
    fill-rule="evenodd"
    clip-rule="evenodd"
  >
    <path
      d="M666.66 0C298.48 0 0 298.47 0 666.65c0 368.19 298.48 666.65 666.66 666.65 368.22 0 666.67-298.45 666.67-666.65C1333.33 298.49 1034.88.03 666.65.03l.01-.04zm305.73 961.51c-11.94 19.58-37.57 25.8-57.16 13.77-156.52-95.61-353.57-117.26-585.63-64.24-22.36 5.09-44.65-8.92-49.75-31.29-5.12-22.37 8.84-44.66 31.26-49.75 253.95-58.02 471.78-33.04 647.51 74.35 19.59 12.02 25.8 37.57 13.77 57.16zm81.6-181.52c-15.05 24.45-47.05 32.17-71.49 17.13-179.2-110.15-452.35-142.05-664.31-77.7-27.49 8.3-56.52-7.19-64.86-34.63-8.28-27.49 7.22-56.46 34.66-64.82 242.11-73.46 543.1-37.88 748.89 88.58 24.44 15.05 32.16 47.05 17.12 71.46V780zm7.01-189.02c-214.87-127.62-569.36-139.35-774.5-77.09-32.94 9.99-67.78-8.6-77.76-41.55-9.98-32.96 8.6-67.77 41.56-77.78 235.49-71.49 626.96-57.68 874.34 89.18 29.69 17.59 39.41 55.85 21.81 85.44-17.52 29.63-55.89 39.4-85.42 21.8h-.03z"
      fill="white"
      fill-rule="nonzero"
    />
  </svg>
);

export default InfoPane;
