import React, { useState, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import Box from 'shared/ui-kit/Box';
import { useTypedSelector } from 'store/reducers/Reducer';
import { getUser } from 'store/selectors';
import {
  RectangleCheckedIcon,
  TimerIcon,
  RectangleUncheckedStrokeIcon
} from '../../Icons/SvgIcons';
import { voteCardStyles } from './index.styles';

export default function VoteCard({ item, podId }) {
  const classes = voteCardStyles();
  const history = useHistory();
  const user = useTypedSelector(getUser);
  const [endingTime, setEndingTime] = useState<any>({});
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const possibleAnswers = useMemo(
    () => item.possibleAnswers?.filter((answer) => answer),
    [item.possibleAnswers]
  );

  const getMyAnswer = () => {
    return item.votes?.find((vote) => vote.userAddress === user.id)?.answer;
  };

  useEffect(() => {
    const timerId = setInterval(() => {
      const now = new Date();
      let delta = Math.floor((item.endDate - now.getTime()) / 1000);
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

  const handleVoteDetails = () => {
    history.push(`/governance/votes/${podId}/${item.id}`);
  };

  const isClosed = !(
    new Date(item.startDate).getTime() <= new Date().getTime() &&
    new Date(item.endDate).getTime() > new Date().getTime()
  );

  return (
    <Box className={classes.card}>
      <Box className={classes.content}>
        <Box
          color="#2D3047"
          fontSize={18}
          fontWeight={600}
          onClick={handleVoteDetails}
        >
          {item.question}
        </Box>
        <Box
          color="#2D3047"
          fontSize={13}
          fontWeight={500}
          mt={2}
          mb={2}
          style={{ opacity: 0.7 }}
          onClick={handleVoteDetails}
        >
          {item.description}
        </Box>
        <Box>
          {possibleAnswers.map((answer, idx) => (
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              borderBottom={
                idx < possibleAnswers.length - 1
                  ? '1px solid #35385622'
                  : 'none'
              }
              paddingBottom={idx < possibleAnswers.length - 1 ? '10px' : 0}
              marginTop={idx > 0 ? '12px' : 0}
              key={idx}
            >
              {!isClosed &&
                (getMyAnswer() ? (
                  getMyAnswer === answer ? (
                    <Box style={{ marginRight: 15 }}>
                      <RectangleCheckedIcon />
                    </Box>
                  ) : (
                    <Box style={{ marginRight: 15 }}>
                      <RectangleUncheckedStrokeIcon />
                    </Box>
                  )
                ) : (
                  <>
                    {answer === selectedAnswer ? (
                      <Box
                        style={{ marginRight: 15 }}
                        onClick={() => setSelectedAnswer(answer)}
                      >
                        <RectangleCheckedIcon />
                      </Box>
                    ) : (
                      <Box
                        style={{ marginRight: 15 }}
                        onClick={() => setSelectedAnswer(answer)}
                      >
                        <RectangleUncheckedStrokeIcon />
                      </Box>
                    )}
                  </>
                ))}
              <Box>
                <span
                  style={{ color: '#2D3047', fontSize: 14, fontWeight: 600 }}
                >
                  {answer}
                </span>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
      <Box className={classes.footer} mt={4} onClick={handleVoteDetails}>
        {!getMyAnswer() ? (
          <>
            {item.endDate &&
              new Date(item.endDate).getTime() > new Date().getTime() && (
                <Box display="flex" justifyContent="center">
                  <button
                    style={{
                      position: 'absolute',
                      width: 222,
                      backgroundColor: '#65CB63',
                      borderRadius: 46,

                      fontSize: 14,
                      fontWeight: 600,
                      bottom: 60,
                      top: -20
                    }}
                  >
                    Vote
                  </button>
                </Box>
              )}
            {/* <Box display="flex" justifyContent="center">
              <Box display="flex" flexDirection="row">
                <span style={{ color: "#65CB63", fontSize: 14, fontWeight: 500 }}>
                  {item.currentNumberOfVotes} votes
                </span>
                <span style={{ color: "#2D3047", fontSize: 14, fontWeight: 500, marginLeft: 5 }}>
                  of {item.voteRequired} required
                </span>
              </Box>
            </Box> */}
          </>
        ) : (
          <Box display="flex" flexDirection="column">
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box
                color="#2D3047"
                fontSize={14}
                fontWeight={500}
                lineHeight="18px"
              >
                You voted
              </Box>
              {/* <Box display="flex" flexDirection="row">
                <span style={{ color: "#65CB63", fontSize: 14, fontWeight: 500 }}>
                  {item.currentNumberOfVotes} votes
                </span>
                <span style={{ color: "#2D3047", fontSize: 14, fontWeight: 500, marginLeft: 3 }}>
                  of {item.voteRequired} required
                </span>
              </Box> */}
            </Box>
          </Box>
        )}
        {item &&
        new Date(item.startDate).getTime() <= new Date().getTime() &&
        new Date(item.endDate).getTime() > new Date().getTime() ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            mt={2}
          >
            <TimerIcon />
            <Box style={{ paddingTop: 4, marginLeft: 13 }}>
              <span
                style={{
                  color: '#2D3047',
                  fontSize: 16,
                  fontWeight: 400,
                  marginRight: 6
                }}
              >
                Time left
              </span>
              <span>
                {endingTime.days > 0 && (
                  <span
                    style={{
                      color: '#2D3047',
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
                      color: '#2D3047',
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
                      color: '#2D3047',
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
                    color: '#2D3047',
                    fontSize: 16,
                    fontWeight: 600,
                    marginRight: 4
                  }}
                >
                  <b>{String(endingTime.seconds).padStart(2, '0')}</b>s
                </span>
              </span>
            </Box>
          </Box>
        ) : (
          <Box display="flex" justifyContent="center">
            <Box display="flex" flexDirection="row">
              <span
                style={{
                  color: '#2D3047',
                  fontSize: 14,
                  fontWeight: 500,
                  marginLeft: 5
                }}
              >
                Ended
              </span>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
