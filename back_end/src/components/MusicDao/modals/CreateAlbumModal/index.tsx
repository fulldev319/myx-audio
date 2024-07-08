import React from 'react';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import useTheme from '@material-ui/core/styles/useTheme';

import Box from 'shared/ui-kit/Box';
import { useCreateAlbumStyles } from './index.styles';
import { Modal, PrimaryButton } from 'shared/ui-kit';
import InputWithLabelAndTooltip from 'shared/ui-kit/InputWithLabelAndTooltip';
import { InfoTooltip } from 'shared/ui-kit/InfoTooltip';
import FileUpload from 'shared/ui-kit/Page-components/FileUpload';
import { BlockchainTokenSelect } from '../CreateSongModalNew/components/BlockchainTokenSelect';
import { BlockchainNets } from 'shared/constants/constants';

const filteredBlockchainNets = BlockchainNets.filter(
  (item) => item.name === 'POLYGON'
);

export default function CreateAlbumModal({
  open,
  onClose,
  handleRefresh,
  songData,
  setSongData,
  albumImage,
  uploadAlbumImage,
  mediaCover,
  setMediaCover
}) {
  const classes = useCreateAlbumStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  return (
    <Modal
      className={classes.root}
      size="medium"
      isOpen={open}
      onClose={() => {
        onClose(false);
      }}
      showCloseIcon
    >
      <div>
        <Box mb={5} className={classes.title}>
          Create New Collection
        </Box>
        <Box mt={2}>
          <Box className={classes.label}>
            <div style={{ position: 'relative' }}>
              Give Your Collection A Name
              <div style={{ position: 'absolute', top: 0, right: -10 }}>*</div>
            </div>
            <InfoTooltip tooltip="Give your collection of tracks a name, you cannot edit this in the future" />
          </Box>
          <InputWithLabelAndTooltip
            labelName=""
            type="text"
            inputValue={songData.AlbumName}
            onInputValueChange={(e) => {
              setSongData({ ...songData, AlbumName: e.target?.value });
            }}
            theme="music dao"
            placeHolder="Collection Name"
          />
        </Box>
        <Box mt={2}>
          <Box className={classes.label}>
            <div style={{ position: 'relative' }}>
              Describe Your Collection
              <div style={{ position: 'absolute', top: 0, right: -10 }}>*</div>
            </div>
            <InfoTooltip tooltip="Describe your collection of tracks" />
          </Box>
          <InputWithLabelAndTooltip
            labelName=""
            inputValue={songData.albumDescription}
            onInputValueChange={(e) => {
              setSongData({ ...songData, albumDescription: e.target?.value });
            }}
            theme="music dao"
            placeHolder="Collection Description"
          />
        </Box>
        <Box mt={2}>
          <Box className={classes.label}>
            <div style={{ position: 'relative' }}>
              Give Your Collection A Symbol (3~8 characters)
            </div>
            <InfoTooltip tooltip="Give your collection a symbol, like Bitcoin is BTC or Microsoft MSFT" />
          </Box>
          <InputWithLabelAndTooltip
            labelName=""
            type="text"
            inputValue={songData.Symbol}
            onInputValueChange={(e) => {
              setSongData({ ...songData, Symbol: e.target?.value });
            }}
            theme="music dao"
            placeHolder="Collection symbol like: SDO"
          />
        </Box>
        <Box mt={2}>
          <Box className={classes.label}>
            <label style={{ position: 'relative' }}>
              Collection Image
              <div style={{ position: 'absolute', top: 0, right: -10 }}>*</div>
            </label>
            <InfoTooltip tooltip="Note: this is not going to be the image of your NFT, that is when you upload your track." />
          </Box>
          <Box
            width={1}
            className={mediaCover.uploadAlbumImg ? classes.uploadBox : ''}
            mt={1}
          >
            <FileUpload
              theme="music dao"
              photo={albumImage}
              photoImg={mediaCover.uploadAlbumImg}
              setterPhoto={uploadAlbumImage}
              setterPhotoImg={(value) => {
                setMediaCover({ ...mediaCover, uploadAlbumImg: value });
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
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mt={2.5}
          width={1}
        >
          <label>On Which Blockchain Do You Want This Minted?</label>
          <InfoTooltip tooltip="This list will grow in the future" />
        </Box>
        <BlockchainTokenSelect
          socialToken={songData}
          setSocialToken={setSongData}
          BlockchainNets={filteredBlockchainNets}
        />
        <Box mt={4} display="flex" justifyContent="center">
          <PrimaryButton
            size="medium"
            isRounded
            style={{
              background: '#65CB63',
              color: '#fff',
              padding: '0px 20px',
              height: 48
            }}
            onClick={() => {
              onClose(true);
            }}
          >
            Create Collection
          </PrimaryButton>
        </Box>
      </div>
    </Modal>
  );
}
