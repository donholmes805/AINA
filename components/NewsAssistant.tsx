import React, { useState, useCallback, useEffect, useRef } from 'react';
import type { Article, User } from '../types';
import { generateNewsArticle, getSavedArticles, saveArticle, deleteArticle as apiDeleteArticle } from '../services/articleService';
import SavedArticleList from './SavedArticleList';
import { Spinner } from './common/Spinner';
import { Icon } from './common/Icon';
import ArticleSkeleton from './ArticleSkeleton';
import GeneratedArticle from './GeneratedArticle';
import ChangePasswordModal from './ChangePasswordModal';

interface NewsAssistantProps {
  user: User;
  onLogout: () => void;
}

const NewsAssistant: React.FC<NewsAssistantProps> = ({ user, onLogout }) => {
  const [topic, setTopic] = useState<string>('');
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [savedArticles, setSavedArticles] = useState<Article[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isLoadingSaved, setIsLoadingSaved] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ message: string; icon: string } | null>(null);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const articleContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        setIsLoadingSaved(true);
        const articles = await getSavedArticles();
        setSavedArticles(articles);
      } catch (e) {
        console.error("Failed to load saved articles from API", e);
        setError("Could not load your saved articles. Please try again later.");
      } finally {
        setIsLoadingSaved(false);
      }
    };
    loadArticles();
  }, []);

  useEffect(() => {
    if ((isGenerating || activeArticle) && articleContainerRef.current) {
      setTimeout(() => {
        articleContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [isGenerating, activeArticle]);

  const showFeedback = (message: string, icon: string) => {
    setFeedback({ message, icon });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleGenerate = useCallback(async () => {
    if (!topic.trim() || isGenerating) return;

    setIsGenerating(true);
    setError(null);
    setActiveArticle(null);

    try {
      const article = await generateNewsArticle(topic);
      setActiveArticle(article);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsGenerating(false);
    }
  }, [topic, isGenerating]);

  const handleSaveArticle = useCallback(async (article: Article) => {
    if (savedArticles.some(a => a.id === article.id)) return;
    try {
      await saveArticle(article);
      setSavedArticles(prev => [...prev, article]);
      showFeedback('Article saved!', 'save');
    } catch (err) {
      setError("Failed to save article. Please try again.");
    }
  }, [savedArticles]);

  const handleDeleteArticle = useCallback(async (articleId: string) => {
    try {
        await apiDeleteArticle(articleId);
        setSavedArticles(prev => prev.filter(a => a.id !== articleId));
        if (activeArticle?.id === articleId) {
            setActiveArticle(null);
        }
        showFeedback('Article deleted.', 'delete');
    } catch(err) {
        setError("Failed to delete article. Please try again.");
    }
  }, [activeArticle]);
  
  const handleCopyArticle = useCallback((article: Article) => {
    const textToCopy = `${article.title}\n\n${article.content}`;
    navigator.clipboard.writeText(textToCopy);
    showFeedback('Copied to clipboard!', 'copy');
  }, []);

  const handleShareArticle = useCallback(async (article: Article) => {
    const shareData = {
      title: article.title,
      text: article.content,
    };
    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Share failed:", err)
      }
    } else {
      handleCopyArticle(article);
      showFeedback('Sharing not supported, copied to clipboard instead!', 'copy');
    }
  }, [handleCopyArticle]);

  const isArticleSaved = activeArticle ? savedArticles.some(a => a.id === activeArticle.id) : false;

  return (
    <>
      <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
        {feedback && (
          <div className="fixed top-5 right-5 z-50 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg flex items-center animate-fade-in">
            <Icon name={feedback.icon} className="w-5 h-5 mr-2" />
            <span>{feedback.message}</span>
          </div>
        )}

        <div className="flex justify-end mb-4 gap-2">
           <button
            onClick={() => setShowChangePasswordModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            <Icon name="key" className="w-4 h-4" />
            <span>Change Password</span>
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            <Icon name="logout" className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>

        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 dark:text-white">
            AI News Assistant
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Welcome, <span className="font-semibold">{user.name}</span>. Generate up-to-the-minute news articles.
          </p>
        </header>

        <main>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <textarea
                id="news-topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter a news topic, e.g., 'latest advancements in AI robotics' or 'summary of the recent G7 summit'"
                className="flex-grow p-4 bg-gray-100 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200 resize-none"
                rows={3}
                disabled={isGenerating}
              />
              <button
                onClick={handleGenerate}
                disabled={!topic.trim() || isGenerating}
                className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:dark:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:scale-100"
              >
                {isGenerating ? (<><Spinner size="sm" /><span className="ml-2">Generating...</span></>) : (<><Icon name="sparkles" className="w-5 h-5" /><span className="ml-2">Generate News</span></>)}
              </button>
            </div>
          </div>

          <div className="mt-8" ref={articleContainerRef}>
            {isGenerating && <ArticleSkeleton />}
            {error && (
              <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg" role="alert">
                <strong className="font-bold">Error: </strong>
                <span>{error}</span>
              </div>
            )}
            {activeArticle && (
              <div className="animate-fade-in">
                <GeneratedArticle article={activeArticle} />
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl shadow-lg flex flex-wrap items-center justify-center gap-2 sm:gap-4">
                    {!isArticleSaved ? (
                       <button onClick={() => handleSaveArticle(activeArticle)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"><Icon name="save" className="w-5 h-5"/>Save Article</button>
                    ) : (
                       <span className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-600 dark:text-green-400"><Icon name="check" className="w-5 h-5"/>Saved</span>
                    )}
                    <button onClick={() => handleShareArticle(activeArticle)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"><Icon name="share" className="w-5 h-5"/>Share</button>
                    <button onClick={() => handleCopyArticle(activeArticle)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"><Icon name="copy" className="w-5 h-5"/>Copy Text</button>
                    {isArticleSaved && (
                       <button onClick={() => handleDeleteArticle(activeArticle.id)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors sm:ml-auto"><Icon name="delete" className="w-5 h-5"/>Delete</button>
                    )}
                </div>
              </div>
            )}
            {!isGenerating && !error && !activeArticle && (
               <div className="text-center py-12 px-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                  <Icon name="newspaper" className="mx-auto w-16 h-16 text-gray-400 dark:text-gray-500" />
                  <h3 className="mt-4 text-xl font-semibold text-gray-800 dark:text-gray-200">Your Generated Article Will Appear Here</h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">Enter a topic above and click "Generate News" to get started.</p>
              </div>
            )}
          </div>

          <SavedArticleList 
            articles={savedArticles}
            onViewArticle={setActiveArticle}
            onDeleteArticle={handleDeleteArticle}
            isLoading={isLoadingSaved}
          />
        </main>
      </div>
      {showChangePasswordModal && (
        <ChangePasswordModal 
          onClose={() => setShowChangePasswordModal(false)}
          onSuccess={() => {
            setShowChangePasswordModal(false);
            showFeedback("Password updated successfully!", "check");
          }}
        />
      )}
    </>
  );
};

export default NewsAssistant;