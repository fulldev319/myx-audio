import { makeStyles } from '@material-ui/core/styles';

export const useWorkSpaceStyles = makeStyles((theme) => ({
  titleBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: 22,
    color: 'white',
    fontWeight: 800,
    lineHeight: '130%',
    marginTop: 40,
    marginBottom: 32,
    [theme.breakpoints.down('xs')]: {
      fontSize: 20,
      flexDirection: 'column',
      alignItems: 'start'
    }
  },
  buttonFont: {
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: 16,
    lineHeight: '120%',
    color: '#FFFFFF'
  },
  centerBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  sectionBox: {
    paddingTop: 16,
    paddingBottom: 24
  },
  tooltip: {
    background: '#54658F',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    borderRadius: 16,
    width: 180,
    fontSize: 13,
    fontWeight: 500,
    padding: '8px 16px'
  },
  editionBall: {
    width: 32,
    height: 32,
    borderRadius: '100vh',
    border: '2px solid #FFFFFF',
    filter: 'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.15))',
    marginRight: 16,
    cursor: 'pointer'
  }
}));
