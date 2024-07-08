import React from 'react';
import Box from 'shared/ui-kit/Box';
import Carousel from 'react-simply-carousel';
import PodHeader from './Header';
import PodArtists from './Artists';
import { useParams } from 'react-router-dom';
import { useTypedSelector } from 'store/reducers/Reducer';
import { LoadingWrapper } from 'shared/ui-kit/Hocs/LoadingWrapper';
import { musicDaoGetPod } from 'shared/services/API';
import Chat from './SubPages/Chat';
// import { FundCard } from "components/MusicDao/components/Cards/FundCard";
import { usePodDetailStyles } from './index.styles';

const PodDistributionPage = () => {
  const classes = usePodDetailStyles();
  const params: any = useParams();

  const user = useTypedSelector((state) => state.user);

  const [pod, setPod] = React.useState<any>();
  const [followed, setFollowed] = React.useState<boolean>(false);

  const [fundingEnded, setFundingEnded] = React.useState<boolean>(false);
  const [fundingEndTime, setFundingEndTime] = React.useState<any>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [currentSlide, setCurrentSlide] = React.useState<number>(0);

  React.useEffect(() => {
    if (params?.podAddress) {
      loadData();
    }
  }, [params?.podAddress]);

  React.useEffect(() => {
    if (pod?.FundingDate) {
      const timerId = setInterval(() => {
        const now = new Date();
        let delta = Math.floor(pod.FundingDate - now.getTime() / 1000);
        if (delta < 0) {
          setFundingEnded(true);
          setFundingEndTime({
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0
          });
          clearInterval(timerId);
        } else {
          let days = Math.floor(delta / 86400);
          delta -= days * 86400;

          // calculate (and subtract) whole hours
          let hours = Math.floor(delta / 3600) % 24;
          delta -= hours * 3600;

          // calculate (and subtract) whole minutes
          let minutes = Math.floor(delta / 60) % 60;
          delta -= minutes * 60;

          // what's left is seconds
          let seconds = delta % 60;
          setFundingEnded(false);
          setFundingEndTime({
            days,
            hours,
            minutes,
            seconds
          });
        }
      }, 1000);

      return () => clearInterval(timerId);
    }
  }, [pod?.FundingDate]);

  const loadData = async () => {
    const podAddress = params.podAddress;
    if (podAddress) {
      try {
        const resp = await musicDaoGetPod(podAddress);
        if (resp?.success) {
          const podData = resp.data;
          podData.PostsArray = [];
          podData.PostsArray.push({
            id: 'Pxb9dbbc3e-2bd3-4301-a6d8-2600d9220148',
            Url: require('assets/backgrounds/audio.webp'),
            hasPhoto: true,
            name: 'Rallying market when providing stablecoins drop',
            shortText: 'this is test.',
            createdBy: 'musicUser146',
            responses: [1, 2, 3]
          });
          podData.Votings = [];
          podData.Votings.push({
            question:
              'Do you think that having Cardano as collateral could benefit this pool?',
            description: 'this is test.',
            endDate: Date.now(),
            possibleAnswers: ['yes', 'no'],
            OpenVotation: true
          });
          setPod(podData);
          const followers: any[] = podData.Followers ?? [];
          setFollowed(
            followers.find((followerData) => followerData.id == user.id) !=
              undefined
          );
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleSlidePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const handleSlideNext = () => {
    if (currentSlide < 3 - 1) {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  return pod ? (
    <Box className={classes.container}>
      <Box className={classes.subContainer}>
        <PodHeader
          pod={pod}
          followed={followed}
          setFollowed={setFollowed}
          fundingEnded={fundingEnded}
          fundingEndTime={fundingEndTime}
        />
        <PodArtists pod={pod} />
        <Box className={classes.podSubPageContent} position="relative">
          <Box
            mb={1}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box className={classes.title2}>Proposals</Box>
            <Box display="flex">
              <Box className={classes.sliderNav} onClick={handleSlidePrev}>
                <svg
                  width="15"
                  height="13"
                  viewBox="0 0 15 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.13131 11.3846L1.07343 6.48479M1.07343 6.48479L6.13131 1.58496M1.07343 6.48479H13.9268"
                    stroke="#181818"
                    strokeWidth="1.5122"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Box>
              <Box
                className={classes.sliderNav}
                ml={2.5}
                onClick={handleSlideNext}
              >
                <svg
                  width="15"
                  height="13"
                  viewBox="0 0 15 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.86869 11.3846L13.9266 6.48479M13.9266 6.48479L8.86869 1.58496M13.9266 6.48479H1.07324"
                    stroke="#181818"
                    strokeWidth="1.5122"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Box>
            </Box>
          </Box>
          <Carousel
            activeSlideIndex={currentSlide}
            itemsToShow={2}
            itemsToScroll={1}
            forwardBtnProps={{
              show: false
            }}
            backwardBtnProps={{
              show: false
            }}
            infinite={false}
          >
            {/* {[1, 2, 3].map((item, index) => (
              <Box minWidth={"50%"} pr={2} key={`fund-proposal-${index}`}>
                <FundCard
                  data={{ isDistributed: item === 1 ? false : true, name: "User Name", slug: "piptycent" }}
                />
              </Box>
            ))} */}
          </Carousel>
          <Chat
            podId={params.podAddress}
            pod={pod}
            refreshPod={() => loadData()}
          />
        </Box>
      </Box>
    </Box>
  ) : (
    <LoadingWrapper loading />
  );
};

export default PodDistributionPage;
