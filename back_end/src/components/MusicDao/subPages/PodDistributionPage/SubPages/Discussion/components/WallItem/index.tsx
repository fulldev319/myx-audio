import React from 'react';
import { useHistory } from 'react-router-dom';

import { processImage } from 'shared/helpers';
import { getDefaultAvatar } from 'shared/services/user/getUserAvatar';
import { Avatar } from 'shared/ui-kit';
import Box from 'shared/ui-kit/Box';

import { wallItemStyles } from './index.styles';

const ResponseIcon = ({ color = '#727F9A' }) => {
  return (
    <svg
      width="18"
      height="19"
      viewBox="0 0 18 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17 1H1V13H4V18L9 13H17V1Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const arePropsEqual = (prevProps, currProps) => {
  return prevProps.item === currProps.item && prevProps.type === currProps.type;
};

const WallItem = React.memo((props: any) => {
  const classes = wallItemStyles();
  const history = useHistory();

  return (
    <Box
      className={classes.item}
      style={{
        background: props.item.isPinned ? '#9EACF2' : 'white',
        color: props.item.isPinned ? 'white' : 'black'
      }}
      onClick={() => {
        history.push(`/pod-post/${props.item.id}`);
      }}
    >
      {props.item.Url && props.item.hasPhoto && (
        <Box
          className={classes.image}
          style={{
            backgroundImage: props.item.Url
              ? `url("${props.item.Url}")`
              : 'none',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
          onClick={() => {}}
        />
      )}
      <div className={classes.userImage}>
        <Avatar
          size="small"
          url={processImage(props.Creator?.imageUrl) ?? getDefaultAvatar()}
        />
      </div>

      <Box display="flex" flexDirection="column" flex={1}>
        <Box className={classes.header1}>
          {props.item.name ? props.item.name : ''}
        </Box>
        {props.item.textShort && (
          <Box flex={1} className={classes.header2} mt={1}>
            {props.item.textShort}{' '}
            {props.index *
              props.index *
              props.index *
              props.index *
              props.index *
              props.index *
              props.index *
              props.index *
              props.index *
              props.index *
              props.index}
          </Box>
        )}
        <div className={classes.footer}>
          <ResponseIcon color={props.item.isPinned ? '#ffffff' : '#727F9A'} />
          <Box className={classes.header2} ml={1}>
            {props.item.responses && props.item.responses.length
              ? `${props.item.responses.length} Responses`
              : `0 Responses`}
          </Box>
        </div>
      </Box>
    </Box>
  );
}, arePropsEqual);

export default WallItem;
