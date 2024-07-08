import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import Grid from '@material-ui/core/Grid';

import { RootState } from 'store/reducers/Reducer';
import { ArrowLeftIcon } from 'components/MusicDao/subPages/GovernancePage/styles';
import CreateNewVoteModal from 'components/MusicDao/modals/CreateNewVoteModal';
import CreateNewTopicModal from 'components/MusicDao/modals/CreateNewTopicModal';
import CreateNewWallPostModal from 'components/MusicDao/modals/CreateNewWallPostModal';
import WallItem from './components/WallItem';
import PollItem from './components/PollItem';
import ListChats from '../Chat/ListChats';
import Discord from '../../Discord';
import { socket } from '../../../../../Login/Auth';

import useWindowDimensions from 'shared/hooks/useWindowDimensions';
import { default as ServerURL } from 'shared/functions/getURL';
import URL from 'shared/functions/getURL';
import { LoadingWrapper } from 'shared/ui-kit/Hocs';
import { PrimaryButton, SecondaryButton } from 'shared/ui-kit';
import Box from 'shared/ui-kit/Box';
import { MasonryGrid } from 'shared/ui-kit/MasonryGrid/MasonryGrid';

import { usePodDetailStyles } from '../../index.styles';

const COLUMNS_COUNT_BREAK_POINTS = {
  675: 1,
  900: 2,
  1200: 3,
  1440: 4
};

export default function Discussion(props) {
  const classes = usePodDetailStyles();
  const width = useWindowDimensions().width;
  const history = useHistory();

  const userSelector = useSelector((state: RootState) => state.user);

  const [displayPollsSelection, setDisplayPollsSelection] = useState<number>(0);
  const [seeAll, setSeeAll] = useState<boolean>(false);
  //modal controller
  const [openNewTopic, setOpenNewTopic] = useState<boolean>(false);
  const [discussions, setDiscussions] = useState<any>();
  const [posts, setPosts] = useState<any>();
  const [polls, setPolls] = useState<any[]>([]);

  const [isPostLoading, setIsPostLoading] = useState<boolean>(false);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);
  const [openModalNewPodPost, setOpenModalNewPodPost] =
    useState<boolean>(false);

  const [createPollModal, setCreatePollModal] = useState<boolean>(false);

  const [selectedChat, setSelectedChat] = useState<any>({});
  const [selectedChatId, setSelectedChatId] = useState<string>('');

  useEffect(() => {
    if (props.podId) {
      if (props.pod && props.pod.Discussions) {
        setDiscussions(props.pod.Discussions);
        if (props.pod.Discussions?.length > 0) {
          onTopicSelected(props.pod.Discussions[0]);
        }
      }

      getWallPosts();
      getPodDiscussions();
    }
  }, [props.podId]);

  useEffect(() => {
    if (props.podId && props.pod?.Polls) {
      setPolls(props.pod.Polls || []);
    }
  }, [props.podId, props.pod?.Polls]);

  const getWallPosts = () => {
    setIsPostLoading(true);
    axios
      .get(`${URL()}/pod/discussion/wall/getPodPosts/${props.podId}/TRAX`)
      .then((res) => {
        setPosts(res.data.data);
        setIsPostLoading(false);
      })
      .catch((error) => {
        setIsPostLoading(false);
      });
  };

  const getPodDiscussions = () => {
    axios
      .get(`${URL()}/podDiscussion/getDiscussions/${props.podId}/TRAX`)
      .then((res) => {
        setDiscussions(res.data.topics);
        if (res.data.topics?.length > 0) {
          onTopicSelected(res.data.topics[0]);
        }
      })
      .catch((error) => {});
  };

  const onTopicSelected = (val) => {
    socket?.emit('subscribe-podDiscussion', {
      podId: props.podId,
      topicId: val.id,
      userId: userSelector.id,
      podType: 'TRAX'
    });
    setSelectedChatId(val.id);
    setSelectedChat(val);
  };

  const createNewTopic = (title, description) => {
    axios
      .post(`${ServerURL()}/podDiscussion/new/newChat`, {
        title,
        description,
        podId: props.podId,
        createdBy: userSelector.id,
        podType: 'TRAX'
      })
      .then((response) => {
        const resp = response.data.data;
        if (response.data.success) {
          const newDiscussionData = [
            { id: resp.topicId, ...resp.topicData },
            ...(discussions ?? [])
          ];
          setDiscussions(newDiscussionData);
          if (newDiscussionData?.length > 0) {
            onTopicSelected(newDiscussionData[0]);
          }
        }
      });
  };

  if (props.pod && (props.pod.Id || props.pod.PodAddress))
    return (
      <div>
        <Box className={classes.flexBox} justifyContent="space-between">
          <Box className={classes.title2}>Wall</Box>
          <Box className={classes.flexBox}>
            {props.isCreatorOrCollab ? (
              <PrimaryButton
                size="medium"
                className={`${classes.commonBtn} ${classes.createWallBtn}`}
                onClick={() => setOpenModalNewPodPost(true)}
              >
                Create New
              </PrimaryButton>
            ) : null}
            {posts && posts.length > 0 && (
              <SecondaryButton
                size="medium"
                onClick={() => history.push(`/all-pod-post/${props.podId}`)}
                className={`${classes.commonBtn} ${classes.showAllBtn}`}
              >
                Show All
                <Box
                  position="absolute"
                  flexDirection="row"
                  top={0}
                  right={0}
                  pr={2}
                >
                  <ArrowLeftIcon />
                </Box>
              </SecondaryButton>
            )}
          </Box>
        </Box>
        <Box mt={3} mb={8} width={1}>
          <LoadingWrapper loading={isPostLoading}>
            {posts && posts.length > 0 ? (
              <MasonryGrid
                data={posts.filter(
                  (_, index) =>
                    seeAll ||
                    (!seeAll &&
                      ((width > 1440 && index < 5) ||
                        (width <= 1440 && width >= 1200 && index < 4) ||
                        (width < 1200 && width >= 900 && index < 3) ||
                        (width < 900 && width >= 600 && index < 2) ||
                        (width <= 600 && index < 1)))
                )}
                renderItem={(item, index) => (
                  <Box mx={1} width={1}>
                    <WallItem
                      item={item}
                      Creator={(item as any).authorData}
                      key={`wall-item-${index}`}
                      type={'MediaPodPost'}
                      itemTypeId={props.pod.Id || props.pod.PodAddress}
                      admin={props.pod.Creator === userSelector.id}
                      handleRefresh={() => props.refreshPod()}
                      index={index}
                    />
                  </Box>
                )}
                columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS}
                gutter={'36px'}
              />
            ) : (
              <Box
                className={'no-content-container'}
                style={{ textAlign: 'center' }}
              >
                <Box mt={2}>No posts yet</Box>
              </Box>
            )}
          </LoadingWrapper>
        </Box>
        <Box mb={'28px'} width={1} height="1px" bgcolor="#00000022" />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={8}>
            <Box
              mb={3}
              className={classes.flexBox}
              style={{ height: '40px' }}
              justifyContent="space-between"
            >
              <Box className={classes.title2}>Threads</Box>
              {props.isCreatorOrCollab ? (
                <PrimaryButton
                  size="medium"
                  className={`${classes.commonBtn} ${classes.discussionBtn}`}
                  onClick={() => setOpenNewTopic(true)}
                >
                  Start Discussion
                </PrimaryButton>
              ) : null}
            </Box>
            <Box className={classes.contentBox}>
              <LoadingWrapper loading={isDataLoading}>
                {discussions && discussions.length > 0 ? (
                  <Box className={classes.chatBox}>
                    <Box className={classes.chatListBox}>
                      <ListChats
                        discussions={discussions}
                        selectedChat={selectedChatId}
                        onTopicSelected={(val) => onTopicSelected(val)}
                      />
                    </Box>
                    <Box className={classes.chatContentBox}>
                      <Discord
                        podId={props.podId}
                        chatType={'PodDiscussions'}
                        chatId={selectedChatId}
                        sidebar={false}
                        theme="dark"
                      />
                    </Box>
                  </Box>
                ) : (
                  props.isCreatorOrCollab && (
                    <div
                      className={classes.flexBox}
                      style={{
                        justifyContent: 'center',
                        width: '100%',
                        height: '100%'
                      }}
                    >
                      Create a Chat Room
                    </div>
                  )
                )}
              </LoadingWrapper>
            </Box>
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <Box
              mb={3}
              className={classes.flexBox}
              style={{ height: '40px' }}
              justifyContent="space-between"
            >
              <Box className={classes.title2}>Polls</Box>
              {props.isCreatorOrCollab ? (
                <PrimaryButton
                  size="medium"
                  onClick={() => setCreatePollModal(true)}
                  className={`${classes.commonBtn} ${classes.createPollBtn}`}
                >
                  Create New
                </PrimaryButton>
              ) : null}
            </Box>
            <Box
              className={classes.contentBox}
              style={{ paddingLeft: 0, paddingRight: 0 }}
            >
              {polls && polls.length > 0 ? (
                <>
                  <Box display="flex" mb={2.5} px={2}>
                    {['All', 'Ended', 'Ongoing'].map((option, index) => (
                      <PrimaryButton
                        size="medium"
                        className={`${classes.pollBtn} ${
                          index === displayPollsSelection &&
                          classes.selectedPollBtn
                        }`}
                        onClick={() => setDisplayPollsSelection(index)}
                      >
                        {option}
                      </PrimaryButton>
                    ))}
                  </Box>
                  <Box className={classes.pollBox} px={2}>
                    {polls
                      .filter((poll) =>
                        displayPollsSelection === 1
                          ? new Date().getTime() >=
                            new Date(poll.endDate).getTime()
                          : displayPollsSelection === 2
                          ? new Date().getTime() <
                            new Date(poll.endDate).getTime()
                          : poll !== undefined
                      )
                      .map((item, index) => {
                        return (
                          <PollItem
                            key={`poll-detail-${index}`}
                            item={item}
                            pod={props.pod}
                            refreshPod={props.refreshPod}
                          />
                        );
                      })}
                  </Box>
                </>
              ) : (
                <Box
                  className={classes.flexBox}
                  justifyContent="center"
                  height={1}
                >
                  <Box mt={2}>No polls yet</Box>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
        {openNewTopic && (
          <CreateNewTopicModal
            open={openNewTopic}
            onClose={() => setOpenNewTopic(false)}
            createNewTopic={createNewTopic}
          />
        )}
        {createPollModal && (
          <CreateNewVoteModal
            handleClose={() => setCreatePollModal(false)}
            handleRefresh={props.refreshPod}
            open={createPollModal}
            pod={props.pod}
            isVotation
          />
        )}
        {openModalNewPodPost && (
          <CreateNewWallPostModal
            handleClose={() => setOpenModalNewPodPost(false)}
            open={openModalNewPodPost}
            podId={props.podId}
            postCreated={getWallPosts}
          />
        )}
      </div>
    );
  else return <p>Error displaying pod data</p>;
}
