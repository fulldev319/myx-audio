import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';

import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import MessageDiscordChat from './MessageDiscordChat';
import DiscordReplyModal from './DiscordReplyModal/DiscordReplyModal';
import { socket } from 'components/Login/Auth';
import { RootState } from 'store/reducers/Reducer';
import { setSelectDiscordRoom } from 'store/actions/SelectedDiscordRoom';

import Box from 'shared/ui-kit/Box';
import { RecordingBox } from 'shared/ui-kit/RecordingBox';
import { LoadingWrapper } from 'shared/ui-kit/Hocs';
import EmojiPane from 'shared/ui-kit/EmojiPane';
import { Modal } from 'shared/ui-kit';
import { default as ServerURL } from 'shared/functions/getURL';
import useIPFS from 'shared/utils-IPFS/useIPFS';
import { onUploadNonEncrypt } from 'shared/ipfs/upload';
import {
  getAnonAvatarUrl,
  getDefaultAvatar
} from 'shared/services/user/getUserAvatar';

import { ReactComponent as SendIcon } from 'assets/icons/paper-plane-regular.svg';

import './Discord.css';
import './DiscordDark.css';
import Moment from 'react-moment';

const arePropsEqual = (prevProps, currProps) => {
  return (
    prevProps.podId === currProps.podId &&
    prevProps.chatType === currProps.chatType &&
    prevProps.chatId === currProps.chatId &&
    prevProps.sidebar === currProps.sidebar &&
    prevProps.theme === currProps.theme
  );
};

const Discord = React.memo((props: any) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  const dispatch = useDispatch();

  const { uploadWithNonEncryption } = useIPFS();

  const userSelector = useSelector((state: RootState) => state.user);
  const [mediaBlobUrl, setMediaBlobUrl] = useState<any>();

  const [chatType, setChatType] = useState<string>('');

  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(false);

  const [message, setMessage] = useState<string>('');
  const [audioMessage, setAudioMessage] = useState<boolean>(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [messagesLoading, setMessagesLoading] = useState<boolean>(false);
  const [missingIds, setMissingIds] = useState<boolean>(false);
  const [firstLoading, setFirstLoading] = useState<boolean>(true);

  const [selectedMessage, setSelectedMessage] = useState<any>({});

  const [showEmoji, setShowEmoji] = useState<boolean>(false);
  const [openModalDiscordReply, setOpenModalDiscordReply] =
    useState<boolean>(false);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const itemListRef = useRef<HTMLDivElement>(null);
  const emojiRef = useRef<any>();
  const inputRef: any = useRef([]);

  useEffect(() => {
    if (
      props.podId &&
      props.chatId &&
      socket /*!socketConnectionEstablished &&*/ &&
      localStorage.getItem('userId')
    ) {
      let chatEmit: string = '';

      if (props.chatType === 'PrivateChat') {
        chatEmit = 'subscribe-pod-private-chat';
      } else if (props.chatType === 'PodDiscussions') {
        chatEmit = 'subscribe-podDiscussion';
      }

      socket.emit(chatEmit, {
        podId: props.podId,
        topicId: props.chatId,
        userId: userSelector.id,
        podType: 'TRAX'
      });
    }
    if (props.podId && props.chatId && socket) {
      socket.off('message-podDiscussion');
      socket.on('message-podDiscussion', (msg) => {
        if (msg.topicId === props.chatId) {
          addMessage(msg);
        }
      });

      socket.off('user_connect_status');
      socket.on('user_connect_status', (connectStatus) => {
        setMessages((prev) =>
          prev.map((message) => {
            if (
              message &&
              message.user &&
              message.user.id === connectStatus.userId
            ) {
              return {
                ...message,
                user: {
                  ...message.user,
                  connected: connectStatus.connected
                }
              };
            }
            return message;
          })
        );
      });
    }

    if (props.chatType) {
      setChatType(props.chatType);
    }

    if (props.podId && props.chatId) {
      setMissingIds(false);
      getMessages();
    } else {
      setMessagesLoading(false);
      // setMissingIds(true);
    }
    setHasMore(true);
    setFirstLoading(true);
  }, [props, socket]);

  useEffect(() => {
    if (messages.length > 0) {
      setPageIndex(messages.length);
      setTimeout(() => {
        if (
          itemListRef &&
          itemListRef.current &&
          (!messagesLoading || firstLoading)
        ) {
          itemListRef.current.scrollTop = itemListRef.current.scrollHeight;
        }
        setFirstLoading(false);
      }, 100);
    }
  }, [messages.length]);

  useEffect(() => {
    dispatch(setSelectDiscordRoom(null));
    setIsDarkTheme(props.theme && props.theme === 'dark');
  }, []);

  useEffect(() => {
    if (socket) {
      socket.emit('user_connect_status', {
        userId: userSelector.id,
        connected: true
      });
    }
  }, [userSelector]);

  const handleCloseModalDiscordReply = () => {
    setOpenModalDiscordReply(false);
  };

  const addEmoji = (e, emojiObject) => {
    let emoji = emojiObject.emoji;
    setMessage(message + emoji);
    setShowEmoji(false);
  };

  const toggleEmojiPicker = () => {
    setShowEmoji(!showEmoji);
  };

  const addMessage = (msg) => {
    setMessages((messages) => {
      let msgsArray = [...messages];
      msgsArray.push(msg);
      return msgsArray;
    });
  };

  const sendMessage = (audioMessage?: string) => {
    if (message || audioMessage) {
      setAudioMessage(false);
      let messageObj: any = {
        message: message ? message : audioMessage,
        type: 'text',
        from: userSelector.id,
        created: Date.now(),
        podId: props.podId,
        topicId: props.chatId,
        podType: 'TRAX'
      };

      if (socket) {
        let addMessageSocket: string = '';
        if (chatType === 'PodDiscussions') {
          addMessageSocket = 'add-message-podDiscussion';
        } else if (chatType === 'PrivateChat') {
          addMessageSocket = 'add-message-pod-private-chat';
        }
        socket.emit(addMessageSocket, messageObj);
      }

      messageObj.user = {
        name: userSelector.firstName,
        level: userSelector.level || 1,
        connected: userSelector.connected || false,
        imageUrl: userSelector?.anon
          ? getAnonAvatarUrl(userSelector?.anonAvatar)
          : userSelector?.urlIpfsImage
          ? userSelector.urlIpfsImage
          : getDefaultAvatar(),
        urlSlug: userSelector?.urlSlug
      };
      messageObj.likes = [];
      messageObj.dislikes = [];
      messageObj.numLikes = 0;
      messageObj.numDislikes = 0;

      let messagesCopy = [...messages];
      messagesCopy.push(messageObj);
      setMessages(messagesCopy);

      setMessage('');
    }
  };

  const getMessages = (isNew: boolean = true): Promise<number> => {
    return new Promise((resolve, reject) => {
      if (!isNew && (messagesLoading || !hasMore)) {
        resolve(0);
        return;
      }
      setMessagesLoading(true);

      axios
        .get(
          `${ServerURL()}/podDiscussion/new/newChat/getMessages/${
            props.podId
          }/TRAX/${props.chatType}/${props.chatId}/${isNew ? 0 : pageIndex}`
        )
        .then(async (response) => {
          let data = response.data;
          if (data.success) {
            const msgs = data.messages;
            if (isNew) setMessages(msgs);
            else setMessages((prev) => [...msgs, ...prev]);
            setHasMore(data.hasMore || false);
            resolve(msgs.length || 0);
          }
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setMessagesLoading(false);
        });
    });
  };

  const handleScroll = React.useCallback(
    async (e) => {
      if (messagesLoading) return;
      if (e.target.scrollTop === 0 && hasMore) {
        const lastMsgID = messages.length > 0 ? messages[0].id : null;
        await getMessages(false);
        if (lastMsgID) {
          const el = document.getElementById(lastMsgID);
          const itemList = document.getElementById('messageContainer');
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

  const fileInputMessageAttachment = (e) => {
    e.preventDefault();
    const files = e.target.files;
    if (files.length) {
      handleFilesAttachment(files);
    }
  };

  const handleFilesAttachment = async (files) => {
    for (let i = 0; i < files.length; i++) {
      let type: string = '';
      if (files[i].type.startsWith('image')) type = 'photo';
      else if (files[i].type.startsWith('audio')) type = 'audio';
      else if (files[i].type.startsWith('video')) type = 'video';
      else type = 'file';

      let info;
      info = await onUploadNonEncrypt(files[i], (file) =>
        uploadWithNonEncryption(file, false)
      );

      let msg: any = {
        message: '',
        url: type !== 'text' ? info : '',
        from: userSelector.id,
        created: Date.now(),
        seen: [],
        type: type,
        podId: props.podId,
        topicId: props.chatId,
        podType: 'TRAX'
      };

      if (socket) {
        let addMessageSocket: string = '';
        if (chatType === 'PodDiscussions') {
          addMessageSocket = 'add-message-podDiscussion';
        } else if (chatType === 'PrivateChat') {
          addMessageSocket = 'add-message-pod-private-chat';
        }

        socket.emit(addMessageSocket, msg);
      }

      msg.user = {
        name: userSelector.firstName,
        level: userSelector.level || 1,
        connected: userSelector.connected || false,
        imageUrl: userSelector?.anon
          ? getAnonAvatarUrl(userSelector?.anonAvatar)
          : userSelector?.urlIpfsImage
          ? userSelector.urlIpfsImage
          : getDefaultAvatar(),
        urlSlug: userSelector?.urlSlug
      };

      setMessages((msgs) => {
        let msgsArray = [...msgs];
        msgsArray.push(msg);
        return msgsArray;
      });
    }
  };

  const startAudioRecording = () => {
    setAudioMessage(true);
  };

  const deleteVoiceMessage = () => {
    setAudioMessage(false);
  };

  const sendVoiceMessage = async () => {
    if (mediaBlobUrl) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';

      xhr.onload = function () {
        var recoveredBlob = xhr.response;

        var reader = new FileReader();

        reader.onload = function () {
          const blobAsDefaultURL = reader.result;
          sendMessage(JSON.stringify(blobAsDefaultURL));
        };

        reader.readAsDataURL(recoveredBlob);
      };

      xhr.open('GET', mediaBlobUrl);
      xhr.send();
    }
  };

  const uploadAttachment = () => {
    const inputElement = document.createElement('input');
    inputElement.type = 'file';
    inputElement.accept = '*';
    inputElement.multiple = true;

    // set onchange event to call callback when user has selected file
    inputElement.addEventListener('change', fileInputMessageAttachment);

    // dispatch a click event to open the file dialog
    inputElement.dispatchEvent(new MouseEvent('click'));
  };

  return (
    <div
      className={`podDiscordFullPage ${
        props.theme && props.theme === 'dark' ? 'dark' : ''
      }`}
    >
      <Box display="flex" height="100%" width="100%" className="podDiscordGrid">
        <div
          className="podDiscordChatGrid"
          style={{
            marginLeft: isMobile ? '0px' : '24px',
            marginRight: isMobile ? '0px' : '24px'
          }}
        >
          {!missingIds ? (
            <div className="podDiscordChat">
              <div
                className="podMessagesDiscordChat"
                id="messageContainer"
                ref={itemListRef}
                onScroll={handleScroll}
              >
                <LoadingWrapper loading={messagesLoading} theme={props.theme} />
                {messages && messages.length > 0
                  ? messages.map((item, index) => {
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
                          <div key={`message_${item.id}_${index}`} id={item.id}>
                            <MessageDiscordChat
                              message={item}
                              setMessage={(msg) => setMessage(msg)}
                              messages={messages}
                              setMessages={(msgs) => setMessages(msgs)}
                              podId={props.podId}
                              chatType={props.chatType}
                              chatId={props.chatId}
                              theme={props.theme}
                              index={index}
                            />
                          </div>
                        </>
                      );
                    })
                  : !messagesLoading && (
                      <div className="noItemsLabel">
                        <img
                          src={require('assets/icons/messages.webp')}
                          alt="messages"
                          style={{ width: '100px' }}
                        />
                        <Box fontSize={14}>No messages in the chat yet.</Box>
                      </div>
                    )}
              </div>
              <div className="podInputDiscordChat">
                {!audioMessage && !isDarkTheme && (
                  <div className="podIconsDiscordMessage">
                    <div className="podIconImgDiscordMessage">
                      <img
                        src={require('assets/mediaIcons/old/audio_live.webp')}
                        alt={'upload audio'}
                        onClick={startAudioRecording}
                        style={{
                          width: '20px',
                          height: '20px',
                          cursor: 'pointer',
                          marginLeft: isMobile ? '13px' : '30px'
                        }}
                      />
                    </div>

                    <div className="podIconImgDiscordMessage">
                      <img
                        src={require(`assets/icons/attachment_icon.svg`)}
                        alt={'Attachment'}
                        onClick={uploadAttachment}
                        style={{
                          width: '20px',
                          height: '20px',
                          cursor: 'pointer',
                          marginLeft: isMobile ? '13px' : '30px'
                        }}
                      />
                    </div>

                    <div className="podIconImgDiscordMessage" ref={emojiRef}>
                      <img
                        src={require(`assets/icons/emoji_icon.svg`)}
                        alt={'emoji'}
                        onClick={toggleEmojiPicker}
                        style={{
                          width: '20px',
                          height: '20px',
                          cursor: 'pointer',
                          marginLeft: isMobile ? '13px' : '30px'
                        }}
                      />
                    </div>

                    {showEmoji && (
                      <EmojiPane
                        open={showEmoji}
                        anchorEl={emojiRef.current}
                        handleClose={() => setShowEmoji(false)}
                        addEmoji={addEmoji}
                      />
                    )}
                  </div>
                )}
                {!audioMessage && (
                  <form
                    className="podSendDiscordMessage"
                    onSubmit={(e) => {
                      e.preventDefault();
                      sendMessage();
                    }}
                  >
                    <input
                      autoComplete="off"
                      name="DiscordMessage"
                      ref={(el) => (inputRef.current[0] = el)}
                      type="text"
                      // autoFocus
                      value={message}
                      onChange={(elem) => {
                        setMessage(elem.target.value);
                      }}
                      placeholder="Write a message..."
                    />
                    {/* <textarea
                      autoComplete="off"
                      name="DiscordMessage"
                      ref={el => (inputRef.current[0] = el)}
                      autoFocus
                      value={message}
                      onChange={elem => {
                        setMessage(elem.target.value);
                      }}
                      placeholder="Write a message..."
                    /> */}
                    {isDarkTheme && !audioMessage && (
                      <div
                        className="podIconImgDiscordMessage"
                        style={{
                          cursor: 'pointer',
                          marginLeft: isMobile ? '13px' : '30px'
                        }}
                        ref={emojiRef}
                      >
                        <EmojiBlackIcon onClick={toggleEmojiPicker} />
                      </div>
                    )}
                    {isDarkTheme && !audioMessage && showEmoji && (
                      <EmojiPane
                        open={showEmoji}
                        anchorEl={emojiRef.current}
                        handleClose={() => setShowEmoji(false)}
                        addEmoji={addEmoji}
                      />
                    )}
                    {isDarkTheme && !audioMessage && (
                      <div
                        className="podIconImgDiscordMessage"
                        style={{
                          cursor: 'pointer',
                          marginLeft: isMobile ? '13px' : '30px'
                        }}
                      >
                        <AttacthBlackIcon onClick={uploadAttachment} />
                      </div>
                    )}
                    <button style={{ marginLeft: isMobile ? '13px' : '30px' }}>
                      {isDarkTheme ? (
                        // <img src={require("assets/icons/send_white_2.webp")} alt="send" />
                        <SendBlackIcon />
                      ) : (
                        <SendIcon />
                      )}
                    </button>
                  </form>
                )}
                {audioMessage && (
                  <RecordingBox
                    deleteVoiceMessage={deleteVoiceMessage}
                    sendVoiceMessage={sendVoiceMessage}
                    setMediaBlobUrl={setMediaBlobUrl}
                  />
                )}
              </div>

              <Modal
                showCloseIcon
                size="medium"
                theme={props.theme}
                isOpen={openModalDiscordReply}
                onClose={handleCloseModalDiscordReply}
              >
                <DiscordReplyModal
                  onCloseModal={handleCloseModalDiscordReply}
                  message={selectedMessage}
                  discordId={props.discordId}
                  roomId={''}
                  user={userSelector}
                />
              </Modal>
            </div>
          ) : (
            <div className="noMessagesLabelChat" style={{ marginTop: '20px' }}>
              <span>Select a conversation and start discussing!</span>
            </div>
          )}
        </div>
      </Box>
    </div>
  );
}, arePropsEqual);

export default Discord;

const EmojiBlackIcon = (props) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M5.86686 11.0159C5.86686 11.0159 7.15436 12.7326 9.3002 12.7326C11.446 12.7326 12.7335 11.0159 12.7335 11.0159M6.7252 6.72422H6.73378M11.8752 6.72422H11.8838M17.0252 9.29922C17.0252 13.5656 13.5666 17.0242 9.3002 17.0242C5.0338 17.0242 1.5752 13.5656 1.5752 9.29922C1.5752 5.03282 5.0338 1.57422 9.3002 1.57422C13.5666 1.57422 17.0252 5.03282 17.0252 9.29922Z"
      stroke="#181818"
      strokeWidth="1.2875"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const AttacthBlackIcon = (props) => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 17 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M15.3671 8.41479L8.46845 14.921C7.62332 15.7181 6.47708 16.1659 5.28188 16.1659C4.08669 16.1659 2.94044 15.7181 2.09531 14.921C1.25018 14.124 0.775391 13.0429 0.775391 11.9157C0.775391 10.7885 1.25018 9.70743 2.09531 8.91037L8.99392 2.40412C9.55734 1.87274 10.3215 1.57422 11.1183 1.57422C11.9151 1.57422 12.6793 1.87274 13.2427 2.40412C13.8061 2.93549 14.1226 3.6562 14.1226 4.40767C14.1226 5.15915 13.8061 5.87986 13.2427 6.41123L6.33656 12.9175C6.05485 13.1832 5.67277 13.3324 5.27438 13.3324C4.87598 13.3324 4.4939 13.1832 4.21218 12.9175C3.93047 12.6518 3.77221 12.2914 3.77221 11.9157C3.77221 11.54 3.93047 11.1796 4.21218 10.9139L10.5853 4.91033"
      stroke="#181818"
      strokeWidth="1.2875"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SendBlackIcon = (props) => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 17 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M15.5668 1.43359L0.975098 7.44193L6.98343 10.0169M15.5668 1.43359L9.55843 16.0253L6.98343 10.0169M15.5668 1.43359L6.98343 10.0169"
      stroke="#181818"
      strokeWidth="1.2875"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
