import { makeStyles } from '@material-ui/core/styles';
import styled from 'styled-components';
import { Gradient, Color } from 'shared/ui-kit';

export type GreenTextProps = React.PropsWithChildren<{
  fontSize?: string;
  fontWeight?: number;
  pointer?: boolean;
  bold?: boolean;
}>;

export const GreenText = styled.div<GreenTextProps>`
  font-size: ${(p) => p.fontSize ?? '18px'};
  background: ${Gradient.Green};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-decoration: none;
  font-weight: ${(p) => (p.fontWeight ? p.fontWeight : p.bold ? 800 : 400)};
  cursor: ${(p) => (p.pointer ? 'cursor' : 'inherit')};
`;

export const GreenTitle = styled.div`
  font-family: Monoton;
  font-style: normal;
  font-weight: normal;
  font-size: 80px;
  background: ${Gradient.Green};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

export type CardProps = React.PropsWithChildren<{
  noPadding?: boolean;
}>;

export const Card = styled.div<CardProps>`
  background: #eff2f8;
  display: flex;
  flex-direction: column;
  color: #707582;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.12);
  border-radius: 16px;
  padding: ${(p) => (p.noPadding ? '0px' : '24px 28px')};
`;

export const SocialPrimaryButton = styled.button`
  background: #2d3047;
  border: 1.5px solid #2d3047;
  color: white;
  font-family: Agrandir;
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 21px;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 106px;
  padding: 8px 16px;
  border-radius: 6px;
`;

export const SocialSecondaryButton = styled.button`
  background: #ffffff;
  border: 1.5px solid #2d3047;
  color: #2d3047;
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 21px;
  font-family: Agrandir;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 106px;
  padding: 8px 16px;
  border-radius: 6px;
`;

export const musicDaoPageStyles = makeStyles((theme) => ({
  musicDao: {
    width: '100%',
    height: '100vh',
    background:
      'linear-gradient(180deg, rgba(243, 254, 247, 0) 49.94%, #EEF2F6 96.61%), conic-gradient(from 71.57deg at 43.63% 99.9%, #2B99FF -34.07deg, #B234FF 21.26deg, #4434FF 224.01deg, #250EB3 256.07deg, #2B99FF 325.93deg, #B234FF 381.26deg), linear-gradient(97.63deg, #99CE00 26.36%, #0DCC9E 80%)'
  },
  mainContainer: {
    display: 'flex',
    width: '100%',
    height: 'calc(100% - 80px)',
    '& button': {
      borderStyle: 'none'
    },
    [theme.breakpoints.down(769)]: {
      height: 'calc(100% - 56px)'
    }
  },
  fitContainer: {
    height: '100% !important'
  },
  content: {
    display: 'flex',
    width: '100%',
    height: '100%',
    overflow: 'auto',
    flexDirection: 'column',
    '& ::-webkit-scrollbar': {
      width: 0
    },
    '& ::-webkit-scrollbar-thumb': {
      width: 20,
      background: 'rgba(238, 241, 244, 1)'
    }
  },
  card: {
    background: Color.White,
    boxShadow: '0px 25px 36px -11px rgba(0, 0, 0, 0.02)',
    borderRadius: 20
  },
  primaryButton: {
    backgroundColor: `${Color.MusicDAODark} !important`,
    borderRadius: 15
  },
  secondaryButton: {
    color: `${Color.MusicDAODark} !important`,
    backgroundColor: `transparent !important`,
    border: `1px solid ${Color.MusicDAODark} !important`
  },
  showAll: {
    width: '170px !important',
    border: `1px solid ${Color.MusicDAODark} !important`,
    backgroundColor: 'transparent !important',
    fontSize: '14px !important',
    color: `${Color.MusicDAODark} !important`,
    position: 'relative',
    [theme.breakpoints.down('xs')]: {
      width: '120px !important'
    }
  },
  backButton: {
    cursor: 'pointer'
  },
  select: {
    '& .MuiSelect-root': {
      paddingRight: 12
    }
  },
  showButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none !important',
    backgroundColor: 'transparent !important'
  },
  showButtonSelected: {
    backgroundColor: 'white !important'
  },
  headerTitle: {
    fontSize: 58,
    fontWeight: 400,
    marginBlock: 0,
    marginBottom: 26,
    color: Color.White,
    '& span': {
      fontWeight: 800
    }
  },
  headerSubTitle: {
    fontSize: 26,
    fontWeight: 400,
    marginBlock: 0,
    marginBottom: 26,
    lineHeight: '39px',
    color: Color.White,
    textAlign: 'center',
    '& span': {
      fontWeight: 800
    }
  },
  outlineSelect: {
    background: Color.White,
    border: '1px solid rgba(64, 70, 88, 0.1)',
    borderRadius: 44,
    paddingLeft: 20,
    paddingRight: 20,
    height: 40
  },
  groupButton: {
    background: 'transparent',
    border: 'none',
    borderRadius: 60,
    fontSize: 14,
    color: Color.GrayDark,
    padding: '8px 16px',
    '& + &': {
      marginLeft: 4
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 12
    }
  },
  selectedGroupButton: {
    background: Color.MusicDAODark,
    color: Color.White
  },
  sidebarFooter: {
    background: 'linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)',
    boxShadow: '0px -2px 2px rgba(101, 203, 99, 0.8)',
    height: 150,
    paddingLeft: 24,
    paddingRight: 24
  },
  bodyFooter: {
    [theme.breakpoints.up('sm')]: {
      display: 'none'
    }
  },
  warningBox: {
    background: '#FFCF24',
    padding: '12px 16px',
    width: '100%',
    position: 'relative',
    textAlign: 'center',
    zIndex: 1,
    [theme.breakpoints.down('sm')]: {
      padding: '12px 48px'
    }
  },
  warningIcon: {
    position: 'absolute',
    left: 16,
    top: 8
  },
  warning: {
    fontSize: 15,
    fontWeight: 700,
    lineHeight: '19.5px'
  }
}));
