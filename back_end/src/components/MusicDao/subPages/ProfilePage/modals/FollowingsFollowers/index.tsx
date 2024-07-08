import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import { GreenText } from 'components/MusicDao/index.styles';
import { GreenSlider } from 'components/MusicDao/subPages/ProfilePage/components/Feed';
import ClosenessDegreeModal from '../ClosenessDegreeModal';

import URL from 'shared/functions/getURL';
import AlertMessage from 'shared/ui-kit/Alert/AlertMessage';
import { useUserConnections } from 'shared/contexts/UserConnectionsContext';
import * as UserConnectionsAPI from 'shared/services/API/UserConnectionsAPI';
import { Avatar, Modal } from 'shared/ui-kit';
import Box from 'shared/ui-kit/Box';
import { LoadingWrapper } from 'shared/ui-kit/Hocs';
import { getDefaultAvatar } from 'shared/services/user/getUserAvatar';
import { StyledSkeleton } from 'shared/ui-kit/Styled-components/StyledComponents';
import { processImage } from 'shared/helpers';

import { profileFollowsModalStyles } from './index.styles';

// const interestsList = ["art", "arts and crafts", "Investing", "NFTs", "Exclusive material"];

const arePropsEqual = (prevProps, currProps) => {
  return (
    prevProps.open === currProps.open &&
    prevProps.header === currProps.header &&
    prevProps.list === currProps.list &&
    prevProps.isLoadingFollows === currProps.isLoadingFollows
  );
};

const ProfileFollowsModal = React.memo(
  ({
    list,
    onClose,
    open,
    header,
    refreshFollowings,
    refreshFollowers,
    isLoadingFollows,
    ownUser = true,
    userProfile,
    userId
  }: {
    userProfile: any;
    list: any[];
    onClose: () => void;
    open: boolean;
    header: 'Followers' | 'Followings';
    refreshFollowings: () => void;
    refreshFollowers: () => void;
    isLoadingFollows: boolean;
    ownUser: boolean;
    userId: string;
  }) => {
    const userConnections = useUserConnections();
    const classes = profileFollowsModalStyles();
    const history = useHistory();

    const [usersFilteredList, setUsersFilteredList] = useState<any[]>([]);

    const [suggestionsList, setSuggestionsList] = useState<any[]>([]);
    const [filteredSuggestList, setFilteredSuggestList] = useState<any[]>([]);

    const [loadingSuggestions, setLoadingSuggestions] =
      useState<boolean>(false);

    const [interestFilters, setInterestFilters] = useState<string[]>([]);
    const [closenessDegree, setClosenessDegree] = useState<number[]>([0, 2]);

    const [followingList, setFollowingList] = useState<any[]>([]);

    const [selectedUser, setSelectedUser] = useState<any>();

    const [status, setStatus] = useState<any>('');

    const [openClosenessDegreeModal, setOpenClosenessDegreeModal] =
      useState<boolean>(false);

    const getEllipsis = React.useCallback((item: string | undefined) => {
      if (item) {
        return item.length > 17
          ? item.substr(0, 13) + '...' + item.substr(item.length - 3, 3)
          : item;
      } else {
        return '';
      }
    }, []);

    const handleOpenClosenessDegreeModal = (u) => {
      setSelectedUser(u);
      setOpenClosenessDegreeModal(true);
    };

    const handleCloseClosenessDegreeModal = () => {
      setOpenClosenessDegreeModal(false);
      setSelectedUser(null);
    };

    useEffect(() => {
      getSuggesttedUsers();
    }, []);

    useEffect(() => {
      let us = [] as any;
      // 0: never, 1: request, 2: follow or following
      if (list && list.length > 0) {
        list
          .filter((user) =>
            header === 'Followers'
              ? user.isFollower === 2
              : user.isFollowing === 2
          )
          .forEach((user) => {
            if (
              (!user.closenessDegree ||
                (user.closenessDegree >= closenessDegree[0] &&
                  user.closenessDegree <= closenessDegree[1])) &&
              (interestFilters.length === 0 ||
                !user.interests ||
                user.interests.some((r) => interestFilters.indexOf(r) >= 0))
            ) {
              us.push(user);
            }
          });
        setUsersFilteredList(us);

        setFollowingList(list);
      }
    }, [list, closenessDegree, interestFilters]);

    useEffect(() => {
      setFilteredSuggestList(
        suggestionsList.filter((s) => {
          // return ![...usersFilteredList.map(u => u.id), userProfile.id].includes(s.id)
          return ![...followingList.map((u) => u.id), userProfile.id].includes(
            s.id
          );
        })
      );
    }, [suggestionsList, followingList]);

    const getSuggesttedUsers = async () => {
      setLoadingSuggestions(true);
      if (header === 'Followers') {
        const following = (await UserConnectionsAPI.getFollowings(
          userId,
          ownUser
        )) as any[];
        setFollowingList(following);
      }
      axios
        .get(`${URL()}/user/topSellers`)
        .then((res) => {
          const resp = res.data;
          if (resp.success) {
            const data = resp.userList;

            let suggestions = [...data];

            suggestions.sort((a, b) => b.myMediasCount - a.myMediasCount);
            setSuggestionsList(suggestions);
          }
        })
        .catch((e) => console.log(e))
        .finally(() => {
          setLoadingSuggestions(false);
        });
    };

    const goToProfile = (id: any) => {
      history.push(`/profile/${id}`);
      onClose();
    };

    const followUser = async (item: any) => {
      try {
        await userConnections.followUser(item.id, true);

        setStatus({
          msg: `Follow notification sent to ${item.name}`,
          key: Math.random(),
          variant: 'success'
        });

        setFilteredSuggestList((prev) => prev.filter((x) => x.id !== item.id));

        // if (header === "Followers") {
        //   refreshFollowers();
        // } else if (header === "Followings") {
        //   refreshFollowings();
        // }
      } catch (err) {
        setStatus({
          msg: `Sorry, failed to follow ${item.name}`,
          key: Math.random(),
          variant: 'error'
        });
      }
    };

    const unfollowUser = async (item: any) => {
      try {
        await userConnections.unfollowUser(item.id);

        setStatus({
          msg: `Stopped to follow ${item.name}`,
          key: Math.random(),
          variant: 'success'
        });

        if (header === 'Followers') {
          refreshFollowers();
        } else if (header === 'Followings') {
          refreshFollowings();
        }
      } catch (err) {
        setStatus({
          msg: `Sorry, failed to stop following ${item.name}`,
          key: Math.random(),
          variant: 'error'
        });
      }
    };

    return (
      <Modal
        className={classes.root}
        isOpen={open}
        onClose={onClose}
        showCloseIcon
        size="medium"
      >
        <h3>
          {list?.filter((user) =>
            header === 'Followers'
              ? user.isFollower === 2
              : user.isFollowing === 2
          )?.length || 0}{' '}
          {header}
        </h3>

        <LoadingWrapper theme="blue" loading={isLoadingFollows}>
          {!list ||
          list.filter((user) =>
            header === 'Followers'
              ? user.isFollower === 2
              : user.isFollowing === 2
          ).length === 0 ? (
            <div>
              {header === 'Followers' ? (
                <div>You don't have no followers yet</div>
              ) : (
                <div>Start to follow</div>
              )}
            </div>
          ) : (
            <>
              {/* <Box color="#707582" mb="12px">
                Filter by Interests
              </Box>

              <Box display="flex" alignItems="center" mb={"32px"}>
                {interestsList.map((interest, index) => (
                  <div
                    onClick={() => {
                      if (interestFilters.includes(interest)) {
                        let ins = interestFilters.splice(index, 1);
                        setInterestFilters(ins);
                      } else {
                        let ins = [...interestFilters, interest];
                        setInterestFilters(ins);
                      }
                    }}
                    className={cls(
                      { [classes.filterPillSelected]: interestFilters.includes(interest) },
                      classes.filterPill
                    )}
                    key={index}
                  >
                    {interest}
                  </div>
                ))}
              </Box> */}
              <Box mb={'32px'}>
                <Box color="#000000" fontSize="16px" mb="2">
                  Filter by degree of connection
                </Box>
                <GreenSlider
                  min={0}
                  marks
                  step={0.1}
                  max={3}
                  value={closenessDegree}
                  onChange={(event: any, newValue: number | number[]) => {
                    setClosenessDegree(newValue as number[]);
                  }}
                  className={classes.slider}
                  valueLabelDisplay="auto"
                />
                <Box
                  display="flex"
                  justifyContent="space-between"
                  color="#707582"
                  mt={'6px'}
                  fontSize="11px"
                >
                  <Box>0</Box>
                  <Box>3.0</Box>
                </Box>
              </Box>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb="16px"
              >
                <h4>Users</h4>
                {ownUser && <h4>Degree of connection</h4>}
              </Box>
              <div className={classes.usersList}>
                {usersFilteredList.map((item: any, index: number) => {
                  return (
                    <Box
                      display="flex"
                      mb={2}
                      alignItems="center"
                      justifyContent="space-between"
                      key={index}
                    >
                      <Box
                        alignItems="center"
                        display="flex"
                        style={{ cursor: 'pointer' }}
                        onClick={() => goToProfile(item.urlSlug ?? item.id)}
                      >
                        <Avatar
                          url={item.urlIpfsImage || getDefaultAvatar()}
                          size="small"
                        />
                        <Box ml={'14px'}>
                          <Box>
                            {item.name ?? item.firstName ?? 'User name'}
                          </Box>
                          <Box mt={'4px'} fontSize="11px" color="#707582">
                            @{getEllipsis(item.urlSlug)}
                          </Box>
                        </Box>
                      </Box>

                      {ownUser && (
                        <div
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleOpenClosenessDegreeModal(item)}
                        >
                          <GreenText fontSize="14px" fontWeight={600}>
                            {item.closenessDegree && item.closenessDegree !== 0
                              ? item.closenessDegree
                              : ` + Degree of connection`}
                          </GreenText>
                        </div>
                      )}
                    </Box>
                  );
                })}
              </div>
            </>
          )}
        </LoadingWrapper>

        <Box mt="40px" mb="18px">
          Users you may want to follow
        </Box>
        <LoadingWrapper theme="blue" loading={loadingSuggestions}>
          {!filteredSuggestList || filteredSuggestList.length === 0 ? (
            <div>No suggested users</div>
          ) : (
            <div className={classes.usersList}>
              {filteredSuggestList.map((item, index) => (
                <Box
                  mb={2}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  key={index}
                >
                  <Box
                    alignItems="center"
                    display="flex"
                    style={{ cursor: 'pointer' }}
                    onClick={() => goToProfile(item.urlSlug ?? item.id)}
                  >
                    <Avatar
                      url={processImage(item.imageUrl) || getDefaultAvatar()}
                      size="small"
                    />
                    <Box ml={'14px'}>
                      <Box>
                        {item.name ?? item.firstName ?? (
                          <StyledSkeleton width={120} animation="wave" />
                        )}
                      </Box>
                      <Box mt={'4px'} fontSize="11px" color="#707582">
                        @{getEllipsis(item.urlSlug)}
                      </Box>
                    </Box>
                  </Box>

                  {ownUser &&
                    (followingList.find((u) => u.id === item.id)
                      ?.isFollowing === 2 ? (
                      <button
                        onClick={() => unfollowUser(item)}
                        className={classes.optionsConnectionButtonUnfollow}
                      >
                        Unfollow
                      </button>
                    ) : followingList.find((u) => u.id === item.id)
                        ?.isFollowing === 1 ? (
                      <button
                        className={classes.optionsConnectionButtonRequest}
                      >
                        Request sent
                      </button>
                    ) : (
                      <button
                        onClick={() => followUser(item)}
                        className={classes.optionsConnectionButton}
                        style={{ border: 'none' }}
                      >
                        + Follow
                      </button>
                    ))}
                </Box>
              ))}
            </div>
          )}
        </LoadingWrapper>

        {status ? (
          <AlertMessage
            key={status.key}
            message={status.msg}
            variant={status.variant}
          />
        ) : (
          ''
        )}

        <ClosenessDegreeModal
          user={selectedUser}
          header={header}
          handleClose={handleCloseClosenessDegreeModal}
          open={openClosenessDegreeModal}
          refreshFollowings={refreshFollowings}
          refreshFollowers={refreshFollowers}
        />
      </Modal>
    );
  },
  arePropsEqual
);

export default ProfileFollowsModal;
