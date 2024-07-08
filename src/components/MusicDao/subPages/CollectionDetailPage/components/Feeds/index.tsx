import React, { useEffect, useState } from 'react';
import clsx from 'clsx';

import { useMediaQuery, useTheme } from '@material-ui/core';
import { useHistory, useParams } from 'react-router-dom';

import Box from 'shared/ui-kit/Box';
import Avatar from 'shared/ui-kit/Avatar';
import { getDefaultAvatar } from 'shared/services/user/getUserAvatar';
import { usePageStyles } from './index.styles';
import { listenerSocket } from 'components/Login/Auth';
import { getSongNftFeed } from 'shared/services/API';
import Moment from 'react-moment';
import InfiniteScroll from 'react-infinite-scroll-component';
import useWindowDimensions from 'shared/hooks/useWindowDimensions';
import { Skeleton } from '@material-ui/lab';

export default function FeedsSubPage({ collection }) {
  const classes = usePageStyles();
  const history = useHistory();
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  const [transactions, setTransactions] = useState<any[]>([]);
  const [transactionloading, setTransactionLoading] = useState<boolean>(false);
  const [transactionHasMore, setTransactionHasMore] = useState<boolean>(false);
  const [lastTransactionId, setLastTransactionId] = useState<any>();
  const width = useWindowDimensions().width;
  const loadingCount = React.useMemo(
    () => (width > 1000 ? 4 : width > 600 ? 1 : 2),
    [width]
  );

  useEffect(() => {
    if (collection) {
      loadTransactions(true);
    }
  }, [collection]);

  useEffect(() => {
    if (listenerSocket) {
      const updateMarketPlaceFeedHandler = (_transaction) => {
        if (_transaction.collection !== collection.address) {
          return;
        }

        setTransactions((prev) => {
          let _transactions = prev.map((transaction) =>
            _transaction.id === transaction.id ? _transaction : transaction
          );
          if (
            _transactions.length === 0 ||
            _transactions[0].createdAt <= _transaction.createdAt
          ) {
            _transactions = [_transaction].concat(_transactions);
          }
          return _transactions;
        });
      };

      listenerSocket.on('updateMarketPlaceFeed', updateMarketPlaceFeedHandler);

      return () => {
        listenerSocket.removeListener(
          'updateMarketPlaceFeed',
          updateMarketPlaceFeedHandler
        );
      };
    }
  }, [listenerSocket]);

  const loadTransactions = async (init = false) => {
    if (transactionloading) return;
    try {
      setTransactionLoading(true);

      const response = await getSongNftFeed({
        collectionId: collection.address,
        lastId: init ? undefined : lastTransactionId,
        type: undefined
      });
      if (response.success) {
        const newCharacters = response.data.list;
        const newLastId = response.data.lastId;
        const newhasMore = response.data.hasMore;

        setTransactions((prev) =>
          init ? newCharacters : [...prev, ...newCharacters]
        );
        setLastTransactionId(newLastId);
        setTransactionHasMore(newhasMore);
      } else {
        setTransactions([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setTransactionLoading(false);
    }
  };

  const shortId = (id) => {
    if (!id || id.length < 12) {
      return id;
    }
    return id.substring(0, 6) + '...' + id.substring(id.length - 4);
  };

  const handleGotoNFT = (collection, tokenId) => {
    history.push(`/music/web3-track/${collection}-${tokenId}`);
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.feedContainer}>
        <Box
          className={classes.feedHeader}
          p={isMobile ? '22px 20px' : isTablet ? '20px 30px' : '25px 50px'}
        >
          <Box width={'20%'}>NFT</Box>
          <Box width={'30%'}>Account</Box>
          <Box width={'10%'} textAlign="center">
            Price
          </Box>
          <Box width={'10%'} textAlign="center">
            Date
          </Box>
          <Box width={'20%'} textAlign="center">
            Transaction Type
          </Box>
        </Box>
        <Box>
          <InfiniteScroll
            hasChildren={transactions?.length > 0}
            dataLength={transactions?.length}
            scrollableTarget={'scrollContainer'}
            next={loadTransactions}
            hasMore={transactionHasMore}
            loader={
              transactionloading && (
                <div
                  style={{
                    paddingTop: 8,
                    paddingBottom: 8
                  }}
                >
                  {Array(loadingCount)
                    .fill(0)
                    .map((_, index) => (
                      <Box
                        className={classes.listLoading}
                        mb={1.5}
                        key={`listLoading_${index}`}
                      >
                        <Skeleton variant="rect" width={60} height={60} />
                        <Skeleton
                          variant="rect"
                          width="40%"
                          height={24}
                          style={{ marginLeft: '8px' }}
                        />
                        <Skeleton
                          variant="rect"
                          width="20%"
                          height={24}
                          style={{ marginLeft: '8px' }}
                        />
                        <Skeleton
                          variant="rect"
                          width="20%"
                          height={24}
                          style={{ marginLeft: '8px' }}
                        />
                      </Box>
                    ))}
                </div>
              )
            }
          >
            {transactions.map((item, index) => (
              <Box
                display={'flex'}
                alignItems="center"
                borderBottom="1px solid #00000010"
                p={
                  isMobile ? '22px 20px' : isTablet ? '20px 30px' : '25px 50px'
                }
              >
                <Box width={'20%'} display="flex" alignItems="center">
                  <Avatar size={46} rounded image={getDefaultAvatar()} />
                  <Box display="flex" flexDirection="column" ml={1.5}>
                    <Box className={classes.typo2} mb={0.5}>
                      {item.name}
                    </Box>
                    <Box className={classes.typo3}>{collection.name}</Box>
                  </Box>
                </Box>
                <Box width={'30%'} className={classes.typo4}>
                  {shortId(item.to)}
                </Box>
                <Box width={'11%'} textAlign="center">
                  {item.price ? `${Number(item.price).toFixed(4)} ${item.symbol ? item.symbol : 'USDT'}` : '-'}
                </Box>
                <Box width={'11%'} textAlign="center">
                  <Moment fromNow>{+item.id}</Moment>
                </Box>
                <Box width={'16%'} display="flex" justifyContent={'center'}>
                  <Box
                    className={classes.transferType}
                    style={{
                      background:
                        item.type.toLowerCase() === 'transfer'
                          ? '#65CB63'
                          : item.type.toLowerCase() === 'sold'
                            ? '#29BAF9'
                            : item.type.toLowerCase() === 'mint'
                              ? '#2D3047'
                              : item.type.toLowerCase() === 'approved'
                                ? '#65CB63'
                                : item.type.toLowerCase() === 'blocked'
                                  ? '#F43E5F'
                                  : item.type.toLowerCase() === 'rented'
                                    ? '#29BAF9'
                                    : '#65CB63'
                    }}
                  >
                    {item.type}
                  </Box>
                </Box>
                <Box
                  width={'10%'}
                  display="flex"
                  justifyContent={'end'}
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleGotoNFT(item.collection, item.tokenId)}
                >
                  <LeftIcon />
                </Box>
              </Box>
            ))}
          </InfiniteScroll>
        </Box>
      </Box>
    </Box>
  );
}

const LeftIcon = () => (
  <svg
    width="6"
    height="11"
    viewBox="0 0 6 11"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1 10L5 5.5L1 1"
      stroke="#2D3047"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);
