import React, { useState, useEffect, useRef, useMemo } from 'react';

import { Modal } from 'shared/ui-kit';
import {
  CustomTable,
  CustomTableCellInfo,
  CustomTableHeaderInfo
} from 'shared/ui-kit/Table';
import Box from 'shared/ui-kit/Box';
import Avatar from 'shared/ui-kit/Avatar';

import { modalStyles } from './index.styles';

const TableHeaders: Array<CustomTableHeaderInfo> = [
  {
    headerAlign: 'left',
    headerName: 'Account'
  },
  {
    headerAlign: 'center',
    headerName: 'ID'
  },
  {
    headerAlign: 'center',
    headerName: 'Owner since'
  },
  {
    headerAlign: 'center',
    headerName: 'Editions Held'
  }
];

const OwnersModal = (props) => {
  const classes = modalStyles();

  const [tableData, setTableData] = useState<Array<Array<CustomTableCellInfo>>>(
    []
  );

  useEffect(() => {
    setTableData(
      [1, 2, 3, 4, 5].map((v) => {
        return [
          {
            cellAlign: 'center',
            cell: (
              <Box display="flex" alignItems="center">
                <Avatar
                  size={34}
                  rounded
                  image={require('assets/anonAvatars/ToyFaces_Colored_BG_111.webp')}
                />
                <Box ml={1}>0xcdwed...dssdaw23rfzdsasd</Box>
              </Box>
            )
          },
          {
            cellAlign: 'center',
            cell: <div>#2244</div>
          },
          {
            cellAlign: 'center',
            cell: <div>22.12.2021</div>
          },
          {
            cellAlign: 'center',
            cell: <div>2</div>
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
        <Box className={classes.title}>owners</Box>
        <CustomTable
          headers={TableHeaders}
          rows={tableData}
          placeholderText="No owners"
          theme="transaction_noShadow"
        />
      </div>
    </Modal>
  );
};

export default OwnersModal;
