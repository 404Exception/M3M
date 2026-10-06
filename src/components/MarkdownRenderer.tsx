import React from 'react';
import Markdown, { Components } from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-8 mb-4 tracking-tight leading-tight">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-8 mb-4 pb-2 border-b border-slate-200 tracking-tight flex items-center gap-2">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-lg sm:text-xl font-bold text-slate-800 mt-6 mb-3 tracking-tight">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-base sm:text-lg font-bold text-slate-800 mt-5 mb-2">
      {children}
    </h4>
  ),
  p: ({ children }) => (
    <p className="text-slate-700 leading-relaxed mb-4 text-sm sm:text-base whitespace-pre-line">
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-outside pl-6 space-y-2 mb-5 text-slate-700 text-sm sm:text-base">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-outside pl-6 space-y-2 mb-5 text-slate-700 text-sm sm:text-base">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="leading-relaxed pl-1">
      {children}
    </li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-emerald-600 bg-emerald-50/70 pl-4 py-3 pr-4 rounded-r-xl my-6 text-slate-800 italic font-medium text-sm sm:text-base">
      {children}
    </blockquote>
  ),
  hr: () => (
    <hr className="my-8 border-t-2 border-slate-200" />
  ),
  strong: ({ children }) => (
    <strong className="font-bold text-slate-900">
      {children}
    </strong>
  ),
  em: ({ children }) => (
    <em className="italic text-slate-800">
      {children}
    </em>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-emerald-700 font-semibold underline underline-offset-2 hover:text-emerald-900 transition-colors"
    >
      {children}
    </a>
  ),
  code: ({ className, children }: any) => {
    const isInline = !className && typeof children === 'string' && !children.includes('\n');
    return isInline ? (
      <code className="px-1.5 py-0.5 bg-slate-100 text-emerald-800 font-mono text-xs rounded border border-slate-200">
        {children}
      </code>
    ) : (
      <div className="my-5 rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
        <pre className="p-4 text-emerald-400 font-mono text-xs sm:text-sm overflow-x-auto">
          <code>{children}</code>
        </pre>
      </div>
    );
  },
  table: ({ children }) => (
    <div className="overflow-x-auto my-6 border border-slate-200 rounded-xl shadow-2xs">
      <table className="min-w-full divide-y divide-slate-200 text-xs sm:text-sm text-left">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-slate-100 text-slate-800 font-bold uppercase text-[11px] tracking-wider">
      {children}
    </thead>
  ),
  th: ({ children }) => (
    <th className="px-4 py-3 font-bold border-b border-slate-200">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-3 text-slate-700 border-b border-slate-100">
      {children}
    </td>
  ),
};

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  if (!content || !content.trim()) {
    return null;
  }
  return (
    <div className={`markdown-content ${className}`}>
      <Markdown components={markdownComponents}>{content}</Markdown>
    </div>
  );
};
