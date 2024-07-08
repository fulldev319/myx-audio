import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useDebounce } from 'use-debounce/lib';

import makeStyles from '@material-ui/core/styles/makeStyles';
import Avatar from '@material-ui/core/Avatar';

import { getUser } from 'store/selectors/user';
import {
  closeNewChatModal,
  startChat,
  addChatInList
} from 'store/actions/MessageActions';

import { SearchInputBox } from 'shared/ui-kit/SearchInputBox/SearchInputBox';
import { getDefaultAvatar } from 'shared/services/user/getUserAvatar';
import { LoadingWrapper } from 'shared/ui-kit/Hocs';
import * as UserConnectionsAPI from 'shared/services/API/UserConnectionsAPI';

const useStyles = makeStyles({
  container: {
    backgroundColor: 'white',
    boxShadow: '0px 2px 12px rgba(0, 0, 0, 0.1)',
    borderRadius: '14px 14px 0px 0px',
    width: 352,
    padding: '35.5px 23.5px 5px 23.5px',
    margin: '0px 8px',
    marginTop: 'auto',
    height: 'fitContent'
  },
  header: {
    marginBottom: 20,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer'
  },
  closeBtn: {
    '& img': {
      cursor: 'pointer'
    }
  },
  title: {
    fontSize: 18,
    lineHeight: '104.5%',
    color: '#181818'
  },
  userList: {
    height: 330,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'scroll'
  },
  userItem: {
    display: 'flex',
    marginTop: 15,
    cursor: 'pointer',
    '& img': {
      width: 32,
      height: 32,
      borderRadius: '50%'
    }
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
    justifyContent: 'center',
    marginLeft: '4px',
    overflow: 'hidden'
  },
  userName: {
    fontSize: 14,
    lineHeight: '104.5%',
    color: 'black',
    marginBottom: 6
  },
  userSlug: {
    fontSize: 11,
    lineHeight: '104.5%',
    color: '#707582',
    width: '100%',
    '-webkit-line-clamp': 1,
    '-webkit-box-orient': 'vertical',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    display: 'block'
  },
  actionButtons: {
    display: 'flex',
    alignItems: 'center',
    '& img:first-child': {
      marginRight: 24,
      cursor: 'pointer'
    }
  }
});

const NewChatModal = () => {
  const classes = useStyles();
  const location = useLocation();
  const dispatch = useDispatch();

  // const scrollRef = useRef<any>();

  const userSelector = useSelector(getUser);
  const [minimize, setMinimize] = useState<boolean>(true);

  const [friends, setFriends] = useState<any>([]);
  const [filteredFriends, setFilteredFriends] = useState<any>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [keyword, setKeyword] = useState<string>('');

  const [debouncedKeyword] = useDebounce(keyword, 500);

  useEffect(() => {
    const getFriends = async (userId: string) => {
      if (loading) return;
      setLoading(true);
      const friendList = await UserConnectionsAPI.getFriends(userId);

      setFriends(friendList);
      setFilteredFriends(friendList);
      setLoading(false);
    };
    getFriends(userSelector.id);
  }, [userSelector.id]);

  useEffect(() => {
    if (debouncedKeyword && debouncedKeyword !== '') {
      let fends = [] as any;
      friends.forEach((f) => {
        if (
          f.userName &&
          f.userName.toUpperCase().includes(debouncedKeyword.toUpperCase())
        ) {
          fends.push(f);
        } else if (
          f.urlSlug &&
          f.urlSlug.toUpperCase().includes(debouncedKeyword.toUpperCase())
        ) {
          fends.push(f);
        }
      });

      setFilteredFriends(fends);
    } else {
      setFilteredFriends(friends);
    }
  }, [debouncedKeyword]);

  const handleClose = () => {
    dispatch(closeNewChatModal());
  };

  const handleClick = (user) => {
    if (!user) return;
    const newChat = {
      users: {
        userFrom: {
          userId: userSelector.id,
          userName: userSelector.firstName + ' ' + userSelector.lastName
        },
        userTo: {
          userId: user.user,
          userName: user.userName,
          userFoto: user.imageUrl
        }
      },
      receipientId: user.user
    };
    if (location.pathname.includes('/messages')) {
      dispatch(
        addChatInList({
          chat: newChat
        })
      );
    } else {
      dispatch(
        startChat({
          chat: newChat
        })
      );
    }
  };

  const handleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMinimize(!minimize);
  };

  return (
    <div className={classes.container}>
      <div className={classes.header} onClick={handleMinimize}>
        <div className={classes.title}>New Message</div>
        <div className={classes.actionButtons}>
          {minimize === true ? (
            <img
              src={require('assets/icons/minimize.svg')}
              onClick={handleMinimize}
            />
          ) : null}
          <img
            src={require('assets/icons/cross_gray.webp')}
            onClick={handleClose}
          />
        </div>
      </div>
      {minimize && (
        <>
          <SearchInputBox
            keyword={keyword}
            setKeyword={setKeyword}
            style={{ background: '#F2FBF6' }}
          />
          <br />
          <div className={classes.userList}>
            {filteredFriends &&
              filteredFriends
                .sort((a, b) =>
                  a.userName.toLowerCase() > b.userName.toLowerCase()
                    ? 1
                    : b.userName.toLowerCase() > a.userName.toLowerCase()
                    ? -1
                    : 0
                )
                .filter((user) => {
                  if (
                    user.user === userSelector.id ||
                    user.userName === '' ||
                    user.userName === ' '
                  )
                    return false;
                  if (keyword.length > 0)
                    return user.userName
                      .toLowerCase()
                      .includes(keyword.toLowerCase());
                  else return true;
                })
                .map((user, index) => {
                  return (
                    <div
                      className={classes.userItem}
                      key={index}
                      onClick={() => handleClick(user)}
                    >
                      <Avatar
                        src={user.imageUrl ?? getDefaultAvatar()}
                        alt={user.userName}
                      />
                      <div className={classes.userInfo}>
                        <div className={classes.userName}>{user.userName}</div>
                        <div
                          className={classes.userSlug}
                          style={{ color: '#707582' }}
                        >
                          {`@${user.urlSlug}`}
                        </div>
                      </div>
                    </div>
                  );
                })}
            <LoadingWrapper loading={loading} />
          </div>
        </>
      )}
    </div>
  );
};

export default NewChatModal;
