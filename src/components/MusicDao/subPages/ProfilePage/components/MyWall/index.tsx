import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import styled from 'styled-components';

import URL from 'shared/functions/getURL';
import AlertMessage from 'shared/ui-kit/Alert/AlertMessage';
import { RootState } from 'store/reducers/Reducer';
import { MasonryGrid } from 'shared/ui-kit/MasonryGrid/MasonryGrid';
import { CircularLoadingIndicator, PrimaryButton } from 'shared/ui-kit';
import Box from 'shared/ui-kit/Box';
import WallFeedCard from 'components/MusicDao/components/Cards/WallFeedCard';
import CreateWallPostModal from './CreateWallPostModal';
import { wallStyles } from './index.styles';

const LoadingIndicatorWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
  padding-bottom: 50px;
`;

const COLUMNS_COUNT_BREAK_POINTS = {
  675: 1,
  900: 2,
  1400: 3
};

const GUTTER = '40px';

const arePropsEqual = (prevProps, currProps) => {
  return (
    prevProps.userId === currProps.userId &&
    prevProps.userProfile === currProps.userProfile
  );
};

const MyWall = React.memo(
  ({ userId, userProfile }: { userId: string; userProfile: any }) => {
    const classes = wallStyles();

    const user = useSelector((state: RootState) => state.user);
    const [posts, setPosts] = useState<any[]>([]);
    const [status, setStatus] = useState<any>('');
    const [isDataLoading, setIsDataLoading] = useState<boolean>(false);

    // const [superFollowersAllowed, setSuperFollowersAllowed] = useState<boolean>(false);
    // pagination
    const [lastId, setLastId] = useState<any>(null);
    const [hasMore, setHasMore] = useState<any>(true);
    const [
      openCreateWallPostModal,
      setOpenCreateWallPostModal
    ] = useState<boolean>(false);

    const handleOpenCreateWallPostModal = () => {
      setOpenCreateWallPostModal(true);
    };
    const handleCloseCreateWallPostModal = () => {
      setOpenCreateWallPostModal(false);
    };

    useEffect(() => {
      if (userId) {
        getPosts();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    // useEffect(() => {
    //   //TODO: update on backend and set who can post on user's wall
    // }, [superFollowersAllowed]);

    const getPosts = (init = false) => {
      if (isDataLoading) return;
      setIsDataLoading(true);
      const config = {
        params: {
          userId: userId,
          lastId: init ? null : lastId
        }
      };
      axios
        .get(`${URL()}/user/wall/getUserPosts`, config)
        .then((res) => {
          const resp = res.data;
          if (resp.success) {
            let data = [...resp.data];

            data.forEach(async (post, index) => {
              if (post?.hasPhoto) {
                let mediaUrl = post.url;

                try {
                  run(mediaUrl).then((dim) => {
                    data[index].dimensions = dim;
                  });
                } catch (e) {
                  console.log(e);
                }
              }
            });

            data.sort((a, b) => b.schedulePost - a.schedulePost);
            data.sort((a, b) =>
              a.pinned === b.pinned ? 0 : a.pinned ? -1 : b.pinned
            );

            const newPosts = data.filter(
              (wall) => wall.selectedFormat === 1 || wall.selectedFormat === 2
            );
            setHasMore(resp.hasMore);
            setLastId(resp.lastId);
            if (init) {
              setPosts(newPosts);
            } else {
              setPosts((prev) => [...prev, ...newPosts]);
            }
          } else {
            setStatus({
              msg: resp.error,
              key: Math.random(),
              variant: 'error'
            });
          }
          setIsDataLoading(false);
        })
        .catch((err) => {
          setStatus({
            msg: 'Error making get posts request',
            key: Math.random(),
            variant: 'success'
          });
          setIsDataLoading(false);
        });

      async function run(url) {
        let img: any = await getMeta(url);

        let w = img.width;
        let h = img.height;

        return { height: h, width: w };
      }
    };

    function getMeta(url) {
      return new Promise((resolve, reject) => {
        let img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject();
        img.src = url;
      });
    }

    if (userId)
      return (
        <Box py={7}>
          {user.id === userId && (
            <div className={classes.wallPostOption}>
              <PrimaryButton
                size="medium"
                onClick={handleOpenCreateWallPostModal}
                className={classes.manageButton}
              >
                Create New
              </PrimaryButton>
            </div>
          )}

          <InfiniteScroll
            hasChildren={posts.length > 0}
            dataLength={posts.length}
            scrollableTarget="profile-infite-scroll"
            next={getPosts}
            hasMore={hasMore}
            loader={
              <LoadingIndicatorWrapper>
                <CircularLoadingIndicator />
              </LoadingIndicatorWrapper>
            }
            style={{ overflow: 'inherit' }}
          >
            <>
              <MasonryGrid
                data={posts}
                renderItem={(item, index) => (
                  <WallFeedCard
                    delRefresh={() => {
                      setPosts((prev) => prev.filter((_, i) => i !== index));
                      getPosts();
                    }}
                    item={item}
                    key={`feed-item-${index}`}
                  />
                )}
                columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS}
                gutter={GUTTER}
              />
            </>
          </InfiniteScroll>
          {posts && posts.length === 0 && !isDataLoading && (
            <Box mt={3}>No Posts available</Box>
          )}
          {status ? (
            <AlertMessage
              key={status.key}
              message={status.msg}
              variant={status.variant}
            />
          ) : (
            ''
          )}
          <CreateWallPostModal
            open={openCreateWallPostModal}
            handleClose={handleCloseCreateWallPostModal}
            userId={userId}
            type={'UserPost'}
            handleRefresh={() => getPosts(true)}
          />
        </Box>
      );
    else return null;
  },
  arePropsEqual
);

export default MyWall;
