import React, { useEffect, useState } from 'react';

import useTheme from '@material-ui/core/styles/useTheme';
import makeStyles from '@material-ui/core/styles/makeStyles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Fade from '@material-ui/core/Fade';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Tooltip from '@material-ui/core/Tooltip';

import Box from 'shared/ui-kit/Box';
import { PrimaryButton } from 'shared/ui-kit';
import { musicDaoGetAlbumsOfArtist } from 'shared/services/API';
import { getUser } from 'store/selectors';
import { useTypedSelector } from 'store/reducers/Reducer';
import CreateAlbumModal from 'components/MusicDao/modals/CreateAlbumModal';

const useStyles = makeStyles(() => ({
  label: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    color: '#2D3047',
    opacity: 0.9,

    fontSize: '16px',
    fontWeight: 600
  },
  input: {
    background: 'rgba(218, 230, 229, 0.4)',
    border: '1px solid #DADADB',
    borderRadius: 8,
    height: 45,
    width: '100%',
    paddingLeft: 20,
    paddingRight: 20,
    outline: 'none',
    fontSize: 14,
    color: '#2D3047'
  },
  albumSelectOption: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 20px',
    borderBottom: '1px solid #ccc',
    '&:last-child': {
      border: 'none'
    }
    // "&:hover": {
    //   background: "#E4E9E9",
    // },
  },
  flexBox: {
    display: 'flex',
    alignItems: 'center'
  }
}));

export default function AlbumTab({
  songData,
  setSongData,
  albumImage,
  uploadAlbumImage,
  mediaCover,
  setMediaCover
}) {
  const classes = useStyles();
  const user = useTypedSelector(getUser);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const isTablet = useMediaQuery(theme.breakpoints.down('sm'));

  const [openCreateAlbumModal, setOpenCreateAlbumModal] =
    useState<boolean>(false);

  const [albums, setAlbums] = useState<any[]>([]);
  const [isLoadingAlbums, setIsLoadingAlbums] = useState<boolean>(false);
  const lastAlbumIdRef = React.useRef<string>('');

  const [albumOptions, setAlbumOptions] = useState<any[]>([]);

  useEffect(() => {
    if (user?.id) {
      loadAlbums();
    }
  }, [user?.id]);

  useEffect(() => {
    if (albums.length > 0) {
      setAlbumOptions(albums.map((v) => v.name));
    }
  }, [albums.length]);

  const loadAlbums = async () => {
    setIsLoadingAlbums(true);
    musicDaoGetAlbumsOfArtist(user.id, lastAlbumIdRef.current)
      .then((response) => {
        if (response.success) {
          const data = response.data;
          const nextPageAlbums = data.albums || [];
          setAlbums((prev) => [...prev, ...data.albums]);
          lastAlbumIdRef.current =
            nextPageAlbums.length > 0
              ? nextPageAlbums[nextPageAlbums.leng - 1]?.id
              : '';
          // setHasMoreArtist(response.data.data.hasMore);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setIsLoadingAlbums(false));
  };

  return (
    <div style={{ position: 'relative', marginTop: isMobile ? 30 : 0 }}>
      {/* <Box mt={2} display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center">
          <label style={{ paddingRight: 16 }}>Collection or Single</label>
          <InfoTooltip tooltip="" />
        </Box>
        <CustomSwitch
          checked={songData.isAlbum}
          theme="music dao"
          onChange={() => {
            setSongData({
              ...songData,
              isAlbum: !songData.isAlbum,
            });
          }}
        />
      </Box> */}
      {songData.isAlbum && (
        <>
          <Box mt={2}>
            <Box className={classes.label} mb={1}>
              <div style={{ position: 'relative' }}>
                Select collection
                <div style={{ position: 'absolute', top: 0, right: -10 }}>
                  *
                </div>
              </div>
              <Tooltip
                TransitionComponent={Fade}
                TransitionProps={{ timeout: 600 }}
                arrow
                title={
                  'This is the collection that your track will be added to, please create a new collection or select an existing one.'
                }
              >
                <img
                  src={require('assets/icons/info_music_dao.webp')}
                  alt="info"
                />
              </Tooltip>
            </Box>
            <Select
              className={classes.input}
              value={songData.AlbumName}
              onChange={(e) =>
                setSongData({
                  ...songData,
                  AlbumName: e.target.value,
                  albumId:
                    albums.find((v) => v.name === e.target.value).id || ''
                })
              }
              displayEmpty={true}
              renderValue={(value: any) =>
                value ? value : 'Select from existing collection'
              }
            >
              {albumOptions.map((item, index) => (
                <MenuItem
                  className={classes.albumSelectOption}
                  value={item}
                  key={`collection-option-${index}`}
                >
                  {item}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <PrimaryButton
            size="medium"
            isRounded
            style={{
              background:
                'linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)',
              position: 'absolute',
              right: 0,
              top: isMobile ? -40 : -80
            }}
            onClick={() => {
              setOpenCreateAlbumModal(true);
            }}
          >
            Create Collection
          </PrimaryButton>
          {/* <Box mt={2}>
            <PrimaryButton
              size="small"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '45px',
                background: '#65CB63'
              }}
              onClick={() => {
                setEditMode(true);
                setSongData({
                  ...songData,
                  AlbumName: '',
                  albumId: ''
                });
              }}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 13 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.5 11.5V1.5M1.5 6.5L11.5 6.5"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span style={{ marginLeft: 14 }}>Create New Collection</span>
            </PrimaryButton>
          </Box> */}
        </>
      )}
      {openCreateAlbumModal && (
        <>
          <CreateAlbumModal
            open={openCreateAlbumModal}
            onClose={(result) => {
              if (!result) {
                setSongData({
                  ...songData,
                  AlbumName: '',
                  albumId: '',
                  albumDescription: '',
                  Symbol: '',
                  albumImage: ''
                });
                // uploadAlbumImage(null);
                setMediaCover({ ...mediaCover, uploadAlbumImg: null });
              }
              setOpenCreateAlbumModal(false);
            }}
            handleRefresh={() => {}}
            songData={songData}
            setSongData={setSongData}
            albumImage={albumImage}
            uploadAlbumImage={uploadAlbumImage}
            mediaCover={mediaCover}
            setMediaCover={setMediaCover}
          />
        </>
      )}
    </div>
  );
}
