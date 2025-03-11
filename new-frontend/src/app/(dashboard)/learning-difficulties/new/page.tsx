'use client';

import { useRouter } from 'next/navigation';
import LearningDifficultyPage from '../[id]/page';

export default function NewLearningDifficultyPage() {
  return <LearningDifficultyPage params={{ id: 'new' }} />;
} 