import React from 'react';
import { Post } from '../types';
import { Calendar, Check } from 'lucide-react';

interface ArticleGridCardProps {
  post: Post;
  onSelectPost: (post: Post) => void;
}

export const ArticleGridCard: React.FC<ArticleGridCardProps> = ({
  post,
  onSelectPost,
}) => {
  const authorName = typeof post.author === 'string' ? post.author : post.author?.name || 'ErrorEase';

  return (
    <article
      onClick={() => onSelectPost(post)}
      style={{ borderRadius: '1px' }}
      className="bg-white border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-shadow duration-200 group flex flex-col cursor-pointer"
    >
      {/* Card Content */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between">
        <h2 className="text-[15px] sm:text-[16px] font-bold text-slate-900 leading-[1.35] tracking-tight group-hover:text-[#00a877] transition-colors mb-2.5">
          <a
            href={`/${post.slug}`}
            onClick={(e) => {
              e.preventDefault();
              onSelectPost(post);
            }}
            className="hover:underline focus:outline-hidden"
          >
            {post.title}
          </a>
        </h2>

        {/* Meta Bar - Author, Verified Badge, Pipe, Calendar & Date */}
        <div className="flex items-center text-xs text-slate-700 gap-1.5 flex-wrap pt-0.5">
          <span className="font-semibold text-slate-900">
            {authorName}
          </span>
          
          {/* Blue Verified Badge */}
          <span 
            className="inline-flex items-center justify-center w-3.5 h-3.5 bg-[#1d9bf0] rounded-full text-white shrink-0" 
            title="Verified Author"
          >
            <Check className="w-2.5 h-2.5 stroke-[3]" />
          </span>

          <span className="text-slate-400 select-none mx-0.5">|</span>

          <span className="flex items-center gap-1 text-slate-600 font-normal">
            <Calendar className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            <span>{post.publishedDate}</span>
          </span>
        </div>
      </div>
    </article>
  );
};

