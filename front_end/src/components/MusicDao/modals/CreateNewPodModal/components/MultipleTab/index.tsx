import React from 'react';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import Box from 'shared/ui-kit/Box';
import { multipleTabStyles } from './index.styles';
import { createPodModalStyles } from '../../index.styles';

const MultipleTab = ({ pod, setPod }) => {
  const classes = multipleTabStyles();
  const modalClasses = createPodModalStyles();

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPod({
      ...pod,
      IsSingle:
        (event.target as HTMLInputElement).value === 'single' ? true : false
    });
  };

  return (
    <div style={{ position: 'relative' }}>
      <Box className={classes.title} mb={3}>
        Do you want to add multiple tracks to the Capsule?
      </Box>
      <RadioGroup
        className={classes.radioButton}
        value={pod.IsSingle ? 'single' : 'multiple'}
        onChange={handleRadioChange}
      >
        <div
          style={{
            background: pod.IsSingle
              ? 'linear-gradient(0deg, #F2FBF6, #F2FBF6), #17172D'
              : 'linear-gradient(0deg, rgba(218, 230, 229, 0.06), rgba(218, 230, 229, 0.06))'
          }}
        >
          <FormControlLabel
            style={{ marginLeft: 0 }}
            value="single"
            control={<Radio />}
            label="No, just one track"
          />
        </div>
        <div
          style={{
            background: pod.IsSingle
              ? 'linear-gradient(0deg, rgba(218, 230, 229, 0.06), rgba(218, 230, 229, 0.06))'
              : 'linear-gradient(0deg, #F2FBF6, #F2FBF6), #17172D'
          }}
        >
          <FormControlLabel
            style={{ marginLeft: 0 }}
            value="multiple"
            control={<Radio />}
            label="Yes, multiple tracks"
          />
        </div>
      </RadioGroup>
      {/* <Box
        className={classes.tooltip}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt={6}
      >
        <Box className={modalClasses.typo1} mb={1}>
          How many tracks do you want to add?
        </Box>
        <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} arrow title={""}>
          <InfoIcon />
        </Tooltip>
      </Box> */}
      {/* <InputBase
        className={classes.input}
        value={pod.Tracks || ""}
        onChange={event => {
          setPod({ ...pod, Tracks: event.target.value });
        }}
        autoFocus
      /> */}
      <Box
        mt={5}
        mb={3}
        style={{
          display: 'flex',
          alignItems: 'center',
          border: '1px solid rgba(255, 138, 1, 0.32)',
          padding: 16,
          borderRadius: 8
        }}
      >
        <WarningIcon />
        <Box ml={2} className={modalClasses.alertTypo}>
          You will upload music at a later stage, not right now
        </Box>
      </Box>
    </div>
  );
};

export default MultipleTab;

const WarningIcon = () => (
  <svg
    width="26"
    height="24"
    viewBox="0 0 26 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M25.096 17.7599L16.264 2.46387C14.824 -0.0641289 11.176 -0.0641289 9.73602 2.46387L0.90402 17.7599C-0.53598 20.2879 1.25602 23.4239 4.16802 23.4239H21.8C24.712 23.4239 26.536 20.2559 25.096 17.7599ZM12.648 7.32787C13.32 7.16787 13.992 7.48787 14.28 8.12787C14.376 8.35187 14.408 8.57587 14.408 8.83187C14.376 9.53587 14.312 10.2399 14.28 10.9439C14.216 12.0319 14.152 13.1199 14.088 14.2079C14.056 14.5599 14.056 14.8799 14.056 15.2319C14.024 15.8079 13.576 16.2559 13 16.2559C12.424 16.2559 11.976 15.8399 11.944 15.2639C11.848 13.5679 11.752 11.9039 11.656 10.2079C11.624 9.75987 11.592 9.31187 11.56 8.86387C11.56 8.12787 11.976 7.51987 12.648 7.32787ZM13 20.0319C12.232 20.0319 11.592 19.3919 11.592 18.6239C11.592 17.8559 12.232 17.2159 13 17.2159C13.768 17.2159 14.408 17.8559 14.376 18.6559C14.408 19.3919 13.736 20.0319 13 20.0319Z"
      fill="#FF9101"
    />
  </svg>
);
