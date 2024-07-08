import React, { useState } from 'react';
import {
  ContentType,
  Modal,
  PrimaryButton,
  SecondaryButton,
  Color
} from 'shared/ui-kit';
import Box from 'shared/ui-kit/Box';
import CustomButtonWithTooltip from 'shared/ui-kit/CustomButtonWithTooltip';
import GeneralTab from './GeneralTab';
import DistributionTab from './DistributionTab';
import TokenomicsTab from './TokenomicsTab';
import { createContentModalStyles } from './index.styles';

const PODSTABOPTIONS = [
  {
    title: 'General',
    description: 'Upload  Music',
    tooltip: ''
  },
  {
    title: 'Distribution',
    description: 'Upload  Music',
    tooltip: ''
  },
  {
    title: 'Investment Options',
    description: 'Upload  Music',
    tooltip: ''
  }
];

const CreateContentModal = (props: any) => {
  const classes = createContentModalStyles();

  const [podMenuSelection, setPodMenuSelection] = useState<Number>(0);

  return (
    <Modal
      size="small"
      isOpen={props.open}
      onClose={props.handleClose}
      fullScreen
      showCloseIcon
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
        <Box className={classes.titleBar}>Add New Song</Box>
        <div className={classes.workSpace}>
          <Box my={4} className={classes.tabsWrap}>
            {PODSTABOPTIONS.map((item, index) => {
              return (
                <div
                  onClick={() => {
                    setPodMenuSelection(index);
                  }}
                  style={{
                    margin: index === 1 ? '0 20px' : 'none'
                  }}
                >
                  <CustomButtonWithTooltip
                    key={`pod-detail-tab-${index}`}
                    btnTitle={item.title}
                    btnDescription={item.description}
                    tooltip={item.tooltip}
                    overriedClasses={classes.tabBox}
                    isActive={podMenuSelection === index}
                  />
                </div>
              );
            })}
          </Box>
          {console.log(podMenuSelection)}
          {podMenuSelection === 0 && (
            <GeneralTab
              onClickeContentCreation={props.onClickeContentCreation}
            />
          )}
          {podMenuSelection === 1 && <DistributionTab />}
          {podMenuSelection === 2 && <TokenomicsTab />}
        </div>
        <Box className={classes.footerBar}>
          <div className={classes.buttons}>
            <SecondaryButton
              size="medium"
              isRounded
              onClick={() => {}}
              style={{
                color: Color.MusicDAODark,
                border: `1px solid ${Color.MusicDAODark}`
              }}
            >
              Back
            </SecondaryButton>
            <PrimaryButton
              size="medium"
              isRounded
              onClick={() => {}}
              style={{
                background: Color.MusicDAODark
              }}
            >
              Next
            </PrimaryButton>
          </div>
        </Box>
      </div>
    </Modal>
  );
};

export default CreateContentModal;
