import React, { useState, useEffect } from 'react';
import { BlockchainNets } from 'shared/constants/constants';
import getPhotoIPFS from 'shared/functions/getPhotoIPFS';
import { getDefaultBGImage } from 'shared/services/user/getUserAvatar';
import Box from 'shared/ui-kit/Box';
import useIPFS from 'shared/utils-IPFS/useIPFS';

import { useMediaNFTCardStyles } from './index.styles';

const MediaNFTCard = ({ pod, nft }) => {
  const classes = useMediaNFTCardStyles();
  const [podImageIPFS, setPodImageIPFS] = useState<any>(null);
  const { downloadWithNonDecryption } = useIPFS();

  useEffect(() => {
    if (!pod || !pod.InfoImage) return;
    getPodImageIPFS(
      pod.InfoImage.newFileCID,
      pod.InfoImage.metadata.properties.name
    );
  }, [nft]);

  const handleOpenScan = () => {
    const selectedChain = BlockchainNets.find(
      (net) => net.value === pod.blockchainNetwork
    );
    window.open(
      `${selectedChain.scan.url}/token/${nft.tokenAddress}`,
      '_blank'
    );
  };

  const getPodImageIPFS = async (cid: string, fileName: string) => {
    if (cid && fileName) {
      let imageUrl = await getPhotoIPFS(
        cid,
        fileName,
        downloadWithNonDecryption
      );
      setPodImageIPFS(imageUrl);
    } else {
      setPodImageIPFS(getDefaultBGImage());
    }
  };

  return (
    <Box className={classes.container}>
      <Box
        className={classes.image}
        style={{
          backgroundImage: `url("${podImageIPFS}")`
        }}
      />
      <Box className={classes.podInfoContainer}>
        <Box className={classes.title} mb={4}>
          {pod.Name} #{nft.tokenId}
        </Box>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box className={classes.infoTitle}>Media Fractions</Box>
          <Box className={classes.infoValue}>{nft.amount}</Box>
        </Box>
        <Box className={classes.divider} />
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box className={classes.infoTitle}>Share</Box>
          <Box className={classes.infoValue}>{nft.share}%</Box>
        </Box>
        <Box className={classes.divider} />
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box className={classes.infoTitle}>NFT Address</Box>
          <Box
            display="flex"
            alignItems="center"
            onClick={handleOpenScan}
            style={{ cursor: 'pointer' }}
          >
            <Box className={classes.address} mr={1}>
              {nft.tokenAddress.substr(0, 6) +
                '...' +
                nft.tokenAddress.substr(-4)}
            </Box>
            <img
              src={require('assets/tokenImages/POLYGON.webp')}
              alt="polygon"
              width={20}
              height={20}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MediaNFTCard;
