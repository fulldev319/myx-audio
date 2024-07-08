import React from 'react';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';

import Box from 'shared/ui-kit/Box';
import { Color, FontSize, PrimaryButton, StyledDivider } from 'shared/ui-kit';
import { Text } from '../ui-kit';
import { musicDaoPageStyles } from 'components/MusicDao/index.styles';

const useStyles = makeStyles(() => ({
  container: {
    background: Color.White,
    boxShadow: '0px 8px 25px -3px rgba(0, 0, 0, 0.08)',
    borderRadius: 20,
    padding: '33px 27px 19px 27px'
  },
  moreButton: {
    marginTop: 18,
    background: '#2D3047',
    borderRadius: '48px !important',
    height: '43px !important',
    width: '147px !important'
  }
}));

const PoolCard = ({ data, handleMore }) => {
  const classes = useStyles();
  const commonClasses = musicDaoPageStyles();

  return (
    <Box className={classes.container}>
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        position="relative"
      >
        <Box position="absolute" left={0}>
          <img
            src={require(`assets/tokenImages/${data.Token}.webp`)}
            width="38"
            alt="token"
          />
        </Box>
        <Text size={FontSize.XL} bold mr={2}>
          {data.Token} Pool
        </Text>
      </Box>
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        mt={4}
      >
        <Text color={Color.MusicDAOLightBlue} bold>
          Apr
        </Text>
        <Text size={FontSize.XL} bold>
          {data.APR}%
        </Text>
      </Box>
      <StyledDivider type="solid" margin={1} />
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Text color={Color.MusicDAOLightBlue} bold>
          Volume
        </Text>
        <Text size={FontSize.XL} bold>
          $ {data.Volume}%
        </Text>
      </Box>
      <StyledDivider type="solid" margin={1} />
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Text color={Color.MusicDAOLightBlue} bold>
          Luquidity
        </Text>
        <Text size={FontSize.XL} bold>
          $ {data.Luquidity}%
        </Text>
      </Box>
      <StyledDivider type="solid" mt={1} mb={2} />
      <Text color={Color.MusicDAOLightBlue} bold>
        Liquidity to borrow
      </Text>
      <img
        src={require('assets/musicDAOImages/graph.webp')}
        width="100%"
        alt="graph"
      />
      <StyledDivider type="solid" margin={1} />
      <Box display="flex" flexDirection="row" justifyContent="center">
        <PrimaryButton
          size="medium"
          className={classnames(
            commonClasses.primaryButton,
            classes.moreButton
          )}
          onClick={handleMore}
        >
          More
        </PrimaryButton>
      </Box>
    </Box>
  );
};

export default PoolCard;
