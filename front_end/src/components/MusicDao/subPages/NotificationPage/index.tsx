import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Moment from 'react-moment';
import styled from 'styled-components';

import Hidden from '@material-ui/core/Hidden';

import Box from 'shared/ui-kit/Box';
import { useNotifications } from 'shared/contexts/NotificationsContext';
import { Avatar, Color, FontSize, grid } from 'shared/ui-kit';
import { NotificationContent } from 'shared/ui-kit/Header/components/Notifications/NotificationContent';
import { NotificationButtons } from 'shared/ui-kit/Header/components/Notifications/NotificationButtons';
import { getDefaultAvatar } from 'shared/services/user/getUserAvatar';

import { notificationPageStyles } from './index.styles';

const trashIcon = require('assets/icons/trash.svg');

export default function NotificationPage() {
  const classes = notificationPageStyles();
  const history = useHistory();

  const {
    notifications,
    dismissNotification,
    removeNotification,
    clearNotification
  } = useNotifications();

  const clearAll = () => {
    clearNotification();
  };

  return (
    <Box className={classes.content}>
      <Box className={classes.background}>
        <Box className={classes.topBox}>
          <Box
            display="flex"
            alignItems="center"
            onClick={() => {
              history.goBack();
            }}
          >
            <svg
              width="57"
              height="15"
              viewBox="0 0 57 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.29892 0.85612L7.15468 0.716853L7.01577 0.861441L0.855773 7.27344L0.72266 7.412L0.855773 7.55056L7.01577 13.9626L7.15218 14.1045L7.29628 13.9704L8.10828 13.2144L8.25661 13.0763L8.11656 12.9298L3.56791 8.172H55.756H55.956V7.972V6.852V6.652H55.756H3.56969L8.11618 1.92261L8.25449 1.77874L8.11092 1.64012L7.29892 0.85612Z"
                fill="white"
                stroke="white"
                strokeWidth="0.4"
              />
            </svg>

            <Box ml={1.5} color={'white'}>
              Back
            </Box>
          </Box>
          <Box className={classes.title}>Notifications</Box>
          <Box className={classes.clearBtn} ml={1} onClick={clearAll}>
            Clear All
          </Box>
        </Box>
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <NotificationItem
              notification={n}
              dismissNotification={dismissNotification}
              removeNotification={removeNotification}
            />
          ))
        ) : (
          <Box>No unread notifications</Box>
        )}
      </Box>
    </Box>
  );
}

const NotificationItem = ({
  notification,
  dismissNotification,
  removeNotification
}) => {
  const [avatar, setAvatar] = useState<string>('');

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
        <Avatar noBorder url={avatar} size="medium" />
      </AvatarContainer>
      <ContentContainer>
        <Hidden mdUp>
          <TimeLabel>
            <Moment format="DD MMM YYYY hh:mm:ss">
              {new Date(notification.date)}
            </Moment>
          </TimeLabel>
        </Hidden>
        <NotificationMessage>
          <NotificationContent notification={notification} isFromPage />
        </NotificationMessage>
        <NotificationButtons
          notification={notification}
          onDismissNotification={dismissNotification}
          onRemoveNotification={() => {
            removeNotification(notification.id);
          }}
          refreshAllProfile={() => {}}
          viewMore={() => {}}
          setSelectedNotification={() => {}}
          handleShowContributionModal={() => {}}
          handleClosePopper={() => {}}
          handleHidePopper={() => {}}
        />
      </ContentContainer>
      <Hidden smDown>
        <TimeLabel>
          <Moment format="DD MMM YYYY hh:mm:ss">
            {new Date(notification.date)}
          </Moment>
        </TimeLabel>
      </Hidden>
      <Box
        style={{
          width: 20,
          height: 20,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundImage: `url(${trashIcon})`,
          marginBottom: 10,
          marginLeft: 10,
          cursor: 'pointer'
        }}
        onClick={() => {
          removeNotification(notification.id);
        }}
      />
    </NotificationContainer>
  );
};

const NotificationContainer = styled.div`
  padding: ${grid(2)} ${grid(2)} ${grid(2)} ${grid(2)};
  border-radius: 12px;
  display: flex;
  align-items: flex-start;
  position: relative;
  width: 100%;
  background: white;
  margin-bottom: 12px;
  align-items: center;
`;

const AvatarContainer = styled.div`
  flex-grow: 0;
  margin-right: ${grid(2)};
`;

const ContentContainer = styled.div`
  flex: 1;
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
    color: ${(p) => (p.theme === 'dark' ? Color.White : '#181818')};
    margin: 0;
    margin-bottom: 10px;
    display: block;
  }

  b {
    font-weight: bold;
    cursor: pointer;
  }

  em {
    font-style: normal;
    font-weight: bold;
  }
`;

const TimeLabel = styled.p`
  margin-top: 8px;
  color: '#0D59EE !important';
  font-size: ${FontSize.S};
`;
