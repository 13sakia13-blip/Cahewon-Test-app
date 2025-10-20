import React, { useState, useEffect } from 'react';
import { Question } from '../types';
import Button from './ui/Button';

interface FlashcardProps {
  question: Question;
  onGraded: (correct: boolean) => void;
}

const Flashcard: React.FC<FlashcardProps> = ({ question, onGraded }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [answered, setAnswered] = useState(false);

  // This effect is a safeguard to ensure the card resets its state 
  // to front-facing whenever a new question is passed in.
  useEffect(() => {
    setIsFlipped(false);
    setAnswered(false);
  }, [question.id]);

  const handleFlip = () => {
    if (answered) return; // Stop flipping after grading
    setIsFlipped(prev => !prev);
  };
  
  const handleSelfGrade = (correct: boolean) => {
    if (answered) return;
    setAnswered(true);
    onGraded(correct);
  };

  return (
    <>
      <div 
        className={`flashcard w-full h-64 cursor-pointer ${isFlipped ? 'flipped' : ''}`}
        onClick={handleFlip}
      >
        <div className="flashcard-inner">
          {/* Front of card */}
          <div className="flashcard-front flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-lg border">
            {question.image_url && <img src={question.image_url} alt="질문 이미지" className="mb-4 rounded-lg max-h-24 mx-auto"/>}
            <p className="text-xl text-center">{question.question_text}</p>
            {!isFlipped && (
              <div className="absolute bottom-4 text-sm text-slate-400">
                카드를 클릭하여 정답 확인
              </div>
            )}
          </div>
          {/* Back of card */}
          <div className="flashcard-back flex items-center justify-center p-6 bg-primary-100 rounded-lg shadow-lg border">
            <p className="text-xl font-bold text-center text-primary-800">{question.correct_answer}</p>
          </div>
        </div>
      </div>
      <div className="mt-6 text-center h-10">
        {isFlipped && !answered && (
          <div className="flex justify-center space-x-4 animate-fade-in">
            <Button onClick={(e) => { e.stopPropagation(); handleSelfGrade(false); }} variant="danger">틀렸어요</Button>
            <Button onClick={(e) => { e.stopPropagation(); handleSelfGrade(true); }} className="bg-green-600 hover:bg-green-700 text-white">맞았어요</Button>
          </div>
        )}
        {answered && <p className="text-green-600 font-semibold pt-2">기록되었습니다!</p>}
      </div>
    </>
  );
};

export default Flashcard;