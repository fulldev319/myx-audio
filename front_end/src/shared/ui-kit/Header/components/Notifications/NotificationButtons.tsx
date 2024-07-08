import React, { useRef, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { Notification } from 'shared/services/API/NotificationsAPI';
import { signTransaction } from 'shared/functions/signTransaction';
import URL from 'shared/functions/getURL';
import { getUser } from 'store/selectors/user';
import { PrimaryButton, SecondaryButton } from 'shared/ui-kit';
import { setUpdateAllProfileInfo } from 'store/actions/UpdateAllProfileInfo';
import { LoadingWrapper } from 'shared/ui-kit/Hocs';
import AlertMessage from 'shared/ui-kit/Alert/AlertMessage';
import { CircularLoadingIndicator } from 'shared/ui-kit';
import Box from 'shared/ui-kit/Box';
import { notificationButtonStyles } from './NotificationButtons.styles';
import { followUser } from '../../../../services/API/UserConnectionsAPI';

type NotificationButtonsProps = {
  notification: Notification;
  onRemoveNotification: () => void;
  onDismissNotification: () => void;
  refreshAllProfile: (userId: string) => void;
  viewMore?: (value: any) => void;
  setSelectedNotification: (value: Notification) => void;
  handleShowContributionModal: () => void;
  handleClosePopper: () => void;
  handleHidePopper: () => void;
  theme?: 'dark' | 'light';
};

const ButtonContainer = styled.div`
  button {
    margin-bottom: 0 !important;
  }
`;

export const NotificationButtons: React.FunctionComponent<
  NotificationButtonsProps
> = ({
  notification,
  onDismissNotification: dismissNotification,
  onRemoveNotification,
  refreshAllProfile,
  viewMore = null,
  setSelectedNotification,
  handleShowContributionModal,
  handleClosePopper,
  handleHidePopper,
  theme = 'light'
}) => {
  const classes = notificationButtonStyles();

  const dispatch = useDispatch();
  const history = useHistory();
  // const streaming = useStreaming();
  const userSelector = useSelector(getUser);

  const [userSearcher, setUserSearcher] = useState<string>('');
  const [usersSearched, setUsersSearched] = useState<any[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const [status, setStatus] = React.useState<any>('');
  const [isLoadingAccept, setIsLoadingAccept] = useState<boolean>(false);

  const searchUser = (search) => {
    setIsSearchLoading(true);
    axios
      .post(`${URL()}/user/searchUsers`, {
        userId: userSelector.id,
        userSearch: search
      })
      .then((res) => {
        const resp = res.data;
        if (resp.success) {
          setUsersSearched(resp.data);
        } else {
          console.log({
            msg: resp.error
          });
        }
        setIsSearchLoading(false);
      })
      .catch((err) => {
        setIsSearchLoading(false);
        console.log({
          msg: err.error
        });
      });
  };

  // Functions Notifications
  const acceptDeclineFollowing = (
    user,
    boolUpdateFollowing,
    idNotification
  ) => {
    if (!user || !user.id) return;

    setIsLoadingAccept(true);
    if (boolUpdateFollowing) {
      // accept
      axios
        .post(`${URL()}/user/connections/acceptFollowUser`, {
          userToAcceptFollow: {
            id: user.id
          },
          idNotification: idNotification
        })
        .then((res) => {
          const resp = res.data;
          if (resp.success) {
            dismissNotification();
            setStatus({
              msg: 'Accepted following request',
              key: Math.random(),
              variant: 'success'
            });
          } else {
            console.log(resp.error);
            setStatus({
              msg: 'Error accept request',
              key: Math.random(),
              variant: 'error'
            });
          }
          setIsLoadingAccept(false);
        });
    } else {
      // decline
      axios
        .post(`${URL()}/user/connections/declineFollowUser`, {
          userToDeclineFollow: {
            id: user.id
          },
          user: {
            id: userSelector.id
          },
          idNotification: idNotification
        })
        .then((res) => {
          const resp = res.data;
          if (resp.success) {
            dismissNotification();
            setStatus({
              msg: 'Declined request',
              key: Math.random(),
              variant: 'success'
            });
          } else {
            console.log(resp.error);
            setStatus({
              msg: 'Error decline request',
              key: Math.random(),
              variant: 'error'
            });
          }
          setIsLoadingAccept(false);
        });
    }
  };

  const removeNotification = () => {
    axios
      .post(`${URL()}/user/removeNotification`, {
        userId: userSelector.id,
        notificationId: notification.id
      })
      .then((res) => {
        const resp = res.data;
        if (resp.success) {
          dismissNotification();
        } else {
          console.log(resp.error);
          setStatus({
            msg: 'Error removing notification',
            key: Math.random(),
            variant: 'error'
          });
        }
      })
      .catch((err) => {
        console.log(err);
        setStatus({
          msg: 'Error removing notification',
          key: Math.random(),
          variant: 'error'
        });
      });
  };

  const sendInviteNotifications = (user: any) => {
    console.log(notification);
    axios
      .post(`${URL()}/user/inviteUserToPod`, {
        userId: user.id,
        podName: notification.pod,
        podId: notification.otherItemId,
        creatorId: notification.itemId
      })
      .then((res) => {
        const resp = res.data;
        if (resp.success) {
          setStatus({
            msg: resp.data,
            key: Math.random(),
            variant: 'success'
          });
        } else {
          console.log(resp.error);
          setStatus({
            msg: 'Error sending notification',
            key: Math.random(),
            variant: 'error'
          });
        }
      })
      .catch((err) => {
        console.log(err);
        setStatus({
          msg: 'Error sending notification',
          key: Math.random(),
          variant: 'error'
        });
      });
  };

  const acceptInvitation = () => {
    axios
      .post(`${URL()}/community/acceptRoleInvitation`, {
        userId: userSelector.id,
        communityId: notification.otherItemId,
        role: notification.comment
      })
      .then((res) => {
        const resp = res.data;
        if (resp.success) {
          dismissNotification();
          setStatus({
            msg: resp.data,
            key: Math.random(),
            variant: 'success'
          });
        } else {
          console.log(resp.error);
          setStatus({
            msg: 'Error accepting invitation',
            key: Math.random(),
            variant: 'error'
          });
        }
      });
  };

  const declineInvitation = () => {
    axios
      .post(`${URL()}/community/declineRoleInvitation`, {
        userId: userSelector.id,
        communityId: notification.otherItemId,
        role: notification.comment
      })
      .then((res) => {
        const resp = res.data;
        if (resp.success) {
          dismissNotification();
          setStatus({
            msg: resp.data,
            key: Math.random(),
            variant: 'success'
          });
        } else {
          console.log(resp.error);
          setStatus({
            msg: 'Error decline invitation',
            key: Math.random(),
            variant: 'error'
          });
        }
      });
  };

  const changeOffer = (status: any) => {
    axios
      .post(`${URL()}/community/changeOffer`, {
        userId: userSelector.id,
        communityId: notification.otherItemId,
        status: status,
        token: notification.token,
        amount: notification.amount,
        notificationId: notification.id
      })
      .then((res) => {
        const resp = res.data;
        if (resp.success) {
          dismissNotification();
          setStatus({
            msg: 'Action done success',
            key: Math.random(),
            variant: 'success'
          });
          dispatch(setUpdateAllProfileInfo(true));
        } else {
          console.log(resp.error);
          setStatus({
            msg: 'Error changing offer',
            key: Math.random(),
            variant: 'error'
          });
        }
      });
  };

  const signTxStreamingAcceptOffer = async () => {
    let diffDate =
      Math.floor(notification.date / 1000) -
      (Math.floor(Date.now() / 1000) + 10);
    const body: any = {
      sender: userSelector.id,
      receiver: notification.pod,
      amountPeriod: notification.amount / diffDate,
      token: notification.token,
      startDate: Math.floor(Date.now() / 1000) + 10,
      endDate: Math.floor(notification.date / 1000)
    };
    const [hash, signature] = await signTransaction(
      userSelector.mnemonic,
      body
    );
    body.userId = userSelector.id;
    body.communityId = notification.otherItemId;
    body.Hash = hash;
    body.Signature = signature;

    axios
      .post(`${URL()}/community/signTransactionAcceptOffer`, body)
      .then((res) => {
        const resp = res.data;
        if (resp.success) {
          dismissNotification();
          setStatus({
            msg: 'Signed Transaction',
            key: Math.random(),
            variant: 'success'
          });
        } else {
          console.log(resp.error);
          setStatus({
            msg: 'Error signing transaction',
            key: Math.random(),
            variant: 'error'
          });
        }
      });
  };

  const refuseCollabRequest = (wall: any) => {
    let body: any = {
      userId: userSelector.id,
      creator: wall.itemId,
      notificationId: wall.id
    };
    axios
      .post(`${URL()}/media/refuseCollab/${wall.pod}/${wall.token}`, body)
      .then((res) => {
        const resp = res.data;
        if (resp.success) {
          dismissNotification();
          setStatus({
            msg: 'Collab Refused',
            key: Math.random(),
            variant: 'success'
          });
        } else {
          console.log(resp.error);
          setStatus({
            msg: 'Error refusing collab',
            key: Math.random(),
            variant: 'error'
          });
        }
      });
  };

  const acceptCollabRequest = (wall: any) => {
    let body: any = {
      userId: userSelector.id,
      creator: wall.itemId,
      notificationId: wall.id
    };
    axios
      .post(`${URL()}/media/acceptCollab/${wall.pod}/${wall.token}`, body)
      .then((res) => {
        const resp = res.data;
        if (resp.success) {
          dismissNotification();
          setStatus({
            msg: 'Collab Accepted',
            key: Math.random(),
            variant: 'success'
          });
        } else {
          console.log(resp.error);
          setStatus({
            msg: 'Error accepting collab',
            key: Math.random(),
            variant: 'error'
          });
        }
      });
  };

  const signTxAcceptCollab = async (wall: any) => {
    let collabs: any = {};

    if (wall.comment && wall.comment.length > 0) {
      let sumShare: number = 0;

      for (let savedCollab of wall.comment) {
        if (savedCollab.status === 'Accepted') {
          collabs[savedCollab.id] = savedCollab.share / 100;
        }
        if (savedCollab.id !== userSelector.id) {
          sumShare += savedCollab.share;
        }
      }
      if (sumShare < 100) {
        collabs[userSelector.address] = (100 - sumShare) / 100;
      }
    }

    const body: any = {
      PodAddress: wall.pod,
      MediaSymbol: wall.token,
      Collabs: collabs
    };
    const [hash, signature] = await signTransaction(
      userSelector.mnemonic,
      body
    );
    body.userId = wall.itemId;
    body.creator = userSelector.id;
    body.notificationId = wall.id;
    body.Hash = hash;
    body.Signature = signature;

    axios
      .post(
        `${URL()}/media/signTransactionAcceptCollab/${wall.pod}/${wall.token}`,
        body
      )
      .then((res) => {
        const resp = res.data;
        if (resp.success) {
          dismissNotification();
          setStatus({
            msg: 'Collabs modified',
            key: Math.random(),
            variant: 'success'
          });
        } else {
          console.log(resp.error);
          setStatus({
            msg: 'Error signing transaction',
            key: Math.random(),
            variant: 'error'
          });
        }
      });
  };

  const acceptInvitationPodCollab = (notification: any) => {
    axios
      .post(`${URL()}/musicDao/new/pod/acceptInvitation`, {
        podId: notification.otherItemId
      })
      .then((response) => {
        if (response.data.success) {
          onRemoveNotification();
          history.push(`/capsules/${notification.otherItemId}`);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const declineInvitationPodCollab = (notification: any) => {
    axios
      .post(`${URL()}/musicDao/new/pod/declineInvitation`, {
        podId: notification.otherItemId
      })
      .then((response) => {
        if (response.data.success) {
          onRemoveNotification();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const gotoProfile = () => {
    onRemoveNotification();
    history.push({
      pathname: `/profile/${userSelector.urlSlug}`,
      state: {
        tab: 'feed'
      }
    });
    handleClosePopper();
  };

  return (
    <>
      <ButtonContainer>
        {notification.type === 1 ? (
          <>
            {isLoadingAccept ? (
              <Box display="flex" justifyContent="center" width={1}>
                <CircularLoadingIndicator />
              </Box>
            ) : (
              <Box display="flex" width={1}>
                <PrimaryButton
                  className={
                    theme === 'dark' ? classes.darkButton : classes.blueButton
                  }
                  size="small"
                  onClick={() => {
                    acceptDeclineFollowing(
                      { id: notification.itemId },
                      true,
                      notification.id
                    );
                    handleClosePopper();
                  }}
                  style={{ borderRadius: '100px' }}
                >
                  Accept
                </PrimaryButton>
                <SecondaryButton
                  className={
                    theme === 'dark' ? classes.darkButton : classes.emptyStyle
                  }
                  size="small"
                  onClick={() => {
                    acceptDeclineFollowing(
                      { id: notification.itemId },
                      false,
                      notification.id
                    );
                    handleClosePopper();
                  }}
                  style={{ borderStyle: 'solid', borderRadius: '100px' }}
                >
                  Decline
                </SecondaryButton>
              </Box>
            )}
          </>
        ) : null}
        {notification.type === 3 ? (
          <>
            {isLoadingAccept ? (
              <Box display="flex" justifyContent="center" width={1}>
                <CircularLoadingIndicator />
              </Box>
            ) : (
              <>
                <PrimaryButton
                  className={
                    theme === 'dark' ? classes.darkButton : classes.blueButton
                  }
                  size="small"
                  onClick={async () => {
                    setIsLoadingAccept(true);
                    await followUser(
                      notification.itemId,
                      false,
                      notification.id,
                      false
                    );
                    removeNotification();
                    setIsLoadingAccept(false);
                    handleClosePopper();
                  }}
                  style={{ borderRadius: '100px' }}
                >
                  Follow Back
                </PrimaryButton>
              </>
            )}
          </>
        ) : null}
        {notification.type === 10 ? (
          <div className="marginLeftOptionWall">
            <input
              className="textFieldSidebarProfile no-margin-bottom"
              style={{
                width: 'calc(100% - 24px)',
                height: '35px',
                marginTop: '10px',
                marginBottom: '10px'
              }}
              type="text"
              name="userSearch"
              value={userSearcher}
              ref={inputRef}
              onChange={(elem) => {
                let value = elem.target.value;
                setUserSearcher(value);
                if (value.length >= 3) {
                  searchUser(value);
                } else {
                  setUsersSearched([]);
                }
              }}
              placeholder="Search user by name"
            />
            {userSearcher && userSearcher.length >= 3 ? (
              <LoadingWrapper loading={isSearchLoading}>
                {usersSearched && usersSearched.length !== 0 ? (
                  usersSearched.map((user, i) => {
                    return (
                      <div className="userSearchedItem">
                        <div
                          className="photoUserSearchedItem"
                          style={{
                            backgroundImage: `url(${user.url}?${Date.now()})`,
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: 'cover'
                          }}
                        ></div>
                        <div className="nameUserSearchedItem">
                          {user.firstName}
                        </div>
                        <div className="followingUserSearchedItem">
                          <button
                            className="followingButtonSidebarProfile"
                            onClick={() => sendInviteNotifications(user)}
                          >
                            Invite
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="noItemsWallLabel" style={{ marginTop: '0' }}>
                    No users found
                  </div>
                )}
              </LoadingWrapper>
            ) : (
              <div className="noItemsWallLabel" style={{ marginTop: '0' }}>
                Write 3 letters min.
              </div>
            )}
          </div>
        ) : null}
        {notification.type === 30 ? (
          <>
            <PrimaryButton
              className={
                theme === 'dark' ? classes.darkButton : classes.blueButton
              }
              size="small"
              onClick={() => {
                history.push(`/capsules/FT/${notification.pod}`);
                handleClosePopper();
              }}
              style={{ borderRadius: '100px' }}
            >
              Open Capsule
            </PrimaryButton>
          </>
        ) : null}
        {notification.type === 45 ? (
          <>
            <PrimaryButton
              className={
                theme === 'dark' ? classes.darkButton : classes.blueButton
              }
              size="small"
              onClick={() => {}}
              style={{ borderRadius: '100px' }}
            >
              Send remainder
            </PrimaryButton>
          </>
        ) : null}
        {notification.type === 46 ? <div></div> : null}
        {notification.type === 79 ? (
          <PrimaryButton
            className={
              theme === 'dark' ? classes.darkButton : classes.blueButton
            }
            size="small"
            onClick={async () => {}}
            style={{ borderRadius: '100px' }}
          >
            View comment
          </PrimaryButton>
        ) : null}
        {notification.type === 80 ? (
          <PrimaryButton
            className={
              theme === 'dark' ? classes.darkButton : classes.blueButton
            }
            size="small"
            onClick={async () => {}}
            style={{ borderRadius: '100px' }}
          >
            View comment
          </PrimaryButton>
        ) : null}
        {notification.type === 81 ? (
          <PrimaryButton
            className={
              theme === 'dark' ? classes.darkButton : classes.blueButton
            }
            size="small"
            onClick={async () => {}}
            style={{ borderRadius: '100px' }}
          >
            View comment
          </PrimaryButton>
        ) : null}
        {notification.type === 85 ? (
          <>
            <PrimaryButton
              className={
                theme === 'dark' ? classes.darkButton : classes.blueButton
              }
              size="small"
              onClick={() => {
                history.push(`/capsules/FT/${notification.otherItemId}`);
                handleClosePopper();
              }}
              style={{ borderRadius: '100px' }}
            >
              Open Capsule
            </PrimaryButton>
          </>
        ) : null}
        {notification.type === 86 ? (
          <>
            <PrimaryButton
              className={
                theme === 'dark' ? classes.darkButton : classes.blueButton
              }
              size="small"
              onClick={() => {
                acceptInvitation();
                handleClosePopper();
              }}
              style={{ borderRadius: '100px' }}
            >
              Accept
            </PrimaryButton>
            <SecondaryButton
              className={
                theme === 'dark' ? classes.darkButton : classes.emptyStyle
              }
              size="small"
              onClick={() => {
                declineInvitation();
                handleClosePopper();
              }}
              style={{ borderRadius: '100px' }}
            >
              Decline
            </SecondaryButton>
          </>
        ) : null}
        {notification.type === 94 ? (
          <>
            <PrimaryButton
              className={
                theme === 'dark' ? classes.darkButton : classes.blueButton
              }
              size="small"
              onClick={() => {
                changeOffer('negotiating');
                handleClosePopper();
              }}
              style={{ borderRadius: '100px' }}
            >
              Negotiate
            </PrimaryButton>
            <SecondaryButton
              className={
                theme === 'dark' ? classes.darkButton : classes.emptyStyle
              }
              size="small"
              onClick={() => {
                changeOffer('declined');
                handleClosePopper();
              }}
              style={{ borderRadius: '100px' }}
            >
              Decline
            </SecondaryButton>
          </>
        ) : null}
        {notification.type === 95 || notification.type === 97 ? (
          <>
            <PrimaryButton
              className={
                theme === 'dark' ? classes.darkButton : classes.blueButton
              }
              size="small"
              onClick={() => {
                /*getWIPCommunity(wall.otherItemId, wall.id);
                    handleOpenModalEditCommunityWIP();
                    refreshNotifications();*/
              }}
              style={{ borderRadius: '100px' }}
            >
              View
            </PrimaryButton>
          </>
        ) : null}
        {notification.type === 98 ? (
          <>
            <PrimaryButton
              className={
                theme === 'dark' ? classes.darkButton : classes.blueButton
              }
              size="small"
              onClick={() => {
                signTxStreamingAcceptOffer();
                handleClosePopper();
              }}
              style={{ borderRadius: '100px' }}
            >
              Sign Transaction
            </PrimaryButton>
          </>
        ) : null}
        {notification.type === 99 ? (
          <>
            <PrimaryButton
              className={
                theme === 'dark' ? classes.darkButton : classes.blueButton
              }
              size="small"
              onClick={() => changeOffer('negotiating')}
              style={{ borderRadius: '100px' }}
            >
              Negotiate
            </PrimaryButton>
            <SecondaryButton
              className={
                theme === 'dark' ? classes.darkButton : classes.emptyStyle
              }
              size="small"
              onClick={() => changeOffer('declined')}
              style={{ borderRadius: '100px' }}
            >
              Decline
            </SecondaryButton>
          </>
        ) : null}
        {notification.type === 100 || notification.type === 102 ? (
          <>
            <PrimaryButton
              className={
                theme === 'dark' ? classes.darkButton : classes.blueButton
              }
              size="small"
              onClick={() => {
                /*getWIPCommunity(wall.otherItemId, wall.id);
            handleOpenModalEditCommunityWIP();
            refreshNotifications();*/
              }}
              style={{ borderRadius: '100px' }}
            >
              View
            </PrimaryButton>
          </>
        ) : null}
        {notification.type === 103 ? (
          <>
            <PrimaryButton
              className={
                theme === 'dark' ? classes.darkButton : classes.blueButton
              }
              size="small"
              onClick={() => {
                signTxStreamingAcceptOffer();
              }}
              style={{ borderRadius: '100px' }}
            >
              Sign Transaction
            </PrimaryButton>
          </>
        ) : null}
        {notification.type === 104 ? (
          <>
            <PrimaryButton
              className={
                theme === 'dark' ? classes.darkButton : classes.blueButton
              }
              size="small"
              onClick={() => {
                acceptCollabRequest(notification);
                handleClosePopper();
              }}
              style={{ borderRadius: '100px' }}
            >
              Accept
            </PrimaryButton>
            <SecondaryButton
              className={
                theme === 'dark' ? classes.darkButton : classes.emptyStyle
              }
              size="small"
              onClick={() => {
                refuseCollabRequest(notification);
                handleClosePopper();
              }}
              style={{ borderRadius: '100px' }}
            >
              Decline
            </SecondaryButton>
          </>
        ) : null}
        {notification.type === 106 ? (
          <>
            <PrimaryButton
              className={
                theme === 'dark' ? classes.darkButton : classes.blueButton
              }
              size="small"
              onClick={() => signTxAcceptCollab(notification)}
              style={{ borderRadius: '100px' }}
            >
              Sign Transaction
            </PrimaryButton>
          </>
        ) : null}

        {notification.type === 112 ? (
          <>
            <PrimaryButton
              className={
                theme === 'dark' ? classes.darkButton : classes.blueButton
              }
              size="small"
              onClick={() => {}}
              style={{ borderRadius: '100px' }}
            >
              View Offer
            </PrimaryButton>
          </>
        ) : null}

        {notification.type === 113 ? (
          <>
            <PrimaryButton
              className={
                theme === 'dark' ? classes.darkButton : classes.blueButton
              }
              size="small"
              onClick={() => {
                setSelectedNotification(notification);
                viewMore && viewMore(notification);
                handleClosePopper();
              }}
              style={{ borderRadius: '100px' }}
            >
              Media Selling Offer
            </PrimaryButton>
          </>
        ) : null}

        {notification.type === 129 ? (
          <>
            <PrimaryButton
              className={
                theme === 'dark' ? classes.darkButton : classes.blueButton
              }
              size="small"
              onClick={() => {
                history.push(`/profile/${notification.itemId}`);
                handleClosePopper();
              }}
              style={{ borderRadius: '100px' }}
            >
              View User Profile
            </PrimaryButton>
          </>
        ) : notification.type === 221 || notification.type === 258 ? (
          <>
            <PrimaryButton
              className={
                theme === 'dark' ? classes.darkButton : classes.blueButton
              }
              size="small"
              onClick={() => {
                removeNotification();
                history.push(`/capsules/${notification.otherItemId}`);
                handleClosePopper();
              }}
              style={{ borderRadius: '100px' }}
            >
              See Proposal
            </PrimaryButton>
          </>
        ) : notification.type === 234 ? (
          <PrimaryButton
            className={
              theme === 'dark' ? classes.darkButton : classes.blueButton
            }
            size="small"
            onClick={async () => {
              setIsLoadingAccept(true);
              await followUser(
                notification.itemId,
                false,
                notification.id,
                false
              );
              removeNotification();
              handleClosePopper();
              setIsLoadingAccept(false);
            }}
            style={{ borderRadius: '100px' }}
          >
            Follow Back
          </PrimaryButton>
        ) : null}
      </ButtonContainer>
      {notification.type === 216 ||
      notification.type === 217 ||
      notification.type === 218 ||
      notification.type === 219 ||
      notification.type === 259 ||
      notification.type === 260 ||
      notification.type === 261 ||
      notification.type === 262 ||
      notification.type === 266 ||
      notification.type === 268 ||
      notification.type === 269 ||
      notification.type === 271 ||
      notification.type === 272 ||
      notification.type === 273 ||
      notification.type === 287 ? (
        <PrimaryButton
          className={theme === 'dark' ? classes.darkButton : classes.blueButton}
          size="small"
          onClick={() => {
            history.push(`/capsules/${notification.otherItemId}`);
            handleClosePopper();
          }}
          style={{ borderRadius: '100px' }}
        >
          See Capsule
        </PrimaryButton>
      ) : notification.type === 232 ? (
        <Box display="flex" alignItems="center">
          <SecondaryButton
            style={{
              background: 'transparent',
              border: '2px solid #707582',
              color: '#707582',
              borderRadius: '100px'
            }}
            size="small"
            onClick={() => {
              declineInvitationPodCollab(notification);
              handleClosePopper();
            }}
          >
            Decline
          </SecondaryButton>
          <PrimaryButton
            className={
              theme === 'dark' ? classes.darkButton : classes.blueButton
            }
            size="small"
            onClick={() => {
              acceptInvitationPodCollab(notification);
              handleClosePopper();
            }}
            style={{ borderRadius: '100px' }}
          >
            Accept
          </PrimaryButton>
        </Box>
      ) : notification.type === 256 || notification.type === 257 ? (
        <>
          <PrimaryButton
            className={
              theme === 'dark' ? classes.darkButton : classes.blueButton
            }
            size="small"
            onClick={gotoProfile}
            style={{ borderRadius: '100px' }}
          >
            Go to your feed
          </PrimaryButton>
        </>
      ) : notification.type === 261 || notification.type === 262 ? (
        <PrimaryButton
          className={theme === 'dark' ? classes.darkButton : classes.blueButton}
          size="small"
          onClick={() => {
            history.push(`/capsules/${notification.otherItemId}`);
          }}
          style={{ borderRadius: '100px' }}
        >
          Go to NFT
        </PrimaryButton>
      ) : notification.type === 285 || notification.type === 263 ? (
        <>
          <PrimaryButton
            className={
              theme === 'dark' ? classes.darkButton : classes.blueButton
            }
            size="small"
            onClick={() =>
              history.push(`/capsules/${notification.otherItemId}`)
            }
            style={{ borderRadius: '100px' }}
          >
            Go to Capsule
          </PrimaryButton>
        </>
      ) : null}

      {status && (
        <AlertMessage
          key={status.key}
          message={status.msg}
          variant={status.variant}
          onClose={() => setStatus('')}
        />
      )}
    </>
  );
};
