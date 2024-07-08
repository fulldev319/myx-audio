import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import cls from 'classnames';

import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { RootState } from 'store/reducers/Reducer';
import { getCryptosRateAsList } from 'shared/services/API';
import { Modal, PrimaryButton, SecondaryButton } from 'shared/ui-kit';
import Box from 'shared/ui-kit/Box';
import { _arrayBufferToBase64 } from '../../../../shared/functions/commonFunctions';
import TransactionProgressModal from '../TransactionProgressModal';
import DistributionTab from './components/DistributionTab';
import TokenomicsTab from './components/TokenomicsTab';
import MusicTab from './components/MusicTab';
import { useModalStyles } from './index.styles';

const Tabs = ['music', 'tokenomics', 'distribution'];

export default function PodProposalDetailsModal(props: any) {
  const {
    pod,
    proposal,
    txnModalOpen,
    closeTxnModal,
    txnSuccess,
    hash,
    voteStatus,
    handleNewDistributionProposalModal
  } = props;

  const classes = useModalStyles();
  const userSelector = useSelector((state: RootState) => state.user);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const isTablet = useMediaQuery(theme.breakpoints.down('sm'));

  const [currentTab, setCurrentTab] = useState<string>('music');
  const [tokenObjList, setTokenObjList] = useState<any[]>([]);

  // get token list from backend
  useEffect(() => {
    if (tokenObjList.length === 0 && props.open) {
      getCryptosRateAsList().then((data) => {
        const tknObjList: any[] = [];
        data.forEach((rateObj) => {
          tknObjList.push({ token: rateObj.token, name: rateObj.name });
        });
        setTokenObjList(tknObjList);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.open]);

  return (
    <>
      {txnModalOpen ? (
        <TransactionProgressModal
          open={txnModalOpen}
          onClose={closeTxnModal}
          txSuccess={txnSuccess}
          hash={hash}
        />
      ) : (
        <Modal
          size="medium"
          isOpen={props.open}
          onClose={props.onClose}
          showCloseIcon
          fullScreen={true}
          style={{
            padding: 0,
            maxWidth: '100vw',
            maxHeight: '100vh',
            width: '100vw',
            height: '100vh',
            borderRadius: 0
          }}
        >
          <div className={classes.modalContent}>
            <Box
              display={'flex'}
              alignItems={'center'}
              className={classes.headerContent}
            >
              {!isTablet && (
                <div className={classes.headerTitle}>Proposal Details</div>
              )}
              <Box className={classes.switchBox}>
                {Tabs.filter(
                  (tab) => pod.WithFunding || tab !== 'tokenomics'
                ).map((tab, index) => (
                  <Box
                    className={cls(
                      { [classes.selectedSwitchItem]: currentTab === tab },
                      classes.switchItem
                    )}
                    onClick={() => setCurrentTab(tab)}
                  >
                    <Box
                      className={classes.typo3}
                      color={currentTab === tab ? '#fff' : '#181818'}
                    >
                      {tab}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
            <div className={classes.divider} />
            {pod && (
              <>
                <div
                  style={{
                    display: currentTab === 'music' ? 'block' : 'none'
                  }}
                >
                  <MusicTab proposal={proposal} />
                </div>
                <div
                  style={{
                    display: currentTab === 'tokenomics' ? 'block' : 'none'
                  }}
                >
                  <TokenomicsTab proposal={proposal} />
                </div>
                <div
                  style={{
                    display: currentTab === 'distribution' ? 'block' : 'none'
                  }}
                >
                  <DistributionTab proposal={proposal} pod={pod} />
                </div>
                <div className={classes.divider} />
                {proposal.Proposer !== userSelector.id && (
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    className={classes.buttons}
                    mt={isMobile ? 2 : 4}
                  >
                    {proposal.accepted === false ? (
                      <>This proposal was already declined.</>
                    ) : voteStatus === true ? (
                      <>You've accepted the proposal already.</>
                    ) : voteStatus === false ? (
                      <>You've declined the proposal already.</>
                    ) : proposal.proposer !== userSelector.id ? (
                      <>
                        <PrimaryButton
                          size="medium"
                          onClick={props.handleDecline}
                          style={{
                            background: '#F43E5F'
                          }}
                        >
                          Decline
                        </PrimaryButton>
                        <PrimaryButton
                          size="medium"
                          onClick={props.handleAccept}
                          style={{
                            background:
                              'linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)'
                          }}
                        >
                          Accept & Sign
                        </PrimaryButton>
                      </>
                    ) : null}
                  </Box>
                )}
              </>
            )}
          </div>
        </Modal>
      )}
    </>
  );
}
