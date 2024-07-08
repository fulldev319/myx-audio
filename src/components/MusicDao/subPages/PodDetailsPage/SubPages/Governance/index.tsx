import React, { useState, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import useTheme from '@material-ui/core/styles/useTheme';

import PodStakingModal from 'components/MusicDao/modals/PodStakingModal';
import UnstakeRedeemModal from 'components/MusicDao/modals/UnstakeRedeemModal';
import Proposals from '../Proposals';

import Box from 'shared/ui-kit/Box';
import { MasonryGrid } from 'shared/ui-kit/MasonryGrid/MasonryGrid';
import {
  musicDaoGetPodListings,
  musicDaoGetStaking
} from 'shared/services/API';
import { Gradient, PrimaryButton, SecondaryButton } from 'shared/ui-kit';
import { numberWithCommas } from 'shared/helpers/number';
import { formatDateDefault } from 'shared/helpers';

import { useStyles } from './index.styles';
import { musicDaoPageStyles } from 'components/MusicDao/index.styles';
import NFTCard from './NFTCard';

import { roundFloat } from 'shared/helpers/number';
import { toDecimals } from 'shared/functions/web3';

type NFTType = {
  imgUrl: string;
  songName: string;
  collectionName: string;
  price: number;
  priceUnity: string;
  userAvatar: string;
  chainIcon: string;
  status: string;
  statusImg: string;
  genre: string;
  opt: string;
  creatorUrlSlug: string;
};

const Governance = ({ pod, podInfo, stakings, handleRefresh }) => {
  const history = useHistory();
  const classes = useStyles();
  const commonClasses = musicDaoPageStyles();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  const [currentStaking, setCurrentStaking] = useState<any>();

  const [openStakingModal, setOpenStakingModal] = useState<boolean>(false);
  const [openUnstakeRedeemModal, setOpenUnstakeRedeemModal] = useState<
    'unstake' | 'redeem' | boolean
  >(false);

  const [showMore, setShowMore] = useState<boolean>(true);

  const [nfts, setNfts] = useState<NFTType[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // load nfts on sale
    const resp = await musicDaoGetPodListings(pod.Id);
    if (resp?.success && resp.data && resp.data.length) {
      const parsedData = resp.data.map((item) => ({
        metadataPhoto: item.media.metadataPhoto,
        Title: item.media.Title,
        collectionName: item.media.AlbumName,
        genre: item.media.Genre,
        price: +toDecimals(item.Price, 6),
        priceUnity: item.PaymentToken,
        userAvatar: item.proposerInfo.imageUrl,
        chainIcon: require('assets/chainImages/eth.webp'),
        statusImg: require('assets/chainImages/WAX.webp'),
        status: 'listed',
        opt: 'open on MYX',
        creatorUrlSlug: item.proposerInfo.urlSlug,
        nftAddress: item.media.nftAddress
      }));
      setNfts(parsedData);
    }
  };

  const myTotalStaking = useMemo(() => {
    return stakings.reduce(
      (value, current) => value + Number(current.amount),
      0
    );
  }, [stakings]);

  const filteredStakings = useMemo(
    () => (showMore ? stakings.filter((_, index) => index < 3) : stakings),
    [showMore, stakings]
  );

  return (
    <div className={classes.content}>
      <div className={classes.stakeSection}>
        <Box className={classes.title}>Staking</Box>
        <Box display="flex" mt={3}>
          <Box display="flex" flexDirection="column">
            <Box className={classes.typo1}>Total Staked</Box>
            <Box className={classes.typo2} mt={0.5}>
              {roundFloat(Number(pod.totalStaked ?? ''), 4)}
            </Box>
            <Box className={classes.typo3}>{pod.TokenSymbol}</Box>
          </Box>
          <Box
            mx={isMobile ? '30px' : '118px'}
            height={'54.6px'}
            width={'1px'}
            bgcolor="rgba(84, 101, 143, 0.3)"
          ></Box>
          <Box display="flex" flexDirection="column">
            <Box className={classes.typo1}>Revenue from Streaming</Box>
            <Box className={classes.typo4} mt={0.5}>
              {/* ${numberWithCommas(pod.totalReward || 0)} */} $0
            </Box>
          </Box>
          <Box
            mx={isMobile ? '30px' : '118px'}
            height={'54.6px'}
            width={'1px'}
            bgcolor="rgba(84, 101, 143, 0.3)"
          ></Box>
          <Box display="flex" flexDirection="column">
            <Box className={classes.typo1}>Revenue from Sales</Box>
            <Box className={classes.typo4} mt={0.5}>
              {/* ${numberWithCommas(pod.totalReward || 0)} */} $0
            </Box>
          </Box>
        </Box>
        <div className={classes.stakingDetailSection}>
          <Box className={classes.flexBox} justifyContent="space-between">
            <Box display="flex" flexDirection="column">
              <div className={classes.typo5}>
                {myTotalStaking} <span>{pod.TokenSymbol}</span>
              </div>
              <Box className={classes.typo6} mt={0.5}>
                My total stake
              </Box>
            </Box>
            <Box display="flex" alignItems="center">
              {!isMobile && (
                <Box
                  className={classes.typo7}
                  maxWidth={420}
                  textAlign="end"
                  mr={'21px'}
                >
                  {/* Staking Media Fractions gives you access to revenue generated from the track as its
                  streamed, and voting power on governance issues over the Track NFTs, for example how much to
                  sell it for. You can stake either Media Fractions or Track NFTs you own. */}
                  Staking Media Fractions gives you revenue generated from the
                  song and voting power on governance over song NFTs
                </Box>
              )}
              <PrimaryButton
                size="small"
                onClick={() => setOpenStakingModal(true)}
                style={{
                  background: Gradient.Green1,
                  padding: isMobile ? '10px 25px' : '17px 46px',
                  borderRadius: '35px',

                  fontWeight: 600,
                  fontSize: isMobile ? 14 : 16,
                  lineHeight: '16px',
                  height: 'auto'
                }}
                isRounded
              >
                {/* Add Stake */}
                Stake
              </PrimaryButton>
            </Box>
          </Box>
          {isMobile && (
            <Box className={classes.typo7} width={1} mt={2}>
              {/* Staking Media Fractions gives you access to revenue generated from the track as its streamed,
              and voting power on governance issues over the Track NFTs, for example how much to sell it for.
              You can stake either Media Fractions or Track NFTs you own. */}
              Staking Media Fractions gives you revenue generated from the song
              and voting power on governance over song NFTs
            </Box>
          )}
          {filteredStakings.map((staking) => (
            <div className={classes.stakingActionSection}>
              {isMobile ? (
                <>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Box display="flex" flexDirection="column">
                      <div className={classes.typo5}>
                        {staking.amount} <span>{pod.TokenSymbol}</span>
                      </div>
                      <Box className={classes.typo6} mt={0.5}>
                        My Stake
                      </Box>
                    </Box>
                    <Box display="flex" flexDirection="column">
                      <div className={classes.typo5}>
                        {staking.rewardsAccumulated || 0}{' '}
                        <span>{pod.FundingToken}</span>
                      </div>
                      <Box className={classes.typo6} mt={0.5}>
                        Rewards accumulated
                      </Box>
                    </Box>
                    <Box display="flex" flexDirection="column">
                      <div className={classes.typo8}>
                        {formatDateDefault(staking.timestamp)}
                      </div>
                      <Box className={classes.typo6} mt={0.5}>
                        Date
                      </Box>
                    </Box>
                  </Box>
                  <Box className={classes.flexBox} mt={2}>
                    <PrimaryButton
                      size="small"
                      onClick={() => {
                        setCurrentStaking(staking);
                        setOpenUnstakeRedeemModal('unstake');
                      }}
                      style={{
                        background: '#2D3047',
                        padding: '9px 19px',
                        borderRadius: '29px',

                        fontWeight: 600,
                        fontSize: 12,
                        height: 'auto',
                        lineHeight: '19.5px'
                      }}
                      isRounded
                    >
                      Unstake
                    </PrimaryButton>
                    <SecondaryButton
                      size="small"
                      onClick={() => {
                        setCurrentStaking(staking);
                        setOpenUnstakeRedeemModal('redeem');
                      }}
                      style={{
                        border: '1px solid #2D3047',
                        padding: '9px 19px',
                        borderRadius: '29px',

                        fontWeight: 600,
                        fontSize: 12,
                        height: 'auto',
                        lineHeight: '19.5px',
                        color: '#2D3047'
                      }}
                      isRounded
                    >
                      Redeem
                    </SecondaryButton>
                  </Box>
                </>
              ) : (
                <>
                  <Box display="flex" flexDirection="column">
                    <div className={classes.typo5}>
                      {staking.amount} <span>{pod.TokenSymbol}</span>
                    </div>
                    <Box className={classes.typo6} mt={0.5}>
                      My Stake
                    </Box>
                  </Box>
                  <Box display="flex" flexDirection="column">
                    <div className={classes.typo5}>
                      {staking.rewardsAccumulated || 0}{' '}
                      <span>{pod.FundingToken}</span>
                    </div>
                    <Box className={classes.typo6} mt={0.5}>
                      Rewards accumulated
                    </Box>
                  </Box>
                  <Box display="flex" flexDirection="column">
                    <div className={classes.typo8}>
                      {formatDateDefault(staking.timestamp)}
                    </div>
                    <Box className={classes.typo6} mt={0.5}>
                      Date
                    </Box>
                  </Box>
                  <Box className={classes.flexBox}>
                    <PrimaryButton
                      size="small"
                      onClick={() => {
                        setCurrentStaking(staking);
                        setOpenUnstakeRedeemModal('unstake');
                      }}
                      style={{
                        background: '#2D3047',
                        padding: '9px 19px',
                        borderRadius: '29px',

                        fontWeight: 600,
                        fontSize: '16px',
                        height: '38px',
                        lineHeight: '19.5px'
                      }}
                      isRounded
                    >
                      Unstake
                    </PrimaryButton>
                    <SecondaryButton
                      size="small"
                      onClick={() => {
                        setCurrentStaking(staking);
                        setOpenUnstakeRedeemModal('redeem');
                      }}
                      style={{
                        border: '1px solid #2D3047',
                        padding: '9px 19px',
                        borderRadius: '29px',

                        fontWeight: 600,
                        fontSize: '16px',
                        height: '38px',
                        lineHeight: '19.5px',
                        color: '#2D3047'
                      }}
                      isRounded
                    >
                      Redeem
                    </SecondaryButton>
                  </Box>
                </>
              )}
            </div>
          ))}
          {stakings.length > 3 && (
            <Box
              className={classes.stakeShowMoreSection}
              onClick={() => setShowMore(!showMore)}
            >
              <Box className={classes.typo8} mr={1}>
                {showMore ? 'Show more positions' : 'Show less positions'}
              </Box>
              {showMore ? <DownArrowIcon /> : <UpArrowIcon />}
            </Box>
          )}
        </div>
      </div>
      <div className={classes.nftSection}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box className={classes.title}>NFTs on Sale</Box>
          <SecondaryButton
            className={commonClasses.showAll}
            size="medium"
            radius={29}
            onClick={() => history.push('/music')}
            style={isMobile ? { display: 'flex' } : {}}
          >
            Show All
            <Box
              position="absolute"
              flexDirection="row"
              top={0}
              right={0}
              pr={2}
            >
              <ArrowLeftIcon />
            </Box>
          </SecondaryButton>
        </Box>
        <Box mt={3}>
          <MasonryGrid
            gutter={'24px'}
            data={nfts}
            renderItem={(item, _) => (
              <NFTCard
                song={item}
                isLoading={Object.entries(item).length === 0}
              />
            )}
            columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS}
          />
        </Box>
      </div>
      <div className={classes.proposalSection}>
        <Proposals
          pod={pod}
          podInfo={podInfo}
          handleRefresh={handleRefresh}
          totalStaked={myTotalStaking}
        />
      </div>
      <PodStakingModal
        open={openStakingModal}
        onClose={() => setOpenStakingModal(false)}
        handleRefresh={() => {
          handleRefresh();
          loadData();
        }}
        pod={pod}
        podInfo={podInfo}
        stakings={stakings}
      />
      <UnstakeRedeemModal
        open={openUnstakeRedeemModal !== false}
        type={openUnstakeRedeemModal}
        staking={currentStaking}
        pod={pod}
        podInfo={podInfo}
        onClose={() => setOpenUnstakeRedeemModal(false)}
        handleRefresh={() => {
          handleRefresh();
          loadData();
        }}
      />
    </div>
  );
};

export default Governance;

const UpArrowIcon = () => (
  <svg
    width="8"
    height="5"
    viewBox="0 0 8 5"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7 4L4 1L1 4"
      stroke="#77788E"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DownArrowIcon = () => (
  <svg
    width="8"
    height="6"
    viewBox="0 0 8 6"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1 1.60547L4 4.60547L7 1.60547"
      stroke="#77788E"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
    <path
      d="M8.40262 10.9386C8.59347 10.9386 8.76423 10.8658 8.9149 10.7201L13.6384 6.00419C13.7941 5.85854 13.8719 5.68025 13.8719 5.46931C13.8719 5.26339 13.7941 5.0851 13.6384 4.93443L8.9375 0.241071C8.85212 0.155692 8.76549 0.0941685 8.6776 0.0565011C8.5897 0.0188337 8.49805 0 8.40262 0C8.20173 0 8.03348 0.0652902 7.89788 0.195871C7.76228 0.326451 7.69448 0.492188 7.69448 0.69308C7.69448 0.793527 7.71205 0.887695 7.74721 0.975586C7.78237 1.06348 7.83259 1.14007 7.89788 1.20536L9.50251 2.83259L11.7139 4.8545L10.0374 4.75363L1.22321 4.75363C1.01228 4.75363 0.839007 4.82017 0.703404 4.95326C0.567801 5.08636 0.5 5.25837 0.5 5.46931C0.5 5.68527 0.567801 5.85979 0.703404 5.99289C0.839007 6.12598 1.01228 6.19252 1.22321 6.19252L10.0374 6.19252L11.7203 6.09264L9.50251 8.11356L7.89788 9.74079C7.83259 9.80608 7.78237 9.88267 7.74721 9.97056C7.71205 10.0585 7.69448 10.1526 7.69448 10.2531C7.69448 10.4489 7.76228 10.6122 7.89788 10.7427C8.03348 10.8733 8.20173 10.9386 8.40262 10.9386Z"
      fill="#2D3047"
    />
  </svg>
);

const COLUMNS_COUNT_BREAK_POINTS = {
  400: 1,
  700: 2,
  1000: 3,
  1440: 4
};
