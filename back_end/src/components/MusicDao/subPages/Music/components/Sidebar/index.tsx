import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { mediaGetMyPlaylists } from 'shared/services/API';
import SkeletonBox from 'shared/ui-kit/SkeletonBox';
import styles from 'shared/ui-kit/MusicAppSidebar/index.module.css';
import AppSidebar from 'shared/ui-kit/MusicAppSidebar';
import CreatePlaylistModal from '../../modals/CreatePlaylistModal';
import Box from 'shared/ui-kit/Box';

// const LeftArrowIcon = () => (
//   <svg
//     width="16"
//     height="14"
//     viewBox="0 0 16 14"
//     fill="none"
//     xmlns="http://www.w3.org/2000/svg"
//   >
//     <path
//       d="M7.26419 0.47998L7.15601 0.37553L7.05183 0.483972L0.89183 6.89597L0.791995 6.99989L0.89183 7.10381L7.05183 13.5158L7.15413 13.6223L7.26221 13.5217L8.07421 12.7657L8.18546 12.6621L8.08042 12.5522L3.45093 7.70989H15H15.15V7.55989V6.43989V6.28989H15H3.45227L5.64414 4.00985L8.08014 1.47585L8.18387 1.36794L8.07619 1.26398L7.26419 0.47998Z"
//       fill="#2D3047"
//       stroke="#2D3047"
//       strokeWidth="0.3"
//     />
//   </svg>
// );
const HomeIcon = ({ color = 'white' }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M27.3346 13.1867V22.1333C27.3346 25 25.0946 27.3333 22.3346 27.3333H17.3346V20.9333C17.3346 20.08 16.6413 19.3867 15.788 19.3867H12.2146C11.3613 19.3867 10.6813 20.08 10.6813 20.9333V27.3333H5.66797C2.90797 27.3333 0.667969 25 0.667969 22.1333V13.1867C0.667969 11.6533 1.3213 10.2 2.4413 9.2L10.7746 1.89333C12.6546 0.25333 15.3613 0.25333 17.228 1.89333L25.5613 9.2C26.6946 10.2 27.3346 11.6533 27.3346 13.1867Z"
      fill={color}
    />
  </svg>
);
const SearchIcon = ({ color = 'white' }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g>
      <path
        d="M14.6267 7.88C10.9067 7.88 7.88007 10.9067 7.88007 14.6267C7.88007 18.3467 10.9067 21.3867 14.6267 21.3867C18.36 21.3867 21.3867 18.3467 21.3867 14.6267C21.3867 10.9067 18.36 7.88 14.6267 7.88Z"
        fill={color}
      />
      <path
        d="M29.04 27.6266L23.76 22.3466C25.52 20.2533 26.5867 17.5733 26.5867 14.6266C26.5867 8.03996 21.2267 2.66663 14.6267 2.66663C8.04002 2.66663 2.66669 8.03996 2.66669 14.6266C2.66669 21.2266 8.04002 26.5866 14.6267 26.5866C17.5734 26.5866 20.2667 25.52 22.3467 23.76L27.6267 29.04C27.8267 29.24 28.08 29.3333 28.3334 29.3333C28.5867 29.3333 28.84 29.24 29.04 29.04C29.4267 28.6533 29.4267 28.0133 29.04 27.6266ZM14.6267 23.3866C9.80002 23.3866 5.88002 19.4533 5.88002 14.6266C5.88002 9.79996 9.80002 5.87996 14.6267 5.87996C19.4534 5.87996 23.3867 9.79996 23.3867 14.6266C23.3867 19.4533 19.4534 23.3866 14.6267 23.3866Z"
        fill={color}
      />
    </g>
  </svg>
);
const RecentlyPlayedIcon = ({ color = 'white' }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g opacity="0.69">
      <path
        d="M8.14664 28.3334C10.0244 28.3334 11.5466 26.8171 11.5466 24.9467C11.5466 23.0763 10.0244 21.5601 8.14664 21.5601C6.26887 21.5601 4.74664 23.0763 4.74664 24.9467C4.74664 26.8171 6.26887 28.3334 8.14664 28.3334Z"
        fill={color}
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M11.5467 24.96V13.64"
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M23.1733 23.6133C25.051 23.6133 26.5733 22.097 26.5733 20.2266C26.5733 18.3562 25.051 16.84 23.1733 16.84C21.2956 16.84 19.7733 18.3562 19.7733 20.2266C19.7733 22.097 21.2956 23.6133 23.1733 23.6133Z"
        fill={color}
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M26.56 3.66663V8.91996L11.5467 13.64V8.38663L26.56 3.66663Z"
        fill={color}
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M26.56 20.24V8.92004"
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>
  </svg>
);
const CollectionsIcon = ({ color = 'white' }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g opacity="0.69">
      <path
        d="M15.76 17.96L11.8667 15.8533C11.76 15.8 11.6667 15.7866 11.5867 15.7866C11.4534 15.7866 11.3467 15.84 11.2934 15.8666C11.2134 15.92 11.0134 16.0666 11.0134 16.36V20.5866C11.0134 20.88 11.2134 21.0266 11.2934 21.08C11.3734 21.12 11.6 21.2266 11.8667 21.08L15.76 18.9733C16.0267 18.8266 16.0534 18.5733 16.0534 18.4666C16.0534 18.3733 16.0267 18.1066 15.76 17.96Z"
        fill={color}
      />
      <path
        d="M21.4267 7.59998H5.64003C4.00003 7.59998 2.66669 8.93331 2.66669 10.5733V26.36C2.66669 28 4.00003 29.3333 5.64003 29.3333H21.4267C23.0667 29.3333 24.4 28 24.4 26.36V10.5733C24.4 8.93331 23.0667 7.59998 21.4267 7.59998ZM16.7067 20.7333L12.8133 22.84C12.4267 23.0533 12.0134 23.16 11.5867 23.16C11.1334 23.16 10.68 23.04 10.2667 22.8C9.48003 22.32 9.01337 21.4933 9.01337 20.5866V16.36C9.01337 15.44 9.48003 14.6133 10.2667 14.1466C11.0667 13.68 12.0133 13.6666 12.8133 14.0933L16.7067 16.2133C17.5467 16.6533 18.0534 17.52 18.0534 18.4666C18.0534 19.4133 17.5334 20.28 16.7067 20.7333Z"
        fill={color}
      />
      <path
        d="M26.3734 2.66663H10.5733C8.93334 2.66663 7.60004 3.99996 7.60004 5.63996C7.60004 6.18663 8.04004 6.63996 8.60004 6.63996C9.1467 6.63996 9.60004 6.18663 9.60004 5.63996C9.60004 5.10663 10.04 4.66663 10.5733 4.66663H26.3734C26.9067 4.66663 27.3334 5.10663 27.3334 5.63996V21.4266C27.3334 21.9733 26.9067 22.4133 26.3734 22.4133C25.8134 22.4133 25.3734 22.8533 25.3734 23.4133C25.3734 23.96 25.8134 24.4133 26.3734 24.4133C28 24.4133 29.3334 23.0666 29.3334 21.4266V5.63996C29.3334 3.99996 28 2.66663 26.3734 2.66663Z"
        fill={color}
      />
    </g>
  </svg>
);
const PlaylistsIcon = ({ color = 'white' }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g opacity="0.69">
      <path
        d="M16 14.2667C15.04 14.2667 14.2534 15.0401 14.2534 16.0001C14.2534 16.9601 15.04 17.7467 16 17.7467C16.96 17.7467 17.7467 16.9601 17.7467 16.0001C17.7467 15.0401 16.96 14.2667 16 14.2667Z"
        fill={color}
      />
      <path
        d="M16 2.66663C8.65335 2.66663 2.66669 8.65329 2.66669 16C2.66669 23.36 8.65335 29.3333 16 29.3333C23.3467 29.3333 29.3334 23.36 29.3334 16C29.3334 8.65329 23.3467 2.66663 16 2.66663ZM16 19.7466C13.9334 19.7466 12.2534 18.0666 12.2534 16C12.2534 13.9466 13.9334 12.2666 16 12.2666C18.0667 12.2666 19.7467 13.9466 19.7467 16C19.7467 18.0666 18.0667 19.7466 16 19.7466ZM7.30669 12.9333C8.24002 10.2933 10.28 8.23996 12.92 7.30663C13.4534 7.11996 14.0134 7.39996 14.2 7.91996C14.3867 8.43996 14.1067 9.01329 13.5867 9.18663C11.56 9.91996 9.90669 11.56 9.18669 13.6C9.04002 14.0133 8.65334 14.2666 8.24001 14.2666C8.13334 14.2666 8.02667 14.2533 7.90667 14.2133C7.38667 14.0266 7.12002 13.4533 7.30669 12.9333Z"
        fill={color}
      />
    </g>
  </svg>
);
const SubscriptionIcon = ({ color = 'white' }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.72008 27.2532C6.64507 27.2532 5.61409 26.8261 4.85394 26.066C4.09379 25.3058 3.66675 24.2748 3.66675 23.1998C3.66675 22.1248 4.09379 21.0938 4.85394 20.3337C5.61409 19.5735 6.64507 19.1465 7.72008 19.1465H9.00008V27.2532H7.72008Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M24.28 27.2532C25.355 27.2532 26.386 26.8261 27.1461 26.066C27.9063 25.3058 28.3333 24.2748 28.3333 23.1998C28.3333 22.1248 27.9063 21.0938 27.1461 20.3337C26.386 19.5735 25.355 19.1465 24.28 19.1465H23V27.2532H24.28Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M28.3334 23.2V17.48C28.3084 14.2339 26.995 11.1305 24.6821 8.85266C22.3692 6.57478 19.2463 5.30886 16.0001 5.33336C12.7539 5.30886 9.63093 6.57478 7.31804 8.85266C5.00515 11.1305 3.69176 14.2339 3.66675 17.48L3.66675 23.2"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const LikedIcon = ({ color = 'white' }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 28 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M27.3334 7.61334C27.3334 9.50666 26.6 11.28 25.2667 12.6133L14.8 23.08C14.7467 23.1333 14.6 23.2533 14.5334 23.2933C14.3734 23.4 14.1867 23.4533 14 23.4533C13.8134 23.4533 13.6134 23.4 13.4534 23.2933C13.3734 23.24 13.3067 23.1867 13.2267 23.1067L2.74669 12.6133C1.40002 11.28 0.666687 9.50666 0.666687 7.61334C0.666687 5.72001 1.40002 3.94668 2.74669 2.61334C5.50669 -0.133322 9.98669 -0.133322 12.7467 2.61334L14 3.88001L15.2667 2.61334C18.0267 -0.133322 22.5067 -0.133322 25.2534 2.61334C26.6 3.94668 27.3334 5.72001 27.3334 7.61334Z"
      fill={color}
    />
  </svg>
);
const CreatePlaylistIcon = ({ color = 'white' }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="0.5" y="0.5" width="23" height="23" rx="5.5" stroke={color} />
    <path d="M7 12H17" stroke={color} />
    <path d="M12 17L12 7" stroke={color} />
  </svg>
);
const MyPlaylistIcon = ({ color = 'white' }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12.8933 8.7998H25.3333"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.8933 16H25.3333"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.44008 10.6C8.41341 10.6 9.21341 9.78667 9.21341 8.8C9.21341 7.81333 8.41341 7 7.44008 7C6.45341 7 5.66675 7.81333 5.66675 8.8C5.66675 9.78667 6.46675 10.6 7.44008 10.6Z"
      fill={color}
    />
    <path
      d="M7.44008 14.2002C6.45341 14.2002 5.66675 15.0135 5.66675 16.0002C5.66675 16.9869 6.46675 17.8002 7.44008 17.8002C8.41341 17.8002 9.21341 16.9869 9.21341 16.0002C9.21341 15.0135 8.42675 14.2002 7.44008 14.2002Z"
      fill={color}
    />
    <path
      d="M7.44008 21.3999C6.45341 21.3999 5.66675 22.2132 5.66675 23.1999C5.66675 24.1866 6.46675 24.9999 7.44008 24.9999C8.41341 24.9999 9.21341 24.1866 9.21341 23.1999C9.22675 22.2132 8.42675 21.3999 7.44008 21.3999Z"
      fill={color}
    />
    <path
      d="M12.8933 23.2002H25.3333"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const AritistsIcon = ({ color = 'white' }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15.6801 15.4933C18.3867 15.4933 20.6001 13.2933 20.6001 10.5866C20.6001 7.87996 18.4001 5.66663 15.6801 5.66663C12.9734 5.66663 10.7734 7.86663 10.7734 10.5866C10.7734 13.3066 12.9734 15.4933 15.6801 15.4933Z"
      fill={color}
      fill-opacity="0.69"
    />
    <path
      d="M19.5198 17.4H12.4931C9.34647 17.4 6.7998 19.96 6.7998 23.0934V24C6.7998 25.28 7.85314 26.3334 9.13314 26.3334H22.8798C24.1598 26.3334 25.2131 25.28 25.2131 24V23.1067C25.2131 19.96 22.6531 17.4 19.5198 17.4Z"
      fill={color}
      fill-opacity="0.69"
    />
  </svg>
);

const Icons = {
  Home: <HomeIcon color={'rgba(255, 255, 255, 0.69)'} />,
  Search: <SearchIcon color={'rgba(255, 255, 255, 0.69)'} />,
  RecentlyPlayed: <RecentlyPlayedIcon color={'rgba(255, 255, 255, 0.69)'} />,
  NewAlbums: <CollectionsIcon color={'rgba(255, 255, 255, 0.69)'} />,
  Playlist: <PlaylistsIcon color={'rgba(255, 255, 255, 0.69)'} />,
  Artists: <AritistsIcon color={'rgba(255, 255, 255, 0.69)'} />,
  Subscription: <SubscriptionIcon color={'rgba(255, 255, 255, 0.69)'} />,
  Liked: <LikedIcon color={'rgba(255, 255, 255, 0.69)'} />,
  CreatePlaylist: <CreatePlaylistIcon />,
  Seperator1: (
    <div style={{ height: 1, width: '100%', background: '#3D3D3D' }} />
  ),
  Seperator2: (
    <div style={{ height: 1, width: '100%', background: '#3D3D3D' }} />
  )
};
const IconsActive = {
  Home: <HomeIcon />,
  Search: <SearchIcon />,
  RecentlyPlayed: <RecentlyPlayedIcon />,
  NewAlbums: <CollectionsIcon />,
  Playlist: <PlaylistsIcon />,
  Artists: <AritistsIcon />,
  Subscription: <SubscriptionIcon />,
  Liked: <LikedIcon />,
  CreatePlaylist: <CreatePlaylistIcon />,
  Seperator1: <div style={{ height: 0 }} />,
  Seperator2: <div style={{ height: 0 }} />
};

const TABS = {
  BrowseMusic: 'Browse Music',
  Home: 'Home',
  Search: 'Search',
  RecentlyPlayed: 'Recently Played',
  NewAlbums: 'Collections',
  Playlist: 'Playlist',
  Artists: 'Artists',
  // MyPlaylist: "My Playlist",
  Seperator1: '',
  // Subscription: 'Subscription',
  Liked: 'Liked',
  Seperator2: '',
  CreatePlaylist: 'Create Playlist'
};

const URL = {
  Home: '',
  Search: 'search',
  RecentlyPlayed: 'recentlyplayed',
  NewAlbums: 'albums',
  Playlist: 'playlist',
  Artists: 'artists',
  // MyPlaylist: "my-playlists",
  Liked: 'liked',
  Subscription: 'subscription',
  CreatePlaylist: 'Create Playlist'
};

export default function Sidebar(props: any) {
  return (
    <AppSidebar
      child={<SidebarContent seconds={props.seconds || 0} />}
      theme="dao-music"
    />
  );
}

const SidebarContent = (props: any) => {
  const history = useHistory();

  const [openCreatePlaylistModal, setOpenCreatePlaylistModal] =
    useState<boolean>(false);

  const handleOpenCreatePlaylistModal = () => {
    setOpenCreatePlaylistModal(true);
  };
  const handleCloseCreatePlaylistModal = () => {
    setOpenCreatePlaylistModal(false);
  };

  const [myPlaylists, setMyPlaylists] = useState<any[]>([]);
  const [curSelList, setCurSelList] = useState<number>(-1);
  const [isLoadingPlaylists, setIsLoadingPlaylists] = useState<boolean>(false);

  const openTab = React.useMemo(() => {
    const openTabs = window.location.href.split('/#/player')[1].split('/');
    return openTabs.length > 1 ? openTabs[1] : '';
  }, [window.location.href]);

  useEffect(() => {
    if (isLoadingPlaylists) return;
    getPlayLists();
  }, []);

  const getPlayLists = async () => {
    setIsLoadingPlaylists(true);
    const resp = await mediaGetMyPlaylists();
    setIsLoadingPlaylists(false);
    if (resp.success) {
      setMyPlaylists(
        resp.data.playlists?.filter((playlist) => !!playlist.Title?.trim())
      );
    }
  };

  useEffect(() => {
    if (curSelList >= 0 && myPlaylists?.length > 0 && myPlaylists[curSelList]) {
      history.push(`/player/playlist/${myPlaylists[curSelList].id}`);
    }
  }, [curSelList]);

  const handleClickMenuItem = (key) => {
    if (key === 'Create Playlist') {
      handleOpenCreatePlaylistModal();
    } else {
      history.push(`/player/${key}`);
      setCurSelList(-1);
    }
  };

  const handleClickMyList = (index) => {
    if (index < 0) return;
    setCurSelList(index);
  };

  return (
    <div className={styles.content}>
      <div className={styles.options}>
        <ul>
          <Box
            mt={4}
            mb={5}
            /*ml={5.5}*/ display="flex"
            flexDirection={'column'}
          >
            <Box
              style={{
                // width: 100,
                // height: 50,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                // background: '#4F4F4F',
                // borderTopLeftRadius: 25,
                // borderBottomLeftRadius: 25,
                // borderTopRightRadius: 40,
                // borderBottomRightRadius: 13,
                cursor: 'pointer'
              }}
              onClick={() => history.push('/')}
            >
              <img
                src={require('assets/logos/player_logo.webp')}
                alt="logo"
                style={{ width: 184 }}
              />
            </Box>
            {/* <Box
              className={styles.backButton}
              onClick={() => history.push('/')}
            >
              <LeftArrowIcon />
              <span style={{ marginLeft: 10 }}>WEB APP</span>
            </Box> */}
          </Box>
          <>
            {Object.keys(TABS).map((key, index) => (
              <li
                key={`option-${index}`}
                className={
                  curSelList < 0 && openTab === URL[key]
                    ? styles.linkSelected
                    : styles.linkNormal
                }
                onClick={() => handleClickMenuItem(URL[key])}
              >
                {key === 'BrowseMusic' && (
                  <span style={{ fontWeight: 'normal', color: '#FF00C6' }}>
                    {TABS[key]}
                  </span>
                )}
                {key === 'CreatePlaylist' && (
                  <span
                    style={{
                      marginRight: 10,
                      fontWeight: 'normal',
                      color: '#FF00C6'
                    }}
                  >
                    {TABS[key]}
                  </span>
                )}
                <div style={{ position: 'relative' }}>
                  <div
                    className={
                      curSelList < 0 && openTab === URL[key]
                        ? styles.selectedLinkItem
                        : ''
                    }
                  />
                  {curSelList < 0 && openTab === URL[key]
                    ? IconsActive[key]
                    : Icons[key]}{' '}
                </div>
                {key !== 'CreatePlaylist' && key !== 'BrowseMusic' && (
                  <span
                    style={{
                      marginLeft: 10,
                      fontWeight: openTab === URL[key] ? 'bold' : 'normal',
                      color:
                        curSelList < 0 && openTab === URL[key]
                          ? '#fff'
                          : 'rgba(255, 255, 255, 0.69)'
                    }}
                  >
                    {TABS[key]}
                  </span>
                )}
              </li>
            ))}
            {isLoadingPlaylists ? (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {Array(3)
                  .fill(0)
                  .map((v, i) => (
                    <Box mb={2} width="100%" key={`my-playlist-${i}`}>
                      <SkeletonBox
                        loading={true}
                        height="20px"
                        style={{
                          background: '#666',
                          marginLeft: 32,
                          marginRight: 64
                        }}
                      />
                    </Box>
                  ))}
                {/* <CircularProgress
                style={{ marginLeft: -32, marginTop: 16, color: '#A0D800' }}
              /> */}
              </div>
            ) : (
              <>
                {myPlaylists.map((playlist, index) => (
                  <li
                    key={`my-playlist-${index}`}
                    className={
                      curSelList >= 0 && curSelList === index
                        ? styles.linkSelected
                        : styles.linkNormal
                    }
                    onClick={() => handleClickMyList(index)}
                  >
                    <div style={{ position: 'relative' }}>
                      <div
                        className={
                          curSelList >= 0 && curSelList === index
                            ? styles.selectedLinkItem
                            : ''
                        }
                      />
                      {curSelList >= 0 && curSelList === index ? (
                        <MyPlaylistIcon color={'#fff'} />
                      ) : (
                        <MyPlaylistIcon color="rgba(255, 255, 255, 0.69)" />
                      )}{' '}
                    </div>
                    <div
                      style={{
                        marginLeft: 10,
                        fontWeight:
                          curSelList >= 0 && curSelList === index
                            ? 'bold'
                            : 'normal',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        color:
                          curSelList >= 0 && curSelList === index
                            ? '#fff'
                            : 'rgba(255, 255, 255, 0.69)'
                      }}
                    >
                      {playlist.Title}
                    </div>
                  </li>
                ))}
              </>
            )}
          </>
        </ul>
        {/* <ul>
          <li onClick={handleOpenCreatePlaylistModal}>
            <img src={require("assets/icons/create_playlist.webp")} alt="create playlist" />
            Create Playlist
          </li>
        </ul> */}
      </div>
      {openCreatePlaylistModal && (
        <CreatePlaylistModal
          open={openCreatePlaylistModal}
          handleClose={handleCloseCreatePlaylistModal}
          handleRefresh={(newPlaylist) => {
            if (!newPlaylist) return;
            const lastIndex = myPlaylists?.length ?? -1;
            setMyPlaylists((prev) => [...prev, newPlaylist]);
            setCurSelList(lastIndex + 1);
          }}
          item={undefined}
        />
      )}
    </div>
  );
};
