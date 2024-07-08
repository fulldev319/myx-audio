import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import MusicDaoRouter from './MusicDaoRouter';
import { useTypedSelector } from 'store/reducers/Reducer';
import { getUser } from 'store/selectors';
import ActivateAccount from './subPages/ActivateAccount';

import URL from 'shared/functions/getURL';
import Header from 'shared/ui-kit/Header/Header';
import HomePageSimplified from './subPages/HomePageSimplified';
import MaintainenceContext from 'shared/contexts/MaintainenceContext';

import { musicDaoPageStyles } from './index.styles';

export default function MusicDao() {
  const classes = musicDaoPageStyles();

  const userSelector = useTypedSelector(getUser);
  const history = useHistory();

  const [needsActivated, setNeedsActivated] = useState<boolean>(false);
  const [isOnMaintenance, setIsOnMaintenance] = useState<boolean>(false);
  const [maintenceTime, setMaintenaceTime] = useState<any>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isHeader, setIsHeader] = useState<boolean>(false);

  useEffect(() => {
    if (
      history.location.pathname.includes('#/player') ||
      location.href.includes('#/player') ||
      history.location.pathname.includes('#/land') ||
      location.href.includes('#/land')
    ) {
      setIsHeader(true);
    } else {
      setIsHeader(false);
    }
  }, [history.location.pathname, location.href]);

  useEffect(() => {
    if (userSelector.ArtistId && !userSelector?.urlIpfsImage) {
      setNeedsActivated(true);
    } else {
      setNeedsActivated(false);
    }
  }, [userSelector]);

  useEffect(() => {
    let timerId;
    const checkMaintenance = async () => {
      const res = await axios.get(`${URL()}/maintenance/getAppStatus/Myx`);
      if (res.data.success) {
        if (res.data.data.status) {
          if (res.data.data.endTime) {
            timerId = setInterval(() => {
              const now = new Date();
              let delta = Math.floor(
                (res.data.data.endTime - now.getTime()) / 1000
              );
              if (delta < 0) {
                setIsOnMaintenance(false);
                setMaintenaceTime({
                  days: 0,
                  hours: 0,
                  minutes: 0,
                  seconds: 0
                });
                clearInterval(timerId);
              } else {
                setIsOnMaintenance(true);
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
                setMaintenaceTime({
                  days,
                  hours,
                  minutes,
                  seconds
                });
              }
            }, 1000);
          }
        }
      }
    };

    checkMaintenance();
    return () => timerId && clearInterval(timerId);
  }, []);

  return (
    <MaintainenceContext.Provider
      value={{
        isOnMaintenance,
        setIsOnMaintenance
      }}
    >
      <div className={classes.musicDao}>
        {!isHeader && !needsActivated && (
          <Header isOnMaintenance={isOnMaintenance} />
        )}
        {isOnMaintenance && (
          <div className={classes.warningBox}>
            <div className={classes.warningIcon}>
              <WarningIcon />
            </div>
            <div className={classes.warning}>
              {`Scheduled maintenance in progress. Estimated time left ${
                maintenceTime.days ? maintenceTime.days + 'days ' : ''
              }${maintenceTime.hours ? maintenceTime.hours + 'h ' : ''}${
                maintenceTime.minutes ? maintenceTime.minutes + 'm ' : ''
              }${maintenceTime.seconds ? maintenceTime.seconds + 's' : ''}`}
            </div>
          </div>
        )}
        <div
          className={`${classes.mainContainer} ${
            isHeader && classes.fitContainer
          }`}
        >
          <div className={classes.content} id="scrollContainer">
            {needsActivated ? (
              <ActivateAccount />
            ) : isOnMaintenance ? (
              <HomePageSimplified />
            ) : (
              <MusicDaoRouter />
            )}
          </div>
        </div>
      </div>
    </MaintainenceContext.Provider>
  );
}

const WarningIcon = () => (
  <svg
    width="26"
    height="26"
    viewBox="0 0 26 26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M25.3984 11.5L14.5 0.601563C13.6992 -0.199219 12.3008 -0.199219 11.5 0.601563L0.601563 11.5C-0.199219 12.3008 -0.199219 13.6992 0.601563 14.5L11.5 25.3984C12.3008 26.1992 13.6992 26.1992 14.5 25.3984L25.3984 14.5C26.1992 13.6992 26.1992 12.3008 25.3984 11.5ZM14.1016 18.6016C13.8008 18.8984 13.3984 19 13 19C12.6016 19 12.1992 18.8984 11.8984 18.6016C11.6016 18.3008 11.5 18 11.5 17.5C11.5 17.1016 11.6016 16.6992 11.8984 16.3984C12.1992 16.1016 12.6016 16 13 16C13.3984 16 13.8008 16.1016 14.1016 16.3984C14.3984 16.6992 14.5 17.1016 14.5 17.5C14.5 17.8984 14.3984 18.3008 14.1016 18.6016ZM13.8008 14H12.3008C12.1016 11.6992 11.3984 9.19922 11.3984 8.69922C11.3984 8.19922 11.6016 7.80078 11.8984 7.5C12.1016 7.19922 12.5 7 13 7C13.5 7 13.8984 7.19922 14.1992 7.5C14.5 7.80078 14.6992 8.19922 14.6992 8.69922C14.6016 9.19922 14 11.6992 13.8008 14Z"
      fill="url(#paint0_linear_7184_27)"
    />
    <defs>
      <linearGradient
        id="paint0_linear_7184_27"
        x1="13"
        y1="0.000976562"
        x2="13"
        y2="25.999"
        gradientUnits="userSpaceOnUse"
      >
        <stop />
        <stop offset="1" stop-opacity="0.22" />
      </linearGradient>
    </defs>
  </svg>
);
