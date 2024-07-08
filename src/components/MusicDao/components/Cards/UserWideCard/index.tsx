import React from 'react';
import classnames from 'classnames';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';

import { RootState } from 'store/reducers/Reducer';

import { getDefaultAvatar } from 'shared/services/user/getUserAvatar';
import Box from 'shared/ui-kit/Box';
import { processImage } from 'shared/helpers';

const userCardStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    height: 153,
    background: '#ffffff',
    borderRadius: 12,
    userSelect: 'none',
    cursor: 'pointer',
    display: 'flex',
    padding: '9px 11px 11px',
    justifyContent: 'space-between',
    position: 'relative'
  },
  avatar: {
    boxShadow:
      '0px 49.134px 26.8417px -40.945px rgba(22, 118, 205, 0.29), 0px 26.3868px 17.7428px -15.0132px rgba(49, 61, 72, 0.29)',
    borderRadius: 20,
    height: '133px',
    width: '114px',
    objectFit: 'cover'
  },
  title: {
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: '26px',
    lineHeight: '104.5%',
    textAlign: 'justify',
    color: '#081831',
    textShadow: '0px 0px 20px rgba(255, 255, 255, 0.3)'
  },
  userName: {
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: '11px',
    lineHeight: '104.5%',
    color: '#54658F',
    marginTop: 4
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 10
  },
  icon: {
    width: 14,
    height: 14
  },
  status: {
    marginLeft: 8,

    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '12px',
    lineHeight: '104.5%',
    color: '#707582'
  },
  hashtag: {
    background: 'linear-gradient(0deg, #F2FBF6, #F2FBF6)',
    borderRadius: '6px',
    padding: '6px 12px',

    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: '12px',
    lineHeight: '15px',
    color: '#2D3047',
    width: 'fit-content',
    height: 'fit-content',

    '&:not(:first-child)': {
      marginLeft: '13px'
    }
  },
  statusVerify: {
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '12px',
    lineHeight: '104.5%',
    textAlign: 'right',
    color: '#707582',
    marginLeft: 7
  },
  claim: {
    background: '#2D3047',
    borderRadius: '10px',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: '6.36923px',
    lineHeight: '7px',
    textAlign: 'center',
    color: '#FFFFFF',
    padding: '5px 16px',
    position: 'absolute',
    top: 8,
    left: 4
  },
  verify: {
    position: 'absolute',
    bottom: 4,
    right: 8
  },
  fruit: {
    position: 'absolute',
    top: 6,
    right: 8,
    '& > div': {
      background: '#A1E2FF',
      border: '1px solid rgba(238, 242, 246, 0.7)',
      padding: 2,
      '& img': {
        width: 13,
        height: 13
      }
    }
  },
  deleteIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 16,
    cursor: 'pointer'
  }
}));

const UserWideCard = (props) => {
  const history = useHistory();

  const classes = userCardStyles();
  const { canDelete, user, invited, className, handleDeleteCollab } = props;
  const userSelector = useSelector((state: RootState) => state.user);
  const isDeleteShown = React.useMemo(() => {
    if (!userSelector || !user) return false;
    if (user.id === userSelector.id) return false;
    return invited;
  }, [invited, userSelector, user]);

  return (
    <div
      className={classnames(classes.container, className)}
      onClick={() => {
        history.push(`/profile/${user.urlSlug ?? user.id}`);
      }}
    >
      {isDeleteShown && canDelete && (
        <img
          src={require('assets/icons/delete_red.svg')}
          alt={'Delete Collab'}
          className={classes.deleteIcon}
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteCollab(user.id);
          }}
        />
      )}
      <Box display="flex" alignItems="center">
        <Box display="flex" position="relative">
          <img
            className={classes.avatar}
            src={processImage(user.imageUrl) ?? getDefaultAvatar()}
            alt=""
          />
          {/* <Box className={classes.claim}>Claim</Box>
          <Box className={classes.fruit} position="absolute" top={6} right={8}>
            <FruitSelect fruitObject={{}} members={[]} />
          </Box> */}
          <svg
            className={classes.verify}
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M9.07047 4.29488C9.30135 4.55122 9.30135 4.94053 9.07047 5.19687L8.58413 5.73682C8.45625 5.8788 8.39465 6.06839 8.41467 6.25841L8.49079 6.98105C8.52695 7.32432 8.29788 7.63942 7.96019 7.71091L7.24989 7.86128C7.06257 7.90094 6.90096 8.01841 6.80544 8.18436L6.44348 8.81314C6.27106 9.11265 5.90001 9.23319 5.58449 9.09217L4.92216 8.79616C4.74719 8.71796 4.54721 8.71796 4.37224 8.79616L3.70991 9.09217C3.39439 9.23319 3.02333 9.11265 2.85092 8.81314L2.48896 8.18436C2.39344 8.01841 2.23183 7.90094 2.04451 7.86128L1.3342 7.71091C0.996514 7.63942 0.767443 7.32432 0.803599 6.98105L0.879715 6.2584C0.899729 6.06838 0.838138 5.8788 0.710265 5.73683L0.223938 5.19687C-0.00693918 4.94053 -0.0069373 4.55122 0.223942 4.29489L0.71028 3.75492C0.838155 3.61295 0.899748 3.42337 0.879733 3.23334L0.803618 2.5107C0.767461 2.16743 0.996532 1.85233 1.33422 1.78084L2.04453 1.63047C2.23185 1.59081 2.39346 1.47334 2.48898 1.30739L2.85094 0.678609C3.02336 0.379094 3.3944 0.258559 3.70992 0.399569L4.37226 0.695578C4.54723 0.773772 4.74721 0.773772 4.92217 0.695578L5.58451 0.399569C5.90003 0.258559 6.27108 0.379094 6.4435 0.678609L6.80546 1.30739C6.90098 1.47334 7.06259 1.59081 7.24991 1.63047L7.96021 1.78084C8.2979 1.85233 8.52697 2.16743 8.49081 2.5107L8.41469 3.23334C8.39467 3.42336 8.45626 3.61295 8.58414 3.75493L9.07047 4.29488ZM6.68896 4.15252C6.88633 3.95515 6.88633 3.63514 6.68896 3.43777C6.49158 3.24039 6.17158 3.24039 5.9742 3.43777L3.973 5.43897L3.31956 4.78553C3.12219 4.58815 2.80218 4.58815 2.60481 4.78553C2.40743 4.9829 2.40743 5.30291 2.60481 5.50028L3.61563 6.5111C3.71041 6.60588 3.83896 6.65913 3.973 6.65913C4.10705 6.65913 4.2356 6.60588 4.33038 6.5111L6.68896 4.15252Z"
              fill="white"
            />
          </svg>
        </Box>
        <Box ml={4}>
          <div className={classes.title}>
            {user?.name && user?.name.length > 17
              ? user?.name.substr(0, 13) +
                '...' +
                user?.name.substr(user?.name.length - 3, 3)
              : user?.name}
          </div>
          <div className={classes.userName}>@{user?.urlSlug}</div>
          {props.accepted ? (
            <div className={classes.iconContainer}>
              {!user?.addedCreator && (
                <svg
                  width="14"
                  height="17"
                  viewBox="0 0 14 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.76727 2.4092C4.244 1.74324 4.89903 1.23887 5.66832 0.957184C7.1982 0.393128 9.00909 0.885857 10.0426 2.14717C10.5725 2.79129 10.8869 3.56788 10.9509 4.40205C11.0128 5.20993 10.8112 6.04111 10.3891 6.73258C9.98149 7.40071 9.37011 7.95677 8.6554 8.27555C7.88536 8.6191 7.03962 8.71952 6.2114 8.55577C4.6393 8.24425 3.35246 6.9167 3.10726 5.33145C3.07451 5.11675 3.05267 4.90203 3.05267 4.68368V4.68004C3.05049 3.87216 3.29795 3.06572 3.76739 2.40914L3.76727 2.4092Z"
                    fill="url(#paint0_linear_accept)"
                  />
                  <path
                    d="M0.175854 11.9854C0.174398 11.9745 0.174398 11.9621 0.174398 11.949C0.178038 10.5916 0.763944 9.26482 1.78652 8.36805C2.04707 8.14096 2.32876 7.93863 2.62933 7.76759C2.75889 7.69481 2.96777 7.70063 3.06967 7.82436C3.26035 8.05726 3.46997 8.27561 3.69706 8.47431C3.75164 8.52162 3.80769 8.56892 3.86446 8.61623C3.87028 8.62206 3.88484 8.63225 3.89939 8.64389C3.90085 8.64389 3.90085 8.64535 3.90303 8.64535C3.9336 8.67082 3.96708 8.69266 3.9991 8.71667C4.12138 8.8062 4.24656 8.8899 4.37611 8.96996C4.5013 9.04638 4.63085 9.11698 4.76185 9.18466C4.82736 9.21741 4.89432 9.25016 4.962 9.27928C4.98529 9.29019 5.00931 9.30111 5.03333 9.30984C5.03187 9.30984 5.02751 9.30839 5.02605 9.30839C5.02969 9.30984 5.04061 9.31421 5.0588 9.32149C5.05152 9.31785 5.04425 9.31567 5.03842 9.31276C5.04424 9.31421 5.05152 9.31858 5.05443 9.32003C5.07991 9.33095 5.10538 9.34041 5.13304 9.3506C5.41688 9.46123 5.70949 9.54712 6.00788 9.60898C6.08212 9.62353 6.15709 9.63809 6.23205 9.64901C6.25024 9.65264 6.26989 9.65483 6.28882 9.65774H6.29464C6.28882 9.65774 6.291 9.65774 6.31284 9.6592C6.31647 9.6592 6.32011 9.66065 6.32375 9.66065C6.3223 9.66065 6.32011 9.66065 6.31793 9.6592C6.32521 9.6592 6.33249 9.66065 6.33613 9.66065C6.35942 9.66429 6.38344 9.66647 6.40745 9.66938C6.56757 9.6854 6.7277 9.69704 6.88781 9.69995C7.04939 9.70359 7.20952 9.6985 7.37182 9.68685C7.44824 9.68103 7.52612 9.67375 7.60327 9.66502C7.61201 9.66502 7.64694 9.65919 7.66732 9.65774C7.6615 9.65774 7.65422 9.65919 7.65276 9.65919C7.6564 9.65919 7.6615 9.65774 7.67096 9.65774C7.67678 9.65774 7.67969 9.65628 7.68188 9.65628C7.68552 9.65628 7.69061 9.65483 7.69279 9.65483C7.71608 9.65119 7.7401 9.64755 7.76412 9.64391C8.0698 9.59442 8.37185 9.51872 8.66516 9.41682C8.7343 9.39353 8.8049 9.36587 8.87477 9.33821C8.89661 9.32948 8.9199 9.3222 8.94173 9.31056C8.94537 9.3091 8.95047 9.30473 8.96721 9.29964C8.98904 9.2909 9.00869 9.28144 9.03126 9.27198C9.16954 9.21012 9.30638 9.14097 9.43738 9.06673C9.58149 8.98667 9.72123 8.89933 9.85806 8.80617C9.92939 8.75668 9.99781 8.70573 10.0677 8.65479C10.0662 8.65624 10.0619 8.65843 10.0604 8.66061C10.0531 8.66643 10.0517 8.66789 10.0495 8.66934C10.0531 8.66789 10.0728 8.65115 10.0786 8.64751C10.0771 8.64896 10.0728 8.65115 10.0699 8.65479C10.0844 8.64169 10.1004 8.6315 10.115 8.61839C10.1514 8.58928 10.1863 8.56017 10.2205 8.53106C10.4789 8.3127 10.714 8.07106 10.9265 7.80833C11.027 7.6846 11.238 7.67586 11.3669 7.75156C12.011 8.12638 12.5605 8.60674 12.9914 9.21812C13.4535 9.87461 13.7279 10.6446 13.8196 11.4395C13.8575 11.7779 13.8487 12.12 13.8487 12.4599V13.8806V14.8777C13.8473 15.5473 13.4739 16.1987 12.8531 16.4804C12.5656 16.6099 12.2708 16.65 11.9615 16.65H1.97941C1.47867 16.65 0.98812 16.4644 0.647504 16.0896C0.370926 15.7839 0.212273 15.4032 0.18751 14.992C0.181688 14.8996 0.186055 14.8064 0.186055 14.714L0.18096 11.9853L0.175854 11.9854ZM5.61481 13.8159H6.45326V14.647C6.45326 14.9527 6.70436 15.1798 6.99913 15.1929C7.29389 15.206 7.545 14.9323 7.545 14.647V13.8159H8.38345C8.68913 13.8159 8.91622 13.5647 8.92932 13.27C8.94242 12.9752 8.66877 12.7241 8.38345 12.7241H7.545V11.8762C7.545 11.5705 7.29389 11.3434 6.99913 11.3303C6.70436 11.3172 6.45326 11.5909 6.45326 11.8762V12.7241H5.61481C5.30912 12.7241 5.08203 12.9752 5.06894 13.27C5.05584 13.5647 5.32876 13.8159 5.61481 13.8159Z"
                    fill="url(#paint1_linear_accept)"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_accept"
                      x1="10.3632"
                      y1="4.35225"
                      x2="3.34729"
                      y2="5.29233"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0.179206" stopColor="#A0D800" />
                      <stop offset="0.852705" stopColor="#0DCC9E" />
                    </linearGradient>
                    <linearGradient
                      id="paint1_linear_accept"
                      x1="12.8145"
                      y1="11.8068"
                      x2="0.962863"
                      y2="14.2333"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0.179206" stopColor="#A0D800" />
                      <stop offset="0.852705" stopColor="#0DCC9E" />
                    </linearGradient>
                  </defs>
                </svg>
              )}
              <span className={classes.statusVerify}>
                {user?.addedCreator ? user.role : 'Artist'}
              </span>
            </div>
          ) : (
            <Box display="flex" alignItems="center" mt={1}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.19791 7.34302L9.09003 4.5475L6.29451 9.43961C6.19653 9.61138 6.20372 9.82432 6.31345 9.98892L8.49749 13.2652C8.60788 13.4311 8.80382 13.5199 9.00172 13.4931C9.19963 13.467 9.36488 13.3298 9.42823 13.1404L13.5627 0.735717C13.6254 0.548262 13.5765 0.341211 13.4367 0.200791C13.2963 0.0610172 13.0892 0.0120327 12.9018 0.0747333L0.497067 4.20974C0.307656 4.27244 0.171149 4.43834 0.144363 4.6356C0.117583 4.8335 0.206411 5.02945 0.372315 5.13982L3.64855 7.32387C3.81314 7.4336 4.02607 7.44078 4.19786 7.34281L4.19791 7.34302Z"
                  fill="#54658F"
                />
              </svg>
              <span className={classes.statusVerify}>Invite sent</span>
            </Box>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default UserWideCard;
