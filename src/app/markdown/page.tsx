// File: app/markdown/page.tsx
'use client';

import React, { JSX } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, type Variants } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/cjs/styles/prism';

const markdownContent = `# Welcome to Enhanced Markdown

This is a **beautifully styled** markdown component using *Tailwind CSS* and motion animations.

## Features

- Typography that scales well on all devices
- Beautiful animations and transitions
- Code highlighting
- Interactive elements

### Code Example

\`\`\`javascript
function hello() {
  console.log("Hello, world!");
}
\`\`\`

> This is a blockquote that stands out with a clean design

Visit [Example](https://example.com) for more information.

![Placeholder Image](https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=620&auto=format&fit=crop&q=60&ixlib=rb-4.1.0)

| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |

_Compact style:_

Term 1
  ~ Definition 1

Term 2
  ~ Definition 2a
  ~ Definition 2b


### [Abbreviations](https://github.com/markdown-it/markdown-it-abbr)

This is HTML abbreviation example.

It converts "HTML", but keep intact partial entries like "xxxHTMLyyy" and so on.

*[HTML]: Hyper Text Markup Language

### [Custom containers](https://github.com/markdown-it/markdown-it-container)

::: warning
*here be dragons*
:::
`;

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

const components: Components = {
  h1: ({ node, children, ...props }) => (
    <motion.div
      variants={itemVariants}
      className="relative my-12 first:mt-0"
    >
      <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-2 h-16 bg-gradient-to-b from-blue-500 to-violet-500 rounded-full" />
      <motion.h1
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        className="text-4xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-500 to-violet-600 py-4 pl-2 mb-4"
        {...props}
      >
        {children}
      </motion.h1>
      <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-8" />
      <div className="absolute right-0 bottom-0 w-20 h-20 rounded-full bg-blue-400/5 -z-10 blur-2xl" />
    </motion.div>
  ),

  h2: ({ node, children, ...props }) => (
    <motion.h2
      variants={itemVariants}
      className="text-2xl md:text-3xl font-bold text-blue-700 mt-10 mb-4"
      {...props}
    >
      {children}
    </motion.h2>
  ),

  h3: ({ node, children, ...props }) => (
    <motion.h3
      variants={itemVariants}
      className="text-xl md:text-2xl font-bold text-violet-700 mt-6 mb-3"
      {...props}
    >
      {children}
    </motion.h3>
  ),

  h4: ({ node, children, ...props }) => (
    <motion.h4
      variants={itemVariants}
      className="text-lg md:text-xl font-semibold text-gray-700 mt-4 mb-2"
      {...props}
    >
      {children}
    </motion.h4>
  ),

  p: ({ node, children, ...props }) => (
    <motion.p
      variants={itemVariants}
      className="text-gray-700 leading-relaxed my-4"
      {...props}
    >
      {children}
    </motion.p>
  ),

  a: ({ node, children, ...props }) => (
    <a
      className="text-blue-600 font-medium hover:text-blue-800 transition-colors duration-200 underline decoration-2 decoration-blue-400/30 hover:decoration-blue-600/50"
      {...props}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),

  strong: ({ node, children, ...props }) => (
    <strong className="font-bold text-gray-900" {...props}>
      {children}
    </strong>
  ),

  em: ({ node, children, ...props }) => (
    <em className="italic text-gray-800" {...props}>
      {children}
    </em>
  ),

  blockquote: ({ node, children, ...props }) => (
    <motion.blockquote
      variants={itemVariants}
      className="pl-4 border-l-4 border-blue-500 bg-blue-50 py-2 px-4 my-6 rounded-r-lg italic text-gray-700"
      {...props}
    >
      {children}
    </motion.blockquote>
  ),

  code: ({ node, inline, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || '');
    return !inline && match ? (
      <motion.div variants={itemVariants}>
        <SyntaxHighlighter
          style={oneLight}
          language={match[1]}
          PreTag="div"
          className="rounded-lg shadow-md my-6 overflow-hidden"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      </motion.div>
    ) : (
      <code
        className="font-mono bg-gray-200 px-1.5 py-0.5 rounded text-sm text-gray-800"
        {...props}
      >
        {children}
      </code>
    );
  },

  ul: ({ node, children, ...props }) => (
    <motion.ul
      variants={itemVariants}
      className="pl-6 list-disc space-y-2 my-6 text-gray-700"
      {...props}
    >
      {children}
    </motion.ul>
  ),

  ol: ({ node, children, ...props }) => (
    <motion.ol
      variants={itemVariants}
      className="pl-6 list-decimal space-y-2 my-6 text-gray-700"
      {...props}
    >
      {children}
    </motion.ol>
  ),

  li: ({ node, children, ...props }) => (
    <li className="pl-2" {...props}>
      {children}
    </li>
  ),

  hr: ({ node, ...props }) => (
    <motion.hr
      variants={itemVariants}
      className="my-8 border-t-2 border-gray-200"
      {...props}
    />
  ),

  img: ({ node, ...props }) => (
    <motion.div variants={itemVariants} className="my-8">
      <motion.img
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className="rounded-lg shadow-md mx-auto max-w-full h-auto"
        {...props}
        alt={props.alt || 'Markdown image'}
      />
    </motion.div>
  ),

  table: ({ node, children, ...props }) => (
    <motion.div
      variants={itemVariants}
      className="my-8 overflow-x-auto rounded-lg shadow-md bg-white"
    >
      <table className="w-full border-collapse" {...props}>
        {children}
      </table>
    </motion.div>
  ),

  thead: ({ node, children, ...props }) => (
    <thead className="bg-blue-50 text-blue-800 border-b-2 border-blue-100" {...props}>
      {children}
    </thead>
  ),

  tbody: ({ node, children, ...props }) => (
    <tbody className="divide-y divide-gray-200" {...props}>
      {children}
    </tbody>
  ),

  tr: ({ node, children, ...props }) => (
    <tr className="hover:bg-gray-50 transition-colors duration-150" {...props}>
      {children}
    </tr>
  ),

  th: ({ node, children, ...props }) => (
    <th className="px-6 py-3 text-left font-semibold text-sm tracking-wider" {...props}>
      {children}
    </th>
  ),

  td: ({ node, children, ...props }) => (
    <td className="px-6 py-4 whitespace-nowrap text-gray-700 text-sm" {...props}>
      {children}
    </td>
  ),

  
};

export default function MarkdownPage(): JSX.Element {
  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <motion.div
        initial="hidden"
        animate="show"
        variants={containerVariants}
        className="prose prose-slate lg:prose-xl max-w-none"
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
          {markdownContent}
        </ReactMarkdown>
      </motion.div>
    </div>
  );
}
