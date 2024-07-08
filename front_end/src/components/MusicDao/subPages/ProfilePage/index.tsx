import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import Axios from 'axios';
import { useLocation, useParams, useHistory } from 'react-router-dom';

import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import useTheme from '@material-ui/core/styles/useTheme';
import withStyles from '@material-ui/core/styles/withStyles';
import MenuItem from '@material-ui/core/MenuItem';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Grid from '@material-ui/core/Grid';

import { PrimaryButton, SecondaryButton } from 'shared/ui-kit';
import Box from 'shared/ui-kit/Box';
import URL from 'shared/functions/getURL';
import { useAlertMessage } from 'shared/hooks/useAlertMessage';
import { sumTotalViews } from 'shared/functions/totalViews';
import { setSelectedUser } from 'store/actions/SelectedUser';
import { setUser } from 'store/actions/User';
import { LoadingWrapper } from 'shared/ui-kit/Hocs';
import { socket } from 'components/Login/Auth';
import { getUser } from 'store/selectors';
import { profilePageStyles } from './index.styles';
import { useShareMedia } from 'shared/contexts/ShareMediaContext';
import { ReactComponent as ShareIcon } from 'assets/icons/share_filled.svg';
import Loading from 'shared/ui-kit/Loading';
import CopyRights from "./components/Copyrights";
import Feed from "./components/Feed";
import MyWall from "./components/MyWall";
import InfoPane from "./components/InfoPane";
import ProfileEditModal from "./modals/ProfileEdit";
import Songs from "./components/Songs";
import Merch from "./components/Merch";
import VerifyProfileModal from "components/MusicDao/modals/VerifyProfileModal";
import Wip from "./components/Wip";

// const CopyRights = () => import('./components/Copyrights'));
// const Feed = lazy(() => import('./components/Feed'));
// const MyWall = lazy(() => import('./components/MyWall'));
// const InfoPane = lazy(() => import('./components/InfoPane'));
// const ProfileEditModal = lazy(() => import('./modals/ProfileEdit'));
// const Songs = lazy(() => import('./components/Songs'));
// const VerifyProfileModal = lazy(
//   () => import('components/MusicDao/modals/VerifyProfileModal')
// );
// const Wip = lazy(() => import('./components/Wip'));

const profileTabs = ['Music', 'Ownership', 'Feed', 'Wall'];

const ProfilePage = () => {
  const classes = profilePageStyles();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  const params: any = useParams();

  const [userProfile, setUserProfile] = useState<any>({});
  const [userId, setUserId] = React.useState<string>('');
  const [ownUser, setOwnUser] = useState<boolean>(false);
  const [musicUser, setMusicUser] = useState<boolean>();
  const [openEditProfileModal, setOpenEditProfileModal] =
    useState<boolean>(false);

  // STORE
  const userSelector = useSelector(getUser);
  // HOOKS
  const { showAlertMessage } = useAlertMessage();

  // TABS
  const [myBadges, setMyBadges] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<
    typeof profileTabs[number] | undefined
  >(profileTabs[0]);
  const scrollRef = useRef<any>();

  const [openShareMenu, setOpenShareMenu] = React.useState<boolean>(false);
  const anchorShareMenuRef = React.useRef<HTMLButtonElement>(null);
  const { shareMediaToSocial, shareMediaWithQrCode } = useShareMedia();

  const [openVerifyProfileModal, setOpenVerifyProfileModal] =
    useState<boolean>(false);

  useEffect(() => {
    setMusicUser(undefined);
    setUserProfile({});
    if (params.userSlug) {
      if (params.userSlug && !params.userSlug.includes('Px')) {
        Axios.get(`${URL()}/user/getIdFromSlug/${params.userSlug}/user`)
          .then((response) => {
            if (response.data.success) {
              const id = response.data.data.id;
              setUserId(id);
            } else {
              Axios.get(
                `${URL()}/user/getIdFromSlug/${params.userSlug}/mediaUsers`
              )
                .then((response) => {
                  if (response.data.success) {
                    const id = response.data.data.id;
                    setUserId(id);
                  } else {
                    setUserId(params.userSlug);
                  }
                })
                .catch((error) => {
                  console.log(error);
                });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else if (params.userSlug) {
        setUserId(params.userSlug);
      }
    }
  }, [params.userSlug]);

  useEffect(() => {
    if (userId && userId.length > 0 && userId !== userSelector.id) {
      if (socket) {
        socket.on('user_connect_status', (connectStatus) => {
          if (connectStatus.userId === userId) {
            let setterUser: any = { ...userProfile };
            setterUser.connected = connectStatus.connected;
            setUserProfile(setterUser);
          }
        });
      }
    }
  }, [userId, userProfile.id]);

  useEffect(() => {
    if (userId && userSelector.id) {
      setOwnUser(userId === userSelector.id);
      if (location.state) {
        setActiveTab(profileTabs[2]);
      } else {
        setActiveTab(profileTabs[0]);
      }
    }
  }, [userId, userSelector.id, location]);

  useEffect(() => {
    if (userId && userId.length > 0) {
      Axios.get(`${URL()}/user/checkIfUserExists/${userId}`)
        .then((response) => {
          if (response.data.success) {
            if (response.data.isMusic) {
              sumTotalViews({
                userId: userId,
                ProfileAddress: true
              });
            }
            setMusicUser(response.data.isMusic);
          } else {
            showAlertMessage(`There is no found registered user.`, {
              variant: 'error'
            });
            history.push('/profile/notFound');
          }
        })
        .catch((error) => {
          console.log(error);
          showAlertMessage(error.toString(), { variant: 'error' });
        });
    }
  }, [userId]);

  useEffect(() => {
    if (musicUser) {
      // BasicInfo
      getBasicInfo(userId, userSelector.id === userId);

      getmyStats();
    } else if (musicUser === false) {
      setActiveTab(profileTabs[1]);
    }
  }, [userId, musicUser]);

  useEffect(() => {
    if (userSelector.id && userSelector.id === userProfile.id) {
      setUserProfile((prev) => ({
        ...prev,
        twitterVerified: userSelector.twitterVerified
      }));
    }
  }, [userSelector.twitterVerified, setUserProfile]);

  const setUserSelector = (setterUser) => {
    if (setterUser.id) {
      dispatch(setSelectedUser(setterUser.id, setterUser.address));
      if (ownUser) {
        dispatch(setUser(setterUser));
      }
    }
  };

  const getBasicInfo = async (userId, ownUser) => {
    if (userId) {
      try {
        const response = await Axios.get(
          `${URL()}/user/getBasicInfo/${userId}`
        );
        if (response.data.success) {
          let data = response.data.data;
          let nameSplit = data.name.split(' ');
          let lastNameArray = nameSplit.filter((_, i) => {
            return i !== 0;
          });
          let firstName = nameSplit[0];
          let lastName = '';
          for (let i = 0; i < lastNameArray.length; i++) {
            if (lastNameArray.length === i + 1) {
              lastName = lastName + lastNameArray[i];
            } else {
              lastName = lastName + lastNameArray[i] + ' ';
            }
          }
          let setterUser: any = { ...data, id: userId, firstName, lastName };

          if (!setterUser.badges) {
            setterUser.badges = [];
          }
          if (!setterUser.connected) {
            setterUser.connected = false;
          }
          if (!setterUser.urlSlug) {
            setterUser.urlSlug = data.firstName ?? data.name;
          }
          setUserProfile(setterUser);
          if (ownUser) {
            setUserSelector(setterUser);
          }
        }
      } catch (error) {
        showAlertMessage(`Error getting basic info.`, { variant: 'error' });
      }
    }
  };

  const getmyStats = () => {
    axios
      .get(`${URL()}/user/getUserCounters/${userId}`)
      .then((response) => {
        const resp = response.data;
        if (resp.success) {
          const { badges, ...others } = resp.data;
          setMyBadges(badges);
        } else {
          setMyBadges([]);
        }
      })
      .catch((_) => {
        showAlertMessage(`Error getting user stats`, { variant: 'error' });
      });
  };

  const handleOpenEditProfileModal = () => {
    setOpenEditProfileModal(true);
  };

  const handleCloseEditProfileModal = () => {
    setOpenEditProfileModal(false);
  };

  const toggleAnonymousMode = (anonBool) => {
    const body = {
      userId: userId,
      anonMode: anonBool
    };

    axios
      .post(`${URL()}/user/changeAnonMode`, body)
      .then((response) => {
        if (response.data.success) {
          //update redux user aswell
          const user = { ...userSelector };
          user.anon = anonBool;
          setUserSelector(user);
        } else {
          console.log('User change anon mode failed');
        }
      })
      .catch((error) => {
        console.log(error);
        showAlertMessage('Error handling anonymous mode update');
      });
  };

  const handleOpenShareMenu = () => {
    setOpenShareMenu(true);
  };

  const handleCloseShareMenu = (event: React.MouseEvent<EventTarget>) => {
    if (
      anchorShareMenuRef.current &&
      anchorShareMenuRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpenShareMenu(false);
  };

  function handleListKeyDownShareMenu(event: React.KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpenShareMenu(false);
    }
  }

  const handleOpenQRCodeModal = () => {
    const link = `profile/${params.userSlug}`;
    shareMediaWithQrCode(params.userSlug, link);
  };

  const handleOpenShareModal = () => {
    const link = `profile/${params.userSlug}`;
    shareMediaToSocial(params.userSlug, 'Profile', 'NEW-MUSIC-PROFILE', link);
  };

  const handleVerifyProfileModal = () => {
    setOpenVerifyProfileModal(true);
  };

  return (
    <Suspense fallback={<Loading />}>
      <div
        className={classes.mainContent}
        ref={scrollRef}
        style={{ position: 'relative' }}
        id="profile-infite-scroll"
      >
        <Box className={classes.content}>
          <Box
            display="flex"
            color="#181818"
            alignItems="center"
            justifyContent="space-between"
            fontSize={30}
            fontWeight={400}
            mb={3}
            flexWrap="wrap"
            gridRowGap={10}
            gridColumnGap={25}
            position="relative"
          >
            <Box className={classes.headerTitle}>
              {ownUser && <b>My</b>} Profile
            </Box>
            <Box
              display="flex"
              alignItems="center"
              gridColumnGap={2}
              flexDirection={isMobile ? 'column' : 'row'}
              width={isMobile ? '100%' : 'unset'}
            >
              <SecondaryButton
                ref={anchorShareMenuRef}
                size="medium"
                onClick={handleOpenShareMenu}
                className={classes.shareButton}
              >
                <ShareIcon />
                Share
              </SecondaryButton>
              {openShareMenu && (
                <Popper
                  open={openShareMenu}
                  anchorEl={anchorShareMenuRef.current}
                  transition
                  disablePortal={false}
                  style={{ position: 'inherit' }}
                  placement="left"
                >
                  {({ TransitionProps, placement }) => (
                    <Grow
                      {...TransitionProps}
                      style={{
                        // transformOrigin: placement === "bottom" ? "center top" : "center bottom",
                        position: 'inherit'
                      }}
                    >
                      <Paper className={classes.paper}>
                        <ClickAwayListener onClickAway={handleCloseShareMenu}>
                          <MenuList
                            autoFocusItem={openShareMenu}
                            id="menu-list-grow"
                            onKeyDown={handleListKeyDownShareMenu}
                          >
                            <CustomMenuItem onClick={handleOpenShareModal}>
                              <img
                                src={require('assets/icons/butterfly.webp')}
                                alt={'spaceship'}
                                style={{
                                  width: 20,
                                  height: 20,
                                  marginRight: 5
                                }}
                              />
                              Share on social media
                            </CustomMenuItem>
                            <CustomMenuItem onClick={handleOpenQRCodeModal}>
                              <img
                                src={require('assets/icons/qrcode_small.webp')}
                                alt={'spaceship'}
                                style={{
                                  width: 20,
                                  height: 20,
                                  marginRight: 5
                                }}
                              />
                              Share With QR Code
                            </CustomMenuItem>
                          </MenuList>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
              )}
              {ownUser && !userSelector?.twitterVerified && (
                <SecondaryButton
                  size="medium"
                  onClick={handleVerifyProfileModal}
                  className={classes.shareButton}
                  style={{
                    marginLeft: isMobile ? 0 : 8,
                    marginTop: isMobile ? 8 : 0
                  }}
                >
                  <VerifyIcon />
                  Verify Profile
                </SecondaryButton>
              )}
              {ownUser && (
                <PrimaryButton
                  size="medium"
                  onClick={handleOpenEditProfileModal}
                  className={classes.manageButton}
                  style={{
                    marginLeft: isMobile ? 0 : 8,
                    marginTop: isMobile ? 8 : 0
                  }}
                >
                  Edit Profile
                </PrimaryButton>
              )}
              {/* {ownUser && (
            <PrimaryButton size="medium" onClick={() => {}} className={classes.manageButton}>
              Create Content
            </PrimaryButton>
          )} */}
            </Box>
          </Box>
          <Grid container spacing={5} style={{ position: 'relative' }}>
            <Grid item xs={12} md={12}>
              <InfoPane
                userProfile={userProfile}
                ownUser={ownUser}
                userId={userId}
                setStatus={() => {}}
                myBadges={myBadges}
                getUserStats={getmyStats}
                setUserProfile={setUserProfile}
              />
            </Grid>
          </Grid>
          <div
            className={classes.tableSection}
            style={{ position: 'relative' }}
          >
            {musicUser && userProfile.id && (
              <>
                <Box
                  className={`${classes.tabItem} ${
                    activeTab === profileTabs[0] ? classes.tabItemActive : ''
                  }`}
                  onClick={() => setActiveTab(profileTabs[0])}
                >
                  {profileTabs[0]}
                </Box>
                <Box
                  className={`${classes.tabItem} ${
                    activeTab === profileTabs[1] ? classes.tabItemActive : ''
                  }`}
                  onClick={() => setActiveTab(profileTabs[1])}
                >
                  {profileTabs[1]}
                </Box>
                {ownUser && (
                  <Box
                    className={`${classes.tabItem} ${
                      activeTab === profileTabs[2] ? classes.tabItemActive : ''
                    }`}
                    onClick={() => setActiveTab(profileTabs[2])}
                  >
                    {profileTabs[2]}
                  </Box>
                )}
                <Box
                  className={`${classes.tabItem} ${
                    activeTab === profileTabs[3] ? classes.tabItemActive : ''
                  }`}
                  onClick={() => setActiveTab(profileTabs[3])}
                >
                  {profileTabs[3]}
                </Box>
                <Box
                  className={`${classes.tabItem} ${
                    activeTab === profileTabs[4] ? classes.tabItemActive : ''
                  }`}
                  onClick={() => setActiveTab(profileTabs[4])}
                >
                  {profileTabs[4]}
                </Box>
                {/* {ownUser && (
                  <Box
                    display="flex"
                    alignItems="center"
                    className={`${classes.tabItem} ${
                      activeTab === profileTabs[4] ? classes.tabItemActive : ''
                    }`}
                    onClick={() => setActiveTab(profileTabs[4])}
                  >
                    <span>{profileTabs[4]} (&nbsp; </span>
                    <Box mb="2px">
                      <ClockIcon />
                    </Box>
                    <span> &nbsp;)</span>
                  </Box>
                )} */}
              </>
            )}
          </div>
          <Box mb={4} position="relative">
            <LoadingWrapper
              loading={musicUser === undefined || !userProfile.id}
            >
              {activeTab === profileTabs[0] ? (
                <Songs userProfile={userProfile} ownUser={ownUser} />
              ) : activeTab === profileTabs[1] ? (
                <CopyRights userId={userId} userProfile={userProfile} />
              ) : activeTab === profileTabs[2] && ownUser ? (
                <Feed userId={userId} />
              ) : activeTab === profileTabs[3] ? (
                <MyWall userId={userId} userProfile={userProfile} />
              ) : activeTab === profileTabs[4] ? (
                <Merch userProfile={userProfile} ownUser={ownUser} />
              ) : activeTab === profileTabs[5] ? (
                <>
                  <Wip userId={userId} userProfile={userProfile} />
                </>
              ) : null}
            </LoadingWrapper>
          </Box>
        </Box>

        {ownUser && openEditProfileModal && (
          <ProfileEditModal
            getBasicInfo={getBasicInfo}
            open={openEditProfileModal}
            toggleAnonymousMode={toggleAnonymousMode}
            onCloseModal={handleCloseEditProfileModal}
            handleVerifyProfileModal={handleVerifyProfileModal}
          />
        )}
        {ownUser && openVerifyProfileModal && (
          <VerifyProfileModal
            open={openVerifyProfileModal}
            onClose={() => setOpenVerifyProfileModal(false)}
          />
        )}
      </div>
    </Suspense>
  );
};

export default ProfilePage;

const LoadingIndicatorWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
  padding-bottom: 50px;
`;

const CustomMenuItem = withStyles({
  root: {
    fontSize: '14px'
  }
})(MenuItem);

const VerifyIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 22 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <mask
      id="path-1-outside-1_8189_152955_verify"
      maskUnits="userSpaceOnUse"
      x="0.751953"
      y="-0.048584"
      width="21"
      height="22"
      fill="black"
    >
      <rect fill="white" x="0.751953" y="-0.048584" width="21" height="22" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.2317 10.1758L18.3431 9.18927C18.1095 8.92987 17.9969 8.58348 18.0335 8.23629L18.1726 6.91597C18.2387 6.28878 17.8201 5.71307 17.2031 5.58245L15.9054 5.3077C15.5631 5.23525 15.2678 5.02062 15.0933 4.71742L14.432 3.56858C14.117 3.02134 13.439 2.80112 12.8625 3.05875L11.6524 3.59959C11.3327 3.74245 10.9673 3.74245 10.6477 3.59959L9.43751 3.05875C8.86103 2.80112 8.18309 3.02134 7.86808 3.56858L7.20675 4.71742C7.03221 5.02062 6.73694 5.23525 6.39469 5.3077L5.0969 5.58246C4.47992 5.71308 4.06139 6.28878 4.12745 6.91596L4.26652 8.2363C4.30309 8.58348 4.19055 8.92987 3.95691 9.18927L3.06833 10.1758C2.6465 10.6442 2.64649 11.3555 3.06832 11.8238L3.95689 12.8104C4.19052 13.0698 4.30305 13.4162 4.26648 13.7633L4.12741 15.0837C4.06135 15.7109 4.47988 16.2866 5.09687 16.4172L6.39466 16.6919C6.73691 16.7644 7.03218 16.979 7.20671 17.2822L7.86804 18.431C8.18306 18.9783 8.861 19.1985 9.43748 18.9409L10.6476 18.4C10.9673 18.2572 11.3327 18.2572 11.6524 18.4L12.8625 18.9409C13.439 19.1985 14.1169 18.9783 14.4319 18.431L15.0933 17.2822C15.2678 16.979 15.5631 16.7644 15.9053 16.6919L17.2031 16.4172C17.8201 16.2866 18.2386 15.7109 18.1726 15.0837L18.0335 13.7634C17.9969 13.4162 18.1094 13.0698 18.3431 12.8104L19.2317 11.8238C19.6535 11.3555 19.6535 10.6442 19.2317 10.1758ZM15.9381 9.06276C16.4153 8.59742 16.4153 7.84297 15.9381 7.37763C15.4608 6.9123 14.687 6.9123 14.2097 7.37763L9.37069 12.0957L7.79062 10.5551C7.31336 10.0898 6.53955 10.0898 6.06229 10.5551C5.58502 11.0205 5.58502 11.7749 6.06229 12.2403L8.50652 14.6234C8.73571 14.8469 9.04657 14.9724 9.37069 14.9724C9.69482 14.9724 10.0057 14.8469 10.2349 14.6234L15.9381 9.06276Z"
      />
    </mask>
    <path
      d="M18.3431 9.18927L19.8292 7.85078L19.8292 7.85078L18.3431 9.18927ZM19.2317 10.1758L17.7456 11.5143L19.2317 10.1758ZM18.0335 8.23629L20.0225 8.44581V8.44581L18.0335 8.23629ZM18.1726 6.91597L16.1836 6.70645V6.70645L18.1726 6.91597ZM17.2031 5.58245L17.6174 3.62582V3.62582L17.2031 5.58245ZM15.9054 5.3077L16.3196 3.35107L16.3196 3.35107L15.9054 5.3077ZM15.0933 4.71742L16.8266 3.71964L16.8266 3.71964L15.0933 4.71742ZM14.432 3.56858L12.6986 4.56637L12.6986 4.56637L14.432 3.56858ZM12.8625 3.05875L12.0465 1.23281V1.23281L12.8625 3.05875ZM11.6524 3.59959L12.4684 5.42553L11.6524 3.59959ZM10.6477 3.59959L9.83162 5.42553L9.83162 5.42553L10.6477 3.59959ZM9.43751 3.05875L10.2535 1.23281L10.2535 1.23281L9.43751 3.05875ZM7.86808 3.56858L6.13475 2.5708V2.5708L7.86808 3.56858ZM7.20675 4.71742L8.94007 5.71521V5.71521L7.20675 4.71742ZM6.39469 5.3077L5.98046 3.35107L5.98046 3.35107L6.39469 5.3077ZM5.0969 5.58246L5.51113 7.53909H5.51113L5.0969 5.58246ZM4.12745 6.91596L2.13845 7.12546L2.13845 7.12546L4.12745 6.91596ZM4.26652 8.2363L2.27752 8.4458L2.27752 8.4458L4.26652 8.2363ZM3.95691 9.18927L5.44299 10.5278L5.44299 10.5278L3.95691 9.18927ZM3.06833 10.1758L1.58225 8.83733L1.58225 8.83733L3.06833 10.1758ZM3.06832 11.8238L4.55441 10.4853L4.55441 10.4853L3.06832 11.8238ZM3.95689 12.8104L2.47079 14.1489L2.4708 14.1489L3.95689 12.8104ZM4.26648 13.7633L6.25548 13.9728L6.25548 13.9728L4.26648 13.7633ZM4.12741 15.0837L6.11641 15.2932V15.2932L4.12741 15.0837ZM5.09687 16.4172L5.5111 14.4605H5.5111L5.09687 16.4172ZM6.39466 16.6919L5.98042 18.6486H5.98042L6.39466 16.6919ZM7.20671 17.2822L8.94004 16.2844L8.94004 16.2844L7.20671 17.2822ZM7.86804 18.431L6.13471 19.4288L6.13471 19.4288L7.86804 18.431ZM9.43748 18.9409L10.2535 20.7668L10.2535 20.7668L9.43748 18.9409ZM10.6476 18.4L9.83155 16.5741L9.83155 16.5741L10.6476 18.4ZM11.6524 18.4L12.4684 16.5741L12.4684 16.5741L11.6524 18.4ZM12.8625 18.9409L12.0464 20.7668L12.0464 20.7668L12.8625 18.9409ZM14.4319 18.431L16.1653 19.4288L16.1653 19.4288L14.4319 18.431ZM15.0933 17.2822L16.8266 18.28V18.28L15.0933 17.2822ZM15.9053 16.6919L16.3196 18.6486L15.9053 16.6919ZM17.2031 16.4172L16.7889 14.4605H16.7889L17.2031 16.4172ZM18.1726 15.0837L16.1836 15.2932L18.1726 15.0837ZM18.0335 13.7634L16.0445 13.9729V13.9729L18.0335 13.7634ZM18.3431 12.8104L19.8292 14.1489L19.8292 14.1489L18.3431 12.8104ZM19.2317 11.8238L20.7177 13.1623L20.7177 13.1623L19.2317 11.8238ZM15.9381 7.37763L14.5419 8.80963L14.5419 8.80963L15.9381 7.37763ZM15.9381 9.06276L14.5419 7.63076L14.5419 7.63076L15.9381 9.06276ZM14.2097 7.37763L15.6059 8.80963L15.6059 8.80963L14.2097 7.37763ZM9.37069 12.0957L7.97449 13.5277L9.37069 14.889L10.7669 13.5277L9.37069 12.0957ZM7.79062 10.5551L9.18682 9.12314H9.18682L7.79062 10.5551ZM6.06229 10.5551L4.66609 9.12314L4.66609 9.12314L6.06229 10.5551ZM6.06229 12.2403L4.66609 13.6723L4.66609 13.6723L6.06229 12.2403ZM8.50652 14.6234L9.90272 13.1914L9.90272 13.1914L8.50652 14.6234ZM10.2349 14.6234L8.83866 13.1914L8.83866 13.1914L10.2349 14.6234ZM16.857 10.5278L17.7456 11.5143L20.7178 8.83732L19.8292 7.85078L16.857 10.5278ZM16.0445 8.02677C15.9485 8.93793 16.2439 9.847 16.857 10.5278L19.8292 7.85078C19.9751 8.01274 20.0453 8.22903 20.0225 8.44581L16.0445 8.02677ZM16.1836 6.70645L16.0445 8.02677L20.0225 8.44581L20.1616 7.12549L16.1836 6.70645ZM16.7889 7.53909C16.4037 7.45753 16.1423 7.09806 16.1836 6.70645L20.1616 7.1255C20.335 5.4795 19.2366 3.96862 17.6174 3.62582L16.7889 7.53909ZM15.4911 7.26434L16.7889 7.53909L17.6174 3.62582L16.3196 3.35107L15.4911 7.26434ZM13.36 5.71521C13.818 6.51091 14.5929 7.07418 15.4911 7.26434L16.3196 3.35107C16.5333 3.39631 16.7177 3.53033 16.8266 3.71964L13.36 5.71521ZM12.6986 4.56637L13.36 5.71521L16.8266 3.71964L16.1653 2.57079L12.6986 4.56637ZM13.6786 4.8847C13.3186 5.04557 12.8953 4.90806 12.6986 4.56637L16.1653 2.5708C15.3386 1.13463 13.5594 0.556671 12.0465 1.23281L13.6786 4.8847ZM12.4684 5.42553L13.6786 4.8847L12.0465 1.23281L10.8364 1.77364L12.4684 5.42553ZM9.83162 5.42553C10.6706 5.80047 11.6295 5.80047 12.4684 5.42553L10.8364 1.77364C11.036 1.68444 11.2641 1.68444 11.4637 1.77364L9.83162 5.42553ZM8.62147 4.8847L9.83162 5.42553L11.4637 1.77364L10.2535 1.23281L8.62147 4.8847ZM9.6014 4.56637C9.40471 4.90806 8.98141 5.04557 8.62147 4.8847L10.2535 1.23281C8.74064 0.556672 6.96148 1.13463 6.13475 2.5708L9.6014 4.56637ZM8.94007 5.71521L9.6014 4.56637L6.13475 2.5708L5.47342 3.71964L8.94007 5.71521ZM6.80892 7.26434C7.70713 7.07418 8.48203 6.51091 8.94007 5.71521L5.47342 3.71964C5.5824 3.53033 5.76676 3.39631 5.98046 3.35107L6.80892 7.26434ZM5.51113 7.53909L6.80892 7.26434L5.98046 3.35107L4.68267 3.62582L5.51113 7.53909ZM6.11645 6.70647C6.15769 7.09807 5.89637 7.45753 5.51113 7.53909L4.68267 3.62582C3.06347 3.96862 1.96508 5.47948 2.13845 7.12546L6.11645 6.70647ZM6.25551 8.0268L6.11645 6.70646L2.13845 7.12546L2.27752 8.4458L6.25551 8.0268ZM5.44299 10.5278C6.05615 9.847 6.35148 8.93795 6.25551 8.0268L2.27752 8.4458C2.25469 8.22902 2.32495 8.01274 2.47083 7.85077L5.44299 10.5278ZM4.55441 11.5143L5.44299 10.5278L2.47083 7.85077L1.58225 8.83733L4.55441 11.5143ZM4.55441 10.4853C4.8178 10.7778 4.8178 11.2219 4.55441 11.5143L1.58225 8.83733C0.475196 10.0665 0.475184 11.9332 1.58223 13.1623L4.55441 10.4853ZM5.44298 11.4719L4.55441 10.4853L1.58223 13.1623L2.47079 14.1489L5.44298 11.4719ZM6.25548 13.9728C6.35145 13.0617 6.05612 12.1526 5.44297 11.4719L2.4708 14.1489C2.32492 13.9869 2.25465 13.7706 2.27749 13.5538L6.25548 13.9728ZM6.11641 15.2932L6.25548 13.9728L2.27749 13.5538L2.13842 14.8742L6.11641 15.2932ZM5.5111 14.4605C5.89633 14.5421 6.15766 14.9016 6.11641 15.2932L2.13842 14.8742C1.96505 16.5202 3.06344 18.031 4.68263 18.3738L5.5111 14.4605ZM6.80889 14.7353L5.5111 14.4605L4.68263 18.3738L5.98042 18.6486L6.80889 14.7353ZM8.94004 16.2844C8.482 15.4887 7.70709 14.9255 6.80889 14.7353L5.98042 18.6486C5.76673 18.6033 5.58236 18.4693 5.47339 18.28L8.94004 16.2844ZM9.60136 17.4333L8.94004 16.2844L5.47339 18.28L6.13471 19.4288L9.60136 17.4333ZM8.62142 17.1149C8.98137 16.9541 9.40467 17.0916 9.60136 17.4333L6.13471 19.4288C6.96145 20.865 8.74063 21.443 10.2535 20.7668L8.62142 17.1149ZM9.83155 16.5741L8.62142 17.1149L10.2535 20.7668L11.4637 20.226L9.83155 16.5741ZM12.4684 16.5741C11.6295 16.1991 10.6705 16.1991 9.83155 16.5741L11.4637 20.226C11.2641 20.3152 11.0359 20.3152 10.8363 20.226L12.4684 16.5741ZM13.6786 17.1149L12.4684 16.5741L10.8363 20.226L12.0464 20.7668L13.6786 17.1149ZM12.6986 17.4333C12.8953 17.0916 13.3186 16.9541 13.6786 17.1149L12.0464 20.7668C13.5594 21.443 15.3385 20.865 16.1653 19.4288L12.6986 17.4333ZM13.3599 16.2844L12.6986 17.4333L16.1653 19.4288L16.8266 18.28L13.3599 16.2844ZM15.4911 14.7353C14.5929 14.9255 13.818 15.4887 13.3599 16.2844L16.8266 18.28C16.7176 18.4693 16.5333 18.6033 16.3196 18.6486L15.4911 14.7353ZM16.7889 14.4605L15.4911 14.7353L16.3196 18.6486L17.6173 18.3738L16.7889 14.4605ZM16.1836 15.2932C16.1423 14.9016 16.4036 14.5421 16.7889 14.4605L17.6173 18.3738C19.2365 18.031 20.3349 16.5201 20.1616 14.8741L16.1836 15.2932ZM16.0445 13.9729L16.1836 15.2932L20.1616 14.8741L20.0225 13.5538L16.0445 13.9729ZM16.857 11.4718C16.2438 12.1526 15.9485 13.0617 16.0445 13.9729L20.0225 13.5538C20.0453 13.7706 19.975 13.9869 19.8292 14.1489L16.857 11.4718ZM17.7456 10.4853L16.857 11.4719L19.8292 14.1489L20.7177 13.1623L17.7456 10.4853ZM17.7456 11.5143C17.4822 11.2219 17.4822 10.7777 17.7456 10.4853L20.7177 13.1623C21.8248 11.9332 21.8248 10.0665 20.7178 8.83732L17.7456 11.5143ZM14.5419 8.80963C14.2141 8.49003 14.2141 7.95036 14.5419 7.63076L17.3343 10.4948C18.6166 9.24449 18.6166 7.19591 17.3343 5.94563L14.5419 8.80963ZM15.6059 8.80963C15.3065 9.10163 14.8414 9.10163 14.5419 8.80963L17.3343 5.94563C16.0803 4.72296 14.0676 4.72296 12.8135 5.94563L15.6059 8.80963ZM10.7669 13.5277L15.6059 8.80963L12.8135 5.94563L7.97449 10.6637L10.7669 13.5277ZM6.39442 11.9871L7.97449 13.5277L10.7669 10.6637L9.18682 9.12314L6.39442 11.9871ZM7.45849 11.9871C7.159 12.2791 6.69391 12.2791 6.39442 11.9871L9.18682 9.12314C7.93281 7.90047 5.92011 7.90047 4.66609 9.12314L7.45849 11.9871ZM7.45849 10.8083C7.78629 11.1279 7.78629 11.6675 7.45849 11.9871L4.66609 9.12314C3.38376 10.3734 3.38375 12.422 4.66609 13.6723L7.45849 10.8083ZM9.90272 13.1914L7.45849 10.8083L4.66609 13.6723L7.11032 16.0554L9.90272 13.1914ZM9.37069 12.9724C9.56089 12.9724 9.75318 13.0456 9.90272 13.1914L7.11032 16.0554C7.71825 16.6481 8.53224 16.9724 9.37069 16.9724V12.9724ZM8.83866 13.1914C8.9882 13.0456 9.18049 12.9724 9.37069 12.9724V16.9724C10.2091 16.9724 11.0231 16.6481 11.6311 16.0554L8.83866 13.1914ZM14.5419 7.63076L8.83866 13.1914L11.6311 16.0554L17.3343 10.4948L14.5419 7.63076Z"
      fill="#2D3047"
      mask="url(#path-1-outside-1_8189_152955_verify)"
    />
  </svg>
);

const ClockIcon = () => (
  <svg
    width="9"
    height="14"
    viewBox="0 0 9 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1.14339 9.65006C0.867694 9.92428 0.651134 10.2521 0.507088 10.6133C0.363042 10.9745 0.294568 11.3614 0.305895 11.7501C0.329895 12.3578 0.589301 12.9323 1.02926 13.3522C1.46922 13.7721 2.05524 14.0044 2.66339 14.0001H6.33839C6.94655 14.0044 7.53257 13.7721 7.97253 13.3522C8.41249 12.9323 8.67189 12.3578 8.69589 11.7501C8.70653 11.3622 8.63772 10.9763 8.4937 10.616C8.34967 10.2557 8.13347 9.9287 7.85839 9.65506L5.94589 7.74256C5.75094 7.54713 5.64146 7.28235 5.64146 7.00631C5.64146 6.73027 5.75094 6.46549 5.94589 6.27006L7.85839 4.35756C8.13503 4.08247 8.35214 3.75342 8.49621 3.39087C8.64029 3.02831 8.70826 2.64 8.69589 2.25006C8.67189 1.64236 8.41249 1.06781 7.97253 0.647917C7.53257 0.228021 6.94655 -0.00430762 6.33839 6.04973e-05H2.66339C2.05524 -0.00430762 1.46922 0.228021 1.02926 0.647917C0.589301 1.06781 0.329895 1.64236 0.305895 2.25006C0.295256 2.63792 0.364065 3.02385 0.508092 3.38413C0.652118 3.74441 0.868317 4.07142 1.14339 4.34506L3.05589 6.25756C3.25085 6.45299 3.36033 6.71777 3.36033 6.99381C3.36033 7.26985 3.25085 7.53463 3.05589 7.73006L1.14339 9.65006ZM2.64339 3.67006C2.59868 3.72278 2.54352 3.76565 2.4814 3.79597C2.41928 3.8263 2.35154 3.84341 2.28247 3.84622C2.2134 3.84904 2.1445 3.83751 2.08011 3.81235C2.01573 3.78719 1.95726 3.74896 1.90839 3.70006L1.89089 3.68256C1.8027 3.59837 1.74707 3.48574 1.7338 3.36453C1.72054 3.24333 1.7505 3.12133 1.81839 3.02006C1.86052 2.96254 1.91445 2.91468 1.97658 2.87972C2.03872 2.84475 2.10761 2.82347 2.17864 2.81732C2.24967 2.81116 2.3212 2.82027 2.38842 2.84402C2.45564 2.86778 2.51701 2.90564 2.56839 2.95506L2.58339 2.97006C2.67912 3.0581 2.73838 3.17881 2.74949 3.3084C2.7606 3.43798 2.72274 3.56702 2.64339 3.67006ZM3.06339 4.85256C2.97674 4.76711 2.92297 4.65385 2.91154 4.53269C2.90011 4.41153 2.93175 4.29021 3.00089 4.19006C3.04302 4.13254 3.09695 4.08468 3.15908 4.04972C3.22122 4.01475 3.29011 3.99347 3.36114 3.98732C3.43217 3.98116 3.5037 3.99027 3.57092 4.01402C3.63814 4.03778 3.69951 4.07564 3.75089 4.12506L4.33339 4.70756C4.42727 4.79725 4.4842 4.91881 4.49299 5.04834C4.50178 5.17788 4.46179 5.30601 4.38089 5.40756C4.33618 5.46028 4.28102 5.50315 4.2189 5.53347C4.15678 5.56379 4.08904 5.58091 4.01997 5.58372C3.9509 5.58654 3.882 5.57501 3.81761 5.54985C3.75323 5.52469 3.69476 5.48646 3.64589 5.43756L3.06339 4.85256ZM3.56339 8.64756C3.81321 8.39826 4.15172 8.25825 4.50464 8.25825C4.85757 8.25825 5.19608 8.39826 5.44589 8.64756L7.15339 10.3551C7.49588 10.6958 7.69148 11.157 7.69839 11.6401C7.69906 11.8188 7.66433 11.996 7.59622 12.1613C7.5281 12.3266 7.42795 12.4768 7.30153 12.6032C7.17511 12.7296 7.02493 12.8298 6.85962 12.8979C6.69432 12.966 6.51718 13.0007 6.33839 13.0001H2.66339C2.48503 13.0004 2.30836 12.9655 2.14351 12.8974C1.97866 12.8293 1.82888 12.7293 1.70276 12.6032C1.57664 12.4771 1.47666 12.3273 1.40856 12.1624C1.34045 11.9976 1.30557 11.8209 1.30589 11.6426C1.31281 11.1595 1.50841 10.6983 1.85089 10.3576L3.56339 8.64756Z"
      fill="#2D3047"
    />
    <path
      d="M3.06339 4.85256C2.97674 4.76711 2.92297 4.65385 2.91154 4.53269C2.90011 4.41153 2.93175 4.29021 3.00089 4.19006C3.04302 4.13254 3.09695 4.08468 3.15908 4.04972C3.22122 4.01475 3.29011 3.99347 3.36114 3.98732C3.43217 3.98116 3.5037 3.99027 3.57092 4.01402C3.63814 4.03778 3.69951 4.07564 3.75089 4.12506L4.33339 4.70756C4.42727 4.79725 4.4842 4.91881 4.49299 5.04834C4.50178 5.17788 4.46179 5.30601 4.38089 5.40756C4.33618 5.46028 4.28102 5.50315 4.2189 5.53347C4.15678 5.56379 4.08904 5.58091 4.01997 5.58372C3.9509 5.58654 3.882 5.57501 3.81761 5.54985C3.75323 5.52469 3.69476 5.48646 3.64589 5.43756L3.06339 4.85256Z"
      fill="#2D3047"
    />
    <path
      d="M2.64339 3.67006C2.59868 3.72278 2.54352 3.76565 2.4814 3.79597C2.41928 3.8263 2.35154 3.84341 2.28247 3.84622C2.2134 3.84904 2.1445 3.83751 2.08011 3.81235C2.01573 3.78719 1.95726 3.74896 1.90839 3.70006L1.89089 3.68256C1.8027 3.59837 1.74707 3.48574 1.7338 3.36453C1.72054 3.24333 1.7505 3.12133 1.81839 3.02006C1.86052 2.96254 1.91445 2.91468 1.97658 2.87972C2.03872 2.84475 2.10761 2.82347 2.17864 2.81732C2.24967 2.81116 2.3212 2.82027 2.38842 2.84402C2.45564 2.86778 2.51701 2.90564 2.56839 2.95506L2.58339 2.97006C2.67912 3.0581 2.73838 3.17881 2.74949 3.3084C2.7606 3.43798 2.72274 3.56702 2.64339 3.67006Z"
      fill="#2D3047"
    />
  </svg>
);
