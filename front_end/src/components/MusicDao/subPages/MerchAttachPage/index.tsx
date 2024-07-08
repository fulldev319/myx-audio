import React, { lazy, Suspense, useState, useEffect, useRef } from 'react';
import { Box, Grid, Typography, Button } from '@material-ui/core';
import { getWeb3OwnedTracksOfPlatform } from 'shared/services/API';
import Web3 from 'web3';
import { useWeb3React } from '@web3-react/core';
import TransactionProgressModal from 'shared/ui-kit/Modal/Modals/TransactionProgressModal';
import { BlockchainNets } from 'shared/constants/constants';
import { switchNetwork } from 'shared/functions/metamask';
import { useAlertMessage } from 'shared/hooks/useAlertMessage';
import InfiniteScroll from 'react-infinite-scroll-component';
import { MasonryGrid } from 'shared/ui-kit/MasonryGrid/MasonryGrid';
import CreatingStep from './components/CreatingStep';
import AllPlatforms from './components/AllPlatforms';
import MerchCard from './components/MerchCard';
import AddMerchModal from './components/AddMerchModal';
import { InfoTooltip } from 'shared/ui-kit/InfoTooltip';
import InputWithLabelAndTooltip from 'shared/ui-kit/InputWithLabelAndTooltip';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { sanitizeIfIpfsUrl } from 'shared/helpers/utils';
import { ReactComponent as RefreshIcon } from 'assets/icons/refresh.svg';
import { Color } from 'shared/ui-kit';
import { getDefaultBGImage } from 'shared/services/user/getUserAvatar';
import { styles } from './index.styles';
import ArtistSongCard from 'components/MusicDao/components/Cards/ArtistSongCard';

const COLUMNS_COUNT_BREAK_POINTS_FOUR = {
  400: 1,
  700: 2,
  1200: 3,
  1440: 4
};
const CreateSteps = [
  {
    step: 1,
    label: 'Platform',
    description: 'Select Music Platform with your NFT',
    completed: true
  },
  {
    step: 2,
    label: 'Select NFT',
    description: 'Select Group of NFTs to attach Merch to',
    completed: true
  },
  {
    step: 3,
    label: 'Attach Merch',
    description: 'Add Merch to selected NFTs',
    completed: false
  },
  {
    step: 4,
    label: 'Royalties',
    description: 'Royalties',
    completed: false
  }
];

const readioOptions = [
  {
    title: 'Yes',
    value: 'Yes'
  },
  {
    title: 'No',
    value: 'No'
  }
];

const PlatformCard = lazy(
  () => import('components/MusicDao/components/Cards/PlatformCard')
);

const NFTTrackCard = lazy(
  () => import('components/MusicDao/components/Cards/NFTTrackCard')
);

export default function MerchAttachPage() {
  const classes = styles();
  const { account, library, chainId } = useWeb3React();
  const [hash, setHash] = React.useState<string>('');
  const [network, setNetwork] = useState<string>(BlockchainNets[1].value);
  const [
    transactionInProgress,
    setTransactionInProgress
  ] = React.useState<boolean>(false);
  const [transactionSuccess, setTransactionSuccess] = React.useState<
    boolean | null
  >(null);
  const [
    openTranactionModal,
    setOpenTransactionModal
  ] = React.useState<boolean>(false);
  const { showAlertMessage } = useAlertMessage();
  const [searchPlatformQuery, setSearchPlatformQuery] = React.useState('');
  const [steps, setSteps] = useState<any>(CreateSteps);
  const [step, setStep] = useState<number>(1);
  const [merches, setMerches] = useState<Array<any>>([]);
  const [hashTags, setHashTags] = useState<Array<any>>([]);
  const [hashTagString, setHashTagString] = useState<string>('');
  const [openAddModal, setOpenAddModal] = React.useState<boolean>(false);

  const [image, setImage] = useState<any>(null);
  const [imageFile, setImageFile] = useState<any>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [image2, setImage2] = useState<any>(null);
  const [imageFile2, setImageFile2] = useState<any>(null);
  const imageInputRef2 = useRef<HTMLInputElement>(null);

  const [nfts, setNfts] = useState<any[]>([0, 1, 2, 3]);
  const [isNFTLoading, setIsNFTLoading] = useState<boolean>(false);
  const [hasMoreNFTs, setHasMoreNFTs] = useState<boolean>(true);
  const [lastNFTId, setLastNFTId] = useState<any>();

  const [isRoyaltyShare, setIsRoyaltyShare] = React.useState<boolean>(false);
  const [royaltyShare, setRoyaltyShare] = React.useState<number>();
  const [platformId, setPlatformId] = React.useState(null);
  const [selectedNFTs, setSelectedNFTs] = React.useState<string[]>([]);

  const onImageInput = (e) => {
    const files = e.target.files;
    if (files.length) {
      handleImageFiles(files);
    }
    e.preventDefault();

    if (imageInputRef !== null && imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const handleImageFiles = (files: any) => {
    if (files && files[0] && files[0].type) {
      setImage(files[0]);

      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageFile(reader.result);
        let image = new Image();
        if (
          reader.result !== null &&
          (typeof reader.result === 'string' || reader.result instanceof String)
        )
          image.src = reader.result.toString();
      });

      reader.readAsDataURL(files[0]);
    }
  };

  const onImageInput2 = (e) => {
    const files = e.target.files;
    if (files.length) {
      handleImageFiles2(files);
    }
    e.preventDefault();

    if (imageInputRef2 !== null && imageInputRef2.current) {
      imageInputRef2.current.value = '';
    }
  };

  const handleImageFiles2 = (files: any) => {
    if (files && files[0] && files[0].type) {
      setImage2(files[0]);

      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageFile2(reader.result);
        let image = new Image();
        if (
          reader.result !== null &&
          (typeof reader.result === 'string' || reader.result instanceof String)
        )
          image.src = reader.result.toString();
      });

      reader.readAsDataURL(files[0]);
    }
  };

  const handleGoStep = (index) => {
    if (step > index) {
      setStep(index);
    } else {
      return;
    }
  };

  const handleNext = () => {
    if (step == CreateSteps.length) {
      return;
    }
    setStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (step == 1) {
      return;
    }
    setStep((prev) => prev - 1);
  };

  const handleSearchPlatformQuery = (e) => {
    setSearchPlatformQuery(e.target.value);
  };

  const handleSelectedNFTs = (nftId: string) => {
    if (selectedNFTs.includes(nftId))
      setSelectedNFTs(selectedNFTs.filter((nft) => nft !== nftId));
    else setSelectedNFTs([...selectedNFTs, nftId]);
  };

  const loadNFTs = async (init, platformId) => {
    if (isNFTLoading) return;
    try {
      setIsNFTLoading(true);
      const response = await getWeb3OwnedTracksOfPlatform({
        lastId: init ? undefined : lastNFTId,
        platformId
      });
      if (response.success) {
        const newNFTs = response.data;
        const newLastId = response.lastId;
        const newhasMore = response.hasMore;

        setNfts((prev) => (init ? newNFTs : [...prev, ...newNFTs]));
        setLastNFTId(newLastId);
        setHasMoreNFTs(newhasMore);
      } else {
        setNfts([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsNFTLoading(false);
    }
  };

  React.useEffect(() => {
    if (step === 2 && platformId) {
      loadNFTs(true, platformId);
    }
  }, [step, platformId]);

  return (
    <Box className={classes.root}>
      <Box className={classes.header}>
        <CreatingStep
          curStep={step}
          status={steps}
          handleGoStep={handleGoStep}
        />
      </Box>

      <Box className={classes.content}>
        <Box>
          <Box className={classes.stepTitle}>STEP {step}</Box>
          <Box className={classes.typo11}>{steps[step - 1].description}</Box>
        </Box>

        {step === 1 && (
          <Box mt={7}>
            <Box width="100%">
              <Box className={classes.inputLabel}>Search Platform Name</Box>
              <Box mt={1} style={{ position: 'relative' }}>
                <input
                  className={classes.input}
                  placeholder="Search platform name"
                  value={searchPlatformQuery}
                  onChange={handleSearchPlatformQuery}
                />
                <Box className={classes.searchIcon}>
                  <SearchIcon />
                </Box>
              </Box>
            </Box>
            <Box mt={2}>
              <AllPlatforms
                query={searchPlatformQuery}
                platformId={platformId}
                setPlatformId={setPlatformId}
              />
            </Box>
          </Box>
        )}

        {step === 2 && (
          <Box mt={7}>
            <Box className={classes.typo11}>Available NFTs</Box>
            <Box mt={2} paddingBottom={15}>
              <InfiniteScroll
                hasChildren={nfts.length > 0}
                dataLength={nfts.length}
                scrollableTarget={'scrollContainer'}
                next={() => {
                  if (nfts.length > 0) {
                    loadNFTs(false, platformId);
                  }
                }}
                hasMore={hasMoreNFTs}
                loader={
                  isNFTLoading && (
                    <MasonryGrid
                      gutter={'24px'}
                      data={nfts}
                      renderItem={(item, index) =>
                        item.Source === 'myx' ? (
                          <ArtistSongCard
                            song={item}
                            isLoading={true}
                            platform={true}
                            key={`platform_${index}`}
                          />
                        ) : (
                          <NFTTrackCard
                            data={item}
                            isLoading={true}
                            key={`platform_${index}`}
                          />
                        )
                      }
                      columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
                    />
                  )
                }
                style={{ overflow: 'inherit' }}
              >
                <Box mt={1}>
                  {!isNFTLoading && !hasMoreNFTs && nfts.length < 1 && (
                    <Box textAlign="center" mt={6}>
                      No Available Tracks
                    </Box>
                  )}
                  <MasonryGrid
                    gutter={'24px'}
                    data={nfts}
                    renderItem={(item, index) =>
                      item.Source === 'myx' ? (
                        <ArtistSongCard
                          song={item}
                          isLoading={Object.entries(item).length === 0}
                          platform={true}
                          handleClick={handleSelectedNFTs}
                          selected={selectedNFTs.includes(item.Id)}
                        />
                      ) : (
                        <NFTTrackCard
                          data={item}
                          isLoading={Object.entries(item).length === 0}
                          handleClick={handleSelectedNFTs}
                          selected={selectedNFTs.includes(item.Id)}
                        />
                      )
                    }
                    columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
                  />
                </Box>
              </InfiniteScroll>
            </Box>
          </Box>
        )}

        {step === 3 && (
          <Box mt={7}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mt={6}
            >
              <Box className={classes.inputLabel} mb={1}>
                Merch Name
              </Box>
              <InfoTooltip tooltip={'Pod Name'} />
            </Box>
            <input className={classes.input} placeholder="File description" />
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mt={3}
            >
              <Box className={classes.inputLabel} mb={1}>
                Description <span style={{ color: 'red' }}>*</span>
              </Box>
              <InfoTooltip tooltip={'Pod Name'} />
            </Box>
            <textarea
              style={{ height: 153 }}
              className={classes.input}
              placeholder="File description"
            />
            <Box display="flex" gridGap="25px">
              <Box width="50%">
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  mt={3}
                >
                  <Box className={classes.inputLabel} mb={1}>
                    Preview Image <span style={{ color: 'red' }}>*</span>
                  </Box>
                  <InfoTooltip tooltip={'Pod Name'} />
                </Box>
                <Box
                  className={classes.uploadBox2}
                  style={{
                    cursor: image ? undefined : 'pointer'
                  }}
                  onClick={() => !image && imageInputRef.current?.click()}
                >
                  {image ? (
                    <>
                      <Box
                        className={classes.imageBox2}
                        style={{
                          backgroundImage: `url(${sanitizeIfIpfsUrl(
                            imageFile
                          )})`,
                          backgroundSize: 'cover'
                        }}
                      />
                      <Box
                        flex={1}
                        display="flex"
                        alignItems="center"
                        marginLeft="24px"
                        justifyContent="space-between"
                        mr={3}
                      >
                        Uploaded {image.name}
                        <Button
                          startIcon={<RefreshIcon />}
                          style={{ color: '#0D59EE' }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setImage(null);
                            setImageFile(null);
                            imageInputRef.current?.click();
                          }}
                        >
                          CHANGE FILE
                        </Button>
                      </Box>
                    </>
                  ) : (
                    <>
                      <Box className={classes.imageBox2}>
                        <ImageOutlineIcon />
                      </Box>
                      <Box className={classes.controlBox}>
                        <b>
                          Drag image here or <br />
                          <span>browse media on your device</span>
                        </b>
                        <br />
                        Up to 10mb of PNG, JPG and GIF files are allowed. <br />
                        Must be suare size, minumum 400x400px
                      </Box>
                    </>
                  )}
                </Box>

                <input
                  ref={imageInputRef}
                  id={`selectPhoto-create-merch`}
                  hidden
                  type="file"
                  style={{ display: 'none' }}
                  accept={'image/png, image/jpeg'}
                  onChange={onImageInput}
                />
              </Box>
              <Box width="50%">
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  mt={3}
                >
                  <Box className={classes.inputLabel} mb={1}>
                    Full size preview <span style={{ color: 'red' }}>*</span>
                  </Box>
                  <InfoTooltip tooltip={'Pod Name'} />
                </Box>
                <Box
                  className={classes.uploadBox2}
                  style={{
                    cursor: image2 ? undefined : 'pointer'
                  }}
                  onClick={() => !image2 && imageInputRef2.current?.click()}
                >
                  {image2 ? (
                    <>
                      <Box
                        className={classes.imageBox2}
                        style={{
                          backgroundImage: `url(${sanitizeIfIpfsUrl(
                            imageFile2
                          )})`,
                          backgroundSize: 'cover'
                        }}
                      />
                      <Box
                        flex={1}
                        display="flex"
                        alignItems="center"
                        marginLeft="24px"
                        justifyContent="space-between"
                        mr={3}
                      >
                        Uploaded {image2.name}
                        <Button
                          startIcon={<RefreshIcon />}
                          style={{ color: '#0D59EE' }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setImage(null);
                            setImageFile(null);
                            imageInputRef2.current?.click();
                          }}
                        >
                          CHANGE FILE
                        </Button>
                      </Box>
                    </>
                  ) : (
                    <>
                      <Box className={classes.imageBox2}>
                        <ImageOutlineIcon />
                      </Box>
                      <Box className={classes.controlBox}>
                        <b>
                          Drag image here or <br />
                          <span>browse media on your device</span>
                        </b>
                        <br />
                        Up to 10mb of PNG, JPG and GIF files are allowed. <br />
                        Must be suare size, minumum 400x400px
                      </Box>
                    </>
                  )}
                </Box>

                <input
                  ref={imageInputRef2}
                  id={`selectPhoto-create-merch`}
                  hidden
                  type="file"
                  style={{ display: 'none' }}
                  accept={'image/png, image/jpeg'}
                  onChange={onImageInput2}
                />
              </Box>
            </Box>
            <Box mt={3}>
              <Grid item xs={12}>
                <InputWithLabelAndTooltip
                  labelName="Hashtags"
                  labelSuffix="*"
                  placeHolder="divided by comma"
                  onInputValueChange={(e) => {
                    setHashTagString(e.target.value);
                    setHashTags(
                      e.target.value
                        .split(',')
                        .map((s: string) => s.trim())
                        .filter((s: string) => !!s)
                    );
                  }}
                  inputValue={hashTagString}
                  type="text"
                  theme="music dao pod"
                  tooltip="As the community grows, hashtags will help people find your Capsule organically."
                />
                <div
                  className={classes.hashtagsRow}
                  style={{ flexFlow: 'wrap', marginTop: '0px' }}
                >
                  {hashTags.map((hashtag, index) => (
                    <div
                      className={classes.hashtagPill}
                      style={{ marginTop: '8px' }}
                      key={`tag-${index}`}
                    >
                      {hashTags && hashTags[index] ? hashTags[index] : hashtag}
                    </div>
                  ))}
                </div>
              </Grid>
            </Box>
          </Box>
        )}

        {step === 4 && (
          <Box mt={7}>
            <Box>
              <Typography className={classes.typo5}>STEP {step}</Typography>
              <Typography className={classes.title}>
                {steps[step - 1].label}
              </Typography>
            </Box>
            <Box mt={4}>
              <Box className={classes.title}>
                Do you want royalties from secondary sales of the NFT(s)?{' '}
              </Box>
              <Box
                style={{
                  color: '#2D3047',
                  fontSize: 18,
                  fontWeight: 400,
                  fontFamily: "'Pangram Regular'"
                }}
                mt={2}
              >
                Every time the NFT is traded on OpenSea or Myx, NFT holders can
                receive royalties to their wallet address. If you select “Yes”,
                be prepared to paste the recipient wallet address.
              </Box>
            </Box>
            <Box mt={5} display="flex" justifyContent="center">
              <RadioGroup
                className={classes.radioButton}
                row
                aria-label="streaming"
                name="streaming"
                value={isRoyaltyShare ? 'Yes' : 'No'}
                onChange={(e) => {
                  setIsRoyaltyShare(e.target.value === 'Yes' ? true : false);
                }}
              >
                {readioOptions.map((item, index) => (
                  <div
                    style={{
                      background:
                        (isRoyaltyShare && index === 0) ||
                        (!isRoyaltyShare && index === 1)
                          ? 'rgba(218, 230, 229, 0.4)'
                          : 'linear-gradient(0deg, rgba(218, 230, 229, 0.06), rgba(218, 230, 229, 0.06))'
                    }}
                    key={`switch_${index}`}
                  >
                    <FormControlLabel
                      style={{ marginLeft: 0 }}
                      value={item.value}
                      control={<Radio />}
                      label={item.title}
                    />
                  </div>
                ))}
              </RadioGroup>
            </Box>
            {isRoyaltyShare && (
              <div className={classes.royaltyShareSection}>
                <Box>
                  <InputWithLabelAndTooltip
                    style={{
                      height: 153,
                      fontSize: 62,
                      fontWeight: 'bold',
                      color: Color.MusicDAOBlue
                    }}
                    labelName="Royalty share"
                    labelSuffix="*"
                    placeHolder="00.00"
                    endAdornment="%"
                    inputValue={royaltyShare}
                    onInputValueChange={(value) => {
                      setRoyaltyShare(value);
                    }}
                    type="euro-number"
                    referenceValue="object"
                    theme="music dao"
                    tooltip="The royalty % is viewable for any prospective buyer to see as NFT details on OpenSea (you can also past contract address on Polygonscan)."
                  />
                </Box>
              </div>
            )}
          </Box>
        )}
      </Box>

      <Box className={classes.footer}>
        <Button
          className={classes.backButton}
          style={{ background: 'white' }}
          onClick={handlePrev}
        >
          Back
        </Button>
        {step === 4 ? (
          <Button
            className={classes.addButton}
            style={{
              background:
                'linear-gradient(88.38deg, #4434FF 7.67%, #2B99FF 102.5%), linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)'
            }}
            onClick={() => {}}
          >
            Create Merch
          </Button>
        ) : (
          <Button
            className={classes.nextButton}
            style={{ background: Color.MusicDAOBlue }}
            onClick={handleNext}
            disabled={
              step === 1
                ? !platformId
                : step === 2
                ? selectedNFTs.length === 0
                : false
            }
          >
            Next
          </Button>
        )}
      </Box>

      {openAddModal && (
        <AddMerchModal
          open={openAddModal}
          handleClose={() => setOpenAddModal(false)}
          handleSubmit={() => {}}
        />
      )}
      {openTranactionModal && (
        <TransactionProgressModal
          open={openTranactionModal}
          onClose={() => {
            setHash('');
            setTransactionSuccess(null);
            setOpenTransactionModal(false);
          }}
          network={network}
          transactionInProgress={transactionInProgress}
          transactionSuccess={transactionSuccess}
          hash={hash}
        />
      )}
    </Box>
  );
}

const PlusIcon = () => (
  <svg
    width="28"
    height="29"
    viewBox="0 0 28 29"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="13.999" cy="14.9316" r="14" fill="white" />
    <path
      d="M13.999 9.93164V19.9316"
      stroke="#0D59EE"
      stroke-width="2"
      stroke-linecap="round"
    />
    <path
      d="M18.999 14.9316L8.99902 14.9316"
      stroke="#0D59EE"
      stroke-width="2"
      stroke-linecap="round"
    />
  </svg>
);

const SearchIcon = () => (
  <svg
    width="20"
    height="19"
    viewBox="0 0 20 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17.5527 18.7071C17.9432 19.0976 18.5763 19.0976 18.9669 18.7071C19.3574 18.3166 19.3574 17.6834 18.9669 17.2929L17.5527 18.7071ZM15.2598 8.5C15.2598 12.0899 12.3496 15 8.75977 15V17C13.4542 17 17.2598 13.1944 17.2598 8.5H15.2598ZM8.75977 15C5.16991 15 2.25977 12.0899 2.25977 8.5H0.259766C0.259766 13.1944 4.06535 17 8.75977 17V15ZM2.25977 8.5C2.25977 4.91015 5.16991 2 8.75977 2V0C4.06535 0 0.259766 3.80558 0.259766 8.5H2.25977ZM8.75977 2C12.3496 2 15.2598 4.91015 15.2598 8.5H17.2598C17.2598 3.80558 13.4542 0 8.75977 0V2ZM18.9669 17.2929L14.7793 13.1053L13.3651 14.5195L17.5527 18.7071L18.9669 17.2929Z"
      fill="#2D3047"
    />
  </svg>
);
const RemoveIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.82031 0.689753C4.82031 0.397265 5.05742 0.160156 5.34991 0.160156H9.19849C9.49097 0.160156 9.72808 0.397265 9.72808 0.689753C9.72808 0.982241 9.49097 1.21935 9.19849 1.21935H5.34991C5.05742 1.21935 4.82031 0.982241 4.82031 0.689753Z"
      fill="#F43E5F"
    />
    <path
      d="M0.84375 3.26818H2.25601L3.13867 13.154C3.15729 13.4326 3.38899 13.6491 3.66826 13.6484H10.8702C11.1495 13.6491 11.3812 13.4326 11.3998 13.154L12.2825 3.26818H13.6948V2.20898H0.84375V3.26818Z"
      fill="#F43E5F"
    />
  </svg>
);
const PenIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12.0234 0.5C11.3654 0.5 10.7079 0.750787 10.2063 1.25184C7.3324 4.12572 4.45852 6.9996 1.5845 9.87362L5.22099 13.5101C8.09488 10.6362 10.9688 7.76235 13.8428 4.88833C14.8454 3.8857 14.8427 2.25397 13.8406 1.25184C13.3396 0.750801 12.6815 0.5 12.0235 0.5H12.0234ZM1.13865 10.6404L0.875534 13.756C0.853562 14.0207 1.07434 14.2415 1.33853 14.219L4.45249 13.9548L1.13865 10.6404Z"
      fill="#54658F"
    />
  </svg>
);

const ImageOutlineIcon = () => (
  <svg
    width="57"
    height="56"
    viewBox="0 0 57 56"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g opacity="0.4">
      <path
        d="M47.8507 0.446289H9.26444C4.65739 0.450941 0.924685 4.18352 0.919922 8.78843V47.3747C0.924573 51.9794 4.65715 55.7121 9.26444 55.7168H47.8507C52.4554 55.7122 56.1881 51.9796 56.1928 47.3747V8.78843C56.1882 4.1837 52.4556 0.451052 47.8507 0.446289V0.446289ZM3.40137 8.78843C3.40369 5.5535 6.02701 2.93024 9.26426 2.92553H47.8505C51.0854 2.93018 53.7087 5.5535 53.7111 8.78843V36.4517L44.976 28.6912H44.9783C44.4783 28.247 43.7155 28.2772 43.2574 28.7633L35.0224 37.4079L26.9178 28.7704V28.7681C26.6853 28.5216 26.3597 28.3797 26.0202 28.3774H26.0132C25.6736 28.3774 25.3504 28.5169 25.1155 28.7611L4.32684 50.5101C3.72452 49.5752 3.40356 48.4868 3.40124 47.3752L3.40137 8.78843ZM6.07119 52.2798L26.0061 31.4215L46.4715 53.2383H9.26408C8.12921 53.236 7.01756 52.9035 6.07101 52.2802L6.07119 52.2798ZM49.5971 52.9426L36.7201 39.2167L44.2246 31.3401L53.711 39.768V47.3749C53.7041 49.9307 52.0366 52.1842 49.5947 52.9424L49.5971 52.9426Z"
        fill="#727F9A"
      />
      <path
        d="M32.9242 23.0841C35.4056 23.0818 37.6428 21.5888 38.5917 19.2957C39.5405 17.0026 39.0172 14.363 37.2614 12.6098C35.5056 10.854 32.8683 10.3284 30.5755 11.2796C28.2825 12.2285 26.7871 14.4657 26.7871 16.9494C26.7918 20.3355 29.536 23.0798 32.9246 23.0845L32.9242 23.0841ZM32.9242 13.2935C34.4033 13.2935 35.7359 14.1842 36.301 15.5494C36.8661 16.9145 36.5521 18.4866 35.508 19.5331C34.4638 20.5773 32.8917 20.8889 31.5242 20.3238C30.159 19.7587 29.2683 18.4261 29.2683 16.9493C29.2706 14.9307 30.9055 13.2935 32.9242 13.2935Z"
        fill="#727F9A"
      />
    </g>
  </svg>
);
