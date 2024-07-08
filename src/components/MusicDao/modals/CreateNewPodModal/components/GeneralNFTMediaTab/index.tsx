import React, { useEffect, useState } from 'react';

import Fade from '@material-ui/core/Fade';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';

import InputWithLabelAndTooltip from 'shared/ui-kit/InputWithLabelAndTooltip';
import Box from 'shared/ui-kit/Box';
import FileUpload from 'shared/ui-kit/Page-components/FileUpload';
import { ReactComponent as InfoIcon } from 'assets/icons/info.svg';
import { createPodModalStyles } from '../../index.styles';
import { generalNFTMediaTabStyles } from './index.styles';

const GeneralNFTMediaTab = (props: any) => {
  const classes = generalNFTMediaTabStyles();
  const modalClasses = createPodModalStyles();

  //hashtags
  const [canEdit, setCanEdit] = useState<boolean>(true);

  useEffect(() => {
    if (props.canEdit !== undefined) {
      setCanEdit(props.canEdit);
    }
  }, [props.canEdit]);

  return (
    <div className={classes.generalNftMediaTab}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <InputWithLabelAndTooltip
            theme="music dao pod"
            type="text"
            inputValue={props.pod.Name}
            onInputValueChange={(e) => {
              let podCopy = { ...props.pod };
              podCopy.Name = e.target.value;
              props.setPod(podCopy);
              props.setPod({ ...props.pod, Name: e.target.value });
            }}
            labelName="Capsule Name"
            labelSuffix="*"
            placeHolder="Your name here"
            tooltip={`Please give your Capsule a name, remember you will not be able to change this in the future.`}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <InputWithLabelAndTooltip
            theme="music dao pod"
            type="text"
            inputValue={props.pod.Symbol}
            onInputValueChange={(e) => {
              let podCopy = { ...props.pod };
              podCopy.Symbol = e.target.value;
              props.setPod(podCopy);
              props.setPod({ ...props.pod, Symbol: e.target.value });
            }}
            labelName="Capsule Symbol"
            labelSuffix="*"
            placeHolder="Your pod symbol"
            tooltip={`Please give your Capsule a symbol, remember you will not be able to change this in the future.`}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <InputWithLabelAndTooltip
            theme="music dao pod"
            type="textarea"
            inputValue={props.pod.Description}
            onInputValueChange={(e) => {
              props.setPod({ ...props.pod, Description: e.target.value });
            }}
            labelName="Description"
            labelSuffix="*"
            placeHolder="Write your description..."
            tooltip={`Please give your Capsule a description that collaborators and potential investors can see. While you will be able to create wall posts and discussions within the Capsule, this description field cannot be changed in the future.`}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <Box className={classes.label} mb={1}>
            <div style={{ position: 'relative' }}>
              Capsule Image
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  right: -10,
                  color: '#F43E5F'
                }}
              >
                *
              </div>
            </div>
            <Tooltip
              TransitionComponent={Fade}
              TransitionProps={{ timeout: 600 }}
              arrow
              title={
                'Even though the software automatically resizes it, we recommend a 200x600 pixel size. Like the other details of the Capsule, this too cannot be changed in the future.'
              }
              classes={{ popper: classes.myTooltip }}
            >
              <InfoIcon />
            </Tooltip>
          </Box>
          <FileUpload
            photo={props.photo}
            photoImg={props.photoImg}
            setterPhoto={props.setPhoto}
            setterPhotoImg={props.setPhotoImg}
            mainSetter={undefined}
            mainElement={undefined}
            type="image"
            canEdit
            isEditable
            extra
            theme="music dao"
          />
        </Grid>
        {/* <Grid item xs={12} md={12}>
          <Box className={classes.label} mb={1}>
            Choose Blockchain Network
          </Box>
          <BlockchainTokenSelectSecondary
            communityToken={props.pod}
            setCommunityToken={props.setPod}
            BlockchainNets={BlockchainNets}
            theme="music dao pod"
          />
        </Grid> */}
        {/* <Grid item xs={12} md={6}>
          <InputWithLabelAndTooltip
            theme="music dao pod"
            labelName="Investor share"
            tooltip={`Please provide investor for your community. As the Communities grow, this field will help people discover your community`}
            onInputValueChange={e => {
              props.setPod({ ...props.pod, InvestorShare: e.target.value });
            }}
            type="text"
            inputValue={props.pod.InvestorShare}
            placeHolder="Input share % here"
            disabled={!props.isCreator && !props.creation}
          />
        </Grid>
        <Grid item xs={12} md={6} style={{ paddingLeft: "16px" }}>
          <InputWithLabelAndTooltip
            theme="music dao pod"
            labelName="Sharing percentage"
            tooltip={`Please provide sharing percentage for your community. As the Communities grow, this field will help people discover your community`}
            onInputValueChange={e => {
              props.setPod({ ...props.pod, SharingPercent: e.target.value });
            }}
            type="text"
            inputValue={props.pod.SharingPercent}
            placeHolder="Input share % here"
            disabled={!props.isCreator && !props.creation}
          />
        </Grid>
        <Grid item xs={12}>
          <InputWithLabelAndTooltip
            theme="music dao pod"
            labelName="Royalties"
            tooltip={`Please provide Royalties for your community. As the Communities grow, this field will help people discover your community`}
            onInputValueChange={e => {
              props.setPod({ ...props.pod, Royalty: e.target.value });
            }}
            type="text"
            inputValue={props.pod.Royalty}
            placeHolder="Input share % here"
            disabled={!props.isCreator && !props.creation}
          />
        </Grid> */}
        <Grid item xs={12}>
          <InputWithLabelAndTooltip
            labelName="Hashtags"
            labelSuffix="*"
            placeHolder="Separate hashtags with commas"
            onInputValueChange={(e) => {
              props.setPod({
                ...props.pod,
                hashtagsString: e.target.value,
                Hashtags: e.target.value
                  .split(',')
                  .map((s: string) => s.trim())
                  .filter((s: string) => !!s)
              });
            }}
            inputValue={props.pod.hashtagsString}
            type="text"
            theme="music dao pod"
            tooltip="As the community grows, hashtags will help people find your Capsule organically."
          />
          <div
            className={classes.hashtagsRow}
            style={{ flexFlow: 'wrap', marginTop: '0px' }}
          >
            {props.pod.Hashtags.map((hashtag, index) => (
              <div
                className={classes.hashtagPill}
                style={{ marginTop: '8px' }}
                key={`tag-${index}`}
              >
                {props.pod.Hashtags && props.pod.Hashtags[index]
                  ? props.pod.Hashtags[index]
                  : hashtag}
              </div>
            ))}
          </div>
        </Grid>
        {/* <Grid
          item
          xs={12}
          md={12}
          style={{
            borderBottom: "1px solid #34375533",
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            color="#181818"
            fontSize="18px"
            justifyContent="space-between"
          >
            Open advertising
            <CustomSwitch
              theme="music dao pod"
              checked={props.pod.OpenAdvertising}
              onChange={() => {
                if (props.isCreator || props.creation) {
                  let podCopy = { ...props.pod };
                  podCopy.OpenAdvertising = !podCopy.OpenAdvertising;
                  props.setPod(podCopy);
                }
              }}
            />
          </Box>
        </Grid>
        {props.creation ? (
          <Grid item xs={12} md={12}>
            <Box
              display="flex"
              alignItems="center"
              color="#181818"
              fontSize="18px"
              justifyContent="space-between"
            >
              Open investment
              <CustomSwitch
                theme="music dao pod"
                checked={props.pod.IsInvesting}
                onChange={() => {
                  if (props.isCreator || props.creation) {
                    let podCopy = { ...props.pod };
                    podCopy.IsInvesting = !podCopy.IsInvesting;
                    props.setPod(podCopy);
                  }
                }}
              />
            </Box>
          </Grid>
        ) : null} */}
        <Grid
          item
          xs={12}
          md={12}
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              border: '1px solid rgba(255, 138, 1, 0.32)',
              padding: 16,
              borderRadius: 8
            }}
          >
            <WarningIcon />
            <Box ml={2} className={modalClasses.alertTypo}>
              After you create the Capsule, the next stage is the distribution
              proposal. Your Capsule in this stage is private, only viewable to you
              and collaborators
            </Box>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default GeneralNFTMediaTab;

const WarningIcon = () => (
  <svg
    width="26"
    height="24"
    viewBox="0 0 26 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M25.096 17.7594L16.264 2.46338C14.824 -0.0646172 11.176 -0.0646172 9.73602 2.46338L0.90402 17.7594C-0.53598 20.2874 1.25602 23.4234 4.16802 23.4234H21.8C24.712 23.4234 26.536 20.2554 25.096 17.7594ZM12.648 7.32738C13.32 7.16738 13.992 7.48738 14.28 8.12738C14.376 8.35138 14.408 8.57539 14.408 8.83139C14.376 9.53539 14.312 10.2394 14.28 10.9434C14.216 12.0314 14.152 13.1194 14.088 14.2074C14.056 14.5594 14.056 14.8794 14.056 15.2314C14.024 15.8074 13.576 16.2554 13 16.2554C12.424 16.2554 11.976 15.8394 11.944 15.2634C11.848 13.5674 11.752 11.9034 11.656 10.2074C11.624 9.75938 11.592 9.31138 11.56 8.86338C11.56 8.12738 11.976 7.51938 12.648 7.32738ZM13 20.0314C12.232 20.0314 11.592 19.3914 11.592 18.6234C11.592 17.8554 12.232 17.2154 13 17.2154C13.768 17.2154 14.408 17.8554 14.376 18.6554C14.408 19.3914 13.736 20.0314 13 20.0314Z"
      fill="#FF9101"
    />
  </svg>
);
