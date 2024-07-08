import React, { useState, useEffect } from 'react';
import Moment from 'react-moment';
import axios from 'axios';

import { useTypedSelector } from 'store/reducers/Reducer';
import { getUser } from 'store/selectors';
import Box from 'shared/ui-kit/Box';
import StyledCheckbox from 'shared/ui-kit/Checkbox';
import { Color, SecondaryButton } from 'shared/ui-kit';
import URL from 'shared/functions/getURL';
import { useAlertMessage } from 'shared/hooks/useAlertMessage';
import { formatDateDefault } from 'shared/helpers';
// import { BlockchainNets } from "shared/constants/constants";
// import { switchNetwork } from "shared/functions/metamask";
// import Web3 from "web3";
// import { toDecimals } from "shared/functions/web3";
import { pollItemStyles } from './index.styles';

const arePropsEqual = (prevProps, currProps) => {
  return prevProps.item === currProps.item && prevProps.type === currProps.type;
};

const TimerIcon = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 17 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17 8.5C17 13.1944 13.1944 17 8.5 17C3.80558 17 0 13.1944 0 8.5C0 3.80558 3.80558 0 8.5 0C13.1944 0 17 3.80558 17 8.5Z"
      fill="#65CB63"
    />
    <path
      d="M8 4V8.375L11 11"
      stroke="#17172D"
      strokeWidth="2.06786"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PollItem = React.memo((props: any) => {
  const classes = pollItemStyles();

  const user = useTypedSelector(getUser);
  const { showAlertMessage } = useAlertMessage();

  const [endingTime, setEndingTime] = useState<any>();
  const [registeredVotes, setRegisteredVotes] = useState<any>(
    props.item.votes || []
  );

  const getMyAnswer = React.useMemo(() => {
    return (
      registeredVotes?.find((vote) => vote.userId === user.id)?.answer || ''
    );
  }, [registeredVotes, user]);

  const [currentAnswer, setCurrentAnswer] = useState<any>(getMyAnswer);

  const isEnded = () => {
    return !(new Date().getTime() < new Date(props.item.endDate).getTime());
  };

  useEffect(() => {
    const timerId = setInterval(() => {
      const now = new Date();
      let delta = Math.floor((props.item.endDate - now.getTime()) / 1000);
      if (delta < 0) {
        setEndingTime({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        });
        clearInterval(timerId);
      } else {
        let days = Math.floor(delta / 86400);
        delta -= days * 86400;

        // calculate (and subtract) whole hours
        let hours = Math.floor(delta / 3600) % 24;
        delta -= hours * 3600;

        // calculate (and subtract) whole minutes
        let minutes = Math.floor(delta / 60) % 60;
        delta -= minutes * 60;

        // what's left is seconds
        let seconds = delta % 60;
        setEndingTime({
          days,
          hours,
          minutes,
          seconds
        });
      }
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  const handleVote = async () => {
    if (getMyAnswer) return;

    // const targetChain = BlockchainNets.find(net => net.value === "Polygon blockchain");
    // if (chainId && chainId !== targetChain?.chainId) {
    //   const isHere = await switchNetwork(targetChain?.chainId || 0x89);
    //   if (!isHere) {
    //     showAlertMessage("Got failed while switching over to target network", { variant: "error" });
    //     return;
    //   }
    // }
    // const web3APIHandler = targetChain.apiHandler;
    // const web3 = new Web3(library.provider);
    // const podDecimals = await web3APIHandler.Erc20["COPYRIGHT"].decimals(web3, props.pod?.PodAddress);
    // const podBalance = await web3APIHandler.Erc20["COPYRIGHT"].balanceOf(web3, props.pod?.PodAddress, {
    //   account,
    // });

    // if (Number(toDecimals(podBalance, podDecimals)) === 0) {
    //   showAlertMessage("You don't have any Capsule Tokens.", { variant: "error" });
    //   return;
    // }

    const body = {
      podId: props.pod?.Id,
      pollId: props.item?.id,
      answer: currentAnswer,
      userId: user.id,
      userAddress: user.address
    };

    axios
      .post(`${URL()}/musicDao/governance/polls/vote`, body)
      .then((res) => {
        const data = res.data;
        if (data.success) {
          setRegisteredVotes([
            ...registeredVotes,
            { answer: currentAnswer, userId: user.id }
          ]);
          showAlertMessage('You voted', { variant: 'success' });
          props.refreshPod && props.refreshPod();
        }
      })
      .catch((e) => showAlertMessage('Failed to vote', { variant: 'error' }));
  };

  return (
    <Box className={classes.itemWrap}>
      <Box className={classes.item}>
        {/* state and date(or time) */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          width={1}
        >
          <Box className={classes.endBox} mr={1.25}>
            {isEnded() ? 'Ended' : 'Ongoing'}
          </Box>
          <Box fontSize={11} fontWeight={800} color="#707582">
            {isEnded() ? (
              <Moment fromNow>{props.item.endDate}</Moment>
            ) : (
              formatDateDefault(props.item.endDate)
            )}
          </Box>
        </Box>
        <Box className={classes.question} mt={2}>
          {props.item.question ? props.item.question : ''}
        </Box>
        <Box className={classes.header4} mb={2.5}>
          {props.item.description ? props.item.description : ''}
        </Box>
        {isEnded() ? (
          <>
            {props.item.possibleAnswers
              .filter((answer) => answer)
              .map((answer) => (
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  width={1}
                  mb={1}
                >
                  <Box
                    className={classes.name}
                    color="#181818"
                    width={1}
                    mr={2}
                  >
                    {answer}
                  </Box>
                  <Box flex="1" display="flex">
                    <Box
                      className={classes.progressBar}
                      width={`${Math.round(
                        (registeredVotes && registeredVotes.length > 0
                          ? (registeredVotes.filter(
                              (vote) => vote.answer === answer
                            ).length /
                              registeredVotes.length) *
                            100 *
                            100
                          : 0) / 100
                      )}%`}
                    />
                    <Box
                      className={classes.name}
                      width="55px"
                      ml={2}
                      textAlign="start"
                    >
                      {Math.round(
                        (registeredVotes && registeredVotes.length > 0
                          ? (registeredVotes.filter(
                              (vote) => vote.answer === answer
                            ).length /
                              registeredVotes.length) *
                            100 *
                            100
                          : 0) / 100
                      )}
                      %
                    </Box>
                  </Box>
                </Box>
              ))}
          </>
        ) : (
          <>
            {props.item.possibleAnswers
              .filter((answer) => answer)
              .map((answer) => (
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  width={1}
                  mb={1}
                >
                  <StyledCheckbox
                    buttonType="round"
                    buttonColor={Color.Violet}
                    checked={answer === currentAnswer}
                    onClick={() => setCurrentAnswer(answer)}
                    className={classes.checkbox}
                    disabled={getMyAnswer}
                  />
                  <Box className={classes.name} color="#181818" ml={1}>
                    {answer}
                  </Box>
                </Box>
              ))}
            {endingTime && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                flexDirection="row"
                mt="13px"
                mb="21px"
                bgcolor="#DDFF57"
                borderRadius={10}
                padding="11px"
                width={1}
                height="40px"
              >
                <Box display="flex" pt="7px">
                  <Box>
                    <TimerIcon />
                  </Box>
                  <span
                    style={{
                      color: '#431AB7',
                      fontSize: 14,
                      fontWeight: 800,
                      marginLeft: 11
                    }}
                  >
                    Time left
                  </span>
                </Box>
                <div>
                  {endingTime.days > 0 && (
                    <span
                      style={{
                        color: '#431AB7',
                        fontSize: 16,
                        fontWeight: 600,
                        marginRight: 4
                      }}
                    >
                      <b>{String(endingTime.days).padStart(2, '0')}</b>d
                    </span>
                  )}
                  {endingTime.hours > 0 && (
                    <span
                      style={{
                        color: '#431AB7',
                        fontSize: 16,
                        fontWeight: 600,
                        marginRight: 4
                      }}
                    >
                      <b>{String(endingTime.hours).padStart(2, '0')}</b>h
                    </span>
                  )}
                  {endingTime.minutes > 0 && (
                    <span
                      style={{
                        color: '#431AB7',
                        fontSize: 16,
                        fontWeight: 600,
                        marginRight: 4
                      }}
                    >
                      <b>{String(endingTime.minutes).padStart(2, '0')}</b>m
                    </span>
                  )}
                  <span
                    style={{
                      color: '#431AB7',
                      fontSize: 16,
                      fontWeight: 600,
                      marginRight: 4
                    }}
                  >
                    <b>{String(endingTime.seconds).padStart(2, '0')}</b>s
                  </span>
                </div>
              </Box>
            )}
            {!getMyAnswer && (
              <SecondaryButton
                size="medium"
                isRounded
                onClick={handleVote}
                disabled={
                  !currentAnswer ||
                  props.pod?.Collabs?.findIndex(
                    (collab) => collab.userId === user.id
                  ) === -1
                }
                style={{
                  background: Color.Black,
                  color: Color.White,
                  border: 'none',
                  width: '100%',
                  marginBottom: 16
                }}
              >
                Vote
              </SecondaryButton>
            )}
          </>
        )}
        <Box className={classes.lineBar}></Box>
        <Box display="flex" alignItems="center" marginY="21px">
          {registeredVotes &&
          registeredVotes.find((vote) => vote.userId === user.id) ? (
            <Box display="flex" alignItems="center">
              <img src={require('assets/icons/smile.svg')} />
              &nbsp;You’ve already voted
            </Box>
          ) : (
            <>
              <IconTriangle />
              <Box className={`${classes.header3} ${classes.gradientTxt}`}>
                {registeredVotes.length || 0} votes of{' '}
                {props.pod?.Collabs?.length || 0} required.
              </Box>
            </>
          )}
        </Box>
        {/* <Box className={classes.header1} fontSize={14} fontWeight={800}>
          Close results
        </Box> */}
      </Box>
    </Box>
  );
}, arePropsEqual);

export default PollItem;

const IconTriangle = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5 3L5.31716 2.32036C5.08488 2.21196 4.81333 2.2297 4.59712 2.3674C4.38091 2.50509 4.25 2.74367 4.25 3L5 3ZM4.25 21C4.25 21.4142 4.58579 21.75 5 21.75C5.41421 21.75 5.75 21.4142 5.75 21H4.25ZM5 17H4.25C4.25 17.2563 4.38091 17.4949 4.59712 17.6326C4.81333 17.7703 5.08488 17.788 5.31716 17.6796L5 17ZM20 10L20.3172 10.6796C20.5812 10.5564 20.75 10.2914 20.75 10C20.75 9.70861 20.5812 9.44359 20.3172 9.32036L20 10ZM4.25 3V21H5.75V3H4.25ZM5.31716 17.6796L20.3172 10.6796L19.6828 9.32036L4.68284 16.3204L5.31716 17.6796ZM20.3172 9.32036L5.31716 2.32036L4.68284 3.67964L19.6828 10.6796L20.3172 9.32036ZM5.75 17V3H4.25V17H5.75Z"
      fill="url(#paint0_linear)"
    />
    <defs>
      <linearGradient
        id="paint0_linear"
        x1="6.13542"
        y1="11.256"
        x2="19.5134"
        y2="12.7494"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.179206" stop-color="#A0D800" />
        <stop offset="0.852705" stop-color="#0DCC9E" />
      </linearGradient>
    </defs>
  </svg>
);
