import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState
} from 'react';
import { mediaFractionsCardStyles } from './index.styles';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode.react';
import useIPFS from 'shared/utils-IPFS/useIPFS';
import getIPFSURL from 'shared/functions/getIPFSURL';
import { onUploadNonEncrypt } from '../../../../../shared/ipfs/upload';
import { dataURItoBlob } from 'shared/helpers/image';

type IProps = {
  info: any;
  uri: string;
  podImage: any;
};

const MediaFractionsCard = forwardRef((props: IProps, ref) => {
  const { info, uri, podImage } = props;

  const classes = mediaFractionsCardStyles();

  // const [trackInfo, setTrackInfo] = useState<any>(info);
  const [trackInfo, setTrackInfo] = useState<any>({
    ArtistList: [
      'Kid Cudi',
      'Mark Mumbo',
      'Jumbonata',
      'Artist name',
      'Artist name'
    ],
    TrackList: [
      'Song name here',
      'Song name here',
      'Song name here',
      'Song name here',
      'Song name here',
      'Song name here',
      'Song name here',
      'Song name here'
    ],
    PodName: 'Man On The Moon',
    Chain: 'Ethereum',
    PodAddress: '0x503AC85cFAB61a1E33DF33c8B26aE81E3c6e3ef2',
    RevenueAddress: '0x4BCD1B244f6222aEA475594bbad47859A51a5f19',
    OwnedMediaFraction: 25,
    TotalMediaFraction: 100
  });
  const [trackImg, setTrackImg] = useState<any>({});
  const [trackImgBase64, setTrackImgBase64] = useState<any>({});

  const { setMultiAddr, uploadWithNonEncryption } = useIPFS();

  useEffect(() => {
    setMultiAddr(`${getIPFSURL()}/api/v0`);
  }, []);

  useEffect(() => {
    if (info) {
      setTrackInfo(info);
    }
  }, [info]);

  const getCopyrightPdf = async () => {
    const input: any = document.getElementById('divToPrint');
    const canvas = await html2canvas(input, {
      scale: 1.34
    });
    const imgData = canvas.toDataURL('image/png');
    const blobData = dataURItoBlob(imgData);

    const newFile = new File([blobData], 'copyright.webp', { type: 'png' });

    let infoPDF = await onUploadNonEncrypt(newFile, (file) =>
      uploadWithNonEncryption(file, false)
    );

    return infoPDF;
  };

  useImperativeHandle(
    ref,
    () => {
      return {
        getCopyrightPdf
      };
    },
    [getCopyrightPdf]
  );

  const uploadAttachment = (qr: boolean) => {
    const inputElement = document.createElement('input');
    inputElement.type = 'file';
    inputElement.accept = 'image/*';
    inputElement.multiple = true;

    // set onchange event to call callback when user has selected file
    inputElement.addEventListener('change', (event) =>
      fileInputMessageAttachment(event, qr)
    );

    // dispatch a click event to open the file dialog
    inputElement.dispatchEvent(new MouseEvent('click'));
  };

  const fileInputMessageAttachment = (e, qr) => {
    e.preventDefault();
    const files = e.target.files;
    if (files.length) {
      handleFilesAttachment(files, qr);
    }
  };

  const handleFilesAttachment = (files, qr) => {
    setTrackImg(files[0]);
    console.log('files', files);
    const reader = new FileReader();

    reader.addEventListener('load', () => {
      //qr ? setTrackImgBase64QR(reader.result) : setTrackImgBase64(reader.result);
      setTrackImgBase64(reader.result);
    });
    reader.readAsDataURL(files[0]);
  };

  return (
    <div>
      <div className={classes.page} id="divToPrint">
        <div className={classes.topInfo}>
          <div className={classes.topInfoPart1}>
            <div className={classes.header1}>
              MEDIA FRACTION
              <br />
              OWNERSHIP
            </div>
          </div>
          <div className={classes.topInfoPart2}>
            <QRCode value={uri || 'https://musicprotocol.io'} size={70} />
          </div>
        </div>

        <div className={classes.squareInfo}>
          <div className={classes.firstRowInfo}>
            {/*<div className={classes.firstColInfo}>
              <img className={classes.mainImg}
                   src={trackImgBase64}
                   onClick={() => uploadAttachment(false)}/>
            </div>*/}
            <div className={classes.firstColInfo}>
              <img className={classes.mainImg} src={podImage} />
            </div>
            <div className={classes.secondColInfo}>
              <InputWithTitle
                title={'CAPSULE NAME'}
                value={trackInfo?.PodName}
                specialValue={true}
              />
              <InputWithTitle title={'Chain'} value={trackInfo?.Chain} />

              <div className={classes.listInfo}>
                <ListWithItems
                  title={'ARTIST LIST'}
                  items={trackInfo?.ArtistList}
                />
                <ListWithItems
                  title={'TRACK LIST'}
                  items={trackInfo?.TrackList}
                  withNumbers={true}
                />
              </div>
            </div>
          </div>
        </div>

        {/*
        <BigSquareInput title={"NFT Address"} value={trackInfo?.NFTaddress} inputType={"text"} />
        <BigSquareInput title={"Royalty share on NFT"} value={trackInfo?.Royalty} inputType={"text"} />
        <BigSquareInput title={"Revenue address"} value={trackInfo?.RevenueAddress} inputType={"text"} />
        */}

        <BigSquareSpecialInput
          title={'Owned Media Fraction'}
          value={trackInfo?.OwnedMediaFraction}
          inputType={'number'}
          valueTotal={trackInfo?.TotalMediaFraction}
          inputTypeTotal={'number'}
        />

        <BigSquareInput
          title={'Capsule Address'}
          value={trackInfo?.PodAddress}
          inputType={'text'}
        />

        <BigSquareInput
          title={'Revenue address'}
          value={trackInfo?.RevenueAddress}
          inputType={'text'}
        />
        <div className={classes.blueSquareInfo}>
          <b>
            The Myx Capsules are a tool for sharing ownership and governance of a
            music project - a DAO tool for music. This means you can own a
            percentage of future sales or streaming rewards that the music
            project might generate when it is streamed by users of the platform.
          </b>
          <p>
            In theory there is no limit to what a Capsule can be created and used
            for but we see it is a main way to form and fund partnerships
            between artists in the music space and giving options to include
            active fans into it.
          </p>
          <p>
            A Capsule has many programmable functions and encoded rules that require
            consensus. This means these communities in these Capsules don’t need a
            business team so to speak, as the smart contracts of the Capsule do
            everything for you. For example, a Capsule can handle distribution
            proposals, voting and approval of copyrights of assets through
            on-chain consensus.
          </p>

          {/*<a className={classes.moreInfoButton}
             href={"https://docs.traxdapp.io/trax-pods/introduction-daos-smart-contracts-and-monetization-in-the-music-industry"}
             target={"_blank"}>
            MORE INFO HERE --->
          </a>*/}
        </div>
      </div>
    </div>
  );
});

const BigSquareInput = (componentProps: any) => {
  const classes = mediaFractionsCardStyles();

  return (
    <div className={classes.bigSquareInput}>
      <div className={classes.bigSquareInputTitle}>{componentProps.title}</div>
      <div className={classes.bigSquareInputValue}>
        <input
          type={componentProps.inputType}
          className={classes.inputBigSquareInputValue}
          value={componentProps.value}
          onChange={(e) => {
            componentProps.setter(e.target.value);
          }}
        />
      </div>
    </div>
  );
};

const BigSquareSpecialInput = (componentProps: any) => {
  const classes = mediaFractionsCardStyles();

  return (
    <div
      className={classes.bigSquareInput}
      style={{
        border: 'none',
        background:
          'linear-gradient(180deg, rgba(243, 254, 247, 0) -65.87%, #FFFFFF 157.14%), linear-gradient(90.29deg, #FC7901 2.91%, #FCEE01 27.95%, #2CC2FF 52.31%, #8053FF 94%), linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)'
      }}
    >
      <div className={classes.bigSquareInputTitle} style={{ width: '40%' }}>
        {componentProps.title}
      </div>
      <div className={classes.bigSquareInputValue} style={{ width: '60%' }}>
        <input
          type={componentProps.inputType}
          className={classes.bigInputBigSquareInputValue}
          value={componentProps.value}
          onChange={(e) => {
            componentProps.setter(e.target.value);
          }}
        />
        <div
          className={classes.bigInputBigSquareInputValue}
          style={{
            width: '30px',
            color: 'rgba(24, 24, 24, 0.5)'
          }}
        >
          /
        </div>
        <input
          type={componentProps.inputTypeTotal}
          className={classes.bigInputBigSquareInputValue}
          style={{ color: 'rgba(24, 24, 24, 0.5)' }}
          value={componentProps.valueTotal}
          onChange={(e) => {
            componentProps.setterTotal(e.target.value);
          }}
        />
      </div>
    </div>
  );
};

const InputWithTitle = (componentProps: any) => {
  const classes = mediaFractionsCardStyles();

  return (
    <div
      className={classes.inputWithTitle}
      style={componentProps?.noBorder ? { border: 'none' } : {}}
    >
      <div
        className={classes.titleComponentInputWithTitle}
        style={{
          textAlign: componentProps?.centerAll ? 'center' : 'left'
        }}
      >
        {componentProps.title}
      </div>
      <div
        className={classes.valueComponentInputWithTitle}
        style={componentProps?.centerAll ? { textAlign: 'center' } : {}}
      >
        <input
          type={'text'}
          className={classes.inputValueComponentInputWithTitle}
          style={{
            textAlign: componentProps?.centerAll ? 'center' : 'left',
            fontSize: componentProps?.specialValue ? '13px' : '10px',
            fontWeight: componentProps?.specialValue ? 800 : 400
          }}
          value={componentProps.value}
          onChange={(e) => {
            componentProps.setter(e.target.value);
          }}
        />
      </div>
    </div>
  );
};

const ListWithItems = (componentProps: any) => {
  const classes = mediaFractionsCardStyles();

  return (
    <div className={classes.listWithItems}>
      <div className={classes.titleList}>{componentProps.title}</div>
      <div>
        {componentProps?.items?.length > 0
          ? componentProps.items.map((val, index) => {
              return (
                <div key={'item-' + index} className={classes.itemList}>
                  {componentProps.withNumbers ? index + 1 + '. ' : ''} {val}
                </div>
              );
            })
          : null}
      </div>
    </div>
  );
};

export default MediaFractionsCard;
