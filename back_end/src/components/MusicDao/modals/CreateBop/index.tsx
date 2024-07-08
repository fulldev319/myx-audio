import React from 'react';
import axios from 'axios';
import Web3 from 'web3';
import { useWeb3React } from '@web3-react/core';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';

import Box from 'shared/ui-kit/Box';
import { Color, Modal, Text } from 'shared/ui-kit';
import { TokenSelect } from 'shared/ui-kit/Select/TokenSelect';
import URL from 'shared/functions/getURL';
import { BlockchainNets } from 'shared/constants/constants';
import { DropDownIcon } from 'shared/ui-kit/Icons';
import PrintChart from 'shared/ui-kit/Chart/Chart';
import PolygonAPI from 'shared/services/API/polygon';
import PolygonConfig from 'shared/connectors/polygon/config';
import { createBopStyles } from './index.styles';

const TRAX_STAKE_AMOUNT = 1;

const FreeHoursChartConfig = {
  config: {
    data: {
      labels: [] as any[],
      datasets: [
        {
          type: 'line',
          label: '',
          data: [] as any[],
          pointRadius: 0,
          borderJoinStyle: 'round',
          borderCapStyle: 'round',
          borderRadius: Number.MAX_VALUE,
          borderWidth: 1,
          lineTension: 0.2
        }
      ]
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,
      chartArea: {
        backgroundColor: '#ffffff00'
      },
      elements: {
        point: {
          radius: 0,
          hitRadius: 5,
          hoverRadius: 5
        }
      },

      legend: {
        display: false
      },

      layout: {
        padding: {
          left: 0,
          right: 0,
          top: 20,
          bottom: 0
        }
      },

      scales: {
        xAxes: [
          {
            offset: true,
            display: true,
            gridLines: {
              color: '#ffffff00',
              lineWidth: 50
            },
            ticks: {
              beginAtZero: true,
              fontColor: '#6B6B6B'
            }
          }
        ],
        yAxes: [
          {
            display: true,
            offset: true,
            position: 'right',
            gridLines: {
              color: '#ffffff00',
              drawBorder: false
            },
            ticks: {
              display: true,
              beginAtZero: true
            }
          }
        ]
      },

      tooltips: {
        mode: 'label',
        intersect: false,
        callbacks: {
          //This removes the tooltip title
          title: function () {},
          label: function (tooltipItem, data) {
            return `$${tooltipItem.yLabel.toFixed(4)}`;
          }
        },
        //this removes legend color
        displayColors: false,
        yPadding: 10,
        xPadding: 10,
        position: 'nearest',
        caretSize: 10,
        backgroundColor: 'rgba(255,255,255,0.9)',
        bodyFontSize: 15,
        bodyFontColor: '#303030'
      },

      plugins: {
        datalabels: {
          display: function (context) {
            return context.dataset.data[context.dataIndex] !== 0;
          }
        }
      }
    }
  }
};
const configurer = (config: any, ref: CanvasRenderingContext2D): object => {
  for (let index = 0; index < config.data.datasets.length; index++) {
    let gradient = ref.createLinearGradient(0, 0, 0, 200);

    if (typeof config.data.datasets[0].backgroundColor === 'string') {
      gradient.addColorStop(0, config.data.datasets[index].backgroundColor);
      gradient.addColorStop(
        1,
        `${config.data.datasets[index].backgroundColor}33`
      );
      config.data.datasets[0].backgroundColor = gradient;
    }
  }

  return config;
};

const STEP_BUTTON_LABELS = [
  'Start Creating',
  'Next',
  'CONFIRM  bop creation',
  'SKIP & CREATE',
  'Done'
];

const CreateBopModal = (props: any) => {
  const classes = createBopStyles();

  const [step, setStep] = React.useState<number>(0);
  const [tokens, setTokens] = React.useState<any[]>([]);
  const [rewardConfig, setRewardConfig] = React.useState<any>();

  const [network, setNetwork] = React.useState<string>(BlockchainNets[1].value);
  const [amount, setAmount] = React.useState<number>(0);
  const [token, setToken] = React.useState<string>();
  const { account, library } = useWeb3React();

  const { song } = props;

  React.useEffect(() => {
    axios.get(`${URL()}/wallet/getCryptosRateAsList`).then((res) => {
      const resp = res.data;
      if (resp.success) {
        setTokens(
          resp.data.map((obj) => ({ token: obj.token, name: obj.token }))
        ); // update token list
        setToken(resp.data[0].token);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAllHours = React.useCallback(() => {
    const result: string[] = [];
    for (let index = 1; index <= 23; index++) {
      result.push(index < 10 ? `0${index}` : `${index}`);
    }

    return result;
  }, []);

  const getAllValues = React.useCallback(() => {
    const result: number[] = [];
    for (let index = 1; index <= 23; index++) {
      result.push(Math.floor(Math.random() * 10000));
    }

    return result;
  }, []);

  React.useEffect(() => {
    const newRewardConfig1 = JSON.parse(JSON.stringify(FreeHoursChartConfig));
    newRewardConfig1.configurer = configurer;
    newRewardConfig1.config.data.labels = getAllHours();
    newRewardConfig1.config.data.datasets[0].data = getAllValues();
    newRewardConfig1.config.data.datasets[0].backgroundColor = '#65CB63';
    newRewardConfig1.config.data.datasets[0].borderColor = '#65CB63';
    newRewardConfig1.config.data.datasets[0].pointBackgroundColor = '#65CB63';
    newRewardConfig1.config.data.datasets[0].hoverBackgroundColor = '#65CB63';

    setRewardConfig(newRewardConfig1);
  }, []);

  const handleChangeNetwork = React.useCallback((e) => {
    setNetwork(e.target.value);
  }, []);

  const handleNext = async () => {
    if (step === 3) {
      if (!token || !amount) return;

      const web3 = new Web3(library.provider);

      if (network === BlockchainNets[1].value) {
        if (!PolygonConfig.TOKEN_ADDRESSES[token]) return;

        const contractResponse: any = await PolygonAPI.Song.spawnBop(
          web3,
          account!,
          {
            token,
            amount,
            songAddress: song.songAddress
          }
        );

        if (!contractResponse.success) return;

        const response: any = await axios.post(
          `${URL()}/claimableSongs/createBop`,
          {
            song,
            account,
            token,
            amount
          }
        );
        console.log(response);

        if (response.data.success) {
          setStep((prev) => prev + 1);
        }
      }
    } else if (step === 4) {
      props.handleClose();
    } else {
      setStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setStep((prev) => prev - 1);
  };

  return (
    <Modal
      size="daoMedium"
      isOpen={props.open}
      onClose={props.handleClose}
      showCloseIcon
    >
      {step > 0 && step < 4 && (
        <Box
          position="absolute"
          top={24}
          left={24}
          onClick={handlePrev}
          style={{ cursor: 'pointer' }}
        >
          <BackIcon />
        </Box>
      )}
      <Box
        display="flex"
        flexDirection="column"
        height={step === 0 || step === 1 ? 648 : undefined}
      >
        <Box display="flex" flexDirection="column" flex={1}>
          {step === 0 ? (
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              height="100%"
            >
              <Box>
                <img
                  src={require('assets/tokenImages/MUSIC1.webp')}
                  alt="trax"
                  width="128px"
                />
              </Box>
              <Box className={classes.title} mt={6}>
                By creating a Bop you are
                <br />
                accepting to stake <span>{TRAX_STAKE_AMOUNT} TRAX.</span>
              </Box>
            </Box>
          ) : step === 4 ? (
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              height="100%"
            >
              <Box className={classes.title} mt={6}>
                Success!
              </Box>
              <Box className={classes.text2} mt={2}>
                You have successfully created your Bop based on <br />
                <Box color={'#4218B5'} style={{ textAlign: 'center' }}>
                  Bubble Dispersion by Mila Kunis
                </Box>
              </Box>
              <Box
                display="flex"
                border="1px solid #CCD1DE"
                borderRadius={24}
                mt={6}
                minWidth={400}
              >
                <Box
                  width={1}
                  paddingY={4}
                  textAlign="center"
                  borderRight="1px solid #DAE6E5"
                  fontSize={14}
                >
                  TRAX Staked
                  <br />
                  <span className={classes.highlight}>
                    {TRAX_STAKE_AMOUNT} TRAX
                  </span>
                </Box>
                <Box width={1} paddingY={4} textAlign="center" fontSize={14}>
                  Intensity
                  <br />
                  <span className={classes.highlight}>2424 USDT</span>
                </Box>
              </Box>
            </Box>
          ) : (
            <Box display="flex" flexDirection="column" alignItems="center">
              <Box className={classes.title}>Create your bop from</Box>
              <Text color={Color.MusicDAOGray}>
                Bubble Dispersion by Mila Kunis
              </Text>
              <Box
                mt={3.5}
                width={1}
                display="flex"
                flexDirection="row"
                alignItems="center"
                maxWidth={500}
              >
                <StepRound active={step === 1} completed={step > 1} step={1} />
                <Box flex={1} height="1px" bgcolor="#9897B8" />
                <StepRound active={step === 2} completed={step > 2} step={2} />
                <Box flex={1} height="1px" bgcolor="#9897B8" />
                <StepRound active={step === 3} completed={step > 3} step={3} />
              </Box>
              <Box
                mt={5}
                width="calc(100% + 64px)"
                height={'1px'}
                bgcolor="#DAE6E5"
              />
            </Box>
          )}
          {step === 1 && (
            <Box
              flex={1}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
            >
              <Box
                textAlign="center"
                fontSize={16}
                color="#54658F"
                maxWidth={522}
              >
                You can create your Bop out of this track by staking 5 Myx and
                then stake stablecoin to define intensity that will reflect your
                share of revenue of selected track.
              </Box>
              <Box
                bgcolor="#F2FBF6"
                borderRadius={12}
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                height={120}
                width={1}
                mt={5}
              >
                <Box
                  fontSize={18}
                  fontWeight={600}
                  color={'#54658F'}
                  style={{ textTransform: 'uppercase', opacity: 0.8 }}
                >
                  stake to create bop
                </Box>
                <Box fontSize={22} fontWeight={700} color={'#65CB63'}>
                  {TRAX_STAKE_AMOUNT} Myx
                </Box>
              </Box>
            </Box>
          )}
          {step === 2 && (
            <Box display="flex" flexDirection="column">
              <Box
                display="flex"
                flexDirection="row"
                width="calc(100% + 64px)"
                marginLeft={-4}
                borderBottom="1px solid #DAE6E5"
              >
                <Box
                  width={1}
                  paddingY={4}
                  textAlign="center"
                  borderRight="1px solid #DAE6E5"
                  fontSize={14}
                >
                  Global Staking in this track
                  <br />
                  <span className={classes.highlight}>2424 USDT</span>
                </Box>
                <Box width={1} paddingY={4} textAlign="center" fontSize={14}>
                  Total Bops in this track
                  <br />
                  <span className={classes.highlight}>2424 USDT</span>
                </Box>
              </Box>
              <Box display="flex" alignItems="center" mt={4}>
                <Box className={classes.text1} mr={1}>
                  Define intensity of card by stakig stablecoin
                </Box>
                <img src={require('assets/icons/info_black.webp')} alt="info" />
              </Box>
              <Box className={classes.text3} mt={1.5}>
                Input your amount of stablecoin to stake. The more you stake on
                your position, the more return you can generate.
              </Box>
              <Box className={classes.text2} mt={6} mb={1.5}>
                Choose Blockchain Network
              </Box>
              <Select
                value={network}
                className={classes.outlineSelect}
                onChange={handleChangeNetwork}
              >
                {BlockchainNets.map((item, index) => (
                  <MenuItem value={item.value} key={index}>
                    <Box display="flex" flexDirection="row" alignItems="center">
                      <img
                        src={require(`assets/${item.image}`)}
                        alt="choose a network"
                        height={30}
                      />
                      <Text color={Color.MusicDAOLightBlue} bold ml={2}>
                        {item.value}
                      </Text>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
              <Box className={classes.text2} mt={4.5} mb={1.5}>
                Select stablecoin
              </Box>
              <Box display="flex" alignItems="center">
                <TokenSelect
                  tokens={tokens}
                  value={token}
                  className={classes.tokenSelect}
                  onChange={(e) => {
                    setToken(e.target.value);
                  }}
                />
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="space-between"
                  className={classes.tokenValue}
                  ml={1.5}
                >
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => {
                      const targetValue = e.target.value.replace(',', '.');
                      if (!targetValue || !isNaN(Number(targetValue)))
                        setAmount(Number(targetValue));
                      else setAmount((prev) => prev);
                    }}
                  />
                  <span>Use Max</span>
                </Box>
              </Box>
              <Box className={classes.text3} mt={1}>
                Balance: 4544 USDT
              </Box>
              <Accordion className={classes.accordion}>
                <AccordionSummary expandIcon={<DropDownIcon />}>
                  <Box display="flex" flexDirection="column">
                    <Box className={classes.text1}>Revenue Calculator</Box>
                    <Box className={classes.text3}>
                      Calculate your potential revenue by number of track
                      playbacks.
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box className={classes.text2} mb={1}>
                    Number of track playbacks
                  </Box>
                  <input placeholder="0 playbacks" />
                  <Box display="flex" mt={3}>
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      width={1}
                    >
                      <Box color="#54658F" fontSize="18px" fontWeight={600}>
                        REVENUE SHARE
                      </Box>
                      <Box
                        color="#65CB63"
                        fontSize="22px"
                        fontWeight={700}
                        mt={1}
                      >
                        4%
                      </Box>
                    </Box>
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      width={1}
                    >
                      <Box color="#54658F" fontSize="18px" fontWeight={600}>
                        ESTIMATED RETURN
                      </Box>
                      <Box
                        color="#65CB63"
                        fontSize="22px"
                        fontWeight={700}
                        mt={1}
                      >
                        245244 USDT
                      </Box>
                    </Box>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Box>
          )}
          {step === 3 && (
            <Box display="flex" flexDirection="column">
              <Box
                className={classes.title}
                style={{ textAlign: 'center' }}
                mt={7}
              >
                Breed with Beats
              </Box>
              <Box
                className={classes.text2}
                style={{ textAlign: 'center' }}
                mt={1}
                maxWidth={400}
                alignSelf="center"
              >
                Feeding enables to level up your Bops to higher level card that
                bring higher level of rewards.
              </Box>
              <Box
                bgcolor="#F2FBF6"
                borderRadius={12}
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                height={120}
                width={1}
                mt={4}
              >
                <Box
                  fontSize={18}
                  fontWeight={600}
                  color={'#54658F'}
                  style={{ textTransform: 'uppercase', opacity: 0.8 }}
                >
                  Available beats
                </Box>
                <Box fontSize={22} fontWeight={700} color={'#65CB63'}>
                  2255 Beats
                </Box>
              </Box>
              <Box className={classes.text1} mt={5}>
                Level structure
              </Box>
              <Box height="250px" width={1}>
                {rewardConfig && <PrintChart config={rewardConfig} />}
              </Box>
              <Box className={classes.text1} mt={4}>
                Amount
              </Box>
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
                className={classes.tokenValue}
              >
                <input />
                <Box display="flex" alignItems="center">
                  <span style={{ marginRight: 16 }}>Beats</span>
                  <img src={require('assets/icons/beats.webp')} alt="beats" />
                </Box>
              </Box>
              <Box display="flex" justifyContent="flex-end" mt={1}>
                <Box display="flex" className={classes.text3}>
                  Fees:{' '}
                  <Box fontWeight={800} ml={1}>
                    0.000521 USDp
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
        <Box display="flex" justifyContent="center" mt={3}>
          {step === 3 && (
            <StyledButton
              text="BREED & CREATE"
              bgcolor="#FF8E3C"
              color="white"
              onClick={() => {}}
            />
          )}
          <StyledButton
            text={STEP_BUTTON_LABELS[step]}
            bgcolor="#2D3047"
            color="white"
            onClick={handleNext}
          />
        </Box>
      </Box>
    </Modal>
  );
};

export default CreateBopModal;

const StepRound = ({ active, completed, step }) => {
  const classes = createBopStyles();

  return (
    <Box position="relative" display="flex" justifyContent="center">
      <Box className={classes.stepContainer}>
        {active ? (
          <Box className={classes.activeStep} />
        ) : completed ? (
          <Box className={classes.completeStep} />
        ) : null}
        <span style={{ color: !active && !completed ? '#9897B8' : 'white' }}>
          {step}
        </span>
      </Box>
      <Box
        position="absolute"
        color={active ? '#2D3047' : '#54658F'}
        whiteSpace="nowrap"
        fontSize={14}
        bottom={-24}
      >
        {step === 1
          ? 'Stake Myx'
          : step === 2
          ? 'Define Intensity'
          : 'Breed Bop'}
      </Box>
    </Box>
  );
};

export const StyledButton = ({
  text,
  bgcolor,
  color,
  className,
  gradient,
  onClick
}: {
  text: string;
  bgcolor: string;
  color: string;
  className?: string;
  gradient?: string;
  onClick: () => void;
}) => {
  const classes = createBopStyles();

  return (
    <Box className={`${classes.button} ${className}`} onClick={onClick}>
      <svg
        width="344"
        viewBox="0 0 344 70"
        xmlns="http://www.w3.org/2000/svg"
        fill={gradient ? gradient : bgcolor}
      >
        <path d="M0 21.7224C0 14.7347 5.31938 8.90978 12.2842 8.34442C40.4709 6.0564 111.986 0.779297 172 0.779297C232.014 0.779297 303.529 6.0564 331.716 8.34442C338.681 8.90978 344 14.7347 344 21.7224V46.8978C344 53.8219 338.795 59.6133 331.901 60.255C303.472 62.9009 230.408 69.1233 172 69.1233C113.592 69.1233 40.5281 62.9009 12.0989 60.255C5.20458 59.6133 0 53.8219 0 46.8978V21.7224Z" />
      </svg>
      <Box
        position="absolute"
        color={color}
        fontWeight={700}
        fontSize={18}
        style={{ textTransform: 'uppercase' }}
      >
        {text}
      </Box>
    </Box>
  );
};

const BackIcon = () => (
  <svg
    width="21"
    height="20"
    viewBox="0 0 21 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.476363 8.83418C0.17104 9.14542 0 9.56401 0 10C0 10.436 0.17104 10.8546 0.476362 11.1658L8.21737 19.0567C8.59085 19.4374 9.2041 19.4374 9.57758 19.0567C9.94107 18.6862 9.94108 18.0929 9.57758 17.7223L3.28309 11.306C3.15753 11.178 3.24821 10.962 3.42751 10.962H19.838C20.3693 10.962 20.8 10.5313 20.8 10C20.8 9.46871 20.3693 9.03801 19.838 9.03801H3.42751C3.24821 9.03801 3.15753 8.82203 3.28309 8.69403L9.57758 2.27765C9.94107 1.90712 9.94107 1.31381 9.57758 0.943277C9.2041 0.56256 8.59085 0.56256 8.21737 0.943277L0.476363 8.83418Z"
      fill="#2D3047"
    />
  </svg>
);
