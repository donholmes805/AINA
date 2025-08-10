
import React from 'react';
import type { Article } from '../types';
import { Icon } from './common/Icon';

interface GeneratedArticleProps {
  article: Article;
}

const GeneratedArticle: React.FC<GeneratedArticleProps> = ({ article }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-t-xl shadow-lg overflow-hidden">
      {article.imageUrl && (
        <img 
          src={article.imageUrl} 
          alt={`AI-generated image for the article titled: ${article.title}`}
          className="w-full h-auto object-cover aspect-video" 
        />
      )}
      <div className="p-6 sm:p-8">
        <header className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white leading-tight">
            {article.title}
          </h2>
        </header>

        <article className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
          <p className="whitespace-pre-wrap">{article.content}</p>
        </article>
      </div>

      {article.sources && article.sources.length > 0 && (
        <footer className="bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 px-6 sm:px-8 py-4">
          <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
            Sources
          </h4>
          <ul className="space-y-2">
            {article.sources.map((source, index) => (
              <li key={index} className="flex items-start">
                <Icon name="link" className="w-4 h-4 mr-2 mt-1 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                <a
                  href={source.web?.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm truncate"
                  title={source.web?.title}
                >
                  {source.web?.title || 'Unknown Source'}
                </a>
              </li>
            ))}
          </ul>
        </footer>
      )}
    </div>
  );
};

export default GeneratedArticle;
