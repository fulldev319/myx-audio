import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';
import Moment from 'react-moment';

import { makeStyles } from '@material-ui/core/styles';

import { useTypedSelector } from 'store/reducers/Reducer';
import CreateNewDiscussion from 'components/MusicDao/modals/CreateNewDiscussion';
import { Text } from 'components/MusicDao/components/ui-kit';

import {
  Color,
  FontSize,
  PrimaryButton,
  SecondaryButton,
  StyledDivider
} from 'shared/ui-kit';
import Avatar from 'shared/ui-kit/Avatar';
import { getRandomAvatarForUserIdWithMemoization } from 'shared/services/user/getUserAvatar';
import URL from 'shared/functions/getURL';
import Box from 'shared/ui-kit/Box';
import { LoadingWrapper } from 'shared/ui-kit/Hocs';
import { useAlertMessage } from 'shared/hooks/useAlertMessage';
import { processImage } from 'shared/helpers';

import {
  ArrowLeftIcon,
  BackIcon,
  DiscussionIcon,
  LikeIcon,
  SaveIcon,
  useGovernanceStyles
} from './styles';

const useStyles = makeStyles((theme) => ({
  mainContent: {
    background: Color.White,
    boxShadow: '0px 30px 35px -12px rgba(29, 103, 84, 0.03)',
    borderRadius: 12,
    padding: 64,
    marginTop: 40,
    marginBottom: 40,
    [theme.breakpoints.down('xs')]: {
      padding: '64px 16px'
    }
  },
  card: {
    background: Color.White,
    boxShadow: '0px 30px 35px -12px rgba(29, 103, 84, 0.03)',
    borderRadius: 12,
    padding: '30px 40px',
    marginTop: 19,
    [theme.breakpoints.down('xs')]: {
      padding: '30px 16px'
    }
  },
  title: {
    fontSize: 42,
    lineLeight: '150%',
    color: Color.MusicDAODark,
    marginBlock: 0,
    [theme.breakpoints.down('xs')]: {
      fontSize: 26,
      fontWeight: 600
    }
  },
  creatorSection: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 48,
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      alignItems: 'flex-start'
    }
  },
  creatorItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      marginTop: 16
    }
  },
  tag: {
    color: Color.MusicDAODark,
    background: Color.MusicDAOLightGreen,
    borderRadius: 5,
    padding: '5px 10px',
    fontSize: 10,
    '& + &': {
      marginLeft: 8
    }
  },
  image: {
    width: '100%',
    borderRadius: 29
  },
  iconContainer: {
    '& svg': {
      marginRight: 16
    }
  },
  commentInput: {
    width: '100%',
    height: 53,
    marginBottom: 16,
    background: 'rgba(218, 230, 229, 0.6)',
    border: '1px solid #65CB63',
    boxSizing: 'border-box',
    borderRadius: 8,
    paddingLeft: 20,
    paddingRight: 16,
    fontSize: 14,
    color: Color.MusicDAODark
  },
  pointer: {
    cursor: 'pointer'
  },
  replyContent: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 24,
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column'
    }
  },
  replyAvatarSection: {
    display: 'flex',
    flexDirectio: 'row',
    alignItems: 'center',
    marginRight: 29,
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      marginBottom: 16
    }
  },
  replyMainSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: '21px 70px',
    width: '100%',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      padding: '14px 12px'
    }
  },
  avatarInfoSection: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 138,
    marginLeft: 16,
    [theme.breakpoints.down('sm')]: {
      minWidth: 129
    }
  },
  header1: {
    fontSize: 22,
    fontWeight: 800,
    color: '#2D3047',
    [theme.breakpoints.down('sm')]: {
      fontSize: 20
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 18
    }
  },
  header2: {
    fontSize: 14,
    fontWeight: 600,
    color: '#2D3047',
    [theme.breakpoints.down('sm')]: {
      fontWeight: 700,
      color: '#404658'
    }
  },
  header2_1: {
    fontSize: 14,
    fontWeight: 500,
    color: '#2D3047',
    [theme.breakpoints.down('sm')]: {
      fontSize: 12,
      fontWeight: 400,
      color: '#404658'
    }
  },
  header3: {
    fontSize: 12,
    fontWeight: 500,
    color: '#54658F',
    [theme.breakpoints.down('xs')]: {
      fontWeight: 400,
      color: '#788BA2'
    }
  },
  commentButton: {
    height: '45px !important',
    paddingLeft: '25px !important',
    paddingRight: '25px !important',
    fontSize: '14px !important',
    borderRadius: '48px !important',
    backgroundColor: '#2D3047 !important',
    [theme.breakpoints.down('xs')]: {
      paddingLeft: '41px !important',
      paddingRight: '41px !important'
    }
  }
}));

export default function DiscussionDetail() {
  const commonClasses = useGovernanceStyles();
  const classes = useStyles();
  const { showAlertMessage } = useAlertMessage();

  const history = useHistory();
  const { id: discussionId } = useParams<{ id: string }>();

  const user = useTypedSelector((state) => state.user);

  const [discussion, setDiscussion] = React.useState<any>(null);
  const [comment, setComment] = React.useState<string>('');
  const [like, setLike] = React.useState<boolean>(false);
  const [showAllReplies, setShowAllReplies] = React.useState<boolean>(false);
  const [openCreateNewDiscussionModal, setOpenCreateNewDiscussionModal] =
    React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (discussionId) {
      setLoading(true);
      axios
        .get(
          `${URL()}/musicDao/governance/discussions/getDetails/${discussionId}`
        )
        .then((response) => {
          if (response.data.success) {
            setDiscussion({
              ...response.data.data
            });
          } else {
            setDiscussion(null);
            showAlertMessage('Error when making the request', {
              variant: 'error'
            });
          }
        })
        .catch((err) => {
          showAlertMessage('Error when making the request', {
            variant: 'error'
          });
        })
        .finally(() => setLoading(false));
    }
  }, [discussionId]);

  const addComment = () => {
    axios
      .post(`${URL()}/musicDao/governance/discussions/reply`, {
        discussionId: discussion.id,
        text: comment,
        userAddress: user.id
      })
      .then((res) => {
        if (res.data.success) {
          setComment('');
          showAlertMessage('Reply done', { variant: 'success' });
          setDiscussion((prev) => ({
            ...prev,
            replies: [
              { created: new Date().getTime(), text: comment, userId: user.id },
              ...(prev.replies || [])
            ]
          }));
        }
      })
      .catch((err) => {
        showAlertMessage('Error making reply', { variant: 'error' });
      });
  };

  const handleChangeComment = (e) => {
    setComment(e.target.value);
  };

  const handleLike = () => {
    if (!like) {
      axios
        .post(`${URL()}/musicDao/governance/discussions/like`, {
          discussionId: discussion.id,
          userId: user.id
        })
        .then((res) => {
          if (res.data.success) {
            setLike(true);
          } else {
            showAlertMessage('Error like', { variant: 'error' });
          }
        })
        .catch((err) => {
          showAlertMessage('Error like', { variant: 'error' });
          console.log(err);
        });
    } else {
      axios
        .post(`${URL()}/musicDao/governance/discussions/dislike`, {
          discussionId: discussion.id,
          userId: user.id
        })
        .then((res) => {
          if (res.data.success) {
            setLike(false);
          } else {
            showAlertMessage('Error dislike', { variant: 'error' });
          }
        })
        .catch((err) => {
          showAlertMessage('Error dislike', { variant: 'error' });
          console.log(err);
        });
    }
  };

  return (
    <Box position="relative">
      <div className={commonClasses.headerImage} />
      {discussion ? (
        <div className={commonClasses.content}>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box
              display="flex"
              flexDirection="row"
              className={commonClasses.back}
              onClick={() => history.goBack()}
            >
              <BackIcon />
              <Text ml={1} color={Color.White} bold>
                BACK
              </Text>
            </Box>
            <PrimaryButton
              size="medium"
              className={commonClasses.iconButton}
              onClick={() => setOpenCreateNewDiscussionModal(true)}
            >
              New discussion
              <DiscussionIcon />
            </PrimaryButton>
          </Box>
          <LoadingWrapper loading={loading}>
            <div className={classes.mainContent}>
              <h2 className={classes.title}>{discussion.title}</h2>
              <div className={classes.creatorSection}>
                <div className={classes.creatorItem}>
                  <Avatar
                    size={40}
                    image={processImage(discussion.imageURL)}
                    rounded
                  />
                  <Box display="flex" flexDirection="column" ml={2}>
                    <Text bold>{discussion.author}</Text>
                    <Text size={FontSize.S}>
                      <Moment format="ddd, DD MMM YYYY">
                        {discussion.schedulePost}
                      </Moment>
                    </Text>
                  </Box>
                </div>
                <div className={classes.creatorItem}>
                  {discussion.hashtags && discussion.hashtags.length > 0 ? (
                    <>
                      {discussion.hashtags.map((tag, index) => (
                        <Box
                          key={`discussion-tag-${index}`}
                          className={classes.tag}
                        >
                          {tag}
                        </Box>
                      ))}
                    </>
                  ) : null}
                </div>
              </div>
              <StyledDivider type="solid" mt={2} mb={5} />
              <Box display="flex" flexDirection="column">
                <Text mb={3}>{discussion.shortPreviewText}</Text>
                {discussion.photoUrl && (
                  <img
                    className={classes.image}
                    src={processImage(discussion.photoUrl)}
                  />
                )}
                <Box
                  mt={5}
                  dangerouslySetInnerHTML={{ __html: discussion.fullText }}
                />
              </Box>
              <StyledDivider type="solid" mt={5} mb={2} />
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                className={classes.iconContainer}
              >
                <Box className={classes.pointer} onClick={handleLike}>
                  <LikeIcon
                    color={like ? Color.MusicDAOGreen : Color.MusicDAODark}
                  />
                </Box>
                <Box className={classes.pointer}>
                  <SaveIcon />
                </Box>
              </Box>
            </div>
            <div className={classes.header1}>User replies</div>
            <div className={classes.card}>
              <input
                placeholder="Type your response here"
                className={classes.commentInput}
                value={comment}
                onChange={handleChangeComment}
              />
              <Box display="flex" flexDirection="row" justifyContent="flex-end">
                <PrimaryButton
                  size="medium"
                  onClick={() => addComment()}
                  className={classes.commentButton}
                >
                  Add Comment
                </PrimaryButton>
              </Box>
            </div>
            <Box display="flex" flexDirection="column" mt={4}>
              {discussion.replies
                ?.filter((_, index) => (showAllReplies ? true : index < 5))
                .map((comment, index) => (
                  <div
                    key={`discussion-comment-${index}`}
                    className={classes.replyContent}
                  >
                    <div className={classes.replyAvatarSection}>
                      <Avatar
                        size={40}
                        image={
                          processImage(comment.imageURL) ??
                          getRandomAvatarForUserIdWithMemoization(
                            comment.userId
                          )
                        }
                        rounded
                      />
                      <div className={classes.avatarInfoSection}>
                        <div className={classes.header2}>{comment.name}</div>
                        <div>
                          <Moment
                            format="ddd, DD MMM YYYY"
                            className={classes.header3}
                          >
                            {comment.created}
                          </Moment>
                        </div>
                      </div>
                    </div>
                    <div
                      className={classes.replyMainSection}
                      style={{
                        backgroundColor:
                          index % 2 === 0
                            ? '#ffffff'
                            : 'rgba(255, 255, 255, 0.5)'
                      }}
                    >
                      <div className={classes.header2_1}>{comment.text}</div>
                    </div>
                  </div>
                ))}
            </Box>
          </LoadingWrapper>
          {!showAllReplies && (
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="center"
              mt={4}
            >
              <SecondaryButton
                className={commonClasses.showAll}
                size="medium"
                radius={29}
                onClick={() => setShowAllReplies(true)}
              >
                Show All
                <Box
                  position="absolute"
                  flexDirection="row"
                  top={0}
                  right={0}
                  pr={2}
                >
                  <ArrowLeftIcon />
                </Box>
              </SecondaryButton>
            </Box>
          )}
        </div>
      ) : (
        <></>
      )}
      {openCreateNewDiscussionModal && (
        <CreateNewDiscussion
          open={openCreateNewDiscussionModal}
          handleClose={() => setOpenCreateNewDiscussionModal(false)}
        />
      )}
    </Box>
  );
}
