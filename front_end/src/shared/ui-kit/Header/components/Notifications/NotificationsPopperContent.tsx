import { formatDistanceToNowStrict } from 'date-fns/esm';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import Box from 'shared/ui-kit/Box';
import { Notification } from 'shared/services/API/NotificationsAPI';
import { Avatar, Color, FontSize, grid, HeaderBold4 } from 'shared/ui-kit';
import { getDefaultAvatar } from 'shared/services/user/getUserAvatar';
import { ReactComponent as RemoveIcon } from 'assets/icons/close.svg';
import { NotificationButtons } from './NotificationButtons';
import { NotificationContent } from './NotificationContent/NotificationContent';

type NotificationsPopperContentProps = {
  notifications: Notification[];
  onDismissNotification: (notificationId: string) => void;
  onRefreshAllProfile: (userId: string) => void;
  removeNotification: (notificationId: string) => void;
  handleClosePopper: () => void;
  viewMore: (value: string) => void;
  setSelectedNotification?: any;
  handleShowContributionModal: () => void;
  handleHidePopper: () => void;
  theme?: 'dark' | 'light';
};

const NotificationItem = ({
  notification,
  onDismissNotification,
  onRefreshAllProfile,
  removeNotification,
  viewMore,
  setSelectedNotification,
  handleClosePopper,
  handleShowContributionModal,
  handleHidePopper,
  theme
}) => {
  const [avatar, setAvatar] = useState<string | undefined>('');

  useEffect(() => {
    (async () => {
      if (notification && notification.avatar) {
        setAvatar(notification.avatar);
      } else {
        setAvatar(getDefaultAvatar());
      }
    })();
  }, [notification]);

  return (
    <NotificationContainer key={notification.date}>
      <AvatarContainer>
        <Avatar
          noBorder={theme === 'dark'}
          url={
            theme === 'dark'
              ? require('assets/icons3d/SuperToroid-Iridescent.webp')
              : avatar
          }
          size="medium"
        />
      </AvatarContainer>
      <ContentContainer>
        <NotificationMessage theme={theme}>
          <NotificationContent notification={notification} />
        </NotificationMessage>
        <NotificationButtons
          theme={theme}
          notification={notification}
          onDismissNotification={() => {
            onDismissNotification(notification.id);
          }}
          onRemoveNotification={() => {
            removeNotification(notification.id);
          }}
          refreshAllProfile={onRefreshAllProfile}
          viewMore={viewMore}
          setSelectedNotification={setSelectedNotification}
          handleShowContributionModal={handleShowContributionModal}
          handleClosePopper={handleClosePopper}
          handleHidePopper={handleHidePopper}
        />
        <TimeLabel>
          {formatDistanceToNowStrict(new Date(notification.date), {
            addSuffix: true
          })}
        </TimeLabel>
      </ContentContainer>
      <RemoveButton onClick={() => removeNotification(notification.id)} />
    </NotificationContainer>
  );
};

export const NotificationsPopperContent: React.FunctionComponent<
  NotificationsPopperContentProps
> = ({
  notifications,
  onDismissNotification,
  onRefreshAllProfile,
  removeNotification,
  viewMore,
  setSelectedNotification,
  handleClosePopper,
  handleShowContributionModal,
  handleHidePopper,
  theme = 'light'
}) => {
  const history = useHistory();

  return (
    <div>
      <HeaderBold4 theme={theme}>Notifications</HeaderBold4>
      <TimeDivider theme={theme} />
      {notifications && notifications.length > 0 ? (
        <>
          {notifications
            .filter((_, i) => i < 5)
            .map((n, index) => (
              <NotificationItem
                key={`notification-item-${index}`}
                notification={n}
                onDismissNotification={onDismissNotification}
                onRefreshAllProfile={onRefreshAllProfile}
                removeNotification={removeNotification}
                viewMore={viewMore}
                setSelectedNotification={setSelectedNotification}
                handleClosePopper={handleClosePopper}
                handleShowContributionModal={handleShowContributionModal}
                handleHidePopper={handleHidePopper}
                theme={theme}
              />
            ))}
          {notifications.length > 5 && (
            <ShowAllButtton
              onClick={() => {
                history.push(`/notifications`);
                handleClosePopper();
              }}
            >
              See All Notifications
            </ShowAllButtton>
          )}
        </>
      ) : (
        <Box width={'100%'} pt={2} display="flex" justifyContent="center">
          No notifications
        </Box>
      )}
    </div>
  );
};

const NotificationContainer = styled.div`
  padding: ${grid(1)} ${grid(2)} 0 0;
  display: flex;
  align-items: stretch;
  position: relative;
`;

const AvatarContainer = styled.div`
  flex-grow: 0;
  margin-right: ${grid(1)};
`;

const ContentContainer = styled.div`
  width: 100%;
`;

type NotificationMessageProps = React.PropsWithChildren<{
  theme?: 'dark' | 'light';
}>;

const NotificationMessage = styled.div<NotificationMessageProps>`
  margin-top: 0;
  margin-bottom: ${grid(1)};
  font-size: ${FontSize.M};
  color: ${(p) => (p.theme === 'dark' ? Color.White : '#181818')};
  word-break: break-word;

  label {
    font-size: 14px;
    color: ${(p) => (p.theme === 'dark' ? Color.White : '#65CB63')};
    margin: 0;
    margin-bottom: 10px;
    display: block;
  }

  b {
    font-weight: bold;
    cursor: pointer;
    color: #0D59EE;
  }

  em {
    font-style: normal;
    font-weight: bold;
    color: #65cb63;
  }
`;

const TimeLabel = styled.p`
  margin-top: 8px;
  color: ${Color.GrayDark};
  font-size: ${FontSize.S};
`;

const TimeDivider = styled.div<NotificationMessageProps>`
  margin-top: 8px;
  margin-bottom: 8px;
  opacity: 0.1;
  border: 1px solid ${(p) => (p.theme === 'dark' ? Color.White : Color.Black)};
`;

const NewPastWrapper = styled.div`
  margin-top: 20px;
`;

const RemoveButton = styled(RemoveIcon)`
  cursor: pointer;
  margin-left: 20px;
  width: 16px;
  height: 16px;
  color: ${(p) => (p.theme === 'dark' ? Color.White : Color.GrayDark)};
`;

const ShowAllButtton = styled.div`
  padding-top: 20px;
  padding-bottom: 5px;
  text-align: center;
  color: #99a1b3;
  cursor: pointer;
`;
