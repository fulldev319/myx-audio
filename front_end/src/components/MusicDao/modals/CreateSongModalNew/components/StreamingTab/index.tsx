import React from 'react';

import makeStyles from '@material-ui/core/styles/makeStyles';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import Box from 'shared/ui-kit/Box';

import { useCreateSongStyles } from '../../index.styles';

const readioOptions = [
  {
    title: 'Yes',
    value: 'Yes'
  },
  {
    title: 'No',
    value: 'No'
  }
];

const useStyles = makeStyles(() => ({
  radioButton: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    border: '1px solid #DAE6E5',
    borderRadius: 8,
    '& div': {
      flex: 1,
      textAlign: 'center',
      padding: '30px 0',
      '&:first-child': {
        borderRight: '1px solid #DAE6E5'
      }
    },
    '& .MuiRadio-colorSecondary': {
      color: '#65CB63 !important'
    },
    '& .MuiFormControlLabel-label': {
      fontStyle: 'normal',
      fontWeight: 600,
      fontSize: '16px',
      lineHeight: '104.5%',
      color: '#2D3047',
      opacity: '0.9'
    }
  }
}));

export default function StreamingTab({ songData, setSongData }) {
  const classes = useStyles();
  const modalClasses = useCreateSongStyles();

  return (
    <div style={{ color: '#2D3047' }}>
      <Box mt={2} fontSize={22} fontWeight={600}>
        Do you want this track NFT to earn streaming revenues when streamed on
        Myx?
      </Box>
      {/* <Box mt={2} textAlign="center">
        Streaming is coming soon 💪
      </Box> */}
      <Box mt={2} display="flex" justifyContent="center">
        <RadioGroup
          className={classes.radioButton}
          row
          aria-label="streaming"
          name="streaming"
          value={songData.isMakeStreaming ? 'Yes' : 'No'}
          onChange={(e) => {
            // console.log(e.target.value);
            setSongData({
              ...songData,
              isMakeStreaming: e.target.value === 'Yes' ? true : false
            });
          }}
        >
          {readioOptions.map((item, index) => (
            <div
              style={{
                background:
                  (songData.isMakeStreaming && index === 0) ||
                  (!songData.isMakeStreaming && index === 1)
                    ? 'linear-gradient(0deg, #F2FBF6, #F2FBF6), #17172D'
                    : 'linear-gradient(0deg, rgba(218, 230, 229, 0.06), rgba(218, 230, 229, 0.06))'
              }}
              key={`switch_${index}`}
            >
              <FormControlLabel
                style={{ marginLeft: 0 }}
                value={item.value}
                control={<Radio />}
                label={item.title}
              />
            </div>
          ))}
        </RadioGroup>
      </Box>
      <Box
        mt={4}
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
          If there are multiple owners of this track, we recommend using
          Capsules
        </Box>
      </Box>
    </div>
  );
}

const WarningIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13.5 9.875C13.5 9.46079 13.1642 9.125 12.75 9.125C12.3358 9.125 12 9.46079 12 9.875H13.5ZM12 14.8625C12 15.2767 12.3358 15.6125 12.75 15.6125C13.1642 15.6125 13.5 15.2767 13.5 14.8625L12 14.8625ZM13.5 16.9929C13.5 16.5787 13.1642 16.2429 12.75 16.2429C12.3358 16.2429 12 16.5787 12 16.9929H13.5ZM12 17C12 17.4142 12.3358 17.75 12.75 17.75C13.1642 17.75 13.5 17.4142 13.5 17H12ZM12 9.875L12 14.8625L13.5 14.8625L13.5 9.875H12ZM12 16.9929V17H13.5V16.9929H12Z"
      fill="#FF8E3C"
    />
    <path
      d="M12.6132 4L4.0625 19.75H21.4375L12.6132 4Z"
      stroke="#FF8E3C"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);
