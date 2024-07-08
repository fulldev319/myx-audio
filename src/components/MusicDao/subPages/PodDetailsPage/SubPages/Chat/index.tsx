import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import SimpleCarousel from 'react-simply-carousel';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import Grid from '@material-ui/core/Grid';

import Discord from '../../Discord';
import { socket } from '../../../../../Login/Auth';
import ListChats from './ListChats';
import { FundCard } from 'components/MusicDao/components/Cards/FundCard';
import { ClaimFundsModal } from 'components/MusicDao/modals/ClaimFundsModal';
import DistributionProposalModal from 'components/MusicDao/modals/DistributionProposalModal';
import { RootState } from 'store/reducers/Reducer';

import { musicDaoGetWithdrawProposals } from 'shared/services/API';
import { LoadingWrapper } from 'shared/ui-kit/Hocs';
import { Gradient, PrimaryButton } from 'shared/ui-kit';
import Box from 'shared/ui-kit/Box';

import { chatStyles } from './index.styles';

export default function Discussion(props) {
  const isMobile = useMediaQuery('(max-width:600px)');
  const classes = chatStyles();

  const userSelector = useSelector((state: RootState) => state.user);

  const [pod, setPod] = useState<any>({});
  const [podInfo, setPodInfo] = useState<any>({});

  //modal controller
  const [discussions, setDiscussions] = useState<any[]>([]);
  const [openClaimFundsModal, setOpenClaimFundsModal] =
    useState<boolean>(false);

  const [selectedChat, setSelectedChat] = useState<any>({});
  const [selectedChatId, setSelectedChatId] = useState<string>('');

  const [openDistributionProposalModal, setOpenDistributionProposalModal] =
    useState<boolean>(false);

  const [isLoadingProposals, setIsLoadingProposals] =
    React.useState<boolean>(false);
  const [proposals, setProposals] = React.useState<any[]>([]);

  const [activeSlide, setActiveSlide] = useState<number>(0);

  useEffect(() => {
    if (props.podId) {
      // setIsDataLoading(true);
      if (props.pod && props.pod.PrivateChats && props.podInfo) {
        setPod(props.pod);
        setPodInfo(props.podInfo);
        setDiscussions(props.pod.PrivateChats);
        if (props.pod.PrivateChats?.length > 0) {
          onTopicSelected(props.pod.PrivateChats[0]);
        }
      }
    }
  }, [props.podId, props.pod, props.podInfo]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoadingProposals(true);
    (async () => {
      try {
        const response = await musicDaoGetWithdrawProposals(props.podId);
        if (response.success) {
          setProposals(response.data);
        }
        setIsLoadingProposals(false);
      } catch (e) {
        console.log('network error');
      }
    })();
  };

  const onTopicSelected = (val) => {
    socket?.emit('subscribe-podDiscussion', {
      podId: props.podId,
      topicId: val.id,
      userId: userSelector.id,
      podType: 'TRAX'
    });
    setSelectedChatId(val.id);
    setSelectedChat(val);
  };

  const fundedStatus = React.useMemo(
    () =>
      pod &&
      pod.FundingDate &&
      pod.FundingDate <= Math.trunc(Date.now() / 1000) &&
      (pod.RaisedFunds || 0) >= pod.FundingTarget,
    [pod]
  );

  if (props.pod)
    return (
      <Box mt={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box mb={3} className={classes.title}>
              Proposals
            </Box>
            <LoadingWrapper loading={isLoadingProposals}>
              {proposals.length === 0 ? (
                <>No proposals</>
              ) : (
                <SimpleCarousel
                  containerProps={{
                    style: {
                      width: '100%',
                      justifyContent: 'flex-start'
                    }
                  }}
                  activeSlideIndex={activeSlide}
                  onAfterChange={setActiveSlide}
                  forwardBtnProps={{
                    style: {
                      display: 'none'
                    }
                  }}
                  backwardBtnProps={{
                    style: {
                      display: 'none'
                    }
                  }}
                  speed={400}
                  infinite={false}
                >
                  {proposals.map((item, index) => (
                    <Box
                      pl={index === 0 ? 0 : 2}
                      pr={index === proposals.length - 1 ? 0 : 2}
                      key={`fund-withdraw-card-${index}`}
                    >
                      <FundCard
                        proposal={item}
                        podId={props.podId}
                        pod={pod}
                        handleRefresh={() => {
                          loadData();
                        }}
                      />
                    </Box>
                  ))}
                </SimpleCarousel>
              )}
            </LoadingWrapper>
            <Box
              className={classes.flexBox}
              justifyContent="space-between"
              mt={3}
              mb={3}
            >
              <div className={classes.title}>Discussion</div>
              {fundedStatus && (
                <PrimaryButton
                  size="medium"
                  onClick={() => setOpenClaimFundsModal(true)}
                  style={{
                    padding: isMobile ? '0 15px' : '0 30px',
                    fontSize: isMobile ? '13px' : '18px',
                    background: Gradient.Green1
                  }}
                  isRounded
                >
                  New Withdrawal Proposal
                </PrimaryButton>
              )}
            </Box>
            <div
              className={classes.discussionContent}
              style={{ paddingRight: 0 }}
            >
              <Grid container style={{ height: '100%' }}>
                <Grid
                  item
                  xs={12}
                  sm={4}
                  style={{
                    height: isMobile ? '170px' : '100%',
                    borderRight: isMobile ? 'none' : '1px solid #ddd'
                  }}
                >
                  <Box p={3}>
                    <ListChats
                      discussions={discussions}
                      selectedChat={selectedChatId}
                      onTopicSelected={(val) => onTopicSelected(val)}
                    />
                  </Box>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={8}
                  style={{ height: isMobile ? 'calc(100% - 170px)' : '100%' }}
                >
                  <Box pb={2} style={{ height: '100%' }}>
                    <Discord
                      podId={props.podId}
                      chatType={'PrivateChat'}
                      chatId={selectedChatId}
                      sidebar={false}
                      theme="dark"
                    />
                  </Box>
                </Grid>
              </Grid>
            </div>
          </Grid>
        </Grid>
        {openDistributionProposalModal && (
          <DistributionProposalModal
            open={openDistributionProposalModal}
            onClose={() => setOpenDistributionProposalModal(false)}
          />
        )}
        {openClaimFundsModal && (
          <ClaimFundsModal
            open={openClaimFundsModal}
            handleClose={() => setOpenClaimFundsModal(false)}
            handleRefresh={() => loadData()}
            podId={props.podId}
            pod={pod}
            podInfo={podInfo}
          />
        )}
      </Box>
    );
  else return <p>Error displaying pod data</p>;
}
