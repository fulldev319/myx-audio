import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import { Modal, PrimaryButton } from 'shared/ui-kit';
import { RootState } from 'store/reducers/Reducer';
import { updateProfileBackground } from 'store/actions/User';
import URL from 'shared/functions/getURL';
import AlertMessage from 'shared/ui-kit/Alert/AlertMessage';
import { changeProfileBackgroundModalStyles } from './ChangeProfileBackgroundModal.styles';

const Default_BG = 'profile_bg_004.jpeg';

export default function ChangeProfileBackgroundModal(props) {
  let user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const classes = changeProfileBackgroundModalStyles();

  const [backgroundImages, setBackgroundImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [status, setStatus] = useState<any>(null);

  useEffect(() => {
    const a = [] as any[];
    const images = require.context(
      'assets/backgrounds/profile/',
      false,
      /.*\.(jpg|png|webp)$/
    );
    images.keys().forEach((key) => {
      images(key);
    });
    images.keys().forEach((path) => {
      let newPath = path.slice(2);
      a.push(newPath);
    });
    setBackgroundImages(a);
  }, []);

  useEffect(() => {
    if (user.backgroundURL) {
      setSelectedImage(user.backgroundURL);
    } else {
      setSelectedImage(Default_BG);
    }
  }, [user.backgroundURL]);

  const handleChangeBG = () => {
    const body = {
      userId: user.id,
      backgroundURL: selectedImage
    };

    axios
      .post(`${URL()}/user/changeProfileBackground`, body)
      .then((response) => {
        if (response.data.success) {
          setStatus({
            msg: 'Update background success',
            key: Math.random(),
            variant: 'success'
          });

          //update redux data aswell
          dispatch(updateProfileBackground(body.backgroundURL));
          props.onClose();
        } else {
          setStatus({
            msg: 'Update background failed',
            key: Math.random(),
            variant: 'error'
          });
        }
      })
      .catch((error) => {
        setStatus({
          msg: 'Update background failed: ' + error,
          key: Math.random(),
          variant: 'error'
        });
      });
  };

  return (
    <Modal
      className={classes.root}
      isOpen={props.open}
      onClose={props.onClose}
      showCloseIcon
      size="medium"
    >
      <div>
        <div className={classes.headerSection}>
          <h3>Background</h3>
        </div>
        <div className={classes.avatarList}>
          {backgroundImages.map((avatar, index) => {
            return (
              <div
                key={avatar}
                className={
                  avatar === selectedImage
                    ? classes.avatarSelected
                    : classes.avatar
                }
                style={{
                  backgroundImage: `url(${require(`assets/backgrounds/profile/${avatar}`)})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
                onClick={() => setSelectedImage(avatar)}
              />
            );
          })}
        </div>
        <div className={classes.footerSection}>
          <PrimaryButton
            className={classes.primaryBtn}
            size="medium"
            onClick={handleChangeBG}
          >
            Update Image
          </PrimaryButton>
        </div>
      </div>
      {status ? (
        <AlertMessage
          key={status.key}
          message={status.msg}
          variant={status.variant}
        />
      ) : (
        ''
      )}
    </Modal>
  );
}
