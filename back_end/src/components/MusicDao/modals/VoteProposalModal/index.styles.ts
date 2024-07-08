import makeStyles from '@material-ui/core/styles/makeStyles';

export const useVoteProposalModalStyles = makeStyles((theme) => ({
  root: {
    color: '#2D3047'
  },
  title: {
    fontSize: 22,
    fontWeight: 800
  },
  text1: {
    fontSize: 18,
    fontWeight: 600
  },
  text2: {
    fontSize: 14,
    fontWeight: 500
  },
  text3: {
    fontSize: 16,
    fontWeight: 600
  },
  text4: {
    fontSize: 20,
    fontWeight: 600
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center',
    borderRadius: 16
  },
  button: {
    borderRadius: '46px !important',
    height: '61px !important',
    fontSize: '16px !important'
  }
}));
