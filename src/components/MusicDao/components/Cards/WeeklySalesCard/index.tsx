import React from 'react';
import { useHistory } from 'react-router-dom';

import Box from 'shared/ui-kit/Box';
import { getDefaultBGImage } from 'shared/services/user/getUserAvatar';
import { processImage } from 'shared/helpers/utils';
import { useStyles } from './index.styles';

export default function WeeklySalesCard({
  data,
  customSize,
  isLoading = false
}: {
  data: any;
  customSize?: any;
  isLoading?: boolean;
}) {
  const classes = useStyles();
  const history = useHistory();

  const imagePath = React.useMemo(() => {
    return processImage(data?.image);
  }, [data.image]);

  const nftName = React.useMemo(() => {
    if (data?.name) {
      if (data?.name.length > 20) {
        return data?.address.slice(0, 20) + '...';
      } else {
        return data?.name;
      }
    } else if (data?.address) {
      return (
        data?.address.slice(0, 10) +
        '...' +
        data?.address.slice(data?.address.length - 7, data?.address.length - 1)
      );
    } else {
      return '-';
    }
  }, [data]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      className={classes.root}
      onClick={() =>
        data &&
        data.address &&
        history.push(`/marketplace/artists/${data.address}`)
      }
    >
      <img
        src={data?.image ? imagePath : getDefaultBGImage()}
        height={customSize.height}
        width={customSize.width}
        style={{
          height: customSize.height
            ? `${customSize.height} !important`
            : '160px',
          width: customSize.width ? `${customSize.width} !important` : '100%'
        }}
        alt="artist image"
      />
      <Box className={classes.content}>
        <Box className={classes.typo1} style={{position: 'relative'}}>
          {nftName}
          <Box className={classes.socialButtonBox}>
            {data.twitter && (
              <Box
                className={classes.socialButton}
                onClick={(event) => {
                  event.stopPropagation();
                  window.open(
                    data.twitter,
                    '_blank'
                  );
                }}
              >
                <img
                  src={require('assets/icons/social_twitter.webp')}
                  alt="twitter"
                />
              </Box>
            )}
            {data?.instagram && (
              <Box
                className={classes.socialButton}
                onClick={(event) => {
                  event.stopPropagation();
                  window.open(
                    data.instagram,
                    '_blank'
                  );
                }}
              >
                <img
                  src={require('assets/icons/social_instagram.webp')}
                  alt="instagram"
                />
              </Box>
            )}
          </Box>
        </Box>
        <Box display={'flex'} alignItems="center" my={2}>
          <EtherIcon />
          <Box className={classes.typo2} mx={1} color="#6C6E7E">
            {data?.address
              ? `${data?.address.slice(0, 10)}...${data?.address.slice(
                  data?.address.length - 7,
                  data?.address.length - 1
                )}`
              : ''}
          </Box>
        </Box>
        <Box width={1} height={'1px'} bgcolor="#00000010" />
        <Box
          display={'flex'}
          alignItems="center"
          justifyContent={'space-between'}
          mt={2.5}
        >
          <Box
            className={classes.typo2}
            color="#6C6E7E"
            style={{ textTransform: 'uppercase' }}
          >
            Music NFTs
          </Box>
          <Box className={classes.typo2} fontWeight={600} color="#2D3047">
            {data?.count}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

const EtherIcon = () => (
  <svg
    width="27"
    height="28"
    viewBox="0 0 27 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M18.3884 14.1305L13.5898 6.30981L8.79126 14.1305L13.5898 16.9166L18.3884 14.1305ZM18.3893 15.0244L13.5879 17.809V17.809L8.78931 15.0243L13.5878 21.6662L13.5878 21.6664L18.3893 15.0244Z"
      fill="black"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M13.5879 17.809L18.3893 15.0244L13.5878 21.6664L13.5878 21.6662L8.78931 15.0243L13.5879 17.809V17.809ZM13.5898 6.30981L18.3884 14.1305L13.5898 16.9166L8.79126 14.1305L13.5898 6.30981Z"
      fill="white"
      fill-opacity="0.01"
    />
    <path
      d="M13.5881 6.30981V11.9866L18.3862 14.1306L13.5881 6.30981Z"
      fill="white"
      fill-opacity="0.602"
    />
    <path
      d="M13.59 6.30981L8.79126 14.1306L13.59 11.9866V6.30981Z"
      fill="#CCCCCC"
    />
    <path
      d="M13.5881 17.8093V21.6666L18.3894 15.024L13.5881 17.8093Z"
      fill="white"
      fill-opacity="0.602"
    />
    <path
      d="M13.588 21.6666V17.8087L8.78931 15.024L13.588 21.6666Z"
      fill="#CCCCCC"
    />
    <path
      d="M13.5881 16.9166L18.3862 14.1306L13.5881 11.9879V16.9166Z"
      fill="white"
      fill-opacity="0.2"
    />
    <path
      d="M8.78931 14.1306L13.588 16.9166V11.9879L8.78931 14.1306Z"
      fill="white"
      fill-opacity="0.602"
    />
    <path
      d="M13.6212 26.9554C6.65352 26.9554 1.00506 21.307 1.00506 14.3393H-0.461605C-0.461605 22.117 5.8435 28.4221 13.6212 28.4221V26.9554ZM26.2374 14.3393C26.2374 21.307 20.589 26.9554 13.6212 26.9554V28.4221C21.399 28.4221 27.7041 22.117 27.7041 14.3393H26.2374ZM13.6212 1.72308C20.589 1.72308 26.2374 7.37153 26.2374 14.3393H27.7041C27.7041 6.56152 21.399 0.256413 13.6212 0.256413V1.72308ZM13.6212 0.256413C5.8435 0.256413 -0.461605 6.56152 -0.461605 14.3393H1.00506C1.00506 7.37153 6.65352 1.72308 13.6212 1.72308V0.256413Z"
      fill="#A8A8A8"
      fill-opacity="0.38"
    />
  </svg>
);

const LinkIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.58376 8.26305H6.19318C5.96513 8.26305 5.77601 8.07393 5.77601 7.84588C5.77601 7.61783 5.96513 7.42871 6.19318 7.42871H7.58376C9.04108 7.42871 10.2258 6.24394 10.2258 4.78662C10.2258 3.32929 9.04108 2.14453 7.58376 2.14453H4.80261C3.34529 2.14453 2.16052 3.32929 2.16052 4.78662C2.16052 5.39847 2.37745 5.99363 2.76681 6.46643C2.91143 6.64442 2.88918 6.90585 2.71118 7.05603C2.53319 7.20065 2.27176 7.1784 2.12158 7.00041C1.60985 6.37743 1.32617 5.59315 1.32617 4.78662C1.32617 2.86762 2.88362 1.31018 4.80261 1.31018H7.58376C9.50275 1.31018 11.0602 2.86762 11.0602 4.78662C11.0602 6.70561 9.50275 8.26305 7.58376 8.26305Z"
      fill="#6C6E7E"
      stroke="#6C6E7E"
      stroke-width="0.5"
    />
    <path
      d="M9.80861 12.1567H7.02746C5.10847 12.1567 3.55103 10.5993 3.55103 8.68029C3.55103 6.7613 5.10847 5.20386 7.02746 5.20386H8.41804C8.64609 5.20386 8.83521 5.39298 8.83521 5.62103C8.83521 5.84908 8.64609 6.0382 8.41804 6.0382H7.02746C5.57014 6.0382 4.38537 7.22297 4.38537 8.68029C4.38537 10.1376 5.57014 11.3224 7.02746 11.3224H9.80861C11.2659 11.3224 12.4507 10.1376 12.4507 8.68029C12.4507 8.06844 12.2338 7.47327 11.8444 7.00048C11.6998 6.82249 11.722 6.56106 11.9 6.41088C12.078 6.26069 12.3395 6.28851 12.4896 6.4665C13.0069 7.08948 13.2906 7.87376 13.2906 8.68029C13.285 10.5993 11.7276 12.1567 9.80861 12.1567Z"
      fill="#6C6E7E"
      stroke="#6C6E7E"
      stroke-width="0.5"
    />
  </svg>
);
