
import React from 'react';
import { BLOCKS, INLINES, MARKS } from '@contentful/rich-text-types';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

interface RichTextRendererProps {
  content: any;
  className?: string;
}

const RichTextRenderer: React.FC<RichTextRendererProps> = ({ content, className = "" }) => {
  if (!content) {
    return null;
  }

  const options = {
    renderMark: {
      [MARKS.BOLD]: (text: React.ReactNode) => <strong>{text}</strong>,
      [MARKS.ITALIC]: (text: React.ReactNode) => <em>{text}</em>,
      [MARKS.UNDERLINE]: (text: React.ReactNode) => <u>{text}</u>,
      [MARKS.CODE]: (text: React.ReactNode) => (
        <code className="px-1 py-0.5 bg-gray-100 rounded text-sm">{text}</code>
      ),
    },
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node: any, children: React.ReactNode) => (
        <p className="mb-4">{children}</p>
      ),
      [BLOCKS.HEADING_1]: (node: any, children: React.ReactNode) => (
        <h1 className="text-3xl font-bold font-lora mb-4 mt-6">{children}</h1>
      ),
      [BLOCKS.HEADING_2]: (node: any, children: React.ReactNode) => (
        <h2 className="text-2xl font-semibold font-lora mb-3 mt-5">{children}</h2>
      ),
      [BLOCKS.HEADING_3]: (node: any, children: React.ReactNode) => (
        <h3 className="text-xl font-semibold font-lora mb-3 mt-4">{children}</h3>
      ),
      [BLOCKS.HEADING_4]: (node: any, children: React.ReactNode) => (
        <h4 className="text-lg font-semibold font-lora mb-2 mt-4">{children}</h4>
      ),
      [BLOCKS.UL_LIST]: (node: any, children: React.ReactNode) => (
        <ul className="list-disc pl-6 mb-4">{children}</ul>
      ),
      [BLOCKS.OL_LIST]: (node: any, children: React.ReactNode) => (
        <ol className="list-decimal pl-6 mb-4">{children}</ol>
      ),
      [BLOCKS.LIST_ITEM]: (node: any, children: React.ReactNode) => (
        <li className="mb-1">{children}</li>
      ),
      [BLOCKS.QUOTE]: (node: any, children: React.ReactNode) => (
        <blockquote className="border-l-4 border-peacefulBlue pl-4 italic my-4">{children}</blockquote>
      ),
      [BLOCKS.HR]: () => <hr className="my-6 border-t border-gray-200" />,
      [INLINES.HYPERLINK]: (node: any, children: React.ReactNode) => (
        <a 
          href={node.data.uri} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-peacefulBlue hover:underline"
        >
          {children}
        </a>
      ),
      [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
        const { url, title, description } = node.data.target.fields;
        return (
          <div className="my-6">
            <img 
              src={url} 
              alt={description || title || 'Embedded image'} 
              className="rounded-lg max-w-full h-auto"
            />
            {description && (
              <p className="text-sm text-gray-500 mt-2">{description}</p>
            )}
          </div>
        );
      },
    },
  };

  return (
    <div className={className}>
      {documentToReactComponents(content, options)}
    </div>
  );
};

export default RichTextRenderer;
