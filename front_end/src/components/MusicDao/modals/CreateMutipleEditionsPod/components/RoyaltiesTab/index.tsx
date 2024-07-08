import React from 'react';

import makeStyles from '@material-ui/core/styles/makeStyles';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import Box from 'shared/ui-kit/Box';
import InputWithLabelAndTooltip from 'shared/ui-kit/InputWithLabelAndTooltip';
import { Color } from 'shared/ui-kit';

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
      padding: '4px 0',
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

  label: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    color: '#2D3047',
    opacity: 0.9,

    fontSize: '16px',
    fontWeight: 600
  },

  royaltyShareSection: {
    background: 'linear-gradient(0deg, #F2FBF6, #F2FBF6), #17172D',
    border: '1px solid #65CB63',
    borderRadius: 12,
    padding: '30px 20px',
    marginTop: 24
  }
}));

export default function RoyaltiesTab({ songData, setSongData }) {
  const classes = useStyles();

  return (
    <div style={{ color: '#2D3047' }}>
      <Box className={classes.label}>
        <Box mt={2} fontSize={22} fontWeight={600}>
          Do you want royalties from secondary sales of the NFT(s)?
        </Box>
        {/* <InfoTooltip tooltip="The royalty % is viewable for any prospective buyer to see as NFT details on OpenSea (you can also past contract address on Polygonscan)." /> */}
      </Box>
      <Box mt={3} fontSize={18}>
        Every time the NFT is traded on OpenSea or Myx, NFT holders can receive
        royalties to their wallet address.
      </Box>
      <Box mt={2} display="flex" justifyContent="center">
        <RadioGroup
          className={classes.radioButton}
          row
          aria-label="streaming"
          name="streaming"
          value={songData.isRoyaltyShare ? 'Yes' : 'No'}
          onChange={(e) => {
            setSongData({
              ...songData,
              isRoyaltyShare: e.target.value === 'Yes' ? true : false
            });
          }}
        >
          {readioOptions.map((item, index) => (
            <div
              style={{
                background:
                  (songData.isRoyaltyShare && index === 0) ||
                  (!songData.isRoyaltyShare && index === 1)
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
      {songData.isRoyaltyShare && (
        <div className={classes.royaltyShareSection}>
          <Box>
            <InputWithLabelAndTooltip
              style={{
                height: 100,
                fontSize: 32,
                fontWeight: 'bold',
                color: Color.MusicDAOBlue
              }}
              labelName="Royalty share"
              labelSuffix="*"
              placeHolder="00.00"
              endAdornment="%"
              inputValue={songData.royaltyShare}
              onInputValueChange={(value) => {
                setSongData({
                  ...songData,
                  royaltyShare: value
                });
              }}
              type="euro-number"
              referenceValue="object"
              theme="music dao"
              tooltip="The royalty % is viewable for any prospective buyer to see as NFT details on OpenSea (you can also past contract address on Polygonscan)."
              // tooltip="This is the percentage earned every time your Track NFT is sold on an NFT marketplace, like OpenSea"
            />
          </Box>
          {/* <Box mt={2}>
            <InputWithLabelAndTooltip
              labelName="Royalty recipient address"
              labelSuffix="*"
              placeHolder="Paste wallet address here, it will receive royalty %"
              inputValue={songData.royaltyRecipientAddress}
              onInputValueChange={(e) => {
                setSongData({
                  ...songData,
                  royaltyRecipientAddress: e.target?.value
                });
              }}
              type="text"
              theme="music dao"
              tooltip="This is the wallet address (ERC-20, ie Metamask, etc) where royalties from all secondary NFT sales will go. You cannot change this address at a later date."
            />
          </Box> */}
        </div>
      )}
    </div>
  );
}
