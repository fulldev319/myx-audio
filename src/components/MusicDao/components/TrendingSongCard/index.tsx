import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { Text } from '../ui-kit';
import { musicDaoPageStyles } from 'components/MusicDao/index.styles';
import Box from 'shared/ui-kit/Box';
import { Color, FontSize, PrimaryButton } from 'shared/ui-kit';
import { processImage } from 'shared/helpers';

const useStyles = makeStyles((theme) => ({
  container: {
    height: '100%',
    background: Color.White,
    boxShadow: '0px 15px 16px -11px rgba(0, 0, 0, 0.02)',
    borderRadius: 20,
    padding: '18px 14px',
    overflow: 'hidden',
    position: 'relative'
  },
  logoImage: {
    width: '100%',
    borderRadius: 20
  },
  rankingBox: {
    fontSize: 48,
    fontWeight: 700,
    color: 'white',
    position: 'absolute',
    left: theme.spacing(4),
    top: theme.spacing(4)
  }
}));

export default function TrendingSongCard({ data }) {
  const commonClasses = musicDaoPageStyles();
  const classes = useStyles();

  return (
    <Box display="flex" flexDirection="column" className={classes.container}>
      <Box className={classes.rankingBox}>{`#${data.index < 9 ? '0' : ''}${
        data.index + 1
      }`}</Box>
      <img
        className={classes.logoImage}
        src={processImage(data.image)}
        alt="trending"
      />
      <Text mt={2} size={FontSize.XL}>
        {data.title}
      </Text>
      <Text size={FontSize.L} color={Color.MusicDAOLightBlue}>
        {data.description}
      </Text>
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        mt={2}
      >
        <PrimaryButton
          size="medium"
          className={commonClasses.primaryButton}
          isRounded
        >
          CLAIM
        </PrimaryButton>
        <img
          src={require('assets/musicDAOImages/trending.webp')}
          alt="trending"
        />
      </Box>
    </Box>
  );
}
