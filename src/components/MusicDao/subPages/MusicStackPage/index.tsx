import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

import Hidden from '@material-ui/core/Hidden';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import useTheme from '@material-ui/core/styles/useTheme';

import {
  ArrowIcon,
  GradientArrowIcon,
  ShortArrowIcon,
  GradientMobileArrowIcon,
  GradientTabletArrowIcon
} from 'components/MusicDao/components/Icons/SvgIcons';
import { Text } from 'components/MusicDao/components/ui-kit';
import HistoryCard from 'components/MusicDao/components/Cards/HistoryCard';
import UnstakeModal from 'components/MusicDao/modals/UnstakeModal';
import InputWithLabelAndTooltip from 'shared/ui-kit/InputWithLabelAndTooltip';
import { TokenSelect } from 'shared/ui-kit/Select/TokenSelect';
import URL from 'shared/functions/getURL';
import { BlockchainTokenSelect } from 'shared/ui-kit/Select/BlockchainTokenSelect';
import { BlockchainNets } from 'shared/constants/constants';
import { Color, Gradient, PrimaryButton } from 'shared/ui-kit';
import Box from 'shared/ui-kit/Box';
import { musicStackPageStyles } from './index.styles';
import { InfoIcon } from 'shared/ui-kit/Icons';

export default function MusicStackPage() {
  const classes = musicStackPageStyles();

  const history = useHistory();

  const [tokenObjs, setTokenObjs] = useState<any[]>([
    { token: 'ETH', name: 'Ethereum' },
    { token: 'MUSIC', name: 'Music Coin' },
    { token: 'BC', name: 'Base Coin' },
    { token: 'DC', name: 'Data Coin' }
  ]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const isTablet = useMediaQuery(theme.breakpoints.down('sm'));

  const [availableFundingBalance, setAvailableFundingBalance] =
    useState<number>(4544);
  const [fundingQuantity, setFundingQuantity] = useState<number>(0);
  const [fundingToken, setFundingToken] = useState<string>(tokenObjs[0].token);

  const [blockChain, setBlockChain] = useState<any>(BlockchainNets[0].name);
  const [unStakeHistory, setUnStackHistory] = useState<any>();
  const [openUnstakeModal, setOpenUnstakeModal] = useState<boolean>(false);

  const [activeHistories, setActiveHistories] = useState([
    {
      date: Date.now(),
      tokenName: 'BNB',
      endTime: new Date().getTime(),
      amount: 1324
    },
    {
      date: Date.now(),
      tokenName: 'BNB',
      endTime: new Date().getTime(),
      amount: 1324
    },
    {
      date: Date.now(),
      tokenName: 'BNB',
      endTime: new Date().getTime(),
      amount: 1324
    }
  ]);

  React.useEffect(() => {
    axios.get(`${URL()}/wallet/getCryptosRateAsList`).then((res) => {
      const resp = res.data;
      if (resp.success) {
        const tokenObjList: any[] = [];
        const data = resp.data;
        data.forEach((rateObj) => {
          tokenObjList.push({ token: rateObj.token, name: rateObj.name });
        });
        setTokenObjs(tokenObjList);
      } else {
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // // used to get user funding token balance
  // const loadUserBalance = async isFunding => {
  //   const body = {
  //     userAddress: user.address,
  //     token: fundingToken,
  //   };
  //   axios.post(`${URL()}/wallet/balanceOf`, body).then(res => {
  //     const resp = res.data;
  //     if (resp.success) {
  //       setAvailableFundingBalance(resp.data.toFixed(4));
  //     }
  //   });
  // };

  const unStake = (card) => {
    setUnStackHistory(card);
    setOpenUnstakeModal(true);
  };

  return (
    <Box className={classes.content}>
      <img
        src={require('assets/musicDAOImages/background.webp')}
        className={classes.gradient}
      />
      <Box
        className={classes.flexBox}
        style={{ cursor: 'pointer' }}
        onClick={() => history.goBack()}
        zIndex={1}
      >
        <Box color="#FFFFFF">
          <ArrowIcon />
        </Box>
        <Box color="#FFFFFF" fontSize={14} fontWeight={700} ml="5px" mb="4px">
          BACK
        </Box>
      </Box>
      <Box className={classes.whiteBox}>
        <Box className={classes.headerTitle}>Calculate your stake</Box>
        <Box className={classes.header1}>
          Enjoy endless hours of content by staking stablecoins.
        </Box>
        <Box className={classes.stackBox} width={1}>
          <Box mr={isTablet ? 1 : 3} width={1}>
            <Box className={classes.header3} mb={2} ml={1}>
              I have
            </Box>
            <Box className={classes.flexBox} width={1}>
              <Box className={classes.balanceBorderBox} width={1}>
                <Box className={classes.flexBox}>
                  <InputWithLabelAndTooltip
                    type="text"
                    overriedClasses=""
                    style={{
                      border: 'none',
                      background: 'transparent',
                      margin: 0,
                      paddingLeft: 0,
                      paddingRight: 0,
                      minWidth: '48px',
                      fontSize: 18,
                      fontWeight: 500,
                      color: '#2D3047'
                    }}
                    inputValue={fundingQuantity}
                    onInputValueChange={(e) =>
                      setFundingQuantity(e.target.value)
                    }
                  />
                  <Box
                    className={classes.header4_2}
                    ml={2}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    Use Max
                  </Box>
                </Box>
              </Box>
              <Box className={classes.tokenBorderBox} ml={isMobile ? 1 : 2}>
                <TokenSelect
                  tokens={tokenObjs}
                  value={fundingToken}
                  onChange={(e) => {
                    setFundingToken(e.target.value);
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    padding: isMobile ? 0 : 'unset',
                    paddingLeft: isMobile ? 0 : 'unset',
                    color: '#181818',
                    fontSize: isMobile || isTablet ? 13 : 15,
                    fontWeight: 600
                  }}
                />
              </Box>
            </Box>
            <Box
              className={classes.header4_1}
              ml={1}
              mt={1}
            >{`Balance: ${availableFundingBalance} ${fundingToken}`}</Box>
            <Box
              mt={2}
              className={classes.borderBox}
              style={{ background: 'transparent' }}
            >
              <BlockchainTokenSelect
                network={blockChain}
                setNetwork={setBlockChain}
                BlockchainNets={BlockchainNets}
                // style={{
                //   fontSize: 14,
                //   fontWeight: 600,
                //   color: "#181818",
                // }}
              />
            </Box>
          </Box>
          <Box className={classes.arrowBox}>
            {isMobile ? (
              <GradientMobileArrowIcon />
            ) : isTablet ? (
              <GradientTabletArrowIcon />
            ) : (
              <GradientArrowIcon />
            )}
          </Box>
          <Box width={1}>
            <Box className={classes.header3} mb={2} ml={isMobile ? 1 : 3}>
              I will get
            </Box>
            <Box className={classes.noBorderBox}>
              <Box
                className={classes.flexBox}
                style={{ borderBottom: '1px solid #00000022' }}
                pb={1}
              >
                <Box className={classes.colorText}>890 hrs.</Box>
                <Box className={classes.header2} ml={'4px'}>
                  of free content
                </Box>
              </Box>
              <Box className={classes.flexBox} pt={1}>
                <Box className={classes.colorText}>120 day</Box>
                <Box className={classes.header2} ml={'4px'}>
                  to repay
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box width={1} className={classes.stakeButtonBox}>
          <PrimaryButton
            size="medium"
            onClick={() => {}}
            style={{
              background: Gradient.Green1,
              height: 54,
              paddingLeft: isMobile ? '95px' : '105px',
              paddingRight: isMobile ? '95px' : '105px',
              width: isMobile ? '100%' : 'unset'
            }}
            isRounded
          >
            Stake Now
          </PrimaryButton>
          <Box className={classes.header4} mt="13px">
            The current minimum staking period is 30 days.
            <InfoIcon />
          </Box>
        </Box>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        mt={11}
        zIndex={1}
        pb={2}
        borderBottom="1px solid #00000022"
      >
        <div className={classes.header1_1}>Staking Details</div>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          mt={5}
          pr={isMobile ? 9 : 0}
        >
          <Box display="flex" flexDirection="column">
            <Text className={classes.stakingValue}>
              8,5732 <span>Music</span>
            </Text>
            <Text className={classes.stakingTitle} color={Color.MusicDAOGreen}>
              Amount staked
            </Text>
          </Box>
          <Box display="flex" flexDirection="column">
            <Text className={classes.stakingValue}>
              7,923 <span>Music</span>
            </Text>
            <Text className={classes.stakingTitle} color={Color.MusicDAOGreen}>
              Debt repaid
            </Text>
          </Box>
          <Hidden only="xs">
            <Box display="flex" flexDirection="column">
              <Text className={classes.stakingValue}>
                49,983 <span>hrs</span>
              </Text>
              <Text
                className={classes.stakingTitle}
                color={Color.MusicDAOGreen}
              >
                Free music left
              </Text>
            </Box>
            <Box display="flex" flexDirection="column">
              <Text className={classes.stakingValue}>
                12<span>h</span> 38<span>m</span> 19<span>s</span>
              </Text>
              <Text
                className={classes.stakingTitle}
                color={Color.MusicDAOGreen}
              >
                Time left to consume
              </Text>
            </Box>
          </Hidden>
        </Box>
        <Hidden smUp>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            mt={6}
          >
            <Box display="flex" flexDirection="column">
              <Text className={classes.stakingValue}>
                49,983 <span>hrs</span>
              </Text>
              <Text
                className={classes.stakingTitle}
                color={Color.MusicDAOGreen}
              >
                Free music left
              </Text>
            </Box>
            <Box display="flex" flexDirection="column">
              <Text className={classes.stakingValue}>
                12<span>h</span> 38<span>m</span> 19<span>s</span>
              </Text>
              <Text
                className={classes.stakingTitle}
                color={Color.MusicDAOGreen}
              >
                Time left to consume
              </Text>
            </Box>
          </Box>
        </Hidden>
      </Box>
      <Box display="flex" flexDirection="column" mt={11} zIndex={1}>
        <div className={classes.header1_2}>Staking history</div>
        <Box className={classes.flexBox} mt={4} justifyContent="space-between">
          <div className={classes.stakingHistoryTitle}>Active</div>
          <Box
            className={classes.secondButtonBox}
            onClick={() => history.push('/data/governance/discussions/')}
          >
            <Box className={classes.header4_3} color="#2D3047">
              Show All
            </Box>
            <Box
              style={{ transform: `rotate(90deg)` }}
              className={classes.flexBox}
              ml={3}
            >
              <ShortArrowIcon color="#2D3047" />
            </Box>
          </Box>
        </Box>
        <Box className={classes.flexBox} mt={2}>
          {activeHistories
            .filter((_, index) =>
              isMobile ? index < 1 : isTablet ? index < 2 : true
            )
            .map((activeItem, index) => (
              <Box
                key={`active-history-${index}`}
                ml={index > 0 ? 2 : 0}
                width={1}
              >
                <HistoryCard
                  item={activeItem}
                  unStake={unStake}
                  isActiveCard={true}
                />
              </Box>
            ))}
        </Box>
        <Box className={classes.flexBox} mt={4} justifyContent="space-between">
          <div className={classes.stakingHistoryTitle}>Expired</div>
          <Box
            className={classes.secondButtonBox}
            onClick={() => history.push('/data/governance/discussions/')}
          >
            <Box className={classes.header4_3} color="#2D3047">
              Show All
            </Box>
            <Box
              style={{ transform: `rotate(90deg)` }}
              className={classes.flexBox}
              ml={3}
            >
              <ShortArrowIcon color="#2D3047" />
            </Box>
          </Box>
        </Box>
        <Box className={classes.flexBox} mt={2}>
          {activeHistories
            .filter((_, index) =>
              isMobile ? index < 1 : isTablet ? index < 2 : true
            )
            .map((activeItem, index) => (
              <Box
                key={`expired-history-${index}`}
                ml={index > 0 ? 2 : 0}
                width={1}
              >
                <HistoryCard
                  item={activeItem}
                  unStake={unStake}
                  isActiveCard={false}
                />
              </Box>
            ))}
        </Box>
        <Box className={classes.flexBox} mt={4} justifyContent="space-between">
          <div className={classes.stakingRepaidTitle}>Repaid</div>
          <Box
            className={classes.secondButtonBox}
            onClick={() => history.push('/data/governance/discussions/')}
          >
            <Box className={classes.header4_3} color="#2D3047">
              Show All
            </Box>
            <Box
              style={{ transform: `rotate(90deg)` }}
              className={classes.flexBox}
              ml={3}
            >
              <ShortArrowIcon color="#2D3047" />
            </Box>
          </Box>
        </Box>
        <Box className={classes.flexBox} mt={2}>
          {activeHistories
            .filter((_, index) =>
              isMobile ? index < 1 : isTablet ? index < 2 : true
            )
            .map((activeItem, index) => (
              <Box
                key={`repaid-history-${index}`}
                ml={index > 0 ? 2 : 0}
                width={1}
              >
                <HistoryCard
                  item={activeItem}
                  unStake={unStake}
                  isActiveCard={false}
                  isRepaid
                />
              </Box>
            ))}
        </Box>
      </Box>
      {openUnstakeModal && (
        <UnstakeModal
          open={openUnstakeModal}
          handleClose={() => setOpenUnstakeModal(false)}
          unStake={() => {}}
        />
      )}
    </Box>
  );
}
