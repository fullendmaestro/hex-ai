"use client";

import React from "react";
import { Button } from "@hex-ai/ui/components/button";
import {
  ArrowRight,
  Brain,
  Shield,
  Activity,
  Network,
  TrendingUp,
  Zap,
  Lock,
  BarChart3,
  CheckCircle2,
  Sparkles,
  MessageSquare,
} from "lucide-react";
import { Card, CardContent } from "@hex-ai/ui/components/card";
import { Badge } from "@hex-ai/ui/components/badge";
import Link from "next/link";

export default function HexAILanding() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-chart-2 rounded-lg opacity-90" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary-foreground" />
                </div>
              </div>
              <span className="text-xl font-semibold tracking-tight">
                Hex AI
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/home">
                <Button size="sm" className="font-medium">
                  Launch App
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-8">
            <div className="inline-flex">
              <Badge
                variant="secondary"
                className="px-4 py-1.5 text-sm font-medium"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                Multi-Agent Intelligence Platform
              </Badge>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              Navigate the <span className="text-primary">Staking Economy</span>
              <br />
              with AI-Powered Intelligence
            </h1>

            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Hex AI simplifies pooled security protocols through autonomous
              agents that continuously monitor AVSs, operators, and
              validators—delivering real-time insights for confident staking
              decisions.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/home">
                <Button size="lg" className="font-semibold px-8">
                  <Zap className="mr-2 h-5 w-5" />
                  Get Started
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="font-semibold px-8"
              >
                View Documentation
              </Button>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
              <div>
                <div className="text-3xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Monitoring
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">5</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Risk Factors
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">∞</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Insights
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold tracking-tight">
              Multi-Agent Architecture
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Parallel AI agents working simultaneously to deliver comprehensive
              analysis of the EigenLayer ecosystem
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* AVS Intelligence */}
            <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Network className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    AVS Intelligence
                  </h3>
                  <p className="text-muted-foreground">
                    Deep analysis of Actively Validated Services through web
                    research, social sentiment tracking, and comprehensive risk
                    evaluation.
                  </p>
                </div>
                <ul className="space-y-2 pt-2">
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Real-time web monitoring</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Community sentiment analysis</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>DeFi metrics integration</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Operator Monitoring */}
            <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-chart-2/10 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-chart-2" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Operator Monitoring
                  </h3>
                  <p className="text-muted-foreground">
                    Continuous tracking of operators and validators with
                    performance metrics, reliability scoring, and infrastructure
                    health checks.
                  </p>
                </div>
                <ul className="space-y-2 pt-2">
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-chart-2 mt-0.5 flex-shrink-0" />
                    <span>Performance tracking</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-chart-2 mt-0.5 flex-shrink-0" />
                    <span>Reliability scoring</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-chart-2 mt-0.5 flex-shrink-0" />
                    <span>Infrastructure monitoring</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Risk Intelligence */}
            <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-chart-1/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-chart-1" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Risk Intelligence
                  </h3>
                  <p className="text-muted-foreground">
                    Multi-dimensional risk assessment with weighted scoring
                    across technical, economic, operational, market, and
                    systemic factors.
                  </p>
                </div>
                <ul className="space-y-2 pt-2">
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-chart-1 mt-0.5 flex-shrink-0" />
                    <span>5-category analysis</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-chart-1 mt-0.5 flex-shrink-0" />
                    <span>Weighted scoring system</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-chart-1 mt-0.5 flex-shrink-0" />
                    <span>Actionable recommendations</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold tracking-tight">
              How Hex AI Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From connection to insight—our streamlined workflow delivers
              intelligence when you need it
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Connect Wallet",
                description:
                  "Securely connect your wallet and select which AVSs, operators, or validators to monitor.",
                icon: Lock,
              },
              {
                step: "02",
                title: "Parallel Analysis",
                description:
                  "Multiple AI agents simultaneously analyze web data, social signals, and risk factors.",
                icon: Brain,
              },
              {
                step: "03",
                title: "Chat Assistant",
                description:
                  "Interact with our AI chat assistant to get instant insights and deep-dive analysis.",
                icon: MessageSquare,
              },
              {
                step: "04",
                title: "Make Decisions",
                description:
                  "Execute informed staking strategies backed by comprehensive, real-time intelligence.",
                icon: TrendingUp,
              },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-start space-y-4">
                  <div className="flex items-center gap-4 w-full">
                    <div className="text-5xl font-bold text-muted/20">
                      {item.step}
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
                {index < 3 && (
                  <div className="hidden lg:block absolute top-8 -right-3 w-6 h-0.5 bg-border" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Highlights */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge variant="secondary" className="px-3 py-1">
                <BarChart3 className="w-3.5 h-3.5 mr-1.5" />
                Advanced Analytics
              </Badge>
              <h2 className="text-4xl font-bold tracking-tight">
                Comprehensive Risk Assessment
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our multi-factor risk model evaluates protocols across five
                critical dimensions, providing weighted scores that help you
                understand the complete risk profile.
              </p>
              <ul className="space-y-3">
                {[
                  { label: "Technical Risk", weight: "30%" },
                  { label: "Economic Risk", weight: "25%" },
                  { label: "Operational Risk", weight: "20%" },
                  { label: "Market Risk", weight: "15%" },
                  { label: "Systemic Risk", weight: "10%" },
                ].map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-card border"
                  >
                    <span className="font-medium">{item.label}</span>
                    <Badge variant="outline">{item.weight}</Badge>
                  </li>
                ))}
              </ul>
            </div>
            <Card className="border-2">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b">
                    <span className="text-sm font-medium text-muted-foreground">
                      Overall Risk Score
                    </span>
                    <Badge className="bg-chart-1 text-chart-1-foreground">
                      Low Risk
                    </Badge>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-chart-1 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">
                          Strong Technical Foundation
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Audited smart contracts, active development
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-chart-1 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">
                          Healthy Economic Model
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Sustainable tokenomics, strong TVL
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-chart-1 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">
                          Positive Community Sentiment
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Active community, transparent communication
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-chart-2/5">
            <CardContent className="p-12 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Brain className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-4xl font-bold tracking-tight">
                Ready to Navigate the Staking Economy?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join users making confident staking decisions with AI-powered
                intelligence in the EigenLayer ecosystem.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link href="/home">
                  <Button size="lg" className="font-semibold px-8">
                    Launch Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-chart-2 rounded-lg opacity-90" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-primary-foreground" />
                </div>
              </div>
              <span className="text-sm text-muted-foreground">
                © 2025 Hex AI. Simplifying the staking economy.
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">
                Documentation
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                GitHub
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
