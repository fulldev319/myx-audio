import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

import Grid from '@material-ui/core/Grid';

import WallItem from 'components/MusicDao/subPages/PodDetailsPage/SubPages/Discussion/components/WallItem';
import { ArrowIcon } from '../../components/Icons/SvgIcons';

import Box from 'shared/ui-kit/Box';
import { CircularLoadingIndicator, Color, PrimaryButton } from 'shared/ui-kit';
import URL from 'shared/functions/getURL';
import { allWallPostsPageStyles } from './index.styles';
import CreateNewWallPostModal from 'components/MusicDao/modals/CreateNewWallPostModal';

const LoadingIndicatorWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
`;

export default function AllWallPostsPage() {
  const classes = allWallPostsPageStyles();
  const history = useHistory();
  const params: any = useParams();

  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCreatorOrCollab, setIsCreatorOrCollab] = useState<boolean>(false);
  const [openModalNewPodPost, setOpenModalNewPodPost] =
    useState<boolean>(false);

  useEffect(() => {
    if (params?.id) {
      checkCreatorOrCollab();
      loadPosts();
    }
  }, [params?.id]);

  // load pods for next page
  const checkCreatorOrCollab = () => {
    axios.get(`${URL()}/pod/checkCreatorOrCollab/${params.id}`).then((res) => {
      if (res.data.success) setIsCreatorOrCollab(res.data.result);
    });
  };

  // load pods for next page
  const loadPosts = () => {
    setIsLoading(true);
    axios
      .get(`${URL()}/pod/discussion/wall/getPodPosts/${params.id}/TRAX`)
      .then((res) => {
        setPosts(res.data.data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className={classes.content} id={'scrollContainerOnAllWallPostsPage'}>
      <div className={classes.headerTitle}>
        <div className={classes.headerBack} onClick={() => history.goBack()}>
          <Box color="#FFFFFF">
            <ArrowIcon />
          </Box>
          <Box color="#FFFFFF" fontSize={14} fontWeight={700} ml="5px" mb="4px">
            BACK
          </Box>
        </div>
        <div className={classes.headerMainTitle}>All Posts</div>
        {isCreatorOrCollab ? (
          <PrimaryButton
            size="medium"
            isRounded
            style={{ background: Color.MusicDAODark }}
            onClick={() => setOpenModalNewPodPost(true)}
          >
            Create New
          </PrimaryButton>
        ) : (
          <div />
        )}
      </div>
      <Box mt={4}>
        {isLoading ? (
          <LoadingIndicatorWrapper>
            <CircularLoadingIndicator />
          </LoadingIndicatorWrapper>
        ) : (
          <Grid container spacing={2} wrap="wrap">
            {posts.map((item, index) => (
              <Grid
                key={`pod-posts-${index}`}
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
              >
                <WallItem
                  item={item}
                  Creator={(item as any).authorData}
                  key={`wall-item-${index}`}
                  type={'MediaPodPost'}
                  itemTypeId={params.id}
                  handleRefresh={() => loadPosts()}
                  index={index}
                  isOnAllPage
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
      {openModalNewPodPost && (
        <CreateNewWallPostModal
          handleClose={() => setOpenModalNewPodPost(false)}
          open={openModalNewPodPost}
          podId={params.id}
          postCreated={loadPosts}
        />
      )}
    </div>
  );
}
