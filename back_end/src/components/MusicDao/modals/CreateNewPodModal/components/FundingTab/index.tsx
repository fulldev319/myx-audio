import React from 'react';
import axios from 'axios';

import InputBase from '@material-ui/core/InputBase';
import Grid from '@material-ui/core/Grid';

import URL from 'shared/functions/getURL';
import Box from 'shared/ui-kit/Box';
import { TokenSelect } from 'shared/ui-kit/Select/TokenSelect';
import { createPodModalStyles } from '../../index.styles';
import { fundingTabStyles } from './index.styles';

const FundingTab = ({ pod, setPod }) => {
  const classes = fundingTabStyles();
  const modalClasses = createPodModalStyles();
  const [tokens, setTokens] = React.useState<any[]>([]);

  // get token list from backend
  React.useEffect(() => {
    axios.get(`${URL()}/wallet/getCryptosRateAsList`).then((res) => {
      const resp = res.data;
      if (resp.success) {
        setTokens(
          resp.data.reduce((result, obj) => {
            if (obj.token === 'USDT')
              result.push({ token: obj.token, name: obj.token });
            return result;
          }, [])
        ); // update token list
        if (!pod.Token) {
          setPod({ ...pod, Token: resp.data[0].token });
        }
      }
    });
  }, []);

  // const handleLater = () => {
  //   setPod({ ...pod, IsTokenAddLater: !pod.IsTokenAddLater });
  // };

  return (
    <div style={{ position: 'relative' }}>
      {/* <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        className={classes.withFundingSection}
        mb={2}
      >
        <Box>
          <Box className={modalClasses.subTitle}>Create POD with Funding</Box>
          <Box className={classes.grayLabel} mt={1}>
            {pod.WithFunding ?
              "Turn your fans into your investors. Pods are fundraisable, meaning you can sell ownership of the music you put in this Capsule. So when songs are streamed on Myx or NFTs are sold, owners of this Capsule earn."
              : "If you do not want to fundraise. You can simply add collaborators, whether they are other artists, labels, etc, divide ownership, add music, and self-govern. All owners of the Capsule share in revenues from streaming on Myx and NFT sales."}
          </Box>
        </Box>
        <Box display="flex" alignItems="center">
          <Box mr={1}>{pod.WithFunding ? "Yes" : "No"}</Box>
          <CustomSwitch
            checked={pod.WithFunding}
            theme="music dao"
            onChange={() => {
              setPod({ ...pod, WithFunding: !pod.WithFunding });
            }}
          />
        </Box>
      </Box> */}
      {/* {pod.WithFunding && (
        <> */}
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Box className={modalClasses.subTitle} mb={1}>
            Select the Token
          </Box>
          <TokenSelect
            tokens={tokens}
            value={pod.Token}
            // className={classes.tokenSelect}
            onChange={(e) => {
              setPod({ ...pod, Token: e.target.value });
            }}
            disabled={pod.IsTokenAddLater}
          />
          {/* <InputBase
            className={classes.input}
            value={pod.Token}
            startAdornment={
              <InputAdornment position="start">
                <img width={26} src={require("assets/tokenImages/USDT.webp")} alt="token" />
              </InputAdornment>
            }
            autoFocus
            placeholder="01"
            disabled={pod.IsTokenAddLater}
          /> */}
        </Grid>
        <Grid item sm={12}>
          <Box className={modalClasses.subTitle} mb={1}>
            How much do you want to raise?
          </Box>
          <InputBase
            className={classes.input}
            value={pod.RaiseValue || ''}
            onChange={(event) => {
              if (
                event.target.value.startsWith('-') ||
                event.target.value.startsWith('+')
              ) {
                event.preventDefault();
                return;
              }
              setPod({
                ...pod,
                RaiseValue: event.target.value,
                IsTokenAddLater: false
              });
            }}
            autoFocus
            placeholder="00"
            disabled={pod.IsTokenAddLater}
            type="number"
            inputProps={{
              min: 0
            }}
          />
        </Grid>
      </Grid>
      {/* <Box className={modalClasses.radio} mt={7}>
            <FormControlLabel
              control={<Radio checked={pod.IsTokenAddLater || false} onClick={handleLater} disableRipple />}
              label="I will add it later"
            />
          </Box>
          <Box display="flex" mt={7} alignItems="center" justifyContent="center" flexWrap="wrap">
            <Box className={modalClasses.alertTypo}>
              You will customize your raise at a later stage of the Capsule.{" "}
            </Box>
            &nbsp;&nbsp;
            <span>Learn more</span>
            &nbsp;&nbsp;
            <Tooltip
              TransitionComponent={Fade}
              TransitionProps={{ timeout: 600 }}
              arrow
              title={
                "A Capsule is a fundraising vehicle for your artist assets. You can receive investment in stable coin or popular crypto assets from your fans by selling media fractions of this Capsule you are creating, these tokens hold rights to different kinds of revenues. IMPORTANT: you can raise alone, as a single Pod owner, if you are the sole owner of your music assets"
              }
              classes={{ popper: classes.myTooltip }}
            >
              <InfoIcon />
            </Tooltip>
          </Box> */}
      {/* </>
      )} */}
    </div>
  );
};

export default FundingTab;
