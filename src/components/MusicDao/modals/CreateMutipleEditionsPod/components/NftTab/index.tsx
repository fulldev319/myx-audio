import React, { useState } from 'react';

import makeStyles from '@material-ui/core/styles/makeStyles';
import Grid from '@material-ui/core/Grid';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import Box from 'shared/ui-kit/Box';
import InputWithLabelAndTooltip from 'shared/ui-kit/InputWithLabelAndTooltip';
import FileUpload from 'shared/ui-kit/Page-components/FileUpload';
import { Color } from 'shared/ui-kit';

const editionTypes = [
  {
    title: 'Regular Editions',
    value: 'Regular'
  },
  {
    title: 'Premium editions',
    value: 'Premium'
  }
];

const PremiumType = ['Bronze', 'Silver', 'Gold', 'Platinum'];

const useStyles = makeStyles((theme) => ({
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
  uploadBox: {
    background: '#F0F5F5',
    borderRadius: theme.spacing(1),
    padding: `${theme.spacing(5)}px ${theme.spacing(5)}px`
  },
  editionSection: {
    borderRadius: 24,
    border: '1px solid rgba(84, 101, 143, 0.3)',
    padding: 16,
    flex: 1
  },
  revenueBox: {
    background: '#E4F4FF',
    border: '1px solid #92CAFF',
    padding: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.spacing(1),
    marginLeft: theme.spacing(1)
  },
  greenBox: {
    background: 'linear-gradient(0deg, #F2FBF6, #F2FBF6), #17172D',
    border: '1px solid #57CB55',
    padding: theme.spacing(2),
    borderRadius: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%'
  },
  maxRevenue: {
    fontSize: 28,
    fontWeight: 700,
    fontStyle: 'italic',
    color: Color.MusicDAOBlue,
    lineHeight: '29.26px'
  },
  editionInput: {
    height: 100,
    color: '#2D3047',
    width: '100%',
    border: '1px solid #DADADB',
    // height: '45px',
    padding: '11px 19px',
    fontSize: '14px',
    background: 'rgba(218, 230, 229, 0.4)',
    boxSizing: 'border-box',
    marginTop: theme.spacing(1),
    borderRadius: '8px',
    outline: 'none',
    fontWeight: 500,
    '& input': {
      border: 'none',
      background: 'transparent',
      margin: 0,
      padding: 0,
      fontSize: 32,
      fontWeight: 'bold',
      color: Color.MusicDAOBlue
    }
  }
}));

export default function NftTab({ songData, setSongData, uploadEditionImg }) {
  const classes = useStyles();

  const [photos, setPhotos] = useState<any[]>([
    undefined,
    undefined,
    undefined,
    undefined
  ]);
  const [photoImgs, setPhotoImgs] = useState<any[]>([
    undefined,
    undefined,
    undefined,
    undefined
  ]);

  return (
    <div style={{ color: '#2D3047' }}>
      <Box className={classes.label}>
        <Box mt={2} fontSize={22} fontWeight={600}>
          Select NFT option
        </Box>
      </Box>
      <Box mt={2} display="flex" justifyContent="center">
        <RadioGroup
          className={classes.radioButton}
          row
          aria-label="nft-edition"
          name="nft-edition"
          value={songData.editionType}
          onChange={(e) => {
            setSongData({
              ...songData,
              editionType: e.target.value,
              editionAmounts: e.target.value === 'Regular' ? [0] : [0, 0, 0, 0],
              editionPrices: e.target.value === 'Regular' ? [0] : [0, 0, 0, 0]
            });
          }}
        >
          {editionTypes.map((item, index) => (
            <div
              style={{
                background:
                  (songData.editionType === 'Regular' && index === 0) ||
                  (songData.editionType === 'Premium' && index === 1)
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

      {songData.editionType === 'Regular' ? (
        <>
          <Box mt={5}>
            <InputWithLabelAndTooltip
              overriedClasses={classes.editionInput}
              labelName="Amount of Editions"
              placeHolder="00"
              labelSuffix="*"
              inputValue={songData.editionAmounts[0]}
              onInputValueChange={(e) => {
                const newEditionAmounts = [...songData.editionAmounts];
                newEditionAmounts[0] = e.target?.value;
                setSongData({
                  ...songData,
                  editionAmounts: newEditionAmounts
                });
              }}
              type="number"
              minValue={0}
              theme="music dao"
              tooltip="Please indicate the number of NFTs that you want to be created from this track. You can select as many as you would like. Recommendation: larger artists can benefit from a single NFT (1/1) as just the one could likely yield a maximum sale, while smaller more grassroots artists could benefit from multiple NFTs, with greater room for price growth and more sales."
            />
          </Box>
          <Box mt={3}>
            <InputWithLabelAndTooltip
              style={{
                fontSize: 32,
                fontWeight: 'bold',
                color: Color.MusicDAOBlue
              }}
              overriedClasses={classes.editionInput}
              labelName="Price of each Edition"
              placeHolder="00"
              labelSuffix="*"
              endAdornment="USDT"
              inputValue={songData.editionPrices[0]}
              onInputValueChange={(e) => {
                const newEditionPrices = [...songData.editionPrices];
                newEditionPrices[0] = e.target?.value;
                setSongData({
                  ...songData,
                  editionPrices: newEditionPrices
                });
              }}
              type="number"
              minValue={0}
              theme="music dao"
            />
          </Box>
          <Box mt={3} mb={5} className={classes.greenBox}>
            <Box mt={1} fontSize={22} fontWeight={600}>
              Total Maximum Revenue
            </Box>
            <Box className={classes.maxRevenue}>
              {songData.editionAmounts[0] * songData.editionPrices[0]} USDT
            </Box>
          </Box>
        </>
      ) : (
        <Box mt={5}>
          {PremiumType.map((title, index) => (
            <Box display="flex" mb={2} key={`edition_${index}`}>
              <Box className={classes.editionSection}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img
                    src={require(`assets/icons/edition_${title.toLowerCase()}.webp`)}
                    alt="edition"
                    style={{ width: 70, height: 70, marginRight: 16 }}
                  />
                  <Grid container spacing={2} alignItems="flex-end">
                    <Grid item xs={12} sm={6}>
                      <InputWithLabelAndTooltip
                        style={{
                          fontSize: 20,
                          color: '#8B3809',
                          cursor:
                            songData.edition === 'Bronze' ? 'auto' : 'pointer'
                        }}
                        labelName={`Amount of ${title} Editions`}
                        inputValue={songData.editionAmounts[index]}
                        onInputValueChange={(e) => {
                          const newEditionAmounts = [
                            ...songData.editionAmounts
                          ];
                          newEditionAmounts[index] = e.target?.value;
                          setSongData({
                            ...songData,
                            editionAmounts: newEditionAmounts
                          });
                        }}
                        type="number"
                        minValue={0}
                        theme="music dao"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <InputWithLabelAndTooltip
                        style={{
                          fontSize: 20,
                          color: '#8B3809',
                          cursor:
                            songData.edition === 'Bronze' ? 'auto' : 'pointer'
                        }}
                        labelName="Price"
                        inputValue={songData.editionPrices[index]}
                        onInputValueChange={(e) => {
                          const newEditionPrices = [...songData.editionPrices];
                          newEditionPrices[index] = e.target?.value;
                          setSongData({
                            ...songData,
                            editionPrices: newEditionPrices
                          });
                        }}
                        type="number"
                        minValue={0}
                        theme="music dao"
                      />
                    </Grid>
                  </Grid>
                </div>
                <Box mt={2} display="flex" alignItems="center">
                  <div style={{ width: 70, height: 70 }} />
                  <Box ml="20px" width={1}>
                    <label style={{ position: 'relative' }}>
                      Edition Image (Optional)
                    </label>
                    <Box
                      width={1}
                      className={photoImgs[index] ? classes.uploadBox : ''}
                      mt={1}
                    >
                      <FileUpload
                        theme="music dao"
                        photo={photos[index]}
                        photoImg={photoImgs[index]}
                        setterPhoto={(value) => {
                          setPhotos((prev) => {
                            const newPhotos = [...prev];
                            newPhotos[index] = value;
                            return newPhotos;
                          });
                          uploadEditionImg(value, index);
                        }}
                        setterPhotoImg={(value) => {
                          setPhotoImgs((prev) => {
                            const newPhotoImgs = [...prev];
                            newPhotoImgs[index] = value;
                            return newPhotoImgs;
                          });
                        }}
                        mainSetter={undefined}
                        mainElement={undefined}
                        type="image"
                        canEdit
                        isEditable
                        extra
                        extraText={`Up to 10mb of PNG, JPG and GIF files are allowed.\nMust be square size, minumum 400x400px`}
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Box className={classes.revenueBox}>
                <Box>Maximum Revenue</Box>
                <Box textAlign="center" style={{ fontStyle: 'italic' }}>
                  {songData.editionAmounts[index] *
                    songData.editionPrices[index]}
                  <br />
                  USDT
                </Box>
              </Box>
            </Box>
          ))}
          <Box mt={3} mb={5} className={classes.greenBox}>
            <Box mt={1} fontSize={22} fontWeight={600}>
              Total Maximum Revenue
            </Box>
            <Box className={classes.maxRevenue}>
              {songData.editionAmounts.reduce(
                (result, current, index) =>
                  result + current * songData.editionPrices[index],
                0
              )}{' '}
              USDT
            </Box>
          </Box>
        </Box>
      )}
    </div>
  );
}
