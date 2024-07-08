import React, { useEffect, useRef, useState, useCallback } from 'react';
import axios from 'axios';
import { SocialPrimaryButton } from 'components/MusicDao/index.styles';
import useIPFS from 'shared/utils-IPFS/useIPFS';
import { useAlertMessage } from 'shared/hooks/useAlertMessage';
import { Modal } from 'shared/ui-kit';
import InputWithLabelAndTooltip from 'shared/ui-kit/InputWithLabelAndTooltip';
import Box from 'shared/ui-kit/Box';
import FileUpload from 'shared/ui-kit/Page-components/FileUpload';
import { createArtist } from 'shared/services/API';
import { onUploadNonEncrypt } from 'shared/ipfs/upload';
import { getURLfromCID } from 'shared/functions/ipfs/upload2IPFS';
import { modalStyles } from './AddArtistModal.styles';
import { LoadingWrapper } from 'shared/ui-kit/Hocs';

const initialArtistState = {
  name: '',
  twitter: '',
  instagram: '',
  imageUrl: '',
  address: ''
};
const AddArtistModal = ({ open, onCloseModal, handleRefresh }) => {
  const classes = modalStyles();
  const { uploadWithNonEncryption } = useIPFS();
  const [artist, setArtist] = useState(initialArtistState);
  const { showAlertMessage } = useAlertMessage();
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [photoImg, setPhotoImg] = useState('');

  const onClose = () => {
    setArtist(initialArtistState);
    setPhoto(null);
    setPhotoImg('');
    onCloseModal();
  };

  const addArtist = useCallback(async () => {
    console.log(artist, photoImg);
    if (!artist?.name) {
      showAlertMessage('Artist Name is required', { variant: 'error' });
      return;
    }
    if (!photo) {
      showAlertMessage('Artist Image is required', { variant: 'error' });
      return;
    }
    const infoImage = await onUploadNonEncrypt(photo, (file) =>
      uploadWithNonEncryption(file, false)
    );
    const res = await createArtist(
      artist?.name,
      artist?.twitter?.replace('https://twitter.com/', ''),
      artist?.instagram?.replace('https://instagram.com/', ''),
      `${getURLfromCID(infoImage.newFileCID)}/${
        infoImage.metadata.properties.name
      }`,
      infoImage,
      artist?.address
    );
    if (res.success) {
      showAlertMessage('Added new artist', { variant: 'success' });
      onClose();
      handleRefresh();
    } else {
      showAlertMessage(
        res.validations ? res.validations[0].message : 'Something went wrong',
        { variant: 'error' }
      );
      return;
    }
  }, [artist, photoImg, showAlertMessage]);

  return (
    <Modal
      className={classes.root}
      size="medium"
      isOpen={open}
      onClose={onClose}
      showCloseIcon
    >
      <>
        <div className={classes.title}>Add New Artist</div>
        <Box mb={2}>
          <InputWithLabelAndTooltip
            type={'text'}
            inputValue={artist.name}
            onInputValueChange={(elem) => {
              setArtist({
                ...artist,
                name: elem.target.value
              });
            }}
            labelName="Artist Name"
            placeHolder={'Enter artist name'}
            required={true}
            labelSuffix="*"
            theme="music dao"
          />
        </Box>
        <Box mb={2}>
          <Box className={classes.label} mb={1}>
            <div style={{ position: 'relative' }}>
              Artist Image
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  right: -10,
                  color: '#F43E5F'
                }}
              >
                *
              </div>
            </div>
          </Box>
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
        <Box mb={2}>
          <InputWithLabelAndTooltip
            type={'text'}
            inputValue={artist.address}
            onInputValueChange={(elem) => {
              setArtist({
                ...artist,
                address: elem.target.value
              });
            }}
            labelName="Address"
            placeHolder={'Add artist address(Optional)'}
            theme="music dao"
          />
        </Box>
        <Box mb={2}>
          <InputWithLabelAndTooltip
            type={'text'}
            inputValue={artist.twitter}
            onInputValueChange={(elem) => {
              setArtist({
                ...artist,
                twitter: elem.target.value
              });
            }}
            labelName="Twitter"
            placeHolder={'Add twitter nickname of artist(Optional)'}
            theme="music dao"
          />
        </Box>
        <Box mb={2}>
          <InputWithLabelAndTooltip
            type={'text'}
            inputValue={artist.instagram}
            onInputValueChange={(elem) => {
              setArtist({
                ...artist,
                instagram: elem.target.value
              });
            }}
            labelName="Instagram"
            placeHolder={'Add instagram nickname of artist(Optional)'}
            theme="music dao"
          />
        </Box>
      </>
      <div className={classes.editButton}>
        {loading ? (
          <LoadingWrapper loading />
        ) : (
          <SocialPrimaryButton className={'btnBody'} onClick={addArtist}>
            Add
          </SocialPrimaryButton>
        )}
      </div>
    </Modal>
  );
};

export default AddArtistModal;
