
import React from 'react';

interface MarkdownRendererProps {
  text: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ text }) => {
  // Function to render a single line, handling bold text
  const renderLine = (line: string, key: string | number) => {
    // This regex splits the line by the bold markers, keeping the markers.
    const parts = line.split(/(\*\*.*?\*\*)/g);
    return (
      <React.Fragment key={key}>
        {parts.map((part, index) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={index}>{part.slice(2, -2)}</strong>;
          }
          return part;
        })}
      </React.Fragment>
    );
  };

  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];

  const lines = text.split('\n');

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('* ')) {
      listItems.push(trimmedLine.substring(2).trim());
    } else {
      // If we have accumulated list items, render them first
      if (listItems.length > 0) {
        elements.push(
          <ul key={`ul-${index}`} className="list-disc list-inside space-y-1 my-2">
            {listItems.map((item, itemIndex) => (
              <li key={itemIndex}>{renderLine(item, itemIndex)}</li>
            ))}
          </ul>
        );
        listItems = []; // Reset the list
      }
      // Render the current line as a paragraph if it's not empty
      if (trimmedLine !== '') {
        elements.push(<p key={index}>{renderLine(line, index)}</p>);
      }
    }
  });

  // Render any remaining list items at the end
  if (listItems.length > 0) {
    elements.push(
      <ul key="ul-last" className="list-disc list-inside space-y-1 my-2">
        {listItems.map((item, itemIndex) => (
          <li key={itemIndex}>{renderLine(item, itemIndex)}</li>
        ))}
      </ul>
    );
  }

  return <div className="space-y-2">{elements}</div>;
};

export default MarkdownRenderer;
