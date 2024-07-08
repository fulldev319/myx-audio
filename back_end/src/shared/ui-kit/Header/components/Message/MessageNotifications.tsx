import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

import { openChatModal, openNewChatModal } from 'store/actions/MessageActions';
import { RootState } from 'store/reducers/Reducer';
import { ListItem } from './ListItem';

import { HeaderBold4 } from 'shared/ui-kit';
import { SearchInputBox } from 'shared/ui-kit/SearchInputBox/SearchInputBox';
import { LoadingWrapper } from 'shared/ui-kit/Hocs';
import URL from 'shared/functions/getURL';

import { messageNotificationsStyles } from './MessageNotifications.styles';

type MessageNotificationsProps = {
  handleClosePopper?: () => void;
};

export const MessageNotifications: React.FC<MessageNotificationsProps> = ({
  handleClosePopper
}) => {
  const history = useHistory();
  const classes = messageNotificationsStyles();

  const dispatch = useDispatch();

  const userSelector = useSelector((state: RootState) => state.user);
  const [chats, setChats] = useState<any[]>([]);
  const [keyword, setKeyword] = useState<string>('');
  const [chatsCharged, setChatsCharged] = useState<boolean>(false);

  useEffect(() => {
    if (userSelector.id) getChats();
  }, [userSelector.id]);

  const handleOpenNewChatModal = () => {
    dispatch(openNewChatModal());
    if (handleClosePopper) handleClosePopper();
  };

  const getChats = () => {
    axios
      .post(`${URL()}/chat/getChats`)
      .then((response) => {
        if (response.data.success) {
          const cs = response.data.data as any[];
          cs.sort(
            (a, b) => (b.lastMessageDate ?? 0) - (a.lastMessageDate ?? 0)
          );
          setChatsCharged(true);
          setChats(cs);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className={classes.message_notifications}>
      <div className={classes.message_notifications_header}>
        <HeaderBold4>Messages</HeaderBold4>
        <img
          src={require('assets/icons/music_edit_icon.svg')}
          className={classes.edit_icon}
          onClick={handleOpenNewChatModal}
        />
      </div>
      <SearchInputBox
        keyword={keyword}
        setKeyword={setKeyword}
        placeholder="Search messages"
        style={{ background: '#F2FBF6' }}
      />
      <div className={classes.item_list}>
        <LoadingWrapper loading={!chatsCharged}>
          {chats &&
            chats
              .filter((chat) => {
                if (keyword.length > 0) {
                  return chat.users.userTo.userName
                    .toLowerCase()
                    .includes(keyword.toLowerCase());
                } else return true;
              })
              .slice(0, 3)
              .map((chat) => {
                return (
                  <ListItem
                    chat={chat}
                    key={chat.room}
                    handleClosePopper={handleClosePopper}
                  />
                );
              })}
        </LoadingWrapper>
      </div>
      <div
        className={classes.message_notifications_footer}
        onClick={() => {
          history.push(`/${userSelector.urlSlug}/messages`);
          dispatch(openChatModal(false));
          if (handleClosePopper) handleClosePopper();
        }}
      >
        See All Messages
      </div>
    </div>
  );
};
