import React from 'react';

import TableContainer from '@material-ui/core/TableContainer';
import makeStyles from '@material-ui/core/styles/makeStyles';

import Box from 'shared/ui-kit/Box';
import { musicDaoPageStyles } from 'components/MusicDao/index.styles';
import { Text } from 'components/MusicDao/components/ui-kit';
import {
  FontSize,
  Color,
  StyledDivider,
  SecondaryButton,
  PrimaryButton,
  Variant
} from 'shared/ui-kit';
import { EtherScanIcon } from 'components/MusicDao/components/Icons/SvgIcons';
import { ArrowLeftIcon, BackIcon } from '../GovernancePage/styles';
import { useHistory } from 'react-router-dom';
import AddLiquidityModal from 'components/MusicDao/modals/AddLiquidity';
import {
  CustomTable,
  CustomTableCellInfo,
  CustomTableHeaderInfo
} from 'shared/ui-kit/Table';

const useStyles = makeStyles((theme) => ({
  container: {
    background:
      'linear-gradient(180deg, rgba(243, 254, 247, 0) 49.94%, #F0F5F8 96.61%), linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)',
    height: '100%',
    padding: '30px 45px'
  },
  table: {
    borderRadius: 12,
    background: Color.White,
    marginBottom: 40,
    '& .MuiTableCell-root': {
      fontSize: 14,
      color: Color.MusicDAODark
    },
    '& .MuiTableCell-root.MuiTableCell-head': {
      borderBottom: `1px solid ${Color.MusicDAOGreen}`
    },
    '& .MuiTableCell-head': {
      fontWeight: 'bold'
    }
  },
  tableHightlight: {
    fontWeight: 600,
    fontSize: '16px !important',
    color: `${Color.MusicDAOGreen} !important`
  },
  header1: {
    fontSize: 32,
    fontWeight: 600,
    color: Color.MusicDAODark,
    '& span': {
      opacity: 0.4
    }
  },
  header2: {
    fontSize: 20,
    fontWeight: 600,
    color: Color.MusicDAOGreen
  }
}));

const TABLEHEADER: Array<CustomTableHeaderInfo> = [
  {
    headerName: 'All',
    headerAlign: 'center'
  },
  {
    headerName: 'Range Min',
    headerAlign: 'center'
  },
  {
    headerName: 'Range Max',
    headerAlign: 'center'
  },
  {
    headerName: 'Total Amount',
    headerAlign: 'center'
  },
  {
    headerName: 'Account',
    headerAlign: 'center'
  },
  {
    headerName: 'Time',
    headerAlign: 'center'
  },
  {
    headerName: 'Token',
    headerAlign: 'center'
  },
  {
    headerName: 'Etherscan',
    headerAlign: 'center'
  }
];

const Transactions = [
  {
    Token: 'USDT',
    RangeMin: 74.3,
    RangeMax: 84.3,
    TotalAmount: 24.4,
    Account: '0xcD242...294',
    Time: '1 minute ago'
  },
  {
    Token: 'ETH',
    RangeMin: 74.3,
    RangeMax: 84.3,
    TotalAmount: 24.4,
    Account: '0xcD242...294',
    Time: '1 minute ago'
  },
  {
    Token: 'BNB',
    RangeMin: 74.3,
    RangeMax: 84.3,
    TotalAmount: 24.4,
    Account: '0xcD242...294',
    Time: '1 minute ago'
  },
  {
    Token: 'BAL',
    RangeMin: 74.3,
    RangeMax: 84.3,
    TotalAmount: 24.4,
    Account: '0xcD242...294',
    Time: '1 minute ago'
  },
  {
    Token: 'USDT',
    RangeMin: 74.3,
    RangeMax: 84.3,
    TotalAmount: 24.4,
    Account: '0xcD242...294',
    Time: '1 minute ago'
  },
  {
    Token: 'BNB',
    RangeMin: 74.3,
    RangeMax: 84.3,
    TotalAmount: 24.4,
    Account: '0xcD242...294',
    Time: '1 minute ago'
  },
  {
    Token: 'USDT',
    RangeMin: 74.3,
    RangeMax: 84.3,
    TotalAmount: 24.4,
    Account: '0xcD242...294',
    Time: '1 minute ago'
  },
  {
    Token: 'USDT',
    RangeMin: 74.3,
    RangeMax: 84.3,
    TotalAmount: 24.4,
    Account: '0xcD242...294',
    Time: '1 minute ago'
  },
  {
    Token: 'ETH',
    RangeMin: 74.3,
    RangeMax: 84.3,
    TotalAmount: 24.4,
    Account: '0xcD242...294',
    Time: '1 minute ago'
  },
  {
    Token: 'USDT',
    RangeMin: 74.3,
    RangeMax: 84.3,
    TotalAmount: 24.4,
    Account: '0xcD242...294',
    Time: '1 minute ago'
  },
  {
    Token: 'BNB',
    RangeMin: 74.3,
    RangeMax: 84.3,
    TotalAmount: 24.4,
    Account: '0xcD242...294',
    Time: '1 minute ago'
  }
];

const LiquidityIntervals = [
  'Liquidity',
  'Rewards',
  'Borrowable Funds',
  'Utility Ratio'
];
const TransactionTypes = ['All', 'Adds', 'Removes'];

export default function LiquidityPosition() {
  const classes = useStyles();
  const commonClasses = musicDaoPageStyles();

  const history = useHistory();

  const [liquidityType, setLiquidityType] = React.useState<string>(
    LiquidityIntervals[0]
  );
  const [transactionType, setTransactionType] = React.useState<string>(
    TransactionTypes[0]
  );

  const [liquidityConfig, setLiquidityConfig] = React.useState<any>();

  const [openAddLiquidityModal, setOpenAddLiquidityModal] =
    React.useState<boolean>(false);

  const handleChangeLiquidity = (type: string) => () => {
    setLiquidityType(type);
  };

  const handleChangeTransaction = (type: string) => () => {
    setTransactionType(type);
  };

  const handleOpenAddLiquidityModal = () => {
    setOpenAddLiquidityModal(true);
  };

  const handleCloseAddLiquidityModal = () => {
    setOpenAddLiquidityModal(false);
  };

  const getTableData = () => {
    const tableData: Array<Array<CustomTableCellInfo>> = [];
    Transactions.map((transaction) => {
      const row: Array<CustomTableCellInfo> = [];
      row.push({
        cell: (
          <Box className={classes.tableHightlight}>Add {transaction.Token}</Box>
        ),
        cellAlign: 'center'
      });
      row.push({
        cell: <Box>{transaction.RangeMin}k</Box>,
        cellAlign: 'center'
      });
      row.push({
        cell: <Box>{transaction.RangeMax}k</Box>,
        cellAlign: 'center'
      });
      row.push({
        cell: <Box>{transaction.TotalAmount}k</Box>,
        cellAlign: 'center'
      });
      row.push({
        cell: (
          <Box className={classes.tableHightlight}>{transaction.Account}</Box>
        ),
        cellAlign: 'center'
      });
      row.push({
        cell: <Box>{transaction.Time}</Box>,
        cellAlign: 'center'
      });
      row.push({
        cell: (
          <img
            src={require(`assets/tokenImages/${transaction.Token}.webp`)}
            width={24}
            alt="token"
          />
        ),
        cellAlign: 'center'
      });
      row.push({
        cell: <EtherScanIcon />,
        cellAlign: 'center'
      });
      tableData.push(row);
    });

    return tableData;
  };

  return (
    <Box className={classes.container}>
      <Box
        mt={5}
        display="flex"
        flexDirection="row"
        className={commonClasses.backButton}
        onClick={() => history.goBack()}
      >
        <BackIcon />
        <Text ml={1} color={Color.White} bold>
          BACK
        </Text>
      </Box>
      <Box display="flex" flexDirection="column" mt={4}>
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          mb={6}
        >
          <Box display="flex" flexDirection="row" alignItems="center">
            <img
              src={require('assets/tokenImages/USDT.webp')}
              alt="token"
              width={50}
            />
            <Box display="flex" flexDirection="column" ml={2}>
              <Text size={FontSize.H3} color={Color.White} bold>
                USDT Liquidity Position
              </Text>
              <Text size={FontSize.XL} color={Color.White}>
                $ 1.456 USD Tether
              </Text>
            </Box>
          </Box>
          <Box display="flex" flexDirection="row" alignItems="center">
            <SecondaryButton
              size="medium"
              className={commonClasses.secondaryButton}
              isRounded
            >
              Unstake
            </SecondaryButton>
            <PrimaryButton
              size="medium"
              className={commonClasses.primaryButton}
              isRounded
            >
              Borrow
            </PrimaryButton>
          </Box>
        </Box>
      </Box>
      <Box
        className={commonClasses.card}
        px={4}
        py={4}
        mb={4}
        display="flex"
        justifyContent="center"
      >
        <Box width={1} display="flex" justifyContent="center">
          <Box>
            <Box className={classes.header1}>
              255.0401 <span>USD</span>
            </Box>
            <Box className={classes.header2}>Liquidity</Box>
          </Box>
        </Box>
        <Box
          width={1}
          display="flex"
          justifyContent="center"
          borderLeft="1px solid #18181822"
          borderRight="1px solid #18181822"
          mx={2}
        >
          <Box>
            <Box className={classes.header1}>
              12 — 24<span>h</span>
            </Box>
            <Box className={classes.header2}>Interval</Box>
          </Box>
        </Box>
        <Box width={1} display="flex" justifyContent="center">
          <Box>
            <Box className={classes.header1}>
              42.4213 <span>USD</span>
            </Box>
            <Box className={classes.header2}>Rewards</Box>
          </Box>
        </Box>
      </Box>
      <Text size={FontSize.XXL} bold>
        Borrowed Liquidity Positions
      </Text>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        mt={3}
      >
        <Box
          className={commonClasses.card}
          width={'48%'}
          px={4}
          py={4}
          style={{ background: '#F4FFF3' }}
        >
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            px={2}
          >
            <Text>Borrowed funds</Text>
            <Text bold>$ 1.456</Text>
          </Box>
          <StyledDivider type="solid" margin={2} />
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            px={2}
          >
            <Text>Date</Text>
            <Text bold>23/06/2021</Text>
          </Box>
          <StyledDivider type="solid" margin={2} />
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            px={2}
          >
            <Text>Amount to repay</Text>
            <Text bold>245 USDT</Text>
          </Box>
          <StyledDivider type="solid" margin={2} />
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            px={2}
          >
            <Text>Time to repay</Text>
            <Text bold>20 Days, 22h 12m 10s</Text>
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="flex-end"
            mt={3}
          >
            <PrimaryButton
              size="medium"
              isRounded
              style={{ width: '50%', backgroundColor: Color.MusicDAOGreen }}
            >
              Repay
            </PrimaryButton>
          </Box>
        </Box>
        <Box
          className={commonClasses.card}
          width={'48%'}
          px={4}
          py={4}
          style={{ background: '#F4FFF3' }}
        >
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            px={2}
          >
            <Text>Borrowed funds</Text>
            <Text bold>$ 1.456</Text>
          </Box>
          <StyledDivider type="solid" margin={2} />
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            px={2}
          >
            <Text>Date</Text>
            <Text bold>23/06/2021</Text>
          </Box>
          <StyledDivider type="solid" margin={2} />
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            px={2}
          >
            <Text>Amount to repay</Text>
            <Text bold>245 USDT</Text>
          </Box>
          <StyledDivider type="solid" margin={2} />
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            px={2}
          >
            <Text>Time to repay</Text>
            <Text bold>20 Days, 22h 12m 10s</Text>
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="flex-end"
            mt={3}
          >
            <PrimaryButton
              size="medium"
              isRounded
              style={{ width: '50%', backgroundColor: Color.MusicDAOGreen }}
            >
              Repay
            </PrimaryButton>
          </Box>
        </Box>
      </Box>
      <Box display="flex" flexDirection="column" mt={4} mb={4}>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Text size={FontSize.XXL} bold>
            Transactions
          </Text>
          <SecondaryButton
            className={commonClasses.showAll}
            size="medium"
            radius={29}
          >
            Show All
            <Box
              position="absolute"
              flexDirection="row"
              top={0}
              right={0}
              pr={2}
            >
              <ArrowLeftIcon />
            </Box>
          </SecondaryButton>
        </Box>
        <Box display="flex" flexDirection="row" mt={5}>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            bgcolor={Color.MusicDAOLightGreen}
            borderRadius={77}
            p={0.5}
          >
            {TransactionTypes.map((item, index) => (
              <button
                key={`transaction-button-${index}`}
                className={`${commonClasses.groupButton} ${
                  item === transactionType && commonClasses.selectedGroupButton
                }`}
                onClick={handleChangeTransaction(item)}
              >
                {item}
              </button>
            ))}
          </Box>
        </Box>
      </Box>
      <TableContainer className={classes.table}>
        <CustomTable
          headers={TABLEHEADER}
          rows={getTableData()}
          placeholderText="No transactions to display"
          theme="transaction"
          variant={Variant.Transparent}
        />
      </TableContainer>
      <Box height="1px" />
      <AddLiquidityModal
        open={openAddLiquidityModal}
        handleClose={handleCloseAddLiquidityModal}
      />
    </Box>
  );
}
