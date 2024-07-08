import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';

import Slider from '@material-ui/core/Slider';
import withStyles from '@material-ui/core/styles/withStyles';

import FriendLabel from './components/FriendLabel';
import { socket } from 'components/Login/Auth';
import WallFeedCard from 'components/MusicDao/components/Cards/WallFeedCard';

import Box from 'shared/ui-kit/Box';
import URL from 'shared/functions/getURL';
import { Color } from 'shared/ui-kit';
import * as UserConnectionsAPI from 'shared/services/API/UserConnectionsAPI';
import { removeUndef } from 'shared/helpers';
// import ShareVoiceMessage from "shared/ui-kit/Chat/ShareVoiceMessage";
import AlertMessage from 'shared/ui-kit/Alert/AlertMessage';
import { LoadingWrapper } from 'shared/ui-kit/Hocs';
import { MasonryGrid } from 'shared/ui-kit/MasonryGrid/MasonryGrid';

import { feedStyles } from './index.styles';

const COLUMNS_COUNT_BREAK_POINTS = {
  675: 1,
  900: 2
};

const GUTTER = '40px';

const Feed = ({ userId }) => {
  const classes = feedStyles();

  const [closenessDegree, setClosenessDegree] = useState<number[]>([1.6, 2.6]);

  const [isFriendsLoading, setIsFriendsLoading] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const [filteredFriends, setFilteredFriends] = useState<any[]>([]);
  const [friends, setFriends] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [sharedVoices, setSharedVoices] = useState<any[]>([]);
  const [isSharedVoicesLoading, setIsSharedVoicesLoading] = useState(false);

  const [status, setStatus] = useState<any>('');

  // pagination
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const lastWallId = React.useRef<string | undefined>();

  useEffect(() => {
    if (socket) {
      const incomingWallPost = (wall) => {
        setPosts((prev) => [
          wall,
          ...prev.filter((item) => wall.id !== item.id)
        ]);
      };

      socket.on('new-wall-post', incomingWallPost);

      return () => {
        socket.removeListener('new-wall-post', incomingWallPost);
      };
    }
  }, []);

  useEffect(() => {
    setIsFriendsLoading(true);
    getFriends(userId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    if (userId) {
      getPosts();
      getSharedVoices();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    let fends = [] as any;
    friends.forEach((f) => {
      if (
        !searchValue ||
        (searchValue &&
          f.name &&
          f.name.toUpperCase().includes(searchValue.toUpperCase())) ||
        (f.urlSlug &&
          f.urlSlug.toUpperCase().includes(searchValue.toUpperCase()))
        // &&
        // f.closenessDegree >= closenessDegree[0] &&
        // f.closenessDegree <= closenessDegree[1]
      ) {
        fends.push(f);
      }
    });

    setFilteredFriends(fends);
  }, [friends, searchValue, closenessDegree]);

  const getPosts = (filterChanged = false) => {
    if (!hasMore || isDataLoading) return;
    setIsDataLoading(true);
    const config = {
      params: {
        userId: userId,
        lastCreatedId: lastWallId.current,
        limit: 20,
        closenessDegree: JSON.stringify(closenessDegree)
      }
    };
    axios
      .get(`${URL()}/user/feed/getPosts`, config)
      .then((res) => {
        const resp = res.data;

        if (resp.success) {
          setHasMore(resp.hasMore);
          setPosts((oldPosts) =>
            filterChanged ? resp.posts : [...oldPosts, ...resp.posts]
          );
          lastWallId.current = resp.lastCreatedId;
        } else {
          setStatus({
            msg: resp.error?.message || 'Unknown error in fetching data.',
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
  };

  const getSharedVoices = () => {
    if (isSharedVoicesLoading) return;
    setIsSharedVoicesLoading(true);
    axios
      .get(`${URL()}/chat/getSharedAudios/${userId}`)
      .then((res) => {
        const resp = res.data;

        if (resp.success) {
          setSharedVoices([...resp.data]);
        } else {
          setStatus({
            msg:
              resp.error?.message || 'Unknown error in fetching shared voices.',
            key: Math.random(),
            variant: 'error'
          });
        }
        setIsSharedVoicesLoading(false);
      })
      .catch((err) => {
        setStatus({
          msg: 'Error making get shared voices request',
          key: Math.random(),
          variant: 'success'
        });
        setIsSharedVoicesLoading(false);
      });
  };

  const getFriends = async (userId: string) => {
    const friendList = await UserConnectionsAPI.getFriends(userId);
    const friends: any[] = friendList
      .map((fr) => {
        return { ...fr, closenessDegree: fr.closenessDegree || 0 };
      })
      .filter(removeUndef);

    setFriends(friends);
    setIsFriendsLoading(false);
  };

  // const handleClosenessDegreeChange = (event: any, newValue: number | number[]) => {
  //   setClosenessDegree(newValue as number[]);
  // };

  // const handleClosenessDegreeChanged = () => {
  //   getPosts(true);
  // };

  const getFriendsBox = () => {
    return (
      <div className={classes.friends}>
        <Box mb="32px">
          <b>Friends</b> ({friends.length})
        </Box>
        <Box overflow="auto">
          {isFriendsLoading || (filteredFriends && filteredFriends.length > 0)
            ? (isFriendsLoading ? Array(3).fill(0) : filteredFriends).map(
                (friend, index) => (
                  <FriendLabel
                    friend={friend}
                    key={`friend-${index}`}
                    isLoading={isFriendsLoading}
                  />
                )
              )
            : 'No Friends'}
        </Box>
        <div className={classes.inputSearch}>
          <input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            type="text"
            placeholder="Search friends"
          />
          <img src={require('assets/icons/search_gray.webp')} />
        </div>
      </div>
    );
  };

  return (
    <div className={classes.feedMainContent}>
      {/* <div className={classes.filterMainContent}>
        <div className={classes.createPostContainer}>
          <input placeholder="Write your post..." />
          <Box display="flex" alignItems="center" height={1}>
            <img src={require("assets/icons/camera_gray.webp")} alt="camera" />
            <img src={require("assets/icons/video_gray.webp")} alt="video" />
            <div className={classes.send}>
              <img src={require("assets/icons/send_white_2.webp")} alt="send" />
            </div>
          </Box>
        </div>
        <Box className={classes.filterContainer}>
          <Box color="#181818" mr="12px" flexShrink={0}>
            💫&nbsp;&nbsp;Filter by Closeness Degree
          </Box>
          <GreenSlider
            min={0}
            marks
            step={0.1}
            max={3}
            value={closenessDegree}
            onChange={handleClosenessDegreeChange}
            onChangeCommitted={handleClosenessDegreeChanged}
            className={classes.slider}
            valueLabelDisplay="auto"
          />
        </Box>
      </div> */}
      <div className={classes.topFriendContainer}>{getFriendsBox()}</div>
      <Box display="flex" width="100%">
        <div className={classes.leftFriendContainer}>{getFriendsBox()}</div>
        <Box width={1}>
          <div>
            <InfiniteScroll
              hasChildren={posts.length > 0}
              dataLength={posts.length}
              scrollableTarget={'profile-infite-scroll'}
              next={getPosts}
              hasMore={hasMore}
              loader={<LoadingWrapper loading />}
              style={{ overflow: 'inherit' }}
            >
              <MasonryGrid
                data={posts}
                renderItem={(item, index) => (
                  <WallFeedCard
                    feedItem
                    item={item}
                    key={`feed-item-${index}`}
                  />
                )}
                columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS}
                gutter={GUTTER}
              />
            </InfiniteScroll>
          </div>
        </Box>
      </Box>
      {status && (
        <AlertMessage
          key={status.key}
          message={status.msg}
          variant={status.variant}
        />
      )}
    </div>
  );
};

export const GreenSlider = withStyles({
  root: {
    color: '#431AB7',
    height: 8,
    borderRadius: 4
  },
  thumb: {
    height: 24,
    width: 24,
    background: 'linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)',
    border: 'none',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.12)',
    marginTop: -7
  },
  mark: {
    marginTop: 3,
    backgroundColor: Color.Mint
  },
  track: {
    background: 'linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)',
    height: 8,
    borderRadius: 4
  },
  rail: {
    background: 'linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)',
    height: 8,
    borderRadius: 4
  },
  valueLabel: {
    marginLeft: '12px',
    '& span': {
      background: '#EFF2F8',
      color: '#707582',

      fontSize: '14px'
    }
  }
})(Slider);

export default Feed;
