import React from 'react';
// import Moment from "react-moment";

import Box from 'shared/ui-kit/Box';

import { chatStyles } from './index.styles';

const ListChats = ({ discussions, selectedChat, onTopicSelected }) => {
  const classes = chatStyles();

  return (
    <>
      {discussions.map((val, index) => {
        return (
          <Box
            className={
              val.id && val.id === selectedChat
                ? classes.discussionHeaderSelected
                : classes.discussionHeader
            }
            key={`discussion-${index}`}
            onClick={() => {
              onTopicSelected(val);
            }}
          >
            <Box className={classes.titleTopic}>{val.title}</Box>
            {/* <Box className={classes.titleTopic}
                   style={{
                     marginBottom: val.lastMessage && val.lastMessage !== "" ? 5 : 0
                   }}>
                {val.title}
              </Box>
              {val.lastMessage && val.lastMessage !== "" ? (
                <Box className={classes.lastMessageTopic}>
                  {val.lastMessage}
                </Box>
              ) : null}
              {val.lastMessageDate && val.lastMessageDate !== 0 ? (
                <Box className={classes.lastMessageDateTopic}>
                  Last message: &nbsp;
                  <Moment fromNow>{val.lastMessageDate}</Moment>
                </Box>
              ) : null} */}
          </Box>
        );
      })}
    </>
  );
};

export default ListChats;
