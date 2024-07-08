import { makeStyles } from '@material-ui/core/styles';

export const chatStyles = makeStyles((theme) => ({
  title: {
    fontSize: 22,
    fontWeight: 800,

    lineHeight: '130%',
    color: '#2D3047',
    [theme.breakpoints.down('xs')]: {
      fontSize: 20
    }
  },
  flexBox: {
    display: 'flex',
    alignItems: 'center'
  },
  discussionContent: {
    borderRadius: 12,
    background: '#ffffff',
    height: 610,
    textAlign: 'center'
    // padding: theme.spacing(2),
  },
  proposalSection: {
    marginTop: 40,
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
    background: '#ffffff',
    border: '1px dashed #788BA2',
    boxSizing: 'border-box',
    borderRadius: 17,
    marginTop: 70,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '30px 90px',
    textAlign: 'center',
    [theme.breakpoints.down('md')]: {
      padding: '30px 60px'
    },
    [theme.breakpoints.down('sm')]: {
      padding: '30px'
    }
  },
  startBtn: {
    background: '#54658F',
    borderRadius: 77,
    height: 30,
    padding: '0 16.5px',
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 600,

    lineHeight: '18px',
    cursor: 'pointer',
    marginTop: 11,
    display: 'flex',
    alignItems: 'center'
  },
  discussionHeaderSelected: {
    background: '#ffffff',
    marginBottom: '10px',
    padding: '14px',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '14px',
    color: '#707582',
    cursor: 'pointer',
    textOverflow: 'ellipsis',
    border: '2px solid #7f6fff',
    borderRadius: '100vh'
    // boxShadow: "0px 2px 12px rgba(0, 0, 0, 0.1)",
  },
  discussionHeader: {
    background: '#ffffff',
    marginBottom: '10px',
    padding: '14px',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '14px',
    color: '#707582',
    cursor: 'pointer',
    textOverflow: 'ellipsis',
    borderRadius: '100vh',
    boxShadow: '0px 2px 12px rgba(0, 0, 0, 0.1)'
  },
  titleTopic: {
    fontSize: '16px',
    fontWeight: 'bold',
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  },
  lastMessageTopic: {
    fontSize: '14px',
    marginTop: '10px',
    marginBottom: '5px',
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  },
  lastMessageDateTopic: {
    fontSize: '10px',
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  }
}));
