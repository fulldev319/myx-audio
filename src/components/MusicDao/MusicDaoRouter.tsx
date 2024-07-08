import React, { lazy, Suspense } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Loading from 'shared/ui-kit/Loading';
const FullDaoProposal = lazy(() => import('./subPages/FullDaoProposal'));
const GovernancePage = lazy(() => import('./subPages/GovernancePage'));
const HighYieldPage = lazy(() => import('./subPages/HighYieldPage'));
const LiquidityPage = lazy(() => import('./subPages/LiquidityPage'));
const ProposalPage = lazy(() => import('./subPages/ProposalPage'));
const StakingPage = lazy(() => import('./subPages/StakingPage'));
const VotePage = lazy(() => import('./subPages/VotePage'));
const FullVote = lazy(() => import('./subPages/FullVote'));
const ArtistPage = lazy(() => import('./subPages/ArtistPage'));
const MerchPage = lazy(() => import('./subPages/MerchPage'));
const LiquidityPoolDetailPage = lazy(
  () => import('./subPages/LiquidityPage/LiquidityPoolDetail')
);
const LiquidityPoolManagementPage = lazy(
  () => import('./subPages/LiquidityPage/LiquidityPoolManagement')
);
const LiquidityPositionPage = lazy(
  () => import('./subPages/LiquidityPage/LiquidityPosition')
);
const CalculatorPage = lazy(() => import('./subPages/CalculatorPage'));
const DiscussionAllPage = lazy(
  () => import('./subPages/GovernancePage/DiscussionAll')
);
const DiscussionDetailPage = lazy(
  () => import('./subPages/GovernancePage/DiscussionDetail')
);
const PlayerPage = lazy(() => import('./subPages/Music'));
const PodsPage = lazy(() => import('./subPages/PodsPage'));
const PodDetailsPage = lazy(() => import('./subPages/PodDetailsPage'));
const PodDistributionPage = lazy(
  () => import('./subPages/PodDistributionPage')
);
const FullWallPost = lazy(() => import('./subPages/FullWallPost'));
const TradeTraxPage = lazy(() => import('./subPages/TradeTraxPage'));
const FreeMusicPage = lazy(() => import('./subPages/FreeMusicPage'));
const PotionsPage = lazy(() => import('./subPages/PotionsPage'));
const PotionsBopsPage = lazy(() => import('./subPages/PotionsBopsPage'));
const ProfilePage = lazy(() => import('./subPages/ProfilePage'));
const Messenger = lazy(() => import('./subPages/Messenger'));
const PotionSongDetailPage = lazy(
  () => import('./subPages/PotionSongDetailPage')
);
const PotionRevenuePage = lazy(() => import('./subPages/PotionRevenuePage'));
const PotionPreviewPage = lazy(() => import('./subPages/PotionPreviewPage'));
const PotionsManageBopsPae = lazy(
  () => import('./subPages/PotionsManageBopsPage')
);
const MultiArtistDetailPage = lazy(
  () => import('./subPages/MultiArtistDetailPage')
);
const PotionBopsDetailPage = lazy(
  () => import('./subPages/PotionBopsDetailPage')
);
const PodsAllPage = lazy(() => import('./subPages/PodsAllPage'));
const WallPostPage = lazy(() => import('./subPages/WallPostPage'));
const HomePageSimplified = lazy(() => import('./subPages/HomePageSimplified'));
const ArtistsPageSimplified = lazy(
  () => import('./subPages/HomePageSimplified/Artists')
);
const MusicPage = lazy(() => import('./subPages/MusicPage'));
const PlatformsPage = lazy(() => import('./subPages/PlatformsPage'));
const SingleSongDetailPage = lazy(
  () => import('./subPages/SingleSongDetailPage')
);
const SingleWeb3TrackPage = lazy(
  () => import('./subPages/SingleWeb3TrackPage')
);
const SingleMyxTrackPage = lazy(() => import('./subPages/SingleMyxTrackPage'));
const SongListenerPage = lazy(() => import('./subPages/SongListenerPage'));
const AlbumsPage = lazy(() => import('./subPages/AlbumsPage'));
const AlbumDetailPage = lazy(() => import('./subPages/AlbumDetailPage'));
const MediaFractionsCard = lazy(
  () => import('./components/Cards/MediaFractionsCard')
);
const OwnedNFTSongsPage = lazy(() => import('./subPages/OwnedNFTSongsPage'));
const OwnedNFTMediasPage = lazy(() => import('./subPages/OwnedNFTMediasPage'));
const OwnedPodsPage = lazy(() => import('./subPages/OwnedPodsPage'));
const NotFoundPage = lazy(() => import('./subPages/NotFoundPage'));
const NotificationPage = lazy(() => import('./subPages/NotificationPage'));
const ProfileNotFound = lazy(() => import('./subPages/ProfileNotFound'));
const SingleSongEditionsPage = lazy(
  () => import('./subPages/SingleSongEditionsPage')
);
const AllWallPostsPage = lazy(() => import('./subPages/AllWallPostsPage'));
const MarketplacePage = lazy(() => import('./subPages/MarketplacePage'));
const CollectionsAllPage = lazy(() => import('./subPages/CollectionsAllPage'));
const CollectionDetailPage = lazy(
  () => import('./subPages/CollectionDetailPage')
);
const PlatformDetailPage = lazy(() => import('./subPages/PlatformDetailPage'));
const MarketPlaceArtistDetailPage = lazy(
  () => import('./subPages/MarketPlaceArtistDetailPage')
);
const LandPage = lazy(() => import('./subPages/LandPage'));

const MintedSongsAllPage = lazy(() => import('./subPages/MintedSongsAllPage'));
const WeeklySalesPage = lazy(() => import('./subPages/WeeklySalesPage'));
const SongNFTDetailsPage = lazy(() => import('./subPages/SongNFTDetailsPage'));
const MerchCreatePage = lazy(() => import('./subPages/MerchCreatePage'));
const MerchAttachPage = lazy(() => import('./subPages/MerchAttachPage'));

export default function MusicDaoRouter(props) {
  return (
    <Suspense fallback={<Loading />}>
      <Switch>
        <Route exact path="/profile/notFound" component={ProfileNotFound} />
        <Route exact path="/:userId/messages" component={Messenger} />
        <Route exact path="/music/collections" component={AlbumsPage} />
        <Route exact path="/music/collection/:id" component={AlbumDetailPage} />
        <Route
          exact
          path="/music/track/:id/listener"
          component={SongListenerPage}
        />
        <Route
          exact
          path="/music/track/:id/editions"
          component={SingleSongEditionsPage}
        />
        <Route exact path="/music/track/:id" component={SingleSongDetailPage} />
        <Route
          exact
          path="/music/myx-track/:id"
          component={SingleMyxTrackPage}
        />
        <Route
          exact
          path="/music/web3-track/:id"
          component={SingleWeb3TrackPage}
        />
        <Route exact path="/music" component={MusicPage} />
        <Route exact path="/platforms" component={PlatformsPage} />
        <Route exact path="/merch" component={MerchPage} />
        <Route exact path="/artists" component={ArtistsPageSimplified} />
        <Route exact path="/staking/" component={StakingPage} />
        <Route exact path="/liquidity/" component={LiquidityPage} />
        <Route
          exact
          path="/liquidity/pool_detail/:id"
          component={LiquidityPoolDetailPage}
        />
        <Route
          exact
          path="/liquidity/pool_management/:id"
          component={LiquidityPoolManagementPage}
        />
        <Route
          exact
          path="/liquidity/position/:id"
          component={LiquidityPositionPage}
        />
        <Route exact path="/governance/" component={GovernancePage} />
        <Route
          exact
          path="/governance/all_discussions"
          component={DiscussionAllPage}
        />
        <Route
          exact
          path="/governance/discussion_detail/:id"
          component={DiscussionDetailPage}
        />
        <Route exact path="/high-yield/" component={HighYieldPage} />
        <Route exact path="/governance/votes/:podId" component={VotePage} />
        <Route exact path="/governance/votes/:podId/:id" component={FullVote} />
        <Route exact path="/governance/proposals/" component={ProposalPage} />
        <Route
          exact
          path="/governance/proposals/:id"
          component={FullDaoProposal}
        />
        {/* <Route exact path="/claimable-music/" component={ClaimableMusicPage} /> */}
        <Route exact path="/artists/:id" component={ArtistPage} />
        <Route
          exact
          path="/mutli-artist/:id"
          component={MultiArtistDetailPage}
        />
        <Route exact path="/free-music" component={FreeMusicPage} />
        <Route exact path="/staking/calculator" component={CalculatorPage} />
        <Route exact path="/capsules" component={PodsPage} />
        <Route exact path="/pod-post/:id" component={WallPostPage} />
        <Route exact path="/all-pod-post/:id" component={AllWallPostsPage} />
        <Route exact path="/capsules/all" component={PodsAllPage} />
        <Route
          exact
          path="/capsules/distribution/:podAddress"
          component={PodDistributionPage}
        />
        <Route exact path="/capsules/:podId" component={PodDetailsPage} />
        <Route
          exact
          path="/capsules/:podAddress/:wallPostId"
          component={FullWallPost}
        />
        <Route exact path="/trade-trax/" component={TradeTraxPage} />
        <Route exact path="/potions/" component={PotionsPage} />
        <Route exact path="/potions/revenue" component={PotionRevenuePage} />
        <Route exact path="/potions/preview" component={PotionPreviewPage} />
        <Route
          exact
          path="/potions/manageBops"
          component={PotionsManageBopsPae}
        />
        <Route
          exact
          path="/potions/manageBops/:id"
          component={PotionBopsDetailPage}
        />
        <Route
          exact
          path="/profile/tracks/:userId"
          component={OwnedNFTSongsPage}
        />
        <Route
          exact
          path="/profile/medias/:userId"
          component={OwnedNFTMediasPage}
        />
        <Route
          exact
          path="/profile/collections/:urlSlug"
          component={AlbumsPage}
        />
        <Route
          exact
          path="/profile/capsules/:urlSlug"
          component={OwnedPodsPage}
        />
        <Route exact path="/profile/:userSlug" component={ProfilePage} />
        <Route exact path="/potions/:id" component={PotionSongDetailPage} />
        <Route exact path="/potions/:songId/bops" component={PotionsBopsPage} />

        <Route exact path="/marketplace" component={MarketplacePage} />
        <Route exact path="/collections" component={CollectionsAllPage} />
        <Route
          exact
          path="/collections/:collectionId"
          component={CollectionDetailPage}
        />
        <Route
          exact
          path="/marketplace/artists/:artistId"
          component={MarketPlaceArtistDetailPage}
        />
        <Route
          exact
          path="/platforms/:platformId"
          component={PlatformDetailPage}
        />
        <Route exact path="/songs" component={MintedSongsAllPage} />
        <Route exact path="/web3-artists" component={WeeklySalesPage} />
        <Route exact path="/mediaFractions" component={MediaFractionsCard} />
        <Route exact path="/merch/create" component={MerchCreatePage} />
        <Route exact path="/merch/attach" component={MerchAttachPage} />
        <Route exact path="/" component={HomePageSimplified} />
        <Route exact path="/notifications" component={NotificationPage} />
        <Route exact path="/land" component={LandPage} />
        <Route path="/player" component={PlayerPage} />
        <Route path="/404" component={NotFoundPage} />
        <Redirect to="/404" />
      </Switch>
    </Suspense>
  );
}
