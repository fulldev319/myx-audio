import React from 'react';

import makeStyles from '@material-ui/core/styles/makeStyles';

export const ownersStyles = makeStyles((theme) => ({
  ownersPane: {
    background: `url(${require('assets/planets/background.webp')})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: 623,
    //'linear-gradient(0deg, rgba(119, 250, 117, 0.4), rgba(119, 250, 117, 0.4)), url(pexels-photo-2469122.jpg), #FFFFFF',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    borderRadius: theme.spacing(2),
    padding: theme.spacing(2),
    textAlign: 'center',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.down('xs')]: {
      minHeight: 350
    }
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    lineHeight: '29px',
    color: 'white'
  },
  ownerCard: {
    background:
      'linear-gradient(88.38deg, #4434FF 7.67%, #2B99FF 102.5%), linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)',
    padding: theme.spacing(0.5),
    borderRadius: theme.spacing(2)
  },
  ownerName: {
    fontSize: 22,
    fontWeight: 700,
    lineHeight: '33px',
    color: 'white',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    cursor: 'pointer'
  },
  socialBox: {
    background: 'white',
    padding: theme.spacing(0.5),
    borderRadius: theme.spacing(1),
    display: 'flex',
    width: 'fit-content',
    '& > div:not(:last-child)': {
      marginRight: theme.spacing(1)
    }
  },
  socialButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    '& > img': {
      width: '20px',
      height: '20px'
    }
  },
  ownerValueBox: {
    background: 'white',
    padding: theme.spacing(2),
    borderBottomLeftRadius: theme.spacing(2),
    borderBottomRightRadius: theme.spacing(2)
  },
  ownerLabel: {
    fontSize: 16,
    fontWeight: 500,
    lineHeight: '24px',
    color: '#0D59EE'
  },
  ownerValue: {
    fontSize: 24,
    fontWeight: 600,
    lineHeight: '36px',
    color: 'black'
  },
  polygon: {
    clipPath: 'polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);',
    width: 32,
    height: 32
  },
  offerName: {
    fontSize: 14,
    fontWeight: 500,
    lineHeight: '18px',
    color: '#181818',
    minWidth: 140,
    maxWidth: 150,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textAlign: 'left'
  },
  offerValue: {
    fontSize: 14,
    fontWeight: 600,
    lineHeight: '19.5px',
    color: '#2D3047'
  },
  whiteBox: {
    background: 'white',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    padding: '25px 22px',
    textAlign: 'center',
    borderRadius: theme.spacing(2),
    border: '1px solid #DAE6E5'
  },
  offerTitle: {
    fontSize: 16,
    fontWeight: 800,
    color: '#2D3047'
  },
  offerTable: {
    marginTop: 20,
    maxHeight: '100%',
    minHeight: 200,
    overflow: 'auto'
  },
  '@keyframes rotating': {
    from: {
      WebkitTransform: 'rotate(0deg)'
    },
    to: {
      WebkitTransform: 'rotate(360deg)'
    }
  },
  '@-webkit-keyframes rotating': {
    from: {
      WebkitTransform: 'rotate(0deg)'
    },
    to: {
      WebkitTransform: 'rotate(360deg)'
    }
  },
  '@-moz-keyframes rotating': {
    from: {
      WebkitTransform: 'rotate(0deg)'
    },
    to: {
      WebkitTransform: 'rotate(360deg)'
    }
  },
  planetsPane: {
    position: 'relative',
    WebkitAnimation: '$rotating 25s linear infinite',
    animation: '$rotating 25s linear infinite',
    MozAnimation: '$rotating 25s linear infinite'
  },
  planet: {
    '&:hover': {
      transform: 'scale(1.2)'
    }
  },
  editionBall: {
    width: 32,
    height: 32,
    borderRadius: '100vh',
    border: '2px solid #FFFFFF',
    filter: 'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.15))',
    marginRight: 16,
    cursor: 'pointer'
  }
}));
