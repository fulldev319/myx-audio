import userReducer from './reducers/User';
import slugReducer from './reducers/Slug';
import loanReducer from './reducers/Loan';
import stakingReducer from './reducers/Staking';
import userBalances from './reducers/UserBalances';
import loginBoolReducer from './reducers/LoginBool';
import MessageBoxReducer from './reducers/MessageBox';
import reserveReducer from './reducers/StakingReserve';
import sideBarShowReducer from './reducers/SideBarShow';
import transactionReducer from './reducers/Transactions';
import selectedUserReducer from './reducers/SelectedUser';
import musicLendingReducer from './reducers/Lending';
import usersDiscordRoom from './reducers/UsersDiscordRoom';
import insuranceReducers from './reducers/InsuranceManager';
import navigationReducer from './reducers/navigationReducer';
import updateBasicInfoReducer from './reducers/UpdateBasicInfo';
import selectedDiscordRoom from './reducers/SelectedDiscordRoom';
import selectedAuthPageReducer from './reducers/SelectedAuthPage';
import updatePodCreationReducer from './reducers/UpdatePodCreation';
import usersTypesDiscordRoom from './reducers/UsersTypesDiscordRoom';
import selectedLendingPageReducer from './reducers/SelectedLendingPage';
import selectedProfilePageReducer from './reducers/SelectedProfilePage';
import selectedSwapTabPoolReducer from './reducers/SelectedSwapTabPool';
import updateAllProfileInfoReducer from './reducers/UpdateAllProfileInfo';
import selectedMenuMusicSwapReducer from './reducers/SelectedMenuMusicSwap';
import selectedSwapTabsValueReducer from './reducers/SelectedSwapTabsValue';
import updateDiscordRoomInfoReducer from './reducers/UpdateDiscordRoomInfo';
import selectedTokenMusicSwapReducer from './reducers/SelectedTokenMusicSwap';
import selectedOtherProfilePageReducer from './reducers/SelectedOtherProfilePage';
import selectedProtectionOptionsSwapReducer from './reducers/SelectedProtectionOptionsSwap';
import selectedLiquidityPoolMusicSwapReducer from './reducers/SelectedLiquidityPoolMusicSwap';
import musicsReducer from './reducers/Musics';
import artistsReducer from './reducers/Artists';
import podsReducer from './reducers/Pods';
import songsReducer from './reducers/Songs';
import collectionsReducer from './reducers/Collections';
import { createStore, combineReducers, compose, applyMiddleware } from 'redux';

// Set global state variables through Redux
const rootReducer = combineReducers({
  user: userReducer,
  slug: slugReducer,
  loan: loanReducer,
  reserves: reserveReducer,
  stakings: stakingReducer,
  topNav: navigationReducer,
  userBalances: userBalances,
  loginBool: loginBoolReducer,
  messageBox: MessageBoxReducer,
  sideBarShow: sideBarShowReducer,
  transactions: transactionReducer,
  musicLending: musicLendingReducer,
  selectedUser: selectedUserReducer,
  usersDiscordRoom: usersDiscordRoom,
  updateBasicInfo: updateBasicInfoReducer,
  selectedDiscordRoom: selectedDiscordRoom,
  selectedAuthPage: selectedAuthPageReducer,
  updatePodCreation: updatePodCreationReducer,
  usersTypesDiscordRoom: usersTypesDiscordRoom,
  poolsList: insuranceReducers.reducerPoolsList,
  selectedSwapTabPool: selectedSwapTabPoolReducer,
  selectedLendingPage: selectedLendingPageReducer,
  selectedProfilePage: selectedProfilePageReducer,
  updateAllProfileInfo: updateAllProfileInfoReducer,
  poolsLoading: insuranceReducers.reducerPoolsLoading,
  selectedMenuMusicSwap: selectedMenuMusicSwapReducer,
  updateDiscordRoomInfo: updateDiscordRoomInfoReducer,
  selectedSwapTabsValue: selectedSwapTabsValueReducer,
  selectedTokenMusicSwap: selectedTokenMusicSwapReducer,
  selectedOtherProfilePage: selectedOtherProfilePageReducer,
  trendingPoolsList: insuranceReducers.reducerTrendingPoolsList,
  selectedProtectionOptionsSwap: selectedProtectionOptionsSwapReducer,
  trendingPoolsLoading: insuranceReducers.reducerTrendingPoolsLoading,
  selectedLiquidityPoolMusicSwap: selectedLiquidityPoolMusicSwapReducer,
  musics: musicsReducer,
  artists: artistsReducer,
  pods: podsReducer,
  songs: songsReducer,
  collections: collectionsReducer
});

const composeEnhancers =
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Create Store
export const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware())
);
