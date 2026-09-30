import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { soundEffects } from '../lib/soundEffects';
import confetti from 'canvas-confetti';
import {
  Package,
  Store,
  MapPin,
  Clock,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Copy,
  Gift,
  Award,
  ArrowRight,
  Search,
  ShoppingBag,
  Ticket,
  BadgePercent,
  Calendar,
  Flame,
  Coins,
  ChevronRight,
  RotateCcw,
  Check,
  Receipt,
  X,
  ExternalLink,
} from 'lucide-react';

interface CustomerLogisticsHubProps {
  onNavigatePass?: () => void;
}

interface PickedUpOrder {
  id: string;
  trackingNumber: string;
  orderId: string;
  item: string;
  category: string;
  platform: string;
  price: number;
  packageSize: 'SMALL' | 'MEDIUM' | 'LARGE';
  storeId: string;
  storeName: string;
  storeAddress: string;
  storeOwner: string;
  storePhone: string;
  pickedUpDate: string;
  pickedUpTime: string;
  verificationMethod: string;
  pinUsed: string;
  co2SavedGrams: number;
}

export const CustomerLogisticsHub: React.FC<CustomerLogisticsHubProps> = ({ onNavigatePass }) => {
  const { stores, language, currentUser } = useApp();

  // Picked up orders mock history for the customer
  const initialHistory: PickedUpOrder[] = [
    {
      id: 'pickup-1',
      trackingNumber: 'KC-70091-KOL',
      orderId: 'FLIP-9821734',
      item: 'boAt Airdopes 141 Bluetooth Earbuds',
      category: 'Electronics',
      platform: 'Flipkart Logistics',
      price: 1299,
      packageSize: 'SMALL',
      storeId: 'store-1',
      storeName: 'Ghosh Brothers Daily Provisions',
      storeAddress: 'EP Block, Near Webel More, Sector V, Salt Lake',
      storeOwner: 'Subhashish Ghosh',
      storePhone: '+91 98301 23456',
      pickedUpDate: '18 Aug 2026',
      pickedUpTime: '06:15 PM',
      verificationMethod: '4-Digit PIN Verified',
      pinUsed: '4892',
      co2SavedGrams: 320,
    },
    {
      id: 'pickup-2',
      trackingNumber: 'KC-99201-KOL',
      orderId: 'MYNT-6721990',
      item: 'Puma Nitro Men Running Shoes (UK 9)',
      category: 'Footwear & Apparel',
      platform: 'Myntra / Shadowfax',
      price: 2499,
      packageSize: 'MEDIUM',
      storeId: 'store-1',
      storeName: 'Ghosh Brothers Daily Provisions',
      storeAddress: 'EP Block, Near Webel More, Sector V, Salt Lake',
      storeOwner: 'Subhashish Ghosh',
      storePhone: '+91 98301 23456',
      pickedUpDate: '20 Aug 2026',
      pickedUpTime: '05:40 PM',
      verificationMethod: '4-Digit PIN Verified',
      pinUsed: '9012',
      co2SavedGrams: 340,
    },
    {
      id: 'pickup-3',
      trackingNumber: 'KC-55104-KOL',
      orderId: 'AMZN-4491028',
      item: 'Philips HD9200 4.1L Digital Air Fryer',
      category: 'Home & Kitchen',
      platform: 'Amazon Transportation',
      price: 4999,
      packageSize: 'LARGE',
      storeId: 'store-2',
      storeName: 'Maa Tara Super Mart & Stationers',
      storeAddress: 'College More, Salt Lake Sector V',
      storeOwner: 'Bipul Das',
      storePhone: '+91 98311 98765',
      pickedUpDate: '21 Aug 2026',
      pickedUpTime: '07:10 PM',
      verificationMethod: 'Counter QR Pass Scan',
      pinUsed: '7315',
      co2SavedGrams: 380,
    },
    {
      id: 'pickup-4',
      trackingNumber: 'KC-44192-KOL',
      orderId: '1MG-3391081',
      item: 'Tata 1mg Urgent Diabetes Insulin & Care Kit',
      category: 'Healthcare & Essentials',
      platform: 'Tata 1mg Pharma',
      price: 849,
      packageSize: 'SMALL',
      storeId: 'store-2',
      storeName: 'Maa Tara Super Mart & Stationers',
      storeAddress: 'College More, Salt Lake Sector V',
      storeOwner: 'Bipul Das',
      storePhone: '+91 98311 98765',
      pickedUpDate: '22 Aug 2026',
      pickedUpTime: '04:30 PM',
      verificationMethod: '4-Digit PIN Verified',
      pinUsed: '2684',
      co2SavedGrams: 310,
    },
    {
      id: 'pickup-5',
      trackingNumber: 'KC-66291-KOL',
      orderId: 'AMZN-8812903',
      item: 'Milton Thermosteel 1000ml Insulated Water Flask',
      category: 'Daily Living',
      platform: 'Amazon Transportation',
      price: 920,
      packageSize: 'MEDIUM',
      storeId: 'store-3',
      storeName: 'Mukherjee Variety Store & Xerox',
      storeAddress: 'SDF Building Main Gate, GP Block, Sector V',
      storeOwner: 'Amit Mukherjee',
      storePhone: '+91 98319 88776',
      pickedUpDate: '24 Aug 2026',
      pickedUpTime: '06:45 PM',
      verificationMethod: '4-Digit PIN Verified',
      pinUsed: '5190',
      co2SavedGrams: 350,
    },
  ];

  // Loyalty streak count (default 5 to showcase unlocked milestone)
  const [pickupCount, setPickupCount] = useState<number>(5);
  const [copiedCoupon, setCopiedCoupon] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedReceipt, setSelectedReceipt] = useState<PickedUpOrder | null>(null);
  const [redeemedStore, setRedeemedStore] = useState<string | null>(null);

  // Milestone triggers
  const isCouponUnlocked = pickupCount >= 5;

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#fffd47', '#1A5336', '#38BDF8', '#F5A623'],
      });
    } catch {
      // Confetti fallback
    }
  };

  const handleSimulatePickup = () => {
    if (pickupCount < 5) {
      const next = pickupCount + 1;
      setPickupCount(next);
      soundEffects.playScanBeep();
      if (next === 5) {
        soundEffects.playCashRegister();
        triggerConfetti();
      }
    } else {
      // Loop or reset for testing
      setPickupCount(0);
    }
  };

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText('KIRANA15REWARD');
    setCopiedCoupon(true);
    soundEffects.playCashRegister();
    setTimeout(() => setCopiedCoupon(false), 2500);
  };

  const handleRedeemAtStore = (storeName: string) => {
    setRedeemedStore(storeName);
    soundEffects.playCashRegister();
    triggerConfetti();
  };

  // Visited Stores summary from completed orders
  const visitedStoresMap = initialHistory.slice(0, Math.max(pickupCount, 1)).reduce((acc, order) => {
    if (!acc[order.storeId]) {
      acc[order.storeId] = {
        id: order.storeId,
        name: order.storeName,
        address: order.storeAddress,
        owner: order.storeOwner,
        phone: order.storePhone,
        pickupCount: 0,
      };
    }
    acc[order.storeId].pickupCount += 1;
    return acc;
  }, {} as Record<string, { id: string; name: string; address: string; owner: string; phone: string; pickupCount: number }>);

  const visitedStoresList = Object.values(visitedStoresMap);

  // Filtered order history
  const filteredOrders = initialHistory.filter((order) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      order.trackingNumber.toLowerCase().includes(q) ||
      order.orderId.toLowerCase().includes(q) ||
      order.item.toLowerCase().includes(q) ||
      order.storeName.toLowerCase().includes(q) ||
      order.platform.toLowerCase().includes(q)
    );
  });

  const totalCo2Saved = initialHistory.slice(0, pickupCount).reduce((acc, o) => acc + o.co2SavedGrams, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* 1. Dual-Portal Switcher Tabs for Customer */}
      <div className="bg-white border-2 border-[#CDE3D5] rounded-3xl p-3 shadow-md flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button
            onClick={onNavigatePass}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl text-xs font-bold text-[#0F291E] hover:bg-[#EAF3ED] border border-transparent hover:border-[#CDE3D5] transition flex items-center justify-center space-x-2 group"
          >
            <Ticket className="w-4 h-4 text-[#1A5336] group-hover:scale-110 transition" />
            <span className="font-roxborough text-xs font-bold">1. Customer Pickup Pass</span>
            <span className="text-[10px] bg-amber-100 text-amber-800 font-mono px-2 py-0.5 rounded-full font-bold">
              Active Pass
            </span>
          </button>

          <button
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl text-xs font-bold bg-[#1A5336] text-white shadow-md border border-[#fffd47]/40 flex items-center justify-center space-x-2"
          >
            <Package className="w-4 h-4 text-[#fffd47]" />
            <span className="font-roxborough text-xs font-bold text-[#fffd47]">2. Customer Logistics Hub</span>
            <span className="text-[10px] bg-[#fffd47] text-[#0F291E] font-black px-2 py-0.5 rounded-full">
              ₹15 Box
            </span>
          </button>
        </div>

        {/* User Grahak Badge */}
        <div className="flex items-center space-x-2.5 text-xs text-[#0F291E] font-medium bg-[#F4F8F5] px-3.5 py-1.5 rounded-2xl border border-[#CDE3D5]">
          <div className="w-6 h-6 rounded-full bg-[#1A5336] text-[#fffd47] flex items-center justify-center font-bold text-[11px]">
            👤
          </div>
          <div>
            <span className="font-bold text-[#0F291E]">
              {currentUser?.name || 'Anirban Chatterjee'}
            </span>
            <span className="text-[10px] text-[#1A5336] font-mono ml-1.5 font-bold">
              • Verified Grahak
            </span>
          </div>
        </div>
      </div>

      {/* 2. Top Banner: Customer Summary & Green Footprint */}
      <div className="bg-gradient-to-r from-[#0F291E] via-[#143d27] to-[#1A5336] border border-[#1A5336] rounded-3xl p-6 shadow-xl text-white">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-[#fffd47] text-[#0F291E] text-[10px] font-black px-2.5 py-0.5 rounded-full tracking-wider uppercase">
                PUDO Grahak Hub
              </span>
              <span className="text-xs text-white/70 font-mono">
                Kolkata Sector V Network
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F8F5EF] tracking-tight">
              Customer Logistics &amp; Rewards Hub
            </h1>
            <p className="text-xs sm:text-sm text-[#D1E7DD] max-w-2xl leading-relaxed">
              Track your pickup history from neighborhood kirana stores, monitor saved CO₂ emissions, and earn direct shop discount vouchers on every 5 completed pickups!
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-3 w-full lg:w-auto">
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15 text-center">
              <div className="text-[10px] uppercase font-bold text-white/70">Pickups Done</div>
              <div className="text-xl sm:text-2xl font-black text-[#fffd47] font-mono mt-0.5">
                {pickupCount}
              </div>
              <div className="text-[9px] text-emerald-300 font-medium">100% On-Time</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15 text-center">
              <div className="text-[10px] uppercase font-bold text-white/70">CO₂ Avoided</div>
              <div className="text-xl sm:text-2xl font-black text-emerald-300 font-mono mt-0.5">
                {(totalCo2Saved / 1000).toFixed(2)} kg
              </div>
              <div className="text-[9px] text-white/70 font-medium">{pickupCount} Van Runs Cut</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15 text-center">
              <div className="text-[10px] uppercase font-bold text-white/70">Store Reward</div>
              <div className="text-xl sm:text-2xl font-black text-[#fffd47] font-mono mt-0.5">
                {isCouponUnlocked ? '₹15 OFF' : `${5 - pickupCount} left`}
              </div>
              <div className="text-[9px] text-[#fffd47] font-bold">
                {isCouponUnlocked ? '🎉 Unlocked' : 'In Progress'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. GAMIFIED 5-PICKUP LOYALTY STREAK BOX SYSTEM */}
      <section className="bg-white border-2 border-[#CDE3D5] rounded-3xl p-6 shadow-lg space-y-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#CDE3D5] pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-[#fffd47] text-[#0F291E] flex items-center justify-center shadow-md">
              <Gift className="w-6 h-6 text-[#1A5336]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-[#0B2317]">
                  5-Pickup Loyalty Streak &amp; Reward Box
                </h2>
                <span className="text-[10px] font-bold bg-[#EAF3ED] text-[#1A5336] px-2.5 py-0.5 rounded-full border border-[#CDE3D5]">
                  Kirana Loyalty Card
                </span>
              </div>
              <p className="text-xs text-[#4A5B52] mt-0.5">
                Each parcel you pick up from a Kirana fills 1 box. Fill all 5 boxes to get an instant <strong>₹15 Coupon Code</strong> usable at any visited shop!
              </p>
            </div>
          </div>

          {/* Interactive Tester Controls */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleSimulatePickup}
              className="px-3.5 py-2 rounded-xl bg-[#1A5336] hover:bg-[#133F28] text-white text-xs font-bold transition shadow-sm flex items-center gap-1.5 active:scale-95"
              title="Click to simulate completing a parcel pickup"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#fffd47]" />
              <span>{pickupCount >= 5 ? 'Reset / Loop (0-5)' : '+1 Pickup (Fill Box)'}</span>
            </button>

            <button
              onClick={() => {
                setPickupCount(5);
                soundEffects.playCashRegister();
                triggerConfetti();
              }}
              className="px-3 py-2 rounded-xl bg-[#fffd47] hover:bg-[#fffd47]/90 text-[#0F291E] text-xs font-extrabold transition shadow-sm active:scale-95"
              title="Instantly unlock 5/5 milestone"
            >
              5/5 Milestone
            </button>
          </div>
        </div>

        {/* Progress Bar & Subtext */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-[#0F291E] flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
              <span>Current Pickup Streak: <strong className="text-[#1A5336]">{pickupCount} of 5 Boxes Filled</strong></span>
            </span>
            <span className="text-[#1A5336] font-mono">
              {Math.min(100, Math.round((pickupCount / 5) * 100))}% Completed
            </span>
          </div>

          {/* Progress Bar Track */}
          <div className="w-full h-3.5 bg-[#EAF3ED] rounded-full overflow-hidden border border-[#CDE3D5] p-0.5">
            <div
              className="h-full bg-gradient-to-r from-[#1A5336] via-emerald-500 to-[#fffd47] rounded-full transition-all duration-500 ease-out shadow-sm"
              style={{ width: `${Math.min(100, (pickupCount / 5) * 100)}%` }}
            />
          </div>
        </div>

        {/* THE 5 VISUAL BOXES */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3.5">
          {[1, 2, 3, 4, 5].map((boxNumber) => {
            const isFilled = pickupCount >= boxNumber;
            const isNext = pickupCount === boxNumber - 1;
            const isMilestone = boxNumber === 5;
            const orderForBox = initialHistory[boxNumber - 1];

            return (
              <div
                key={boxNumber}
                className={`relative rounded-2xl p-4 transition-all duration-300 flex flex-col justify-between min-h-[170px] ${
                  isFilled
                    ? isMilestone
                      ? 'bg-gradient-to-b from-[#1A5336] to-[#0F291E] text-white border-2 border-[#fffd47] shadow-lg scale-102 ring-2 ring-[#fffd47]/50'
                      : 'bg-[#F4F8F5] text-[#0F291E] border-2 border-[#1A5336] shadow-sm'
                    : isNext
                    ? 'bg-amber-50/70 border-2 border-dashed border-amber-400 text-stone-800 shadow-sm animate-pulse'
                    : 'bg-stone-50 border-2 border-dashed border-stone-200 text-stone-400 opacity-60'
                }`}
              >
                {/* Box Badge Header */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[11px] font-black px-2 py-0.5 rounded-full ${
                      isFilled
                        ? isMilestone
                          ? 'bg-[#fffd47] text-[#0F291E]'
                          : 'bg-[#1A5336] text-[#fffd47]'
                        : isNext
                        ? 'bg-amber-200 text-amber-900'
                        : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    Box #{boxNumber}
                  </span>

                  {isFilled ? (
                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  ) : isMilestone ? (
                    <span className="text-sm">🎁</span>
                  ) : (
                    <span className="text-xs font-mono font-bold text-stone-400">#{boxNumber}</span>
                  )}
                </div>

                {/* Central Box Graphic */}
                <div className="my-2 flex flex-col items-center justify-center text-center">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-300 ${
                      isFilled
                        ? isMilestone
                          ? 'bg-[#fffd47] text-[#0F291E] scale-110 shadow-md'
                          : 'bg-[#1A5336] text-[#fffd47] shadow-sm'
                        : isNext
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-stone-100 text-stone-400'
                    }`}
                  >
                    {isMilestone ? (
                      <Gift className="w-6 h-6" />
                    ) : (
                      <Package className="w-6 h-6" />
                    )}
                  </div>

                  <span
                    className={`text-xs font-bold mt-2 ${
                      isFilled
                        ? isMilestone
                          ? 'text-[#fffd47]'
                          : 'text-[#1A5336]'
                        : isNext
                        ? 'text-amber-800'
                        : 'text-stone-400'
                    }`}
                  >
                    {isFilled
                      ? isMilestone
                        ? 'Reward Unlocked!'
                        : 'Pickup Completed'
                      : isNext
                      ? 'Next Pickup'
                      : 'Locked'}
                  </span>
                </div>

                {/* Order Footnote on Box */}
                <div
                  className={`text-[10px] leading-tight pt-2 border-t ${
                    isFilled
                      ? isMilestone
                        ? 'border-white/20 text-white/90'
                        : 'border-[#CDE3D5] text-[#4A5B52]'
                      : 'border-stone-200 text-stone-400'
                  }`}
                >
                  {isFilled && orderForBox ? (
                    <div>
                      <div className="font-semibold truncate">{orderForBox.item}</div>
                      <div className="text-[9px] opacity-80 truncate">{orderForBox.storeName.split(' ')[0]} Hub</div>
                    </div>
                  ) : isMilestone ? (
                    <div className="font-bold text-center text-amber-700">₹15 Coupon Reward</div>
                  ) : (
                    <div className="text-center">Collect parcel to fill</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 4. REWARD UNLOCKED CARD: ₹15 COUPON CODE & REDEEM AT VISITED SHOPS */}
        {isCouponUnlocked ? (
          <div className="bg-gradient-to-r from-emerald-900 via-[#1A5336] to-[#0F291E] rounded-3xl p-6 text-white shadow-xl border-2 border-[#fffd47] relative overflow-hidden animate-fadeIn space-y-6">
            {/* Background Decorative Stamp */}
            <div className="absolute -right-6 -bottom-6 w-44 h-44 rounded-full bg-[#fffd47]/10 pointer-events-none flex items-center justify-center">
              <Award className="w-28 h-28 text-[#fffd47]/20" />
            </div>

            {/* Banner Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/15 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="bg-[#fffd47] text-[#0F291E] font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Milestone Reached: 5/5 Pickups</span>
                  </span>
                  <span className="text-xs text-emerald-300 font-mono font-bold">
                    100% Zero-Emission Grahak
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  🎉 Congratulations! Your ₹15 Kirana Voucher Is Unlocked
                </h3>
                <p className="text-xs text-[#D1E7DD]">
                  Thank you for walking to your neighborhood kirana stores! You can use this coupon code for an instant <strong>₹15 discount</strong> on any purchase at any of the stores you visited.
                </p>
              </div>

              {/* Coupon Code Pill */}
              <div className="bg-white/15 backdrop-blur-md rounded-2xl p-3 border border-[#fffd47]/40 flex items-center space-x-3 shrink-0 self-start sm:self-auto">
                <div className="text-right">
                  <span className="text-[10px] text-white/70 block uppercase font-mono">Coupon Code:</span>
                  <span className="text-lg font-black text-[#fffd47] font-mono tracking-wider">
                    KIRANA15REWARD
                  </span>
                </div>
                <button
                  onClick={handleCopyCoupon}
                  className="p-2.5 bg-[#fffd47] hover:bg-[#fffd47]/90 text-[#0F291E] rounded-xl font-bold transition shadow-sm flex items-center justify-center active:scale-95"
                  title="Copy coupon code"
                >
                  {copiedCoupon ? <CheckCircle2 className="w-5 h-5 text-[#1A5336]" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* List of Visited Shops where coupon can be used */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-extrabold text-[#fffd47] flex items-center gap-2">
                  <Store className="w-4 h-4 text-[#fffd47]" />
                  <span>Valid At Any Of The {visitedStoresList.length} Kirana Stores You Have Visited:</span>
                </h4>
                <span className="text-[11px] text-white/70 font-mono">
                  No Minimum Cart Required
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {visitedStoresList.map((store) => (
                  <div
                    key={store.id}
                    className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 hover:border-[#fffd47]/60 transition flex flex-col justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <span className="font-extrabold text-sm text-white">{store.name}</span>
                        <span className="bg-[#fffd47]/20 text-[#fffd47] text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-[#fffd47]/30 shrink-0">
                          {store.pickupCount} pickup{store.pickupCount > 1 ? 's' : ''}
                        </span>
                      </div>
                      <p className="text-white/70 text-[11px] mt-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#fffd47] shrink-0" />
                        <span className="truncate">{store.address}</span>
                      </p>
                      <p className="text-white/80 text-[11px] mt-1">
                        Dukandar: <strong className="text-white">{store.owner}</strong> ({store.phone})
                      </p>
                    </div>

                    <button
                      onClick={() => handleRedeemAtStore(store.name)}
                      className={`w-full py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-sm active:scale-95 ${
                        redeemedStore === store.name
                          ? 'bg-emerald-400 text-emerald-950 font-black'
                          : 'bg-[#fffd47] hover:bg-white text-[#0F291E]'
                      }`}
                    >
                      {redeemedStore === store.name ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Redeemed at Counter!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5 text-[#0F291E]" />
                          <span>Use ₹15 Voucher Here</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>

              {redeemedStore && (
                <div className="bg-emerald-500/20 border border-emerald-400/50 rounded-2xl p-3 text-xs flex items-center justify-between gap-2 text-emerald-200 animate-fadeIn">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                    <span>
                      Voucher successfully applied at <strong>{redeemedStore}</strong>! ₹15 deducted from your counter purchase (milk/bread/tea/snacks).
                    </span>
                  </div>
                  <button
                    onClick={() => setRedeemedStore(null)}
                    className="text-white/70 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Locked State Preview */
          <div className="bg-[#F4F8F5] border-2 border-dashed border-[#CDE3D5] rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[#4A5B52]">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shrink-0">
                <Gift className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-[#0B2317]">
                  {5 - pickupCount} More Pickup{5 - pickupCount > 1 ? 's' : ''} Needed to Unlock ₹15 Voucher
                </h4>
                <p className="text-xs text-[#4A5B52] mt-0.5">
                  Pick up your current parcel at the assigned kirana store to fill Box #{pickupCount + 1}. Once you reach 5, your ₹15 coupon code will appear right here!
                </p>
              </div>
            </div>

            <button
              onClick={handleSimulatePickup}
              className="bg-[#1A5336] hover:bg-[#133F28] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5 transition active:scale-95 whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#fffd47]" />
              <span>Simulate Pickup # {pickupCount + 1}</span>
            </button>
          </div>
        )}
      </section>

      {/* 5. PREVIOUS PICKED-UP ORDERS HISTORY */}
      <section className="bg-white border-2 border-[#CDE3D5] rounded-3xl p-6 shadow-lg space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#CDE3D5] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold text-[#0B2317]">
                Previous Picked-Up Orders
              </h2>
              <span className="text-[10px] font-bold bg-[#E0F2FE] text-[#0284C7] px-2.5 py-0.5 rounded-full border border-[#BAE6FD]">
                {filteredOrders.length} Completed
              </span>
            </div>
            <p className="text-xs text-[#4A5B52] mt-0.5">
              Complete history of all packages successfully picked up by you from Kirana hubs.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tracking, item or store..."
              className="w-full bg-[#F4F8F5] border border-[#CDE3D5] rounded-xl pl-9 pr-3 py-2 text-xs text-[#0F291E] placeholder-[#4A5B52] focus:outline-none focus:border-[#1A5336]"
            />
            <Search className="w-4 h-4 text-[#4A5B52] absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Orders List Grid */}
        <div className="space-y-3">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-[#F4F8F5] hover:bg-[#EAF3ED] border border-[#CDE3D5] rounded-2xl p-4 transition duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Left Item Details */}
              <div className="flex items-start space-x-3.5">
                <div className="w-12 h-12 rounded-2xl bg-white border border-[#CDE3D5] flex items-center justify-center text-[#1A5336] shadow-sm shrink-0">
                  <Package className="w-6 h-6" />
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-extrabold text-sm text-[#0B2317]">
                      {order.item}
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-white text-[#1A5336] px-2 py-0.5 rounded-md border border-[#CDE3D5]">
                      {order.trackingNumber}
                    </span>
                    <span className="text-[10px] font-bold bg-[#EAF3ED] text-[#1A5336] px-2 py-0.5 rounded-full border border-[#CDE3D5]">
                      ✅ Picked Up
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#4A5B52]">
                    <span className="flex items-center gap-1">
                      <Store className="w-3.5 h-3.5 text-[#1A5336]" />
                      <strong>{order.storeName}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#4A5B52]" />
                      <span>{order.pickedUpDate} at {order.pickedUpTime}</span>
                    </span>
                    <span className="text-[11px] text-emerald-700 font-medium">
                      🌱 {order.co2SavedGrams}g CO₂ avoided
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Summary & Action */}
              <div className="flex items-center justify-between md:justify-end space-x-3 border-t md:border-t-0 pt-2 md:pt-0 border-[#CDE3D5]">
                <div className="text-left md:text-right text-xs">
                  <div className="font-mono font-bold text-[#0B2317]">
                    PIN Used: <span className="text-[#1A5336]">{order.pinUsed}</span>
                  </div>
                  <div className="text-[10px] text-[#4A5B52] font-mono">
                    {order.platform}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedReceipt(order)}
                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#1A5336] text-[#0F291E] hover:text-white border border-[#CDE3D5] text-xs font-bold transition shadow-xs flex items-center space-x-1.5"
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>Digital Receipt</span>
                </button>
              </div>
            </div>
          ))}

          {filteredOrders.length === 0 && (
            <div className="text-center py-8 text-[#4A5B52] text-xs">
              No matching picked-up orders found for "{searchQuery}".
            </div>
          )}
        </div>
      </section>

      {/* Digital Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#CDE3D5] space-y-4">
            <div className="flex items-center justify-between border-b border-[#CDE3D5] pb-3">
              <div className="flex items-center space-x-2">
                <Store className="w-5 h-5 text-[#1A5336]" />
                <span className="font-extrabold text-sm text-[#0F291E]">KiranaConnect PUDO Receipt</span>
              </div>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#F4F8F5] p-4 rounded-2xl border border-[#CDE3D5] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#4A5B52]">Tracking Number:</span>
                <strong className="font-mono text-[#0B2317]">{selectedReceipt.trackingNumber}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4A5B52]">Order Reference:</span>
                <span className="font-mono text-[#0B2317]">{selectedReceipt.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4A5B52]">Item:</span>
                <strong className="text-[#0B2317] text-right truncate max-w-[200px]">{selectedReceipt.item}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4A5B52]">Kirana Pickup Hub:</span>
                <span className="text-[#1A5336] font-bold text-right">{selectedReceipt.storeName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4A5B52]">Pickup Timestamp:</span>
                <span>{selectedReceipt.pickedUpDate}, {selectedReceipt.pickedUpTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4A5B52]">Verification Method:</span>
                <span className="text-emerald-700 font-bold">{selectedReceipt.verificationMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4A5B52]">Repeat Van Run Avoided:</span>
                <span className="text-emerald-700 font-bold">1 Van Run ({selectedReceipt.co2SavedGrams}g CO₂)</span>
              </div>
            </div>

            <div className="text-center pt-2">
              <span className="text-[10px] text-[#4A5B52]">
                Verified by KiranaConnect Digital Proof of Handoff Protocol
              </span>
            </div>

            <button
              onClick={() => setSelectedReceipt(null)}
              className="w-full py-2.5 rounded-xl bg-[#1A5336] hover:bg-[#133F28] text-white text-xs font-bold transition shadow-sm"
            >
              Close Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
