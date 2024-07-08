import React, { useState, useEffect, useRef } from 'react';
import { Box, Grid, Typography, Button } from '@material-ui/core';

import Web3 from 'web3';
import useIPFS from 'shared/utils-IPFS/useIPFS';
import { useWeb3React } from '@web3-react/core';
import {
  getURLfromCID,
  uploadNFTMetaData
} from 'shared/functions/ipfs/upload2IPFS';
import TransactionProgressModal from 'shared/ui-kit/Modal/Modals/TransactionProgressModal';
import { BlockchainNets } from 'shared/constants/constants';
import { switchNetwork } from 'shared/functions/metamask';
import { useAlertMessage } from 'shared/hooks/useAlertMessage';
import { onUploadNonEncrypt } from 'shared/ipfs/upload';
import CreatingStep from './components/CreatingStep';
import MerchCard from './components/MerchCard';
import AddMerchModal from './components/AddMerchModal';
import { InfoTooltip } from 'shared/ui-kit/InfoTooltip';
import { sanitizeIfIpfsUrl } from 'shared/helpers/utils';
import { ReactComponent as RefreshIcon } from 'assets/icons/refresh.svg';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputWithLabelAndTooltip from 'shared/ui-kit/InputWithLabelAndTooltip';
import { Color } from 'shared/ui-kit';
import { styles } from './index.styles';
import { signPayload } from 'shared/services/WalletSign';

const CreateSteps = [
  {
    step: 1,
    label: 'Merch',
    completed: true
  },
  {
    step: 2,
    label: 'Royalties',
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

export default function MerchCreatePage() {
  const classes = styles();

  const { setMultiAddr, uploadWithNonEncryption } = useIPFS();
  const { account, library, chainId } = useWeb3React();
  const [hash, setHash] = React.useState<string>('');
  const [network, setNetwork] = useState<string>(BlockchainNets[1].value);
  const [transactionInProgress, setTransactionInProgress] = React.useState<boolean>(false);
  const [transactionSuccess, setTransactionSuccess] = React.useState<
    boolean | null
  >(null);
  const [
    openTranactionModal,
    setOpenTransactionModal
  ] = React.useState<boolean>(false);
  const { showAlertMessage } = useAlertMessage();

  const [steps, setSteps] = useState<any>(CreateSteps);
  const [step, setStep] = useState<number>(1);
  const [merches, setMerches] = useState<Array<any>>([]);
  const [openAddModal, setOpenAddModal] = React.useState<boolean>(false);

  const [isRoyaltyShare, setIsRoyaltyShare] = React.useState<boolean>(false);
  const [royaltyShare, setRoyaltyShare] = React.useState<number>();

  const [name, setName] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [amount, setAmount] = useState<number>();
  const [price, setPrice] = useState<number>();
  const [revenue, setRevenue] = useState<number>();
  const [image, setImage] = useState<any>(null);
  const [imageFile, setImageFile] = useState<any>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

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

  const handleGoStep = (index) => {
    if (step > index) {
      setStep(index);
    } else {
      return;
    }
  };

  const handleAddMerch = () => {
    setOpenAddModal(true);
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

  const handleCreate = () => {};

  const handleMerchAdded = () => {
    setMerches([...merches, null]);
    setOpenAddModal(false);
  };

  const handleRegister = async () => {
    try {
      setOpenTransactionModal(true);
      setTransactionInProgress(true);

      let isNew = true;

      let infoImage = await onUploadNonEncrypt(image, (file) =>
        uploadWithNonEncryption(file, false)
      );

      console.log(infoImage)
        

      const targetChain = BlockchainNets.find(
        (net) => net.value === 'Polygon blockchain'
      );
      if (chainId && chainId !== targetChain?.chainId) {
        const isHere = await switchNetwork(targetChain?.chainId || 0x89);
        if (!isHere) {
          showAlertMessage('Got failed while switching over to target network', {
            variant: 'error'
          });
          return;
        }
      }


      const web3APIHandler = targetChain.apiHandler;
      const web3 = new Web3(library.provider);
      const metadataURI = await getTokenURI(infoImage)
      console.log(metadataURI)
      const uris = [metadataURI];
      const prices = [web3.utils.toWei(`${price}`)];
      const totalSupplies = [amount];
      const collection = {
        collectionName: 'test',
        collectionSymbol: 'test',
        metadataURI: 'test',
        fundingToken: '0x0000000000000000000000000000000000000000'
      }
      if(isNew){
        web3APIHandler.MerchManager.registerNewMerch(
          web3,
          account!,
          {
            v_: '123',
            r_: '',
            s_: '',
            deadline: 1693928282,
            collection: collection,
            uris: uris,
            prices: prices,
            totalSupplies: totalSupplies
          },
          setHash
        ).then(async (resp) => {
          if (resp?.success) {
            setTransactionInProgress(false);
            setTransactionSuccess(true);
            showAlertMessage('Created Merch successfully', { variant: 'success' });
          } else {
            setTransactionInProgress(false);
            setTransactionSuccess(false);
            showAlertMessage('Failed to create a merch', { variant: 'error' });
          }
        });
      } else{
        web3APIHandler.MerchManager.registerMerch(
          web3,
          account!,
          {
            uris: uris,
            prices: prices,
            totalSupplies: totalSupplies
          },
          setHash
        ).then(async (resp) => {
          if (resp?.success) {
            setTransactionInProgress(false);
            setTransactionSuccess(true);
            showAlertMessage('Created Merch successfully', { variant: 'success' });
          } else {
            setTransactionInProgress(false);
            setTransactionSuccess(false);
            showAlertMessage('Failed to create a merch', { variant: 'error' });
          }
        });
      }
    } catch (error) {
      console.log(error);
      showAlertMessage('Something went wrong. Please try again!', {
        variant: 'error'
      });
    }
  };

  const getTokenURI = async (
    imageInfo: any
  ) => {
    let metaData: any = {};
    if (imageInfo) {
      metaData = {
        Name: name,
        Description: description,
        Available: amount,
        Sold: 0,
        Price: price,
        Royalty: royaltyShare || 0,
        Type: 'Sale',
        ImageUrl: imageInfo
          ? `${getURLfromCID(imageInfo.newFileCID)}/${
            imageInfo.metadata.properties.name
            }`
          : '',
      };
    }
    return (await uploadNFTMetaData(metaData))?.uri;
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.header}>
        <Box className={classes.headerTitle}>Add Merch</Box>
        <CreatingStep
          curStep={step}
          status={steps}
          handleGoStep={handleGoStep}
        />
      </Box>

      <Box className={classes.content}>
        {step === 1 && (
          <>
            <Box display="flex" justifyContent="space-between" gridGap='85px'>
              <Box>
                <Box>
                  <Box className={classes.inputLabel} mb={1}>
                    Picture
                  </Box>
                </Box>
                <Box
                  className={classes.uploadBox}
                  style={{
                    cursor: image ? undefined : "pointer",
                    border: image ? undefined : '1px dashed #0D59EE',
                  }}
                  onClick={() => !image && imageInputRef.current?.click()}
                >
                  {image ? (
                    <>
                      <Box
                        className={classes.imageBox}
                        style={{
                          backgroundImage: `url(${sanitizeIfIpfsUrl(imageFile)})`,
                          backgroundSize: 'cover'
                        }}
                      />
                      {/* <Box
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
                          style={{color: '#0D59EE'}}
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
                      </Box> */}
                    </>
                  ) : (
                    <>
                      <Box>
                        <ImageOutlineIcon />
                      </Box>
                      <Box className={classes.controlBox} mt={4}>
                        <Box className={classes.typo7}>Drag image here or <span>browse media on your device</span></Box>
                        <br />
                        <Box className={classes.typo8}>Up to 10mb of PNG, JPG and GIF files are allowed. <br />
                        Must be suare size, minumum 400x400px</Box>
                        <Button
                          className={classes.browseButton}
                          style={{ background: '#FFFFFF' }}
                        >
                          Browse Media
                        </Button>
                      </Box>
                    </>
                  )}
                </Box>
              </Box>
              <Box width="100%">
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box className={classes.inputLabel} mb={1}>
                    Merch Name
                  </Box>
                  <InfoTooltip tooltip={'Merch Name'} />
                </Box>
                <input className={classes.input} value={name} onChange={(e)=>setName(e.target.value)} placeholder="File description" />
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  mt={3}
                >
                  <Box className={classes.inputLabel} mb={1}>
                    Description
                  </Box>
                  <InfoTooltip tooltip={'Description'} />
                </Box>
                <textarea
                  style={{ height: 90 }}
                  className={classes.input}
                  placeholder="File description"
                  value={description} onChange={(e)=>setDescription(e.target.value)}
                />
                <Box display="flex" mt={3} gridGap="25px">
                  <Box width="35%">
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Box className={classes.inputLabel} mb={1}>
                        Pieces available
                      </Box>
                      <InfoTooltip tooltip={'Available number  to get '} />
                    </Box>
                    <input className={classes.priceInput} type='number' value={amount} onChange={(e)=>setAmount(Number(e.target.value))} placeholder="00" />
                  </Box>
                  <Box width="65%">
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Box className={classes.inputLabel} mb={1}>
                        Price
                      </Box>
                      <InfoTooltip tooltip={'Price'} />
                    </Box>
                    <input className={classes.priceInput} type='number' value={price} onChange={(e)=>setPrice(Number(e.target.value))} placeholder="00.00 USDT" />
                  </Box>
                </Box>
                <Box className={classes.revenueBox} mt={3}>
                  <Box className={classes.typo9}>Total Maximum Revenue</Box>
                  <Box className={classes.typo10}>{amount && price ? amount * price : 0} USDT</Box>
                </Box>
              </Box>
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
          </>
        )}

        {step === 2 && (
          <>
            <Box>
              <Typography className={classes.typo5}>STEP {step}</Typography>
              <Typography className={classes.title}>{steps[step-1].label}</Typography>
            </Box>
            <Box mt={4}>
              <Box className={classes.title}>Do you want royalties from secondary sales of the NFT(s)? </Box>
              <Box className={classes.typo11} mt={2}>Every time the NFT is traded on OpenSea or Myx, NFT holders can receive royalties to their wallet address. If you select “Yes”, be prepared to paste the recipient wallet address.</Box>
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
          </>
          // <>
          //   <Typography className={classes.typo5}>Step {step}</Typography>
          //   <Typography className={classes.title}>Capsule Details</Typography>
          //   <Box
          //     display="flex"
          //     alignItems="center"
          //     justifyContent="space-between"
          //     mt={6}
          //   >
          //     <Box className={classes.inputLabel} mb={1}>
          //       Pod Name *
          //     </Box>
          //     <InfoTooltip tooltip={'Pod Name'} />
          //   </Box>
          //   <input className={classes.input} placeholder="File description" />
          //   <Box
          //     display="flex"
          //     alignItems="center"
          //     justifyContent="space-between"
          //     mt={3}
          //   >
          //     <Box className={classes.inputLabel} mb={1}>
          //       Pod Name *
          //     </Box>
          //     <InfoTooltip tooltip={'Pod Name'} />
          //   </Box>
          //   <textarea
          //     style={{ height: 153 }}
          //     className={classes.input}
          //     placeholder="File description"
          //   />
          //   <Box
          //     display="flex"
          //     alignItems="center"
          //     justifyContent="space-between"
          //     mt={3}
          //   >
          //     <Box className={classes.inputLabel} mb={1}>
          //       Pod Image *
          //     </Box>
          //     <InfoTooltip tooltip={'Pod Name'} />
          //   </Box>
          //   <Box
          //     className={classes.uploadBox}
          //     style={{
          //       cursor: image ? undefined : 'pointer'
          //     }}
          //     onClick={() => !image && imageInputRef.current?.click()}
          //   >
          //     {image ? (
          //       <>
          //         <Box
          //           className={classes.imageBox}
          //           style={{
          //             backgroundImage: `url(${sanitizeIfIpfsUrl(imageFile)})`,
          //             backgroundSize: 'cover'
          //           }}
          //         />
          //         <Box
          //           flex={1}
          //           display="flex"
          //           alignItems="center"
          //           marginLeft="24px"
          //           justifyContent="space-between"
          //           mr={3}
          //         >
          //           Uploaded {image.name}
          //           <Button
          //             startIcon={<RefreshIcon />}
          //             style={{ color: '#0D59EE' }}
          //             onClick={(e) => {
          //               e.preventDefault();
          //               e.stopPropagation();
          //               setImage(null);
          //               setImageFile(null);
          //               imageInputRef.current?.click();
          //             }}
          //           >
          //             CHANGE FILE
          //           </Button>
          //         </Box>
          //       </>
          //     ) : (
          //       <>
          //         <Box className={classes.imageBox}>
          //           <ImageOutlineIcon />
          //         </Box>
          //         <Box className={classes.controlBox}>
          //           Drag image here or <span>browse media on your device</span>
          //           <br />
          //           Up to 10mb of PNG, JPG and GIF files are allowed. <br />
          //           Must be suare size, minumum 400x400px
          //         </Box>
          //       </>
          //     )}
          //   </Box>
          //   <Box
          //     display="flex"
          //     alignItems="center"
          //     justifyContent="space-between"
          //     mt={3}
          //   >
          //     <Box className={classes.inputLabel} mb={1}>
          //       Hashtags{' '}
          //       <span className={classes.typo6}>(divided by comma)</span> *
          //     </Box>
          //     <InfoTooltip tooltip={'Pod Name'} />
          //   </Box>
          //   <input className={classes.input} placeholder="File description" />
          //   <Box className={classes.alert} mt={3}>
          //     <AlertIcon />
          //     <Box ml={4}>
          //       After you create the Pod, the next stage is the distribution
          //       proposal. Your Pod in this stage is private, only viewable to
          //       you and collaborators
          //     </Box>
          //   </Box>

          //   <input
          //     ref={imageInputRef}
          //     id={`selectPhoto-create-merch`}
          //     hidden
          //     type="file"
          //     style={{ display: 'none' }}
          //     accept={'image/png, image/jpeg'}
          //     onChange={onImageInput}
          //   />
          // </>
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
        {step === 1 && (
          <Button
            className={classes.nextButton}
            style={{ background: '#2D3047' }}
            onClick={handleNext}
          >
            Next
          </Button>
        )}
        {step === 2 && (
          <Button
            className={classes.addButton}
            style={{
              background:
                'linear-gradient(88.38deg, #4434FF 7.67%, #2B99FF 102.5%), linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)'
            }}
            onClick={handleRegister}
          >
            Create Merch
          </Button>
        )}
      </Box>

      {openAddModal && (
        <AddMerchModal
          open={openAddModal}
          handleClose={() => setOpenAddModal(false)}
          handleSubmit={handleMerchAdded}
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
          transactionInProgress = {transactionInProgress}
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

const AlertIcon = () => (
  <svg
    width="26"
    height="24"
    viewBox="0 0 26 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M25.096 17.7584L16.264 2.46241C14.824 -0.0655938 11.176 -0.0655938 9.73602 2.46241L0.90402 17.7584C-0.53598 20.2864 1.25602 23.4224 4.16802 23.4224H21.8C24.712 23.4224 26.536 20.2544 25.096 17.7584ZM12.648 7.32641C13.32 7.16641 13.992 7.48641 14.28 8.12641C14.376 8.35041 14.408 8.57441 14.408 8.83041C14.376 9.53441 14.312 10.2384 14.28 10.9424C14.216 12.0304 14.152 13.1184 14.088 14.2064C14.056 14.5584 14.056 14.8784 14.056 15.2304C14.024 15.8064 13.576 16.2544 13 16.2544C12.424 16.2544 11.976 15.8384 11.944 15.2624C11.848 13.5664 11.752 11.9024 11.656 10.2064C11.624 9.75841 11.592 9.31041 11.56 8.86241C11.56 8.12641 11.976 7.51841 12.648 7.32641ZM13 20.0304C12.232 20.0304 11.592 19.3904 11.592 18.6224C11.592 17.8544 12.232 17.2144 13 17.2144C13.768 17.2144 14.408 17.8544 14.376 18.6544C14.408 19.3904 13.736 20.0304 13 20.0304Z"
      fill="#FF9101"
    />
  </svg>
);

const ImageOutlineIcon = () => (
  <svg width="57" height="56" viewBox="0 0 57 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g opacity="0.4">
      <path d="M47.8507 0.446289H9.26444C4.65739 0.450941 0.924685 4.18352 0.919922 8.78843V47.3747C0.924573 51.9794 4.65715 55.7121 9.26444 55.7168H47.8507C52.4554 55.7122 56.1881 51.9796 56.1928 47.3747V8.78843C56.1882 4.1837 52.4556 0.451052 47.8507 0.446289V0.446289ZM3.40137 8.78843C3.40369 5.5535 6.02701 2.93024 9.26426 2.92553H47.8505C51.0854 2.93018 53.7087 5.5535 53.7111 8.78843V36.4517L44.976 28.6912H44.9783C44.4783 28.247 43.7155 28.2772 43.2574 28.7633L35.0224 37.4079L26.9178 28.7704V28.7681C26.6853 28.5216 26.3597 28.3797 26.0202 28.3774H26.0132C25.6736 28.3774 25.3504 28.5169 25.1155 28.7611L4.32684 50.5101C3.72452 49.5752 3.40356 48.4868 3.40124 47.3752L3.40137 8.78843ZM6.07119 52.2798L26.0061 31.4215L46.4715 53.2383H9.26408C8.12921 53.236 7.01756 52.9035 6.07101 52.2802L6.07119 52.2798ZM49.5971 52.9426L36.7201 39.2167L44.2246 31.3401L53.711 39.768V47.3749C53.7041 49.9307 52.0366 52.1842 49.5947 52.9424L49.5971 52.9426Z" fill="#727F9A"/>
      <path d="M32.9242 23.0841C35.4056 23.0818 37.6428 21.5888 38.5917 19.2957C39.5405 17.0026 39.0172 14.363 37.2614 12.6098C35.5056 10.854 32.8683 10.3284 30.5755 11.2796C28.2825 12.2285 26.7871 14.4657 26.7871 16.9494C26.7918 20.3355 29.536 23.0798 32.9246 23.0845L32.9242 23.0841ZM32.9242 13.2935C34.4033 13.2935 35.7359 14.1842 36.301 15.5494C36.8661 16.9145 36.5521 18.4866 35.508 19.5331C34.4638 20.5773 32.8917 20.8889 31.5242 20.3238C30.159 19.7587 29.2683 18.4261 29.2683 16.9493C29.2706 14.9307 30.9055 13.2935 32.9242 13.2935Z" fill="#727F9A"/>
    </g>
  </svg>
);
