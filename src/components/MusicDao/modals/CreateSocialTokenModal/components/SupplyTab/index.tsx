import React from 'react';
import Box from 'shared/ui-kit/Box';
import InputWithLabelAndTooltip from 'shared/ui-kit/InputWithLabelAndTooltip';

export default function CreateSocialTokenSupplyTab({
  socialToken,
  setSocialToken
}) {
  return (
    <>
      <div>
        <Box mb={2}>
          <InputWithLabelAndTooltip
            labelName="What would be the initial supply?"
            inputValue={socialToken.InitialSupply}
            onInputValueChange={(e) => {
              setSocialToken({
                ...socialToken,
                InitialSupply: e.target?.value
              });
            }}
            type="number"
            theme="music dao"
          />
        </Box>
        <Box mb={2}>
          <InputWithLabelAndTooltip
            labelName="What would be the total supply?"
            inputValue={socialToken.TargetSupply}
            onInputValueChange={(e) => {
              setSocialToken({ ...socialToken, TargetSupply: e.target?.value });
            }}
            type="number"
            theme="music dao"
          />
        </Box>
        <Box mb={2}>
          <InputWithLabelAndTooltip
            labelName="Token allocation for airdrops/vesting"
            inputValue={socialToken.TargetPrice}
            onInputValueChange={(e) => {
              setSocialToken({ ...socialToken, TargetPrice: e.target?.value });
            }}
            type="number"
            theme="music dao"
          />
        </Box>
        <InputWithLabelAndTooltip
          labelName="Taxation fee"
          // tooltip=""
          inputValue={socialToken.TradingSpread}
          onInputValueChange={(e) => {
            setSocialToken({ ...socialToken, TradingSpread: e.target?.value });
          }}
          type="number"
          theme="music dao"
        />
      </div>
    </>
  );
}
