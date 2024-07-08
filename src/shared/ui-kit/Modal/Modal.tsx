import MuiModal from '@material-ui/core/Modal';
import React from 'react';
import styled from 'styled-components';
import { BorderRadius, Color, grid } from '../../constants/const';
import { ReactComponent as CloseIcon } from 'assets/icons/close.svg';

type ModalSize = 'small' | 'medium' | 'daoMedium';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  showCloseIcon?: boolean;
  size: ModalSize;
  className?: string;
  theme?: 'dark' | 'light' | 'transparent';
  wrapperPadding?: string;
  style?: any;
  fullScreen?: boolean;
  ref?: any;
};

export const Modal: React.FunctionComponent<ModalProps> = React.memo(
  ({
    isOpen,
    onClose,
    size,
    children,
    className,
    showCloseIcon,
    theme,
    wrapperPadding,
    style,
    fullScreen = false,
    ref
  }) => (
    <MuiModal open={isOpen} onClose={onClose} ref={ref}>
      <ModalWrapper style={fullScreen ? { padding: 0 } : {}}>
        <ModalContent
          theme={theme}
          size={size}
          className={className}
          style={{ position: 'relative', ...style }}
          wrapperPadding={wrapperPadding || ''}
        >
          {showCloseIcon &&
            (fullScreen ? (
              <BorderCloseButton theme={theme} onClick={onClose} />
            ) : (
              <CloseButton theme={theme} onClick={onClose} />
            ))}
          {children}
        </ModalContent>
      </ModalWrapper>
    </MuiModal>
  )
);

const ModalWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${80 + 8 * 4}px ${grid(4)};
  min-height: 100vh;
  border: 'unset';
  @media (max-width: 600px) {
    padding: ${grid(4)} ${grid(1)};
  }
`;

const ModalContent = styled.div<{ size: ModalSize; wrapperPadding?: string }>`
  width: 100%;
  max-width: ${(p) => MODAL_MAX_WIDTH[p.size]}px;
  border-radius: ${(p) => (p.theme === 'dark' ? 0 : BorderRadius.XL)};
  background-color: ${(p) =>
    p.theme === 'dark'
      ? '#1A1B1C'
      : p.theme === 'transparent'
      ? 'transparent'
      : Color.White};
  overflow: auto;
  padding: ${(p) => (p.wrapperPadding ? p.wrapperPadding : grid(4))};
  max-height: 80vh;
  color: ${(p) => (p.theme === 'dark' ? 'white' : '#181818')};
  transition: min-height 2s linear;
  scrollbar-width: none;
  @media (max-width: 600px) {
    padding: ${(p) =>
      p.wrapperPadding ? p.wrapperPadding : `${grid(4)} ${grid(2)}`};
  }
`;

const CloseButton = styled(CloseIcon)`
  z-index: 1;
  position: absolute;
  cursor: pointer;
  right: ${grid(3)};
  top: ${grid(3)};
  width: 14px;
  height: 14px;
  color: ${(p) =>
    p.theme === 'dark' || p.theme === 'transparent'
      ? Color.White
      : Color.MusicDAODark};
`;

const BorderCloseButton = styled(CloseIcon)`
  z-index: 1;
  position: absolute;
  cursor: pointer;
  right: ${grid(3)};
  top: ${grid(3)};
  width: 48px;
  height: 48px;
  padding: 12px;
  border-radius: 50%;
  background: linear-gradient(0deg, #f2fbf6, #f2fbf6), #17172d;
  color: ${(p) =>
    p.theme === 'dark' || p.theme === 'transparent'
      ? Color.White
      : Color.MusicDAODark};
`;

const MODAL_MAX_WIDTH: { [key in ModalSize]: number } = {
  small: 520,
  daoMedium: 755,
  medium: 1040
};
