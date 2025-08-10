import React from 'react';
import type { Article } from '../types';
import { Icon } from './common/Icon';

interface SavedArticleItemProps {
  article: Article;
  onView: (article: Article) => void;
  onDelete: (articleId: string) => void;
}

const SavedArticleItem: React.FC<SavedArticleItemProps> = ({ article, onView, onDelete }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 flex items-center justify-between gap-4 transition-transform transform hover:scale-[1.02]">
    <div className="flex items-center gap-4 overflow-hidden">
      {article.imageUrl && <img src={article.imageUrl} alt="" className="w-16 h-10 object-cover rounded-md hidden sm:block"/>}
      <p className="font-semibold truncate text-gray-700 dark:text-gray-200" title={article.title}>{article.title}</p>
    </div>
    <div className="flex-shrink-0 flex items-center gap-2">
      <button onClick={() => onView(article)} className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors" aria-label="View Article"><Icon name="newspaper" className="w-5 h-5"/></button>
      <button onClick={() => onDelete(article.id)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full transition-colors" aria-label="Delete Article"><Icon name="delete" className="w-5 h-5"/></button>
    </div>
  </div>
);


interface SavedArticleListProps {
  articles: Article[];
  onViewArticle: (article: Article) => void;
  onDeleteArticle: (articleId: string) => void;
}

const SavedArticleList: React.FC<SavedArticleListProps> = ({ articles, onViewArticle, onDeleteArticle }) => {
  if (articles.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">My Saved Articles</h2>
      <div className="space-y-4">
        {articles.map(article => (
          <SavedArticleItem
            key={article.id}
            article={article}
            onView={onViewArticle}
            onDelete={onDeleteArticle}
          />
        ))}
      </div>
    </div>
  );
};

export default SavedArticleList;
