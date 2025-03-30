
import { useState, useEffect } from "react";
import { useNhostClient, useUserId } from "@nhost/react";
import { NewsCard } from "../components/NewsCard";
import { NewsArticle } from "../types";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export const SavedArticles = () => {
  const nhost = useNhostClient();
  const userId = useUserId();
  const [savedArticles, setSavedArticles] = useState<NewsArticle[]>([]);

  useEffect(() => {
    if (userId) {
      fetchSavedArticles();
    }
  }, [userId]);

  const fetchSavedArticles = async () => {
    try {
      const accessToken = nhost.auth.getAccessToken();
      const { data, error } = await nhost.graphql.request(
        `
        query GetSavedArticles($userId: uuid!) {
          saved_articles(where: { user_id: { _eq: $userId } }) {
            id
            title
            summary
            sentiment_label
            sentiment_explanation
            url
          }
        }
        `,
        { userId },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
       //console.log(data);
      if (error) throw error;

      setSavedArticles(data.saved_articles);
    } catch (error) {
      toast.error("Failed to fetch saved articles");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <Link to="/" className="text-gray-600 hover:text-gray-900 mr-4">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-xl font-semibold">Saved Articles</h1>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6">
          {savedArticles.map((article) => (
            <NewsCard key={article.id} article={article} onSave={() => {}} />
          ))}
        </div>
      </main>
    </div>
  );
};
