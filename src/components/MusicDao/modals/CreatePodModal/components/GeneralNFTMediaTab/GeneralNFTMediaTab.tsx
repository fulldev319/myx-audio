import React, { useEffect, useState } from 'react';

import Grid from '@material-ui/core/Grid';

import InputWithLabelAndTooltip from 'shared/ui-kit/InputWithLabelAndTooltip';
import Box from 'shared/ui-kit/Box';
import FileUpload from 'shared/ui-kit/Page-components/FileUpload';
import { InfoTooltip } from 'shared/ui-kit/InfoTooltip';
import { generalNFTMediaTabStyles } from './GeneralNFTMediaTab.styles';

const GeneralNFTMediaTab = (props: any) => {
  const classes = generalNFTMediaTabStyles();

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
            theme="music dao"
            type="text"
            inputValue={props.pod.Name}
            onInputValueChange={(e) => {
              let podCopy = { ...props.pod };
              podCopy.Name = e.target.value;
              props.setPod(podCopy);
              props.setPod({ ...props.pod, Name: e.target.value });
            }}
            labelName="Capsule Name"
            placeHolder="Your name here"
            tooltip={`Please give your Capsule a name, remember you will not be able to change this in the future.`}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <InputWithLabelAndTooltip
            theme="music dao"
            type="textarea"
            inputValue={props.pod.Description}
            onInputValueChange={(e) => {
              props.setPod({ ...props.pod, Description: e.target.value });
            }}
            labelName="Description"
            placeHolder="Write your description..."
            tooltip={`Please give your Capsule a description that collaborators and potential investors can see. While you will be able to create wall posts and discussions within the Capsule, this description field cannot be changed in the future.`}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <Box className={classes.label} mb={1}>
            <div>Capsule Image</div>
            <InfoTooltip tooltip="Even though the software automatically resizes it, we recommend a 200x600 pixel size. Like the other details of the Capsule, this too cannot be changed in the future." />
          </Box>
          <FileUpload
            photo={props.photo}
            photoImg={props.photoImg}
            setterPhoto={props.setPhoto}
            setterPhotoImg={props.setPhotoImg}
            mainSetter={undefined}
            mainElement={undefined}
            type="image"
            canEdit={props.isCreator || props.creation}
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
            theme="music dao"
          />
        </Grid> */}
        {/* <Grid item xs={12} md={6}>
          <InputWithLabelAndTooltip
            theme="music dao"
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
            theme="music dao"
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
            theme="music dao"
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
            labelName="Hashtags (separate by comma)"
            placeHolder="Separate hashtags with commas"
            onInputValueChange={(e) => {
              props.setPod({
                ...props.pod,
                hashtagsString: e.target.value,
                Hashtags: e.target.value.split(',').filter((s) => !!s)
              });
            }}
            inputValue={props.pod.hashtagsString}
            type="text"
            theme="music dao"
            tooltip="As the community grows, hashtags will help people find your Capsule organically."
          />
          <div
            className={classes.hashtagsRow}
            style={{ flexFlow: 'wrap', marginTop: '0px' }}
          >
            {props.pod.Hashtags.map((hashtag, index) => (
              <div className={classes.hashtagPill} style={{ marginTop: '8px' }}>
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
              theme="music dao"
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
                theme="music dao"
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
      </Grid>
    </div>
  );
};

export default GeneralNFTMediaTab;
