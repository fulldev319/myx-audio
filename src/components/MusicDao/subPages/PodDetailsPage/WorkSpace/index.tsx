import React, { useEffect, useMemo, useState } from 'react';

import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTypedSelector } from 'store/reducers/Reducer';

import Box from 'shared/ui-kit/Box';
import { PrimaryButton } from 'shared/ui-kit';
import { MasonryGrid } from 'shared/ui-kit/MasonryGrid/MasonryGrid';
import { SplitSongCard } from '../Components/SplitSongCard';
import { NftDetail } from '../Components/NftDetail';
import AddCollabModal from 'components/MusicDao/modals/AddCollabModal/AddCollabModal';
import { InfoTooltip } from 'shared/ui-kit/InfoTooltip';
import { TrackCarouSelBox } from '../Components/TrackCarouSelBox';
import { useWorkSpaceStyles } from './index.styles';
import { TrackDetail } from '../Components/TrackDetail';

// import useIPFS from 'shared/utils-IPFS/useIPFS';
// import { onGetNonDecrypt } from 'shared/ipfs/get';
// import { _arrayBufferToBase64 } from 'shared/functions/commonFunctions';

export const premiumPatterns = [
  {
    name: 'Bronze',
    bg: '#A65F1E'
  },
  {
    name: 'Silver',
    bg: '#B6B6B6'
  },
  {
    name: 'Gold',
    bg: '#E3CA87'
  },
  {
    name: 'Platinum',
    bg: '#636B76'
  }
];
export const regularPatterns = [
  {
    name: 'Regular',
    bg: '#2DD902'
  }
];

export const WorkSpace = ({ pod, handleRefresh, setNoReloadPage }) => {
  const classes = useWorkSpaceStyles();
  const user = useTypedSelector((state) => state.user);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  const [curSongIndex, setCurSongIndex] = useState<number>(0);
  const [curEditionIndex, setCurEditionIndex] = useState<number>(0);
  const [openAddCollabModal, setOpenAddCollabModal] = useState<boolean>(false);
  const [mediaType, setMediaType] = useState<number>(0); // 0:1/1 song, 1:regular edition, 2:premium edition

  useEffect(() => {
    if (pod?.Medias?.length > 0 && pod?.Medias[curSongIndex]) {
      if (pod?.Medias[curSongIndex].pricePerEdition.length > 1) setMediaType(2);
      else if (pod?.Medias[curSongIndex].pricePerEdition.length === 1)
        setMediaType(1);
      const quantities = pod.Medias[curSongIndex].quantityPerEdition;
      for (let i = 0; i < quantities?.length; i++) {
        if (Number(quantities[i]) > 0) {
          setCurEditionIndex(0);
          break;
        }
      }
    }
  }, [pod, curSongIndex]);

  const isCreatorOrCollab = useMemo(() => {
    let isCollab =
      pod.Collabs.filter((collab) => collab.address === user.address).length >
      0;
    if (pod.CreatorId === user.id || isCollab) {
      return true;
    }

    return false;
  }, [pod]);

  const sumCopyrightAllocations = useMemo(() => {
    return (
      pod?.copyrightAllocations?.reduce((a: number, b: number) => a + b, 0) ?? 0
    );
  }, [pod]);

  return (
    <Box style={{ color: '#2D3047' }}>
      <Box className={classes.sectionBox}>
        <Box className={classes.titleBox}>
          <Box display="flex" alignItems="center">
            <span>Collaborators</span>
          </Box>
          {isCreatorOrCollab &&
            pod.distributionProposalAccepted === false &&
            pod.ProposalDeadline &&
            Math.floor(pod.ProposalDeadline._seconds - Date.now() / 1000) >
              0 && (
              <Box mt={isMobile ? 2 : 0}>
                <PrimaryButton
                  size="medium"
                  className={classes.buttonFont}
                  isRounded
                  onClick={() => setOpenAddCollabModal(true)}
                  style={{
                    background: 'black !important',
                    color: 'white',
                    marginRight: 16,
                    opacity: 1
                  }}
                  disabled={
                    pod.distributionProposalAccepted ||
                    !pod.ProposalDeadline ||
                    Math.floor(
                      pod.ProposalDeadline._seconds - Date.now() / 1000
                    ) < 0 ||
                    !isCreatorOrCollab
                  }
                >
                  Invite New People
                </PrimaryButton>
                <InfoTooltip tooltip="You can invite new people to be part of this Capsule such as music technicians, record labels or whoever you want." />
              </Box>
            )}
        </Box>
        <Box>
          {pod.CreatorsData.length > 0 ? (
            <MasonryGrid
              data={pod.CreatorsData}
              renderItem={(item, index) => (
                <SplitSongCard
                  numOfCollaborators={pod.CreatorsData.length}
                  artist={item}
                  canDelete={false}
                  key={`feed-item-${index}`}
                  distribution={
                    pod.artistType !== 'Label' && sumCopyrightAllocations
                      ? (pod?.copyrightAllocations[index] * 100) /
                        sumCopyrightAllocations
                      : ''
                  }
                  handleDeleteCollab={() => {}}
                />
              )}
              columnsCountBreakPoints={
                pod.CreatorsData.length === 1
                  ? COLUMNS_COUNT_ONE_BREAK_POINTS
                  : pod.CreatorsData.length === 2
                  ? COLUMNS_COUNT_TWO_BREAK_POINTS
                  : pod.CreatorsData.length > 2
                  ? COLUMNS_COUNT_FOUR_BREAK_POINTS
                  : COLUMNS_COUNT_FOUR_BREAK_POINTS
              }
              gutter={GUTTER}
            />
          ) : (
            <Box
              fontSize={14}
              fontWeight={800}
              width={1}
              display="flex"
              justifyContent={'center'}
            >
              No Collaborators
            </Box>
          )}
        </Box>
      </Box>
      {pod?.Medias?.length > 1 && (
        <Box className={classes.sectionBox}>
          <Box className={classes.titleBox}>
            <div>Available Tracks </div>
          </Box>
          <Box>
            <TrackCarouSelBox
              pod={pod}
              curSongIndex={curSongIndex}
              setCurSongIndex={setCurSongIndex}
            />
          </Box>
        </Box>
      )}
      {/* <TrackDetail
        pod={pod}
        song={pod?.Medias[0] ?? undefined}
        refreshPod={() => {}}
      /> */}
      {pod?.Medias?.length > 0 && (
        <Box className={classes.sectionBox}>
          {mediaType > 0 && (
            <Box
              className={classes.titleBox}
              style={{ justifyContent: 'start' }}
            >
              <Box display="flex" alignItems="center">
                <div>Edition: </div>
                <Box
                  mr={5}
                  ml={3}
                  display="flex"
                  alignItems="center"
                  style={{
                    width: 130,
                    fontSize: 16,
                    fontWeight: 600
                  }}
                >
                  <div
                    className={classes.editionBall}
                    style={{
                      background:
                        mediaType === 1
                          ? regularPatterns[curEditionIndex].bg
                          : premiumPatterns[curEditionIndex].bg,
                      border: '2px solid #65CB63',
                      boxShadow: '0px 10px 8px rgba(44, 255, 115, 0.3)',
                      filter: 'none'
                    }}
                  />
                  <div>
                    {mediaType === 1
                      ? regularPatterns[curEditionIndex].name
                      : premiumPatterns[curEditionIndex].name}
                  </div>
                </Box>
              </Box>
              {mediaType === 2 && (
                <Box display="flex" alignItems="center">
                  {premiumPatterns.map((v, i) =>
                    Number(pod?.Medias[curSongIndex].quantityPerEdition[i]) >
                    0 ? (
                      <div
                        className={classes.editionBall}
                        key={`edition-${i}`}
                        style={{ background: v.bg }}
                        onClick={() => setCurEditionIndex(i)}
                      />
                    ) : null
                  )}
                </Box>
              )}
            </Box>
          )}
          <Box>
            <NftDetail
              pod={pod}
              mediaIndex={curSongIndex}
              editionIndex={curEditionIndex}
              refreshPod={handleRefresh}
              setNoReloadPage={setNoReloadPage}
            />
          </Box>
        </Box>
      )}

      {openAddCollabModal && (
        <AddCollabModal
          pod={pod}
          open={openAddCollabModal}
          handleClose={() => setOpenAddCollabModal(false)}
          handleRefresh={handleRefresh}
        />
      )}
    </Box>
  );
};

const COLUMNS_COUNT_ONE_BREAK_POINTS = {
  400: 1
};

const COLUMNS_COUNT_TWO_BREAK_POINTS = {
  400: 1,
  650: 2
};

const COLUMNS_COUNT_FOUR_BREAK_POINTS = {
  400: 1,
  650: 2,
  1200: 3,
  1420: 4
};

const GUTTER = '24px';
