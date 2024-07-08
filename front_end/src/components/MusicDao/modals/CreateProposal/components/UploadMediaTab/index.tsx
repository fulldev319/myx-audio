import React, { useState } from 'react';
import { useDebounce } from 'use-debounce/lib';

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Autocomplete from '@material-ui/lab/Autocomplete';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputBase from '@material-ui/core/InputBase';

import { Avatar } from 'shared/ui-kit';
import FileUpload from 'shared/ui-kit/Page-components/FileUpload';
import { InfoTooltip } from 'shared/ui-kit/InfoTooltip';
import InputWithLabelAndTooltip from 'shared/ui-kit/InputWithLabelAndTooltip';
import { Mood, MoodEmoji, MusicGenres } from 'shared/constants/constants';
import { getDefaultAvatar } from 'shared/services/user/getUserAvatar';
import Box from 'shared/ui-kit/Box';
import { processImage } from 'shared/helpers';

import { uploadMediaTabStyles, useAutocompleteStyles } from './index.styles';

export default function UploadMediaTab({
  songData,
  setSongData,
  songImage,
  song,
  mediaCover,
  setMediaCover,
  uploadSongImage,
  uploadSong,
  podCollabs
}) {
  const classes = uploadMediaTabStyles();
  const autocompleteStyle = useAutocompleteStyles();

  const [autocompleteKey, setAutocompleteKey] = useState<number>(
    new Date().getTime()
  );

  const [searchValue, setSearchValue] = useState<string>('');
  const [debouncedValue] = useDebounce(searchValue, 500);

  const addAddressToSelectedList = (user, isMain = true) => {
    if (isMain) {
      const newCollabs = [...songData.artist.main];
      newCollabs.push(user);
      setSongData((prev) => ({
        ...prev,
        artist: { ...prev.artist, main: newCollabs }
      }));
    } else {
      const newCollabs = [...songData.artist.feature];
      newCollabs.push(user);
      setSongData((prev) => ({
        ...prev,
        artist: { ...prev.artist, feature: newCollabs }
      }));
    }
  };

  const removeAddressFromSelectedList = (user, isMain = true) => {
    if (isMain) {
      const newCollabs = songData.artist.main.filter(
        (u) => user.address.toLowerCase() !== u.address.toLowerCase()
      );
      setSongData((prev) => ({
        ...prev,
        artist: { ...prev.artist, main: newCollabs }
      }));
    } else {
      const newCollabs = songData.artist.feature.filter(
        (u) => user.address.toLowerCase() !== u.address.toLowerCase()
      );
      setSongData((prev) => ({
        ...prev,
        artist: { ...prev.artist, feature: newCollabs }
      }));
    }
  };

  const getAutoComplete = (isMain = true) => {
    return (
      <Autocomplete
        freeSolo
        key={isMain ? autocompleteKey : autocompleteKey + 1}
        classes={autocompleteStyle}
        onChange={(event: any, user: any | null) => {
          if (user && typeof user !== 'string') {
            addAddressToSelectedList(user, isMain);
            setSearchValue('');
            setAutocompleteKey(new Date().getTime());
          }
        }}
        options={podCollabs.filter(
          (v) =>
            songData.artist.main.findIndex(
              (u) => v.address.toLowerCase() === u.address
            ) < 0 &&
            songData.artist.feature.findIndex(
              (u) => v.address.toLowerCase() === u.address
            ) < 0 &&
            (v.name.toLowerCase().includes(debouncedValue) ||
              v.urlSlug.toLowerCase().includes(debouncedValue))
        )}
        renderOption={(option) => (
          <Box className={classes.renderItemBox}>
            <Box display="flex" alignItems="center" maxWidth={'70%'}>
              <Avatar
                noBorder
                url={processImage(option.imageUrl) ?? getDefaultAvatar()}
                size="small"
              />
              <Box className={classes.urlSlug}>{`@${option.urlSlug}`}</Box>
            </Box>
            <Box
              display="flex"
              color="#65CB63"
              fontWeight={600}
              alignItems="center"
            >
              <Box className={classes.inviteBox}>Invite Artist</Box>
              <div className={classes.addRound}>
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 13 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.5 11.5V1.5M1.5 6.5L11.5 6.5"
                    stroke="#727F9A"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </Box>
          </Box>
        )}
        getOptionLabel={(option) => `@${option.urlSlug}`}
        filterOptions={(options, _) =>
          options.filter(
            (option) =>
              !(isMain ? songData.artist.main : songData.artist.feature).find(
                (collab) =>
                  collab.address.toLowerCase() === option.address.toLowerCase()
              )
          )
        }
        renderInput={(params) => (
          <InputBase
            style={{ background: '#F0F5F5', borderRadius: 8 }}
            value={searchValue}
            onChange={(event) => {
              setSearchValue(event.target.value);
            }}
            ref={params.InputProps.ref}
            inputProps={params.inputProps}
            endAdornment={
              <InputAdornment position="end">
                <svg
                  width="29"
                  height="29"
                  viewBox="0 0 29 29"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M23.1612 24.3928C23.621 24.8526 24.3666 24.8526 24.8264 24.3928C25.2862 23.933 25.2862 23.1874 24.8264 22.7276L23.1612 24.3928ZM20.4613 12.3741C20.4613 16.6011 17.0347 20.0277 12.8077 20.0277V22.3827C18.3353 22.3827 22.8163 17.9017 22.8163 12.3741H20.4613ZM12.8077 20.0277C8.5807 20.0277 5.15405 16.6011 5.15405 12.3741H2.79908C2.79908 17.9017 7.28009 22.3827 12.8077 22.3827V20.0277ZM5.15405 12.3741C5.15405 8.1471 8.5807 4.72045 12.8077 4.72045V2.36549C7.28009 2.36549 2.79908 6.84649 2.79908 12.3741H5.15405ZM12.8077 4.72045C17.0347 4.72045 20.4613 8.1471 20.4613 12.3741H22.8163C22.8163 6.84649 18.3353 2.36549 12.8077 2.36549V4.72045ZM24.8264 22.7276L19.8956 17.7968L18.2304 19.462L23.1612 24.3928L24.8264 22.7276Z"
                    fill="#2D3047"
                  />
                </svg>
              </InputAdornment>
            }
            autoFocus
            placeholder="Search username or wallet address"
          />
        )}
      />
    );
  };

  return (
    <>
      <Box>
        <Box className={classes.subTitle} mb={1}>
          Search for artist
        </Box>
        {getAutoComplete()}
      </Box>
      <Box mt={3}>
        {songData.artist.main.length > 0 && (
          <>
            <Box
              mt="22px"
              display="flex"
              alignItems="center"
              color="#2D3047"
              fontSize="14px"
              mb="14px"
              justifyContent="space-between"
            >
              <div>Artist</div>
              <div>Status</div>
            </Box>
            {songData.artist.main.map((u, index) => (
              <UserTile
                key={`user-${index}-tile`}
                user={u}
                onClick={() => {
                  removeAddressFromSelectedList(u);
                }}
              />
            ))}
          </>
        )}
      </Box>
      <Box mt={3}>
        <Box className={classes.stepText} mb={3}>
          <h3>Select Featured Artists</h3>
          <h5>Optional</h5>
        </Box>
        <Box className={classes.subTitle} mb={1}>
          Search for artist
        </Box>
        {getAutoComplete(false)}
      </Box>
      <Box mt={3}>
        {songData.artist.feature.length > 0 && (
          <>
            <Box
              mt="22px"
              display="flex"
              alignItems="center"
              color="#2D3047"
              fontSize="14px"
              mb="14px"
              justifyContent="space-between"
            >
              <div>Artist</div>
              <div>Status</div>
            </Box>
            {songData.artist.feature.map((u, index) => (
              <UserTile
                key={`user-${index}-tile`}
                user={u}
                onClick={() => {
                  removeAddressFromSelectedList(u, false);
                }}
              />
            ))}
          </>
        )}
      </Box>

      <Box className={classes.stepText} mt={5}>
        <h3>Track Details</h3>
      </Box>
      <Box mt={3}>
        <Box className={classes.flexBox} justifyContent="space-between" mb={1}>
          <label style={{ position: 'relative' }}>
            Audio file
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
        <InputWithLabelAndTooltip
          labelName="Track Name"
          labelSuffix="*"
          type="text"
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
          {MusicGenres.map((item, index) => (
            <MenuItem
              value={item}
              style={{ textTransform: 'uppercase' }}
              key={`menu_item_${index}`}
            >
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
    </>
  );
}

const UserTile = ({ user, onClick }) => {
  const classes = uploadMediaTabStyles();

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      className={classes.userTile}
    >
      <Box display="flex" alignItems="center">
        <Avatar
          noBorder
          url={processImage(user.imageUrl) ?? getDefaultAvatar()}
          size="medium"
        />
        <Box className={classes.urlSlug}>{`@${user.urlSlug}`}</Box>
      </Box>
      <Box display="flex" alignItems="center">
        <Box className={classes.invitationSentBtn}>Invitation sent</Box>
        <button className={classes.removeButton} onClick={onClick}>
          <svg
            width="10"
            height="10"
            viewBox="0 0 13 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.5 6.5L11.5 6.5"
              stroke="red"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </Box>
    </Box>
  );
};
