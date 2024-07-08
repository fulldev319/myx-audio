import React, { useState } from 'react';
import {
  ContentType,
  Modal,
  PrimaryButton,
  SecondaryButton,
  Color
} from 'shared/ui-kit';
import Box from 'shared/ui-kit/Box';
import CustomButtonWithTooltip from 'shared/ui-kit/CustomButtonWithTooltip';
import { useGeneralTabStyles } from './index.styles';

const GeneralTab = (props: any) => {
  const classes = useGeneralTabStyles();

  return (
    <Box>
      <Box
        py={3}
        style={{
          fontWeight: 800,
          fontSize: 32,
          lineHeight: '130%',
          color: '#2D3047',
          textAlign: 'center'
        }}
      >
        Add New Song
      </Box>
      <Box mt={3} className={classes.flexBox}>
        <Box
          className={classes.whiteBox}
          flex={1}
          mr={1}
          onClick={() => {
            props.onClickeContentCreation(ContentType.SongSingleEdition);
          }}
        >
          <Box mt={1} className={classes.header1}>
            Create
          </Box>
          <Box className={classes.header2}>1/1 Song</Box>
          <Box className={classes.header3}>
            Create a single edition song and earn through striming or sales.
          </Box>
        </Box>
        <Box
          className={classes.whiteBox}
          flex={1}
          ml={1}
          onClick={() => {
            props.onClickeContentCreation(ContentType.SongMultiEdition);
          }}
        >
          <img
            src={require('assets/musicDAOImages/music_group.webp')}
            height="100px"
          />
          <Box className={classes.header1} mt={3}>
            Create
          </Box>
          <Box className={classes.header21}>Multiple Editions Song </Box>
          <Box className={classes.header3}>
            Generate multiple editions of song and allow buyers to collect them.
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default GeneralTab;
