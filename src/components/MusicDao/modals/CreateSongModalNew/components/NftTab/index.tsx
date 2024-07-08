import React, { useState, useMemo, useEffect } from 'react';

import makeStyles from '@material-ui/core/styles/makeStyles';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import Box from 'shared/ui-kit/Box';
import InputWithLabelAndTooltip from 'shared/ui-kit/InputWithLabelAndTooltip';
import FileUpload from 'shared/ui-kit/Page-components/FileUpload';

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

const premiumEditions = [
  {
    name: 'Bronze',
    color: '#8B3809',
    image: 'assets/icons/edition_bronze.webp'
  },
  {
    name: 'Silver',
    color: '#8B3809',
    image: 'assets/icons/edition_silver.webp'
  }
];

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
    marginBottom: 16
  }
}));

export default function NftTab({ songData, setSongData, uploadEditionImg }) {
  const classes = useStyles();

  const [photo, setPhoto] = useState<any>();
  const [photoImg, setPhotoImg] = useState<any>();

  // const [photoBronze, setPhotoBronze] = useState<any>();
  // const [photoSilver, setPhotoSilver] = useState<any>();
  // const [photoGold, setPhotoGold] = useState<any>();
  // const [photoPlatinum, setPhotoPlatinum] = useState<any>();

  // const [photoBronzeImg, setPhotoBronzeImg] = useState<any>();
  // const [photoSilverImg, setPhotoSilverImg] = useState<any>();
  // const [photoGoldImg, setPhotoGoldImg] = useState<any>();
  // const [photoPlatinumImg, setPhotoPlatinumImg] = useState<any>();

  const handleClick = (e, edition) => {
    if (edition !== songData.edition) {
      e.stopPropagation();
      e.preventDefault();
      setSongData({ ...songData, edition: edition });
    }
  };
  return (
    <div style={{ color: '#2D3047' }}>
      <Box className={classes.label}>
        <Box mt={2} fontSize={22} fontWeight={600}>
          Select NFT option
        </Box>
        {/* <InfoTooltip tooltip="The royalty % is viewable for any prospective buyer to see as NFT details on OpenSea (you can also past contract address on Polygonscan)." /> */}
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
              editionType: e.target.value
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
        <Box mt={2}>
          <InputWithLabelAndTooltip
            style={{ fontSize: 20 }}
            labelName="Track count"
            placeHolder="Your track count"
            labelSuffix="*"
            inputValue={songData.amount}
            onInputValueChange={(e) => {
              setSongData({ ...songData, amount: e.target?.value });
            }}
            type="number"
            minValue={2}
            theme="music dao"
            tooltip="Please indicate the number of NFTs that you want to be created from this track. You can select as many as you would like. Recommendation: larger artists can benefit from a single NFT (1/1) as just the one could likely yield a maximum sale, while smaller more grassroots artists could benefit from multiple NFTs, with greater room for price growth and more sales."
          />
        </Box>
      ) : (
        <Box mt={5}>
          <Box
            className={classes.editionSection}
            style={{
              cursor: songData.edition === 'Bronze' ? 'auto' : 'pointer',
              opacity: songData.edition === 'Bronze' ? 1 : 0.5
            }}
            onClick={(e) => {
              handleClick(e, 'Bronze');
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img
                src={require('assets/icons/edition_bronze.webp')}
                alt="edition"
                style={{ width: 70, height: 70 }}
              />
              <Box ml="20px" width={1}>
                <InputWithLabelAndTooltip
                  style={{
                    fontSize: 20,
                    color: '#8B3809',
                    cursor: songData.edition === 'Bronze' ? 'auto' : 'pointer'
                  }}
                  labelName="Amount of Bronze Editions"
                  // placeHolder=""
                  // labelSuffix="*"
                  inputValue={songData.amount}
                  onInputValueChange={(e) => {
                    setSongData({ ...songData, amount: e.target?.value });
                  }}
                  type="number"
                  minValue={2}
                  theme="music dao"
                  // tooltip=""
                />
              </Box>
            </div>
            <Box mt={2} display="flex" alignItems="center">
              <div style={{ width: 70, height: 70 }} />
              <Box ml="20px" width={1}>
                <label style={{ position: 'relative' }}>
                  Edition Image (Optional)
                </label>
                <Box
                  width={1}
                  className={photoImg ? classes.uploadBox : ''}
                  mt={1}
                >
                  <FileUpload
                    theme="music dao"
                    photo={songData.edition === 'Bronze' ? photo : undefined}
                    photoImg={
                      songData.edition === 'Bronze' ? photoImg : undefined
                    }
                    setterPhoto={(value) => {
                      setPhoto(value);
                      uploadEditionImg(value);
                    }}
                    setterPhotoImg={(value) => {
                      setPhotoImg(value);
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
          <Box
            className={classes.editionSection}
            style={{
              cursor: songData.edition === 'Silver' ? 'auto' : 'pointer',
              opacity: songData.edition === 'Silver' ? 1 : 0.5
            }}
            onClick={(e) => {
              handleClick(e, 'Silver');
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img
                src={require('assets/icons/edition_silver.webp')}
                alt="edition"
                style={{ width: 70, height: 70 }}
              />
              <Box ml="20px" width={1}>
                <InputWithLabelAndTooltip
                  style={{
                    fontSize: 20,
                    color: '#858585',
                    cursor: songData.edition === 'Silver' ? 'auto' : 'pointer'
                  }}
                  labelName="Amount of Silver Editions"
                  // placeHolder=""
                  // labelSuffix="*"
                  inputValue={songData.amount}
                  onInputValueChange={(e) => {
                    setSongData({ ...songData, amount: e.target?.value });
                  }}
                  type="number"
                  minValue={2}
                  theme="music dao"
                  // tooltip=""
                />
              </Box>
            </div>
            <Box mt={2} display="flex" alignItems="center">
              <div style={{ width: 70, height: 70 }} />
              <Box ml="20px" width={1}>
                <label style={{ position: 'relative' }}>
                  Edition Image (Optional)
                </label>
                <Box
                  width={1}
                  className={photoImg ? classes.uploadBox : ''}
                  mt={1}
                >
                  <FileUpload
                    theme="music dao"
                    photo={songData.edition === 'Silver' ? photo : undefined}
                    photoImg={
                      songData.edition === 'Silver' ? photoImg : undefined
                    }
                    setterPhoto={(value) => {
                      setPhoto(value);
                      uploadEditionImg(value);
                    }}
                    setterPhotoImg={(value) => {
                      setPhotoImg(value);
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
          <Box
            className={classes.editionSection}
            style={{
              cursor: songData.edition === 'Gold' ? 'auto' : 'pointer',
              opacity: songData.edition === 'Gold' ? 1 : 0.5
            }}
            onClick={(e) => {
              handleClick(e, 'Gold');
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img
                src={require('assets/icons/edition_gold.webp')}
                alt="edition"
                style={{ width: 70, height: 70 }}
              />
              <Box ml="20px" width={1}>
                <InputWithLabelAndTooltip
                  style={{
                    fontSize: 20,
                    color: '#CDA049',
                    cursor: songData.edition === 'Gold' ? 'auto' : 'pointer'
                  }}
                  labelName="Amount of Gold Editions"
                  // placeHolder=""
                  // labelSuffix="*"
                  inputValue={songData.amount}
                  onInputValueChange={(e) => {
                    setSongData({ ...songData, amount: e.target?.value });
                  }}
                  type="number"
                  minValue={2}
                  theme="music dao"
                  // tooltip=""
                />
              </Box>
            </div>
            <Box mt={2} display="flex" alignItems="center">
              <div style={{ width: 70, height: 70 }} />
              <Box ml="20px" width={1}>
                <label style={{ position: 'relative' }}>
                  Edition Image (Optional)
                </label>
                <Box
                  width={1}
                  className={photoImg ? classes.uploadBox : ''}
                  mt={1}
                >
                  <FileUpload
                    theme="music dao"
                    photo={songData.edition === 'Gold' ? photo : undefined}
                    photoImg={
                      songData.edition === 'Gold' ? photoImg : undefined
                    }
                    setterPhoto={(value) => {
                      setPhoto(value);
                      uploadEditionImg(value);
                    }}
                    setterPhotoImg={(value) => {
                      setPhotoImg(value);
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
          <Box
            className={classes.editionSection}
            style={{
              cursor: songData.edition === 'Platinum' ? 'auto' : 'pointer',
              opacity: songData.edition === 'Platinum' ? 1 : 0.5
            }}
            onClick={(e) => {
              handleClick(e, 'Platinum');
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img
                src={require('assets/icons/edition_platinum.webp')}
                alt="edition"
                style={{ width: 70, height: 70 }}
              />
              <Box ml="20px" width={1}>
                <InputWithLabelAndTooltip
                  style={{
                    fontSize: 20,
                    color: '#8B3809',
                    cursor: songData.edition === 'Platinum' ? 'auto' : 'pointer'
                  }}
                  labelName="Amount of Platinum Editions"
                  // placeHolder=""
                  // labelSuffix="*"
                  inputValue={songData.amount}
                  onInputValueChange={(e) => {
                    setSongData({ ...songData, amount: e.target?.value });
                  }}
                  type="number"
                  minValue={2}
                  theme="music dao"
                  // tooltip=""
                />
              </Box>
            </div>
            <Box mt={2} display="flex" alignItems="center">
              <div style={{ width: 70, height: 70 }} />
              <Box ml="20px" width={1}>
                <label style={{ position: 'relative' }}>
                  Edition Image (Optional)
                </label>
                <Box
                  width={1}
                  className={photoImg ? classes.uploadBox : ''}
                  mt={1}
                >
                  <FileUpload
                    theme="music dao"
                    photo={songData.edition === 'Platinum' ? photo : undefined}
                    photoImg={
                      songData.edition === 'Platinum' ? photoImg : undefined
                    }
                    setterPhoto={(value) => {
                      setPhoto(value);
                      uploadEditionImg(value);
                    }}
                    setterPhotoImg={(value) => {
                      setPhotoImg(value);
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
        </Box>
      )}
    </div>
  );
}
