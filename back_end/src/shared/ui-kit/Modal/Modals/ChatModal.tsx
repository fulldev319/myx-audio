import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import Moment from 'react-moment';

import Avatar from '@material-ui/core/Avatar';
import makeStyles from '@material-ui/core/styles/makeStyles';

import { endChat, updateChat } from 'store/actions/MessageActions';
import { RootState } from 'store/reducers/Reducer';
import { getMessageBox } from 'store/selectors';
import { socket } from 'components/Login/Auth';

import { MessageFooter } from 'shared/ui-kit/Chat/MessageContent';
import URL from 'shared/functions/getURL';
import { MessageItem } from 'shared/ui-kit/Chat/MessageItem';
import { useMessages } from 'shared/contexts/MessagesContext';
import { LoadingWrapper } from 'shared/ui-kit/Hocs';
import { getDefaultAvatar } from 'shared/services/user/getUserAvatar';

const useStyles = makeStyles({
  container: {
    backgroundColor: 'white',
    boxShadow: '0px 2px 12px rgba(0, 0, 0, 0.1)',
    borderRadius: '14px 14px 0px 0px',
    width: 450,
    padding: '23.5px 23.5px 5px 23.5px',
    margin: '0px 8px',
    marginTop: 'auto',
    height: 'fitContent'
  },
  header: {
    borderRadius: '14px 14px 0px 0px',
    borderBottom: '1px solid rgba(112, 117, 130, 0.2)',
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: 10,
    cursor: 'pointer'
  },
  chatInfo: {
    display: 'flex',
    position: 'relative',
    '& img': {
      width: 36,
      height: 36,
      borderRadius: '50%',
      objectFit: 'cover'
    },
    '& > span': {
      '&.online': {
        background: 'linear-gradient(97.4deg, #23d0c6 14.43%, #00cc8f 85.96%)'
      },
      position: 'absolute',
      width: '15px',
      height: '15px',
      borderRadius: '50%',
      border: '2px solid #ffffff',
      marginLeft: '28px',
      marginTop: '28px'
    }
  },
  actionBtns: {
    display: 'flex',
    alignItems: 'center',
    '& img:first-child': {
      marginRight: 24,
      cursor: 'pointer'
    }
  },
  user: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
    justifyContent: 'center',
    marginLeft: 8
  },
  userName: {
    fontSize: 14,
    lineHeight: '104.5%',
    color: 'black'
  },
  userSlug: {
    fontSize: 11,
    lineHeight: '104.5%',
    color: '#9EACF2',
    marginTop: 4,
    fontWeight: 800
  },
  chatContent: {
    display: 'flex',
    flexDirection: 'column',
    height: 379
  },
  itemList: {
    flex: 1,
    height: '100%',
    overflow: 'scroll',
    position: 'relative',
    '& .right-item': {
      display: 'flex',
      justifyContent: 'flex-end',
      margin: '4px 0px',
      '& .item-content': {
        border: '1px solid #EFF2F8',
        borderRadius: '10px',
        color: '#fff',
        background: '#65CB63',
        fontSize: '14px',
        padding: '13px 11px 14px 12px',
        wordWrap: 'break-word',
        maxWidth: '80%'
      }
    },
    '& .left-item': {
      display: 'flex',
      justifyContent: 'flex-start',
      margin: '4px 0px',
      '& .avatar-container': {
        marginRight: '10px'
      },
      '& .item-content': {
        backgroundColor: '#F7F9FE',
        borderRadius: '10px',
        color: '#181818',
        background: '#65CB63',
        fontSize: '14px',
        padding: '13px 11px 14px 12px',
        wordWrap: 'break-word',
        maxWidth: 'calc(80% - 10px)',
        border: '1px solid #E0E4F3'
      }
    }
  }
});

const ChatModal = ({ chat }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const userSelector = useSelector((state: RootState) => state.user);
  const messageBoxInfo = useSelector(getMessageBox);
  const { isSendMessage, chat: messageBoxChat } = messageBoxInfo;
  const { setNumberMessages } = useMessages();

  const [minimize, setMinimize] = useState<boolean>(true);

  const [messages, setMessages] = useState<any[]>([]);
  const [chatUsers, setChatUsers] = React.useState([]);
  const [messagesCharged, setMessagesCharged] = useState<boolean>(true);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [paginationLoading, setPaginationLoading] =
    React.useState<boolean>(false);

  const itemListRef = useRef<HTMLDivElement>(null);

  const differentUser = React.useMemo(
    () =>
      chat.users.userFrom.userId === userSelector.id
        ? chat.users.userTo
        : chat.users.userFrom,
    [chat, userSelector]
  );

  useEffect(() => {
    createChat();
  }, []);

  useEffect(() => {
    if (isSendMessage === true) {
      // If currently selected chat in the profile message is same as the chatmodal
      if (
        chat.room === messageBoxChat.room ||
        (chat.users?.userFrom?.userId ===
          messageBoxChat.users?.userFrom?.userId &&
          chat.users?.userTo?.userId === messageBoxChat.users?.userTo?.userId)
      ) {
        setMessages(messageBoxChat.messages);
      }
    }
  }, [isSendMessage]);

  useEffect(() => {
    setPageIndex(messages.length);
    if (itemListRef && itemListRef.current && !paginationLoading)
      itemListRef.current.scrollTop = itemListRef.current.scrollHeight;
    setPaginationLoading(false);
  }, [messages]);

  useEffect(() => {
    const updateMessageLastView = () => {
      const chatObj = {
        room: chat.room,
        userId: userSelector.id,
        lastView: Date.now()
      };

      axios
        .post(`${URL()}/chat/lastView`, chatObj)
        .then((response) => {
          if (response.data.success && response.data.numberMessages) {
            setNumberMessages(response.data.numberMessages);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };

    if (chat && chat.room) {
      socket.on('message', (message) => {
        if (message.room !== chat.room) {
          return;
        }
        setMessages((msgs) => {
          let msgsArray = [...msgs];
          msgsArray.push(message);
          return msgsArray;
        });

        if (
          chatUsers['userTo'] &&
          chatUsers['userTo'].userId === message.from
        ) {
          updateMessageLastView();
        }
      });
      updateMessageLastView();
    }
  }, [chat]);

  const createChat = () => {
    let users: any = {
      userFrom: {
        userId: userSelector.id,
        userName: userSelector.firstName,
        userConnected: true,
        lastView: new Date()
      },
      userTo: {
        userId: differentUser.userId,
        userName: differentUser.userName,
        userConnected: false,
        lastView: null
      }
    };
    setChatUsers(users);

    axios
      .post(`${URL()}/chat/newChat`, { users: users })
      .then(async (response) => {
        if (response.data.success) {
          dispatch(
            updateChat({
              chat: {
                ...response.data.data,
                receipientId: chat.receipientId
              }
            })
          );

          //setShowHomeChat(1);
          await getMessages(response.data.data);
          socket.emit('subscribe', users);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getMessages = (chatInfo?: any): Promise<number> => {
    return new Promise((resolve, reject) => {
      if (!hasMore || !messagesCharged) {
        resolve(0);
        return;
      }
      setMessagesCharged(false);
      axios
        .post(`${URL()}/chat/getMessages`, {
          room: chatInfo ? chatInfo.room : chat.room,
          pageIndex
        })
        .then((response) => {
          if (response.data.success) {
            setMessages([...response.data.data, ...messages]);
            setHasMore(response.data.hasMore);
            resolve(response.data.data.length);
          }
        })
        .catch((error) => {
          reject(error);
          console.log(error);
        })
        .finally(() => {
          setMessagesCharged(true);
        });
    });
  };

  const handleScroll = React.useCallback(
    async (e) => {
      if (e.target.scrollTop === 0 && messages.length > 0) {
        const lastMsgID = messages.length > 0 ? messages[0].id : null;
        setPaginationLoading(true);
        const count = await getMessages();
        if (count === 0) {
          setPaginationLoading(false);
        }
        if (lastMsgID) {
          const el = document.getElementById(lastMsgID);
          const itemList = document.getElementById('chatItemList');
          if (itemListRef && itemListRef.current && el && itemList) {
            itemListRef.current.scrollTop = Math.max(
              0,
              el.getBoundingClientRect().y -
                itemList.getBoundingClientRect().y -
                90
            );
          }
        }
      }
    },
    [getMessages]
  );

  const handleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMinimize(!minimize);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(
      endChat({
        receipientId: chat.receipientId
      })
    );
  };

  return (
    <div
      className={classes.container}
      style={{ display: chat.hidden ? 'none' : 'inline-block' }}
    >
      <div className={classes.header} onClick={handleMinimize}>
        <div className={classes.chatInfo}>
          <Avatar
            src={differentUser.userFoto ?? getDefaultAvatar()}
            alt={differentUser.userName}
            style={{
              filter: 'drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.2))',
              backgroundColor: '#fff',
              padding: 2,
              borderRadius: '50%'
            }}
          />
          {differentUser.connected && <span className="online" />}
          <div className={classes.user}>
            <div className={classes.userName}>
              {differentUser.userName ?? ''}
            </div>
            {/* <div className={classes.userSlug}>{"@" + differentUser.urlSlug}</div> */}
          </div>
        </div>
        <div className={classes.actionBtns}>
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
      {minimize === true ? (
        <div className={classes.chatContent}>
          <div
            className={classes.itemList}
            id="chatItemList"
            ref={itemListRef}
            onScroll={handleScroll}
          >
            <LoadingWrapper loading={!messagesCharged} />
            {messages &&
              messages.map((item, index) => {
                if (
                  index === 0 ||
                  messages[index].id !== messages[index - 1].id ||
                  messages[index].id === undefined
                ) {
                  // set date for new day message
                  let hasDate = false;
                  const today = new Date().getDate();
                  const curMsgDate = new Date(
                    messages[index].created
                  ).getDate();
                  const lastMsgDate =
                    index === 0
                      ? 0
                      : new Date(messages[index - 1].created).getDate();

                  if (index === 0) {
                    hasDate = true;
                  } else if (curMsgDate !== lastMsgDate) {
                    hasDate = true;
                  }
                  if (hasDate) {
                    curMsgDate === today;
                  }
                  return (
                    <>
                      {hasDate && (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            margin: '24px 0',
                            color: '#7E7D95',
                            opacity: '0.6'
                          }}
                        >
                          <div
                            style={{
                              flex: '1',
                              height: '1px',
                              background: '#7E7D95',
                              marginRight: '10px',
                              opacity: '0.1'
                            }}
                          />
                          {curMsgDate === today ? (
                            <div style={{ color: '#65CB63' }}>Today</div>
                          ) : (
                            <>
                              {today - curMsgDate > 1 ? (
                                <Moment format="DD MMM YYYY hh:mm A">
                                  {item.created}
                                </Moment>
                              ) : (
                                <div>Yesterday</div>
                              )}
                            </>
                          )}
                          <div
                            style={{
                              flex: '1',
                              height: '1px',
                              background: '#7E7D95',
                              marginLeft: '10px',
                              opacity: '0.1'
                            }}
                          />
                        </div>
                      )}
                      <MessageItem
                        key={item.id ?? `message-${index}`}
                        user={differentUser}
                        message={item}
                        mediaOnCommunity={false}
                      />
                    </>
                  );
                }
              })}
          </div>
          <MessageFooter
            chat={chat}
            messages={messages}
            specialWidthInput={false}
            setMessages={(msgs) => setMessages(msgs)}
          />
        </div>
      ) : null}
    </div>
  );
};

export default ChatModal;
