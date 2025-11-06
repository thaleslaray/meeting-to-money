import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer = ({ content, className }: MarkdownRendererProps) => {
  return (
    <div className={cn("markdown-content", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
        h1: ({ children }) => (
          <h1 className="text-2xl font-bold text-foreground mb-4 mt-6 first:mt-0 border-b border-border pb-2">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-xl font-semibold text-foreground mb-3 mt-5 first:mt-0">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-lg font-semibold text-foreground mb-2 mt-4 first:mt-0">
            {children}
          </h3>
        ),
        h4: ({ children }) => (
          <h4 className="text-base font-semibold text-foreground mb-2 mt-3 first:mt-0">
            {children}
          </h4>
        ),
        p: ({ children }) => (
          <p className="text-sm text-foreground mb-3 leading-relaxed">
            {children}
          </p>
        ),
        ul: ({ children }) => (
          <ul className="list-disc list-inside space-y-1 mb-3 text-sm text-foreground ml-2">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-inside space-y-1 mb-3 text-sm text-foreground ml-2">
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li className="text-foreground ml-2">
            {children}
          </li>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-primary bg-primary/5 pl-4 py-2 my-3 italic text-sm text-muted-foreground">
            {children}
          </blockquote>
        ),
        code: ({ children, className }) => {
          const isInline = !className?.includes('language-');
          return isInline ? (
            <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono text-foreground">
              {children}
            </code>
          ) : (
            <code className="block bg-muted p-3 rounded-lg text-xs font-mono text-foreground overflow-x-auto mb-3">
              {children}
            </code>
          );
        },
        pre: ({ children }) => (
          <pre className="bg-muted p-3 rounded-lg overflow-x-auto mb-3">
            {children}
          </pre>
        ),
        table: ({ children }) => (
          <div className="overflow-x-auto mb-4">
            <table className="min-w-full border border-border rounded-lg">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-muted">
            {children}
          </thead>
        ),
        tbody: ({ children }) => (
          <tbody className="divide-y divide-border">
            {children}
          </tbody>
        ),
        tr: ({ children }) => (
          <tr className="hover:bg-muted/50 transition-colors">
            {children}
          </tr>
        ),
        th: ({ children }) => (
          <th className="px-4 py-2 text-left text-sm font-semibold text-foreground">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-4 py-2 text-sm text-foreground">
            {children}
          </td>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold text-foreground">
            {children}
          </strong>
        ),
        em: ({ children }) => (
          <em className="italic text-foreground">
            {children}
          </em>
        ),
        a: ({ children, href }) => (
          <a 
            href={href} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 underline transition-colors"
          >
            {children}
          </a>
        ),
        hr: () => (
          <hr className="my-4 border-border" />
        ),
      }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
