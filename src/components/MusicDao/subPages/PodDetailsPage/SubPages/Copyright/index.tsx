import React, { useEffect, useState, useMemo } from 'react';

import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Grid from '@material-ui/core/Grid';

import Box from 'shared/ui-kit/Box';
import { MasonryGrid } from 'shared/ui-kit/MasonryGrid/MasonryGrid';
import MediaNFTCard from './MediaNFTCard';
import CreateNFTModal from '../../../../modals/CreateNFTModal';

import { useCopyRightStyles } from './index.styles';
import { useTypedSelector } from 'store/reducers/Reducer';
import { PrimaryButton } from 'shared/ui-kit';
import {
  CustomTable,
  CustomTableCellInfo,
  CustomTableHeaderInfo
} from 'shared/ui-kit/Table';
import { musicDaoGetCopyrightNFTsByPod } from 'shared/services/API';
import { formatNumber } from 'shared/functions/commonFunctions';

const checkValidate = (value) => {
  if (value && value >= 0) {
    return value;
  }
  return 0;
};

const COLUMNS_COUNT_BREAK_POINTS_FOUR = {
  375: 1,
  600: 2,
  1000: 3,
  1440: 4
};

const TABLEHEADER: Array<CustomTableHeaderInfo> = [
  {
    headerName: 'Account',
    headerAlign: 'center'
  },
  {
    headerName: 'Token Amount',
    headerAlign: 'center'
  },
  {
    headerName: 'Copyright %',
    headerAlign: 'center'
  }
];

const Copyright = (props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { pod, podInfo } = props;

  const classes = useCopyRightStyles();

  const userSelector = useTypedSelector((state) => state.user);

  const [mediaNFTs, setMediaNFTs] = useState<any[]>([]);

  const [openCreateNFTModal, setOpenCreateNFTModal] = useState<boolean>(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const resp = await musicDaoGetCopyrightNFTsByPod(pod.Id);
    if (resp.success) {
      setMediaNFTs(resp.data);
    }
  };

  const totalSupply = useMemo(
    () => +pod.FundingTarget / +pod.FundingPrice,
    [pod]
  );

  const getTableData = () => {
    const tableData: Array<Array<CustomTableCellInfo>> = [];
    pod.ClaimedStatus &&
      Object.keys(pod.ClaimedStatus).forEach((claimer) => {
        const row: Array<CustomTableCellInfo> = [];
        row.push({
          cell: (
            <Box>
              {isMobile
                ? `${claimer.slice(0, 5)}...${claimer.slice(
                    claimer.length - 5
                  )}`
                : claimer}
            </Box>
          ),
          cellAlign: 'center'
        });
        row.push({
          cell: (
            <Box>
              {formatNumber(
                checkValidate(pod.ClaimedStatus[claimer]),
                pod.TokenSymbol,
                4
              )}
            </Box>
          ),
          cellAlign: 'center'
        });
        row.push({
          cell: (
            <Box>
              {Math.round(
                (pod.ClaimedStatus[claimer] / +pod.TotalSupplyPod) * 100
              )}
              %
            </Box>
          ),
          cellAlign: 'center'
        });
        tableData.push(row);
      });
    return tableData;
  };

  const copyrightShare = useMemo(() => {
    const claimed =
      (pod.ClaimedStatus && pod.ClaimedStatus[userSelector.id]) || 0;
    return pod.TotalSupplyPod
      ? Math.round((claimed / pod.TotalSupplyPod) * 100)
      : 0;
  }, [pod, userSelector]);

  return (
    <Box className={classes.container}>
      <Box
        className={classes.title}
        mt={isMobile ? 4 : 8}
        mb={isMobile ? 2 : 3}
      >
        Your Media Fractions
      </Box>
      <Box className={classes.whiteBox}>
        <Grid container>
          <Grid
            item
            xs={5}
            sm={4}
            style={{
              borderRight: '1px solid #E8E8E8'
            }}
          >
            <Box>
              <Box className={`${classes.h1} ${classes.bgGradient}`}>
                {(
                  (pod.ClaimedStatus && pod.ClaimedStatus[userSelector.id]) ||
                  0
                ).toFixed(0)}
              </Box>
              <Box className={`${classes.h3} ${classes.bgGradient}`}>
                Media Fractions
              </Box>
            </Box>
          </Grid>
          <Grid item xs={7} sm={4} className={classes.fractionItem}>
            <Box>
              <Box className={classes.h1}>{copyrightShare}%</Box>
              <Box className={classes.h3} color="#54658F">
                Your Copyright Share
              </Box>
            </Box>
          </Grid>
          {pod.ClaimedStatus && pod.ClaimedStatus[userSelector.id] && (
            <Grid
              item
              xs={12}
              sm={4}
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                paddingTop: isMobile ? '20px' : '0'
              }}
            >
              <PrimaryButton
                onClick={() => setOpenCreateNFTModal(true)}
                size="small"
                style={{
                  borderRadius: '30px',
                  height: '40px',
                  padding: '8px 26px',

                  fontStyle: 'normal',
                  fontWeight: 'bold',
                  fontSize: isMobile ? '14px' : '16px',
                  lineHeight: '20px',
                  textAlign: 'center',
                  background: '#2D3047'
                }}
                isRounded
              >
                Create NFT
              </PrimaryButton>
            </Grid>
          )}
        </Grid>
      </Box>
      <Box
        className={classes.title}
        mt={isMobile ? 4 : 8}
        mb={isMobile ? 2 : 3}
      >
        Distribution overview
      </Box>
      <CustomTable
        headers={TABLEHEADER}
        rows={getTableData()}
        theme="transaction"
      />
      {mediaNFTs && mediaNFTs.length > 0 && (
        <>
          <Box
            className={classes.title}
            mt={isMobile ? 4 : 8}
            mb={isMobile ? 2 : 3}
          >
            Created NFT
          </Box>
          <MasonryGrid
            gutter={'24px'}
            data={mediaNFTs}
            renderItem={(item, _) => <MediaNFTCard pod={pod} nft={item} />}
            columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
          />
        </>
      )}
      {openCreateNFTModal && (
        <CreateNFTModal
          open={openCreateNFTModal}
          onClose={() => setOpenCreateNFTModal(false)}
          pod={pod}
          handleRefresh={() => loadData()}
        />
      )}
    </Box>
  );
};

export default Copyright;
