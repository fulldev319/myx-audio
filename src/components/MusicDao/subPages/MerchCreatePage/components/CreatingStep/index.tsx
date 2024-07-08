import React, { useEffect, useState, useRef } from 'react';
import { useWeb3React } from '@web3-react/core';
import Web3 from 'web3';

import { useTheme } from '@material-ui/core';

import Box from 'shared/ui-kit/Box';
import { styles } from './index.styles';

const CreatingStep = ({
  curStep,
  status,
  handleGoStep
}: {
  curStep: any;
  status: any;
  handleGoStep: (step: number) => void;
}) => {
  const classes = styles({});
  const theme = useTheme();
  const [step, setStep] = useState<[]>(status);

  return (
    <div className={classes.stepBox}>
      {status?.map((item: any, index: number) => (
        <>
          <div className={classes.boxContainer}>
            <div className="statusIcon">
              {(curStep > item.step &&
                (item.completed ? <CompletedIcon /> : <FailedIcon />)) ||
                (curStep === status.length && item.completed && (
                  <CompletedIcon />
                ))}
            </div>
            <div
              className={`step ${
                curStep > item.step
                  ? item.completed
                    ? 'active finished'
                    : 'inactive finished'
                  : curStep === item.step
                  ? 'active'
                  : ''
              }`}
              onClick={() => handleGoStep(item.step)}
            >
              <div className="inside">{item.step}</div>
            </div>
            <div className="label">{item.label}</div>
          </div>
          <div
            className={`line ${item.step == status.length ? 'hidden' : ''}`}
          ></div>
        </>
      ))}
    </div>
  );
};

const CompletedIcon = () => (
  <svg
    width="11"
    height="8"
    viewBox="0 0 11 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.14288 2L4.14288 7L2 4.85713"
      stroke="#E9FF26"
      stroke-width="2"
      stroke-linecap="square"
      stroke-linejoin="round"
    />
  </svg>
);
const FailedIcon = () => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 10 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.14293 2.00002L2 8.14291M8.14296 8.14293L2.00007 2"
      stroke="#FF6868"
      stroke-width="2"
      stroke-linecap="square"
      stroke-linejoin="round"
    />
  </svg>
);

export default CreatingStep;
