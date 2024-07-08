import React, { useState, useMemo, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import styled from 'styled-components';
import axios from 'axios';
import { useWeb3React } from '@web3-react/core';
import Web3 from 'web3';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import useTheme from '@material-ui/core/styles/useTheme';

import Box from 'shared/ui-kit/Box';
import { CircularLoadingIndicator, PrimaryButton } from 'shared/ui-kit';
import SignAllBatchModal from 'components/MusicDao/modals/SignAllBatchModal';
import { MasonryGrid } from 'shared/ui-kit/MasonryGrid/MasonryGrid';
import ArtistSongCard from 'components/MusicDao/components/Cards/ArtistSongCard';
import PodProposalCard from 'components/MusicDao/components/Cards/PodProposalCard';
import {
  musicDaoGetCreatedDraftSongs,
  musicDaoGetPodsProposal,
  musicDaoGetUnfinishedMinting
} from 'shared/services/API';
import { BlockchainNets } from 'shared/constants/constants';
import { switchNetwork } from 'shared/functions/metamask';
import { useAlertMessage } from 'shared/hooks/useAlertMessage';
import { useMaxPrioFee } from 'shared/contexts/MaxPrioFeeContext';
import { MintEditionStepType } from 'components/MusicDao/modals/CreateSongModalNew';
import URL from 'shared/functions/getURL';
import TransactionProgressModal from 'components/MusicDao/modals/TransactionProgressModal';
import { useWipStyles } from './index.styles';

const BATCH_NUM = 20;

const COLUMNS_COUNT_BREAK_POINTS_FOUR = {
  400: 1,
  700: 2,
  1200: 3,
  1440: 4
};

const tabs = ['Edition drafts', 'Track drafts', 'Capsule Drafts'];
const Wip = ({ userId, userProfile }) => {
  const classes = useWipStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const isTablet = useMediaQuery(theme.breakpoints.down('sm'));
  const { showAlertMessage } = useAlertMessage();

  const [curTab, setCurTab] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(false);
  const [unfinishedMintings, setUnfinishedMintings] = useState<any[]>([]);
  const [draftSongs, setDraftSongs] = useState<any[]>([]);
  const [hasMoreSongs, setHasMoreSongs] = useState<boolean>(true);
  const [draftPods, setDraftPods] = useState<any[]>([]);
  const [hasMorePods, setHasMorePods] = useState<boolean>(true);
  const [lastId, setLastId] = useState<any>(undefined);

  const [openMintingModal, setOpenMintingModal] = useState<boolean>(false);

  const breakTwo = useMediaQuery(theme.breakpoints.up(700));
  const breakThree = useMediaQuery(theme.breakpoints.up(1200));
  const breakFour = useMediaQuery(theme.breakpoints.up(1440));

  const [currentMintingItem, setCurrentMintingItem] = useState<any>();

  const [hash, setHash] = useState<string>('');
  const [transactionSuccess, setTransactionSuccess] = useState<boolean | null>(
    null
  );
  const [openTransactionModal, setOpenTransactionModal] =
    useState<boolean>(false);

  const { account, library, chainId } = useWeb3React();

  const { maxPrioFee } = useMaxPrioFee();
  const [mintedEditionSteps, setMintedEditionSteps] = useState<
    MintEditionStepType[]
  >([]);

  const songListWithSkeleton = useMemo(() => {
    if (hasMoreSongs) {
      let addedCount = 1;
      if (breakFour) {
        addedCount = 4 - (draftSongs.length % 4);
      } else if (breakThree) {
        addedCount = 3 - (draftSongs.length % 3);
      } else if (breakTwo) {
        addedCount = 2 - (draftSongs.length % 2);
      }

      const result = [...draftSongs];
      for (let index = 0; index < addedCount; index++) {
        result.push({});
      }

      return result;
    } else {
      return draftSongs;
    }
  }, [draftSongs, hasMoreSongs, breakTwo, breakThree, breakFour]);

  useEffect(() => {
    if (!currentMintingItem) return;

    const amount = +currentMintingItem.TotalToMint;

    if (amount === 0) {
      setMintedEditionSteps([]);
      return;
    }

    const result: MintEditionStepType[] = [];

    let i;
    for (i = 0; i * BATCH_NUM < amount; i++) {
      if (currentMintingItem.batches[i]) {
        result.push(currentMintingItem.batches[i]);
      } else {
        result.push({
          id: i,
          name:
            i * BATCH_NUM + 1 === amount
              ? `Batch ${i * BATCH_NUM + 1}`
              : (i + 1) * BATCH_NUM < amount
              ? `Batch ${i * BATCH_NUM + 1}-${(i + 1) * BATCH_NUM}`
              : `Batch ${i * BATCH_NUM + 1}-${amount}`,
          status: i === currentMintingItem.batches.length ? 1 : 0,
          hash: ''
        });
      }
    }
    setMintedEditionSteps(result);
  }, [currentMintingItem]);

  useEffect(() => {
    handleRefresh();
  }, [curTab]);

  const handleRefresh = () => {
    if (curTab === 0) loadUnfinishedMinting();
    if (curTab === 1) loadDraftSongs();
    else if (curTab === 2) loadDraftPods();
  };

  const loadDraftSongs = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const resp = await musicDaoGetCreatedDraftSongs(userId, lastId);
      if (resp.success && curTab === 1) {
        setDraftSongs(resp.data?.nfts?.filter((v) => v.draft === true) ?? []);
        setHasMoreSongs(resp.data.hasMore);
        setLastId(resp.data.lastStamp);
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };
  const loadDraftPods = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const resp = await musicDaoGetPodsProposal(
        userProfile.address,
        '',
        lastId
      );
      if (resp.success && curTab === 2) {
        const newPods = resp.data?.filter((v) => v.CreatorId === userId) ?? [];
        setDraftPods([...draftPods, ...newPods]);
        setLastId(resp.lastId);
        setHasMorePods(resp.data.length === 20);
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };
  const loadUnfinishedMinting = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const resp = await musicDaoGetUnfinishedMinting();
      if (resp.success && curTab === 0) {
        setUnfinishedMintings(
          resp.data.sort((a, b) => b.createdAt - a.createdAt)
        );
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const handleOpenScan = (hash) => {
    const selectedChain = BlockchainNets.find(
      (net) => net.value === 'Polygon blockchain'
    );
    window.open(`${selectedChain.scan.url}/token/${hash}`, '_blank');
  };

  const handleContinueMinting = (item) => {
    setCurrentMintingItem(item);
    setOpenMintingModal(true);
  };

  const handleMintEditions = async (batchId: number) => {
    setOpenTransactionModal(true);

    const targetChain = BlockchainNets.find(
      (net) => net.value === 'Polygon blockchain'
    );
    if (chainId && chainId !== targetChain?.chainId) {
      const isHere = await switchNetwork(targetChain?.chainId || 0x89);
      if (!isHere) {
        showAlertMessage('Got failed while switching over to target network', {
          variant: 'error'
        });
        return;
      }
    }

    const web3APIHandler = targetChain.apiHandler;
    const web3 = new Web3(library.provider);

    try {
      let response;

      response = await web3APIHandler.Erc721WithRoyalty.mintEditions(
        web3,
        account!,
        {
          contractAddress: currentMintingItem.albumId,
          songId: currentMintingItem.BatchSongId
        },
        setHash,
        maxPrioFee
      );
      if (response.success) {
        setTransactionSuccess(true);

        // Enable next step to mint
        let tSteps: MintEditionStepType[] = [];
        mintedEditionSteps.forEach((step, index) => {
          let tStep: MintEditionStepType = { ...step };
          if (index === batchId) {
            tStep.status = 2;
            tStep.hash = response.data.hash;
          }
          if (index === batchId + 1 && step.status === 0) {
            tStep.status = 1;
          }
          tSteps.push(tStep);
        });
        setMintedEditionSteps(tSteps);

        await axios.post(`${URL()}/musicDao/batchSongNFTEditions`, {
          data: {
            collectionAddress: currentMintingItem.albumId,
            songId: currentMintingItem.Identifier,
            tokenIds: response.data.tokenIds,
            ownerAddress: account?.toLowerCase(),
            hash: response.data.hash,
            incrementalInitialId: batchId * BATCH_NUM + 1,
            category: 'Normal',
            mintStep: tSteps[batchId]
          }
        });
        setHash('');
        setTransactionSuccess(null);
        setOpenTransactionModal(false);

        handleRefresh();
      } else {
        // Update edition step to failed status
        let tSteps: MintEditionStepType[] = [];
        mintedEditionSteps.forEach((step, index) => {
          let tStep: MintEditionStepType = { ...step };
          if (index === batchId) tStep.status = 3;
          tSteps.push(tStep);
        });

        showAlertMessage('Failed to mint batch', { variant: 'error' });
        setTransactionSuccess(false);
      }
    } catch (err) {
      console.log(err);
      showAlertMessage('Failed to upload media', { variant: 'error' });
      setTransactionSuccess(false);
    }
  };

  return (
    <Box className={classes.container} id={'scrollContainer'}>
      <>
        <Box className={classes.title} my={3}>
          {tabs.map((item, index) => (
            <Box
              // size="medium"
              // isRounded
              // disabled={loading}
              style={{
                fontWeight: 400,
                fontSize: 14,
                width: 'fit-content',
                height: 36,
                lineHeight: '14px',
                marginRight: 32,
                color: curTab === index ? '#fff' : '#181818',
                background: curTab === index ? '#2D3047' : 'none',
                cursor: loading ? 'auto' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 10px',
                borderRadius: '100vh',
                textAlign: 'center'
              }}
              onClick={() => {
                if (loading) return;
                setUnfinishedMintings([]);
                setDraftSongs([]);
                setDraftPods([]);
                setHasMoreSongs(true);
                setHasMorePods(true);
                setLastId(undefined);
                setLoading(false);
                setCurTab(index);
              }}
            >
              {item}
            </Box>
          ))}
        </Box>
        {curTab === 0 && loading ? (
          <LoadingIndicatorWrapper>
            <CircularLoadingIndicator />
          </LoadingIndicatorWrapper>
        ) : curTab === 0 && unfinishedMintings.length ? (
          <>
            <TableContainer>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell>Song</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>Name</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>
                      Collection
                    </TableCell>
                    <TableCell style={{ textAlign: 'center' }}>
                      Explorer
                    </TableCell>
                    <TableCell style={{ textAlign: 'center' }}>
                      Minting status
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {unfinishedMintings.map((item, index) => (
                    <TableRow key={`unfinished-minting-${index}`}>
                      <TableCell>
                        <Box className={classes.image}>
                          <img src={item.trackImage} alt="track_image" />
                        </Box>
                      </TableCell>
                      <TableCell className={classes.textName}>
                        {item.Title}
                      </TableCell>
                      <TableCell className={classes.textCollection}>
                        {item.AlbumName}
                      </TableCell>
                      <TableCell>
                        <Box
                          className={classes.explorer}
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleOpenScan(item.nftAddress)}
                        >
                          <img
                            src={require('assets/tokenImages/POLYGON.webp')}
                            alt="chain_image"
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <div
                          style={{ display: 'flex', justifyContent: 'center' }}
                        >
                          <div className={classes.textStatus}>
                            Minted {item.TotalMinted}/{+item.TotalToMint}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className={classes.mintingButton}>
                        <PrimaryButton
                          size="medium"
                          isRounded
                          style={{
                            background: '#181818',
                            fontWeight: 400,
                            width: 'auto',
                            height: 36,
                            lineHeight: '14px',
                            fontSize: isMobile ? 11 : 14
                          }}
                          onClick={() => handleContinueMinting(item)}
                        >
                          Continue Minting
                        </PrimaryButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        ) : curTab === 1 ? (
          <InfiniteScroll
            hasChildren={draftSongs.length > 0}
            dataLength={draftSongs.length}
            scrollableTarget={'scrollContainer'}
            next={loadDraftSongs}
            hasMore={hasMoreSongs}
            loader={null}
            style={{ overflow: 'inherit' }}
          >
            <Box mt={4}>
              {!loading && !hasMoreSongs && draftSongs.length === 0 && (
                <Box textAlign="center" mt={6}>
                  No Track
                </Box>
              )}
              <MasonryGrid
                gutter={'24px'}
                data={songListWithSkeleton}
                renderItem={(item, _) => (
                  <ArtistSongCard
                    song={item}
                    isLoading={Object.entries(item).length === 0}
                    isShowEditionControl={true}
                  />
                )}
                columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
              />
            </Box>
          </InfiniteScroll>
        ) : curTab === 2 ? (
          <div style={{ zIndex: 100 }}>
            <InfiniteScroll
              hasChildren={draftPods.length > 0}
              dataLength={draftPods.length}
              scrollableTarget={'scrollContainer'}
              next={loadDraftPods}
              hasMore={hasMorePods}
              loader={
                loading && (
                  <Box width={1} mb={2}>
                    <PodProposalCard
                      pod={{}}
                      handleRefresh={handleRefresh}
                      isLoading={loading}
                    />
                  </Box>
                )
              }
              style={{ overflow: 'inherit' }}
            >
              <Box mt={4}>
                {draftPods.length > 0
                  ? draftPods.map((pod, index) => (
                      <Box key={index} width={1} mb={2}>
                        <PodProposalCard
                          pod={pod}
                          handleRefresh={handleRefresh}
                        />
                      </Box>
                    ))
                  : !loading && (
                      <Box textAlign="center" width={1}>
                        You’re not yet a collaborator on any Capsule
                      </Box>
                    )}
              </Box>
            </InfiniteScroll>
          </div>
        ) : null}

        <SignAllBatchModal
          open={openMintingModal}
          onClose={() => setOpenMintingModal(false)}
          isStreaming={currentMintingItem?.isMakeStreaming}
          mintedMaster={true}
          onMintEditions={handleMintEditions}
          mintedEditionSteps={mintedEditionSteps}
        />
      </>
      <TransactionProgressModal
        open={openTransactionModal}
        onClose={() => {
          setHash('');
          setTransactionSuccess(null);
          setOpenTransactionModal(false);
        }}
        txSuccess={transactionSuccess}
        hash={hash}
      />
    </Box>
  );
};

export default Wip;

const LoadingIndicatorWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
`;
