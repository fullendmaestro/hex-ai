// Returns a mocked reports (with positive sentiment, negative sentiments and empty reports) randomly
export const getMockAuditReport = (projectName: string) => {
  const random = Math.random();

  // 40% chance of no audits found
  if (random < 0.4) {
    return {
      project: projectName,
      audits: [],
      message: "No public audit reports found",
    };
  }

  // 30% chance of positive audit
  if (random < 0.7) {
    return {
      project: projectName,
      audits: [
        {
          auditor: [
            "Trail of Bits",
            "OpenZeppelin",
            "Consensys Diligence",
            "Quantstamp",
          ][Math.floor(Math.random() * 4)],
          date: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          severity: "Low",
          findings: Math.floor(Math.random() * 5),
          critical: 0,
          high: 0,
          medium: Math.floor(Math.random() * 3),
          low: Math.floor(Math.random() * 5),
          status: "All issues resolved",
          url: `https://example.com/audits/${projectName.toLowerCase().replace(/\s/g, "-")}`,
        },
      ],
      overall_assessment: "positive",
    };
  }

  // 30% chance of audit with some concerns
  return {
    project: projectName,
    audits: [
      {
        auditor: ["CertiK", "Hacken", "PeckShield", "SlowMist"][
          Math.floor(Math.random() * 4)
        ],
        date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        severity: "Medium",
        findings: Math.floor(Math.random() * 15) + 5,
        critical: Math.floor(Math.random() * 2),
        high: Math.floor(Math.random() * 3),
        medium: Math.floor(Math.random() * 5) + 2,
        low: Math.floor(Math.random() * 8),
        status: Math.random() > 0.5 ? "Partially resolved" : "Under review",
        url: `https://example.com/audits/${projectName.toLowerCase().replace(/\s/g, "-")}`,
      },
    ],
    overall_assessment: "concerns",
  };
};

export const getMockGitHubActivity = (repo: string) => {
  const random = Math.random();

  // 30% chance of no activity/not found
  if (random < 0.3) {
    return {
      repo,
      found: false,
      commits_30d: 0,
      stars: 0,
      forks: 0,
      last_commit: null,
    };
  }

  // 40% chance of moderate activity
  if (random < 0.7) {
    return {
      repo,
      found: true,
      commits_30d: Math.floor(Math.random() * 50) + 10,
      stars: Math.floor(Math.random() * 500) + 50,
      forks: Math.floor(Math.random() * 100) + 10,
      last_commit: new Date(
        Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
      ).toISOString(),
    };
  }

  // 30% chance of high activity
  return {
    repo,
    found: true,
    commits_30d: Math.floor(Math.random() * 200) + 100,
    stars: Math.floor(Math.random() * 5000) + 1000,
    forks: Math.floor(Math.random() * 500) + 100,
    last_commit: new Date(
      Date.now() - Math.random() * 24 * 60 * 60 * 1000
    ).toISOString(),
  };
};

export const getMockSocialSentiment = (query: string) => {
  const random = Math.random();
  const sentiments = ["positive", "neutral", "negative"];
  const trustLevels = ["high", "medium", "low"];

  // 20% chance of no mentions
  if (random < 0.2) {
    return {
      query,
      sentiment: "neutral",
      sentiment_score: 50,
      trust_level: "low",
      mentions: 0,
      positive_mentions: 0,
      negative_mentions: 0,
      influencer_mentions: 0,
      message: "No social media mentions found",
    };
  }

  // 50% chance of neutral/moderate sentiment
  if (random < 0.7) {
    const mentions = Math.floor(Math.random() * 100) + 10;
    return {
      query,
      sentiment: "neutral",
      sentiment_score: Math.floor(Math.random() * 20) + 40, // 40-60
      trust_level: "medium",
      mentions,
      positive_mentions: Math.floor(mentions * 0.4),
      negative_mentions: Math.floor(mentions * 0.3),
      influencer_mentions: Math.floor(Math.random() * 5),
      trending: false,
    };
  }

  // 30% chance split between positive and negative
  const isPositive = random < 0.85;
  const mentions = Math.floor(Math.random() * 500) + 50;

  return {
    query,
    sentiment: isPositive ? "positive" : "negative",
    sentiment_score: isPositive
      ? Math.floor(Math.random() * 30) + 65 // 65-95
      : Math.floor(Math.random() * 30) + 10, // 10-40
    trust_level: isPositive ? "high" : "low",
    mentions,
    positive_mentions: isPositive
      ? Math.floor(mentions * 0.7)
      : Math.floor(mentions * 0.2),
    negative_mentions: isPositive
      ? Math.floor(mentions * 0.1)
      : Math.floor(mentions * 0.6),
    influencer_mentions: Math.floor(Math.random() * 15),
    trending: Math.random() > 0.7,
  };
};
