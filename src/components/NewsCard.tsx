
// import { Share2, Bookmark, ExternalLink } from 'lucide-react';
// import { NewsArticle } from '../types';
// import toast from 'react-hot-toast';

// type NewsCardProps = {
//   article: NewsArticle;
//   onSave: (articleId: string) => void;
// };

// export const NewsCard = ({ article, onSave }: NewsCardProps) => {
//   const getSentimentColor = (sentiment: string) => {
//     switch (sentiment) {
//       case 'VERY_POSITIVE': return 'bg-green-500';
//       case 'POSITIVE': return 'bg-green-300';
//       case 'NEUTRAL': return 'bg-gray-300';
//       case 'NEGATIVE': return 'bg-red-300';
//       case 'VERY_NEGATIVE': return 'bg-red-500';
//       default: return 'bg-gray-300';
//     }
//   };

//   const handleShare = async () => {
//     try {
//       await navigator.share({
//         title: article.title,
//         text: article.summary,
//         url: article.url
//       });
//     } catch (error) {
//       toast.error('Failed to share article');
//     }
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-md p-6 mb-4">
//       <div className="flex justify-between items-start mb-4">
//         <h3 className="text-xl font-semibold">{article.title}</h3>
//         <div className={`${getSentimentColor(article.sentiment_label)} px-3 py-1 rounded-full text-white text-sm`}>
//           {article.sentiment_label.replace('_', ' ')}
//         </div>
//       </div>
      
//       <p className="text-gray-600 mb-4">{article.summary}</p>
      
//       <div className="flex justify-end gap-4">
//         <a
//           href={article.url}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="text-gray-600 hover:text-gray-900"
//         >
//           <ExternalLink size={20} />
//         </a>
        
//         <button
//           onClick={() => onSave(article.id)}
//           className="text-gray-600 hover:text-gray-900"
//           aria-label="Save article"
//         >
//           <Bookmark size={20} />
//         </button>
        
//         <button
//           onClick={handleShare}
//           className="text-gray-600 hover:text-gray-900"
//           aria-label="Share article"
//         >
//           <Share2 size={20} />
//         </button>
//       </div>
//     </div>
//   );
// };

import { Share2, Bookmark, ExternalLink } from 'lucide-react';
import { NewsArticle } from '../types';
import toast from 'react-hot-toast';

type NewsCardProps = {
  article: NewsArticle;
  onSave: (articleId: string) => void;
};

export const NewsCard = ({ article, onSave }: NewsCardProps) => {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'VERY_POSITIVE': return 'bg-green-500';
      case 'POSITIVE': return 'bg-green-300';
      case 'NEUTRAL': return 'bg-gray-300';
      case 'NEGATIVE': return 'bg-red-300';
      case 'VERY_NEGATIVE': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: article.title,
          text: article.summary,
          url: article.url
        });
      } else {
        // Fallback for desktop browsers
        await navigator.clipboard.writeText(article.url);
        toast.success('Link copied to clipboard!');
      }
    } catch (error) {
      if (!(error instanceof DOMException)) { // Ignore user cancellation
        toast.error('Failed to share article');
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold">{article.title}</h3>
        <div className={`${getSentimentColor(article.sentiment_label)} px-3 py-1 rounded-full text-white text-sm`}>
          {article.sentiment_label.replace('_', ' ')}
        </div>
      </div>
      
      <p className="text-gray-600 mb-4">{article.summary}</p>
      
      <div className="flex justify-end gap-4">
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-gray-900"
        >
          <ExternalLink size={20} />
        </a>
        
        <button
          onClick={() => onSave(article.id)}
          className="text-gray-600 hover:text-gray-900"
          aria-label="Save article"
        >
          <Bookmark size={20} />
        </button>
        
        <button
          onClick={handleShare}
          className="text-gray-600 hover:text-gray-900"
          aria-label="Share article"
        >
          <Share2 size={20} />
        </button>
      </div>
    </div>
  );
};