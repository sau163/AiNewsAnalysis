
import { useState, useEffect } from 'react';
import { useNhostClient, useUserId, useSignOut } from '@nhost/react';
import { useNavigate, Link } from 'react-router-dom';
import { NewsCard } from '../components/NewsCard';
import { PreferencesModal } from '../components/PreferencesModal';
import { UserPreferences, NewsArticle } from '../types';
import { Settings, BookmarkIcon } from 'lucide-react';
import toast from 'react-hot-toast';

export const Home = () => {
  const nhost = useNhostClient();
  const userId = useUserId();
  const { signOut } = useSignOut();
  const navigate = useNavigate();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences>({
    topics:'',
    sources: '',
    language: 'en'
  });
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (userId) {
      //fetchArticles();
      fetchInitialArticles()
    }
  }, [userId]);
  const fetchInitialArticles = async () => {
    try {
      const accessToken = nhost.auth.getAccessToken();
      const { data, error } = await nhost.graphql.request(
        `query GetInitialArticles($userId: uuid!) {
          processed_articles(
            where: { user_id: { _eq: $userId } },
            order_by: { created_at: desc },
            limit: 10
          ) {
            id
            title
            summary
            sentiment_label
            sentiment_explanation
            url
          }
        }`,
        { userId },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      
      if (error) throw error;
      setArticles(data.processed_articles);
    } catch (error) {
      toast.error('Failed to fetch initial articles');
    }
  };
  const fetchArticles = async () => {
    try {
      const accessToken = nhost.auth.getAccessToken();
      const { data, error } = await nhost.graphql.request(
        `query FetchArticles($userId: uuid!) {
          fetchProcessedArticles(userId: $userId) {
            title
            summary
            sentiment_label
            sentiment_explanation
            url
            content
            user_id
          }
        }`,
        { userId },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
  
      if (error) throw error;
      setArticles(data.fetchProcessedArticles);
    } catch (error) {
      toast.error('Failed to fetch articles');
    }
  };

  const handleSaveArticle = async (article: NewsArticle) => {
    try {
      const accessToken = nhost.auth.getAccessToken();
      const { error } = await nhost.graphql.request(
        `mutation SaveArticle(
          $userId: uuid!,
          $title: String!,
          $summary: String!,
          $sentiment_label: String!,
          $sentiment_explanation: String!,
          $url: String!
        ) {
          insert_saved_articles_one(object: {
            user_id: $userId,
            title: $title,
            summary: $summary,
            sentiment_label: $sentiment_label,
            sentiment_explanation: $sentiment_explanation,
            url: $url
          }) {
            id
          }
        }`,
        {
          userId,
          title: article.title,
          summary: article.summary,
          sentiment_label: article.sentiment_label,
          sentiment_explanation: article.sentiment_explanation,
          url: article.url,
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
  
      if (error) throw error;
      toast.success('Article saved successfully');
    } catch (error) {
      toast.error('Failed to save article');
    }
  };
  
  const handleUpdatePreferences = async (newPreferences: UserPreferences) => {
    try {
      setIsUpdating(true);
      const accessToken = nhost.auth.getAccessToken();
      
      const { error } = await nhost.graphql.request(
        `mutation UpdatePreferences(
          $userId: uuid!,
          $topics: String!,
          $sources: String!,
          $language: String!
        ) {
          insert_user_preferences_one(
            object: {
              user_id: $userId,
              topics: $topics,
              sources: $sources,
              language: $language
            }
            on_conflict: {
              constraint: user_preferences_user_id_key
              update_columns: [topics, sources, language]
            }
          ) {
            id
          }
        }`,
        {
          userId,
          topics: newPreferences.topics, 
          sources: newPreferences.sources,
          language: newPreferences.language
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
  
      if (error) throw error;
      setPreferences(newPreferences);
      await fetchArticles();
      toast.success('Preferences updated successfully');
    } catch (error) {
      toast.error('Failed to update preferences');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Loading overlay */}
      {isUpdating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      )}

      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold">AI News Digest</h1>
            <div className="flex items-center space-x-4">
              <Link to="/saved" className="text-gray-600 hover:text-gray-900">
                <BookmarkIcon size={24} />
              </Link>
              <button
                onClick={() => setIsPreferencesOpen(true)}
                className="text-gray-600 hover:text-gray-900"
                disabled={isUpdating}
              >
                <Settings size={24} />
              </button>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-red-600"
                disabled={isUpdating}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6">
          {articles.map((article) => (
            <NewsCard
  key={article.id}
  article={article}
  onSave={() => handleSaveArticle(article)} // Pass the whole article
/>

          ))}
        </div>
      </main>

      {/* Preferences Modal */}
      <PreferencesModal
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
        preferences={preferences}
        onSave={handleUpdatePreferences}
        isUpdating={isUpdating}
      />
    </div>
  );
};