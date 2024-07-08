import exchange from './contracts/Exchange';
import auction from './contracts/Auction';
import loan from './contracts/Loan';
import erc20 from './contracts/ERC20Tokens';
import vaultFactory from './contracts/VaultFactory';
import tokenVault from './contracts/TokenVault';
import erc20Exchange from './contracts/Erc20Exchange';
import podManager from './contracts/PodManager';
import podManagerV2 from './contracts/PodManagerV2';
import mediaManagerV2 from './contracts/MediaManagerV2';
import merchManager from './contracts/MerchManager';
import podWithdrawManager from './contracts/PodWithdrawManager';
import distributionManager from './contracts/DistributionManager';
import socialErc20 from './contracts/SocialERC20';
import socialTokenDeployer from './contracts/SocialTokenDeployer';
import copyrightNFT from './contracts/CopyrightNFT';
import subscription from './contracts/Subscription';
import subscriptionReward from './contracts/SubscriptionReward';
import royaltyFactory from './contracts/RoyaltyFactory';
import erc721WithRoyalty from './contracts/Erc721WithRoyalty';
import erc1155WithRoyalty from './contracts/Erc1155WithRoyalty';
import stakingGovernance from './contracts/StakingGovernance';
import openSalesManager from './contracts/OpenSalesManager';
import stakingERC721 from './contracts/StakingERC721';

const api = (network) => {
  return {
    Exchange: exchange(network),
    Auction: auction(network),
    Loan: loan(network),
    Erc20: erc20(network),
    VaultFactory: vaultFactory(network),
    TokenVault: tokenVault(network),
    erc20Exchange: erc20Exchange(network),
    PodManager: podManager(network),
    PodManagerV2: podManagerV2(network),
    MediaManagerV2: mediaManagerV2(network),
    MerchManager: merchManager(network),
    PodWithdrawManager: podWithdrawManager(network),
    DistributionManager: distributionManager(network),
    SocialERC20: socialErc20(network),
    SocialTokenDeployer: socialTokenDeployer(network),
    CopyrightNFT: copyrightNFT(network),
    Subscription: subscription(network),
    SubscriptionReward: subscriptionReward(network),
    RoyaltyFactory: royaltyFactory(network),
    Erc721WithRoyalty: erc721WithRoyalty(network),
    Erc1155WithRoyalty: erc1155WithRoyalty(network),
    StakingGovernance: stakingGovernance(network),
    StakingERC721: stakingERC721(network),
    openSalesManager: openSalesManager(network)
  };
};

export default api;
