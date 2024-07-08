import * as React from 'react';

// import Tooltip from '@material-ui/core/Tooltip';
// import Fade from '@material-ui/core/Fade';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import useTheme from '@material-ui/core/styles/useTheme';

import InputWithLabelAndTooltip from 'shared/ui-kit/InputWithLabelAndTooltip';
import Box from 'shared/ui-kit/Box';
import Avatar from 'shared/ui-kit/Avatar';
import { getDefaultAvatar } from 'shared/services/user/getUserAvatar';
import { processImage } from 'shared/helpers';

import { useStyles } from './index.styles';

const DistributionTab = (props: any) => {
  const classes = useStyles();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down(400));

  const maxInvestorsShare = React.useMemo(() => {
    if (!props.pod || !props.pod.Collabs.length) return 100;
    const creatorsSum = [props.pod.Collabs]
      .map((e: any) => Number(e.sharingPercent ?? 0))
      .reduce((a: number, b: number) => a + b, 0);
    return 100 - creatorsSum;
  }, [props.pod]);

  const getMaxCreatorShare = React.useCallback(
    (ownIndex: number) => {
      if (!props.pod || !props.pod.Collabs.length) return 100;
      const creatorsSum = [props.pod.Collabs]
        .filter((e: any, index: number) => index !== ownIndex)
        .map((e: any) => Number(e.sharingPercent ?? 0))
        .reduce((a: number, b: number) => a + b, 0);
      return 100 - creatorsSum - Number(props.pod.InvestorShare ?? 0);
    },
    [props.pod]
  );

  return (
    <div className={classes.generalNftMediaTab}>
      <Box display="flex" alignItems="center" justifyContent="center" mb={1.5}>
        <div className={classes.infoHeaderCreatePod}>
          Media Fractionalisations Distribution
        </div>
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
        {/* <Box fontSize={14} color="#2D3047">
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
        </Box> */}
        <Box fontSize={14} color="#2D3047">
          Share(%)
        </Box>
      </Box>
      {props.pod.Collabs?.map((creator, index) => {
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
            {/* <InputWithLabelAndTooltip
              type="text"
              overriedClasses={classes.percentageBox}
              onInputValueChange={(e) => {
                let podCopy = { ...props.song };
                podCopy.Collabs[index] = {
                  ...podCopy.Collabs[index],
                  role: e.target.value
                };
                props.setPod(podCopy);
              }}
              inputValue={creator.role}
            /> */}
            <InputWithLabelAndTooltip
              type="euro-number"
              referenceValue="object"
              overriedClasses={classes.percentageBox}
              onInputValueChange={(value) => {
                if (value > getMaxCreatorShare(index) || value < 0) {
                  return;
                }
                let dataCopy = { ...props.pod };
                const userIndex = dataCopy.Collabs.findIndex(
                  (v) => v.id === creator.id
                );
                if (userIndex >= 0) {
                  dataCopy.Collabs[userIndex].sharingPercent = value;
                }
                // dataCopy.Collabs[index] = {
                //   ...podCopy.Collabs[index],
                //   sharingPercent: value
                // };
                props.setPod(dataCopy);
              }}
              inputValue={`${creator.sharingPercent || 0}`.replace(/^0+/, '')}
            />
          </Box>
        );
      })}
      {props.pod?.WithFunding && (
        <Box
          className={classes.distribBox}
          alignItems="center"
          justifyContent="space-between"
          style={{ display: 'flex' }}
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
              let dataCopy = { ...props.pod };
              dataCopy.InvestorShare = value;
              props.setPod(dataCopy);
              // props.setSongData({
              //   ...props.song,
              //   InvestorShare: value
              // });
            }}
            inputValue={`${props.pod.InvestorShare || 0}`.replace(/^0+/, '')}
          />
        </Box>
      )}
    </div>
  );
};

export default DistributionTab;
