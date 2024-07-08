import { makeStyles } from '@material-ui/core/styles';

export const useDraftSettingModalStyles = makeStyles((theme) => ({
  content: {
    backgroundColor: '#FFFFFF !important',
    boxShadow: '0px 38px 42px 17px rgba(33, 41, 48, 0.06)',
    color: '#2D3047 !important',
    width: '755px !important',
    borderRadius: '30px !important',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%'
  },
  title: {
    fontWeight: 'bold',
    fontSize: '22px',
    lineHeight: '28.6px',
    color: '#2D3047'
  },
  button: {
    fontSize: '16px !important',
    background: 'white',
    paddingLeft: '39px !important',
    paddingRight: '39px !important',
    color: '#2D3047 !important',
    borderRadius: '48px !important',
    border: '1px solid #2D3047'
  },
  confirmButton: {
    fontSize: '16px !important',
    background: '#2D3047',
    paddingLeft: '45px !important',
    paddingRight: '45px !important',
    color: 'white !important',
    borderRadius: '48px !important'
  },
  revenueStreamingSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    background: 'linear-gradient(0deg, #F2FBF6, #F2FBF6), #17172D',
    border: '1px solid #65CB63',
    borderRadius: 12,
    padding: '30px 20px',
    marginTop: 32,
    position: 'relative'
  },
  revenueText: {
    fontSize: 13,
    lineHeight: '104%',
    color: '#2D3047',
    opacity: 0.6
  }
}));
