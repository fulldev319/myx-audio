import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

export const exchangeModalStyles = makeStyles((theme) => ({
  root: {
    width: '680px !important'
  },
  contentBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: '25px 5px 22px'
  },
  flexBox: {
    display: 'flex',
    alignItems: 'center'
  },
  title: {
    fontSize: 22,
    fontWeight: 800,
    color: '#2D3047',
    lineHeight: '130%'
  },
  shareSection: {
    background: '#F2FBF6',
    borderRadius: 12,
    width: '100%',
    height: 125,
    paddingTop: 26,
    marginTop: 33,
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    marginBottom: 95
  },
  sharePercentageSection: {
    fontSize: 12,
    fontWeight: 700,
    color: '#00D13B',
    marginLeft: 9,
    background: 'rgba(0, 209, 59, 0.09)',
    borderRadius: 15,
    padding: '2.5px 7.5px 2.5px 8.5px',
    '& span': {
      marginLeft: 3
    }
  },
  traxpAmountSection: {
    background: 'rgba(218, 230, 229, 0.4)',
    border: '1px solid #7BCBB7',
    borderRadius: 55,
    height: 50,
    width: 344,
    padding: '0 21px',
    fontSize: 16,
    fontWeight: 400,
    color: '#181818',
    display: 'flex',
    alignItems: 'center'
  },
  totalCostSection: {
    border: '1px solid #707582',
    borderRadius: 55,
    height: 50,
    width: 238,
    padding: '0 21px',
    fontSize: 28,
    fontWeight: 700,
    color: '#2D3047',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  blockchainNetSection: {
    width: '100%',
    height: 57,
    background: 'linear-gradient(0deg, #FFFFFF, #FFFFFF), #17172D',
    borderRadius: '45px !important',
    border: '1px solid #DEE7DA',
    '& .MuiInputBase-root': {
      border: 'unset',
      backgroundColor: 'unset'
    },
    '& img': {
      width: '36px !important',
      height: '36px !important'
    }
  },
  connectWalletBtn: {
    height: 59,
    width: 352,
    background: '#2D3047',
    borderRadius: 48,
    fontSize: 18,
    fontWeight: 700,
    color: '#ffffff',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 48
  }
}));

export const UpArrowIcon = () => (
  <svg
    width="7"
    height="9"
    viewBox="0 0 7 9"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3.88841 0.645921C3.87701 0.63558 3.86625 0.626389 3.85485 0.618345C3.84915 0.61375 3.84282 0.609728 3.83649 0.605132C3.83332 0.602834 3.83079 0.60111 3.82699 0.598812C3.7358 0.536767 3.62245 0.5 3.4996 0.5C3.37676 0.5 3.26404 0.536767 3.17222 0.598812C3.16842 0.601685 3.16399 0.603983 3.16019 0.60743C3.15512 0.610877 3.15006 0.614324 3.14499 0.618345C3.13359 0.626963 3.12156 0.636153 3.11016 0.647068L0.661475 2.86752C0.446175 3.06284 0.446175 3.37939 0.661475 3.57471C0.876775 3.77003 1.2257 3.77003 1.441 3.57471L2.94877 2.20685L2.94877 8.0002C2.94877 8.27653 3.19573 8.5 3.49968 8.5C3.80427 8.5 4.0506 8.27653 4.0506 8.0002L4.0506 2.20744L5.55837 3.5753C5.77366 3.77062 6.12259 3.77062 6.33853 3.5753C6.55382 3.37998 6.55382 3.06343 6.33853 2.8681L3.89032 0.647068L3.88841 0.645921Z"
      fill="#00D13B"
      stroke="#00D13B"
      strokeWidth="0.5"
    />
  </svg>
);
