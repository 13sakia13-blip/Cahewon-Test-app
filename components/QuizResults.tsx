
import React from 'react';
import { QuizResult } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';

interface QuizResultsProps {
  results: QuizResult | null;
  navigate: (view: string) => void;
}

const QuizResults: React.FC<QuizResultsProps> = ({ results, navigate }) => {
  if (!results) {
    return (
      <div className="text-center">
        <p>표시할 결과가 없습니다. 먼저 퀴즈를 완료해주세요.</p>
        <Button onClick={() => navigate('home')} className="mt-4">홈으로 가기</Button>
      </div>
    );
  }

  const { score, total, answers } = results;
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const incorrectAnswersExist = answers.some(a => !a.isCorrect);

  return (
    <div className="max-w-2xl mx-auto text-center">
      <Card>
        <h1 className="text-3xl font-bold mb-2">퀴즈 완료!</h1>
        <p className="text-slate-600 mb-6">결과는 다음과 같습니다:</p>
        
        <div className="mb-8">
            <div className={`text-6xl font-extrabold ${percentage > 70 ? 'text-green-500' : percentage > 40 ? 'text-yellow-500' : 'text-red-500'}`}>
                {percentage}%
            </div>
            <div className="text-2xl font-semibold text-slate-800 mt-2">
                {score} / {total} 정답
            </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
          <Button onClick={() => navigate('setup')} variant="primary">새로운 퀴즈 풀기</Button>
          {incorrectAnswersExist && (
            <Button onClick={() => navigate('incorrect')} variant="secondary">틀린 문제 다시 풀기</Button>
          )}
          <Button onClick={() => navigate('home')} variant="ghost">홈으로 돌아가기</Button>
        </div>
      </Card>
    </div>
  );
};

export default QuizResults;
