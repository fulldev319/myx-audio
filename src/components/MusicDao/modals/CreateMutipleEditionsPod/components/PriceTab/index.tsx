import React from 'react';
import { Color } from 'shared/ui-kit';

import Box from 'shared/ui-kit/Box';
import InputWithLabelAndTooltip from 'shared/ui-kit/InputWithLabelAndTooltip';

export default function PriceTab({ songData, setSongData }) {
  return (
    <div style={{ color: '#2D3047' }}>
      <Box>
        <InputWithLabelAndTooltip
          style={{
            height: 100,
            fontSize: 32,
            fontWeight: 'bold',
            color: Color.MusicDAOBlue
          }}
          labelName="Set your price of NFT"
          // labelSuffix="*"
          placeHolder="00.00"
          endAdornment="USDT"
          inputValue={songData.price}
          onInputValueChange={(value) => {
            setSongData({
              ...songData,
              price: value
            });
          }}
          type="euro-number"
          referenceValue="object"
          theme="music dao"
          // tooltip="This is the percentage earned every time your Track NFT is sold on an NFT marketplace, like OpenSea"
        />
      </Box>
    </div>
  );
}
