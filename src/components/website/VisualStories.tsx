// FIX: Implemented the VisualStories component to resolve module errors. This component wraps the existing Gallery component for code reuse.
import React from 'react';
import { galleryCopy } from '@/constants';
import Gallery from './Gallery';

const VisualStories: React.FC = () => {
  return <Gallery copy={galleryCopy} />;
};

export default VisualStories;
