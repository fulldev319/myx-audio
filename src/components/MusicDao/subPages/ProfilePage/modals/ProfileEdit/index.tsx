import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import cls from 'classnames';
import { countries } from 'countries-list';

// import { Tooltip, Fade } from "@material-ui/core";

import { socket } from 'components/Login/Auth';
import { setUpdateBasicInfo } from 'store/actions/UpdateBasicInfo';
import { editUser } from 'store/actions/User';
import { RootState } from 'store/reducers/Reducer';
import { SocialPrimaryButton } from 'components/MusicDao/index.styles';

import { useAlertMessage } from 'shared/hooks/useAlertMessage';
import URL, { SPOTIFY_VERIFY_URL } from 'shared/functions/getURL';
import { DateInput } from 'shared/ui-kit/DateTimeInput';
import { AutocompleteSingleSelect } from 'shared/ui-kit/Autocomplete/SingleSelect/AutocompleteSingleSelect';
import CustomSwitch from 'shared/ui-kit/CustomSwitch';
import { Modal /*, TabNavigation */ } from 'shared/ui-kit';
import Box from 'shared/ui-kit/Box';
import InputWithLabelAndTooltip from 'shared/ui-kit/InputWithLabelAndTooltip';
import { validEmail } from 'shared/constants/constants';

import { profileEditModalStyles } from './index.styles';
import { LoadingWrapper } from 'shared/ui-kit/Hocs';

// const infoIcon = require("assets/icons/info.svg");
const twitterIcon = require('assets/icons/socialTwitter.svg');
// const facebookIcon = require("assets/icons/socialFacebook.svg");
const instagramIcon = require('assets/icons/socialInstagram.svg');
const tiktokIcon = require('assets/snsIcons/tiktok.svg');
const youtubeIcon = require('assets/snsIcons/youtube.svg');
const spotifyIcon = require('assets/snsIcons/spotify.svg');

type Country = {
  id: string;
  name: string;
};

const ProfileEditModal = ({
  open,
  onCloseModal,
  toggleAnonymousMode,
  getBasicInfo,
  handleVerifyProfileModal
}) => {
  let userSelector = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const classes = profileEditModalStyles();

  const [user, setUser] = useState<any>(
    userSelector ? userSelector : { country: '', dob: 0 }
  );
  // HOOKS
  const { showAlertMessage } = useAlertMessage();

  const inputRef: any = useRef([]);
  const [editionProgress, setEditionProgress] = useState(false);
  const [editProfileMenuSelection, setEditProfileMenuSelection] =
    useState<number>(0);
  const [selectedCountry, setSelectedCountry] = useState<Country>({
    id: '',
    name: ''
  });

  // const editProfileMenuOptions = ["General", "Social"];
  const ALL_COUNTRIES = React.useMemo(
    () =>
      Object.entries(countries).map(([key, c]) => ({ id: key, name: c.name })),
    [countries]
  );

  useEffect(() => {
    // server get the callback from spotify and notice the spotify username from here
    if (socket) {
      const spotifyVerifyHandler = ({ userId, spotify }) => {
        if (userSelector && userSelector.id === userId && spotify) {
          let setterUser: any = { ...userSelector, spotify: spotify };
          setUser(setterUser);
        }
      };

      socket.on('spotifyVerify', spotifyVerifyHandler);

      return () => {
        socket.removeListener('spotifyVerify', spotifyVerifyHandler);
      };
    }
  }, [socket]);

  useEffect(() => {
    if (userSelector && !editionProgress) {
      setUser({
        ...userSelector,
        name: `${userSelector.firstName ?? ''} ${userSelector.lastName ?? ''}`,
        userAddress: userSelector.userAddress ?? '',
        urlSlug: userSelector.urlSlug ?? ''
      });
      inputRef.current = new Array(10);
    }
    //eslint-disable react-hooks/exhaustive-deps
  }, [userSelector, editionProgress]);

  const handleDateChange = (elem: any) => {
    let date = new Date(elem).getTime();
    let userCopy = { ...user };
    userCopy.dob = date;
    setUser(userCopy);
  };

  const checkSlug = async () => {
    const acceptedChars = "^[a-zA-Z0-9\\._\\-' ]{1,100}$";
    user.urlSlug.match(acceptedChars);

    //check special characters
    if (!user.urlSlug.match(acceptedChars)) {
      showAlertMessage(
        'Please type only letters, numbers, or special characters . , - and _ in your profile URL',
        { variant: 'error' }
      );
      return false;
    } else {
      if (user.urlSlug.endsWith('.')) {
        showAlertMessage("Profile URL can't end with a .", {
          variant: 'error'
        });
        return false;
      } else if (user.urlSlug.startsWith('.', 0)) {
        showAlertMessage("Profile URL can't start with a .", {
          variant: 'error'
        });
        return false;
      } else {
        //check if slug exists
        return await axios
          .get(`${URL()}/user/checkSlugExists/${user.urlSlug}/${user.id}/user`)
          .then((response) => {
            if (response.data.success) {
              if (response.data.data.urlSlugExists) {
                showAlertMessage(
                  'This profile URL is being used. Please, choose another one.',
                  {
                    variant: 'error'
                  }
                );
                return false;
              } else {
                return true;
              }
            } else {
              showAlertMessage('Error when checking url, please try again', {
                variant: 'error'
              });
              return false;
            }
          })
          .catch((error) => {
            showAlertMessage(
              'Error when making the request, please try again',
              { variant: 'error' }
            );
            return false;
          });
      }
    }
  };

  const checkEmail = async () => {
    if (user.email) {
      if (!validEmail(user.email)) {
        showAlertMessage('Please enter a valid email', { variant: 'error' });
        return false;
      }
      return await axios
        .get(`${URL()}/user/checkEmailExists/${user.email}/${user.id}`)
        .then((response) => {
          if (response.data.success) {
            if (response.data.data.emailExist) {
              showAlertMessage(
                'This email is being used. Please, give another one.',
                {
                  variant: 'error'
                }
              );
              return false;
            } else {
              return true;
            }
          } else {
            showAlertMessage('Error when checking email, please try again', {
              variant: 'error'
            });
            return false;
          }
        })
        .catch((error) => {
          showAlertMessage('Error when making the request, please try again', {
            variant: 'error'
          });
          return false;
        });
    } else return true;
  };

  const editProfile = async () => {
    setEditionProgress(true);
    let flag = await checkEmail();
    if (!flag) {
      setEditionProgress(false);
      return;
    }
    flag = await checkSlug();
    if (flag) {
      let nameSplit = user.name.split(' ');
      let lastNameArray = nameSplit.filter((item, i) => {
        return i !== 0;
      });
      user.firstName = nameSplit[0];
      user.lastName = '';
      for (let i = 0; i < lastNameArray.length; i++) {
        if (lastNameArray.length === i + 1) {
          user.lastName = user.lastName + lastNameArray[i];
        } else {
          user.lastName = user.lastName + lastNameArray[i] + ' ';
        }
      }

      user.instagram = user.instagram?.replace('https://instagram.com/', '');
      user.twitter = user.twitter?.replace('https://twitter.com/', '');
      user.tiktok = user.tiktok?.replace('https://tiktok.com/', '');
      user.youtube = user.youtube?.replace('https://www.youtube.com/user/', '');

      axios
        .post(`${URL()}/user/editUser`, user)
        .then((response) => {
          if (response.data.success) {
            showAlertMessage('Profile updated successfully!', {
              variant: 'success'
            });
            localStorage.setItem('urlSlug', user.urlSlug);
            dispatch(editUser(response.data.data));

            getBasicInfo(user.id, true);
            setTimeout(() => {
              onCloseModal();
              dispatch(setUpdateBasicInfo(true));
            }, 1000);
          } else {
            let errorMsg = 'Something wrong, please try again later';
            if (response.data.validations?.length) {
              errorMsg = response.data.validations[0].message;
            }
            showAlertMessage(errorMsg, { variant: 'error' });
            setEditionProgress(false);
          }
        })
        .catch((error) => {
          showAlertMessage('Error when making the request', {
            variant: 'error'
          });
          setEditionProgress(false);
        });
    } else {
      setEditionProgress(false);
    }
  };

  const verifySpotify = () => {
    // spotify return this with callback and can check from which user.
    const state = 'SPOTIFY_VERIFY-' + userSelector.id;
    // open verify page as new window.
    window.open(SPOTIFY_VERIFY_URL(state), '', 'width=400,height=700');
  };

  if (userSelector)
    return (
      <Modal
        className={classes.root}
        size="medium"
        isOpen={open}
        onClose={onCloseModal}
        showCloseIcon
      >
        <div className={classes.tabWrapper}>
          <Box
            width="fit-content"
            display="flex"
            flexDirection="column"
            alignItems="start"
          >
            <div className="private-title">
              <span>Private mode</span>
              {/* <Tooltip
                TransitionComponent={Fade}
                TransitionProps={{ timeout: 600 }}
                arrow
                className="tooltip"
                title={`While using the MUSIC network, you have the option to share your data or not. When you see an advertisement, you earn MUSIC data coins. This part of the system at this time is not functional, any ad you see is simply as an example. To learn more about MUSIC Data and how you can make money off our data, head to our Medium or ask our Community in either MUSIC Communities or Governance`}
              >
                <img className="icon" src={infoIcon} alt="info" />
              </Tooltip> */}
            </div>
            <div className="anon-mode">
              <CustomSwitch
                checked={userSelector.anon}
                theme="green1"
                onChange={() => {
                  toggleAnonymousMode(!userSelector.anon);
                }}
              />
            </div>
          </Box>
          <div className={classes.title}>Edit Profile</div>
          <div className={classes.cardsOptions}>
            <div
              onClick={() => setEditProfileMenuSelection(0)}
              className={cls(
                {
                  [classes.tabHeaderPodMediaSelected]:
                    editProfileMenuSelection === 0
                },
                classes.tabHeaderPodMedia
              )}
            >
              General
            </div>
            <div
              className={cls(
                {
                  [classes.tabHeaderPodMediaSelected]:
                    editProfileMenuSelection === 1
                },
                classes.tabHeaderPodMedia
              )}
              onClick={() => setEditProfileMenuSelection(1)}
            >
              Social
            </div>
          </div>
          {/* <TabNavigation
            tabs={editProfileMenuOptions}
            currentTab={editProfileMenuSelection}
            variant="primary"
            onTabChange={setEditProfileMenuSelection}
            padding={0}
            theme="green"
          /> */}
        </div>

        {/* SOCIAL */}
        {editProfileMenuSelection === 1 ? (
          <>
            {/* TWITTER */}
            <InputWithLabelAndTooltip
              theme="light"
              type={'text'}
              inputValue={user.twitter}
              onInputValueChange={(elem) => {
                let userCopy = { ...user };
                userCopy.twitter = elem.target.value;
                setUser(userCopy);
              }}
              disabled
              labelName="Twitter"
              endAdornment={
                <img
                  src={twitterIcon}
                  alt="twitter"
                  style={{ cursor: 'pointer' }}
                  onClick={handleVerifyProfileModal}
                />
              }
              placeHolder={'Type your nickname'}
            />

            {/* FACEBOOK */}
            {/* <InputWithLabelAndTooltip
              theme="light"
              type={"text"}
              inputValue={user.facebook}
              onInputValueChange={elem => {
                let userCopy = { ...user };
                userCopy.facebook = elem.target.value;
                setUser(userCopy);
              }}
              labelName="Facebook"
              endAdornment={<img src={facebookIcon} alt="facebook" />}
              placeHolder={"Connect your Facebook account"}
              // tooltip={`Connect your Facebook account to your MUSIC profile account.`}
            /> */}

            {/* INSTAGRAM */}
            <InputWithLabelAndTooltip
              theme="light"
              type={'text'}
              inputValue={user.instagram}
              onInputValueChange={(elem) => {
                let userCopy = { ...user };
                userCopy.instagram = elem.target.value;
                setUser(userCopy);
              }}
              labelName="Instagram"
              endAdornment={<img src={instagramIcon} alt="instagram" />}
              placeHolder={'Type your nickname'}
            />

            {/* TIKTOK */}
            <InputWithLabelAndTooltip
              theme="light"
              type={'text'}
              inputValue={user.tiktok}
              onInputValueChange={(elem) => {
                let userCopy = { ...user };
                userCopy.tiktok = elem.target.value;
                setUser(userCopy);
              }}
              labelName="Tiktok"
              endAdornment={<img src={tiktokIcon} alt="tiktok" width="20px" />}
              placeHolder={'Type your nickname'}
            />

            {/* YOUTUBE */}
            <InputWithLabelAndTooltip
              theme="light"
              type={'text'}
              inputValue={user.youtube}
              onInputValueChange={(elem) => {
                let userCopy = { ...user };
                userCopy.youtube = elem.target.value;
                setUser(userCopy);
              }}
              labelName="Youtube"
              endAdornment={
                <img src={youtubeIcon} alt="youtube" width="20px" />
              }
              placeHolder={'Type your nickname'}
            />

            {/* Spotify */}
            {/* <InputWithLabelAndTooltip
              theme="light"
              type={"text"}
              inputValue={user.spotify}
              onInputValueChange={elem => {
                let userCopy = { ...user };
                userCopy.spotify = elem.target.value.split("\\").pop().split("/").pop();
                setUser(userCopy);
              }}
              labelName="Spotify"
              endAdornment={
                <img src={spotifyIcon} alt="spotify" style={{ cursor: "pointer" }} onClick={verifySpotify} />
              }
              placeHolder={"Click icon to verify your account"}
              disabled
            /> */}
          </>
        ) : null}

        {/* GENERAL */}
        {editProfileMenuSelection === 0 ? (
          <>
            <InputWithLabelAndTooltip
              theme="light"
              type={'text'}
              inputValue={user.name}
              onInputValueChange={(elem) => {
                let userCopy = { ...user };
                userCopy.name = elem.target.value;
                setUser(userCopy);
              }}
              labelName="Name"
              placeHolder={'Enter your name'}
            />
            <InputWithLabelAndTooltip
              theme="light"
              type={'text'}
              inputValue={user.email}
              onInputValueChange={(elem) => {
                let userCopy = { ...user };
                userCopy.email = elem.target.value;
                setUser(userCopy);
              }}
              labelName="Email"
              placeHolder={'Enter your Email'}
            />
            <div>
              <div style={{ marginTop: 0, marginBottom: 8, width: '100%' }}>
                <div className={classes.infoHeaderEdit}>Country</div>
              </div>
              <AutocompleteSingleSelect
                allItems={ALL_COUNTRIES}
                selectedItem={
                  ALL_COUNTRIES.find((item) => item.name === user.country) ||
                  selectedCountry
                }
                onSelectedItemChange={(country) => {
                  setSelectedCountry(country);
                  setUser({
                    ...user,
                    country: country.name
                  });
                }}
                placeholder="Select countries"
                getOptionLabel={(country) => country.name}
                renderOption={(country) => country.name}
              />
            </div>
            <div
              style={{ marginTop: '16px', marginBottom: '16px', width: '100%' }}
            >
              <div className={classes.flexRowInputs}>
                <div className={classes.infoHeaderEdit}>Date of Birth</div>
                {/* <Tooltip
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 600 }}
                  arrow
                  title={"Enter your birthday date"}
                >
                  <img className={classes.infoIconEdit} src={infoIcon} alt={"info"} />
                </Tooltip> */}
              </div>
              <div style={{ marginTop: '8px' }}>
                <DateInput
                  id="date-picker-start-date"
                  maxDate={new Date()}
                  placeholder="Select your date of birthday"
                  value={user.dob}
                  onChange={handleDateChange}
                />
              </div>
            </div>
            <InputWithLabelAndTooltip
              theme="light"
              type={'text'}
              inputValue={user.urlSlug}
              onInputValueChange={(elem) => {
                let userCopy = { ...user };
                userCopy.urlSlug = elem.target.value;
                setUser(userCopy);
              }}
              labelName="Profile URL"
              placeHolder={'Enter a custom profile URL'}
              // tooltip={"Customize your profile's URL with a custom Slug, to display in the navigation bar"}
            />

            <InputWithLabelAndTooltip
              theme="light"
              type={'textarea'}
              inputValue={user.bio}
              onInputValueChange={(elem) => {
                let userCopy = { ...user };
                userCopy.bio = elem.target.value;
                setUser(userCopy);
              }}
              labelName="Bio"
              placeHolder={'Enter your bio'}
              style={{ rows: 5 }}
              // tooltip={"Type a small bio to let everyone know about yourself"}
            />
          </>
        ) : null}

        <div className={classes.editButton}>
          {editionProgress ? (
            <LoadingWrapper loading />
          ) : (
            <SocialPrimaryButton onClick={editProfile} className={'btnBody'}>
              Save Changes
            </SocialPrimaryButton>
          )}
        </div>
      </Modal>
    );
  else return null;
};

export default ProfileEditModal;
