import React, { useEffect, useState } from 'react';

import Grid from '@material-ui/core/Grid';

import { Modal } from 'shared/ui-kit';
import SkeletonBox from 'shared/ui-kit/SkeletonBox';

import InputWithLabelAndTooltip from 'shared/ui-kit/InputWithLabelAndTooltip';
import { getDefaultBGImage } from 'shared/services/user/getUserAvatar';
import Box from 'shared/ui-kit/Box';
import { onGetNonDecrypt } from 'shared/ipfs/get';
import useIPFS from 'shared/utils-IPFS/useIPFS';
import { _arrayBufferToBase64 } from 'shared/functions/commonFunctions';
import getIPFSURL from 'shared/functions/getIPFSURL';
import { getAllTokenInfos } from 'shared/services/API/TokenAPI';

import { investNFTModalStyles } from './index.styles';
import { nFormatter } from 'shared/helpers';

const SquareInvestTop = ({ nft }) => {
  const classes = investNFTModalStyles();
  const { ipfs, setMultiAddr, downloadWithNonDecryption } = useIPFS();

  const [imageIPFS, setImageIPFS] = useState<any>(null);
  const [tokens, setTokens] = useState<any[]>([]);

  useEffect(() => {
    getAllTokenInfos().then((resp) => {
      if (resp.success) {
        const tokenList = resp.tokens.filter(
          (item) => item.Symbol === 'USDT' && item.Network === 'Polygon'
        );
        setTokens(tokenList); // update token list
      }
    });
  }, []);

  useEffect(() => {
    setMultiAddr(`${getIPFSURL()}/api/v0`);
  }, []);

  useEffect(() => {
    if (ipfs && Object.keys(ipfs).length !== 0) {
      if (nft && nft.metadataPhoto && nft.metadataPhoto.newFileCID) {
        getImageIPFS(
          nft.metadataPhoto.newFileCID,
          nft.metadataPhoto.metadata.properties.name
        );
      }
    }
  }, [nft.metadataPhoto, ipfs]);

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
    } else {
      setImageIPFS(getDefaultBGImage());
    }
  };

  const price = React.useMemo(() => {
    if (tokens.length === 0) return 0;
    return (
      nft.sellingOffer &&
      nft.sellingOffer.Price &&
      `${nFormatter(
        getTokenPrice(
          tokens,
          nft.sellingOffer.Price,
          nft.sellingOffer.PaymentToken
        ),
        1
      )} ${getTokenName(tokens, nft.sellingOffer.PaymentToken)}`
    );
  }, [nft, tokens]);

  const getTokenName = (allTokens, addr) => {
    if (allTokens.length == 0) return '';
    const token = allTokens.find(
      (token) =>
        token.Address?.toLowerCase() === addr?.toLowerCase() ||
        token.Symbol?.toLowerCase() === addr?.toLowerCase()
    );
    return token ? token.Symbol : '';
  };

  const getTokenPrice = (allTokens, price, addr) => {
    if (allTokens.length == 0) return 0;
    const token = allTokens.find(
      (token) =>
        token.Address?.toLowerCase() === addr?.toLowerCase() ||
        token.Symbol?.toLowerCase() === addr?.toLowerCase()
    );
    return token ? price / 10 ** token.Decimals : 0;
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={5}>
        <SkeletonBox
          loading={!imageIPFS}
          image={imageIPFS}
          width={1}
          height={1}
          style={{
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            overflow: 'hidden',
            minHeight: 272
          }}
        />
      </Grid>
      <Grid item xs={12} sm={7}>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          height={1}
          my={2}
        >
          <Box className={classes.nftName}>{nft.Title}</Box>
          <Box display="flex" justifyContent="space-between">
            <Box>
              <Box className={classes.nftLabel}>NFT Number</Box>
              <Box className={classes.nftValue}>5 / 10</Box>
            </Box>
            <Box>
              <Box className={classes.nftLabel}>Token price</Box>
              <Box className={classes.nftValue}>{price}</Box>
            </Box>
            <Box>
              <Box className={classes.nftLabel}>Allocation (%)</Box>
              <Box className={classes.nftValue}>5 / 10</Box>
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

const SquareInvestBottom = ({ quantity, setQuantity }) => {
  const classes = investNFTModalStyles();
  return (
    <Box mt={3}>
      <Box width={1}>
        <InputWithLabelAndTooltip
          labelName="How many NFTs do you want to buy?"
          tooltip=""
          overriedClasses=""
          type="euro-number"
          inputValue={quantity}
          onInputValueChange={setQuantity}
        />
      </Box>
      <Box className={classes.bottomBox} mt={2} textAlign="end">
        <Box className={classes.priceLabel}>Total price to pay</Box>
        <Box>
          <Box className={classes.price}>USDT 64.50</Box>
          <Box className={classes.priceUSD}>($68.20)</Box>
        </Box>
      </Box>
    </Box>
  );
};

export default function InvestNFTModal({ nft, open, handleClose }) {
  const classes = investNFTModalStyles();

  const [quantity, setQuantity] = useState<string>('');

  return (
    <Modal
      size="medium"
      isOpen={open}
      onClose={handleClose}
      className={classes.root}
      showCloseIcon
    >
      <Box className={classes.title}>Invest</Box>
      <SquareInvestTop nft={nft} />
      <SquareInvestBottom quantity={quantity} setQuantity={setQuantity} />
      <Box className={classes.submit}>
        <button
          onClick={() => {}}
          style={{
            background: '#65CB63'
          }}
        >
          Invest
        </button>
      </Box>
    </Modal>
  );
}
