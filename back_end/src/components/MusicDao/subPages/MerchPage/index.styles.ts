import { makeStyles } from '@material-ui/core/styles';

export const usePageStyles = makeStyles((theme) => ({
  root: {
    overflow: 'auto',
    height: '100%',
    position: 'relative'
  },
  content: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    maxWidth: 1440,
    marginLeft: 'auto',
    marginRight: 'auto',
    color: '#2D3047',
    padding: '48px 167px 150px',
    [theme.breakpoints.down('md')]: {
      padding: `60px 16px 150px`
    },
    [theme.breakpoints.down('xs')]: {
      padding: `60px 16px 150px`
    }
  },
  title: {
    fontFamily: "'Pangram'",
    fontStyle: "normal",
    fontWeight: 700,
    fontSize: 52,
    textTransform: "capitalize",
    color: "#FFFFFF",
    textShadow: '0px 0px 20px rgba(255, 255, 255, 0.3)',
    [theme.breakpoints.down('md')]: {
      fontSize: 36,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 26,
    }
  },
  description: {
    fontFamily: "'Pangram'",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: 22,
    letterSpacing: "0.02em",
    color: "#FFFFFF",
    opacity: 0.7,
    marginTop: 9,
    [theme.breakpoints.down('md')]: {
      fontSize: 18,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 16,
    },
  },
  topBtnRow: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 26,
    marginBottom: 4,
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 60,
    marginBottom: 4,
    [theme.breakpoints.down('xs')]: {
      marginTop: 30,
    },
  },
  title1: {
    fontFamily: "'Pangram'",
    fontStyle: "normal",
    fontWeight: 700,
    fontSize: "32px",
    color: "#FFFFFF",
    textShadow: '0px 0px 20px rgba(255, 255, 255, 0.3)',
    [theme.breakpoints.down('xs')]: {
      fontSize: 20,
    },
  },
  title2: {
    fontFamily: "'Pangram'",
    fontStyle: "normal",
    fontWeight: 700,
    fontSize: "32px",
    color: "#2D3047",
    textShadow: '0px 0px 20px rgba(255, 255, 255, 0.3)',
    [theme.breakpoints.down('xs')]: {
      fontSize: 20,
    },
  },
  merchCard: {
    background: "#FFFFFF",
    border: "1px solid rgba(84, 101, 143, 0.2)",
    boxSizing: "border-box",
    boxShadow: "0px 10.1691px 20.3382px rgba(19, 45, 38, 0.07), 0px 6.11809px 6.9921px -6.9921px rgba(0, 0, 0, 0.2)",
    borderRadius: 23,
    padding: 8,
    display: "flex",
    flexDirection: "column",
    "& .imageContainer": {
      height: 238,
      width: "100%",
      position: "relative",
      borderRadius: 12,
      overflow: "hidden",
      borderBottom: "solid 1px rgba(84, 101, 143, 0.3)",
      "& .image": {
        width: "100%",
        height: "100%",
        backgroundSize: "cover",
      }
    },
    "& .name": {
      padding: 10,
      fontFamily: "'Pangram'",
      fontStyle: "normal",
      fontWeight: 700,
      fontSize: 18,
      color: "#2D3047",
      [theme.breakpoints.down('xs')]: {
        fontSize: 15,
      },
    },
    "& .info": {
      background: "#EEF2FD",
      padding: 10,
      display: "flex",
      flexDirection: "column",
      gridGap: 10,
      borderRadius: 12,
    },
    "& .artist-info": {
      display: "flex",
      alignItems: "center",
      "& .avatar": {
        width: 18,
        height: 18,
        borderRadius: 9,
      },
      "& .artist": {
        fontFamily: "'Pangram'",
        fontStyle: "normal",
        fontWeight: 700,
        fontSize: 12,
        color: "#2D3047",
        opacity: 0.6,
        [theme.breakpoints.down('xs')]: {
          fontSize: 12,
        },
      },
      "& .btn-buy": {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "0px 8px",
        background: "#969EB4 !important",
        fontFamily: "'Pangram'",
        fontStyle: "normal",
        fontWeight: 700,
        letterSpacing: "0.02em",
        textTransform: "uppercase",
        color: "#FFFFFF !important",
        height: "30px !important",
        fontSize: "14px !important",
        borderRadius: "18px",
        [theme.breakpoints.down('xs')]: {
          height: "26px",
          fontSize: "12px",
        },
      },
    },
    "& .divider": {
      height: 1,
      width: "100%",
      opacity: 0.7,
      background: "rgba(84, 101, 143, 0.3)"
    },
    "& .price-info": {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      "& .date": {
        fontFamily: "'Pangram'",
        fontStyle: "normal",
        fontWeight: 700,
        fontSize: "18px",
        color: "#2D3047",
        "& .gray": {
          opacity: 0.6,
        },
        [theme.breakpoints.down('xs')]: {
          fontSize: 14,
        },
      },
      "& .price": {
        fontFamily: "'Pangram'",
        fontStyle: "normal",
        fontWeight: 700,
        fontSize: "17px",
        color: "#0D59EE",
        [theme.breakpoints.down('xs')]: {
          fontSize: 13,
        },
      }
    }
  },
  merchCapsuleCard: {
    height: 520,
    background: "#FFFFFF",
    borderRadius: 20,
    display: 'flex',
    flexDirection: "column",
    alignItems: "center",
    [theme.breakpoints.down('xs')]: {
      height: 370,
    },
    "& .imageContainer": {
      height: 340,
      width: "100%",
      padding: "8px 8px 0px",
      position: "relative",
      [theme.breakpoints.down('xs')]: {
        height: 200,
      },
      "& .image": {
        width: "100%",
        height: "100%",
        borderRadius: 15,
        backgroundSize: "cover",
      }
    },
    "& .avatar": {
      width: 46,
      height: 46,
      borderRadius: 30,
      marginTop: -23,
      zIndex: 1,
      border: "4px solid #FFFFFF",
      boxShadow: "1px 4px 4px rgba(0, 0, 0, 0.14)"
    },
    "& .collection": {
      fontFamily: "'Pangram'",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "18px",
      lineHeight: "22px",
      color: "#2D3047",
      marginTop: 14,
      padding: "0px 22px",
      [theme.breakpoints.down('xs')]: {
        fontSize: 15,
      },
    },
    "& .author": {
      fontFamily: "'Pangram'",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "13px",
      lineHeight: "16px",
      color: "#2D3047",
      opacity: 0.7,
      marginTop: 5,
      padding: "0px 22px",
      [theme.breakpoints.down('xs')]: {
        fontSize: 14,
      },
    },
    "& .description": {
      fontFamily: "'Pangram'",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "13px",
      lineHeight: "150%",
      textAlign: "center",
      color: "#2D3047",
      opacity: 0.7,
      marginTop: 14,
      padding: "0px 22px",
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      WebkitLineClamp: 3,
      display: '-webkit-box',
      WebkitBoxOrient: 'vertical',
      [theme.breakpoints.down('xs')]: {
        fontSize: 10,
      },
    },
  },
}));
