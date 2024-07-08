import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

import Grid from '@material-ui/core/Grid';

import { RootState } from 'store/reducers/Reducer';
import useWindowDimensions from 'shared/hooks/useWindowDimensions';
import { default as ServerURL } from 'shared/functions/getURL';
import URL from 'shared/functions/getURL';
import { LoadingWrapper } from 'shared/ui-kit/Hocs';
import { PrimaryButton, SecondaryButton } from 'shared/ui-kit';
import Box from 'shared/ui-kit/Box';
import { MasonryGrid } from 'shared/ui-kit/MasonryGrid/MasonryGrid';
import { ArrowLeftIcon } from 'components/MusicDao/subPages/GovernancePage/styles';
import CreateNewVoteModal from 'components/MusicDao/modals/CreateNewVoteModal';
import CreateNewTopicModal from 'components/MusicDao/modals/CreateNewTopicModal';
import CreateNewWallPostModal from 'components/MusicDao/modals/CreateNewWallPostModal';
import WallItem from './components/WallItem';
import PollItem from './components/PollItem';
import DiscussionPage from './components/DiscussionPage';
import { usePodDetailStyles } from '../../index.styles';

const COLUMNS_COUNT_BREAK_POINTS = {
  767: 2,
  900: 3,
  1200: 4,
  1510: 5
};

export default function Discussion(props) {
  const classes = usePodDetailStyles();

  const userSelector = useSelector((state: RootState) => state.user);

  const pageDiscussionRef = useRef();

  const width = useWindowDimensions().width;

  const [displayPollsSelection, setDisplayPollsSelection] = useState<number>(0);

  const [seeAll, setSeeAll] = useState<boolean>(false);

  //modal controller
  const [openNewTopic, setOpenNewTopic] = useState<boolean>(false);
  const [discussions, setDiscussions] = useState<any>();

  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);
  const [openModalNewPodPost, setOpenModalNewPodPost] =
    useState<boolean>(false);

  const [createPollModal, setCreatePollModal] = useState<boolean>(false);

  useEffect(() => {
    if (props.podId) {
      setIsDataLoading(true);
      axios
        .get(`${URL()}/podDiscussion/new/getDiscussions/${props.podId}/TRAX`)
        .then((res) => {
          setDiscussions(res.data.topics);
          setIsDataLoading(false);
        })
        .catch((error) => {
          setIsDataLoading(false);
        });
    }
  }, [props.podId]);

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
        const newDiscussionData = [
          { id: resp.topicId, ...resp.topicData },
          ...discussions
        ];
        setDiscussions(newDiscussionData);
      });
  };

  if (props.pod && props.pod.PodAddress)
    return (
      <div>
        <Box className={classes.flexBox} justifyContent="space-between">
          {((props.pod.PostsArray && props.pod.PostsArray.length > 0) ||
            props.pod.Creator === userSelector.id ||
            props.pod.Creator === userSelector.address) && (
            <Box className={classes.title2}>Wall</Box>
          )}
          <Box className={classes.flexBox}>
            {(props.pod.Creator === userSelector.id ||
              props.pod.Creator === userSelector.address) && (
              <PrimaryButton
                size="medium"
                className={`${classes.commonBtn} ${classes.createWallBtn}`}
                onClick={() => setOpenModalNewPodPost(true)}
              >
                Create New
              </PrimaryButton>
            )}
            {props.pod.PostsArray && props.pod.PostsArray.length > 5 && (
              <SecondaryButton
                size="medium"
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
        <Box mt={'25px'} mb={'66px'} width={1}>
          {props.pod.PostsArray && props.pod.PostsArray.length > 0 ? (
            <MasonryGrid
              data={props.pod.PostsArray.filter(
                (_, index) =>
                  seeAll ||
                  (!seeAll &&
                    ((width >= 1440 && index < 5) ||
                      (width < 1440 && width >= 1200 && index < 4) ||
                      (width < 1200 && width >= 900 && index < 3) ||
                      (width < 900 && width >= 600 && index < 2) ||
                      (width <= 600 && index < 1)))
              )}
              renderItem={(item, index) => (
                <Box mx={1} width={1}>
                  <WallItem
                    item={item}
                    Creator={(item as any).createdBy}
                    key={`wall-item-${index}`}
                    type={'MediaPodPost'}
                    itemTypeId={props.pod.id || props.pod.PodAddress}
                    admin={props.pod.Creator === userSelector.id}
                    handleRefresh={() => props.handleRefresh()}
                    index={index}
                  />
                </Box>
              )}
              columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS}
              gutter={'36px'}
            />
          ) : (
            props.pod.Creator === userSelector.id && (
              <Box className={'no-content-container'}>
                <Box mt={2}>No posts yet</Box>
              </Box>
            )
          )}
        </Box>
        <Box mb={'28px'} width={1} height="1px" bgcolor="#00000022" />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={7} md={8}>
            <Box
              mb={3}
              className={classes.flexBox}
              justifyContent="space-between"
            >
              <Box className={classes.title2}>Threads</Box>
              <PrimaryButton
                size="medium"
                className={`${classes.commonBtn} ${classes.discussionBtn}`}
                onClick={() => setOpenNewTopic(true)}
              >
                Start Discussion
              </PrimaryButton>
            </Box>
            <Box className={classes.contentBox}>
              <LoadingWrapper loading={isDataLoading}>
                <DiscussionPage
                  discussions={discussions}
                  postType="mediaPod"
                  podId={props.podId}
                  key={props.podId}
                  pageDiscussionRef={pageDiscussionRef}
                  createNewTopic={createNewTopic}
                />
              </LoadingWrapper>
            </Box>
          </Grid>
          <Grid item xs={12} sm={5} md={4}>
            <Box
              mb={3}
              className={classes.flexBox}
              justifyContent="space-between"
            >
              <Box className={classes.title2}>Polls</Box>
              <PrimaryButton
                size="medium"
                onClick={() => setCreatePollModal(true)}
                className={`${classes.commonBtn} ${classes.createPollBtn}`}
              >
                Create New
              </PrimaryButton>
            </Box>
            <Box className={classes.contentBox}>
              {props.pod.Votings && props.pod.Votings.length > 0 ? (
                <>
                  <Box display="flex" mb={2.5}>
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
                  <Box className={classes.pollBox}>
                    {props.pod.Votings.filter((poll) =>
                      displayPollsSelection === 1
                        ? new Date().getTime() <
                          new Date(poll.EndingDate).getTime()
                        : displayPollsSelection === 2
                        ? new Date().getTime() >=
                          new Date(poll.EndingDate).getTime()
                        : poll !== undefined
                    ).map((item, index) => {
                      if (item.OpenVotation) {
                        return (
                          <PollItem key={`poll-detail-${index}`} item={item} />
                        );
                      } else return null;
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
            open={createPollModal}
            isVotation
          />
        )}
        {openModalNewPodPost && (
          <CreateNewWallPostModal
            handleClose={() => setOpenModalNewPodPost(false)}
            open={openModalNewPodPost}
            pod={props.pod}
          />
        )}
      </div>
    );
  else return <p>Error displaying pod data</p>;
}
