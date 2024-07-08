import React, { useState, useCallback } from 'react';
import Web3 from 'web3';
import { useWeb3React } from '@web3-react/core';
import { useSelector } from 'react-redux';

import makeStyles from '@material-ui/core/styles/makeStyles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import Box from 'shared/ui-kit/Box';
import { Color, FontSize, Modal, PrimaryButton } from 'shared/ui-kit';
import { Text } from 'components/MusicDao/components/ui-kit';
import { ArrowUpIcon } from 'components/MusicDao/components/Icons/SvgIcons';
import { musicDaoPageStyles } from 'components/MusicDao/index.styles';
import InputWithLabelAndTooltip from 'shared/ui-kit/InputWithLabelAndTooltip';
import { BlockchainNets } from 'shared/constants/constants';

import PolygonAPI from 'shared/services/API/polygon';
import { RootState } from 'store/reducers/Reducer';

const useStyles = makeStyles((theme) => ({
  hour: {
    background: Color.White,
    boxShadow: '0px 4px 13px rgba(0, 0, 0, 0.13)',
    borderRadius: 48,
    width: 80,
    height: 44,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  subTitle: {
    width: '80%',
    textAlign: 'center',
    fontWeigth: 600
  },
  shareInput: {
    width: '100%',
    paddingLeft: 20,
    paddingRight: 20,
    background: 'rgba(218, 230, 229, 0.4)',
    border: '1px solid #7BCBB7',
    borderRadius: 55,
    height: 50
  },
  costInput: {
    width: '100%',
    paddingLeft: 20,
    paddingRight: 20,
    border: '1px solid #F0F5F8',
    borderRadius: 55,
    height: 50,
    fontSize: 28,
    fontWeight: 700,

    '& input': {
      textAlign: 'end'
    }
  },
  shareBox: {
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column'
    }
  },
  shareItemBox1: {
    display: 'flex',
    alignItems: 'flex-start',
    flexDirection: 'column',
    paddingRight: theme.spacing(1),
    width: '60%',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      paddingRight: 0
    }
  },
  shareItemBox2: {
    display: 'flex',
    alignItems: 'flex-end',
    flexDirection: 'column',
    paddingLeft: theme.spacing(1),
    width: '40%',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      paddingLeft: 0
    }
  },
  availableBox: {
    fontSize: '14px',
    fontWeight: 400,
    color: '#707582',
    '& span': {
      fontWeight: 800
    }
  }
}));

const BuyShareModal = (props) => {
  const { open, data, handleRefresh, handleClose } = props;

  const userSelector = useSelector((state: RootState) => state.user);

  const classes = useStyles();
  const commonClasses = musicDaoPageStyles();
  const [totalCost, setTotalCost] = useState<string>('');
  const [shares, setShares] = useState<string>('');
  const [network, setNetwork] = useState<string>(BlockchainNets[1].value);

  const { account, library } = useWeb3React();

  const onPurchase = useCallback(() => {
    const func = async () => {
      if (account) {
        const web3 = new Web3(library.provider);

        const response: any = await PolygonAPI.Yield.mintShares(web3, account, {
          to: userSelector.address,
          bucket: data.id,
          amountOutShares: await web3.utils.toWei(`${shares}`)
        });

        if (response.success) {
          handleRefresh();
          handleClose();
        }
      }
    };
    func();
  }, [library, account, data, shares]);

  const onChangeNetwork = useCallback((v) => {
    setNetwork(v.target.value);
  }, []);

  return (
    <Modal size="small" isOpen={open} onClose={handleClose} showCloseIcon>
      <Box>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Text
            size={FontSize.H4}
            color={Color.MusicDAODark}
            style={{ fontWeight: 800 }}
          >
            Buy shares on time slot
          </Text>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            mt={3}
            mb={3}
          >
            <img
              src={require('assets/musicDAOImages/audio.webp')}
              alt="audio"
            />
            <Text
              size={FontSize.M}
              color={Color.MusicDAOLightBlue}
              ml={1.5}
              mr={1.5}
              style={{ fontWeight: 700 }}
            >
              From
            </Text>
            <div className={classes.hour}>
              <Text
                size={FontSize.M}
                color={Color.MusicDAODeepGreen}
                style={{ fontWeight: 700 }}
              >
                {data.MinRange}h
              </Text>
            </div>
            <Text
              size={FontSize.M}
              color={Color.MusicDAOLightBlue}
              ml={1.5}
              mr={1.5}
              style={{ fontWeight: 700 }}
            >
              To
            </Text>
            <div className={classes.hour}>
              <Text
                size={FontSize.M}
                color={Color.MusicDAODeepGreen}
                style={{ fontWeight: 700 }}
              >
                {data.MaxRange}h
              </Text>
            </div>
          </Box>
          <Text
            size={FontSize.L}
            className={classes.subTitle}
            color={Color.MusicDAOLightBlue}
          >
            Users will listen from 0 to 4hours of music on Music Platform within
            next 24hours{' '}
          </Text>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          bgcolor="#F2FBF6"
          borderRadius={12}
          width="100%"
          px={4}
          py={3}
          mt={2}
        >
          <Text size={FontSize.XL} bold color={Color.MusicDAOLightBlue}>
            SHARES AT
          </Text>
          <Box display="flex" flexDirection="row" alignItems="center" mt={1}>
            <Text size={FontSize.H4} bold color={Color.MusicDAODeepGreen}>
              {data.SharePrice} pUSD
            </Text>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexDirection="row"
              bgcolor="rgba(0, 209, 59, 0.09)"
              borderRadius={15}
              width={48}
              height={20}
              ml={1}
            >
              <ArrowUpIcon />
              <Text size={FontSize.S} color={Color.MusicDAOTightGreen} ml={0.5}>
                -3%
              </Text>
            </Box>
          </Box>
        </Box>
        <Box className={classes.shareBox} mt={3}>
          <Box className={classes.shareItemBox1}>
            <Text
              mb={2}
              size={FontSize.L}
              style={{ fontWeight: 600, opacity: 0.9 }}
              color={Color.MusicDAODark}
            >
              How many shares?
            </Text>
            <InputWithLabelAndTooltip
              type="text"
              overriedClasses={classes.shareInput}
              inputValue={shares}
              onInputValueChange={(e) => setShares(e.target.value)}
            />
            <Box mt={2} display="flex" alignItems="center">
              <Box className={classes.availableBox}>
                Available balance: <span>MusicUSD</span>
              </Box>
            </Box>
          </Box>
          <Box className={classes.shareItemBox2}>
            <Text
              mb={2}
              size={FontSize.L}
              color={Color.MusicDAOGreen}
              style={{ fontWeight: 600, opacity: 0.9 }}
            >
              Total cost
            </Text>
            <InputWithLabelAndTooltip
              type="text"
              overriedClasses={classes.costInput}
              inputValue={totalCost}
              onInputValueChange={(e) => setTotalCost(e.target.value)}
            />
            <Box mt={2} display="flex" alignItems="center">
              <Box className={classes.availableBox}>
                Fees: <span>0.000521 USDp</span>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box display="flex" flexDirection="column" mt={3}>
          <Text
            mb={2}
            size={FontSize.L}
            color={Color.MusicDAODark}
            style={{ fontWeight: 600, opacity: 0.9 }}
          >
            Choose Blockchain Network
          </Text>
          <Select
            value={network}
            className={commonClasses.outlineSelect}
            onChange={onChangeNetwork}
          >
            {BlockchainNets.map((item, index) => (
              <MenuItem value={item.value} key={index}>
                <Box display="flex" flexDirection="row" alignItems="center">
                  <img
                    src={require(`assets/${item.image}`)}
                    alt="choose a network"
                    height={30}
                  />
                  <Text color={Color.MusicDAOLightBlue} bold ml={2}>
                    {item.value}
                  </Text>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </Box>
        <Box display="flex" flexDirection="row" justifyContent="center" mt={5}>
          <PrimaryButton
            size="medium"
            className={commonClasses.primaryButton}
            isRounded
            style={{ paddingLeft: '48px', paddingRight: '48px' }}
            onClick={onPurchase}
          >
            Confirm Purchase
          </PrimaryButton>
        </Box>
      </Box>
    </Modal>
  );
};

export default BuyShareModal;
