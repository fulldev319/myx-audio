import React from 'react';

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import Box from 'shared/ui-kit/Box';
import FileUpload from 'shared/ui-kit/Page-components/FileUpload';
import { uploadMediaTabStyles } from './index.styles';
import { InfoTooltip } from 'shared/ui-kit/InfoTooltip';
import InputWithLabelAndTooltip from 'shared/ui-kit/InputWithLabelAndTooltip';
import { Mood, MoodEmoji, MusicGenres } from 'shared/constants/constants';

export default function UploadMediaTab({
  songData,
  setSongData,
  songImage,
  song,
  mediaCover,
  setMediaCover,
  uploadSongImage,
  uploadSong
}) {
  const classes = uploadMediaTabStyles();

  return (
    <>
      <Box mt={3}>
        <Box className={classes.flexBox} justifyContent="space-between">
          <label style={{ position: 'relative' }}>
            Track Image
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
          </label>
          <InfoTooltip tooltip="Note: this is not going to be the image of your NFT, that is when you upload your track" />
        </Box>
        <Box
          width={1}
          className={mediaCover.uploadImg ? classes.uploadBox : ''}
          mt={1}
        >
          <FileUpload
            theme="music dao"
            photo={songImage}
            photoImg={mediaCover.uploadImg}
            setterPhoto={uploadSongImage}
            setterPhotoImg={(value) => {
              setMediaCover({ ...mediaCover, uploadImg: value });
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
      <Box mt={3}>
        <Box className={classes.flexBox} justifyContent="space-between" mb={1}>
          <label style={{ position: 'relative' }}>
            Upload Track
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
          </label>
          <InfoTooltip tooltip="Your track will be encrypted into chunks and securely stored on IPFS, a distributed file storage system for Web 3, making it nearly impossible for someone to download your track and play it on another audio player. Your track will then be available to stream on Myx, where it will earn the owner(s) of this track" />
          {/* <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} arrow title={""}>
            <InfoIcon style={{ color: "#2D3047", width: "14px" }} />
          </Tooltip> */}
        </Box>
        <FileUpload
          theme="music dao"
          photo={song}
          photoImg={mediaCover.uploadImg1}
          setterPhoto={uploadSong}
          setterPhotoImg={(value) => {
            setMediaCover({ ...mediaCover, uploadImg1: value });
          }}
          mainSetter={undefined}
          mainElement={undefined}
          type="audio"
          canEdit
          isBitrate
          extra
          extraText={`You can upload mp3, mp4 or .wav format. There is no file size limit, however if you uppload  long-form audio of any kind, dependng on your network you can expect longer encryption and upload times, sp bplease be patient.`}
        />
      </Box>
      <Box mt={3}>
        <InputWithLabelAndTooltip
          labelName="Track Name"
          labelSuffix="*"
          type="text"
          // tooltip="Enter your track name"
          inputValue={songData.Title}
          onInputValueChange={(e) => {
            setSongData({ ...songData, Title: e.target?.value });
          }}
          theme="music dao"
          placeHolder="Track Name"
        />
      </Box>
      <Box mt={3}>
        <InputWithLabelAndTooltip
          labelName="Description"
          labelSuffix="- Optional"
          // tooltip="Enter your track name"
          inputValue={songData.Description}
          onInputValueChange={(e) => {
            setSongData({ ...songData, Description: e.target?.value });
          }}
          theme="music dao"
          placeHolder="Track Description"
        />
      </Box>
      <Box mt={3}>
        <Box className={classes.label} mb={1}>
          <div style={{ position: 'relative' }}>
            Genre
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
          {/* <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} arrow title={""}>
            <img src={require("assets/icons/info_music_dao.webp")} alt="info" />
          </Tooltip> */}
        </Box>
        <Select
          className={classes.input}
          value={songData.Genre}
          onChange={(e) =>
            setSongData({
              ...songData,
              Genre: e.target.value
            })
          }
          displayEmpty={true}
          renderValue={(value: any) =>
            value ? value.toUpperCase() : 'Select track genre...'
          }
        >
          {MusicGenres.map((item) => (
            <MenuItem value={item} style={{ textTransform: 'uppercase' }}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Box mt={3}>
        <Box className={classes.label} mb={1}>
          <div style={{ position: 'relative' }}>
            Mood
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
          {/* <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} arrow title={""}>
            <img src={require("assets/icons/info_music_dao.webp")} alt="info" />
          </Tooltip> */}
        </Box>
        <Select
          className={classes.input}
          value={songData.Mood}
          onChange={(e) =>
            setSongData({
              ...songData,
              Mood: e.target.value
            })
          }
          displayEmpty={true}
          renderValue={(value: any) =>
            value ? (
              <>
                {MoodEmoji[Mood.findIndex((mood) => mood === value)]}
                &nbsp;&nbsp;&nbsp;{value}
              </>
            ) : (
              'Select track mood...'
            )
          }
        >
          {Mood.map((item, index) => (
            <MenuItem value={item} key={`track-mood-${index}`}>
              {MoodEmoji[index]}&nbsp;&nbsp;&nbsp;{item}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Box mt={3} pb={3}>
        <InputWithLabelAndTooltip
          theme="music dao"
          type="text"
          inputValue={songData.Label || ''}
          onInputValueChange={(e) => {
            setSongData({
              ...songData,
              Label: e.target.value
            });
          }}
          labelName="Label"
          labelSuffix="- Optional"
          placeHolder="Label name..."
          tooltip={
            'You can add your label here, if there is none, please indicate.'
          }
        />
      </Box>
      {/* <Box
        display="flex"
        alignItems="start"
        textAlign="start"
        style={{ fontSize: 14, color: '#54658F' }}
        mt={1}
      >
        <img src={require('assets/musicDAOImages/danger.webp')} />
        You can upload mp3, mp4 or .wav format. There is no file size limit,
        however if you upload long-form audio of any kind, depending on your
        network you can expect longer encryption and upload times, so please be
        patient
      </Box> */}
    </>
  );
}
