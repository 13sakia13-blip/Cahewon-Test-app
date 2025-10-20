import React, { useState, useEffect } from 'react';
import { Question } from '../types';
import { saveQuizResult } from '../services/api';
import Button from './ui/Button';
import Card from './ui/Card';
import Flashcard from './Flashcard';

interface FlashcardViewProps {
  questions: Question[];
  navigate: (view: string) => void;
}

const FlashcardView: React.FC<FlashcardViewProps> = ({ questions, navigate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const currentQuestion = questions[currentIndex];

  const handleGraded = (isCorrect: boolean) => {
      saveQuizResult(currentQuestion.id, isCorrect);
  };
  
  const goToNext = () => {
     if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
     }
  }
  
  const goToPrev = () => {
     if (currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
     }
  }

  if (!questions || questions.length === 0) {
    return (
        <div className="text-center">
          <p>이용 가능한 질문이 없습니다.</p>
          <Button onClick={() => navigate('home')} className="mt-4">홈으로 가기</Button>
        </div>
    );
  }
  
  const progressPercentage = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-4">
        <div className="flex justify-between mb-1">
            <span className="text-base font-medium text-primary-700">카드 {currentIndex + 1} / {questions.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-primary-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
        </div>
      </div>
      
      <Card>
          <Flashcard key={currentQuestion.id} question={currentQuestion} onGraded={handleGraded} />
      </Card>

      <div className="flex justify-between items-center mt-6">
          <Button onClick={goToPrev} disabled={currentIndex === 0}>이전</Button>
          {currentIndex === questions.length - 1 ? (
              <Button onClick={() => navigate('home')} className="bg-green-600 hover:bg-green-700">세션 완료</Button>
          ) : (
              <Button onClick={goToNext}>다음</Button>
          )}
      </div>
    </div>
  );
};

export default FlashcardView;