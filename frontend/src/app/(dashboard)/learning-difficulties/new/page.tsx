'use client';

import { useRouter } from 'next/navigation';
import LearningDifficultyPage from '../[id]/page';

export default function NewLearningDifficultyPage() {
  return <LearningDifficultyPage params={Promise.resolve({ id: 'new' })} />;
} 