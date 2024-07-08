import React, { useState, useEffect } from 'react';

import { Modal } from 'shared/ui-kit';
import {
  CustomTable,
  CustomTableCellInfo,
  CustomTableHeaderInfo
} from 'shared/ui-kit/Table';
import Box from 'shared/ui-kit/Box';
import Avatar from 'shared/ui-kit/Avatar';
import { formatDateDefault } from 'shared/helpers';
import { getDefaultAvatar } from 'shared/services/user/getUserAvatar';

import { modalStyles } from './index.styles';

const TableHeaders: Array<CustomTableHeaderInfo> = [
  {
    headerAlign: 'left',
    headerName: 'Account'
  },
  {
    headerAlign: 'left',
    headerName: 'Date'
  }
];

const OwnerShipHistoryModal = (props) => {
  const classes = modalStyles();

  const [tableData, setTableData] = useState<Array<Array<CustomTableCellInfo>>>(
    []
  );

  const handleGotoPolygon = (hash) => {
    const isProd = process.env.REACT_APP_ENV === 'prod';
    window.open(
      `https://${!isProd ? 'mumbai.' : ''}polygonscan.com/tx/${hash}`,
      '_blank'
    );
  };

  useEffect(() => {
    setTableData(
      (props.songDetailData?.ownerHistory || []).map((v) => {
        let imageUrl = '';
        if (v.urlIpfsImage?.startsWith('/assets')) {
          const lastIndex = v.urlIpfsImage.lastIndexOf('/');
          imageUrl = require(`assets/anonAvatars/${v.urlIpfsImage.substr(
            lastIndex + 1
          )}`);
        } else {
          imageUrl = v.urlIpfsImage ?? getDefaultAvatar();
        }
        return [
          {
            cellAlign: 'center',
            cell: (
              <Box display="flex" alignItems="center">
                <Avatar size={34} rounded image={imageUrl} />
                <Box ml={1}>
                  {v.name
                    ? v.name.replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
                        letter.toUpperCase()
                      )
                    : v.owner}
                </Box>
              </Box>
            )
          },
          {
            cellAlign: 'center',
            cell: (
              <Box display="flex" alignItems="center" justifyContent="end">
                <Box mr={2}>{formatDateDefault(v.timestamp)}</Box>
                <Box onClick={() => handleGotoPolygon(v?.hash)}>
                  <ShareIcon />
                </Box>
              </Box>
            )
          }
        ];
      })
    );
  }, []);

  return (
    <Modal
      size="daoMedium"
      isOpen={props.open}
      onClose={props.onClose}
      showCloseIcon
      className={classes.root}
    >
      <div className={classes.container}>
        <Box className={classes.title}>ownership history</Box>
        <CustomTable
          headers={TableHeaders}
          rows={tableData}
          placeholderText="No ownership history"
          theme="transaction_noShadow"
        />
      </div>
    </Modal>
  );
};

const ShareIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17 1.00001L6.99997 11M17 1.00001L17 7.00001M17 1.00001L11 1M7 1.00001H1V17H17V11"
      stroke="#65CB63"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default OwnerShipHistoryModal;
