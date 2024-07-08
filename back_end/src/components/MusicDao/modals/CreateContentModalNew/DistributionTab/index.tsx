import React from 'react';

import Fade from '@material-ui/core/Fade';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Tooltip from '@material-ui/core/Tooltip';
import useTheme from '@material-ui/core/styles/useTheme';

import Box from 'shared/ui-kit/Box';
import Avatar from 'shared/ui-kit/Avatar';
import { getDefaultAvatar } from 'shared/services/user/getUserAvatar';
import InputWithLabelAndTooltip from 'shared/ui-kit/InputWithLabelAndTooltip';
import { processImage } from 'shared/helpers';

import { useDistributionTabStyles } from './index.styles';

const infoIcon = require('assets/icons/info_music_dao.webp');

const DistributionTab = (props: any) => {
  const classes = useDistributionTabStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down(400));

  const [totalValue, setTotalValue] = React.useState<number>();

  const maxInvestorsShare = React.useMemo(() => {
    if (!props.pod || !props.pod.Collabs) return 100;
    const creatorsSum = props.pod.Collabs.map((e: any) =>
      Number(e.sharingPercent ?? 0)
    ).reduce((a: number, b: number) => a + b, 0);
    return 100 - creatorsSum;
  }, [props.pod]);

  const getMaxCreatorShare = React.useCallback(
    (ownIndex: number) => {
      if (!props.pod || !props.pod.Collabs) return 100;
      const creatorsSum = props.pod.Collabs.filter(
        (e: any, index: number) => index !== ownIndex
      )
        .map((e: any) => Number(e.sharingPercent ?? 0))
        .reduce((a: number, b: number) => a + b, 0);
      return 100 - creatorsSum - Number(props.pod.InvestorShare ?? 0);
    },
    [props.pod]
  );

  return (
    <div className={classes.generalNftMediaTab}>
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
        Media Fractionalisations Distribution
      </Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={1.5}
      >
        <div className={classes.infoHeaderCreatePod}>Distribution details</div>
      </Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={1.5}
        pl={isMobile ? 4 : 8}
        pr={isMobile ? 2 : 8}
      >
        <Box fontSize={14} color="#2D3047" width={isMobile ? 100 : 200}>
          Artist
        </Box>
        <Box fontSize={14} color="#2D3047">
          Role
          <Tooltip
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 600 }}
            arrow
            className={classes.tooltipHeaderInfo}
            title={`Please indicate the roles of the collabs of this Capsule. Artist, songwriter, label, music manager, etc.`}
          >
            <img src={infoIcon} alt={'info'} />
          </Tooltip>
        </Box>
        <Box fontSize={14} color="#2D3047">
          Share(%)
        </Box>
      </Box>
      {props.pod?.Collabs?.map((creator, index) => {
        return (
          <Box
            key={`distrib-${index}`}
            className={classes.distribBox}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box
              display="flex"
              alignItems="center"
              width={isMobile ? 120 : 260}
            >
              <Avatar
                size={34}
                image={processImage(creator.imageUrl) || getDefaultAvatar()}
                radius={25}
                bordered
                rounded
              />
              <Box
                display="flex"
                flexDirection="column"
                ml={isMobile ? 1 : 2}
                width="70%"
              >
                <div className={classes.nameTypo}>{creator.name}</div>
                <div className={classes.slugTypo}>{`@${creator.urlSlug}`}</div>
              </Box>
            </Box>
            <InputWithLabelAndTooltip
              type="text"
              overriedClasses={classes.percentageBox}
              onInputValueChange={(e) => {
                let podCopy = { ...props.pod };
                podCopy.Collabs[index] = {
                  ...podCopy.Collabs[index],
                  role: e.target.value
                };
                props.setPod(podCopy);
              }}
              inputValue={creator.role}
            />
            <InputWithLabelAndTooltip
              type="euro-number"
              referenceValue="object"
              overriedClasses={classes.percentageBox}
              onInputValueChange={(value) => {
                if (value > getMaxCreatorShare(index) || value < 0) {
                  return;
                }
                let podCopy = { ...props.pod };
                podCopy.Collabs[index] = {
                  ...podCopy.Collabs[index],
                  sharingPercent: value
                };
                props.setPod(podCopy);
              }}
              inputValue={`${creator.sharingPercent || 0}`.replace(/^0+/, '')}
            />
          </Box>
        );
      })}
      <Box
        className={classes.distribBox}
        alignItems="center"
        justifyContent="space-between"
        style={{ display: props.pod?.WithFunding ? 'flex' : 'none' }}
      >
        <Box className={classes.nameTypo} flex={1}>
          Investors
        </Box>
        <InputWithLabelAndTooltip
          type="euro-number"
          referenceValue="object"
          overriedClasses={classes.percentageBox}
          onInputValueChange={(value) => {
            if (value < 0 || value > maxInvestorsShare) return;
            props.setPod({
              ...props.pod,
              InvestorShare: value
            });
          }}
          inputValue={`${props.pod?.InvestorShare || 0}`.replace(/^0+/, '')}
        />
      </Box>
      <Box
        className={classes.totalBox}
        style={{
          background:
            totalValue === 100 ? '#D1F8D0' : 'rgba(244, 236, 236, 0.4)',
          border: totalValue === 100 ? '1px solid #65CB63' : '1px solid #FF0404'
        }}
      >
        <span>Total</span>
        <InputWithLabelAndTooltip
          type="number"
          overriedClasses={classes.totalPercentageBox}
          onInputValueChange={(e) => {}}
          inputValue={totalValue}
          placeHolder="00"
          disabled
          endAdornment="%"
        />
      </Box>
    </div>
  );
};

export default DistributionTab;
