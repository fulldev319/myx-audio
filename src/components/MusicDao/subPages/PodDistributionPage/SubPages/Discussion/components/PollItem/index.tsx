import React, { useState, useEffect } from 'react';
import Moment from 'react-moment';
import axios from 'axios';

import Box from 'shared/ui-kit/Box';
import { useTypedSelector } from 'store/reducers/Reducer';
import { getUser } from 'store/selectors';
import { useAlertMessage } from 'shared/hooks/useAlertMessage';
// import StyledCheckbox from "shared/ui-kit/Checkbox";
// import { Color } from "shared/ui-kit";
import URL from 'shared/functions/getURL';
// import { BorderLinearProgress } from "../LinearProgress";
import { formatDateDefault } from 'shared/helpers';
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

const FlagIcon = () => (
  <svg
    width="17"
    height="20"
    viewBox="0 0 17 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1 1L1.31716 0.320363C1.08488 0.211964 0.813326 0.229703 0.597119 0.367397C0.380911 0.505091 0.25 0.743669 0.25 1L1 1ZM0.25 19C0.25 19.4142 0.585786 19.75 1 19.75C1.41421 19.75 1.75 19.4142 1.75 19H0.25ZM1 15H0.25C0.25 15.2563 0.380911 15.4949 0.597119 15.6326C0.813326 15.7703 1.08488 15.788 1.31716 15.6796L1 15ZM16 8L16.3172 8.67964C16.5812 8.55641 16.75 8.29139 16.75 8C16.75 7.70861 16.5812 7.44359 16.3172 7.32036L16 8ZM0.25 1V19H1.75V1H0.25ZM1.31716 15.6796L16.3172 8.67964L15.6828 7.32036L0.682836 14.3204L1.31716 15.6796ZM16.3172 7.32036L1.31716 0.320363L0.682836 1.67964L15.6828 8.67964L16.3172 7.32036ZM1.75 15V1H0.25V15H1.75Z"
      fill="#9EACF2"
    />
  </svg>
);

const FaceIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6 12C6 12 7.5 14 10 14C12.5 14 14 12 14 12M7 7H7.01M13 7H13.01M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z"
      stroke="#181818"
      strokeWidth="1.5"
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
    props.item.votesList || []
  );

  const getMyAnswer = () => {
    return (
      registeredVotes?.find((vote) => vote.userId === user.id)?.answer || ''
    );
  };

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

  const handleVote = (answer) => {
    if (getMyAnswer()) return;

    const body = {
      pollId: props.item?.id,
      answer: answer,
      userId: user.id,
      userAddress: user.address
    };
    axios
      .post(`${URL()}/mediaPod/polls/vote`, body)
      .then((res) => {
        const data = res.data;
        if (data.success) {
          setRegisteredVotes([...registeredVotes, { answer, userId: user.id }]);
          showAlertMessage('Vote successfully', { variant: 'success' });
        }
      })
      .catch((e) => showAlertMessage('Failed to vote', { variant: 'error' }));
  };

  return (
    <Box className={classes.item}>
      <Box display="flex" alignItems="center" width={1}>
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
      <Box className={classes.header2} color="#181818" mt={2}>
        {props.item.question ? props.item.question : ''}
      </Box>
      {/* <Box className={classes.header3} color="#181818" mt={1} mb={3}>
        {props.item.description ? props.item.description : ""}
      </Box>
      {isEnded() ? (
        props.item.possibleAnswers
          .filter(answer => answer)
          .map(answer => (
            <Box display="flex" flexDirection="row" alignItems="center" width={1} mb={2}>
              <Box className={classes.name} color="#181818" mr={2} maxWidth="25%">
                {answer}
              </Box>
              <Box mr={2} width={"65%"}>
                <BorderLinearProgress
                  variant="determinate"
                  value={Math.round(
                    (registeredVotes && registeredVotes.length > 0
                      ? (registeredVotes.filter(vote => vote.answer === answer).length /
                          registeredVotes.length) *
                        100 *
                        100
                      : 0) / 100
                  )}
                />
              </Box>
              <Box className={classes.name}>
                {Math.round(
                  (registeredVotes && registeredVotes.length > 0
                    ? (registeredVotes.filter(vote => vote.answer === answer).length /
                        registeredVotes.length) *
                      100 *
                      100
                    : 0) / 100
                )}
                %
              </Box>
            </Box>
          ))
      ) : (
        <>
          {props.item.possibleAnswers
            .filter(answer => answer)
            .map(answer => (
              <Box display="flex" flexDirection="row" alignItems="center" width={1} mb={2}>
                <StyledCheckbox
                  buttonType="round"
                  buttonColor={Color.Violet}
                  checked={answer === getMyAnswer()}
                  onClick={() => handleVote(answer)}
                />
                <Box className={classes.name} color="#181818" ml={2}>
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
              mt={3}
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
                <span style={{ color: "#431AB7", fontSize: 14, fontWeight: 800, marginLeft: 11 }}>
                  Time left
                </span>
              </Box>
              <div>
                {endingTime.days > 0 && (
                  <span style={{ color: "#431AB7", fontSize: 16, fontWeight: 600, marginRight: 4 }}>
                    <b>{String(endingTime.days).padStart(2, "0")}</b>d
                  </span>
                )}
                {endingTime.hours > 0 && (
                  <span style={{ color: "#431AB7", fontSize: 16, fontWeight: 600, marginRight: 4 }}>
                    <b>{String(endingTime.hours).padStart(2, "0")}</b>h
                  </span>
                )}
                {endingTime.minutes > 0 && (
                  <span style={{ color: "#431AB7", fontSize: 16, fontWeight: 600, marginRight: 4 }}>
                    <b>{String(endingTime.minutes).padStart(2, "0")}</b>m
                  </span>
                )}
                <span style={{ color: "#431AB7", fontSize: 16, fontWeight: 600, marginRight: 4 }}>
                  <b>{String(endingTime.seconds).padStart(2, "0")}</b>s
                </span>
              </div>
            </Box>
          )}
        </>
      )} */}
      {/* {getMyAnswer() && (
        <Box mt={3} pt={3} display="flex" borderTop="1px solid #9EACF2" width={1}>
          <FaceIcon />
          <Box fontSize={18} fontWeight={400} ml="12px">
            You've already voted
          </Box>
        </Box>
      )}
      <Box className={classes.header1} mt={3} pt={3} display="flex" borderTop="1px solid #9EACF2" width={1}>
        <FlagIcon />
        <Box fontSize={14} fontWeight={800} ml="12px">
          {`${registeredVotes && registeredVotes.length > 0 ? registeredVotes.length : 0} votes registered`}
        </Box>
      </Box> */}
      <Box className={classes.header1} fontSize={14} fontWeight={800} mt={2}>
        View Result
      </Box>
    </Box>
  );
}, arePropsEqual);

export default PollItem;
