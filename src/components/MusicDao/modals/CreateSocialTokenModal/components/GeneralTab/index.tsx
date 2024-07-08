import React, { useEffect, useState } from 'react';

import Box from 'shared/ui-kit/Box';
import { BlockchainNets } from 'shared/constants/constants';
import InputWithLabelAndTooltip from 'shared/ui-kit/InputWithLabelAndTooltip';
import { BlockchainTokenSelect } from '../BlockchainTokenSelect';
import FileUpload from 'shared/ui-kit/Page-components/FileUpload';

export default function CreateSocialTokenGeneralTab({
  socialToken,
  setSocialToken
}) {
  const [photoImg, setPhotoImg] = useState<any>();
  const [img, setImg] = useState<any>();
  const [dimension, setDimension] = useState<any>({});

  useEffect(() => {
    if (dimension.dimensions) {
      setSocialToken((prev) => ({ ...prev, dimensions: dimension.dimensions }));
    }
  }, [dimension.dimensions]);

  useEffect(() => {
    if (img) {
      setSocialToken((prev) => ({ ...prev, photo: img }));
    }
  }, [img]);

  useEffect(() => {
    if (photoImg) {
      setSocialToken((prev) => ({ ...prev, photoImg: photoImg }));
    }
  }, [photoImg]);

  useEffect(() => {
    if (socialToken && socialToken.photo) {
      setImg(socialToken.photo);
    }
  }, [socialToken.photo]);

  useEffect(() => {
    if (socialToken && socialToken.photoImg) {
      setPhotoImg(socialToken.photoImg);
    }
  }, [socialToken.photoImg]);

  return (
    <>
      <Box mb={2}>
        <InputWithLabelAndTooltip
          labelName="How do you want your Social Token to be called?"
          type="text"
          // tooltip="Enter your token name"
          inputValue={socialToken.TokenName}
          onInputValueChange={(e) => {
            setSocialToken({ ...socialToken, TokenName: e.target?.value });
          }}
          theme="music dao"
        />
      </Box>
      <Box mb={2}>
        <InputWithLabelAndTooltip
          labelName="Can you give us a Symbol for it?"
          // tooltip="Choose an identifier for you token. Must be from 3 to 6 characters"
          inputValue={socialToken.TokenSymbol}
          onInputValueChange={(e) => {
            setSocialToken({ ...socialToken, TokenSymbol: e.target?.value });
          }}
          type="text"
          theme="music dao"
        />
      </Box>
      <Box mb={2}>
        <InputWithLabelAndTooltip
          labelName="Token Description"
          // tooltip="Provide more details about your token"
          type="textarea"
          inputValue={socialToken.Description}
          onInputValueChange={(e) => {
            setSocialToken({ ...socialToken, Description: e.target?.value });
          }}
          theme="music dao"
        />
      </Box>
      <label style={{ marginBottom: '10px' }}>Image</label>
      <FileUpload
        theme="music dao"
        photo={img}
        photoImg={photoImg}
        setterPhoto={setImg}
        setterPhotoImg={setPhotoImg}
        mainElement={dimension}
        mainSetter={setDimension}
        type="image"
        canEdit={true}
      />
      <label style={{ marginTop: '16px' }}>Select Chain</label>
      <BlockchainTokenSelect
        socialToken={socialToken}
        setSocialToken={setSocialToken}
        BlockchainNets={BlockchainNets}
      />
    </>
  );
}
