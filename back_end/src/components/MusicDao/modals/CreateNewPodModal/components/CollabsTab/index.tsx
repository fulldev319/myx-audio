import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDebounce } from 'use-debounce/lib';

import Autocomplete from '@material-ui/lab/Autocomplete';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputBase from '@material-ui/core/InputBase';
import Radio from '@material-ui/core/Radio';

import { RootState } from 'store/reducers/Reducer';
import { Avatar, Color, ContentType } from 'shared/ui-kit';
import Box from 'shared/ui-kit/Box';
import { getDefaultAvatar } from 'shared/services/user/getUserAvatar';
import { getMatchingUsers, IAutocompleteUsers } from 'shared/services/API';
import { processImage } from 'shared/helpers';

import { collabsTabStyles, useAutocompleteStyles } from './index.styles';
import { createPodModalStyles } from '../../index.styles';

const CollabsTab = ({ pod, setPod, podType }) => {
  const classes = collabsTabStyles();
  const modalClasses = createPodModalStyles();
  const autocompleteStyle = useAutocompleteStyles();

  const user = useSelector((state: RootState) => state.user);

  const [autocompleteKey, setAutocompleteKey] = useState<number>(
    new Date().getTime()
  );

  const [searchValue, setSearchValue] = useState<string>('');
  const [debouncedValue] = useDebounce(searchValue, 500);
  const [autocompleteUsers, setAutocompleteUsers] = useState<
    IAutocompleteUsers[]
  >([]);

  // refresh autocomplete user list when searchValue changed
  useEffect(() => {
    if (debouncedValue) {
      getMatchingUsers(searchValue, ['urlSlug', 'firstName', 'address']).then(
        async (resp) => {
          if (resp?.success) {
            const filteredUsers = resp.data.filter(
              (u) =>
                u.artistId &&
                u.imageUrl?.length > 0 &&
                u.address &&
                u.address.toLowerCase() != user.address.toLowerCase()
            );
            setAutocompleteUsers(filteredUsers);
          }
        }
      );
    } else {
      setAutocompleteUsers([]);
    }
  }, [debouncedValue]);

  const addAddressToSelectedList = (user) => {
    const newCollabs = [...pod.Collabs];
    newCollabs.push(user);
    setPod({ ...pod, Collabs: newCollabs, IsCollabAddLater: false });
  };

  const removeAddressFromSelectedList = (user) => {
    const newCollabs = pod.Collabs.filter(
      (u) => user.address.toLowerCase() !== u.address.toLowerCase()
    );
    setPod({ ...pod, Collabs: newCollabs });
  };

  const handleLater = () => {
    setPod({ ...pod, IsCollabAddLater: !pod.IsCollabAddLater });
  };
  const handleForMe = () => {
    setPod({ ...pod, IsJustForMe: !pod.IsJustForMe });
  };

  return (
    <>
      <div style={{ position: 'relative' }}>
        {/* {podType === ContentType.PodCollaborative && (
          <>
            <Box
              className={classes.radioSection}
              style={{
                background:
                  'linear-gradient(0deg, rgba(218, 230, 221, 0.31), rgba(218, 230, 221, 0.31))',
                color: '#2D3047'
              }}
            >
              Create Individual Capsule just for Me
              <Box
                className={modalClasses.radio}
                mt={2}
                style={{ position: 'absolute', bottom: 6, left: 10 }}
              >
                <FormControlLabel
                  control={
                    <Radio
                      checked={pod.IsJustForMe || false}
                      onClick={handleForMe}
                      disableRipple
                    />
                  }
                  label=""
                />
              </Box>
            </Box>
            <Box className={classes.orDivider} my={4}>
              <span />
              <div>or</div>
              <span />
            </Box>
          </>
        )} */}
        <div style={{ opacity: pod.IsJustForMe ? 0.4 : 1 }}>
          <Box className={modalClasses.subTitle} mb={1}>
            Invite collaborators now
          </Box>
          <Autocomplete
            freeSolo
            key={autocompleteKey}
            classes={autocompleteStyle}
            onChange={(event: any, user: any | null) => {
              if (user && typeof user !== 'string') {
                addAddressToSelectedList(user);
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
                    url={processImage(option.imageUrl) ?? getDefaultAvatar()}
                    size="small"
                  />
                  <Box className={classes.urlSlug}>{`@${option.urlSlug}`}</Box>
                </Box>
                <Box
                  display="flex"
                  color={Color.MusicDAOBlue}
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
                        stroke="white"
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
                  !pod.Collabs.find(
                    (collab) =>
                      collab.address.toLowerCase() ===
                      option.address.toLowerCase()
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
            disabled={pod.IsCollabAddLater || pod.IsJustForMe}
          />
          {podType === ContentType.PodCollaborative && pod.Collabs.length < 2 && (
            <>
              <Box
                className={classes.radioSection}
                mt={4}
                style={{
                  background:
                    'linear-gradient(0deg, rgba(218, 230, 229, 0.06), rgba(218, 230, 229, 0.06))',
                  color: Color.MusicDAOBlue
                }}
              >
                Add Collaborators later
                <Box
                  className={modalClasses.radio}
                  mt={2}
                  style={{ position: 'absolute', bottom: 6, left: 10 }}
                >
                  <FormControlLabel
                    control={
                      <Radio
                        checked={pod.IsCollabAddLater || false}
                        onClick={handleLater}
                        disableRipple
                        disabled={pod.IsJustForMe}
                      />
                    }
                    label=""
                  />
                </Box>
              </Box>
            </>
          )}
        </div>
        {podType === ContentType.PodInvestment && pod.Collabs.length < 2 && (
          <Box className={modalClasses.radio} mt={2}>
            <FormControlLabel
              control={
                <Radio
                  checked={pod.IsCollabAddLater || false}
                  onClick={handleLater}
                  disableRipple
                />
              }
              label="I will add them later"
            />
          </Box>
        )}
      </div>
      {pod.Collabs.filter(
        (u) => u.address.toLowerCase() !== user.address.toLowerCase()
      ).length > 0 && (
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
          {pod.Collabs.map((u, index) =>
            u.address.toLowerCase() !== user.address.toLowerCase() ? (
              <UserTile
                key={`user-${index}-tile`}
                user={u}
                onClick={() => {
                  removeAddressFromSelectedList(u);
                }}
              />
            ) : null
          )}
        </>
      )}
    </>
  );
};

const UserTile = ({ user, onClick }) => {
  const classes = collabsTabStyles();

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
        <Box className={classes.invitationSentBtn}>Added</Box>
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

export default CollabsTab;
