import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';

import Box from 'shared/ui-kit/Box';

import { createPlayListModalStyles } from './index.styles';
import { Modal, PrimaryButton } from 'shared/ui-kit';
import InputWithLabelAndTooltip from 'shared/ui-kit/InputWithLabelAndTooltip';
import URL from 'shared/functions/getURL';
import { useSelector } from 'react-redux';
import { RootState } from 'store/reducers/Reducer';
import { InfoTooltip } from 'shared/ui-kit/InfoTooltip';
import FileUpload from 'shared/ui-kit/Page-components/FileUpload';
import { onUploadNonEncrypt } from 'shared/ipfs/upload';
import useIPFS from 'shared/utils-IPFS/useIPFS';
import CustomSwitch from 'shared/ui-kit/CustomSwitch';
import { useAlertMessage } from 'shared/hooks/useAlertMessage';
import { getURLfromCID } from 'shared/functions/ipfs/upload2IPFS';
import { LoadingWrapper } from 'shared/ui-kit/Hocs';
import CreatingPlayListModal from '../CreatingPlayListModal';

export default function CreatePlaylistModal({
  open,
  handleClose,
  handleRefresh,
  item
}) {
  //HOOKS
  const [playlist, setPlaylist] = useState<any>({
    Title: '',
    Description: '',
    playListImg: '',
    coverImg: '',
    isPublic: false
  });

  const [metadataPhotoPlayList, setMetadataPhotoPlayList] = useState<any>();
  const [photoPlayList, setPhotoPlayList] = useState<any>(null);

  const [metadataPhotoCover, setMetadataPhotoCover] = useState<any>();
  const [photoCover, setPhotoCover] = useState<any>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isCreated, setIsCreated] = useState<boolean | undefined>();
  const [newPlaylistId, setNewPlaylistId] = useState<any>();

  const userSelector = useSelector((state: RootState) => state.user);
  const { uploadWithNonEncryption } = useIPFS();
  const { showAlertMessage } = useAlertMessage();

  const classes = createPlayListModalStyles();

  useEffect(() => {
    if (item) {
      let updatingItem = { ...item };
      updatingItem.playListImg = item.ImageUrl;
      updatingItem.coverImg = item.CoverImage;
      setPlaylist(updatingItem);
      setPhotoPlayList(item.ImageUrl);
      setPhotoCover(item.CoverImage);
    } else {
      setPlaylist({
        Title: '',
        Description: '',
        playListImg: '',
        coverImg: '',
        isPublic: false
      });
    }
  }, [item]);

  const handleSaveChanges = async () => {
    if (!validate()) {
      return;
    }

    try {
      setIsCreating(true);
      let newPlaylist = { ...playlist };
      newPlaylist.id = playlist.id ?? undefined;
      newPlaylist.CreatorId = userSelector.id;
      newPlaylist.listImage = metadataPhotoPlayList
        ? `${getURLfromCID(metadataPhotoPlayList.newFileCID)}/${
            metadataPhotoPlayList.metadata.properties.name
          }`
        : playlist.playListImg;
      newPlaylist.coverImage = metadataPhotoCover
        ? `${getURLfromCID(metadataPhotoCover.newFileCID)}/${
            metadataPhotoCover.metadata.properties.name
          }`
        : playlist.coverImg;

      const resp = await axios.post(
        `${URL()}/media/createPlaylist`,
        newPlaylist
      );
      if (resp.data.success) {
        handleRefresh(resp.data.playlist);
        setNewPlaylistId(resp.data.playlist.id);
        setPlaylist({ ...newPlaylist });
        setIsCreated(true);
      }
    } catch (err) {
      setIsCreated(false);
    } finally {
      setIsCreating(false);
    }
  };

  const uploadPlayListImage = async (value) => {
    setPhotoPlayList(value);
    if (value) {
      let metadataPhoto = await onUploadNonEncrypt(value, (file) =>
        uploadWithNonEncryption(file)
      );
      setMetadataPhotoPlayList(metadataPhoto);
    } else {
      setMetadataPhotoPlayList(value);
    }
  };
  const uploadCoverImage = async (value) => {
    setPhotoCover(value);
    if (value) {
      let metadataPhoto = await onUploadNonEncrypt(value, (file) =>
        uploadWithNonEncryption(file)
      );
      setMetadataPhotoCover(metadataPhoto);
    } else {
      setMetadataPhotoCover(value);
    }
  };

  const onChangePublicity = () => {
    setPlaylist({ ...playlist, isPublic: !playlist.isPublic });
  };

  const validate = () => {
    if (!playlist.Title) {
      showAlertMessage(`Name is required`, { variant: 'error' });
      return false;
    } else if (!metadataPhotoPlayList && !item) {
      showAlertMessage(`You need to upload Playlist Thumbnail.`, {
        variant: 'error'
      });
      return false;
    } else if (!metadataPhotoCover && !item) {
      showAlertMessage(`You need to upload Cover Image.`, { variant: 'error' });
      return false;
    }
    return true;
  };

  return isCreating || isCreated !== undefined ? (
    <CreatingPlayListModal
      open={open}
      onClose={handleClose}
      transactionInProgress={isCreating}
      transactionSuccess={!!isCreated}
      newPlaylistId={newPlaylistId}
    />
  ) : (
    <Modal
      className={classes.root}
      size="medium"
      isOpen={open}
      onClose={handleClose}
      showCloseIcon
    >
      <div>
        <div className={classes.content}>
          <Box
            display="flex"
            alignItems="center"
            marginBottom="34px"
            justifyContent="center"
          >
            <h5 style={{ margin: 0 }}>{`Create Playlist`}</h5>
          </Box>
          <Box mt={2}>
            <InputWithLabelAndTooltip
              labelName="Name"
              placeHolder="Your name..."
              type="text"
              // tooltip="Enter your track name"
              inputValue={playlist.Title}
              onInputValueChange={(e) => {
                setPlaylist({
                  ...playlist,
                  Title: e.target.value
                });
              }}
              theme="dark"
            />
          </Box>
          <Box mt={2}>
            <InputWithLabelAndTooltip
              theme="dark"
              type="textarea"
              inputValue={playlist.Description}
              onInputValueChange={(e) => {
                setPlaylist({
                  ...playlist,
                  Description: e.target.value
                });
              }}
              labelName="Description"
              placeHolder="Write your description..."
              // tooltip={}
              required
            />
          </Box>
          <Box mt={2}>
            <Box className={classes.flexBox} justifyContent="space-between">
              <label>Playlist Thumbnail</label>
              <InfoTooltip tooltip="We recommend max 8MB" />
            </Box>
            <Box
              width={1}
              className={playlist.playListImg ? classes.uploadBox : ''}
              mt={1}
            >
              <FileUpload
                theme="dark"
                photo={photoPlayList}
                photoImg={playlist.playListImg}
                setterPhoto={uploadPlayListImage}
                setterPhotoImg={(value) => {
                  setPlaylist({ ...playlist, playListImg: value });
                }}
                mainSetter={undefined}
                mainElement={undefined}
                type="image"
                canEdit
                isEditable
                extra
              />
            </Box>
          </Box>
          <Box mt={2}>
            <Box className={classes.flexBox} justifyContent="space-between">
              <label>Cover Image</label>
              <InfoTooltip tooltip="We recommend max 8MB" />
            </Box>
            <Box
              width={1}
              className={playlist.coverImg ? classes.uploadBox : ''}
              mt={1}
            >
              <FileUpload
                theme="dark"
                photo={photoCover}
                photoImg={playlist.coverImg}
                setterPhoto={uploadCoverImage}
                setterPhotoImg={(value) => {
                  setPlaylist({ ...playlist, coverImg: value });
                }}
                mainSetter={undefined}
                mainElement={undefined}
                type="image"
                canEdit
                isEditable
                extra
              />
            </Box>
          </Box>

          <Box my={4}>
            <Box className={classes.flexBox} justifyContent="space-between">
              <label>Make public</label>
              <CustomSwitch
                checked={playlist.isPublic}
                theme="music dao"
                onChange={onChangePublicity}
              />
            </Box>
          </Box>

          {/* <Box className={classes.tipBox} my={4}>
            By continuing, you agree to grant Music Trax access to the image you
            select to upload. Make sure you have the right to upload the image.
          </Box> */}

          <Box
            style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
          >
            {isCreating ? (
              <LoadingWrapper loading />
            ) : (
              <PrimaryButton
                className={classes.createBtn}
                onClick={handleSaveChanges}
                size="medium"
              >
                {item ? 'Update Playlist' : 'Create Playlist'}
              </PrimaryButton>
            )}
          </Box>
        </div>
      </div>
    </Modal>
  );
}
