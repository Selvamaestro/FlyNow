import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import HeroSlider from "../components/hero/HeroSlider";
import CategoryGrid from "../components/category/CategoryGrid";
import OfferGrid from "../components/offers/OfferGrid";
import FlashSaleGrid from "../components/flashsale/FlashSaleGrid";
import WalletCard from "../components/wallet/WalletCard";
import QRCodeCard from "../components/wallet/QRCodeCard";
import RewardCard from "../components/rewards/RewardCard";
import SpinWheel from "../components/rewards/SpinWheel";
import ScratchCard from "../components/rewards/ScratchCard";
const Home = () => {
  return (
    <div className="app-layout">

      <Sidebar />

      <div className="content">

        <Navbar />

        <HeroSlider />

        <CategoryGrid />

        <OfferGrid />

        <FlashSaleGrid />

        <WalletCard />
        
        <QRCodeCard />

<RewardCard />

<SpinWheel />

<ScratchCard />
      </div>

    </div>
  );
};

export default Home;