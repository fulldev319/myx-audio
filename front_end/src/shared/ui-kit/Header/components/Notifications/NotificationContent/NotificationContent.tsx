import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';

import makeStyles from '@material-ui/core/styles/makeStyles';

import { Notification } from 'shared/services/API/NotificationsAPI';
import { Color } from 'shared/ui-kit';
import { setSelectedUser } from 'store/actions/SelectedUser';
import { TransferNotificationContent } from './TransferNotificationContent';
import { roundFloat } from 'shared/helpers/number';

type NotificationContentProps = {
  notification: Notification;
  isFromPage?: boolean;
};

const useStyles = makeStyles((theme) => ({
  img: {
    width: '14px',
    marginLeft: theme.spacing(0.5),
    position: 'relative',
    top: '2px'
  },
  contentBox: {
    lineHeight: '18px',
    '& > strong': {
      cursor: 'pointer'
    }
  }
}));

// TODO: Please refactor me to something shorter and configurable :""""(
export const NotificationContent: React.FunctionComponent<NotificationContentProps> = ({
  notification,
  isFromPage = false
}) => {
  const {
    type,
    typeItemId,
    itemId,
    follower,
    pod,
    comment,
    token,
    amount,
    onlyInformation,
    otherItemId,
    urlSlug,
    podType
  } = notification;

  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  const classes = useStyles();

  const handleProfileRouting = () => {
    if (location) {
      const pathContextList = location.pathname.split('/');
      if (pathContextList.length > 0) {
        history.push(`/profile/${urlSlug}`);
        // history.push(`/${pathContextList[1]}/profile/${itemId}`);
      }
    }

    dispatch(setSelectedUser(itemId));
  };

  const handleProfileRoutingWithOtherItem = () => {
    if (location) {
      const pathContextList = location.pathname.split('/');
      if (pathContextList.length > 0) {
        history.push(`/profile/${itemId}`);
      }
    }

    dispatch(setSelectedUser(itemId));
  };

  return (
    <>
      {type === 1 ? (
        <div className={classes.contentBox}>
          You are getting noticed! Do you want to accept{' '}
          <b
            onClick={handleProfileRouting}
            style={isFromPage ? { color: Color.Green } : {}}
          >
            {follower}
          </b>{' '}
          request to follow?
        </div>
      ) : type === 2 ? (
        <div className={classes.contentBox}>
          Your network is expanding!{' '}
          <b onClick={handleProfileRouting}>{follower}</b> accepts your request
          to follow.
        </div>
      ) : type === 3 ? (
        <div className={classes.contentBox}>
          You accepted the following request of{' '}
          <b onClick={handleProfileRouting}>{follower}</b>. Do you want to
          Follow Back?
        </div>
      ) : type === 4 ? (
        <div className={classes.contentBox}></div>
      ) : type === 5 ? (
        <div className={classes.contentBox}></div>
      ) : type === 6 ? (
        <div className={classes.contentBox}>
          Your transfer of{' '}
          <em>
            {amount} {token}
          </em>{' '}
          to <b onClick={handleProfileRouting}>{follower}</b> was successful.
        </div>
      ) : type === 7 ? (
        <div className={classes.contentBox}>
          You have received{' '}
          <em>
            {amount} {token}
          </em>{' '}
          from <b onClick={handleProfileRouting}>{follower}</b>.
        </div>
      ) : type === 8 ? (
        <div className={classes.contentBox}>
          Your swap of{' '}
          <em>
            {amount} {token}
          </em>{' '}
          to <em>{otherItemId}</em> was successful!
        </div>
      ) : type === 9 ? (
        <div className={classes.contentBox}>
          Your withdrawal of <em>{token}</em> was successful!
        </div>
      ) : type === 10 ? (
        <div className={classes.contentBox}>
          Success! You just created a new{' '}
          <b onClick={() => history.push(`/capsules/${otherItemId}`)}>capsule</b>. Want
          to invite your friends?
        </div>
      ) : type === 11 ? (
        <div className={classes.contentBox}></div>
      ) : type === 12 ? (
        <div className={classes.contentBox}>
          Your investment of{' '}
          <em>
            {amount} {token} Token
          </em>{' '}
          in <b onClick={() => history.push(`/capsules/${otherItemId}`)}>{pod}</b>{' '}
          was successful. Check the latest Capsule activity!
        </div>
      ) : type === 13 ? (
        <div className={classes.contentBox}>
          You just followed{' '}
          <b onClick={() => history.push(`/capsules/${otherItemId}`)}>{pod}</b> Capsule.
        </div>
      ) : type === 14 ? (
        <div className={classes.contentBox}>
          You just unfollowed{' '}
          <b onClick={() => history.push(`/capsules/${otherItemId}`)}>{pod}</b> Capsule.
        </div>
      ) : type === 15 ? (
        <div className={classes.contentBox}>
          <b onClick={handleProfileRouting}>{follower}</b> just invested{' '}
          <em>
            {amount} {token}
          </em>{' '}
          Token in{' '}
          <b onClick={() => history.push(`/capsules/${otherItemId}`)}>{pod}</b>!
        </div>
      ) : type === 16 ? (
        <div className={classes.contentBox}>
          <b onClick={handleProfileRouting}>{follower}</b> just swapped{' '}
          <em>
            {amount} {token}
          </em>{' '}
          Token from the{' '}
          <b onClick={() => history.push(`/capsules/${otherItemId}`)}>{pod}</b>
        </div>
      ) : type === 17 ? (
        <div className={classes.contentBox}>
          You just swapped{' '}
          <em>
            {amount} {token}
          </em>{' '}
          Token from the{' '}
          <b onClick={() => history.push(`/capsules/${otherItemId}`)}>{pod}</b>
        </div>
      ) : type === 18 ? (
        <div className={classes.contentBox}>
          <b onClick={handleProfileRouting}>{follower}</b> just swapped{' '}
          <b onClick={() => history.push(`/capsules/${otherItemId}`)}>{pod}</b>{' '}
          tokens. Check it out!
        </div>
      ) : type === 19 ? (
        <div className={classes.contentBox}>
          <b onClick={handleProfileRouting}>{follower}</b> just swapped{' '}
          <em>{amount}</em> in{' '}
          <b onClick={() => history.push(`/capsules/${otherItemId}`)}>{pod}</b>{' '}
          tokens.
        </div>
      ) : type === 20 ? (
        <div className={classes.contentBox}>
          <b onClick={() => history.push(`/capsules/${otherItemId}`)}>{pod}</b> just
          received a new offer! Click{' '}
          <b onClick={() => history.push(`/capsules/${otherItemId}`)}>here</b> to
          check it out.
        </div>
      ) : type === 21 ? (
        <div className={classes.contentBox}>
          <b onClick={() => history.push(`/capsules/${otherItemId}`)}>{pod}</b> just
          received a new offer! Click{' '}
          <b onClick={() => history.push(`/capsules/${otherItemId}`)}>here</b> to
          check it out.
        </div>
      ) : type === 22 ? (
        <div className={classes.contentBox}>
          <b onClick={() => history.push(`/capsules/${otherItemId}`)}>{pod}</b> just
          added a new NFT offering. Click{' '}
          <b onClick={() => history.push(`/capsules/${otherItemId}`)}>here</b> to
          check it out.
        </div>
      ) : type === 23 ? (
        <div className={classes.contentBox}>
          <b onClick={() => history.push(`/capsules/${otherItemId}`)}>{pod}</b> just
          added a new NFT offering. Click{' '}
          <b onClick={() => history.push(`/capsules/${otherItemId}`)}>here</b> to
          check it out.
        </div>
      ) : type === 24 ? (
        <div className={classes.contentBox}>
          The buy offer from <b onClick={handleProfileRouting}>{follower}</b> in{' '}
          <b onClick={() => history.push(`/capsules/${otherItemId}`)}>{pod}</b>{' '}
          offer was removed.
        </div>
      ) : type === 25 ? (
        <div className={classes.contentBox}>
          The buy offer from <b onClick={handleProfileRouting}>{follower}</b> in{' '}
          <b onClick={() => history.push(`/capsules/${otherItemId}`)}>{pod}</b>{' '}
          offer was removed.
        </div>
      ) : type === 26 ? (
        <div className={classes.contentBox}>
          The sales offer from <b onClick={handleProfileRouting}>{follower}</b>{' '}
          in <b onClick={() => history.push(`/capsules/${otherItemId}`)}>{pod}</b>{' '}
          offer was removed.
        </div>
      ) : type === 27 ? (
        <div className={classes.contentBox}>
          The sales offer from <b onClick={handleProfileRouting}>{follower}</b>{' '}
          in <b onClick={() => history.push(`/capsules/${otherItemId}`)}>{pod}</b>{' '}
          offer was removed.
        </div>
      ) : type === 28 ? (
        <div className={classes.contentBox}>
          <b onClick={handleProfileRouting}>{follower}</b> is selling [MusicPod
          hyperlink]! Check it out here.
        </div>
      ) : type === 29 ? (
        <div className={classes.contentBox}>
          <b onClick={handleProfileRouting}>{follower}</b> just bought{' '}
          <em>{pod}</em> check out their new Capsule and join the conversation.
        </div>
      ) : type === 30 ? (
        <div className={classes.contentBox}>
          <b onClick={handleProfileRouting}>{follower}</b> just opened a
          discussion in{' '}
          <b onClick={() => history.push(`/capsules/${pod}`)}>your capsule</b>
        </div>
      ) : type === 31 ? (
        <div className={classes.contentBox}>
          <b onClick={handleProfileRouting}>{follower}</b> just commented your
          post in <b onClick={() => history.push(`/capsules/${pod}`)}>your capsule</b>
        </div>
      ) : type === 32 ? (
        <div className={classes.contentBox}>
          Your Capsule is growing! <b onClick={handleProfileRouting}>{follower}</b>{' '}
          just followed{' '}
          <b onClick={() => history.push(`/capsules/${otherItemId}`)}>{pod}</b>
        </div>
      ) : type === 41 ? (
        <div className={classes.contentBox}>
          The conversation is growing!{' '}
          <b onClick={handleProfileRouting}>{follower}</b> opened a new
          discussion on <em>{otherItemId}</em>
        </div>
      ) : type === 44 ? (
        <div className={classes.contentBox}>
          You just received interest from <em>{otherItemId}</em>!
        </div>
      ) : type === 45 ? (
        <div className={classes.contentBox}>
          <b onClick={handleProfileRouting}>{follower}</b> is late on their
          payment to <em>{otherItemId}</em>. Send them a reminder!
        </div>
      ) : type === 46 ? (
        <div className={classes.contentBox}></div>
      ) : type === 47 ? (
        <div className={classes.contentBox}>
          You did it! Your social token <em>{token}</em> is now available!
        </div>
      ) : type === 48 ? (
        <div className={classes.contentBox}>
          You're on fire! <b onClick={handleProfileRouting}>{follower}</b> just
          purchased <em>{amount}</em> of <em>{token}</em>
        </div>
      ) : type === 49 ? (
        <div className={classes.contentBox}>
          Your{' '}
          <em>
            {amount} {token}
          </em>{' '}
          stake was successful.
        </div>
      ) : type === 50 ? (
        <div className={classes.contentBox}>
          <em>{token}</em> payment is now available. Check it out here
          [hyperlink]
        </div>
      ) : type === 51 ? (
        <div className={classes.contentBox}>
          Success! You've unstaked{' '}
          <em>
            {amount} {token}
          </em>
          .
        </div>
      ) : type === 52 ? (
        <div className={classes.contentBox}>
          <b onClick={handleProfileRouting}>{follower}</b> just opened an issue
          in <em>{token}</em>. Resolve it now [hyperlink].
        </div>
      ) : type === 53 ? (
        <div className={classes.contentBox}>
          <b onClick={handleProfileRouting}>{follower}</b> started a new
          discussion <em>{token}</em>. Join the conversation [hyperlink]!
        </div>
      ) : type === 54 ? (
        <div className={classes.contentBox}></div>
      ) : type === 55 ? (
        <div className={classes.contentBox}>
          {/* New vote available in <em>{token}</em>. Check it out <b>here</b>! */}
          New vote available in <em>{token}</em>. Check it out!
        </div>
      ) : type === 56 ? (
        <div className={classes.contentBox}>
          <b onClick={handleProfileRouting}>{follower}</b> just created a new{' '}
          <em>capsule</em>!
        </div>
      ) : type === 57 ? (
        <div className={classes.contentBox}></div>
      ) : type === 58 ? (
        <div className={classes.contentBox}>
          <em>{pod}</em> was removed by it's owner,{' '}
          <b onClick={handleProfileRouting}>{follower}</b>. Head to your profile
          to see your current Capsules.
        </div>
      ) : type === 60 ? (
        <div className={classes.contentBox}>
          <em>{pod}</em> is trending!{' '}
          <b onClick={handleProfileRouting}>{follower}</b> just invested{' '}
          <em>{amount}</em>!
        </div>
      ) : type === 61 ? (
        <div className={classes.contentBox}>
          <b onClick={handleProfileRouting}>{follower}</b> just liquidated{' '}
          <em>{pod}</em>--head to your profile to see all your current Capsules.
        </div>
      ) : type === 62 ? (
        <div className={classes.contentBox}>
          <b onClick={handleProfileRouting}>{follower}</b> just paid interest in{' '}
          <em>{pod}</em>.
        </div>
      ) : type === 65 ? (
        <div className={classes.contentBox}>
          <em>{otherItemId}</em> was just updated by{' '}
          <b onClick={handleProfileRouting}>{follower}</b>. Click to see what's
          new!
        </div>
      ) : type === 67 ? (
        <div className={classes.contentBox}>
          <b onClick={handleProfileRouting}>{follower}</b> just created a new
          Liquidity Pool! Check out <em>{otherItemId}</em>.
        </div>
      ) : type === 68 ? (
        <div className={classes.contentBox}>
          Your network is thriving.{' '}
          <b onClick={handleProfileRouting}>{follower}</b> just created a new
          Liquidity Pool! Check out <em>{otherItemId}</em>.
        </div>
      ) : type === 69 ? (
        <div className={classes.contentBox}>
          <em>{otherItemId}</em> is growing!{' '}
          <b onClick={handleProfileRouting}>{follower}</b> just deposited{' '}
          <em>{amount}</em>!
        </div>
      ) : type === 70 ? (
        <div className={classes.contentBox}>
          <b onClick={handleProfileRouting}>{follower}</b> withdrew{' '}
          <em>{amount}</em> from <em>{otherItemId}</em>.
        </div>
      ) : type === 71 ? (
        <div className={classes.contentBox}></div>
      ) : type === 72 ? (
        <div className={classes.contentBox}></div>
      ) : type === 73 ? (
        <div className={classes.contentBox}></div>
      ) : type === 74 ? (
        <div className={classes.contentBox}></div>
      ) : type === 75 ? (
        <div className={classes.contentBox}></div>
      ) : type === 76 ? (
        <div className={classes.contentBox}>
          <b onClick={handleProfileRouting}>{follower}</b> just commented in
          your post.
        </div>
      ) : type === 77 ? (
        <div className={classes.contentBox}>
          <b onClick={handleProfileRouting}>{follower}</b> liked your post.
        </div>
      ) : type === 78 ? (
        <div className={classes.contentBox}>
          <b onClick={handleProfileRouting}>{follower}</b> disliked your post.
        </div>
      ) : type === 79 ? (
        <div className={classes.contentBox}>
          <b onClick={handleProfileRouting}>{follower}</b> liked your comment.
        </div>
      ) : type === 80 ? (
        <div className={classes.contentBox}>
          <b onClick={handleProfileRouting}>{follower}</b> disliked your
          comment.
        </div>
      ) : type === 81 ? (
        <div className={classes.contentBox}>
          <b onClick={handleProfileRouting}>{follower}</b> reply your comment.
        </div>
      ) : type === 82 ? (
        <div className={classes.contentBox}>
          <b onClick={handleProfileRouting}>{follower}</b> just commented your
          post in <em>your community</em>
        </div>
      ) : type === 85 ? (
        <div className={classes.contentBox}>
          <b onClick={handleProfileRouting}>{follower}</b> just created{' '}
          <b onClick={() => history.push(`/capsules/${otherItemId}`)}>{pod}</b> Capsule
          and want you to join! Click here to join capsule:
        </div>
      ) : type === 86 ? (
        <div className={classes.contentBox}>
          <b onClick={handleProfileRouting}>{follower}</b> created{' '}
          <b onClick={() => {}}>{pod}</b> Commuity and want you to join as{' '}
          <em>{comment}</em>.
        </div>
      ) : type === 87 ? (
        <div className={classes.contentBox}>
          <b onClick={handleProfileRouting}>{follower}</b> accepts your
          invitation to join as a <em>{comment}</em> of{' '}
          <b onClick={() => {}}>{pod}</b> Community.
        </div>
      ) : type === 88 ? (
        <div className={classes.contentBox}>
          <b onClick={handleProfileRouting}>{follower}</b> declines your
          invitation to join as a <em>{comment}</em> of{' '}
          <b onClick={() => {}}>{pod}</b> Community.
        </div>
      ) : type === 89 ? (
        <div className={classes.contentBox}>
          You have accepted the invitation to join as a <em>{comment}</em> of{' '}
          <b onClick={() => {}}>{pod}</b> Community.
        </div>
      ) : type === 90 ? (
        <div className={classes.contentBox}>
          You have declined the invitation to join as a <em>{comment}</em> of{' '}
          <b onClick={() => {}}>{pod}</b> Community.
        </div>
      ) : type === 91 ? (
        <div className={classes.contentBox}>
          You just went up to Level <em>{comment}</em>!
        </div>
      ) : type === 92 ? (
        <div className={classes.contentBox}>
          You just unlocked the badge <em>{comment}</em>!
        </div>
      ) : type === 93 ? (
        <div className={classes.contentBox}>
          Your contribution is becoming valuable.{' '}
          <b onClick={handleProfileRouting}>{follower}</b> just sent you{' '}
          <em>
            {amount} {token}
          </em>{' '}
          as a tip!
        </div>
      ) : type === 94 ? (
        <div className={classes.contentBox}>
          <b onClick={handleProfileRouting}>{follower}</b> is requesting your
          support for creating a new community. The assistance offer is{' '}
          <em>
            {amount} {token}
          </em>
          . Are you interested?
        </div>
      ) : type === 95 ? (
        <div className={classes.contentBox}>
          <b onClick={handleProfileRouting}>{follower}</b> is requesting your
          support for creating a new community. The assistance offer is{' '}
          <em>
            {amount} {token}
          </em>
          . Are you interested?
        </div>
      ) : type === 96 ? (
        <div className={classes.contentBox}>
          <b onClick={handleProfileRouting}>{follower}</b> has declined your
          offer to support you for create a new community.
        </div>
      ) : type === 97 ? (
        <div className={classes.contentBox}>
          <b onClick={handleProfileRouting}>{follower}</b> has refused your
          offer to support you for create a new community. Do you want to make a
          new offer?
        </div>
      ) : type === 98 ? (
        <div className={classes.contentBox}>
          <b onClick={handleProfileRouting}>{follower}</b> has accepted your
          offer of {amount} {token} to support you for create a new community.
        </div>
      ) : type === 99 ? (
        <div className={classes.contentBox}>
          <b onClick={handleProfileRouting}>{follower}</b> is requesting your
          support for creating a new NFT Media Capsule. The assistance offer is{' '}
          <em>
            {amount} {token}
          </em>
          . Are you interested?
        </div>
      ) : type === 100 ? (
        <div className={classes.contentBox}>
          <b onClick={handleProfileRouting}>{follower}</b> is requesting your
          support for creating a new NFT Media Capsule. The assistance offer is{' '}
          <em>
            {amount} {token}
          </em>
          . Are you interested?
        </div>
      ) : type === 101 ? (
        <div className={classes.contentBox}>
          <b onClick={handleProfileRouting}>{follower}</b> has declined your
          offer to support you for create a new NFT Media Capsule.
        </div>
      ) : type === 102 ? (
        <div className={classes.contentBox}>
          <b onClick={handleProfileRouting}>{follower}</b> has refused your
          offer to support you for create a new NFT Media Capsule. Do you want
          to make a new offer?
        </div>
      ) : type === 103 ? (
        <div className={classes.contentBox}>
          <b onClick={handleProfileRouting}>{follower}</b> has accepted your
          offer of {amount} {token} to support you for create a new NFT Media
          Capsule.
        </div>
      ) : type === 104 ? (
        <div className={classes.contentBox}>
          <b onClick={handleProfileRouting}>{follower}</b> is requesting you to
          Collab in{' '}
          <b
            onClick={() => {
              history.push(`/capsules/MediaNFT/${token}`);
            }}
          >
            {token}
          </b>
          .
        </div>
      ) : type === 105 ? (
        <div className={classes.contentBox}>
          <b onClick={handleProfileRouting}>{follower}</b> has refused your
          offer to Collab in{' '}
          <b
            onClick={() => {
              history.push(`/capsules/MediaNFT/${token}`);
            }}
          >
            {token}
          </b>
          .
        </div>
      ) : type === 106 ? (
        <div className={classes.contentBox}>
          <b onClick={handleProfileRouting}>{follower}</b> has accepted your
          offer to Collab in{' '}
          <b
            onClick={() => {
              history.push(`/capsules/MediaNFT/${token}`);
            }}
          >
            {token}
          </b>
          .
        </div>
      ) : type === 107 ? (
        <div className={classes.contentBox}>
          <b onClick={handleProfileRouting}>{follower}</b> has remove your
          Collab in{' '}
          <b
            onClick={() => {
              history.push(`/capsules/MediaNFT/${token}`);
            }}
          >
            {token}
          </b>
          .
        </div>
      ) : type === 108 ? (
        <div className={classes.contentBox}>
          <b onClick={handleProfileRouting}>{follower}</b> liked{' '}
          <b
            onClick={() => {
              history.push(`/media/${token.replace(/\s/g, '')}`);
            }}
          >
            {token}
          </b>{' '}
          media.
        </div>
      ) : type === 109 ? (
        <div className={classes.contentBox}>
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{' '}
          shared{' '}
          <b
            onClick={() => {
              if (pod) {
                history.push(`/pix/capsules/${token.replace(/\s/g, '')}`); // capsule
              } else {
                history.push(`/pix/${token.replace(/\s/g, '')}`); // digital art
              }
            }}
          >
            {pod ? pod : token}
          </b>{' '}
          {pod ? 'capsule' : 'media'}.
        </div>
      ) : type === 110 ? (
        <div className={classes.contentBox}>
          <b
            onClick={() => {
              history.push(`/profile/${itemId}`);
              dispatch(setSelectedUser(itemId));
            }}
          >
            {follower}
          </b>{' '}
          has shared{' '}
          <b
            onClick={() => {
              if (pod) {
                history.push(`/pix/capsules/${token.replace(/\s/g, '')}`); // pod
              } else {
                history.push(`/pix/${token.replace(/\s/g, '')}`); // digital art
              }
            }}
          >
            {pod ? pod : token}
          </b>{' '}
          {pod ? 'pod' : 'media'}.
        </div>
      ) : type === 111 ? (
        <div className={classes.contentBox}>
          <b onClick={handleProfileRouting}>{follower}</b> has shared{' '}
          <b
            onClick={() => {
              history.push(`/media/${token.replace(/\s/g, '')}`);
            }}
          >
            {token}
          </b>{' '}
          playlist.
        </div>
      ) : type === 112 ? (
        <div className={classes.contentBox}>
          Hey, <b onClick={handleProfileRouting}>{follower}</b>, your shared{' '}
          <b onClick={handleProfileRouting}>{pod}</b> NFT could be deployed to
          Ethereum, we need your Ethereum address.
        </div>
      ) : type === 113 ? (
        <div className={classes.contentBox}>
          <b onClick={handleProfileRouting}>{follower}</b> sent you an offer to
          list the media <em>{pod}</em> in your community projects for{' '}
          <em>{amount}</em>% on revenue.
        </div>
      ) : type === 114 ? (
        <div className={classes.contentBox}>
          <b onClick={handleProfileRouting}>{follower}</b> sent a contribution
          of{' '}
          <b>
            {token} {amount}
          </b>{' '}
          to the community <b>{pod}</b>
        </div>
      ) : type === 115 ? (
        <div className={classes.contentBox}>
          <label>Airdrop</label>
          <b onClick={handleProfileRouting}>@{follower}</b> sent you a{' '}
          <b>Community Token Airdrop</b> of <b>TKN {amount}</b>.
        </div>
      ) : type === 116 ? (
        <div className={classes.contentBox}>
          <b onClick={handleProfileRouting}>{follower}</b> has shared{' '}
          <em>{token}</em> playlist.
        </div>
      ) : type === 117 ? (
        <div className={classes.contentBox}>
          <b onClick={handleProfileRouting}>{follower}</b> just started live
          streaming that you have in your watchlist.
        </div>
      ) : type === 118 ? (
        <div className={classes.contentBox}>
          <b onClick={handleProfileRouting}>{follower}</b> has sent you a
          proposal to co-fund a new community: <b>{pod}</b>. You have 7 days to
          accept or decline this invitation.
        </div>
      ) : type === 119 ? (
        <div className={classes.contentBox}>
          We’re sorry,
          <b onClick={handleProfileRouting}>{follower}</b> declined your
          co-funded community proposal Co-Funded <b>{pod}</b>.
        </div>
      ) : type === 120 ? (
        <div className={classes.contentBox}>
          Psst! Remember that you have a pending invitation to co-fund{' '}
          <b>{pod}</b>. Beware that this invitation expires in 1 day.
        </div>
      ) : type === 121 ? (
        <div className={classes.contentBox}>
          Oops! We’re sorry but time is out. Your co-funded community proposal
          didn’t get all the approvals on time.
        </div>
      ) : type === 122 ? (
        <div className={classes.contentBox}>
          Everyone on board! Your co-funded community proposal Co-Funded{' '}
          <b>{pod}</b> has been signed by all its founders.
        </div>
      ) : type === 123 ? (
        <div className={classes.contentBox}>
          <b onClick={handleProfileRoutingWithOtherItem}>{follower}</b> has sent
          you a proposal to create a Community Token: <b>{pod}</b>. You have 7
          days to accept or decline this invitation.
        </div>
      ) : type === 124 ? (
        <div className={classes.contentBox}>
          We’re sorry, your proposal has been declined.
        </div>
      ) : type === 125 ? (
        <div className={classes.contentBox}>
          Psst! Remember that you have a pending request to co-fund a Community
          Token. Beware that this invitation expires in 1 day.
        </div>
      ) : type === 126 ? (
        <div className={classes.contentBox}>
          Oops! We’re sorry but time is out. Your co-funded Community Token
          proposal didn’t get all the approvals on time.
        </div>
      ) : type === 127 ? (
        <div className={classes.contentBox}>
          Everyone on board! Your proposal for co-funded Community Token{' '}
          <b>{pod}</b> has been signed by all its founders.
        </div>
      ) : type === 128 || type === 129 ? (
        <TransferNotificationContent notification={notification} />
      ) : type === 130 ? (
        <div className={classes.contentBox}>
          <b onClick={handleProfileRouting}>{follower}</b>
          joined {pod}.
        </div>
      ) : type === 131 ? (
        <div className={classes.contentBox}>
          Congratulations! <b onClick={handleProfileRouting}>{follower}</b>{' '}
          accepted your participation in {pod}.
        </div>
      ) : type === 132 ? (
        <div className={classes.contentBox}>
          We’re sorry, <b onClick={handleProfileRouting}>{follower}</b> declined
          your participation in {pod}.
        </div>
      ) : type === 133 ? (
        <div className={classes.contentBox}>
          <b onClick={handleProfileRouting}>{follower}</b> wants to join {pod}.
        </div>
      ) : type === 134 ? (
        <div className={classes.contentBox}>
          <b onClick={handleProfileRouting}>{follower}</b> has sent you a
          proposal to Add Treasurer: <b>{pod}</b>. You have 7 days to accept or
          decline this invitation.
        </div>
      ) : type === 135 ? (
        <div className={classes.contentBox}>
          We’re sorry, your proposal has been declined.
        </div>
      ) : type === 136 ? (
        <div className={classes.contentBox}>
          Psst! Remember that you have a pending request to Add Treasurer.
          Beware that this invitation expires in 1 day.
        </div>
      ) : type === 137 ? (
        <div className={classes.contentBox}>
          Oops! We’re sorry but time is out. Your Add Treasurer proposal didn’t
          get all the approvals on time.
        </div>
      ) : type === 138 ? (
        <div className={classes.contentBox}>
          Everyone on board! Your proposal for Add Treasurer <b>{pod}</b> has
          been signed by all its founders.
        </div>
      ) : type === 139 ? (
        <div className={classes.contentBox}>
          <b onClick={handleProfileRoutingWithOtherItem}>{follower}</b> has sent
          you a proposal to Add Airdrop: <b>{pod}</b>. You have 7 days to accept
          or decline this invitation.
        </div>
      ) : type === 140 ? (
        <div className={classes.contentBox}>
          We’re sorry, your proposal has been declined.
        </div>
      ) : type === 141 ? (
        <div className={classes.contentBox}>
          Psst! Remember that you have a pending request to Add Airdrop. Beware
          that this invitation expires in 1 day.
        </div>
      ) : type === 142 ? (
        <div className={classes.contentBox}>
          Oops! We’re sorry but time is out. Your Add Airdrop proposal didn’t
          get all the approvals on time.
        </div>
      ) : type === 143 ? (
        <div className={classes.contentBox}>
          Everyone on board! Your proposal for Add Airdrop <b>{pod}</b> has been
          signed by all its founders.
        </div>
      ) : type === 144 ? (
        <div className={classes.contentBox}>
          <b onClick={handleProfileRoutingWithOtherItem}>{follower}</b> has sent
          you a proposal to Add Allocation: <b>{pod}</b>. You have 7 days to
          accept or decline this invitation.
        </div>
      ) : type === 145 ? (
        <div className={classes.contentBox}>
          We’re sorry, your proposal has been declined.
        </div>
      ) : type === 146 ? (
        <div className={classes.contentBox}>
          Psst! Remember that you have a pending request to Add Allocation.
          Beware that this invitation expires in 1 day.
        </div>
      ) : type === 147 ? (
        <div className={classes.contentBox}>
          Oops! We’re sorry but time is out. Your Add Allocation proposal didn’t
          get all the approvals on time.
        </div>
      ) : type === 148 ? (
        <div className={classes.contentBox}>
          Everyone on board! Your proposal for Add Allocation <b>{pod}</b> has
          been signed by all its founders.
        </div>
      ) : type === 149 ? (
        <div className={classes.contentBox}>
          <b onClick={handleProfileRoutingWithOtherItem}>{follower}</b> has sent
          you a proposal to Add Transfer: <b>{pod}</b>. You have 7 days to
          accept or decline this invitation.
        </div>
      ) : type === 150 ? (
        <div className={classes.contentBox}>
          We’re sorry, your proposal has been declined.
        </div>
      ) : type === 151 ? (
        <div className={classes.contentBox}>
          Psst! Remember that you have a pending request to Add Transfer. Beware
          that this invitation expires in 1 day.
        </div>
      ) : type === 152 ? (
        <div className={classes.contentBox}>
          Oops! We’re sorry but time is out. Your Add Transfer proposal didn’t
          get all the approvals on time.
        </div>
      ) : type === 153 ? (
        <div className={classes.contentBox}>
          Everyone on board! Your proposal for Add Transfer <b>{pod}</b> has
          been signed by all its founders.
        </div>
      ) : type === 154 ? (
        <div className={classes.contentBox}>
          <b onClick={handleProfileRoutingWithOtherItem}>{follower}</b> has sent
          you a proposal to Add Bid: <b>{pod}</b>. You have 7 days to accept or
          decline this invitation.
        </div>
      ) : type === 155 ? (
        <div className={classes.contentBox}>
          We’re sorry, your proposal has been declined.
        </div>
      ) : type === 156 ? (
        <div className={classes.contentBox}>
          Psst! Remember that you have a pending request to Add Bid. Beware that
          this invitation expires in 1 day.
        </div>
      ) : type === 157 ? (
        <div className={classes.contentBox}>
          Oops! We’re sorry but time is out. Your Add Bid proposal didn’t get
          all the approvals on time.
        </div>
      ) : type === 158 ? (
        <div className={classes.contentBox}>
          Everyone on board! Your proposal for Add Bid <b>{pod}</b> has been
          signed by all its founders.
        </div>
      ) : type === 159 ? (
        <div className={classes.contentBox}>
          <b onClick={handleProfileRoutingWithOtherItem}>{follower}</b> has sent
          you a proposal to Add BuyOrder: <b>{pod}</b>. You have 7 days to
          accept or decline this invitation.
        </div>
      ) : type === 160 ? (
        <div className={classes.contentBox}>
          We’re sorry, your proposal has been declined.
        </div>
      ) : type === 161 ? (
        <div className={classes.contentBox}>
          Psst! Remember that you have a pending request to Add BuyOrder. Beware
          that this invitation expires in 1 day.
        </div>
      ) : type === 162 ? (
        <div className={classes.contentBox}>
          Oops! We’re sorry but time is out. Your Add BuyOrder proposal didn’t
          get all the approvals on time.
        </div>
      ) : type === 163 ? (
        <div className={classes.contentBox}>
          Everyone on board! Your proposal for Add BuyOrder <b>{pod}</b> has
          been signed by all its founders.
        </div>
      ) : type === 164 ? (
        <div className={classes.contentBox}>
          <b onClick={handleProfileRoutingWithOtherItem}>{follower}</b> has sent
          you a proposal to Add Buying: <b>{pod}</b>. You have 7 days to accept
          or decline this invitation.
        </div>
      ) : type === 165 ? (
        <div className={classes.contentBox}>
          We’re sorry, your proposal has been declined.
        </div>
      ) : type === 166 ? (
        <div className={classes.contentBox}>
          Psst! Remember that you have a pending request to Add Buying. Beware
          that this invitation expires in 1 day.
        </div>
      ) : type === 167 ? (
        <div className={classes.contentBox}>
          Oops! We’re sorry but time is out. Your Add Buying proposal didn’t get
          all the approvals on time.
        </div>
      ) : type === 168 ? (
        <div className={classes.contentBox}>
          Everyone on board! Your proposal for Add Buying <b>{pod}</b> has been
          signed by all its founders.
        </div>
      ) : type === 169 ? (
        <div className={classes.contentBox}>
          <b onClick={handleProfileRoutingWithOtherItem}>{follower}</b> has sent
          you a proposal to Eject {follower} from <b>{pod}</b> community. You
          have 7 days to accept or decline this invitation.
        </div>
      ) : type === 170 ? (
        <div className={classes.contentBox}>
          We’re sorry, your proposal has been declined.
        </div>
      ) : type === 171 ? (
        <div className={classes.contentBox}>
          Psst! Remember that you have a pending request to Add Eject. Beware
          that this invitation expires in 1 day.
        </div>
      ) : type === 172 ? (
        <div className={classes.contentBox}>
          Oops! We’re sorry but time is out. Your Add Eject proposal didn’t get
          all the approvals on time.
        </div>
      ) : type === 173 ? (
        <div className={classes.contentBox}>
          Everyone on board! Your proposal for Add Eject <b>{pod}</b> has been
          signed by all its founders.
        </div>
      ) : type === 174 ? (
        <div className={classes.contentBox}>
          <b onClick={handleProfileRoutingWithOtherItem}>{follower}</b> has sent
          you a proposal to Add Exchange: <b>{pod}</b>. You have 7 days to
          accept or decline this invitation.
        </div>
      ) : type === 175 ? (
        <div className={classes.contentBox}>
          We’re sorry, your proposal has been declined.
        </div>
      ) : type === 176 ? (
        <div className={classes.contentBox}>
          Psst! Remember that you have a pending request to Add Exchange. Beware
          that this invitation expires in 1 day.
        </div>
      ) : type === 177 ? (
        <div className={classes.contentBox}>
          Oops! We’re sorry but time is out. Your Add Exchange proposal didn’t
          get all the approvals on time.
        </div>
      ) : type === 178 ? (
        <div className={classes.contentBox}>
          Everyone on board! Your proposal for Add Exchange <b>{pod}</b> has
          been signed by all its founders.
        </div>
      ) : type === 179 ? (
        <div className={classes.contentBox}>
          <b onClick={handleProfileRoutingWithOtherItem}>{follower}</b> has
          requested to join: <b>{pod}</b> community. You have 7 days to accept
          or decline this request.
        </div>
      ) : type === 180 ? (
        <div className={classes.contentBox}>
          We’re sorry, your proposal has been declined.
        </div>
      ) : type === 181 ? (
        <div className={classes.contentBox}>
          Psst! Remember that you have a pending request to Add JoiningRequest.
          Beware that this invitation expires in 1 day.
        </div>
      ) : type === 182 ? (
        <div className={classes.contentBox}>
          Oops! We’re sorry but time is out. Your Add JoiningRequest proposal
          didn’t get all the approvals on time.
        </div>
      ) : type === 183 ? (
        <div className={classes.contentBox}>
          Everyone on board! A new member has joined <b>{pod}</b> community.
        </div>
      ) : type === 184 ? (
        <div className={classes.contentBox}>
          <b onClick={handleProfileRoutingWithOtherItem}>{follower}</b> has sent
          you a proposal: <b>{pod}</b>. You have 7 days to accept or decline
          this invitation.
        </div>
      ) : type === 185 ? (
        <div className={classes.contentBox}>
          We’re sorry, your proposal has been declined.
        </div>
      ) : type === 186 ? (
        <div className={classes.contentBox}>
          Psst! Remember that you have a pending request. Beware that this
          invitation expires in 1 day.
        </div>
      ) : type === 187 ? (
        <div className={classes.contentBox}>
          Oops! We’re sorry but time is out. Your proposal didn’t get all the
          approvals on time.
        </div>
      ) : type === 188 ? (
        <div className={classes.contentBox}>
          Everyone on board! Your proposal <b>{pod}</b> has been signed by all
          its founders.
        </div>
      ) : type === 189 ? (
        <div className={classes.contentBox}>
          <b onClick={handleProfileRoutingWithOtherItem}>{follower}</b> has sent
          you a proposal to eject {follower} as treasurer from <b>{pod}</b>. You
          have 7 days to accept or decline this invitation.
        </div>
      ) : type === 190 ? (
        <div className={classes.contentBox}>
          We’re sorry, your proposal has been declined.
        </div>
      ) : type === 191 ? (
        <div className={classes.contentBox}>
          Psst! Rememeber that you have a pending eject treasurer proposal.
          Beware that this invitation expires in less than 1 day.
        </div>
      ) : type === 192 ? (
        <div className={classes.contentBox}>
          Oops! We’re sorry but time is out. Your proposal didn’t get all the
          approvals on time.
        </div>
      ) : type === 193 ? (
        <div className={classes.contentBox}>
          Congratulations! Your proposal has been signed by all its funders.
        </div>
      ) : type === 194 ? (
        <div className={classes.contentBox}>
          <b onClick={handleProfileRoutingWithOtherItem}>{follower}</b> has
          invited you to be a member of the community <b>{pod}</b>.
        </div>
      ) : type === 195 ? (
        <div className={classes.contentBox}>
          We’re sorry, your invitation has been declined.
        </div>
      ) : type === 196 ? (
        <div className={classes.contentBox}>
          Psst! Rememeber that you have a pending community member invitation.
          Beware that this invitation expires in less than 1 day.
        </div>
      ) : type === 197 ? (
        <div className={classes.contentBox}>
          Oops! We’re sorry but time is out. Your invitation has expired.
        </div>
      ) : type === 198 ? (
        <div className={classes.contentBox}>
          Congratulations! {follower} has accepted your member invitation
        </div>
      ) : type === 199 ? (
        <div className={classes.contentBox}>
          <b>{follower}</b> has proposed to place a bid of{' '}
          <b>
            {amount} {token}
          </b>{' '}
          to buy <b>{otherItemId}</b> NFT in <b>{pod}</b> community.
        </div>
      ) : type === 200 ? (
        <div className={classes.contentBox}>
          <b>{pod}</b> community members have proposed to place a bid of{' '}
          <b>
            {amount} {token}
          </b>{' '}
          to buy <b>{otherItemId}</b> NFT.
        </div>
      ) : type === 201 ? (
        <div className={classes.contentBox}>
          <b>{follower}</b> has proposed to place a buying order of{' '}
          <b>
            {amount} {token}
          </b>{' '}
          for <b>{otherItemId}</b> NFT in <b>{pod}</b> community.
        </div>
      ) : type === 202 ? (
        <div className={classes.contentBox}>
          <b>{pod}</b> community members have proposed to place a buying order
          of{' '}
          <b>
            {amount} {token}
          </b>{' '}
          for <b>{otherItemId}</b> NFT.
        </div>
      ) : type === 203 ? (
        <div className={classes.contentBox}>
          <b>{follower}</b> has proposed to buy <b>{otherItemId}</b> NFT with{' '}
          <b>
            {amount} {token}
          </b>{' '}
          in <b>{pod}</b> community.
        </div>
      ) : type === 204 ? (
        <div className={classes.contentBox}>
          <b>{pod}</b> community members have proposed to buy{' '}
          <b>{otherItemId}</b> NFT with{' '}
          <b>
            {amount} {token}
          </b>
          .
        </div>
      ) : type === 205 ? (
        <div className={classes.contentBox}>
          <b>{`Congratulation! ${follower} has made a bid on your ${pod} NFT.`}</b>
        </div>
      ) : type === 206 ? (
        <div className={classes.contentBox}>
          <b>{`Great! Your bid has been successful.`}</b>
        </div>
      ) : type === 207 ? (
        <div className={classes.contentBox}>
          <b>{`Congratulation! ${follower} has made a bigger bid on your ${pod} NFT.`}</b>
        </div>
      ) : type === 208 ? (
        <div className={classes.contentBox}>
          <b>{`News! ${follower} has made a higher bided on ${pod} NFT. Your bid amount has been returned to you.`}</b>
        </div>
      ) : type === 209 ? (
        <div className={classes.contentBox}>
          <b>{`Reminder! Your ${pod} NFT auction is about to end. It will be automatically withdrawn when ended.`}</b>
        </div>
      ) : type === 210 ? (
        <div className={classes.contentBox}>
          <b>{`Your ${pod} NFT auction has ended. The NFT has been transfered to the highest bidder ${follower}.`}</b>
        </div>
      ) : type === 211 ? (
        <div className={classes.contentBox}>
          <b>{`Congratulations! The ${pod} NFT auction countdown has ended, so now it is yours.`}</b>
        </div>
      ) : type === 212 ? (
        <div className={classes.contentBox}>
          <b>{`Your ${pod} NFT auction has ended without any bid. The NFT has been returned to you.`}</b>
        </div>
      ) : type === 213 ? (
        <div className={classes.contentBox}>
          <b>{`You have cancelled ${pod} NFT auction.`}</b>
        </div>
      ) : type === 214 ? (
        <div className={classes.contentBox}>
          <b>{`The owner of ${pod} NFT has cancelled the auction.`}</b>
        </div>
      ) : type === 215 ? (
        <div className={classes.contentBox}>
          <b>{`Congratulation! Your NFT has been deposited successfully.`}</b>
        </div>
      ) : type === 216 ? (
        <div className={classes.contentBox}>
          You have successfully created conditions for{' '}
          <strong onClick={() => history.push(`/capsules/${otherItemId}`)}>
            {pod}
          </strong>
          , make sure to ping your collabs to vote on it 🗳️
        </div>
      ) : type === 217 ? (
        <div className={classes.contentBox}>
          <strong>{follower}</strong>&nbsp; created a Capsule Distribution Proposal
          in&nbsp;
          <strong onClick={() => history.push(`/capsules/${otherItemId}`)}>
            {pod}
          </strong>
          , go to Capsule to check it out.
        </div>
      ) : type === 218 ? (
        <div className={classes.contentBox}>
          Congrats! 🎉 All collaborators on{' '}
          <strong onClick={() => history.push(`/capsules/${otherItemId}`)}>
            {pod}
          </strong>{' '}
          have accepted the distribution proposal. Start sharing to reach your
          funding goals!{' '}
          <img
            src={require('assets/slackIcons/moneybag.webp')}
            className={classes.img}
          />
        </div>
      ) : type === 219 ? (
        <div className={classes.contentBox}>
          <strong>{follower}</strong>&nbsp; voted against the Capsule proposal,
          head to the Capsule to chat
        </div>
      ) : type === 221 ? (
        <div className={classes.contentBox}>
          <b>{follower}</b> has created a withdrawal proposal{' '}
          <img
            src={require('assets/slackIcons/eyes.webp')}
            className={classes.img}
          />
        </div>
      ) : type === 270 ? (
        <div className={classes.contentBox}>
          You have successfully created a withdrawal proposal
        </div>
      ) : type === 232 ? (
        <div className={classes.contentBox}>
          You have been invited by {follower} to Collab on a{' '}
          <b onClick={() => history.push(`/capsules/${otherItemId}`)}>{pod}</b> Capsule.
          Head there now. 🏃‍♂️
        </div>
      ) : type === 263 ? (
        <div className={classes.contentBox}>
          You created a Capsule, you are officially a web3 bad ass 🍋
        </div>
      ) : type === 234 ? (
        <div className={classes.contentBox}>
          <b onClick={handleProfileRouting}>{follower}</b> started following
          you! Do you want to Follow Back?
        </div>
      ) : type === 235 ? (
        <div className={classes.contentBox}>
          <b onClick={handleProfileRouting}>{follower}</b> sent you a Social
          Token Airdrop of {token} {amount}.
        </div>
      ) : type === 256 ? (
        <div className={classes.contentBox}>
          <b onClick={handleProfileRouting}>{follower}</b> just created a wall
          post <b>{token}</b>.
        </div>
      ) : type === 257 ? (
        <div className={classes.contentBox}>
          <b onClick={handleProfileRouting}>{follower}</b> just commented on{' '}
          <b>{token}</b> wall post
        </div>
      ) : type === 258 ? (
        <div className={classes.contentBox}>
          Reminder! Your Capsule Proposal Deadline is in{' '}
          {amount
            ? `${amount > 1 ? amount : 'a'} day${amount > 1 ? 's' : ''}`
            : `an hour`}
          . Head to your Capsule to settle the details!
        </div>
      ) : type === 259 ? (
        <div className={classes.contentBox}>
          There is a new sales proposal in{' '}
          <strong onClick={() => history.push(`/capsules/${otherItemId}`)}>
            {pod}
          </strong>
          , go to Capsule.
        </div>
      ) : type === 280 ? (
        <div className={classes.contentBox}>
          You have successfully created a sales proposal of{' '}
          <strong onClick={() => history.push(`/capsules/${otherItemId}`)}>
            {pod}
          </strong>
          &nbsp;NFT.
        </div>
      ) : type === 260 ? (
        <div className={classes.contentBox}>
          The sales proposal for the NFT in{' '}
          <strong onClick={() => history.push(`/capsules/${otherItemId}`)}>
            {pod}
          </strong>{' '}
          has been successful! Go to Capsule and check it out!
        </div>
      ) : type === 261 ? (
        <div className={classes.contentBox}>
          The NFT is now live on OpenSea, go check it out
        </div>
      ) : type === 262 ? (
        <div className={classes.contentBox}>
          The NFT from{' '}
          <strong onClick={() => history.push(`/capsules/${otherItemId}`)}>
            {pod}
          </strong>{' '}
          is now live on Myx, go check it out
        </div>
      ) : type === 266 ? (
        <div className={classes.contentBox}>
          <strong>{follower}</strong>&nbsp;has just accepted the invitation to
          join&nbsp;
          <b onClick={() => history.push(`/capsules/${otherItemId}`)}>
            {pod}
          </b>
          &nbsp;Say wazzaap 👋 and go to Capsule.
        </div>
      ) : type === 264 ? (
        <div className={classes.contentBox}>
          Uh oh! <strong>{follower}</strong>&nbsp;rejected&nbsp;
          <strong onClick={() => history.push(`/capsules/${otherItemId}`)}>
            {pod}
          </strong>{' '}
          invite. 😞 But don't worry, you can add creators anytime.
        </div>
      ) : type === 265 ? (
        <div className={classes.contentBox}>
          Everyone in{' '}
          <strong onClick={() => history.push(`/capsules/${otherItemId}`)}>
            {pod}
          </strong>{' '}
          has approved your proposal. 💪
        </div>
      ) : type === 267 ? (
        <div className={classes.contentBox}>
          Boom!{' '}
          <strong onClick={() => history.push(`/capsules/${otherItemId}`)}>
            {pod}
          </strong>{' '}
          has a new investor, {follower} just invested {amount} USDT.
        </div>
      ) : type === 268 ? (
        <div className={classes.contentBox}>
          A collaborator in{' '}
          <strong onClick={() => history.push(`/capsules/${otherItemId}`)}>
            {pod}
          </strong>{' '}
          has just edited track details.
        </div>
      ) : type === 269 ? (
        <div className={classes.contentBox}>
          You've claimed media fractions successfully on pod funded.
        </div>
      ) : type === 271 ? (
        <div className={classes.contentBox}>
          People are voting on your withdrawal proposal, go there now to check
          things out. 🏃‍♂️
        </div>
      ) : type === 272 ? (
        <div className={classes.contentBox}>
          A withdrawal proposal has been rejected.{' '}
          <img
            src={require('assets/slackIcons/no_entry_sign.webp')}
            className={classes.img}
          />
        </div>
      ) : type === 273 ? (
        <div className={classes.contentBox}>
          Wam bam thank you mam, withdrawal proposal agreed upon and funds have
          been sent out of the Capsule.{' '}
          <img
            src={require('assets/slackIcons/white_check_mark.webp')}
            className={classes.img}
          />
        </div>
      ) : type === 274 ? (
        <div className={classes.contentBox}>
          You have successfully staked your media fractions in{' '}
          <strong onClick={() => history.push(`/capsules/${otherItemId}`)}>
            {pod}
          </strong>
        </div>
      ) : type === 275 ? (
        <div className={classes.contentBox}>
          You have successfully staked your media fraction NFT in{' '}
          <strong onClick={() => history.push(`/capsules/${otherItemId}`)}>
            {pod}
          </strong>
        </div>
      ) : type === 276 ? (
        <div className={classes.contentBox}>
          A media fraction NFT has successfully been created
        </div>
      ) : type === 277 ? (
        <div className={classes.contentBox}>
          You have successfully unstaked your media fractions
        </div>
      ) : type === 278 ? (
        <div className={classes.contentBox}>
          You have successfully unstated your media fraction NFT
        </div>
      ) : type === 279 ? (
        <div className={classes.contentBox}>
          The track in{' '}
          <strong onClick={() => history.push(`/capsules/${otherItemId}`)}>
            {pod}
          </strong>{' '}
          has been uploaded and minted as an NFT 🎉
        </div>
      ) : type === 281 ? (
        <div className={classes.contentBox}>
          People are voting on the sales proposal, go to Capsule to check out
          the status. 🏃‍♂️
        </div>
      ) : type === 282 ? (
        <div className={classes.contentBox}>
          You have successfully submitted your vote on the sales proposal of{' '}
          <strong onClick={() => history.push(`/capsules/${otherItemId}`)}>
            {pod}
          </strong>
        </div>
      ) : type === 283 ? (
        <div className={classes.contentBox}>
          The sales proposal for{' '}
          <strong onClick={() => history.push(`/capsules/${otherItemId}`)}>
            {pod}
          </strong>{' '}
          NFT has been rejected, go create a new one{' '}
          <img
            src={require('assets/slackIcons/building_construction.webp')}
            className={classes.img}
          />
        </div>
      ) : type === 284 ? (
        <div className={classes.contentBox}>
          <b onClick={handleProfileRouting}>{follower}</b> just liked on{' '}
          <b>{token}</b> wall post.
        </div>
      ) : type === 285 ? (
        <div className={classes.contentBox}>
          <strong>{pod}</strong> is fully funded and is live!
        </div>
      ) : type === 286 ? (
        <div className={classes.contentBox}>
          <strong>{pod}</strong> failed to hit its funding target by the
          investment deadline, the Capsule is now burned, but don't worry, you
          can create a Capsule whenever you want
        </div>
      ) : type === 287 ? (
        <div className={classes.contentBox}>
          Congratulations!{' '}
          <strong onClick={() => history.push(`/capsules/${otherItemId}`)}>
            {pod}
          </strong>{' '}
          is funded.🎉 You have received {roundFloat(Number(amount), 4)} {token}{' '}
          media fractions.
        </div>
      ) : type === 288 ? (
        <div className={classes.contentBox}>
          Congratulations!{' '}
          <strong onClick={() => history.push(`/capsules/${otherItemId}`)}>
            {pod}
          </strong>{' '}
          is created.🎉 You have received {roundFloat(Number(amount), 4)}{' '}
          {token} media fractions.
        </div>
      ) : type === 289 ? (
        <div className={classes.contentBox}>
          Congrats! You just sold an edition of{' '}
          <strong onClick={() => history.push(`/music/track/${otherItemId}`)}>
            {pod}
          </strong>
          . Your funds are now available in your wallet!
        </div>
      ) : null}
    </>
  );
};
