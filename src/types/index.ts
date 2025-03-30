export type UserPreferences = {
  topics: string;
  sources: string;
  language: string;
};

export type NewsArticle = {
  id: string;
  title: string;
  summary: string;
  sentiment_label: 'VERY_POSITIVE' | 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' | 'VERY_NEGATIVE';
  sentiment_explanation: string;
  url: string;
};

export type SavedArticle = {
  id: string;
  processed_articles: NewsArticle;
};