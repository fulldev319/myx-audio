import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';

import Divider from '@material-ui/core/Divider';
import makeStyles from '@material-ui/core/styles/makeStyles';

import { RootState } from 'store/reducers/Reducer';
import Box from 'shared/ui-kit/Box';
import { getRandomAvatarForUserIdWithMemoization } from 'shared/services/user/getUserAvatar';
import { Avatar, Modal, PrimaryButton } from 'shared/ui-kit';
import { TokenSelect } from 'shared/ui-kit/Select/TokenSelect';
import InputWithLabelAndTooltip from 'shared/ui-kit/InputWithLabelAndTooltip';
import { getCryptosRateAsList } from 'shared/services/API';
import { useAlertMessage } from 'shared/hooks/useAlertMessage';
import { IFractionalise, fractionalise } from 'shared/services/API';

const useStyles = makeStyles(() => ({
  modalContainer: {
    padding: '32px 16px !important'
  },
  title: {
    fontWeight: 800,
    fontSize: 14,
    lineHeight: '18px',

    color: '#000000',
    borderBottom: '1px solid #EFF2F8',
    paddingBottom: 20
  },
  digitalArt: {
    fontWeight: 400,
    fontSize: 18,
    lineHeight: '104.5%;',

    margin: '16px 0',
    color: '#181818'
  },
  divider: {
    opacity: 0.2,
    background: '#707582',
    border: '1px solid #707582',
    transform: 'rotate(90deg)'
  },
  currentPrice: {
    fontWeight: 800,
    fontSize: '18px',
    lineHeight: '104.5%',
    color: '#181818'
  },
  roundInputBox: {
    background: '#F7F9FE',
    border: '1px solid #707582',
    boxSizing: 'border-box',
    borderRadius: '11.36px',
    width: '100%'
  },
  userInfo: {
    color: '#A4A4A4',
    lineHeight: '120%',
    fontSize: 14,
    margin: 0
  },
  contractAddress: {
    color: '#431AB7',
    lineHeight: '120%',
    fontSize: 14,
    margin: 0
  },
  tokenName: {
    fontSize: '18px',
    lineHeight: '104.5%',
    color: '#181818'
  },
  tokenImg: {
    width: '24px',
    height: '24px'
  },
  pText: {
    fontSize: 14,
    lineHeight: '120%',
    color: '#1A1B1C',
    margin: 0
  },
  labelTitle1: {
    fontWeight: 800,
    fontSize: '14px',
    lineHeight: '170%',
    color: '#431AB7',
    margin: 0
  },
  labelPrice: {
    fontWeight: 800,
    fontSize: '18px',
    lineHeight: '170%',
    color: '#431AB7',
    margin: 0
  },
  labelTitle2: {
    fontWeight: 400,
    fontSize: '18px',
    lineHeight: '18px',
    color: '#181818',
    marginBottom: '6px'
  },
  labelDescription: {
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: '120%',
    color: '#707582',
    margin: 0
  },
  fractionaliseButton: {
    width: '149px !important',
    height: '34px !important',
    borderRadius: '4px !important',
    fontSize: '14px !important',
    lineHeight: '34px !important'
  }
}));

const FractionaliseModal = (props: any) => {
  const classes = useStyles();
  const user = useSelector((state: RootState) => state.user);
  const userBalances = useSelector((state: RootState) => state.userBalances);
  const { showAlertMessage } = useAlertMessage();

  const [tokenList, setTokenList] = useState<string[]>([]);
  const [selectedToken, setSelectedToken] = useState('');
  const [selectedFraction, setSelectedFraction] = useState<string>('');
  const [initialPrice, setInitialPrice] = useState<string>('');
  const [buyBackPrice, setBuyBackPrice] = useState<string>('');
  const [interestRate, setInterestRate] = useState<string>('');

  useEffect(() => {
    getCryptosRateAsList().then((resp) => {
      const tokenList: string[] = [];
      resp.forEach((rateObj) => {
        tokenList.push(rateObj.token);
      });
      setSelectedToken(tokenList[0]);
      setTokenList(tokenList);
    });
  }, []);

  const handleFractionalise = () => {
    const payload: IFractionalise = {
      TokenSymbol: props.media.MediaSymbol,
      OwnerAddress: user.address,
      Fraction: Number(selectedFraction),
      BuyBackPrice: Number(buyBackPrice),
      InitialPrice: Number(initialPrice),
      FundingToken: selectedToken,
      InterestRate: Number(interestRate)
    };
    const additionalData = {
      MediaType: props.media.Type
    };
    fractionalise(user.address, payload, additionalData).then((resp) => {
      if (resp?.success) {
        showAlertMessage('Media successfully fractionalised', {
          variant: 'success'
        });
        props.handleClose();
        props.handleRefresh && props.handleRefresh();
      } else
        showAlertMessage('Media fractionalisation failed', {
          variant: 'error'
        });
    });
  };

  return (
    <Modal
      className={classes.modalContainer}
      size="small"
      isOpen={props.open}
      onClose={() => props.handleClose()}
      showCloseIcon
    >
      <Box>
        <Box className={classes.title}>Fractionalise</Box>
        <Box className={classes.digitalArt}>{props.media.MediaName}</Box>
        <Box display="flex" alignItems="center">
          <Avatar
            size="medium"
            url={getRandomAvatarForUserIdWithMemoization('1')}
            alt=""
          />
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            ml={1}
          >
            <p className={classes.pText}>Owned by</p>
            <p className={classes.userInfo}>You</p>
          </Box>
        </Box>
        <Box display="flex" gridColumnGap={5} mt={2}>
          <p className={classes.pText}>Contract Address:</p>
          <p className={classes.contractAddress}>{props.media.FundsAddress}</p>
        </Box>
        <Box display="flex" gridColumnGap={5} mt={2} mb={2}>
          <p className={classes.pText}>Token ID:</p>
          <p className={classes.contractAddress}>{props.media.MediaSymbol}</p>
        </Box>
        <Divider />
        <Box display="flex" justifyContent="space-between" mt={2} mb={2}>
          <Box width={1}>
            <Box flexDirection="row" gridRowGap={16}>
              <p className={classes.labelTitle1}>Fraction Ownership</p>
              <p className={classes.labelPrice}>
                {userBalances[props.media.MediaSymbol]
                  ? userBalances[props.media.MediaSymbol].Balance * 100
                  : 0}
                %
              </p>
            </Box>
          </Box>
          <Box width={1}>
            <Box flexDirection="row" gridRowGap={16}>
              <p className={classes.labelTitle1}>Creator Royalty</p>
              <p className={classes.labelPrice}>{props.media.Royalty}%</p>
            </Box>
          </Box>
        </Box>
        <Divider />
        <Box
          mt={2}
          display="flex"
          justifyContent="space-between"
          gridColumnGap={8}
        >
          <Box width={1}>
            <Box flexDirection="row">
              <p className={classes.pText}>Fractions To Sell</p>
              <p className={classes.labelDescription}>
                Fraction of the token expressed as %
              </p>
            </Box>
          </Box>
          <Box width={1}>
            <InputWithLabelAndTooltip
              type="text"
              inputValue={
                selectedFraction ? `${Number(selectedFraction) * 100}%` : ''
              }
              placeHolder="0%"
              onInputValueChange={(e) => {
                let str: any = e.target.value;
                str = str.replaceAll('%', '');
                let newFraction = Math.min(1, Number(str) / 100);
                setSelectedFraction(newFraction.toString());
              }}
              style={{ marginBottom: 0, marginTop: 0, height: '50px' }}
            />
          </Box>
        </Box>
        <Box
          mt={2}
          display="flex"
          justifyContent="space-between"
          gridColumnGap={8}
        >
          <Box width={1}>
            <Box flexDirection="row">
              <p className={classes.pText}>Fraction Price</p>
              <p className={classes.labelDescription}>
                Initial price per 1% of the token
              </p>
            </Box>
          </Box>
          <Box width={1}>
            <Box
              display="flex"
              style={{ textAlign: 'center', alignItems: 'center' }}
            >
              <Box width={1} mr={1}>
                <InputWithLabelAndTooltip
                  type="euro-number"
                  inputValue={initialPrice}
                  placeHolder="0"
                  onInputValueChange={setInitialPrice}
                  style={{ marginBottom: 0, marginTop: 0, height: '50px' }}
                />
              </Box>
              <Box width={1}>
                <TokenSelect
                  tokens={tokenList}
                  value={selectedToken}
                  onChange={(e) => {
                    setSelectedToken(e.target.value as string);
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Box>
        <Box
          mt={2}
          display="flex"
          justifyContent="space-between"
          gridColumnGap={8}
        >
          <Box width={1}>
            <Box flexDirection="row">
              <p className={classes.pText}>Buy Back Price</p>
              <p className={classes.labelDescription}>
                Total price to buy back the fractions
              </p>
            </Box>
          </Box>
          <Box width={1}>
            <Box
              display="flex"
              style={{ textAlign: 'center', alignItems: 'center' }}
            >
              <Box width={1} mr={1}>
                <InputWithLabelAndTooltip
                  type="euro-number"
                  inputValue={buyBackPrice}
                  placeHolder="0"
                  onInputValueChange={setBuyBackPrice}
                  style={{ marginBottom: 0, marginTop: 0, height: '50px' }}
                />
              </Box>
              <Box width={1}>
                <TokenSelect
                  tokens={tokenList}
                  value={selectedToken}
                  onChange={(e) => {
                    setSelectedToken(e.target.value as string);
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Box>
        <Box
          mt={2}
          display="flex"
          justifyContent="space-between"
          gridColumnGap={8}
        >
          <Box width={1}>
            <Box flexDirection="row">
              <p className={classes.pText}>Interest Rate</p>
              <p className={classes.labelDescription}>
                Annualised interest per each sold fraction
              </p>
            </Box>
          </Box>
          <Box width={1}>
            <InputWithLabelAndTooltip
              type="text"
              inputValue={interestRate ? `${Number(interestRate) * 100}%` : ''}
              placeHolder="0%"
              onInputValueChange={(e) => {
                let str: any = e.target.value;
                str = str.replaceAll('%', '');
                let newInterest = Math.min(1, Number(str) / 100);
                setInterestRate(newInterest.toString());
              }}
              style={{ marginBottom: 0, marginTop: 0, height: '50px' }}
            />
          </Box>
        </Box>
        <Box width="1" display="flex" justifyContent="flex-end" mt={4}>
          <PrimaryButton
            size="medium"
            className={classes.fractionaliseButton}
            onClick={handleFractionalise}
          >
            Fractionalise
          </PrimaryButton>
        </Box>
      </Box>
    </Modal>
  );
};

export default FractionaliseModal;
