import { MusicShareModal } from 'shared/ui-kit/Modal/Modals/ShareMediaToMusicModal';
import { ShareMediaToSocialModal } from 'shared/ui-kit/Modal/Modals/ShareMediaToSocialModal';
import { ShareWithQRCode } from 'shared/ui-kit/Modal/Modals/ShareWithQRCode';
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState
} from 'react';
import { MusicMedia, shareMediaToSocial } from 'shared/services/API/MediaAPI';

type SocialMedia = {
  id: string;
  type: string;
  subType?: string;
};
type ShareMediaContextProviderProps = {};

type ShareMediaContextType = {
  shareMediaToSocial(id: string, type: string, subType?: string, link?: string);
  shareMediaToMusic(media: MusicMedia);
  shareMediaWithQrCode(
    id: string,
    link: string,
    type?: string,
    subType?: string
  );
};

const ShareMediaContext = createContext<ShareMediaContextType | null>(null);

export const ShareMediaContextProvider: React.FunctionComponent<
  ShareMediaContextProviderProps
> = ({ children }) => {
  const [openSocialModal, showSocialModal] = useState(false);
  const [openMusicModal, showMusicModal] = useState(false);
  const [openQrCodeModal, showQrCodeModal] = useState(false);

  const [socialMedia, setSocialMedia] = useState<SocialMedia | undefined>(
    undefined
  );
  const [musicMedia, setMusicMedia] = useState<MusicMedia | undefined>(
    undefined
  );

  const [shareLink, setShareLink] = useState('');

  const shareMedia = useCallback(() => {
    if (socialMedia && socialMedia.id) {
      shareMediaToSocial(socialMedia);
    }
  }, [socialMedia]);

  const getPrefixURL = () => {
    return window.location.origin + '/#';
    // if (process.env.NODE_ENV === 'development')
    //   return `http://localhost:3001/#`;
    // return `https://www.music.store/#/`;
  };

  const context = useMemo<ShareMediaContextType>(
    () => ({
      shareMediaToSocial(
        id: string,
        type: string = 'Media',
        subType?: string,
        link?: string
      ) {
        if (subType === 'DIGITAL_ART_TYPE') {
          setShareLink(`${getPrefixURL()}/pix/${id}`);
        } else if (subType === 'DIGITAL_ART_TYPE_LOAN') {
          setShareLink(`${getPrefixURL()}/pix/loan/${id}`);
        } else if (subType === 'PIX-PODS') {
          setShareLink(`${getPrefixURL()}/${link}`);
        } else if (subType === 'NEW-MUSIC-PODS') {
          setShareLink(`${getPrefixURL()}/${link}`);
        } else if (subType === 'NEW-MUSIC-PROFILE') {
          setShareLink(`${getPrefixURL()}/${link}`);
        } else if (subType === 'SOCIAL_APP') {
          setShareLink(`${getPrefixURL()}/social/${id}`);
        } else if (subType === 'MYX-SONGS') {
          setShareLink(`${link}`);
        } else {
          setShareLink(`${getPrefixURL()}/media/${id}`);
        }
        setSocialMedia({ id, type, subType });
        showSocialModal(true);
      },
      shareMediaToMusic(media) {
        setMusicMedia(media);
        showMusicModal(true);
      },
      shareMediaWithQrCode(
        id: string,
        link: string,
        type?: string,
        subType?: string
      ) {
        if (subType === 'MYX-SONGS') {
          setShareLink(`${link}`);
        } else {
          setShareLink(`${getPrefixURL()}/${link}`);
        }
        const defaultType = type ? type : 'Media';
        setSocialMedia({ id, type: defaultType, subType });
        showQrCodeModal(true);
      }
    }),
    []
  );

  return (
    <ShareMediaContext.Provider value={context}>
      {children}
      {openSocialModal && (
        <ShareMediaToSocialModal
          shareLink={shareLink}
          open={openSocialModal}
          handleClose={() => showSocialModal(false)}
          shareMedia={shareMedia}
          type={socialMedia?.type ?? 'Media'}
        />
      )}
      {openQrCodeModal && (
        <ShareWithQRCode
          isOpen={openQrCodeModal}
          onClose={() => showQrCodeModal(false)}
          mediaId={socialMedia?.id}
          shareLink={shareLink}
        />
      )}
      {openMusicModal && (
        <MusicShareModal
          media={musicMedia}
          isOpen={openMusicModal}
          onClose={() => showMusicModal(false)}
        />
      )}
    </ShareMediaContext.Provider>
  );
};

export const useShareMedia = () => {
  const context = useContext(ShareMediaContext);

  if (!context) {
    throw new Error(
      'useShareMedia hook must be used inside ShareMediaContextProvider'
    );
  }

  return context;
};
