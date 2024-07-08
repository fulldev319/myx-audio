import React, { useState, useMemo } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import Axios from 'axios';

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
  KeyboardTimePicker
} from '@material-ui/pickers';
import Fade from '@material-ui/core/Fade';
import Tooltip from '@material-ui/core/Tooltip';
import Hidden from '@material-ui/core/Hidden';

import { Color, Modal, PrimaryButton, SecondaryButton } from 'shared/ui-kit';
import Box from 'shared/ui-kit/Box';
import InputWithLabelAndTooltip from 'shared/ui-kit/InputWithLabelAndTooltip';
import URL from 'shared/functions/getURL';
import { useAlertMessage } from 'shared/hooks/useAlertMessage';

import { ReactComponent as InfoIcon } from 'assets/icons/info.svg';
import { useTypedSelector } from 'store/reducers/Reducer';

import { newVoteModalStyles } from './index.styles';

const CreateNewVoteModal = (props: any) => {
  const classes = newVoteModalStyles();
  const user = useTypedSelector((state) => state.user);
  const { showAlertMessage } = useAlertMessage();

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [answers, setAnswers] = useState<string[]>(['']);

  const [endDate, setEndDate] = useState<Date>(new Date());
  const [endTime, setEndTime] = useState<Date>(new Date());

  const calculatedEndDate = useMemo(() => {
    const result = new Date(endTime);
    result.setFullYear(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate()
    );
    return result;
  }, [endDate, endTime]);

  const validateVotesInfo = () => {
    if (title.length <= 5) {
      showAlertMessage('Title field invalid. Minimum 5 characters required.', {
        variant: 'error'
      });
      return false;
    } else if (!description) {
      showAlertMessage('Description is required.', { variant: 'error' });
      return false;
    } else if (!answers.reduce((prev, cur) => prev && cur, 'true')) {
      showAlertMessage('All available answers should be valid.', {
        variant: 'error'
      });
      return false;
    } else if (calculatedEndDate.getTime() - Date.now() < 0) {
      showAlertMessage('Please check end date.', { variant: 'error' });
      return false;
    }
    return true;
  };

  const createNewVotes = async () => {
    if (validateVotesInfo() && props.pod.Id) {
      const body = {
        question: title,
        description: description,
        possibleAnswers: answers,
        startDate: Date.now(),
        endDate: calculatedEndDate.getTime(),
        creatorAddress: user.id,
        podId: props.pod.Id
      };
      await Axios.post(`${URL()}/musicDao/governance/polls/addNew`, body)
        .then(async (res) => {
          if (res.data.success) {
            await props.handleRefresh();
            props.handleClose();
          }
        })
        .catch((error) => {
          showAlertMessage('Failed to create new discussion.', {
            variant: 'error'
          });
        });
    }
  };

  return (
    <Modal
      size="daoMedium"
      isOpen={props.open}
      onClose={props.handleClose}
      showCloseIcon
    >
      <Box className={classes.contentBox}>
        <Box className={classes.flexBox} justifyContent="center">
          <Box className={classes.title}>
            {props.isVotation ? 'Create new votation' : 'New Vote'}
          </Box>
        </Box>
        <Box mt={3.5}>
          <Box className={classes.flexBox} justifyContent="space-between">
            <Box className={classes.header1}>Question</Box>
            <Tooltip
              TransitionComponent={Fade}
              TransitionProps={{ timeout: 600 }}
              arrow
              title={''}
            >
              <InfoIcon style={{ color: 'grey', width: '14px' }} />
            </Tooltip>
          </Box>
          <InputWithLabelAndTooltip
            placeHolder="Discussion title"
            type="text"
            theme="music dao"
            inputValue={title}
            onInputValueChange={(e) => setTitle(e.target.value)}
          />
        </Box>
        <Box mt={4.5} mb={5}>
          <Box className={classes.flexBox} justifyContent="space-between">
            <Box className={classes.header1}>Description</Box>
            <Tooltip
              TransitionComponent={Fade}
              TransitionProps={{ timeout: 600 }}
              arrow
              title={''}
            >
              <InfoIcon style={{ color: 'grey', width: '14px' }} />
            </Tooltip>
          </Box>
          <InputWithLabelAndTooltip
            placeHolder="Write Description..."
            type="textarea"
            theme="music dao"
            inputValue={description}
            onInputValueChange={(e) => setDescription(e.target.value)}
          />
        </Box>
        <Box
          width={1}
          borderTop="1px solid #35385622"
          borderBottom="1px solid #35385622"
          pb={5}
        >
          {answers.map((item, index) => (
            <Box mt={4.5} width={1}>
              <Box className={classes.flexBox} justifyContent="space-between">
                <Box className={classes.header1}>{`Answer ${index + 1}`}</Box>
                {index > 0 && (
                  <Box
                    className={classes.header2}
                    onClick={() => {
                      const updatedAnswers = [...answers];
                      updatedAnswers.splice(index, 1);
                      setAnswers(updatedAnswers);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    Remove
                  </Box>
                )}
              </Box>
              <InputWithLabelAndTooltip
                placeHolder=""
                type="text"
                theme="music dao"
                inputValue={item}
                onInputValueChange={(e) => {
                  const updatedAnswers = [...answers];
                  updatedAnswers[index] = e.target.value;
                  setAnswers(updatedAnswers);
                }}
              />
            </Box>
          ))}
          <SecondaryButton
            size="medium"
            className={classes.addAnswerBtn}
            onClick={() => setAnswers((prev) => [...prev, ''])}
          >
            <Box
              mr={2}
              style={{
                borderRadius: '16px',
                border: '1px solid black',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2px'
              }}
            >
              <img src={require('assets/icons/add_dark.webp')} />
            </Box>
            Add Answer
          </SecondaryButton>
        </Box>
        <Box className={classes.flexBox} mt={3}>
          <Box width={1} ml={1}>
            <Box className={classes.header1}>End Date</Box>
            <Box width={1} className={classes.controlBox} mt={1}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="dd MMM yyyy"
                  margin="dense"
                  id="date-picker-inline"
                  minDate={new Date()}
                  value={endDate}
                  onChange={(date, _) =>
                    date && setEndDate(new Date(date.getTime()))
                  }
                  KeyboardButtonProps={{
                    'aria-label': 'change date'
                  }}
                  size="small"
                  className={classes.datepicker}
                />
              </MuiPickersUtilsProvider>
            </Box>
          </Box>
          <Hidden only="xs">
            <Box width={1} ml={1}>
              <Box className={classes.header1}>End Time</Box>
              <Box width={1} className={classes.controlBox} mt={1}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardTimePicker
                    placeholder="08:00 AM"
                    mask="__:__ _M"
                    value={endTime}
                    onChange={(date, _) =>
                      date && setEndTime(new Date(date?.getTime()))
                    }
                    className={classes.datepicker}
                  />
                </MuiPickersUtilsProvider>
              </Box>
            </Box>
          </Hidden>
        </Box>
        <Hidden smUp>
          <Box className={classes.flexBox} mt={3}>
            <Box width={1} ml={1}>
              <Box className={classes.header1}>End Time</Box>
              <Box width={1} className={classes.controlBox} mt={1}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardTimePicker
                    placeholder="08:00 AM"
                    mask="__:__ _M"
                    value={endTime}
                    onChange={(date, _) =>
                      date && setEndTime(new Date(date?.getTime()))
                    }
                    className={classes.datepicker}
                  />
                </MuiPickersUtilsProvider>
              </Box>
            </Box>
          </Box>
        </Hidden>
        <Box width={1} display="flex" justifyContent="space-between" mt={4}>
          <Hidden smUp>
            <SecondaryButton
              size="medium"
              onClick={props.handleClose}
              isRounded
              style={{
                paddingLeft: '48px',
                paddingRight: '48px',
                width: '100%'
              }}
            >
              Cancel
            </SecondaryButton>
          </Hidden>
          <Hidden only="xs">
            <SecondaryButton
              size="medium"
              onClick={props.handleClose}
              isRounded
              style={{ paddingLeft: '48px', paddingRight: '48px' }}
            >
              Cancel
            </SecondaryButton>
            <PrimaryButton
              size="medium"
              onClick={createNewVotes}
              isRounded
              style={{
                paddingLeft: '48px',
                paddingRight: '48px',
                marginLeft: '24px',
                background: Color.MusicDAODark
              }}
            >
              Vote
            </PrimaryButton>
          </Hidden>
        </Box>
        <Hidden smUp>
          <Box width={1} display="flex" justifyContent="center" mt={4}>
            <PrimaryButton
              size="medium"
              onClick={createNewVotes}
              isRounded
              style={{
                paddingLeft: '48px',
                paddingRight: '48px',
                width: '100%',
                background: Color.MusicDAODark
              }}
            >
              Vote
            </PrimaryButton>
          </Box>
        </Hidden>
      </Box>
    </Modal>
  );
};

export default CreateNewVoteModal;
