import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Moment from 'react-moment';

import { startChat } from 'store/actions/MessageActions';
import { RootState } from 'store/reducers/Reducer';
import { Color } from 'shared/ui-kit';
import { getDefaultAvatar } from 'shared/services/user/getUserAvatar';

type ListItemProps = {
  chat: any;
  handleClosePopper?: () => void;
};

export const ListItem: React.FunctionComponent<ListItemProps> = ({
  chat,
  handleClosePopper
}) => {
  const dispatch = useDispatch();
  const userSelector = useSelector((state: RootState) => state.user);
  const [otherUser, setOtherUser] = useState<any>({});

  const handleClick = () => {
    dispatch(
      startChat({
        chat: {
          ...chat,
          receipientId: otherUser.userId
        }
      })
    );
    if (handleClosePopper) handleClosePopper();
  };

  useEffect(() => {
    if (
      chat.users &&
      chat.users.userFrom &&
      chat.users.userFrom.userId === userSelector.id
    ) {
      setOtherUser(chat.users.userTo);
    } else if (
      chat.users &&
      chat.users.userTo &&
      chat.users.userTo.userId === userSelector.id
    ) {
      setOtherUser(chat.users.userFrom);
    }
  }, [chat]);

  return (
    <div className="item" onClick={handleClick}>
      <div className="avatar-container">
        <img
          src={otherUser.userFoto ?? getDefaultAvatar()}
          className="avatar"
          style={{ objectFit: 'cover' }}
        />
      </div>
      <div className="item-content">
        <div className="name">{otherUser.userName}</div>
        {typeof chat.lastMessage === 'string' && (
          <div className="message" style={{ color: '#949BAB' }}>
            {chat.lastMessage.includes('data:audio/wav;') ? (
              <div style={{ display: 'flex' }}>
                <img
                  src={require('assets/icons/music-solid.svg')}
                  alt={'music-solid'}
                />
                &nbsp;Audio
              </div>
            ) : chat.lastMessage.length > 75 ? (
              `${chat.lastMessage.substring(0, 75)} ...`
            ) : (
              chat.lastMessage.substring(0, 75)
            )}
          </div>
        )}
        {chat.lastMessageDate && (
          <div className="date" style={{ color: '#949BAB' }}>
            Last message:{' '}
            <Moment fromNow style={{ color: '#0D59EE' }}>
              {chat.lastMessageDate}
            </Moment>
          </div>
        )}
      </div>
    </div>
  );
};
