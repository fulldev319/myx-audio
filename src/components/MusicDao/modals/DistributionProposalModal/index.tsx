import React, { useState } from 'react';

import { Modal } from 'shared/ui-kit';
import Box from 'shared/ui-kit/Box';
import Avatar from 'shared/ui-kit/Avatar';
import InputWithLabelAndTooltip from 'shared/ui-kit/InputWithLabelAndTooltip';
import { distributionProposalModalStyles } from './index.styles';

const DistributionProposalModal = (props: any) => {
  const classes = distributionProposalModalStyles();

  const [step, setStep] = useState<'start' | 'main' | 'last'>('start');
  const [openAddressInput, setOpenAddressInput] = useState<boolean>(false);
  const [addedAddress, setAddedAddress] = useState<string>('');
  const [addedPercet, setAddedPercent] = useState<string>('');

  return (
    <Modal
      size="medium"
      isOpen={props.open}
      onClose={props.onClose}
      showCloseIcon
      className={classes.root}
    >
      {step === 'start' ? (
        <div className={classes.firstSection}>
          <Box fontSize={50} fontWeight={500}>
            🤝
          </Box>
          <div className={classes.title}>Distribution Proposal</div>
          <div className={classes.content}>
            In the next steps you will be claiming your share of{' '}
            <span>Claimable Track Name</span>. Since there are other 4 artists
            that are part of this pod you have to decide and assign the
            percentage of the share that each one of you will receive.
          </div>
          <div className={classes.startBtn} onClick={() => setStep('main')}>
            Ok, Let’s Do it
          </div>
          <div className={classes.footer}>
            I Have to Discuss With Artists First
          </div>
        </div>
      ) : step === 'main' ? (
        <div className={classes.mainContent}>
          <div className={classes.mainContentTitle}>Distribution Proposal</div>
          <Box className={classes.title1} mt={'45px'}>
            🤑 Funds Raised
          </Box>
          <Box className={classes.priceContent} mt={'14px'}>
            USDp 856.35 <span>($858)</span>
          </Box>
          <Box className={classes.title2} mt={'20px'}>
            Distribute Funds Evenly
          </Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mt={4}
          >
            <div className={classes.title3}>Artist</div>
            <div className={classes.title3}>Share %</div>
          </Box>
          <Box className={classes.artistContent}>
            {[0, 1, 2, 3, 4].map((item) => (
              <div className={classes.proposal}>
                <Box display="flex">
                  <Avatar
                    size={34}
                    image={require('assets/anonAvatars/ToyFaces_Colored_BG_001.webp')}
                    radius={25}
                    bordered
                    rounded
                  />
                  <Box display="flex" flexDirection="column" ml={2}>
                    <div className={classes.nameTypo}>50 Cent</div>
                    <div className={classes.slugTypo}>@piptycent</div>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center">
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="flex-end"
                    mr={'37px'}
                  >
                    <div className={classes.priceTypo1}>USDp 171</div>
                    <div className={classes.priceTypo2}>($171)</div>
                  </Box>
                  <div className={classes.priceSection}>20%</div>
                </Box>
              </div>
            ))}
          </Box>
          {openAddressInput && (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mt={2}
            >
              <Box width={1}>
                <InputWithLabelAndTooltip
                  type="text"
                  placeHolder="Paste address here"
                  inputValue={addedAddress}
                  onInputValueChange={(e) => setAddedAddress(e.target.value)}
                />
              </Box>
              <Box width={'113px'} ml={4} mr={1}>
                <InputWithLabelAndTooltip
                  type="text"
                  placeHolder="%"
                  inputValue={addedPercet}
                  onInputValueChange={(e) => setAddedPercent(e.target.value)}
                />
              </Box>
            </Box>
          )}
          <div className={classes.addedAddressContent}>
            <div
              className={classes.walletAddressBtn}
              onClick={() => setOpenAddressInput(true)}
            >
              <PlusIcon />
              <span>Add Wallet Address</span>
            </div>
          </div>
          <div className={classes.previewContent}>
            {true ? (
              <Box className={classes.previewLine} color="#F43E5F">
                <Box display="flex">
                  <WarningIcon />
                  <Box ml={1}>Total can’t be more than 100%</Box>
                </Box>
                <Box display="flex">
                  <Box>pUSD 1024</Box>
                  <Box ml={8}>105%</Box>
                </Box>
              </Box>
            ) : (
              <Box className={classes.previewLine} color="#65CB63">
                <Box display="flex">
                  <CheckIcon />
                  <Box ml={1}>Everything looks good</Box>
                </Box>
                <Box display="flex">
                  <Box>pUSD 1024</Box>
                  <Box ml={8}>100%</Box>
                </Box>
              </Box>
            )}
          </div>
          <div className={classes.mainContentFooter}>
            <div className={classes.footerTitle1}>
              Before funds get distrubuted among artists, they will have to
              approve and sign this distribution proposal.
            </div>
            <div className={classes.startBtn} onClick={() => setStep('last')}>
              Submit Proposal
            </div>
            <div className={classes.footerTitle2}>
              <AbrrebiationIcon />
              <span>Start Discussion Chat With Artists</span>
            </div>
          </div>
        </div>
      ) : (
        <div className={classes.firstSection}>
          <Box fontSize={50} fontWeight={400}>
            🔏
          </Box>
          <div className={classes.title}>Approval Request Sent</div>
          <div className={classes.content}>
            We have sent a notification to the artists to review your funds
            distribution proposal. <br />
            <br />
            We’ll keep you posted on the status of this transaction.
          </div>
          <div className={classes.startBtn} onClick={props.onClose}>
            View Proposal on Capsule
          </div>
        </div>
      )}
    </Modal>
  );
};

export default DistributionProposalModal;

const PlusIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6 1V11M1 6L11 6"
      stroke="#2D3047"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const WarningIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.75 4.21875C8.75 3.80454 8.41421 3.46875 8 3.46875C7.58579 3.46875 7.25 3.80454 7.25 4.21875H8.75ZM7.25 9.46875C7.25 9.88296 7.58579 10.2188 8 10.2188C8.41421 10.2188 8.75 9.88296 8.75 9.46875H7.25ZM8.75 11.7113C8.75 11.297 8.41421 10.9613 8 10.9613C7.58579 10.9613 7.25 11.297 7.25 11.7113H8.75ZM7.25 11.7188C7.25 12.133 7.58579 12.4688 8 12.4688C8.41421 12.4688 8.75 12.133 8.75 11.7188H7.25ZM7.25 4.21875V9.46875H8.75V4.21875H7.25ZM7.25 11.7113V11.7188H8.75V11.7113H7.25ZM14 7.96875C14 11.2825 11.3137 13.9688 8 13.9688V15.4688C12.1421 15.4688 15.5 12.1109 15.5 7.96875H14ZM8 13.9688C4.68629 13.9688 2 11.2825 2 7.96875H0.5C0.5 12.1109 3.85786 15.4688 8 15.4688V13.9688ZM2 7.96875C2 4.65504 4.68629 1.96875 8 1.96875V0.46875C3.85786 0.46875 0.5 3.82661 0.5 7.96875H2ZM8 1.96875C11.3137 1.96875 14 4.65504 14 7.96875H15.5C15.5 3.82661 12.1421 0.46875 8 0.46875V1.96875Z"
      fill="#F43E5F"
    />
  </svg>
);

const CheckIcon = () => (
  <svg
    width="16"
    height="15"
    viewBox="0 0 16 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12.2803 5.78033C12.5732 5.48744 12.5732 5.01256 12.2803 4.71967C11.9874 4.42678 11.5126 4.42678 11.2197 4.71967L12.2803 5.78033ZM6.49999 10.5L5.96966 11.0303C6.26255 11.3232 6.73742 11.3232 7.03032 11.0303L6.49999 10.5ZM4.78028 7.71967C4.48739 7.42678 4.01251 7.42678 3.71962 7.71967C3.42673 8.01257 3.42673 8.48744 3.71963 8.78033L4.78028 7.71967ZM11.2197 4.71967L5.96966 9.96968L7.03032 11.0303L12.2803 5.78033L11.2197 4.71967ZM3.71963 8.78033L5.96966 11.0303L7.03031 9.96968L4.78028 7.71967L3.71963 8.78033ZM14 7.5C14 10.8137 11.3137 13.5 8 13.5V15C12.1421 15 15.5 11.6421 15.5 7.5H14ZM8 13.5C4.68629 13.5 2 10.8137 2 7.5H0.5C0.5 11.6421 3.85786 15 8 15V13.5ZM2 7.5C2 4.18629 4.68629 1.5 8 1.5V0C3.85786 0 0.5 3.35786 0.5 7.5H2ZM8 1.5C11.3137 1.5 14 4.18629 14 7.5H15.5C15.5 3.35786 12.1421 0 8 0V1.5Z"
      fill="#65CB63"
    />
  </svg>
);

const AbrrebiationIcon = () => (
  <svg
    width="19"
    height="20"
    viewBox="0 0 19 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.49996 0.164062C6.921 0.17021 4.46184 1.25301 2.71585 3.15203C0.969847 5.05018 0.096946 7.59149 0.306663 10.1622C0.516458 12.7327 1.78985 15.099 3.8201 16.6898C4.91289 17.7372 6.20391 18.5557 7.61723 19.0974C9.67604 19.9004 11.9331 20.0503 14.0803 19.527C14.6528 19.3971 15.0486 18.7739 14.838 18.3112C14.6728 17.9516 14.6413 17.5635 14.5229 17.1954C14.5229 17.18 14.5229 17.1639 14.5345 17.1485V17.1477C16.7684 15.6861 18.2615 13.3299 18.6304 10.6855C18.9985 8.04119 18.2054 5.36681 16.4555 3.3503C14.7057 1.3338 12.1697 0.171895 9.50008 0.164223L9.49996 0.164062ZM5.51003 11.1295C5.05049 11.1334 4.63473 10.8575 4.45797 10.4333C4.28122 10.0091 4.37958 9.51955 4.70542 9.196C5.03125 8.87171 5.52154 8.77795 5.94422 8.95701C6.36765 9.13684 6.63971 9.5549 6.63355 10.0144C6.62741 10.6308 6.12636 11.128 5.51003 11.1295ZM9.48776 11.1295H9.48853C9.03129 11.1257 8.62169 10.8475 8.45032 10.4241C8.27818 10.0014 8.37808 9.51571 8.70237 9.19449C9.02743 8.87326 9.51312 8.77873 9.93425 8.95471C10.3561 9.13146 10.6297 9.54414 10.629 10.0006C10.6228 10.6262 10.1141 11.1311 9.48851 11.1318L9.48776 11.1295ZM13.4893 11.1295H13.4901C13.0313 11.1326 12.6171 10.8583 12.4403 10.4356C12.2636 10.0122 12.3589 9.52494 12.6824 9.19988C13.0059 8.87558 13.4932 8.77798 13.9166 8.95396C14.34 9.12918 14.6159 9.54262 14.6151 10.0006C14.6159 10.6239 14.1125 11.1295 13.4901 11.1318L13.4893 11.1295Z"
      fill="#65CB63"
    />
  </svg>
);
