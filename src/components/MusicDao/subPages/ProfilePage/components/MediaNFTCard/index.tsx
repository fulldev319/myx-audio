import React, { useMemo, useState, useEffect } from 'react';

import { BlockchainNets } from 'shared/constants/constants';
import getPhotoIPFS from 'shared/functions/getPhotoIPFS';
import { processImage } from 'shared/helpers';
import { getDefaultBGImage } from 'shared/services/user/getUserAvatar';
import { Avatar } from 'shared/ui-kit';
import Box from 'shared/ui-kit/Box';
import useIPFS from 'shared/utils-IPFS/useIPFS';

import { useMediaNFTCardStyles } from './index.styles';

const MediaNFTCard = (props) => {
  const { nft } = props;
  const [podImageIPFS, setPodImageIPFS] = useState<any>(null);
  const { downloadWithNonDecryption } = useIPFS();

  const selectedChain = useMemo(
    () =>
      BlockchainNets.find((net) => net.value === nft.podInfo?.name) ||
      BlockchainNets[1],
    [nft]
  );

  useEffect(() => {
    getPodImageIPFS(
      nft?.podInfo?.image?.newFileCID,
      nft?.podInfo?.image?.metadata?.properties?.name
    );
  }, [nft]);

  const handleOpenScan = () => {
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

  const classes = useMediaNFTCardStyles();
  return (
    <Box className={classes.container}>
      <Box
        className={classes.image}
        style={{
          backgroundImage: `url(${podImageIPFS})`
        }}
      >
        <Box className={classes.tag}>POP</Box>
      </Box>
      <Box className={classes.podInfoContainer}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Avatar size="small" url={processImage(nft.creatorInfo.image)} />
          <Box className={classes.price}>
            Price&nbsp;<span>2234 USDT</span>
          </Box>
        </Box>
        <Box className={classes.divider} />
        <Box className={classes.title} mb={4}>
          {nft.podInfo?.name || nft.podName} #{nft.tokenId}
        </Box>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box className={classes.infoTitle}>Copyright tokens</Box>
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
            {selectedChain && (
              <img
                src={require(`assets/tokenImages/${selectedChain?.name}.webp`)}
                alt={selectedChain?.name}
                width={20}
                height={20}
              />
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MediaNFTCard;
