import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Color } from 'shared/ui-kit';

export const addCreatorModalStyles = makeStyles((theme) => ({
  root: {
    maxWidth: '653px'
  },
  contentBox: {
    padding: theme.spacing(1),
    color: '#2D3047',
    textAlign: 'center'
  },
  flexBox: {
    display: 'flex',
    alignItems: 'center'
  },
  header1: {
    fontSize: 22,
    fontWeight: 800,
    lineHeight: '28.6px',
    color: '#2D3047'
  },
  header2: {
    fontSize: 16,
    fontWeight: 500,
    lineHeight: '24px',
    color: '#54658F',
    padding: '0px 30px'
  },
  header3: {
    fontSize: 16,
    fontWeight: 800,
    lineHeight: '20.8px',
    color: '#2D3047'
  },
  greenBox: {
    fontSize: 18,
    fontWeight: 700,
    lineHeight: '18.81px',
    textTransform: 'uppercase',
    color: Color.MusicDAOGreen,
    padding: theme.spacing(4),
    background: 'linear-gradient(0deg, #F2FBF6, #F2FBF6), #17172D'
  },
  number: {
    fontSize: 28,
    fontWeight: 800,
    color: '#2D3047'
  },
  inputBox: {
    background: 'rgba(218, 230, 229, 0.4)',
    width: '100%',
    border: '1px solid #DADADB',
    borderRadius: '8px',
    height: 54,
    marginTop: theme.spacing(1),
    paddingLeft: theme.spacing(1)
  },
  urlSlug: {
    fontSize: 16,
    color: '#404658',
    maxWidth: 120,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    marginLeft: 10,
    whiteSpace: 'nowrap'
  },
  renderItemBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 26px',
    width: '100%',
    [theme.breakpoints.down(560)]: {
      paddingLeft: '0px'
    }
  },
  roleContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column'
    }
  },
  roleName: {
    width: '70%',
    [theme.breakpoints.down('xs')]: {
      width: '100%'
    }
  },
  fractions: {
    flex: 1,
    marginLeft: theme.spacing(1),
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      marginTop: theme.spacing(2),
      marginLeft: 0
    }
  },
  buttonFlexBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      '& > button': {
        width: '100%'
      },
      '& > button:nth-child(2)': {
        marginLeft: 0,
        marginTop: theme.spacing(1)
      }
    }
  }
}));

export const useAutocompleteStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    background: 'rgba(218, 230, 229, 0.4)',
    border: '1px solid #DADADB',
    borderRadius: 8,
    marginTop: 8,
    '& .MuiInputBase-root': {
      padding: '0 24px',
      width: '100%',
      [theme.breakpoints.down('xs')]: {
        padding: '0 12px'
      }
    }
  },
  paper: {
    borderRadius: 24,
    boxShadow:
      '0px 9px 9px -4px rgba(86, 101, 123, 0.15), 0px 28px 41px -1.17748px rgba(42, 52, 65, 0.12)'
  },
  listbox: {
    borderRadius: 24,
    background: 'rgba(255, 255, 255, 0.4)',
    border: '1px solid #DEE7DA',
    padding: 0
  },
  option: {
    padding: 0,
    borderBottom: '1px solid #00000021',
    '&:last-child': {
      borderBottom: 'none'
    }
  },
  input: {
    height: 54,
    boxSizing: 'border-box',
    fontSize: 16,
    fontWeight: 600,

    color: '#2D3047',
    [theme.breakpoints.down('xs')]: {
      fontSize: 14
    }
  }
}));
