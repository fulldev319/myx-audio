import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

export const feedBopModalStyles = makeStyles((theme) => ({
  root: {
    width: '680px !important'
  },
  contentBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: '0px 5px 22px'
  },
  flexBox: {
    display: 'flex',
    alignItems: 'center'
  },
  title: {
    fontSize: 22,
    fontWeight: 800,
    color: '#2D3047',
    lineHeight: '130%',

    marginTop: -40
  },
  subTitle: {
    fontSize: 16,
    fontWeight: 500,
    color: '#54658F',
    lineHeight: '150%',

    marginTop: 8
  },
  shareSection: {
    background: '#ffffff',
    borderRadius: 30,
    width: '100%',
    height: 125,
    padding: '35px 80px',
    marginTop: 36,
    border: '1px solid #DAE6E5',
    display: 'flex',
    justifyContent: 'space-between'
  },
  confirmBtn: {
    marginTop: 50,
    cursor: 'pointer'
  }
}));

export const DoneIcon = () => (
  <svg
    width="344"
    height="70"
    viewBox="0 0 344 70"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0 21.7224C0 14.7347 5.31938 8.90978 12.2842 8.34442C40.4709 6.0564 111.986 0.779297 172 0.779297C232.014 0.779297 303.529 6.0564 331.716 8.34442C338.681 8.90978 344 14.7347 344 21.7224V46.8978C344 53.8219 338.795 59.6133 331.901 60.255C303.472 62.9009 230.408 69.1233 172 69.1233C113.592 69.1233 40.5281 62.9009 12.0989 60.255C5.20458 59.6133 0 53.8219 0 46.8978V21.7224Z"
      fill="#2D3047"
    />
    <path
      d="M149.699 39.0352H154.343C158.393 39.0352 160.661 36.7492 160.661 32.6452C160.661 28.5412 158.411 26.2552 154.343 26.2552H149.699V39.0352ZM152.273 36.8752V28.3972H154.325C156.719 28.3972 158.051 29.9092 158.051 32.6452C158.051 35.3812 156.719 36.8752 154.325 36.8752H152.273ZM167.927 39.4312C171.761 39.4312 174.281 36.7312 174.281 32.6452C174.281 28.5412 171.761 25.8592 167.927 25.8592C164.075 25.8592 161.555 28.5412 161.555 32.6452C161.555 36.7492 164.075 39.4312 167.927 39.4312ZM167.927 37.1812C165.659 37.1812 164.183 35.3812 164.183 32.6452C164.183 29.9092 165.659 28.1092 167.927 28.1092C170.195 28.1092 171.671 29.9092 171.671 32.6452C171.671 35.3812 170.195 37.1812 167.927 37.1812ZM175.61 39.0352H178.094V29.4772H178.13L182.72 39.0352H186.014V26.2552H183.53V35.8312H183.494L178.922 26.2552H175.61V39.0352ZM187.758 39.0352H195.84V36.8752H190.296V33.4372H194.94V31.5112H190.296V28.3972H195.66V26.2552H187.758V39.0352Z"
      fill="white"
    />
  </svg>
);
