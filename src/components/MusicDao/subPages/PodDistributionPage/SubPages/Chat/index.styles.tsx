import { makeStyles } from '@material-ui/core/styles';

export const chatStyles = makeStyles((theme) => ({
  title: {
    fontSize: 22,
    fontWeight: 800,

    lineHeight: '130%',
    color: '#2D3047'
  },
  flexBox: {
    display: 'flex',
    alignItems: 'center'
  },
  discussionContent: {
    borderRadius: 12,
    background: '#ffffff',
    height: '100%',
    textAlign: 'center',
    padding: theme.spacing(2)
  },
  proposalSection: {
    display: 'flex',
    flexDirection: 'column'
  },
  nameTypo: {
    fontSize: 16,
    fontWeight: 600,

    color: '#181818',
    lineHeight: '104.5%'
  },
  slugTypo: {
    fontSize: 14,
    fontWeight: 600,

    color: '#54658F',
    lineHeight: '104.5%'
  },
  percentTypo: {
    fontSize: 18,
    fontWeight: 600,

    color: '#54658F',
    lineHeight: '104.5%'
  },
  proposal: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 17,
    borderBottom: '0.5px solid #54658F22',
    marginBottom: 17
  },
  distributionProposalSection: {
    background: 'transparent',
    border: '1px dashed #788BA2',
    boxSizing: 'border-box',
    borderRadius: 17,
    marginTop: 24,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '30px 14px',
    textAlign: 'center',
    [theme.breakpoints.down('md')]: {
      padding: '30px 60px'
    },
    [theme.breakpoints.down('sm')]: {
      padding: '30px'
    }
  },
  startBtn: {
    background: 'linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)',
    borderRadius: 77,
    padding: '17px 33px',
    color: '#ffffff',
    fontSize: 18,

    lineHeight: '18px',
    cursor: 'pointer',
    marginTop: 11,
    display: 'flex',
    alignItems: 'center'
  }
}));
