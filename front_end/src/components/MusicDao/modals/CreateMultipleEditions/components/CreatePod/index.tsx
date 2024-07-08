import React from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputBase from '@material-ui/core/InputBase';
import Fade from '@material-ui/core/Fade';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import InputWithLabelAndTooltip from 'shared/ui-kit/InputWithLabelAndTooltip';
import Box from 'shared/ui-kit/Box';
import { Avatar } from 'shared/ui-kit';
import FileUpload from 'shared/ui-kit/Page-components/FileUpload';
import { IAutocompleteUsers, getArtistsByLabel } from 'shared/services/API';
import { processImage } from 'shared/helpers';
import { getDefaultAvatar } from 'shared/services/user/getUserAvatar';
import AddArtistModal from 'components/MusicDao/modals/AddArtistModal';
import { createPodStyles, useAutocompleteStyles } from './index.styles';
import { ReactComponent as InfoIcon } from 'assets/icons/info.svg';

const artistTypes = [
  {
    title: 'I am the Artist',
    value: 'Artist'
  },
  {
    title: 'I’m A Label',
    value: 'Label'
  }
];

const CreatePod = (props: any) => {
  const classes = createPodStyles();
  const autocompleteStyle = useAutocompleteStyles();
  const [autocompleteKey, setAutocompleteKey] = React.useState<number>(
    new Date().getTime()
  );
  const [searchValue, setSearchValue] = React.useState<string>('');
  const [autocompleteUsers, setAutocompleteUsers] = React.useState<
    IAutocompleteUsers[]
  >([]);
  const [artistModalVisible, setArtistModalVisible] = React.useState(false);

  const showArtistModal = () => {
    setArtistModalVisible(true);
  };

  const closeArtistModal = () => {
    setArtistModalVisible(false);
  };

  const fetchArtists = () => {
    getArtistsByLabel()
      .then(async (resp) => {
        if (resp?.success) {
          setAutocompleteUsers(resp.artists);
        }
      })
      .catch((err) => console.log(err));
  };
  React.useEffect(() => {
    fetchArtists();
  }, []);

  const handleRefresh = () => {
    fetchArtists();
  };

  const clearArtist = () => {
    props.setPod({
      ...props.pod,
      Artist: undefined
    });
  };

  return (
    <div className={classes.container}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Box display="flex" justifyContent="center">
            <RadioGroup
              className={classes.radioButton}
              row
              aria-label="artistType"
              name="artistType"
              value={props.pod.ArtistType}
              onChange={(e) => {
                props.setPod({ ...props.pod, ArtistType: e.target.value });
              }}
            >
              {artistTypes.map((item, index) => (
                <div
                  style={{
                    background:
                      (props.pod.ArtistType === 'Artist' && index === 0) ||
                      (props.pod.ArtistType === 'Label' && index === 1)
                        ? 'linear-gradient(0deg, #F2FBF6, #F2FBF6), #17172D'
                        : 'linear-gradient(0deg, rgba(218, 230, 229, 0.06), rgba(218, 230, 229, 0.06))'
                  }}
                  key={`switch_${index}`}
                >
                  <FormControlLabel
                    style={{ marginLeft: 0 }}
                    value={item.value}
                    control={<Radio />}
                    label={item.title}
                  />
                </div>
              ))}
            </RadioGroup>
          </Box>
        </Grid>
        {props.pod.ArtistType === 'Label' && (
          <Grid item xs={12} md={12}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mb={1}
            >
              <div>Search for Artist</div>
              {!props.pod.Artist && (
                <button
                  className={classes.addNewArtist}
                  onClick={showArtistModal}
                >
                  Add new Artist
                </button>
              )}
            </Box>
            {!props.pod.Artist && (
              <Autocomplete
                freeSolo
                key={autocompleteKey}
                classes={autocompleteStyle}
                onChange={(event: any, user: any | null) => {
                  if (user && typeof user !== 'string') {
                    props.setPod({
                      ...props.pod,
                      Artist: user
                    });
                    setSearchValue('');
                    setAutocompleteKey(new Date().getTime());
                  }
                }}
                options={autocompleteUsers}
                renderOption={(option) => (
                  <Box className={classes.renderItemBox}>
                    <Box display="flex" alignItems="center" maxWidth={'70%'}>
                      <Avatar
                        noBorder
                        url={
                          processImage(option.imageUrl) ?? getDefaultAvatar()
                        }
                        size="small"
                      />
                      <Box
                        className={classes.urlSlug}
                      >{`@${option.urlSlug}`}</Box>
                    </Box>
                  </Box>
                )}
                getOptionLabel={(option) => `@${option.urlSlug}`}
                filterOptions={(options, _) =>
                  options.filter(
                    (option) =>
                      option.name
                        .toLowerCase()
                        .includes(searchValue.toLowerCase()) ||
                      option.urlSlug
                        .toLowerCase()
                        .includes(searchValue.toLowerCase())
                  )
                }
                renderInput={(params) => (
                  <InputBase
                    style={{
                      background:
                        'linear-gradient(0deg, #F6F8FA, #F6F8FA), #17172D',
                      borderRadius: 8
                    }}
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
                    placeholder="Search user name"
                  />
                )}
              />
            )}
          </Grid>
        )}
        {props.pod.Artist && (
          <Box className={classes.renderItemBox}>
            <Box display="flex" alignItems="center" maxWidth={'70%'}>
              <Avatar
                noBorder
                url={
                  processImage(props.pod.Artist.imageUrl) ?? getDefaultAvatar()
                }
                size="small"
              />
              <Box
                className={classes.urlSlug}
              >{`@${props.pod.Artist.urlSlug}`}</Box>
            </Box>
            <button className={classes.removeButton} onClick={clearArtist}>
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
        )}
        <Grid item xs={12} md={12}>
          <InputWithLabelAndTooltip
            theme="music dao pod"
            type="text"
            inputValue={props.pod.Name}
            onInputValueChange={(e) => {
              let podCopy = { ...props.pod };
              podCopy.Name = e.target.value;
              props.setPod(podCopy);
            }}
            labelName="Capsule Name"
            labelSuffix="*"
            placeHolder="Your Capsule Name"
            tooltip={`Please give your Capsule a name, remember you will not be able to change this in the future.`}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <InputWithLabelAndTooltip
            theme="music dao pod"
            type="text"
            inputValue={props.pod.Symbol}
            onInputValueChange={(e) => {
              let podCopy = { ...props.pod };
              podCopy.Symbol = e.target.value;
              props.setPod(podCopy);
              props.setPod({ ...props.pod, Symbol: e.target.value });
            }}
            labelName="Capsule Symbol"
            labelSuffix="*"
            placeHolder="Your Capsule Symbol"
            tooltip={`Please give your Capsule a symbol, remember you will not be able to change this in the future.`}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <InputWithLabelAndTooltip
            theme="music dao pod"
            type="textarea"
            inputValue={props.pod.Description}
            onInputValueChange={(e) => {
              props.setPod({ ...props.pod, Description: e.target.value });
            }}
            labelName="Description"
            labelSuffix="*"
            placeHolder="Write your description..."
            tooltip={`Please give your Capsule a description that collaborators and potential investors can see. While you will be able to create wall posts and discussions within the Capsule, this description field cannot be changed in the future.`}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <Box className={classes.label} mb={1}>
            <div style={{ position: 'relative' }}>
              Capsule Image
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
            <Tooltip
              TransitionComponent={Fade}
              TransitionProps={{ timeout: 600 }}
              arrow
              title={
                'Even though the software automatically resizes it, we recommend a 200x600 pixel size. Like the other details of the Capsule, this too cannot be changed in the future.'
              }
              classes={{ popper: classes.myTooltip }}
            >
              <InfoIcon />
            </Tooltip>
          </Box>
          <FileUpload
            photo={props.photo}
            photoImg={props.photoImg}
            setterPhoto={props.setPhoto}
            setterPhotoImg={props.setPhotoImg}
            mainSetter={undefined}
            mainElement={undefined}
            type="image"
            canEdit
            isEditable
            extra
            theme="music dao"
          />
        </Grid>
        <Grid item xs={12}>
          <InputWithLabelAndTooltip
            labelName="Hashtags"
            labelSuffix="*"
            placeHolder="Separate hashtags with commas"
            onInputValueChange={(e) => {
              props.setPod({
                ...props.pod,
                hashtagsString: e.target.value,
                Hashtags: e.target.value
                  .split(',')
                  .map((s: string) => s.trim())
                  .filter((s: string) => !!s)
              });
            }}
            inputValue={props.pod.hashtagsString}
            type="text"
            theme="music dao pod"
            tooltip="As the community grows, hashtags will help people find your Capsule organically."
          />
          <div
            className={classes.hashtagsRow}
            style={{ flexFlow: 'wrap', marginTop: '0px' }}
          >
            {props.pod.Hashtags.map((hashtag, index) => (
              <div
                className={classes.hashtagPill}
                style={{ marginTop: '8px' }}
                key={`tag-${index}`}
              >
                {props.pod.Hashtags && props.pod.Hashtags[index]
                  ? props.pod.Hashtags[index]
                  : hashtag}
              </div>
            ))}
          </div>
        </Grid>
      </Grid>
      <AddArtistModal
        open={artistModalVisible}
        onCloseModal={closeArtistModal}
        handleRefresh={handleRefresh}
      />
    </div>
  );
};

export default CreatePod;
