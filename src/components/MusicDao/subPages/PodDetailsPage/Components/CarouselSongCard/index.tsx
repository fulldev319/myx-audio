import React, { useEffect, useState } from 'react';

import Box from 'shared/ui-kit/Box';
import SkeletonBox from 'shared/ui-kit/SkeletonBox';

import useIPFS from 'shared/utils-IPFS/useIPFS';
import { onGetNonDecrypt } from 'shared/ipfs/get';
import { _arrayBufferToBase64 } from 'shared/functions/commonFunctions';

import { useCarouselSongCardStyles } from './index.styles';
import { getDefaultBGImage } from 'shared/services/user/getUserAvatar';

export const CarouselSongCard = ({ song, active }) => {
  const classes = useCarouselSongCardStyles();
  // const [isMore, setIsMore] = useState<boolean>(false);

  const { ipfs, downloadWithNonDecryption } = useIPFS();
  const [imageIPFS, setImageIPFS] = useState<any>(null);
  const [isSold, setIsSold] = useState<boolean>(false);
  const [mediaType, setMediaType] = useState<number>(0); // 0:1/1 song, 1:regular edition, 2:premium edition

  useEffect(() => {
    if (song) {
      if (song.pricePerEdition.length > 1) setMediaType(2);
      else if (song.pricePerEdition.length === 1) setMediaType(1);
    }
  }, [song]);

  useEffect(() => {
    if (song && ipfs && Object.keys(ipfs).length !== 0) {
      if (
        song?.metadataPhoto?.newFileCID &&
        song?.metadataPhoto?.metadata?.properties?.name
      ) {
        getImageIPFS(
          song.metadataPhoto.newFileCID,
          song.metadataPhoto.metadata.properties.name
        );
      } else {
        if (!!song.imageURLPerEdition.length) {
          setImageIPFS(song.imageURLPerEdition[0]);
        } else {
          setImageIPFS(getDefaultBGImage());
        }
      }
    }
  }, [song, ipfs]);

  useEffect(() => {
    const total =
      song?.quantityPerEdition?.reduce((a, b) => Number(a) + Number(b), 0) ?? 0;
    const sold =
      song?.quantitySoldPerEdition?.reduce(
        (a, b) => Number(a) + Number(b),
        0
      ) ?? 0;

    if (total !== 0 && total - sold <= 0) {
      setIsSold(true);
    } else {
      setIsSold(false);
    }
  }, [song]);

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

  return (
    <Box className={classes.card}>
      {mediaType === 2 &&
        (song.isStreaming ? (
          <>
            <Box position={'absolute'} top={18} right={15}>
              <VerticalMultiEditionsIcon />
            </Box>
            <Box
              className={classes.typo}
              position="absolute"
              top={154}
              right={-25}
            >
              Streaming
            </Box>
          </>
        ) : (
          <Box position={'absolute'} top={12} left={13}>
            <HorizontalMultiEditionsIcon />
          </Box>
        ))}
      <SkeletonBox
        loading={!imageIPFS}
        image={imageIPFS}
        width={1}
        height={1}
        className={classes.bgImg}
        style={{ border: active ? '3px solid #65CB63' : 'none' }}
      />
      <Box
        className={classes.nameBar}
        style={{
          background: active
            ? 'linear-gradient(4.49deg, #65CB63 4.83%, rgba(3, 150, 0, 0) 125.43%)'
            : 'linear-gradient(4.49deg, #000000 4.83%, rgba(0, 0, 0, 0) 125.43%)'
        }}
      >
        {song.name}
      </Box>
      {isSold && (
        <img
          src={require('assets/icons/stamp_sold.webp')}
          alt="sold-stamp"
          className={classes.stampImg}
        />
      )}
    </Box>
  );
};

const HorizontalMultiEditionsIcon = () => (
  <svg
    width="90"
    height="21"
    viewBox="0 0 90 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="10.6634"
      cy="10.4818"
      r="8.01888"
      fill="url(#paint0_radial_14180_22130)"
    />
    <circle
      cx="10.6634"
      cy="10.4818"
      r="9.01888"
      stroke="#313131"
      stroke-opacity="0.33"
      stroke-width="2"
    />
    <circle
      cx="33.6861"
      cy="10.4818"
      r="8.01888"
      fill="url(#paint1_radial_14180_22130)"
    />
    <circle
      cx="33.6861"
      cy="10.4818"
      r="9.01888"
      stroke="#313131"
      stroke-opacity="0.33"
      stroke-width="2"
    />
    <circle
      cx="56.7088"
      cy="10.4818"
      r="8.01888"
      fill="url(#paint2_radial_14180_22130)"
    />
    <circle
      cx="56.7088"
      cy="10.4818"
      r="9.01888"
      stroke="#313131"
      stroke-opacity="0.33"
      stroke-width="2"
    />
    <circle
      cx="79.7315"
      cy="10.4818"
      r="8.01888"
      fill="url(#paint3_radial_14180_22130)"
    />
    <circle
      cx="79.7315"
      cy="10.4818"
      r="9.01888"
      stroke="#313131"
      stroke-opacity="0.33"
      stroke-width="2"
    />
    <defs>
      <radialGradient
        id="paint0_radial_14180_22130"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(10.4242 2.69373) rotate(90.2714) scale(18.1209)"
      >
        <stop stop-color="#7A7A7A" />
        <stop offset="1" stop-color="#39393A" />
      </radialGradient>
      <radialGradient
        id="paint1_radial_14180_22130"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(33.5615 1.3892) rotate(90) scale(18.5895)"
      >
        <stop stop-color="#FFECDA" />
        <stop offset="1" stop-color="#A65F1E" />
      </radialGradient>
      <radialGradient
        id="paint2_radial_14180_22130"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(55.6431 -3.53711) rotate(88.3153) scale(34.0147)"
      >
        <stop stop-color="white" />
        <stop offset="1" stop-color="#636B76" />
      </radialGradient>
      <radialGradient
        id="paint3_radial_14180_22130"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(79.2633 2.04146) rotate(88.9292) scale(17.4511)"
      >
        <stop stop-color="white" />
        <stop offset="1" stop-color="#F2D1AB" />
      </radialGradient>
    </defs>
  </svg>
);

const VerticalMultiEditionsIcon = () => (
  <svg
    width="21"
    height="84"
    viewBox="0 0 21 84"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="10.6634"
      cy="10.4818"
      r="8.01888"
      fill="url(#paint0_radial_14180_22149)"
    />
    <circle
      cx="10.6634"
      cy="10.4818"
      r="9.01888"
      stroke="#216724"
      stroke-opacity="0.17"
      stroke-width="2"
    />
    <circle
      cx="10.6634"
      cy="31.5189"
      r="8.01888"
      fill="url(#paint1_radial_14180_22149)"
    />
    <circle
      cx="10.6634"
      cy="31.5189"
      r="9.01888"
      stroke="#216724"
      stroke-opacity="0.17"
      stroke-width="2"
    />
    <circle
      cx="10.6634"
      cy="52.5579"
      r="8.01888"
      fill="url(#paint2_radial_14180_22149)"
    />
    <circle
      cx="10.6634"
      cy="52.5579"
      r="9.01888"
      stroke="#216724"
      stroke-opacity="0.17"
      stroke-width="2"
    />
    <circle
      cx="10.6634"
      cy="73.595"
      r="8.01888"
      fill="url(#paint3_radial_14180_22149)"
    />
    <circle
      cx="10.6634"
      cy="73.595"
      r="9.01888"
      stroke="#216724"
      stroke-opacity="0.17"
      stroke-width="2"
    />
    <defs>
      <radialGradient
        id="paint0_radial_14180_22149"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(10.4242 2.69373) rotate(90.2714) scale(18.1209)"
      >
        <stop stop-color="#7A7A7A" />
        <stop offset="1" stop-color="#39393A" />
      </radialGradient>
      <radialGradient
        id="paint1_radial_14180_22149"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(10.5388 22.4263) rotate(90) scale(18.5895)"
      >
        <stop stop-color="#FFECDA" />
        <stop offset="1" stop-color="#A65F1E" />
      </radialGradient>
      <radialGradient
        id="paint2_radial_14180_22149"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(9.59766 38.5391) rotate(88.3153) scale(34.0147)"
      >
        <stop stop-color="white" />
        <stop offset="1" stop-color="#636B76" />
      </radialGradient>
      <radialGradient
        id="paint3_radial_14180_22149"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(10.1951 65.1547) rotate(88.9292) scale(17.4511)"
      >
        <stop stop-color="white" />
        <stop offset="1" stop-color="#F2D1AB" />
      </radialGradient>
    </defs>
  </svg>
);
