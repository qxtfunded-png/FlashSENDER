/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  Wallet, 
  Clock, 
  Upload, 
  ChevronDown, 
  ChevronUp,
  Globe,
  Lock,
  Coins,
  CreditCard,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Constants & Data ---

const PRICING_PLANS = [
  { amount: 3000, fee: 45, label: "Starter" },
  { amount: 6000, fee: 75, label: "Pro" },
  { amount: 10000, fee: 130, label: "Advanced" },
  { amount: 25000, fee: 270, label: "Elite" },
  { amount: 50000, fee: 525, label: "Whale" },
];

const NETWORKS = [
  { id: 'trc20', name: 'TRC20 (Tron)', address: 'TC1QoUn778ZEpLzThheNGtQsPqg7QpmnkH', color: '#FF0013' },
  { id: 'bep20', name: 'BEP20 (BSC)', address: '0xca8c9363e2b2907f2fe1e74cddae7713f4b23a92', color: '#F3BA2F' },
  { id: 'erc20', name: 'ERC20 (Ethereum)', address: '0xca8c9363e2b2907f2fe1e74cddae7713f4b23a92', color: '#627EEA' },
  { id: 'solana', name: 'Solana (SOL)', address: '2FuPShQrsKEJsz5M1b1NYCrYsTP9iaS2iVrKj4eNUkWC', color: '#14F195' },
  { id: 'ton', name: 'TON (Toncoin)', address: 'UQBAvsFLKXx5BPg2EG7XJZxX5Vos65ff0qrRjXVJuHf81mdL', color: '#0088CC' },
  { id: 'aptos', name: 'Aptos', address: '0x5031a26140f9f81dcd0dd138602d872a642fe0ea82c394769945d031f3f1d6f0', color: '#000000' },
  { id: 'polygon', name: 'Polygon (Matic)', address: '0xca8c9363e2b2907f2fe1e74cddae7713f4b23a92', color: '#8247E5' },
  { id: 'arbitrum', name: 'Arbitrum One', address: '0xca8c9363e2b2907f2fe1e74cddae7713f4b23a92', color: '#28A0F0' },
  { id: 'plasma', name: 'Plasma', address: '0xca8c9363e2b2907f2fe1e74cddae7713f4b23a92', color: '#FF4500' },
  { id: 'btc', name: 'Bitcoin (BTC)', address: 'bc1qaey4xq8lvkkxyhnzs8w79p56xfzlk3q094py59', color: '#F7931A' },
];

const FAQS = [
  {
    q: "Is the Flash USDT Transferable?",
    a: "Yes, our Flash USDT is fully transferable to any wallet or exchange."
  },
  {
    q: "Is it Tradeable?",
    a: "Absolutely. You can trade it on any supported platform including Binance, Bitget, OKX, and more."
  },
  {
    q: "What is the Validity?",
    a: "The Flash USDT remains valid and visible in your wallet for 90 days."
  },
  {
    q: "Where does it work?",
    a: "It works on Quotex, Pocket Option, 1xBet, and all major betting sites, as well as all centralized and decentralized exchanges."
  }
];

// --- Components ---

const Navbar = () => (
  <nav className="flex items-center justify-between px-6 py-4 bg-zinc-950/50 backdrop-blur-md border-b border-zinc-800 sticky top-0 z-50">
    <div className="flex items-center gap-2">
      <div className="bg-emerald-500 p-1.5 rounded-lg">
        <Zap className="w-5 h-5 text-black fill-current" />
      </div>
      <span className="text-xl font-bold tracking-tighter text-white">FLASH<span className="text-emerald-500">USDT</span></span>
    </div>
    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
      <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
      <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
      <a href="#features" className="hover:text-white transition-colors">Features</a>
    </div>
    <button 
      onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
      className="bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-2 rounded-full text-sm font-bold transition-all transform hover:scale-105"
    >
      Get Started
    </button>
  </nav>
);

interface FAQItemProps {
  q: string;
  a: string;
  key?: React.Key;
}

const FAQItem = ({ q, a }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-zinc-800 py-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left group"
      >
        <span className="text-lg font-medium text-zinc-200 group-hover:text-emerald-400 transition-colors">{q}</span>
        {isOpen ? <ChevronUp className="w-5 h-5 text-zinc-500" /> : <ChevronDown className="w-5 h-5 text-zinc-500" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="mt-2 text-zinc-400 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

type Step = 'LANDING' | 'SELECT_RECEIVE_NETWORK' | 'INPUT_USER_ADDRESS' | 'SELECT_PAYMENT_METHOD' | 'PAYMENT_PAGE' | 'SUCCESS';
type ReceiveMethod = 'WALLET' | 'BINANCE_ID';

const BINANCE_PAY_ID = { id: 'binance_id', name: 'Binance ID (Instant)', address: '1135401445', name_label: 'Anonymous 1818', color: '#F3BA2F' };

export default function App() {
  const [step, setStep] = useState<Step>('LANDING');
  const [receiveMethod, setReceiveMethod] = useState<ReceiveMethod>('WALLET');
  const [selectedPlan, setSelectedPlan] = useState<typeof PRICING_PLANS[0] | null>(null);
  const [receiveNetwork, setReceiveNetwork] = useState<typeof NETWORKS[0] | null>(null);
  const [userWalletAddress, setUserWalletAddress] = useState('');
  const [paymentNetwork, setPaymentNetwork] = useState<typeof NETWORKS[0] | typeof BINANCE_PAY_ID | null>(null);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [proof, setProof] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let timer: number;
    if (step === 'PAYMENT_PAGE' && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlanSelect = (plan: typeof PRICING_PLANS[0]) => {
    setSelectedPlan(plan);
    setStep('SELECT_RECEIVE_NETWORK');
    window.scrollTo(0, 0);
  };

  const handleReceiveNetworkSelect = (network: typeof NETWORKS[0]) => {
    setReceiveNetwork(network);
    setStep('INPUT_USER_ADDRESS');
    window.scrollTo(0, 0);
  };

  const handleUserAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const minLength = receiveMethod === 'WALLET' ? 10 : 8;
    if (userWalletAddress.trim().length < minLength) return;
    setStep('SELECT_PAYMENT_METHOD');
    window.scrollTo(0, 0);
  };

  const handlePaymentNetworkSelect = (network: typeof NETWORKS[0] | typeof BINANCE_PAY_ID) => {
    setPaymentNetwork(network);
    setStep('PAYMENT_PAGE');
    setTimeLeft(600);
    window.scrollTo(0, 0);
  };

  const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProof(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (!proof) return;
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('SUCCESS');
      window.scrollTo(0, 0);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {step === 'LANDING' && (
            <motion.div 
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-24"
            >
              {/* Hero Section */}
              <section className="text-center space-y-8 pt-12">
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium"
                >
                  <Shield className="w-4 h-4" />
                  Official Flash USDT Service
                </motion.div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight">
                  GENERATE <span className="text-emerald-500">FLASH USDT</span> <br />
                  INSTANTLY & SECURELY
                </h1>
                <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto">
                  The most reliable flash software in the market. Transferable, tradeable, and valid for 90 days across all major exchanges and betting sites.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <button 
                    onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                    className="bg-emerald-500 hover:bg-emerald-400 text-black px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-2 transition-all"
                  >
                    View Pricing <ArrowRight className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })}
                    className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all"
                  >
                    Read FAQ
                  </button>
                </div>
              </section>

              {/* Features Grid */}
              <section id="features" className="grid md:grid-cols-3 gap-8">
                {[
                  { icon: Globe, title: "Global Support", desc: "Works on Binance, Bitget, OKX, and all major global exchanges." },
                  { icon: Lock, title: "Secure Protocol", desc: "Encrypted generation process ensuring your wallet safety." },
                  { icon: Coins, title: "Multi-Network", desc: "Available on TRC20, BEP20, ERC20, Solana, TON, and more." },
                ].map((f, i) => (
                  <div key={i} className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-emerald-500/50 transition-colors group">
                    <f.icon className="w-10 h-10 text-emerald-500 mb-6 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                    <p className="text-zinc-400 leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </section>

              {/* Pricing Section */}
              <section id="pricing" className="space-y-12">
                <div className="text-center space-y-4">
                  <h2 className="text-4xl font-bold">Select Your Plan</h2>
                  <p className="text-zinc-400">Choose the amount of Flash USDT you want to generate.</p>
                </div>
                <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
                  {PRICING_PLANS.map((plan, i) => (
                    <div 
                      key={i} 
                      className="relative p-6 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between hover:scale-105 transition-all cursor-pointer group"
                      onClick={() => handlePlanSelect(plan)}
                    >
                      {i === 2 && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</div>}
                      <div className="space-y-4">
                        <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">{plan.label}</span>
                        <div className="space-y-1">
                          <h3 className="text-3xl font-black">${plan.amount.toLocaleString()}</h3>
                          <p className="text-zinc-500 text-sm">Flash USDT</p>
                        </div>
                        <div className="pt-4 border-t border-zinc-800">
                          <p className="text-zinc-400 text-sm">Fee: <span className="text-white font-bold">${plan.fee}</span></p>
                        </div>
                      </div>
                      <button className="mt-8 w-full py-3 rounded-xl bg-zinc-800 group-hover:bg-emerald-500 group-hover:text-black font-bold transition-colors">
                        Select Plan
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* FAQ Section */}
              <section id="faq" className="max-w-3xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                  <h2 className="text-4xl font-bold">Frequently Asked Questions</h2>
                  <p className="text-zinc-400">Everything you need to know about our service.</p>
                </div>
                <div className="bg-zinc-900/30 rounded-3xl p-8 border border-zinc-800">
                  {FAQS.map((faq, i) => (
                    <FAQItem key={i} q={faq.q} a={faq.a} />
                  ))}
                </div>
              </section>
            </motion.div>
          )}

          {step === 'SELECT_RECEIVE_NETWORK' && (
            <motion.div 
              key="receive-network"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-2xl mx-auto space-y-8"
            >
              <div className="text-center space-y-4 px-4">
                <h2 className="text-3xl font-bold">Where do you want to receive?</h2>
                <p className="text-zinc-400">Select your preferred method to receive the ${selectedPlan?.amount.toLocaleString()} Flash USDT.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-4">
                <button
                  onClick={() => {
                    setReceiveMethod('BINANCE_ID');
                    setReceiveNetwork(null);
                    setStep('INPUT_USER_ADDRESS');
                    window.scrollTo(0, 0);
                  }}
                  className="p-6 rounded-2xl bg-zinc-900 border-2 border-emerald-500/50 hover:border-emerald-500 hover:bg-emerald-500/5 transition-all text-left flex items-center justify-between group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 bg-emerald-500 text-black text-[10px] font-black px-2 py-0.5 rounded-bl-lg uppercase tracking-wider">Fastest</div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs bg-[#F3BA2F]">
                      BIN
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-lg">Binance ID</span>
                      <span className="text-xs text-emerald-500 font-medium">Instant Transfer</span>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-zinc-600 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                </button>
                {NETWORKS.map((network) => (
                  <button
                    key={network.id}
                    onClick={() => {
                      setReceiveMethod('WALLET');
                      handleReceiveNetworkSelect(network);
                    }}
                    className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-emerald-500 hover:bg-emerald-500/5 transition-all text-left flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{ backgroundColor: network.color }}>
                        {network.id.substring(0, 3).toUpperCase()}
                      </div>
                      <span className="font-bold text-lg">{network.name}</span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-zinc-600 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setStep('LANDING')}
                className="w-full py-4 text-zinc-500 hover:text-white transition-colors font-medium"
              >
                Go Back
              </button>
            </motion.div>
          )}

          {step === 'INPUT_USER_ADDRESS' && (
            <motion.div 
              key="input-address"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-xl mx-auto space-y-8 py-12 px-4"
            >
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                  {receiveMethod === 'BINANCE_ID' ? <Zap className="w-8 h-8 text-emerald-500" /> : <Wallet className="w-8 h-8 text-emerald-500" />}
                </div>
                <h2 className="text-3xl font-bold">{receiveMethod === 'BINANCE_ID' ? 'Enter Binance ID' : 'Enter Wallet Address'}</h2>
                <p className="text-zinc-400">Provide your details to receive the <span className="text-white font-bold">${selectedPlan?.amount.toLocaleString()}</span> Flash USDT.</p>
              </div>
              
              <form onSubmit={handleUserAddressSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                    {receiveMethod === 'WALLET' ? `${receiveNetwork?.name} Address` : 'Your Binance ID'}
                  </label>
                  <input 
                    type="text"
                    required
                    value={userWalletAddress}
                    onChange={(e) => setUserWalletAddress(e.target.value)}
                    placeholder={receiveMethod === 'WALLET' ? `Paste your ${receiveNetwork?.name} address here...` : 'Enter your 9-digit Binance ID...'}
                    className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all font-mono text-lg"
                  />
                  {receiveMethod === 'BINANCE_ID' && (
                    <p className="text-xs text-zinc-500 italic">Make sure to provide a valid Binance ID for instant internal transfer.</p>
                  )}
                </div>
                <button 
                  type="submit"
                  disabled={userWalletAddress.trim().length < (receiveMethod === 'WALLET' ? 10 : 8)}
                  className="w-full py-5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800 disabled:text-zinc-500 text-black font-black text-lg rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  Continue to Payment <ArrowRight className="w-5 h-5" />
                </button>
              </form>

              <button 
                onClick={() => setStep('SELECT_RECEIVE_NETWORK')}
                className="w-full py-4 text-zinc-500 hover:text-white transition-colors font-medium"
              >
                Go Back
              </button>
            </motion.div>
          )}

          {step === 'SELECT_PAYMENT_METHOD' && (
            <motion.div 
              key="payment-method"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="max-w-2xl mx-auto space-y-12 py-12"
            >
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                  <Zap className="w-10 h-10 text-emerald-500" />
                </div>
                <h2 className="text-4xl font-black">ONE STEP AWAY NOW!</h2>
                <p className="text-zinc-400 text-lg">
                  You are about to receive <span className="text-white font-bold">${selectedPlan?.amount.toLocaleString()}</span> on <span className="text-white font-bold">{receiveMethod === 'WALLET' ? receiveNetwork?.name : 'Binance ID'}</span>.
                  Please select a method to pay the <span className="text-emerald-500 font-bold">${selectedPlan?.fee}</span> service fee.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => handlePaymentNetworkSelect(BINANCE_PAY_ID)}
                  className="p-6 rounded-2xl bg-zinc-900 border-2 border-emerald-500/50 hover:border-emerald-500 hover:bg-emerald-500/5 transition-all text-left flex items-center gap-4 group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 bg-emerald-500 text-black text-[10px] font-black px-2 py-0.5 rounded-bl-lg uppercase tracking-wider">Fastest</div>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs bg-[#F3BA2F]">
                    BIN
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-lg">Binance ID</span>
                    <span className="text-xs text-emerald-500 font-medium">Instant Internal Transfer</span>
                  </div>
                </button>
                {NETWORKS.map((network) => (
                  <button
                    key={network.id}
                    onClick={() => handlePaymentNetworkSelect(network)}
                    className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-emerald-500 hover:bg-emerald-500/5 transition-all text-left flex items-center gap-4 group"
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{ backgroundColor: network.color }}>
                      {network.id.substring(0, 3).toUpperCase()}
                    </div>
                    <span className="font-bold text-lg">{network.name}</span>
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setStep('INPUT_USER_ADDRESS')}
                className="w-full py-4 text-zinc-500 hover:text-white transition-colors font-medium"
              >
                Go Back
              </button>
            </motion.div>
          )}

          {step === 'PAYMENT_PAGE' && (
            <motion.div 
              key="payment-page"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto space-y-8"
            >
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
                <div className="bg-emerald-500 p-6 flex items-center justify-between text-black">
                  <div className="flex items-center gap-3">
                    <Clock className="w-6 h-6 animate-pulse" />
                    <span className="font-bold text-xl">Payment Session Active</span>
                  </div>
                  <span className="font-mono text-2xl font-black">{formatTime(timeLeft)}</span>
                </div>
                
                <div className="p-8 space-y-8">
                  <div className="flex flex-col gap-8 items-start">
                    <div className="space-y-6 w-full">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Amount to Pay</label>
                          <div className="text-4xl font-black text-white">${selectedPlan?.fee} <span className="text-lg text-zinc-500 font-normal">USDT</span></div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Payment Method</label>
                          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 font-bold flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full" style={{ backgroundColor: paymentNetwork?.color }} />
                            {paymentNetwork?.name}
                          </div>
                        </div>
                      </div>

                      {paymentNetwork?.id === 'binance_id' ? (
                        <div className="space-y-4">
                          <div className="p-6 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/30 space-y-4">
                            <div className="flex items-center gap-2 text-emerald-500 font-black text-sm uppercase tracking-widest">
                              <Zap className="w-4 h-4 fill-current" /> Instant Binance Pay
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase">Binance ID</label>
                                <div className="flex items-center justify-between bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                                  <span className="font-mono text-lg font-bold text-white">{paymentNetwork.address}</span>
                                  <button 
                                    onClick={() => {
                                      navigator.clipboard.writeText(paymentNetwork.address);
                                      alert('ID Copied!');
                                    }}
                                    className="p-2 bg-emerald-500 text-black rounded-lg hover:scale-105 transition-all"
                                  >
                                    Copy
                                  </button>
                                </div>
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase">Account Name</label>
                                <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 font-bold text-white">
                                  {(paymentNetwork as any).name_label}
                                </div>
                              </div>
                            </div>
                          </div>
                          <p className="text-xs text-zinc-500 italic text-center">Open Binance App &gt; Pay &gt; Send &gt; Enter ID</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Official Payment Address</label>
                          <div className="p-6 rounded-2xl bg-zinc-950 border-2 border-emerald-500/30 break-all font-mono text-lg relative group">
                            <p className="pr-12 text-emerald-400">{paymentNetwork?.address}</p>
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(paymentNetwork?.address || '');
                                alert('Address copied!');
                              }}
                              className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-emerald-500 text-black rounded-xl hover:scale-105 transition-all shadow-lg shadow-emerald-500/20"
                            >
                              Copy
                            </button>
                          </div>
                          <p className="text-xs text-zinc-500 italic">Send exactly ${selectedPlan?.fee} USDT to the address above.</p>
                        </div>
                      )}

                      <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700 space-y-2">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Receiving Details</label>
                        <div className="flex justify-between text-sm">
                          <span className="text-zinc-500">Amount:</span>
                          <span className="font-bold text-white">${selectedPlan?.amount.toLocaleString()} Flash USDT</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-zinc-500">{receiveMethod === 'WALLET' ? 'Network:' : 'Method:'}</span>
                          <span className="font-bold text-white">{receiveMethod === 'WALLET' ? receiveNetwork?.name : 'Binance Pay (ID)'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-zinc-500">{receiveMethod === 'WALLET' ? 'Your Address:' : 'Your Binance ID:'}</span>
                          <span className="font-mono text-zinc-300 truncate ml-4 max-w-[200px]">{userWalletAddress}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-zinc-800 space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold">Upload Payment Proof</h3>
                      <p className="text-zinc-400 text-sm">Please upload a screenshot of your successful transaction.</p>
                    </div>

                    <div className="relative">
                      <input 
                        type="file" 
                        id="proof-upload" 
                        className="hidden" 
                        onChange={handleProofUpload}
                        accept="image/*"
                      />
                      <label 
                        htmlFor="proof-upload"
                        className={`w-full h-48 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer gap-4 ${proof ? 'border-emerald-500 bg-emerald-500/5' : 'border-zinc-800 hover:border-zinc-700 bg-zinc-950'}`}
                      >
                        {proof ? (
                          <>
                            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                            <div className="text-center">
                              <p className="font-bold text-emerald-500">{proof.name}</p>
                              <p className="text-zinc-500 text-xs">Click to change file</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <Upload className="w-12 h-12 text-zinc-600" />
                            <div className="text-center">
                              <p className="font-bold">Click to upload screenshot</p>
                              <p className="text-zinc-500 text-xs">PNG, JPG or JPEG (Max 5MB)</p>
                            </div>
                          </>
                        )}
                      </label>
                    </div>

                    <button 
                      disabled={!proof || isSubmitting}
                      onClick={handleSubmit}
                      className={`w-full py-5 rounded-2xl font-black text-xl transition-all flex items-center justify-center gap-3 ${!proof || isSubmitting ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-lg shadow-emerald-500/20'}`}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-6 h-6 border-4 border-black/30 border-t-black rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Submit Payment Proof
                          <ArrowRight className="w-6 h-6" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>Do not close this page until the payment is submitted. Your session will expire in {formatTime(timeLeft)}.</p>
              </div>
            </motion.div>
          )}

          {step === 'SUCCESS' && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto text-center space-y-8 py-24"
            >
              <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/40">
                <CheckCircle2 className="w-14 h-14 text-black" />
              </div>
              <div className="space-y-4">
                <h2 className="text-5xl font-black uppercase tracking-tighter">CONFIRMED! BOOM BAM!</h2>
                <p className="text-zinc-400 text-xl leading-relaxed">
                  Your request has been successfully submitted. Our automated system is now processing your <span className="text-white font-bold">${selectedPlan?.amount.toLocaleString()} Flash USDT</span>.
                </p>
              </div>
              <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4 text-left">
                <div className="flex items-center gap-3 text-emerald-500 font-bold">
                  <Shield className="w-5 h-5" />
                  Status: Processing
                </div>
                <p className="text-zinc-400">
                  Your request is being completed. The Flash USDT will proceed to your wallet address after confirming on the blockchain. This usually takes 5-15 minutes.
                </p>
                <div className="pt-4 border-t border-zinc-800 flex justify-between text-sm">
                  <span className="text-zinc-500">Transaction ID:</span>
                  <span className="font-mono text-zinc-300">FLS-{Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
                </div>
              </div>
              <button 
                onClick={() => {
                  setStep('LANDING');
                  setProof(null);
                  setSelectedPlan(null);
                }}
                className="text-emerald-500 font-bold hover:underline"
              >
                Return to Home
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-12 px-6 mt-24">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-emerald-500 fill-current" />
            <span className="text-lg font-bold tracking-tighter">FLASH<span className="text-emerald-500">USDT</span></span>
          </div>
          <p className="text-zinc-500 text-sm">© 2026 Flash USDT Official. All rights reserved.</p>
          <div className="flex gap-6">
            <Shield className="w-5 h-5 text-zinc-700" />
            <Lock className="w-5 h-5 text-zinc-700" />
            <Globe className="w-5 h-5 text-zinc-700" />
          </div>
        </div>
      </footer>
    </div>
  );
}
