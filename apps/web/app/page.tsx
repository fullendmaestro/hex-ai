"use client";

import React from "react";
import { Button } from "@hex-ai/ui/components/button";
import {
  ArrowRight,
  Brain,
  HexagonIcon,
  Lightbulb,
  Rocket,
  Search,
  Sparkles,
  TrendingUp,
  Wallet,
  Zap,
  Lock,
} from "lucide-react";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { Card, CardContent } from "@hex-ai/ui/components/card";
import Link from "next/link";

export default function HexAILanding() {
  const { openConnectModal } = useConnectModal();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0E27] to-[#1a1f3a]">
      {/* Header */}
      <header className="border-b border-cyan-500/20 bg-[#0A0E27]/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 4L8 10L20 16L32 10L20 4Z"
                  fill="#22D3EE"
                  fillOpacity="0.9"
                />
                <path d="M8 24L20 30L32 24V16L20 22L8 16V24Z" fill="#3B82F6" />
                <path
                  d="M20 16L14 19V25L20 28L26 25V19L20 16Z"
                  fill="#60A5FA"
                  fillOpacity="0.6"
                />
              </svg>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Hex AI
              </h1>
            </div>
            <Link href="/home">
              <Button
                // onClick={openConnectModal}
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:shadow-lg hover:shadow-cyan-500/50"
              >
                <Wallet className="w-4 h-4 mr-2" />
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-full flex items-center justify-center shadow-2xl shadow-cyan-500/50">
              <Brain className="w-12 h-12 text-white" />
            </div>
          </div>

          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            AI-Powered Wallet Intelligence
          </h1>

          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Unlock deep insights from on-chain data. Hex AI analyzes your
            wallet's trading patterns, staking opportunities, and yield
            optimization strategies to maximize your crypto returns.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/home">
              <Button
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-purple-500"
              >
                <Zap className="w-5 h-5 mr-2" />
                Start Analysis
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-cyan-500 text-cyan-400"
            >
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features - 3 Cards */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-white">
            Intelligent On-Chain Analysis
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Leverage AI to understand your wallet's performance and discover
            untapped opportunities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Trading Analysis */}
          <Card className="bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/20 hover:-translate-y-2">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">
                Trading Insights
              </h3>
              <p className="text-gray-400 leading-relaxed">
                AI-powered analysis of your trading patterns, win rates, and
                profit/loss trends to optimize your strategy.
              </p>
            </CardContent>
          </Card>

          {/* Card 2: Staking Analysis */}
          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 hover:-translate-y-2">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center mx-auto mb-6">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">
                Staking Intelligence
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Discover optimal staking opportunities with real-time APY
                tracking and risk assessment across protocols.
              </p>
            </CardContent>
          </Card>

          {/* Card 3: Yield Optimization */}
          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20 hover:border-green-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/20 hover:-translate-y-2">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-cyan-500 flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">
                Yield Optimization
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Maximize returns with AI-recommended yield farming strategies
                and automated portfolio rebalancing.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works - 4 Steps */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-white">
            How Hex AI Works
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Get started in minutes with our simple 4-step process
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              step: "1",
              title: "Connect Wallet",
              description:
                "Securely connect your Web3 wallet to access on-chain data",
              icon: Wallet,
            },
            {
              step: "2",
              title: "AI Scans Data",
              description:
                "Our AI analyzes your transaction history and holdings",
              icon: Search,
            },
            {
              step: "3",
              title: "Get Insights",
              description: "Receive personalized recommendations and analytics",
              icon: Lightbulb,
            },
            {
              step: "4",
              title: "Optimize Returns",
              description: "Execute strategies to maximize your crypto gains",
              icon: Rocket,
            },
          ].map((item, index) => (
            <Card
              key={index}
              className="bg-[#1a1f3a]/50 border-cyan-500/10 relative overflow-hidden"
            >
              <CardContent className="p-6 text-center">
                <div className="text-8xl font-bold text-cyan-500/5 absolute -top-3 right-4 z-0">
                  {item.step}
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center mx-auto mb-4 relative z-10">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-3 text-white relative z-10">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed relative z-10">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-gradient-to-r from-cyan-600 to-purple-600 border-0 overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('/defi-adoption.jpg')] opacity-20"></div>
          <CardContent className="p-12 text-center relative z-10">
            <Brain className="w-16 h-16 mx-auto mb-6 text-white" />
            <h2 className="text-4xl font-bold mb-4 text-white">
              Ready to Unlock Your Wallet's Potential?
            </h2>
            <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
              Join thousands of users leveraging AI to make smarter crypto
              decisions
            </p>
            <Button
              size="lg"
              className="bg-white text-purple-600 hover:bg-gray-100"
            >
              <Wallet className="w-5 h-5 mr-2" />
              Connect & Analyze Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
