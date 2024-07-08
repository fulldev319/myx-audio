import { makeStyles } from '@material-ui/core/styles';

export const messageNotificationsStyles = makeStyles({
  message_notifications: {
    minWidth: 350
  },
  message_notifications_header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  edit_icon: {
    cursor: 'pointer',
    color: '#0D59EE',
  },
  item_list: {
    marginTop: 30,
    cursor: 'pointer',
    '& .item': {
      marginTop: 10,
      marginBottom: 28,
      display: 'flex',
      alignItems: 'center',
    },
    '& .avatar-container': {
      borderRadius: '50%',
      backgroundColor: 'white',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      filter: 'drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.2))',
      width: 54,
      minWidth: 54,
      height: 54,
      marginRight: 20
    },
    '& .avatar-container .avatar': {
      width: 48,
      height: 48,
      borderRadius: '50%'
    },
    '& .item-content': {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start'
    },
    '& .item-content .name': {
      marginBottom: 3,
      fontSize: 14,
      "fontFamily": "'Pangram Regular'",
      "fontStyle": "normal",
      "fontWeight": 700,
      "lineHeight": "104.5%",
      "color": "#707582",
    },
    '& .item-content .message': {
      marginBottom: 3,
      "fontFamily": "'Pangram Regular'",
      "fontStyle": "normal",
      "fontWeight": 400,
      "fontSize": "14px",
      "lineHeight": "104.5%",
      "color": "#707582"
    },
    '& .item-content .date': {
      marginBottom: 3,
      "fontFamily": "'Pangram Regular'",
      "fontStyle": "normal",
      "fontWeight": 400,
      "fontSize": "11px",
      "lineHeight": "104.5%",
      "color": "#707582",
      '& time': {
        color: '#0D59EE',
      }
    }
  },
  message_notifications_footer: {
    paddingTop: 20,
    paddingBottom: 5,
    borderTop: '0.5px solid #99A1B3',
    textAlign: 'center',
    color: '#99A1B3',
    cursor: 'pointer'
  }
});
