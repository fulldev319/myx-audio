import React, { useMemo } from 'react';

import makeStyles from '@material-ui/core/styles/makeStyles';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import Box from 'shared/ui-kit/Box';
import InputWithLabelAndTooltip from 'shared/ui-kit/InputWithLabelAndTooltip';
import { Color, ContentType } from 'shared/ui-kit';

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
      color: `${Color.MusicDAOBlue} !important`
    },
    '& .MuiFormControlLabel-label': {
      fontStyle: 'normal',
      fontWeight: 600,
      fontSize: '16px',
      lineHeight: '104.5%',
      color: '#2D3047',
      opacity: '0.9'
    }
  },
  editionSection: {
    borderRadius: 24,
    border: '1px solid rgba(84, 101, 143, 0.3)',
    padding: 16
  },
  soldAmount: {
    fontWeight: 600,
    fontSize: 24,
    lineHeight: '36px',
    textAlign: 'center',
    textTransform: 'uppercase',
    '& > span': {
      color: '#54658F',
      '&:first-child': {
        fontWeight: 400
      }
    }
  },
  revenueDescription: {
    fontSize: 18,
    fontWeight: 500,
    lineHeight: '27px',
    color: '#2D3047',
    opacity: 0.9
  }
}));

const PremiumType = ['Bronze', 'Silver', 'Gold', 'Platinum'];

export default function StreamingTab({ songData, setSongData, type }) {
  const classes = useStyles();

  const totalAmount = useMemo(
    () => songData.streamingRevenueShares.reduce((r, c) => r + Number(c), 0),
    [songData]
  );

  return (
    <div style={{ color: '#2D3047' }}>
      <Box mt={2} fontSize={22} fontWeight={600}>
        Do you want this track NFT to earn streaming revenues when streamed on
        Myx?
      </Box>
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
      {songData.isMakeStreaming &&
        type !== ContentType.SongSingleEdition &&
        songData.editionType !== 'Regular' && (
          <Box mt={4}>
            <Box className={classes.revenueDescription} mb={2}>
              Total of all streaming revenue shares across edition types must be
              100% (for example: Bronze 10%, Silver 20%, Gold 30%, Platinum 40%)
            </Box>
            {PremiumType.map((title, index) => (
              <Box
                className={classes.editionSection}
                mb={2}
                key={`revenue_${index}`}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img
                    src={require(`assets/icons/edition_${title.toLowerCase()}.webp`)}
                    alt="edition"
                    style={{ width: 70, height: 70, marginRight: 16 }}
                  />
                  <Box flex={1} ml={2}>
                    <InputWithLabelAndTooltip
                      style={{
                        fontSize: 20,
                        color: '#8B3809'
                      }}
                      labelName="Share of Streaming Revenue"
                      inputValue={songData.streamingRevenueShares[index]}
                      onInputValueChange={(e) => {
                        const newStreamingRevenues = [
                          ...songData.streamingRevenueShares
                        ];
                        newStreamingRevenues[index] = e.target?.value;
                        setSongData({
                          ...songData,
                          streamingRevenueShares: newStreamingRevenues
                        });
                      }}
                      type="number"
                      minValue={2}
                      maxValue={100}
                      theme="music dao"
                      endAdornment="%"
                      disabled={Number(songData.editionAmounts[index]) === 0}
                    />
                  </Box>
                </div>
              </Box>
            ))}
            <Box display="flex" justifyContent="flex-end" alignItems="center">
              <Box
                mr={2}
                style={{
                  fontSize: 18,
                  fontWeight: 500,
                  lineHeight: '27px'
                }}
              >
                Total share{' '}
              </Box>
              <Box
                className={classes.soldAmount}
                style={{
                  color: totalAmount !== 100 ? '#F43E5F' : Color.MusicDAOBlue
                }}
              >
                {totalAmount} %<span>&nbsp;/&nbsp;</span>
                <span>100 %</span>
              </Box>
            </Box>
          </Box>
        )}
    </div>
  );
}
