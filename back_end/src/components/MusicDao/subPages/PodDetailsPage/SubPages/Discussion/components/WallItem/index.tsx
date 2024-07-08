import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { TwitterShareButton } from 'react-share';

import { Avatar } from 'shared/ui-kit';
import Box from 'shared/ui-kit/Box';
import useIPFS from 'shared/utils-IPFS/useIPFS';
import getIPFSURL from 'shared/functions/getIPFSURL';
import { onGetNonDecrypt } from 'shared/ipfs/get';
import { _arrayBufferToBase64 } from 'shared/functions/commonFunctions';
import { getRandomAvatar } from 'shared/services/user/getUserAvatar';
import { processImage } from 'shared/helpers';

import { ReactComponent as TwitterIcon } from 'assets/snsIcons/twitter.svg';
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

  const [imageIPFS, setImageIPFS] = useState<any>(null);
  const [videoIPFS, setVideoIPFS] = useState<any>(null);

  const { ipfs, setMultiAddr, downloadWithNonDecryption } = useIPFS();

  useEffect(() => {
    setMultiAddr(`${getIPFSURL()}/api/v0`);
  }, []);

  useEffect(() => {
    let item = props.item;
    if (
      item?.infoImage?.newFileCID &&
      item?.infoImage?.metadata?.properties?.name
    ) {
      getImageIPFS(
        item.infoImage?.newFileCID,
        item.infoImage.metadata.properties.name
      );
    }
    if (
      item?.infoVideo?.newFileCID &&
      item?.infoVideo?.metadata?.properties?.name
    ) {
      getVideoIPFS(
        item.infoVideo?.newFileCID,
        item?.infoVideo?.metadata?.properties?.name
      );
    }
  }, [props.item, ipfs]);

  const getImageIPFS = async (cid: string, fileName: string) => {
    let files = await onGetNonDecrypt(
      cid,
      fileName,
      (fileCID, fileName, download) =>
        downloadWithNonDecryption(fileCID, fileName, download)
    );
    if (files) {
      let base64String = _arrayBufferToBase64(files.buffer);
      if (fileName?.slice(-4) === '.gif') {
        setImageIPFS('data:image/gif;base64,' + base64String);
      } else {
        setImageIPFS('data:image/png;base64,' + base64String);
      }
    }
  };

  const getVideoIPFS = async (cid: string, fileName: string) => {
    let files = await onGetNonDecrypt(
      cid,
      fileName,
      (fileCID, fileName, download) =>
        downloadWithNonDecryption(fileCID, fileName, download)
    );
    if (files) {
      let base64String = _arrayBufferToBase64(files.buffer);
      setVideoIPFS('data:video/mp4;base64,' + base64String);
    }
  };

  return (
    <Box
      className={classes.item}
      style={{
        background: props.item.pinned ? '#9EACF2' : 'white',
        color: props.item.pinned ? 'white' : 'black'
      }}
    >
      {imageIPFS && (
        <Box
          className={classes.image}
          style={{
            backgroundImage: imageIPFS ? `url("${imageIPFS}")` : 'none',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: props.isOnAllPage ? '200px' : '124px'
          }}
          onClick={() => {
            history.push(`/pod-post/${props.item.id}`);
          }}
        />
      )}
      <div className={classes.userImage}>
        <Avatar
          size="small"
          url={processImage(props.Creator?.imageURL) ?? getRandomAvatar()}
        />
      </div>

      <Box display="flex" flexDirection="column" p={2} flex={1}>
        <Box
          className={classes.header1}
          style={{ paddingLeft: 0, paddingBottom: '12px' }}
          onClick={() => {
            history.push(`/pod-post/${props.item.id}`);
          }}
        >
          {props.item.title ? props.item.title : ''}
        </Box>
        {props.item.shortPreviewText && (
          <Box
            flex={1}
            className={classes.header2}
            mt={1}
            onClick={() => {
              history.push(`/pod-post/${props.item.id}`);
            }}
          >
            {props.item.shortPreviewText}
          </Box>
        )}
        <Box
          display="flex"
          alignItems="center"
          mt={1}
          borderTop={
            props.item.pinned ? '1px solid white' : '1px solid #707582'
          }
          pt={1}
          justifyContent="space-between"
        >
          <Box
            display="flex"
            onClick={() => {
              history.push(`/pod-post/${props.item.id}`);
            }}
          >
            <ResponseIcon color={props.item.pinned ? 'white' : '#727F9A'} />
            <Box className={classes.header2} ml={1}>
              {props.item.responses && props.item.responses.length
                ? `${props.item.responses.length} Responses`
                : `0 Responses`}
            </Box>
          </Box>
          <TwitterShareButton
            title="Check out this Capsule Post at "
            url={`${window.location.origin}/#/pod-post/${props.item.id}`}
          >
            <TwitterIcon />
          </TwitterShareButton>
        </Box>
      </Box>
    </Box>
  );
}, arePropsEqual);

export default WallItem;
