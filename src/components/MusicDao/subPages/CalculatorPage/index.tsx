import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Grid from '@material-ui/core/Grid';

import Box from 'shared/ui-kit/Box';
import {
  ArrowIcon,
  GradientArrowIcon,
  ShortArrowIcon,
  GradientMobileArrowIcon,
  GradientTabletArrowIcon
} from 'components/MusicDao/components/Icons/SvgIcons';
import StakeCard from 'components/MusicDao/components/Cards/StakeCard';
import HistoryCard from 'components/MusicDao/components/Cards/HistoryCard';
import UnstakingModal from 'components/MusicDao/modals/UnstakingModal';
import InputWithLabelAndTooltip from 'shared/ui-kit/InputWithLabelAndTooltip';
import { TokenSelect } from 'shared/ui-kit/Select/TokenSelect';
import URL from 'shared/functions/getURL';
import { BlockchainTokenSelect } from 'shared/ui-kit/Select/BlockchainTokenSelect';
import { BlockchainNets } from 'shared/constants/constants';
import { Gradient, PrimaryButton } from 'shared/ui-kit';
import { InfoIcon } from 'shared/ui-kit/Icons';
import * as ApiProvider from 'shared/services/API/MusicDaoAPI';
import { useTypedSelector } from 'store/reducers/Reducer';
import { useAlertMessage } from 'shared/hooks/useAlertMessage';
import { getMusicWallet } from 'shared/helpers/wallet';
import { IMediaStaking } from 'shared/types/Stake';
import { LoadingWrapper } from 'shared/ui-kit/Hocs/LoadingWrapper';
import { calculatorPagePageStyles } from './index.styles';

export default function CalculatorPage() {
  const classes = calculatorPagePageStyles();
  const history = useHistory();
  const user = useTypedSelector((state) => state.user) as any;
  const { showAlertMessage } = useAlertMessage();

  const [tokenObjs, setTokenObjs] = useState<any[]>([
    { token: 'ETH', name: 'Ethereum' },
    { token: 'MUSIC', name: 'Music Coin' },
    { token: 'BC', name: 'Base Coin' },
    { token: 'DC', name: 'Data Coin' }
  ]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [loading, setLoading] = useState<boolean>(false);
  const [availableFundingBalance, setAvailableFundingBalance] =
    useState<number>(4544);
  const [fundingQuantity, setFundingQuantity] = useState<number>(0);
  const [fundingToken, setFundingToken] = useState<string>('USDT');
  const [blockChain, setBlockChain] = useState<any>(BlockchainNets[0].name);
  const [unStakeHistory, setUnStackHistory] = useState<any>();
  const [selectedStake, setSelectedStake] = useState<IMediaStaking>();
  const [openUnstakingModal, setOpenUnstakingModal] = useState<boolean>(false);
  const [stakings, setStakings] = useState<Array<IMediaStaking>>([]);
  const [showActiveAll, setShowActiveAll] = useState<boolean>(false);
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

    fetchStakings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchStakings = async () => {
    try {
      setLoading(true);
      const { error, address } = await getMusicWallet();
      if (error) {
        throw new Error(error);
      }
      const res = await ApiProvider.getMediaStakingsOfAddress(address);
      setStakings(res);
      setLoading(false);
    } catch (e) {
      showAlertMessage(e.message || 'Fetching staking list error', {
        variant: 'error'
      });
      setLoading(false);
    }
  };

  const unStake = (card) => {
    setUnStackHistory(card);
    setOpenUnstakingModal(true);
  };

  const handleClickStake = async () => {
    try {
      const { error, address } = await getMusicWallet();
      if (error) {
        showAlertMessage('Reactivate your music wallet!');
        return;
      }
      const payload: ApiProvider.IStakeMediaFunds = {
        Address: address,
        Amount: fundingQuantity.toLocaleString(),
        TokenSymbol: 'USDT',
        RewardToken: 'TRAX_REWARD'
      };
      await ApiProvider.stakeMediaFunds(payload, {});
      showAlertMessage('You fund has been successfully staked!', {
        variant: 'success'
      });
      fetchStakings();
    } catch (e) {
      showAlertMessage('Error while staking!', { variant: 'error' });
      console.log(e.message);
    }
  };

  const handleClickUnstake = (stake: IMediaStaking) => {
    setSelectedStake(stake);
    setOpenUnstakingModal(true);
  };

  return (
    <div className={classes.body}>
      <div className={classes.content}>
        <Box
          className={classes.flexBox}
          style={{ cursor: 'pointer' }}
          onClick={() => history.goBack()}
        >
          <Box color="#FFFFFF">
            <ArrowIcon />
          </Box>
          <Box color="#FFFFFF" fontSize={14} fontWeight={700} ml="5px" mb="4px">
            BACK
          </Box>
        </Box>
        <Box className={classes.whiteBox}>
          <div className={classes.headerTitle}>Calculate your stake</div>
          <div className={classes.header1}>
            Enjoy your rewards by staking stablecoins.
          </div>
          <div className={classes.stackBox}>
            <Box width={1}>
              <Box className={classes.header3}>I have</Box>
              <Box className={classes.flexBox} width={1}>
                <Box className={classes.balanceBorderBox} width={1}>
                  <Box className={classes.flexBox}>
                    <InputWithLabelAndTooltip
                      overriedClasses=""
                      type="euro-number"
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
                      inputValue={fundingQuantity.toString()}
                      onInputValueChange={setFundingQuantity}
                    />
                    <Box
                      className={classes.header4_1}
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
                      // setFundingToken(e.target.value);
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
                className={classes.header4_2}
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
              <Box className={classes.header3}>I will get</Box>
              <Box className={classes.noBorderBox}>
                <Box
                  className={classes.flexBox}
                  style={{ borderBottom: '1px solid #00000022' }}
                  pb={1}
                  pt={1}
                >
                  <Box className={classes.colorText}>224</Box>
                  <Box className={classes.header2} ml={1}>
                    fruits
                  </Box>
                </Box>
                <Box display="flex" flexDirection="column" pt={1}>
                  <Box className={classes.colorText}>
                    {`>5% apr `}
                    <span>in</span>
                  </Box>
                  <Box className={classes.header2}>mining rewards</Box>
                </Box>
              </Box>
            </Box>
          </div>
          <Box width={1} className={classes.stakeButtonBox}>
            <PrimaryButton
              size="medium"
              onClick={handleClickStake}
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
            <Box className={classes.header4} mt={'13px'}>
              The current minimum staking period is 30 days.
              <InfoIcon />
            </Box>
          </Box>
        </Box>
        <div className={classes.stakingDetailSection}>
          <div className={classes.headerTitle}>Staking Details</div>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            mt={'37px'}
            width={isMobile ? 1 : 0.5}
          >
            <Box display="flex" flexDirection="column">
              <div className={classes.stakingValue}>
                85,732 <span>TRAX</span>
              </div>
              <div className={classes.stakingTitle}>Amount staked</div>
            </Box>
            <Box display="flex" flexDirection="column">
              <div className={classes.stakingValue}>224</div>
              <div className={classes.stakingTitle}>fruits left</div>
            </Box>
            <Box display="flex" flexDirection="column">
              <div className={classes.stakingValue}>
                5<span>%</span>
              </div>
              <div className={classes.stakingTitle}>APR</div>
            </Box>
          </Box>
        </div>
        <div className={classes.stakingHistorySection}>
          <Box fontSize={34} className={classes.headerTitle}>
            Staking history
          </Box>
          <Box
            className={classes.flexBox}
            mt={4}
            justifyContent="space-between"
          >
            <div className={classes.header5}>Active</div>
            <Box
              className={classes.secondButtonBox}
              onClick={() => history.push('/data/governance/discussions/')}
            >
              <Box className={classes.header4} color="#2D3047">
                {showActiveAll ? 'Show Less' : 'Show All'}
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
          {stakings && stakings.length > 0 ? (
            <LoadingWrapper loading={loading}>
              <Grid container spacing={4}>
                {stakings
                  .slice(0, showActiveAll ? undefined : 4)
                  .map((activeItem, index) => (
                    <Grid xs={3} item key={`active-history-${index}`}>
                      <StakeCard
                        item={activeItem}
                        handleClickUnstake={handleClickUnstake}
                      />
                    </Grid>
                  ))}
              </Grid>
            </LoadingWrapper>
          ) : (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              color="#404658"
              py={2}
            >
              No Active cards available
            </Box>
          )}

          <Box
            className={classes.flexBox}
            mt={15}
            justifyContent="space-between"
          >
            <div className={classes.header5}>Expired</div>
            <Box
              className={classes.secondButtonBox}
              onClick={() => history.push('/data/governance/discussions/')}
            >
              <Box className={classes.header4} color="#2D3047">
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
          {activeHistories && activeHistories.length > 0 ? (
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
          ) : (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              color="#404658"
              py={2}
            >
              No Expired cards available
            </Box>
          )}

          <Box
            className={classes.flexBox}
            mt={15}
            justifyContent="space-between"
          >
            <div className={classes.header5}>Repaid</div>
            <Box
              className={classes.secondButtonBox}
              onClick={() => history.push('/data/governance/discussions/')}
            >
              <Box className={classes.header4} color="#2D3047">
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
          {activeHistories && activeHistories.length > 0 ? (
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
          ) : (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              color="#404658"
              py={2}
            >
              No Repaid cards available
            </Box>
          )}
        </div>
        {openUnstakingModal && (
          <UnstakingModal
            stake={selectedStake}
            open={openUnstakingModal}
            handleClose={() => setOpenUnstakingModal(false)}
            unStake={() => {}}
            isStaking
          />
        )}
      </div>
    </div>
  );
}
