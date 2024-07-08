import React, { useEffect, useState } from 'react';
import DateFnsUtils from '@date-io/date-fns';

import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';
import Tooltip from '@material-ui/core/Tooltip';
import SvgIcon from '@material-ui/core/SvgIcon';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from '@material-ui/pickers';

import { TokenSelect } from 'shared/ui-kit/Select/TokenSelect';
import InputWithLabelAndTooltip from 'shared/ui-kit/InputWithLabelAndTooltip';
import Box from 'shared/ui-kit/Box';
import useIPFS from 'shared/utils-IPFS/useIPFS';
import getIPFSURL from 'shared/functions/getIPFSURL';
import { tokenomicsTabStyles } from './index.styles';

import { ReactComponent as CheckCircleRegular } from 'assets/icons/check-circle-regular.svg';
import { ReactComponent as CheckCircleSolid } from 'assets/icons/check-circle-solid.svg';
import CustomSwitch from 'shared/ui-kit/CustomSwitch';
const infoIcon = require('assets/icons/info_music_dao.webp');
const calendarIcon = require('assets/icons/calendar_icon.webp');

const TokenomicsTab = (props: any) => {
  const classes = tokenomicsTabStyles();
  const [isCreator, setIsCreator] = useState<boolean>(false);
  const { setMultiAddr } = useIPFS();
  const pickerMinDate = new Date().setTime(
    new Date().getTime() + 60 * 60 * 1000
  );

  useEffect(() => {
    setMultiAddr(`${getIPFSURL()}/api/v0`);
  }, []);

  useEffect(() => {
    if (props.tokenObjList && props.tokenObjList.length > 0) {
      props.setPod((prev) => ({
        ...prev,
        InvestmentToken: 'USDT',
        FundingToken: 'USDT'
      }));
    }
  }, [props.tokenObjList]);

  useEffect(() => {
    if (props.isCreator !== undefined) {
      setIsCreator(props.isCreator);
    }
  }, [props.isCreator]);

  useEffect(() => {
    if (pickerMinDate >= props.pod?.FundingDate * 1000) {
      props.setPod((prev) => ({
        ...prev,
        FundingDate: Math.floor(pickerMinDate / 1000) + 3600
      }));
    }
  }, [pickerMinDate, props.pod?.FundingDate]);

  const handleChangeTokenSelector = (e) => {
    props.setPod((prev) => ({ ...prev, FundingToken: e.target.value }));
  };

  const ValidatedField = (propsFunction: any) => {
    return (
      <div
        style={
          propsFunction.isFlex && !propsFunction.marginApplied
            ? {
                marginLeft: '5px',
                display: 'flex',
                alignItems: 'center',
                width: '30px'
              }
            : propsFunction.isFlex && propsFunction.marginApplied
            ? {
                marginLeft: '5px',
                display: 'flex',
                alignItems: 'center',
                width: '30px',
                marginBottom: '8px'
              }
            : { marginBottom: '25px', marginLeft: '5px' }
        }
      >
        {propsFunction.field ? (
          <div
            style={
              propsFunction.isCreator
                ? { color: '#64c89e', fontSize: '30px', cursor: 'pointer' }
                : { color: '#64c89e', fontSize: '30px' }
            }
            onClick={() => {
              if (propsFunction.isCreator) {
                // setField(false);
                propsFunction.validateFieldFalse();
              }
            }}
          >
            <SvgIcon>
              <CheckCircleSolid />
            </SvgIcon>
          </div>
        ) : (
          <div
            style={
              propsFunction.isCreator
                ? {
                    color: 'rgb(101, 110, 126)',
                    fontSize: '30px',
                    cursor: 'pointer'
                  }
                : { color: 'rgb(101, 110, 126)', fontSize: '30px' }
            }
            onClick={() => {
              if (propsFunction.isCreator) {
                // setField(true);
                propsFunction.validateFieldTrue();
              }
            }}
          >
            <SvgIcon>
              <CheckCircleRegular />
            </SvgIcon>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={classes.tokenomicsTab}>
      {props.pod || !props.creation ? (
        <div style={{ width: 620 }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            className={classes.withFundingSection}
            mb={4}
          >
            <Box>
              <Box className={classes.subTitle}>Create POD with Funding</Box>
              <Box className={classes.grayLabel} mt={1}>
                {props.pod?.WithFunding
                  ? 'Turn your fans into your investors. Capsules are fundraisable, meaning you can sell ownership of the music you put in this Capsule. So when songs are streamed on Myx or NFTs are sold, owners of this Capsule earn.'
                  : 'If you do not want to fundraise. You can simply add collaborators, whether they are other artists, labels, etc, divide ownership, add music, and self-govern. All owners of the Capsule share in revenues from streaming on Myx and NFT sales.'}
              </Box>
            </Box>
            <Box display="flex" alignItems="center">
              <Box mr={1}>{props.pod?.WithFunding ? 'Yes' : 'No'}</Box>
              <CustomSwitch
                checked={props.pod?.WithFunding}
                theme="music dao"
                onChange={() => {
                  props.setPod({
                    ...props.pod,
                    WithFunding: !props.pod.WithFunding
                  });
                }}
              />
            </Box>
          </Box>
          <Box className={classes.flexRowInputs}>
            <RenderInputCreateModal
              name={'Give Your Fraction A Name (Required)'}
              info={'Please name your media fraction.'}
              placeholder={'Your Fraction Token Name'}
              type={'text'}
              width={-1}
              item={'TokenName'}
              pod={props.pod}
              setPod={props.setPod}
              creation={props.creation}
              isCreator={isCreator}
            />
          </Box>
          <Box className={classes.flexRowInputs}>
            <RenderInputCreateModal
              name={'Give it a Symbol (Required)'}
              info={
                'Please give your media fraction a symbol (between 3-8 characters). Think of this as your media fractions ticker symbol, eg Bitcoins symbol is BTC'
              }
              placeholder={'Your Fraction Token symbol'}
              type={'text'}
              width={-1}
              item={'TokenSymbol'}
              pod={props.pod}
              setPod={props.setPod}
              creation={props.creation}
              isCreator={isCreator}
            />
          </Box>
          <Box className={classes.flexRowInputs}>
            <RenderInputCreateModal
              name={'Total Supply'}
              info={'Please give your media fraction total supply.'}
              placeholder={'Set amount'}
              type="euro-number"
              width={-1}
              item={'TotalSupply'}
              pod={props.pod}
              setPod={props.setPod}
              creation={props.creation}
              isCreator={isCreator}
            />
          </Box>
          <Box className={classes.flexRowInputs} width={1}>
            <RenderInputCreateModal
              name="Capsules Royalty Share For Secondary Sales Of NFT (%) (Optional)"
              info="This is amount of royalties sent to this Capsule from secondary sales of the NFTs in this Capsule, eg if they are sold on"
              placeholder="Suggested: 1%"
              width={-1}
              type="euro-number"
              max={100}
              item="Royalty"
              pod={props.pod}
              setPod={props.setPod}
              creation={props.creation}
              isCreator={isCreator}
            />
          </Box>

          {props.pod?.WithFunding && (
            <>
              <Grid
                container
                spacing={2}
                direction="row"
                alignItems="flex-start"
                justify="flex-start"
              >
                <Grid item xs={12} md={8}>
                  <Box className={classes.flexRowInputs} width={1}>
                    <RenderInputCreateModal
                      name="How much do you want to raise? (Required)"
                      info="This is the amount you want to raise from investors. You have til the funding deadline (below) to reavh this funding target, otherwise the Capsule fails."
                      placeholder="Suggested: 10000"
                      width={-1}
                      type="euro-number"
                      item="FundingTarget"
                      pod={props.pod}
                      setPod={props.setPod}
                      creation={props.creation}
                      isCreator={isCreator}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box mt={'28px'}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      mb={'11px'}
                    >
                      <div className={classes.infoHeaderCreatePod}>{''}</div>
                      <Tooltip
                        TransitionComponent={Fade}
                        TransitionProps={{ timeout: 600 }}
                        arrow
                        className={classes.tooltipHeaderInfo}
                        title={`This is the token you want to receive funding in. These tokens (and chains) will be updated on a regular basis as to give more options to you.`}
                      >
                        <img src={infoIcon} alt={'info'} />
                      </Tooltip>
                    </Box>
                    <TokenSelect
                      value={props.pod.FundingToken || 'USDT'}
                      onChange={handleChangeTokenSelector}
                      tokens={props.tokenObjList}
                      style={{
                        height: '45px',
                        backgroundColor: 'rgba(218, 230, 229, 0.4)'
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>
              <Box className={classes.flexRowInputs} flexDirection="column">
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <div className={classes.infoHeaderCreatePod}>
                    Funding Deadline (Required)
                  </div>
                  <Tooltip
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                    arrow
                    className={classes.tooltipHeaderInfo}
                    title={`Important! This is the amount of time you have to reach your fundraising target. If the funding target is reached before the deadline, then the Capsule is successful and moves to Funded stage. If the funding target is not hit before the deadline, investors are returned their money and the Capsule is burned. You cannot change this deadline in the future and once the Capsule reaches its funding target, before the deadline, the Capsule automatically moves to Funded stage.`}
                  >
                    <img src={infoIcon} alt={'info'} />
                  </Tooltip>
                </Box>
                <div
                  className={classes.textFieldCreatePod}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    height: '45px',
                    paddingTop:
                      props.pod.FundingDate &&
                      pickerMinDate >= props.pod.FundingDate * 1000
                        ? 24
                        : 0,
                    marginBottom: 16
                  }}
                >
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      id="date-picker-funding-date"
                      minDate={pickerMinDate}
                      format="dd MMM yyyy"
                      placeholder="Select date..."
                      value={
                        props.pod.FundingDate
                          ? new Date(props.pod.FundingDate * 1000)
                          : new Date().setDate(new Date().getDate() + 1)
                      }
                      onChange={(e: any) =>
                        props.setPod((prev) => ({
                          ...prev,
                          FundingDate: Math.floor(new Date(e).getTime() / 1000)
                        }))
                      }
                      keyboardIcon={<img src={calendarIcon} alt={'calendar'} />}
                      className={classes.datePicker}
                    />
                  </MuiPickersUtilsProvider>
                </div>
              </Box>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default TokenomicsTab;

//input component
const RenderInputCreateModal = (props) => {
  return (
    <div
      style={
        props.width === -1
          ? {
              width: '100%'
            }
          : {}
      }
    >
      <div style={{ display: 'flex', alignItems: 'flex-end' }}>
        <div style={{ width: '100%' }}>
          <InputWithLabelAndTooltip
            theme={'music dao'}
            labelName={props.name ?? ''}
            tooltip={props.info}
            style={
              props.width === -1
                ? { width: '100%' }
                : props.isCreator
                ? { width: 'calc(' + props.width + 'px - 24px - 35px)' }
                : { width: 'calc(' + props.width + 'px - 24px)' }
            }
            type={props.type}
            referenceValue="object"
            minValue={props.min}
            maxValue={props.max}
            inputValue={
              props.value ? props.value : props.pod ? props.pod[props.item] : ''
            }
            onInputValueChange={(el) => {
              if (!props.isCreator && !props.pod[props.item + 'Validation']) {
                let podCopy = { ...props.pod };
                podCopy[props.item] =
                  props.type === 'euro-number' ? el : el.target.value;
                props.setPod(podCopy);
              }
            }}
            placeHolder={props.placeholder}
            disabled={
              props.isCreator || props.pod
                ? props.pod[props.item + 'Validation']
                : false
            }
          />
        </div>
        {!props.creation ? (
          <ValidatedField
            field={props.pod ? props.pod[props.item + 'Validation'] : ''}
            isCreator={props.isCreator}
            isFlex={true}
            validateFieldTrue={() => {
              if (props.isCreator) {
                let podCopy = { ...props.pod };
                podCopy[props.item + 'Validation'] = true;
                props.setPod(podCopy);
              }
            }}
            validateFieldFalse={() => {
              if (props.isCreator) {
                let podCopy = { ...props.pod };
                podCopy[props.item + 'Validation'] = false;
                props.setPod(podCopy);
              }
            }}
          />
        ) : null}
      </div>
    </div>
  );
};

const ValidatedField = (propsFunction: any) => {
  return (
    <div
      style={
        propsFunction.isFlex && !propsFunction.marginApplied
          ? {
              marginLeft: '5px',
              display: 'flex',
              alignItems: 'center',
              width: '30px'
            }
          : propsFunction.isFlex && propsFunction.marginApplied
          ? {
              marginLeft: '5px',
              display: 'flex',
              alignItems: 'center',
              width: '30px',
              marginBottom: '8px'
            }
          : { marginBottom: '25px', marginLeft: '5px' }
      }
    >
      {propsFunction.field ? (
        <div
          style={
            propsFunction.isCreator
              ? { color: '#64c89e', fontSize: '30px', cursor: 'pointer' }
              : { color: '#64c89e', fontSize: '30px' }
          }
          onClick={() => {
            if (propsFunction.isCreator) {
              // setField(false);
              propsFunction.validateFieldFalse();
            }
          }}
        >
          <SvgIcon>
            <CheckCircleSolid />
          </SvgIcon>
        </div>
      ) : (
        <div
          style={
            propsFunction.isCreator
              ? {
                  color: 'rgb(101, 110, 126)',
                  fontSize: '30px',
                  cursor: 'pointer'
                }
              : { color: 'rgb(101, 110, 126)', fontSize: '30px' }
          }
          onClick={() => {
            if (propsFunction.isCreator) {
              // setField(true);
              propsFunction.validateFieldTrue();
            }
          }}
        >
          <SvgIcon>
            <CheckCircleRegular />
          </SvgIcon>
        </div>
      )}
    </div>
  );
};
