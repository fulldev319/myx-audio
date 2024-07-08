import React from 'react';

import FormControl from '@material-ui/core/FormControl';

import {
  StyledSelect,
  StyledMenuItem
} from 'shared/ui-kit/Styled-components/StyledComponents';
import { chainSelectorStyles } from './index.styles';

const ChainSelector = ({ network, setNetwork, BlockchainNets }) => {
  const classes = chainSelectorStyles();

  return (
    <>
      <FormControl style={{ width: '100%' }}>
        <StyledSelect
          className={classes.root}
          value={network}
          onChange={(v) => setNetwork(v.target.value)}
          renderValue={() => (
            <div
              style={{
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {network &&
                BlockchainNets.find(
                  (blockChainNet) => blockChainNet['name'] === network
                ) && (
                  <img
                    src={require(`assets/tokenImages/${
                      network.includes('ETH') ? 'ETH' : network
                    }.webp`)}
                    className={classes.icon}
                  />
                )}
              {network}
            </div>
          )}
        >
          {BlockchainNets.filter((item) => item.name !== 'MUSIC').map(
            (item, index) => (
              <StyledMenuItem key={index} value={item['name']}>
                {item['name']}
              </StyledMenuItem>
            )
          )}
        </StyledSelect>
      </FormControl>
    </>
  );
};

export default ChainSelector;
