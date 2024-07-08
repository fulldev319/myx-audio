import React, { useState } from 'react';
import Cookies from 'js-cookie';

import Grid from '@material-ui/core/Grid';

import { artistRRSSModalStyles } from './index.styles';
import { Modal, PrimaryButton } from 'shared/ui-kit';
import InputWithLabelAndTooltip from 'shared/ui-kit/InputWithLabelAndTooltip';
import AlertMessage from 'shared/ui-kit/Alert/AlertMessage';
import Axios from 'axios';
import URLTraxMicroservice from '../../../../../../shared/functions/getURLMusicMicroservice';

export default function ArtistRRSSModal({
  open,
  handleClose,
  artist,
  setArtist
}) {
  const [rrss, setRRSS] = useState<any>({
    Instagram: artist.Instagram,
    Twitter: artist.Twitter,
    Facebook: artist.Facebook,
    LinkedIn: artist.LinkedIn
  });

  const [successMsg, setSuccessMsg] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);

  const classes = artistRRSSModalStyles();

  const handleSaveChanges = async () => {
    try {
      const token: string = Cookies.get('accessToken') || '';
      await Axios.post(`${URLTraxMicroservice()}/artists/rrss/${artist.id}`, {
        ...rrss,
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then((res) => {
        const resp = res.data;
        if (resp.success) {
          setArtist({
            ...artist,
            ...resp.data
          });
          setSuccessMsg('RRSS modified');
          handleClose();
        }
      });
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const handleClickSuccess = () => {
    setOpenSuccess(true);
    setTimeout(() => {
      setOpenSuccess(false);
    }, 3000);
  };

  const handleClickError = () => {
    setOpenError(true);
    setTimeout(() => {
      setOpenError(false);
    }, 3000);
  };

  const handleCloseSuccess = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSuccess(false);
  };

  const handleCloseError = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenError(false);
  };

  return (
    <Modal
      className={classes.root}
      size="medium"
      isOpen={open}
      onClose={handleClose}
      showCloseIcon
    >
      <div className={classes.content}>
        <h5>Manage RRSS</h5>

        <Grid
          container
          spacing={2}
          direction="row"
          alignItems="flex-start"
          justify="flex-start"
        >
          <Grid item xs={12} md={6}>
            <label>Instagram</label>
            <InputWithLabelAndTooltip
              inputValue={rrss.Instagram}
              type="text"
              placeHolder="Instagram"
              onInputValueChange={(e) => {
                setRRSS({
                  ...rrss,
                  Instagram: e.target.value
                });
              }}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <label>Twitter</label>
            <InputWithLabelAndTooltip
              inputValue={rrss.Twitter}
              type="text"
              placeHolder="Twitter"
              onInputValueChange={(e) => {
                setRRSS({
                  ...rrss,
                  Twitter: e.target.value
                });
              }}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <label>Facebook</label>
            <InputWithLabelAndTooltip
              inputValue={rrss.Facebook}
              type="text"
              placeHolder="Facebook"
              onInputValueChange={(e) => {
                setRRSS({
                  ...rrss,
                  Facebook: e.target.value
                });
              }}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <label>LinkedIn</label>
            <InputWithLabelAndTooltip
              inputValue={rrss.LinkedIn}
              type="text"
              placeHolder="LinkedIn"
              onInputValueChange={(e) => {
                setRRSS({
                  ...rrss,
                  LinkedIn: e.target.value
                });
              }}
              required
            />
          </Grid>
        </Grid>

        <PrimaryButton onClick={handleSaveChanges} size="medium">
          Manage RRSS
        </PrimaryButton>
      </div>

      {openSuccess && (
        <AlertMessage
          key={Math.random()}
          message={successMsg}
          variant="success"
          onClose={handleCloseSuccess}
        />
      )}
      {openError && (
        <AlertMessage
          key={Math.random()}
          message={errorMsg}
          variant="error"
          onClose={handleCloseError}
        />
      )}
    </Modal>
  );
}
