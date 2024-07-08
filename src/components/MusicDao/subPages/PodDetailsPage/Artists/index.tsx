import React, { useMemo, useState } from 'react';

import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { useTypedSelector } from 'store/reducers/Reducer';
import AddCreatorModal from 'components/MusicDao/modals/AddCreatorModal';
import AddCollabModal from 'components/MusicDao/modals/AddCollabModal/AddCollabModal';
// import UserWideCard from 'components/MusicDao/components/Cards/UserWideCard';
import RemoveCollabModal from 'components/MusicDao/modals/RemoveCollabModal';
import { SplitSongCard } from '../Components/SplitSongCard';

import Box from 'shared/ui-kit/Box';
import { PrimaryButton } from 'shared/ui-kit';
import { MasonryGrid } from 'shared/ui-kit/MasonryGrid/MasonryGrid';
import { InfoTooltip } from 'shared/ui-kit/InfoTooltip';

import { usePodDetailStyles } from '../index.styles';

const COLUMNS_COUNT_BREAK_POINTS = {
  400: 1,
  650: 2,
  1200: 3,
  1420: 4
};
const GUTTER = '24px';

export default function PodArtists({ pod, handleRefresh }) {
  const classes = usePodDetailStyles();
  const user = useTypedSelector((state) => state.user);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  const [openPanel, setOpenPanel] = useState<boolean>(true);
  const [openAddCreatorModal, setOpenAddCreatorModal] =
    useState<boolean>(false);
  const [openAddCollabModal, setOpenAddCollabModal] = useState<boolean>(false);
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

  const [deleteCollabIndex, setDeleteCollabIndex] = useState<number>(-1);
  const [openDeleteCollabModal, setOpenDeleteCollabModal] =
    useState<boolean>(false);

  return (
    <>
      <Box
        className={classes.artistsBox}
        justifyContent="space-between"
        mt={4}
        mb={3}
      >
        <Box className={classes.title2}>Collaborators</Box>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="flex-end"
          flex={1}
        >
          {isCreatorOrCollab &&
          !pod.distributionProposalAccepted &&
          pod.ProposalDeadline &&
          Math.floor(pod.ProposalDeadline._seconds - Date.now() / 1000) > 0 ? (
            <Box mt={isMobile ? 2 : 0}>
              <PrimaryButton
                size="medium"
                className={classes.addCreatorButton}
                style={{ marginRight: 16 }}
                isRounded
                onClick={() => setOpenAddCollabModal(true)}
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
          ) : (
            <Box
              ml={2}
              className={classes.title3}
              display="flex"
              alignItems="center"
              onClick={() => setOpenPanel(!openPanel)}
            >
              {openPanel ? (
                <>
                  <span>Hide</span>
                  <UpArrowIcon />
                </>
              ) : (
                <>
                  <span>Show</span>
                  <DownArrowIcon />
                </>
              )}
            </Box>
          )}
        </Box>
      </Box>
      {openPanel && (
        <Box>
          <MasonryGrid
            data={pod.CreatorsData}
            renderItem={(item: any, index) => (
              <SplitSongCard
                key={`feed-item-${index}`}
                artist={item}
                numOfCollaborators={pod.CreatorsData.length}
                canDelete={
                  pod.CreatorId === user.id &&
                  item.address.toLowerCase() !==
                    (pod.Creator || pod.creator)?.toLowerCase()
                }
                distribution={
                  sumCopyrightAllocations
                    ? (pod?.copyrightAllocations[index] * 100) /
                      sumCopyrightAllocations
                    : ''
                }
                handleDeleteCollab={() => {
                  setDeleteCollabIndex(index);
                  setOpenDeleteCollabModal(true);
                }}
              />
            )}
            columnsCountBreakPoints={
              pod.CreatorsData.length === 1
                ? { 1600: 1 }
                : pod.CreatorsData.length === 2
                ? {
                    400: 1,
                    650: 2
                  }
                : COLUMNS_COUNT_BREAK_POINTS
            }
            gutter={GUTTER}
          />
        </Box>

        // <>
        //   <div className={classes.artistsMainContent}>
        //     {pod.CreatorsData.length === 1 ? (
        //       <UserWideCard
        //         user={pod.CreatorsData[0]}
        //         invited={
        //           pod.CreatorsData[0].address.toLowerCase() !==
        //           (pod.Creator || pod.creator)?.toLowerCase()
        //         }
        //         accepted={pod.CreatorsData[0].vote}
        //       />
        //     ) : pod.CreatorsData.length === 2 ? (
        //       <Box className={classes.twoArtist}>
        //         <UserWideCard
        //           user={pod.CreatorsData[0]}
        //           invited={
        //             pod.CreatorsData[0].address.toLowerCase() !==
        //             (pod.Creator || pod.creator)?.toLowerCase()
        //           }
        //           accepted={pod.CreatorsData[0].vote}
        //           canDelete={!pod.Proposals || !pod.Proposals.length}
        //           handleDeleteCollab={handleDeleteCollab}
        //         />
        //         <UserWideCard
        //           user={pod.CreatorsData[1]}
        //           invited={
        //             pod.CreatorsData[1].address.toLowerCase() !==
        //             (pod.Creator || pod.creator)?.toLowerCase()
        //           }
        //           accepted={pod.CreatorsData[1].vote}
        //           canDelete={!pod.Proposals || !pod.Proposals.length}
        //           handleDeleteCollab={handleDeleteCollab}
        //         />
        //       </Box>
        //     ) : (
        //       pod.CreatorsData.sort(
        //         (a, b) => a.addedCreator - b.addedCreator
        //       ).map((creator, index) => (
        //         <UserCard
        //           key={`artist-${index}`}
        //           user={creator}
        //           invited={
        //             creator.address.toLowerCase() !==
        //             (pod.Creator || pod.creator)?.toLowerCase()
        //           }
        //           accepted={creator.vote}
        //           canDelete={!pod.Proposals || !pod.Proposals.length}
        //           handleDeleteCollab={handleDeleteCollab}
        //         />
        //       ))
        //     )}
        //   </div>
        //   {!pod.distributionProposalAccepted &&
        //     pod.ProposalDeadline &&
        //     Math.floor(pod.ProposalDeadline._seconds - Date.now() / 1000) > 0 &&
        //     isCreatorOrCollab && (
        //       <Box className={classes.addCollabContainer} mt={5}>
        //         <Box
        //           display="flex"
        //           alignItems="flex-start"
        //           maxWidth={420}
        //           flex={1}
        //           mb={1}
        //         >
        //           <svg
        //             width="21"
        //             height="20"
        //             viewBox="0 0 21 20"
        //             fill="none"
        //             xmlns="http://www.w3.org/2000/svg"
        //           >
        //             <path
        //               d="M11.3491 14.7576C11.3491 14.3434 11.0133 14.0076 10.5991 14.0076C10.1849 14.0076 9.84912 14.3434 9.84912 14.7576H11.3491ZM9.84912 14.7676C9.84912 15.1818 10.1849 15.5176 10.5991 15.5176C11.0133 15.5176 11.3491 15.1818 11.3491 14.7676H9.84912ZM9.84912 11.7676C9.84912 12.1818 10.1849 12.5176 10.5991 12.5176C11.0133 12.5176 11.3491 12.1818 11.3491 11.7676H9.84912ZM6.87499 6.75412C6.76714 7.15404 7.00392 7.56568 7.40384 7.67353C7.80377 7.78138 8.2154 7.5446 8.32325 7.14468L6.87499 6.75412ZM9.84912 14.7576V14.7676H11.3491V14.7576H9.84912ZM12.8491 7.67667C12.8491 8.27464 12.4771 8.59079 11.6766 9.13654C11.0004 9.59763 9.84912 10.3095 9.84912 11.7676H11.3491C11.3491 11.2257 11.6979 10.9375 12.5216 10.3759C13.2212 9.89891 14.3491 9.16961 14.3491 7.67667H12.8491ZM10.5991 5.51758C11.8858 5.51758 12.8491 6.50155 12.8491 7.67667H14.3491C14.3491 5.63849 12.6792 4.01758 10.5991 4.01758V5.51758ZM8.32325 7.14468C8.5665 6.24266 9.49085 5.51758 10.5991 5.51758V4.01758C8.86689 4.01758 7.30846 5.14671 6.87499 6.75412L8.32325 7.14468ZM18.8491 9.76758C18.8491 14.3239 15.1555 18.0176 10.5991 18.0176V19.5176C15.9839 19.5176 20.3491 15.1524 20.3491 9.76758H18.8491ZM10.5991 18.0176C6.04277 18.0176 2.34912 14.3239 2.34912 9.76758H0.849121C0.849121 15.1524 5.21434 19.5176 10.5991 19.5176V18.0176ZM2.34912 9.76758C2.34912 5.21123 6.04277 1.51758 10.5991 1.51758V0.0175781C5.21434 0.0175781 0.849121 4.3828 0.849121 9.76758H2.34912ZM10.5991 1.51758C15.1555 1.51758 18.8491 5.21123 18.8491 9.76758H20.3491C20.3491 4.3828 15.9839 0.0175781 10.5991 0.0175781V1.51758Z"
        //               fill="#727F9A"
        //             />
        //           </svg>
        //           <Box
        //             className={classes.header1}
        //             ml={1.5}
        //             mr={3}
        //             style={{ fontSize: 13 }}
        //           >
        //             Invite those who you want to be involved in the creation and
        //             approval of a Capsule proposal. This may be fellow artists,
        //             labels, etc.
        //           </Box>
        //         </Box>
        //         <PrimaryButton
        //           size="medium"
        //           className={classes.addCreatorButton}
        //           isRounded
        //           onClick={() => setOpenAddCollabModal(true)}
        //         >
        //           Invite New People
        //         </PrimaryButton>
        //       </Box>
        //     )}
        // </>
      )}
      {openAddCreatorModal && (
        <AddCreatorModal
          pod={pod}
          open={openAddCreatorModal}
          handleClose={() => setOpenAddCreatorModal(false)}
          handleRefresh={handleRefresh}
        />
      )}
      {openAddCollabModal && (
        <AddCollabModal
          pod={pod}
          open={openAddCollabModal}
          handleClose={() => setOpenAddCollabModal(false)}
          handleRefresh={handleRefresh}
        />
      )}
      {openDeleteCollabModal && (
        <RemoveCollabModal
          open={openDeleteCollabModal}
          handleClose={() => setOpenDeleteCollabModal(false)}
          podId={pod.id || pod.Id}
          collabId={pod.CreatorsData[deleteCollabIndex].id}
          handleRefresh={handleRefresh}
        />
      )}
    </>
  );
}

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
      stroke="white"
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
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
