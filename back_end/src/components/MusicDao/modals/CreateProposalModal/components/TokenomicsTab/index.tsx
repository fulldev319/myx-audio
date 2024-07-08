import React, { useEffect, useState } from 'react';

import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import Fade from '@material-ui/core/Fade';
import SvgIcon from '@material-ui/core/SvgIcon';

import { TokenSelect } from 'shared/ui-kit/Select/TokenSelect';
import InputWithLabelAndTooltip from 'shared/ui-kit/InputWithLabelAndTooltip';
import Box from 'shared/ui-kit/Box';
import useIPFS from 'shared/utils-IPFS/useIPFS';
import getIPFSURL from 'shared/functions/getIPFSURL';
import { tokenomicsTabStyles } from './index.styles';

import { ReactComponent as CheckCircleRegular } from 'assets/icons/check-circle-regular.svg';
import { ReactComponent as CheckCircleSolid } from 'assets/icons/check-circle-solid.svg';
const infoIcon = require('assets/icons/info_music_dao.webp');

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
    if (pickerMinDate >= props.pod.FundingDate * 1000) {
      props.setPod((prev) => ({
        ...prev,
        FundingDate: Math.floor(pickerMinDate / 1000) + 3600
      }));
    }
  }, [pickerMinDate, props.pod.FundingDate]);

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
      <div>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          className={classes.withFundingSection}
          mb={4}
        >
          <Box className={classes.subTitle}>Media Fractions</Box>
        </Box>
        <Grid
          container
          spacing={2}
          direction="row"
          alignItems="flex-start"
          justify="flex-start"
        >
          <Grid item xs={12} md={6}>
            <Box className={classes.flexRowInputs}>
              <RenderInputCreateModal
                name={'Fractions Name'}
                info={'Please name your media fraction.'}
                placeholder={'Your Fraction Token Name'}
                type={'text'}
                width={-1}
                item={'TokenName'}
                pod={props.pod}
                setPod={props.setPod}
                creation
                isCreator={isCreator}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box className={classes.flexRowInputs}>
              <RenderInputCreateModal
                name={'Fractions Symbol'}
                info={
                  'Please give your media fraction a symbol (between 3-8 characters). Think of this as your media fractions ticker symbol, eg Bitcoins symbol is BTC'
                }
                placeholder={'Your Fraction Token symbol'}
                type={'text'}
                width={-1}
                item={'TokenSymbol'}
                pod={props.pod}
                setPod={props.setPod}
                creation
                isCreator={isCreator}
              />
            </Box>
          </Grid>
        </Grid>
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
                name="Funding Target Supply"
                info="This is the amount you want to raise from investors. You have til the funding deadline (below) to reavh this funding target, otherwise the Capsule fails."
                placeholder="Suggested: 10000"
                width={-1}
                type="euro-number"
                item="FundingTarget"
                pod={props.pod}
                setPod={props.setPod}
                creation
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
      </div>
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
            labelName={props.name}
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
            inputValue={props.value ? props.value : props.pod[props.item]}
            onInputValueChange={(el) => {
              if (!props.isCreator && !props.pod[props.item + 'Validation']) {
                let podCopy = { ...props.pod };
                podCopy[props.item] =
                  props.type === 'euro-number' ? el : el.target.value;
                props.setPod(podCopy);
              }
            }}
            placeHolder={props.placeholder}
            disabled={props.isCreator || props.pod[props.item + 'Validation']}
          />
        </div>
        {!props.creation ? (
          <ValidatedField
            field={props.pod[props.item + 'Validation']}
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
