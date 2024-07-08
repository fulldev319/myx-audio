import React, { useEffect, useState } from 'react';
import axios from 'axios';

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import Fade from '@material-ui/core/Fade';
import Tooltip from '@material-ui/core/Tooltip';

import FileUpload from 'shared/ui-kit/Page-components/FileUpload';
import QuillEditor from 'shared/ui-kit/QuillEditor';
import { newWallPostModalStyles } from './index.styles';
import { Color, Modal, PrimaryButton, SecondaryButton } from 'shared/ui-kit';
import Box from 'shared/ui-kit/Box';
import InputWithLabelAndTooltip from 'shared/ui-kit/InputWithLabelAndTooltip';
import URL from 'shared/functions/getURL';

// import { ReactComponent as InfoIcon } from 'assets/icons/info.svg';
// import DateFnsUtils from '@date-io/date-fns';
// import CustomSwitch from 'shared/ui-kit/CustomSwitch';
import { useAlertMessage } from 'shared/hooks/useAlertMessage';
import { useTypedSelector } from 'store/reducers/Reducer';
import { getUser } from 'store/selectors';
import useIPFS from 'shared/utils-IPFS/useIPFS';
import getIPFSURL from 'shared/functions/getIPFSURL';
import { onUploadNonEncrypt } from '../../../../shared/ipfs/upload';

const CreateNewWallPostModal = (props: any) => {
  const classes = newWallPostModalStyles();
  const { showAlertMessage } = useAlertMessage();
  const user = useTypedSelector(getUser);

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [hashTag, setHashTag] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [postDate, setPostDate] = useState<Date>(new Date());

  const [upload1, setUpload1] = useState<any>(null);
  const [uploadImg1, setUploadImg1] = useState<any>(null);
  const [upload2, setUpload2] = useState<any>(null);
  const [uploadImg2, setUploadImg2] = useState<any>(null);
  const [editorState, setEditorState] = useState('');

  // const [scheduledPost, setScheduledPost] = useState<boolean>(true);
  const [enableComments, setEnableComments] = useState<boolean>(true);
  const [enableMusicWall, setEnableMusicWall] = useState<boolean>(true);

  const [creationProgress, setCreationProgress] = useState(false);

  const { ipfs, setMultiAddr, uploadWithNonEncryption } = useIPFS();

  useEffect(() => {
    setMultiAddr(`${getIPFSURL()}/api/v0`);
  }, []);

  const onChange = (editorState) => {
    //console.log(editorState);
    setEditorState(editorState);
  };

  const addHashTag = () => {
    setTags((prev) => {
      setHashTag('');
      return [...prev, hashTag];
    });
  };

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      addHashTag();
    }
  }

  const validatePostInfo = () => {
    if (!title || title.length <= 5) {
      showAlertMessage('Title field invalid. Minimum 5 characters required.', {
        variant: 'error'
      });
      return false;
    } else if (!description || description.length <= 5) {
      showAlertMessage(
        'Preview Text field invalid. Minimum 5 characters required.',
        {
          variant: 'error'
        }
      );
      return false;
    } else if (!tags || tags.length <= 0) {
      showAlertMessage('Minimum 1 Hashtag is required.', {
        variant: 'error'
      });
      return false;
    } else if (!upload1) {
      showAlertMessage('Media Image is required.', {
        variant: 'error'
      });
      return false;
    }
    return true;
  };

  const handleNewWallPost = async () => {
    if (validatePostInfo()) {
      let infoImage = upload1
        ? await onUploadNonEncrypt(upload1, (file) =>
            uploadWithNonEncryption(file)
          )
        : undefined;
      let infoVideo = upload2
        ? await onUploadNonEncrypt(upload2, (file) =>
            uploadWithNonEncryption(file)
          )
        : undefined;

      setCreationProgress(true);
      let body = {} as any;
      body.post = {
        title: title,
        shortPreviewText: description,
        hashtags: tags,
        description: editorState,
        descriptionArray: editorState,
        scheduledPost: postDate,
        enableComments: enableComments,
        shareWithYourMusicWall: enableMusicWall,
        hasPhoto: uploadImg1 ? true : false,
        hasVideo: uploadImg2 ? true : false
      };
      body.podId = props.podId;
      body.author = user.address;
      body.userId = user.id;
      body.podType = 'TRAX';
      body.infoImage = infoImage;
      body.infoVideo = infoVideo;

      axios
        .post(`${URL()}/pod/discussion/wall/createPost`, body)
        .then(async (response) => {
          const resp = response.data;
          if (resp.success) {
            showAlertMessage('Post created.', {
              variant: 'success'
            });
            setTimeout(() => {
              props.postCreated();
              props.handleClose();
            }, 1000);
          } else {
            showAlertMessage('Error when creating Post', {
              variant: 'error'
            });
          }
          setCreationProgress(false);
        })
        .catch((error) => {
          showAlertMessage('Error when making the request.', {
            variant: 'error'
          });
          setCreationProgress(false);
        });
    }
  };

  return (
    <Modal
      size="medium"
      isOpen={props.open}
      onClose={props.handleClose}
      showCloseIcon
    >
      <Box className={classes.contentBox}>
        <Box className={classes.flexBox} justifyContent="center">
          <Box className={classes.title}>Create new post</Box>
        </Box>
        <Box mt={4}>
          <Box className={classes.flexBox} justifyContent="space-between">
            <Box className={classes.header1}>Post Title</Box>
            {/* <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} arrow title={""}>
              <InfoIcon style={{ color: "grey", width: "14px" }} />
            </Tooltip> */}
          </Box>
          <InputWithLabelAndTooltip
            placeHolder="Placeholder text"
            type="text"
            theme="music dao"
            inputValue={title}
            onInputValueChange={(e) => setTitle(e.target.value)}
          />
        </Box>
        <Box mt={4.5}>
          <Box className={classes.flexBox} justifyContent="space-between">
            <Box className={classes.header1}>Short preview text</Box>
            {/* <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} arrow title={""}>
              <InfoIcon style={{ color: "grey", width: "14px" }} />
            </Tooltip> */}
          </Box>
          <InputWithLabelAndTooltip
            placeHolder="Describe briefly the scope of this wall post."
            type="textarea"
            theme="music dao"
            inputValue={description}
            onInputValueChange={(e) => setDescription(e.target.value)}
          />
        </Box>
        <Box mt={3.5}>
          <Box className={classes.flexBox} justifyContent="space-between">
            <Box className={classes.header1}>Hashtags</Box>
            {/* <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} arrow title={""}>
              <InfoIcon style={{ color: "grey", width: "14px" }} />
            </Tooltip> */}
          </Box>
          <InputWithLabelAndTooltip
            placeHolder="Hashtags divided by comma"
            onInputValueChange={(e) => {
              setHashTag(e.target.value);
              setTags(e.target.value.split(',').filter((s) => !!s));
            }}
            inputValue={hashTag}
            type="text"
            theme="music dao"
          />
          <div
            className={classes.hashtagsRow}
            style={{ flexFlow: 'wrap', marginTop: '0px' }}
          >
            {tags.map((hashtag, index) => (
              <div className={classes.hashtagPill} style={{ marginTop: '8px' }}>
                {tags && tags[index] ? tags[index] : hashtag}
              </div>
            ))}
          </div>
        </Box>
        <Box display="flex" mt={4.5}>
          <Box width={1} mr={1}>
            <Box className={classes.header1} mb={1}>
              Add photo
            </Box>
            <FileUpload
              photo={upload1}
              photoImg={uploadImg1}
              setterPhoto={setUpload1}
              setterPhotoImg={setUploadImg1}
              mainSetter={undefined}
              mainElement={undefined}
              type="image"
              canEdit
              isNewVersion
            />
          </Box>
          <Box width={1} ml={1}>
            <Box className={classes.header1} mb={1}>
              Add Video
            </Box>
            <FileUpload
              photo={upload2}
              photoImg={uploadImg2}
              setterPhoto={setUpload2}
              setterPhotoImg={setUploadImg2}
              mainSetter={undefined}
              mainElement={undefined}
              type="video"
              canEdit
              isNewVersion
            />
          </Box>
        </Box>
        <Box width={1} mt={4.5}>
          <Box className={classes.flexBox} justifyContent="space-between">
            <Box className={classes.header1}>Full Text</Box>
            {/* <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} arrow title={""}>
              <InfoIcon style={{ color: "grey", width: "14px" }} />
            </Tooltip> */}
          </Box>
          <Box
            width={1}
            mt={1}
            style={{ background: 'rgba(238, 242, 247, 0.5)' }}
          >
            <QuillEditor editorState={editorState} onChange={onChange} />
          </Box>
        </Box>
        {/* <Box width={1} mt={4.5}>
          <Box className={classes.header1}>Post settings</Box>
          <Box className={classes.flexBox} mt={2} borderBottom="1px solid #00000022" pb={2}>
            <Box className={classes.header2} mr={2} style={{ whiteSpace: "nowrap" }}>
              Schedule post
            </Box>
            <CustomSwitch checked={scheduledPost} onChange={() => setScheduledPost(prev => !prev)} />
            {scheduledPost && (
              <Box width={1} className={classes.controlBox} ml={2}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="dd MMM yyyy"
                    margin="dense"
                    id="date-picker-inline"
                    value={postDate}
                    onChange={(date, _) => {
                      setPostDate(date ? new Date(date.getTime()) : new Date());
                    }}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                    size="small"
                    className={classes.datepicker}
                  />
                </MuiPickersUtilsProvider>
              </Box>
            )}
          </Box>
          <Box
            className={classes.flexBox}
            mt={2}
            borderBottom="1px solid #00000022"
            pb={2}
            justifyContent="space-between"
          >
            <Box className={classes.header2} mr={2} style={{ whiteSpace: "nowrap" }}>
              Enable Comments
            </Box>
            <CustomSwitch checked={enableComments} onChange={() => setEnableComments(prev => !prev)} />
          </Box>
        </Box>
        <Box width={1} mt={4.5}>
          <Box className={classes.header1}>Share with</Box>
          <Box className={classes.flexBox} mt={2} justifyContent="space-between">
            <Box className={classes.header2} mr={2} style={{ whiteSpace: "nowrap" }}>
              Your MUSIC Wall
            </Box>
            <CustomSwitch checked={enableMusicWall} onChange={() => setEnableMusicWall(prev => !prev)} />
          </Box>
        </Box> */}
        <Box width={1} display="flex" justifyContent="space-between" mt={4}>
          <SecondaryButton
            size="medium"
            onClick={props.handleClose}
            isRounded
            style={{ paddingLeft: '48px', paddingRight: '48px' }}
          >
            Cancel
          </SecondaryButton>
          <Box display="flex">
            {/* <PrimaryButton
              size="medium"
              onClick={props.handleClose}
              isRounded
              style={{ paddingLeft: "48px", paddingRight: "48px", background: "#54658F" }}
            >
              Preview Post
            </PrimaryButton> */}
            <PrimaryButton
              size="medium"
              onClick={handleNewWallPost}
              isRounded
              style={{
                paddingLeft: '48px',
                paddingRight: '48px',
                marginLeft: '24px',
                background: Color.MusicDAODark
              }}
              disabled={creationProgress}
            >
              Publish Post
            </PrimaryButton>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreateNewWallPostModal;
