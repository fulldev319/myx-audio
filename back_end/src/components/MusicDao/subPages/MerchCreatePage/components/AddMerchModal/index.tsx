import React, { useState, useRef } from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import useTheme from '@material-ui/core/styles/useTheme';
import { Box, Grid, Typography, Button } from '@material-ui/core';

import { InfoTooltip } from 'shared/ui-kit/InfoTooltip';
import { sanitizeIfIpfsUrl } from 'shared/helpers/utils';
import { styles } from './index.styles';
import { Modal } from 'shared/ui-kit';
import { ReactComponent as RefreshIcon } from 'assets/icons/refresh.svg';

const AddMerchModal = (props: any) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const classes = styles();

  const [image, setImage] = useState<any>(null);
  const [imageFile, setImageFile] = useState<any>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const onImageInput = (e) => {
    const files = e.target.files;
    if (files.length) {
      handleImageFiles(files);
    }
    e.preventDefault();

    if (imageInputRef !== null && imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const handleImageFiles = (files: any) => {
    if (files && files[0] && files[0].type) {
      setImage(files[0]);

      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageFile(reader.result);
        let image = new Image();
        if (
          reader.result !== null &&
          (typeof reader.result === 'string' || reader.result instanceof String)
        )
          image.src = reader.result.toString();
      });

      reader.readAsDataURL(files[0]);
    }
  };

  return (
    <Modal
      size="medium"
      isOpen={props.open}
      onClose={props.handleClose}
      showCloseIcon
      style={{
        maxWidth: 755,
        padding: isMobile ? '60px 22px 20px' : '60px 48px 20px'
      }}
    >
      <div className={classes.modalContent}>
        <Typography className={classes.title}>Create New Merch</Typography>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mt={6}
        >
          <Box className={classes.inputLabel} mb={1}>
            Merch Name
          </Box>
          <InfoTooltip tooltip={'Pod Name'} />
        </Box>
        <input className={classes.input} placeholder="File description" />
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mt={3}
        >
          <Box className={classes.inputLabel} mb={1}>
            Pod Name *
          </Box>
          <InfoTooltip tooltip={'Pod Name'} />
        </Box>
        <textarea
          style={{ height: 153 }}
          className={classes.input}
          placeholder="File description"
        />
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mt={6}
        >
          <Box className={classes.inputLabel} mb={1}>
            Available number to get
          </Box>
          <InfoTooltip tooltip={'Available number  to get '} />
        </Box>
        <input className={classes.input} placeholder="00" />
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mt={3}
        >
          <Box className={classes.inputLabel} mb={1}>
            Picture
          </Box>
          <InfoTooltip tooltip={'Pod Name'} />
        </Box>
        <Box
          className={classes.uploadBox}
          style={{
            cursor: image ? undefined : "pointer",
          }}
          onClick={() => !image && imageInputRef.current?.click()}
        >
          {image ? (
            <>
              <Box
                className={classes.imageBox}
                style={{
                  backgroundImage: `url(${sanitizeIfIpfsUrl(imageFile)})`,
                  backgroundSize: 'cover'
                }}
              />
              <Box
                flex={1}
                display="flex"
                alignItems="center"
                marginLeft="24px"
                justifyContent="space-between"
                mr={3}
              >
                Uploaded {image.name}
                <Button
                  startIcon={<RefreshIcon />}
                  style={{color: '#0D59EE'}}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setImage(null);
                    setImageFile(null);
                    imageInputRef.current?.click();
                  }}
                >
                  CHANGE FILE
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Box className={classes.imageBox}>
                <ImageOutlineIcon />
              </Box>
              <Box className={classes.controlBox}>
                Drag image here or <span>browse media on your device</span>
                <br />
                Up to 10mb of PNG, JPG and GIF files are allowed. <br />
                Must be suare size, minumum 400x400px
              </Box>
            </>
          )}
        </Box>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mt={3}
        >
          <Box className={classes.inputLabel} mb={1}>
            Price
          </Box>
          <InfoTooltip tooltip={'Price'} />
        </Box>
        <input className={classes.input} placeholder="00.00" />

        <input
          ref={imageInputRef}
          id={`selectPhoto-create-merch`}
          hidden
          type="file"
          style={{ display: 'none' }}
          accept={'image/png, image/jpeg'}
          onChange={onImageInput}
        />

        <Button
          className={classes.nextButton}
          style={{ background: '#2D3047' }}
          onClick={props.handleSubmit}
        >
          Add
        </Button>
      </div>
    </Modal>
  );
};

const ImageOutlineIcon = () => (
  <svg
    width="26"
    height="27"
    viewBox="0 0 26 27"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M22.0777 0.378906H3.93034C1.76362 0.381094 0.00809938 2.13655 0.00585938 4.30227V22.4496C0.00804701 24.6153 1.7635 26.3707 3.93034 26.373H22.0777C24.2433 26.3708 25.9988 24.6153 26.0011 22.4496V4.30227C25.9989 2.13663 24.2434 0.381146 22.0777 0.378906ZM1.1729 4.30227C1.17399 2.78086 2.40776 1.54712 3.93026 1.54491H22.0776C23.599 1.5471 24.8328 2.78086 24.8339 4.30227V17.3125L20.7257 13.6627H20.7268C20.4917 13.4538 20.1329 13.468 19.9174 13.6966L16.0445 17.7622L12.2328 13.6999V13.6988C12.1235 13.5829 11.9703 13.5162 11.8107 13.5151H11.8074C11.6477 13.5151 11.4957 13.5807 11.3852 13.6956L1.60816 23.9242C1.32488 23.4846 1.17393 22.9727 1.17284 22.4499L1.1729 4.30227ZM2.42853 24.7565L11.8041 14.9467L21.4291 25.2073H3.93017C3.39644 25.2063 2.87362 25.0498 2.42845 24.7567L2.42853 24.7565ZM22.8991 25.0683L16.8429 18.6129L20.3723 14.9085L24.8339 18.8722V22.4497C24.8306 23.6518 24.0464 24.7116 22.8979 25.0682L22.8991 25.0683Z"
      fill="#727F9A"
    />
    <path
      d="M15.0582 11.0258C16.2252 11.0247 17.2774 10.3225 17.7236 9.24406C18.1699 8.16562 17.9238 6.92421 17.098 6.09966C16.2722 5.27389 15.0319 5.0267 13.9536 5.47403C12.8752 5.9203 12.1719 6.97248 12.1719 8.14058C12.1741 9.73308 13.4647 11.0237 15.0584 11.026L15.0582 11.0258ZM15.0582 6.42119C15.7538 6.42119 16.3805 6.8401 16.6463 7.48214C16.9121 8.12418 16.7644 8.86354 16.2733 9.35573C15.7823 9.84682 15.0429 9.99337 14.3998 9.7276C13.7577 9.46182 13.3388 8.8351 13.3388 8.14056C13.3399 7.19119 14.1088 6.42119 15.0582 6.42119Z"
      fill="#727F9A"
    />
  </svg>
);

export default AddMerchModal;
