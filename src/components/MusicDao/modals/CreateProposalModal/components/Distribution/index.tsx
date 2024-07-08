import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';

import Box from 'shared/ui-kit/Box';
import FileUpload from 'shared/ui-kit/Page-components/FileUpload';
import InputWithLabelAndTooltip from 'shared/ui-kit/InputWithLabelAndTooltip';

import { distributionStyles } from './index.styles';

const Distribution = ({
  pod,
  setPod,
  photo,
  photoImg,
  setPhoto,
  setPhotoImg
}) => {
  const classes = distributionStyles();
  return (
    <Box>
      <Box className={classes.title} mb={3}>
        Investment Conditions
      </Box>
      <Box display="flex" alignItems="center">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={8}>
            <Box className={classes.leftSection}>
              <Box>
                <Box>Image</Box>
                <FileUpload
                  photo={photo}
                  photoImg={photoImg}
                  setterPhoto={setPhoto}
                  setterPhotoImg={setPhotoImg}
                  mainSetter={undefined}
                  mainElement={undefined}
                  type="image"
                  canEdit
                  isEditable
                  extra
                  theme="music dao"
                />
              </Box>
              <Box mt={3}>
                <InputWithLabelAndTooltip
                  theme="music dao pod"
                  type="number"
                  inputValue={pod.nftNumber}
                  onInputValueChange={(e) => {
                    setPod({ ...pod, nftNumber: e.target.value });
                  }}
                  labelName="Number of that nft on that category"
                  // labelSuffix="*"
                  placeHolder="0"
                  // tooltip={`Please give your Capsule a name, remember you will not be able to change this in the future.`}
                />
              </Box>
              <Box mt={3}>
                <InputWithLabelAndTooltip
                  theme="music dao pod"
                  type="number"
                  inputValue={pod.nftPrice}
                  onInputValueChange={(e) => {
                    setPod({ ...pod, nftPrice: e.target.value });
                  }}
                  labelName="Price per NFT"
                  placeHolder="00.00"
                  // tooltip={`Please give your Capsule a name, remember you will not be able to change this in the future.`}
                />
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box className={classes.rightSection}>
              <Box className={classes.totalRise}>Total Raise</Box>
              <Box className={classes.totalValue}>2245 MF</Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Distribution;
