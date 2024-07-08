import React, { useEffect, useState } from 'react';

import Box from 'shared/ui-kit/Box';
import { roundFloat } from 'shared/helpers/number';
import { tokenomicsTabStyles } from './index.styles';

const TokenomicsTab = (props: any) => {
  const { proposal } = props;
  const classes = tokenomicsTabStyles();

  return (
    <div className={classes.tokenomicsTab}>
      <Box className={classes.typo2} mb={5}>
        Tokenomics
      </Box>
      <Box className={classes.infoSection} mb={10}>
        <Box
          display={'flex'}
          alignItems={'center'}
          justifyContent="space-around"
        >
          <Box display={'flex'} flexDirection={'column'}>
            <Box className={classes.typo3}>Media Fraction Name</Box>
            <Box className={classes.typo4} mt={1}>
              {proposal.tokenName}
            </Box>
          </Box>
          <Box width={'1px'} height={'46px'} bgcolor="#35385620" />
          <Box display={'flex'} flexDirection={'column'}>
            <Box className={classes.typo3}>Symbol</Box>
            <Box className={classes.typo4} mt={1}>
              {proposal.tokenSymbol}
            </Box>
          </Box>
        </Box>
        <Box width={1} height={'1px'} bgcolor="#35385620" mt={8} mb={6.5} />
        <Box
          display={'flex'}
          alignItems={'center'}
          justifyContent={'space-around'}
        >
          <Box display={'flex'} flexDirection={'column'}>
            <Box className={classes.typo5}>Total Supply</Box>
            <Box className={classes.typo6} mt={1}>
              {roundFloat(Number(proposal.copyrightTokenSupply), 4)}&nbsp;
              {proposal.tokenSymbol}
            </Box>
          </Box>
          <Box width={'1px'} height={'46px'} bgcolor="#35385620" />
          <Box display={'flex'} flexDirection={'column'}>
            <Box className={classes.typo5}>Royalty Share</Box>
            <Box className={classes.typo6} mt={1}>
              {proposal.royaltyPercentage
                ? `${proposal.royaltyPercentage} %`
                : 'Not set'}
            </Box>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default TokenomicsTab;
