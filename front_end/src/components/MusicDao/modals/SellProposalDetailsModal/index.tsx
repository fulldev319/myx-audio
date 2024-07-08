import React, { useState, useEffect, useMemo } from 'react';

import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import Box from 'shared/ui-kit/Box';
import { Modal, PrimaryButton } from 'shared/ui-kit';
import { getDefaultBGImage } from 'shared/services/user/getUserAvatar';
import { modalStyles } from './index.styles';
import getPhotoIPFS from 'shared/functions/getPhotoIPFS';
import useIPFS from 'shared/utils-IPFS/useIPFS';
import { useTypedSelector } from 'store/reducers/Reducer';
import { BlockchainNets } from 'shared/constants/constants';

const SellProposalDetailsModal = ({
  pod,
  proposal,
  open,
  openVote,
  handleClose
}) => {
  const classes = modalStyles();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  const user = useTypedSelector((state) => state.user);

  const [ipfsImage, setIpfsImage] = useState<string>();
  const { downloadWithNonDecryption } = useIPFS();

  const voteDisabled = useMemo(() => {
    if (!user) return true;
    return proposal.votes.find((item) => item.voter === user.id);
  }, [user, proposal]);

  useEffect(() => {
    if (!proposal || !proposal.media) return;

    (async () => {
      const image = await getPhotoIPFS(
        proposal.media.metadataPhoto.newFileCID,
        proposal.media.metadataPhoto.metadata.properties.name,
        downloadWithNonDecryption
      );
      setIpfsImage(image);
    })();
  }, [proposal]);

  const handleOpenScan = () => {
    const selectedChain = BlockchainNets.find(
      (net) => net.value === pod.blockchainNetwork
    );
    window.open(
      `${selectedChain.scan.url}/token/${proposal.media.nftAddress}`,
      '_blank'
    );
  };

  const creatorName = (artists) => {
    if (artists) {
      let result = artists.main[0] ? artists.main[0].name : '';
      if (artists.featured?.length) {
        result = result ? result + ' ft ' : '';
        artists.featured.map((v, i) => {
          if (i < artists.featured.length - 1) result += v.name + ', ';
          else {
            result += v.name;
          }
        });
      }

      return result;
    }

    return '';
  };

  return (
    <>
      <Modal size="daoMedium" isOpen={open} onClose={handleClose} showCloseIcon>
        <div className={classes.content}>
          <div className={classes.typo1}>Proposal Details</div>
          <Box
            display="flex"
            mt={7}
            flexDirection={isMobile ? 'column' : 'row'}
          >
            <img
              src={ipfsImage || getDefaultBGImage()}
              className={classes.artistImage}
            />
            <Box
              display="flex"
              flexDirection="column"
              ml={isMobile ? 0 : 4}
              mt={isMobile ? 2 : 0}
              width={1}
            >
              <Box className={classes.typo2}>{proposal.media.Title}</Box>
              <Box className={classes.typo3} mt={0.5}>
                {creatorName(proposal.media.Artists)}
              </Box>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                py={2}
                my={2}
                borderTop="1.3346px solid rgba(84, 101, 143, 0.3)"
                borderBottom="1.3346px solid rgba(84, 101, 143, 0.3)"
              >
                <Box className={classes.typo3}>NFT Address</Box>
                <Box display="flex" alignItems="center">
                  <Box
                    className={classes.typo4}
                    style={{ cursor: 'pointer' }}
                    onClick={handleOpenScan}
                    mr={2}
                  >
                    {proposal.media.nftAddress.substr(0, 6)}...
                    {proposal.media.nftAddress.substr(-4)}
                  </Box>
                  <img
                    src={require(`assets/tokenImages/POLYGON.webp`)}
                    style={{
                      width: '22px',
                      height: '22px',
                      cursor: 'pointer'
                    }}
                    onClick={handleOpenScan}
                  />
                </Box>
              </Box>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box className={classes.typo3}>Market</Box>
                <img
                  src={require(proposal.marketType === 0
                    ? `assets/logos/music.webp`
                    : `assets/icons/opensea.webp`)}
                  style={{
                    height: '22px'
                  }}
                />
              </Box>
            </Box>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            pt={'27px'}
            mt={7}
            borderTop="1px solid #35385620"
          >
            <Box className={classes.typo5}>Selling price proposed</Box>
            <Box className={classes.typo6}>{proposal.amount} USDT</Box>
          </Box>
          <Box width={1} display="flex" justifyContent="flex-end" mt={8}>
            <PrimaryButton
              size="medium"
              isRounded
              style={{ width: 176, height: 61, background: '#65CB63' }}
              onClick={() => {
                handleClose();
                openVote();
              }}
            >
              {voteDisabled ? 'See Result' : 'Vote'}
            </PrimaryButton>
          </Box>
        </div>
      </Modal>
    </>
  );
};

export default SellProposalDetailsModal;
