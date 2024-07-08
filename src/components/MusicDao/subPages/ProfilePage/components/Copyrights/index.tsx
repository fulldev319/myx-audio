import React, { useEffect, useState /*useCallback*/ } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

// import Table from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
// import TableCell from '@material-ui/core/TableCell';
// import TableContainer from '@material-ui/core/TableContainer';
// import TableHead from '@material-ui/core/TableHead';
// import TableRow from '@material-ui/core/TableRow';

// import { useTypedSelector } from 'store/reducers/Reducer';
import CreateNFTModal from 'components/MusicDao/modals/CreateNFTModal';
import { ArrowLeftIcon } from 'components/MusicDao/subPages/GovernancePage/styles';
import { musicDaoPageStyles } from 'components/MusicDao/index.styles';
import ArtistSongCard from 'components/MusicDao/components/Cards/ArtistSongCard';
import CreatePodModal from 'components/MusicDao/modals/CreateNewPodModal';
import CreateContentModal from 'components/MusicDao/modals/CreateContentModal';
import CreateMutipleEditionsPod from 'components/MusicDao/modals/CreateMutipleEditionsPod';
// import MediaNFTCard from '../MediaNFTCard';

import Box from 'shared/ui-kit/Box';
import { MasonryGrid } from 'shared/ui-kit/MasonryGrid/MasonryGrid';
import {
  CircularLoadingIndicator,
  ContentType,
  // PrimaryButton,
  SecondaryButton
} from 'shared/ui-kit';
import {
  // musicDaoGetCopyrightNFTs,
  // musicDaoGetHoldingPods,
  musicDaoGetOwnedSongNFts
} from 'shared/services/API';
import useWindowDimensions from 'shared/hooks/useWindowDimensions';
import { useCopyRightStyles } from './index.styles';

const COLUMNS_COUNT_BREAK_POINTS_FOUR = {
  375: 1,
  600: 2,
  1000: 3,
  1440: 4
};

const CopyRights = ({ userId, userProfile }) => {
  const classes = useCopyRightStyles();
  const commonClasses = musicDaoPageStyles();

  // const userSelector = useTypedSelector((state) => state.user);

  const history = useHistory();

  const width = useWindowDimensions().width;

  const [loading, setLoading] = useState<boolean>(false);

  const [songs, setSongs] = useState<any[]>([]);
  // const [mediaNFTs, setMediaNFTs] = useState<any[]>([]);
  // const [holdingPods, setHoldingPods] = useState<any[]>([]);

  const [currentPod, setCurrentPod] = useState<any>();
  const [openCreateNFTModal, setOpenCreateNFTModal] = useState<boolean>(false);

  const [openCreatePodModal, setOpenCreatePodModal] = useState<boolean>(false);
  const [openCreateContent, setOpenCreateContent] = useState<boolean>(false);
  const [contentType, setContentType] = useState<ContentType>(
    ContentType.SongSingleEdition
  );
  const [openCreateMusicModal, setOpenCreateMusicModal] =
    useState<boolean>(false);

  const loadingCount = React.useMemo(
    () =>
      Object.keys(COLUMNS_COUNT_BREAK_POINTS_FOUR).reduce(
        (prev, cur) =>
          width > +cur ? COLUMNS_COUNT_BREAK_POINTS_FOUR[cur] : prev,
        1
      ),
    [width]
  );

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const promises = [
      musicDaoGetOwnedSongNFts(userId)
      // musicDaoGetCopyrightNFTs(userId),
      // musicDaoGetHoldingPods(userId)
    ];
    let resp = await Promise.all(promises);
    if (resp[0].success) {
      setSongs(resp[0].data.nfts.slice(0, loadingCount));
    }

    // if (resp[1].success) {
    //   setMediaNFTs((resp[1].data || []).slice(0, loadingCount));
    // }

    // if (resp[2].success) {
    //   const pods = resp[2].data.map((item) => {
    //     const totalSupply = item.TotalSupplyPod ?? 0;
    //     const ownedShare = totalSupply
    //       ? Math.round((item.CopyrightAllocations[userId] / totalSupply) * 100)
    //       : 0;
    //     const infoImage = `https://elb.ipfs.myx.audio:8080/ipfs/${item?.InfoImage?.newFileCID}/${item?.InfoImage?.metadata?.properties.name}`;
    //     return {
    //       ...item,
    //       totalSupply,
    //       ownedShare,
    //       infoImage
    //     };
    //   });
    //   setHoldingPods(pods);
    // }
    setLoading(false);
  };

  // const handleCreateNFT = useCallback((pod) => {
  //   setCurrentPod(pod);
  //   setOpenCreateNFTModal(true);
  // }, []);

  const handleOpenCreatingModal = (type) => {
    setOpenCreateContent(false);
    setContentType(type);
    switch (type) {
      case ContentType.PodInvestment:
      case ContentType.PodCollaborative:
        setOpenCreatePodModal(true);
        break;
      case ContentType.SongSingleEdition:
      case ContentType.SongMultiEdition:
        setOpenCreateMusicModal(true);
        break;
    }
  };

  return (
    <Box className={classes.container}>
      <>
        {loading || songs.length ? (
          <Box
            className={classes.title}
            mt={8}
            mb={3}
            style={{ textTransform: 'uppercase' }}
          >
            NFT of Tracks Owned
          </Box>
        ) : null}
        {loading ? (
          <LoadingIndicatorWrapper>
            <CircularLoadingIndicator />
          </LoadingIndicatorWrapper>
        ) : songs.length ? (
          <>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              {songs.length && songs.length > loadingCount && (
                <SecondaryButton
                  className={commonClasses.showAll}
                  size="medium"
                  radius={29}
                  onClick={() => history.push(`/profile/tracks/${userId}`)}
                  style={{ marginBottom: 16 }}
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
              )}
            </Box>
            <MasonryGrid
              gutter={'24px'}
              data={songs}
              renderItem={(item, _) => (
                <ArtistSongCard
                  song={item}
                  isShowEditionControl={true}
                  openCreateContent={() => setOpenCreateContent(true)}
                />
              )}
              columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
            />
          </>
        ) : null}
        {/* {loading || mediaNFTs.length ? (
          <Box
            className={classes.title}
            mt={8}
            mb={3}
            style={{ textTransform: 'uppercase' }}
          >
            NFT Media Fractions
          </Box>
        ) : null}
        {loading ? (
          <LoadingIndicatorWrapper>
            <CircularLoadingIndicator />
          </LoadingIndicatorWrapper>
        ) : mediaNFTs.length ? (
          <>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              {mediaNFTs.length && mediaNFTs.length > loadingCount && (
                <SecondaryButton
                  className={commonClasses.showAll}
                  size="medium"
                  radius={29}
                  onClick={() => history.push(`/profile/medias/${userId}`)}
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
              )}
            </Box>
            <MasonryGrid
              gutter={'24px'}
              data={mediaNFTs}
              renderItem={(item, _) => <MediaNFTCard nft={item} />}
              columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
            />
          </>
        ) : null}
        {loading || holdingPods.length ? (
          <Box
            className={classes.title}
            mt={8}
            mb={3}
            style={{ textTransform: 'uppercase' }}
          >
            Media Fraction Tokens
          </Box>
        ) : null}
        {loading ? (
          <LoadingIndicatorWrapper>
            <CircularLoadingIndicator />
          </LoadingIndicatorWrapper>
        ) : holdingPods.length ? (
          <>
            <TableContainer>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell>POD Name</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>
                      copyrights tokens
                    </TableCell>
                    <TableCell style={{ textAlign: 'center' }}>
                      owned copyrights (%)
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {holdingPods.map((item, index) => (
                    <TableRow key={`holding-pod-${index}`}>
                      <TableCell>
                        <Box className={classes.podInfo}>
                          <img src={item.infoImage} alt="pod" />
                          <Box display="flex" flexDirection="column" ml={3}>
                            <span>{item.Name}</span>
                            <p>{item.Description}</p>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell className={classes.text1}>
                        {(item.totalSupply * item.ownedShare) / 100}{' '}
                        {item.TokenSymbol}
                      </TableCell>
                      <TableCell className={classes.text1}>
                        {item.ownedShare}%
                      </TableCell>
                      {userSelector.id === userId ? (
                        <TableCell>
                          <PrimaryButton
                            size="small"
                            onClick={() => handleCreateNFT(item)}
                          >
                            Create NFT
                          </PrimaryButton>
                        </TableCell>
                      ) : null}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        ) : null} */}
        {currentPod && (
          <CreateNFTModal
            open={openCreateNFTModal}
            onClose={() => setOpenCreateNFTModal(false)}
            pod={currentPod}
            handleRefresh={() => loadData()}
          />
        )}
        {openCreateMusicModal && (
          <CreateMutipleEditionsPod
            onClose={() => setOpenCreateMusicModal(false)}
            handleRefresh={() => {}}
            open={openCreateMusicModal}
            type={contentType}
          />
        )}
        {openCreatePodModal && (
          <CreatePodModal
            onClose={() => {
              setOpenCreatePodModal(false);
            }}
            type={contentType}
            handleRefresh={() => {}}
            open={openCreatePodModal}
          />
        )}
        {openCreateContent && (
          <CreateContentModal
            handleClose={() => setOpenCreateContent(false)}
            onClickeContentCreation={(type) => {
              handleOpenCreatingModal(type);
            }}
            open={openCreateContent}
          />
        )}
      </>
    </Box>
  );
};

export default CopyRights;

const LoadingIndicatorWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
`;
