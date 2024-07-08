import React, { useState } from 'react';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import useTheme from '@material-ui/core/styles/useTheme';

import AddedSongs from './components/AddedSongs';

import Box from 'shared/ui-kit/Box';
import {
  Modal,
  Color,
  PrimaryButton,
  SecondaryButton,
  Gradient
} from 'shared/ui-kit';
import { _arrayBufferToBase64 } from 'shared/functions/commonFunctions';

import { podProposalDetailsStyle } from './index.styles';
import Distribution from './components/Distribution';
import Investment from './components/Investment';

const Tabs = ['Music', 'Distribution', 'Investment'];

const PodProposalDetails = (props: any) => {
  const { pod, open, onClose } = props;
  const classes = podProposalDetailsStyle();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  const [page, setPage] = useState(0);

  return (
    <Modal
      size="medium"
      isOpen={open}
      onClose={onClose}
      showCloseIcon
      fullScreen
      style={{
        padding: 0,
        maxWidth: '100vw',
        maxHeight: '100vh',
        width: '100vw',
        height: '100vh',
        borderRadius: 0
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Box className={classes.titleBar}>
          <div
            style={
              isMobile
                ? {}
                : {
                    width: 300
                  }
            }
          >
            <img
              src={require('assets/logos/MYX_logo_3.svg')}
              width="100"
              alt="Myx"
            />
          </div>
          {!isMobile && (
            <>
              <Box width={'470px'}>
                <div className={classes.stepsBorder} />
                <div className={classes.steps}>
                  {Tabs.map((tab, index) => (
                    <div
                      className={index <= page ? classes.selected : undefined}
                      key={`tab-${index}`}
                      style={{ position: 'relative' }}
                    >
                      <button
                        onClick={() => {
                          setPage(index);
                        }}
                      >
                        <div>{index + 1}</div>
                      </button>
                    </div>
                  ))}
                </div>
              </Box>
              <Box width="300px" />
            </>
          )}
        </Box>
        {isMobile && (
          <Box width={'350px'} m={2}>
            <div className={classes.stepsBorder} />
            <div className={classes.steps}>
              {Tabs.map((tab, index) => (
                <div
                  className={index <= page ? classes.selected : undefined}
                  key={`tab-${index}`}
                  style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <button
                    onClick={() => {
                      setPage(index);
                    }}
                  >
                    <div>{index + 1}</div>
                  </button>
                </div>
              ))}
            </div>
          </Box>
        )}
        <Box className={classes.workSpace}>
          {page === 0 ? (
            <AddedSongs songs={pod.Medias} />
          ) : page === 1 ? (
            <Distribution pod={pod} />
          ) : (
            <Investment pod={pod} />
          )}
        </Box>
        <Box className={classes.footerBar}>
          <div className={classes.buttons}>
            <SecondaryButton
              size="medium"
              isRounded
              onClick={onClose}
              style={{
                color: 'white',
                border: `1px solid ${Color.MusicDAODark}`,
                background: '#F43E5F'
              }}
            >
              Reject
            </SecondaryButton>
            <PrimaryButton
              size="medium"
              isRounded
              onClick={() => {}}
              style={{
                background: Gradient.Green1,
                width: isMobile ? '40%' : '200px'
              }}
            >
              Accept & Sign
            </PrimaryButton>
          </div>
        </Box>
      </div>
    </Modal>
  );
};

export default PodProposalDetails;
