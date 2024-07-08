import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';

import { useTypedSelector } from 'store/reducers/Reducer';
import { getUser } from 'store/selectors';
import { useAlertMessage } from 'shared/hooks/useAlertMessage';
import { setUser } from 'store/actions/User';
import ImageCropModal from '../ProfilePage/modals/ImageCropModal';

import URL from 'shared/functions/getURL';
import getIPFSURL from 'shared/functions/getIPFSURL';
import { onUploadNonEncrypt } from 'shared/ipfs/upload';
import { PrimaryButton } from 'shared/ui-kit';
import Box from 'shared/ui-kit/Box';
import InputWithLabelAndTooltip from 'shared/ui-kit/InputWithLabelAndTooltip';
import FileUpload from 'shared/ui-kit/Page-components/FileUpload';
import useIPFS from 'shared/utils-IPFS/useIPFS';

import { activateAccountStyles } from './index.styles';

export default function ActivateAccount() {
  const classes = activateAccountStyles();
  const dispatch = useDispatch();
  const user = useTypedSelector(getUser);
  const { showAlertMessage } = useAlertMessage();
  const { setMultiAddr, uploadWithNonEncryption } = useIPFS();

  const [name, setName] = useState<string>(
    user.name || `${user.firstName} ${user.lastName}`
  );
  const [urlSlug, setUrlSlug] = useState<string>(user.urlSlug || '');
  const [photo, setPhoto] = useState<any>();
  const [photoImg, setPhotoImg] = useState<any>();

  const [openAvartaImageCropModal, setOpenAvartaImageCropModal] =
    useState<boolean>(false);

  useEffect(() => {
    setMultiAddr(`${getIPFSURL()}/api/v0`);
  }, []);

  const updateProfile = async () => {
    let firstName, lastName;
    if (name.trim()) {
      let nameSplit = name.split(' ');
      let lastNameArray = nameSplit.filter((_, i) => {
        return i !== 0;
      });
      firstName = nameSplit[0];
      lastName = '';
      for (let i = 0; i < lastNameArray.length; i++) {
        if (lastNameArray.length === i + 1) {
          lastName = lastName + lastNameArray[i];
        } else {
          lastName = lastName + lastNameArray[i] + ' ';
        }
      }
    } else {
      showAlertMessage('User name is required', { variant: 'error' });
      return;
    }

    const validTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/x-icon'
    ];
    if (!photo) {
      showAlertMessage('Profile image is required', { variant: 'error' });
      return;
    }
    if (validTypes.indexOf(photo.type) === -1) {
      showAlertMessage('Profile image is not valid', { variant: 'error' });
    }

    let metadataID = await onUploadNonEncrypt(photo, (file) =>
      uploadWithNonEncryption(file)
    );

    axios
      .post(`${URL()}/user/updateArtistProfile/${user.id}`, {
        metadataID,
        firstName,
        lastName,
        urlSlug
      })
      .then((res) => {
        if (res.data.success) {
          if (res.data.data) {
            let setterUser: any = { ...user };
            if (res.data.data.urlIpfsImage) {
              setterUser.urlIpfsImage = res.data.data.urlIpfsImage;
              setterUser.infoImage = {
                ...metadataID,
                urlIpfsImage: res.data.data.urlIpfsImage
              };
            }
            setterUser.name = name;
            setterUser.urlslug = urlSlug;
            setterUser.firstName = firstName;
            setterUser.lastName = lastName;
            setterUser.hasPhoto = true;
            if (setterUser.id) {
              dispatch(setUser(setterUser));
            }
          }
        } else {
          let errorMsg = 'Something wrong, please try again later';
          if (res.data.validations?.length) {
            errorMsg = res.data.validations[0].message;
          }
          showAlertMessage(errorMsg, { variant: 'error' });
        }
      });
  };

  const handleFiles = (file: any) => {
    if (file && file.type) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setPhotoImg(reader.result);
      });

      reader.readAsDataURL(file);
    }
  };

  return (
    <Box className={classes.contentBox}>
      <Box className={classes.title} mb={6}>
        Finish Setting Up Your Artist Account
      </Box>
      <InputWithLabelAndTooltip
        type="text"
        inputValue={name}
        onInputValueChange={(e) => {
          setName(e.target.value);
        }}
        labelName="Enter Your Name"
        labelSuffix="*"
        style={{
          marginBottom: 32,
          borderRadius: 32
        }}
      />
      <Box className={classes.label} mb={1}>
        <div style={{ display: 'flex' }}>
          Upload Profile Image
          <div
            style={{
              color: '#F43E5F'
            }}
          >
            *
          </div>
        </div>
      </Box>
      <FileUpload
        theme="music dao pod"
        photo={photo}
        photoImg={photoImg}
        setterPhoto={(p) => {
          setPhoto(p);
          if (p) setOpenAvartaImageCropModal(true);
        }}
        setterPhotoImg={setPhotoImg}
        mainSetter={undefined}
        mainElement={undefined}
        type="image"
        canEdit
        isEditable
        styleWrapper={{
          background: 'white',
          borderRadius: 32
        }}
      />
      <Box my={4}>
        <InputWithLabelAndTooltip
          type="text"
          inputValue={urlSlug}
          onInputValueChange={(e) => {
            setUrlSlug(e.target.value);
          }}
          labelName="Create Myx Handle"
          labelSuffix="*"
          style={{
            borderRadius: 32
          }}
        />
      </Box>
      <PrimaryButton size="medium" onClick={updateProfile}>
        ACTIVATE ACCOUNT
      </PrimaryButton>
      {openAvartaImageCropModal && (
        <ImageCropModal
          imageFile={photo}
          open={openAvartaImageCropModal}
          aspect={3 / 3}
          onClose={() => setOpenAvartaImageCropModal(false)}
          setCroppedImage={(file) => {
            setPhoto(file);
            handleFiles(file);
          }}
        />
      )}
    </Box>
  );
}
