import React, { useState, useEffect, useMemo } from 'react';
import { Question, QuestionType, QuizAnswer } from '../types';
import { saveQuizResult } from '../services/api';
import { shuffleArray } from '../utils/helpers';
import Button from './ui/Button';
import Card from './ui/Card';

interface QuizViewProps {
  questions: Question[];
  onQuizFinish: (results: { score: number; total: number; answers: QuizAnswer[] }) => void;
}

const QuizView: React.FC<QuizViewProps> = ({ questions, onQuizFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [shortAnswerInput, setShortAnswerInput] = useState('');
  
  const currentQuestion = questions[currentIndex];
  
  const shuffledOptions = useMemo(() => {
    if (currentQuestion && currentQuestion.type === QuestionType.MultipleChoice) {
      const options = [...(currentQuestion.options || []), currentQuestion.correct_answer];
      return shuffleArray(options);
    }
    return [];
  }, [currentQuestion]);

  useEffect(() => {
    // Reset state when question changes
    setSelectedAnswer(null);
    setIsAnswered(false);
    setShortAnswerInput('');
  }, [currentIndex]);

  const handleMultipleChoiceAnswer = (answer: string) => {
    if (isAnswered) return;

    const isCorrect = answer === currentQuestion.correct_answer;
    setSelectedAnswer(answer);
    setIsAnswered(true);

    const newAnswer = { questionId: currentQuestion.id, answer, isCorrect };
    setAnswers(prev => [...prev, newAnswer]);
    saveQuizResult(currentQuestion.id, isCorrect);
  };
  
  const handleShortAnswerSubmit = () => {
    if (isAnswered || !shortAnswerInput.trim()) return;

    const isCorrect = shortAnswerInput.trim().toLowerCase() === currentQuestion.correct_answer.toLowerCase();
    setIsAnswered(true);
    setSelectedAnswer(shortAnswerInput.trim());

    const newAnswer = { questionId: currentQuestion.id, answer: shortAnswerInput.trim(), isCorrect };
    setAnswers(prev => [...prev, newAnswer]);
    saveQuizResult(currentQuestion.id, isCorrect);
  };

  const goToNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    const score = answers.filter(a => a.isCorrect).length;
    onQuizFinish({ score, total: questions.length, answers });
  };

  if (!currentQuestion) {
    return <p>이용 가능한 질문이 없습니다.</p>;
  }

  const progressPercentage = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-4">
        <div className="flex justify-between mb-1">
            <span className="text-base font-medium text-primary-700">질문 {currentIndex + 1} / {questions.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-primary-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
        </div>
      </div>

      <Card>
        {currentQuestion.type === QuestionType.ShortAnswer ? (
          <div>
            <p className="text-xl font-semibold mb-4 text-center">{currentQuestion.question_text}</p>
            {currentQuestion.image_url && <img src={currentQuestion.image_url} alt="질문 이미지" className="my-4 rounded-lg max-h-64 mx-auto"/>}
            
            <div className="mt-6 flex flex-col items-center">
              <input
                type="text"
                value={shortAnswerInput}
                onChange={(e) => setShortAnswerInput(e.target.value)}
                disabled={isAnswered}
                placeholder="답을 입력하세요"
                className={`w-full max-w-sm p-2 border rounded-md shadow-sm transition-colors focus:ring-primary-500 focus:border-primary-500 ${isAnswered ? (selectedAnswer && currentQuestion.correct_answer.toLowerCase() === selectedAnswer.toLowerCase() ? 'border-green-500 bg-green-50 text-green-800' : 'border-red-500 bg-red-50 text-red-800') : 'border-slate-300'}`}
                onKeyDown={(e) => e.key === 'Enter' && !isAnswered && handleShortAnswerSubmit()}
              />
              
              {!isAnswered && (
                <Button onClick={handleShortAnswerSubmit} className="mt-4">
                  정답 확인
                </Button>
              )}

              {isAnswered && (
                <div className="mt-4 text-center w-full max-w-sm p-4 rounded-md">
                   {selectedAnswer && currentQuestion.correct_answer.toLowerCase() === selectedAnswer.toLowerCase() ? (
                     <p className="text-green-600 font-bold">정답입니다!</p>
                   ) : (
                     <div>
                       <p className="text-red-600 font-bold">오답입니다.</p>
                       <p className="text-slate-700 mt-1">정답: <span className="font-semibold">{currentQuestion.correct_answer}</span></p>
                     </div>
                   )}
                </div>
              )}
            </div>
            
            {isAnswered && (
              <div className="mt-6 text-center">
                <Button onClick={goToNextQuestion}>
                  {currentIndex === questions.length - 1 ? '퀴즈 종료' : '다음 질문'}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div>
            <p className="text-xl font-semibold mb-4 text-center">{currentQuestion.question_text}</p>
            {currentQuestion.image_url && <img src={currentQuestion.image_url} alt="질문 이미지" className="my-4 rounded-lg max-h-64 mx-auto"/>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {shuffledOptions.map((option, index) => {
                const isCorrect = option === currentQuestion.correct_answer;
                const isSelected = option === selectedAnswer;

                let buttonClass = 'bg-white hover:bg-slate-100 border border-slate-300 text-slate-800';
                if (isAnswered) {
                    if (isCorrect) {
                        buttonClass = 'bg-green-500 text-white border-green-500';
                    } else if (isSelected) {
                        buttonClass = 'bg-red-500 text-white border-red-500';
                    } else {
                        buttonClass = 'bg-white border-slate-300 text-slate-800 opacity-60';
                    }
                }
                
                return (
                  <button
                    key={index}
                    onClick={() => handleMultipleChoiceAnswer(option)}
                    disabled={isAnswered}
                    className={`p-4 rounded-lg text-left transition-all duration-300 ${buttonClass}`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
            {isAnswered && (
              <div className="mt-6 text-center">
                <Button onClick={goToNextQuestion}>
                  {currentIndex === questions.length - 1 ? '퀴즈 종료' : '다음 질문'}
                </Button>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default QuizView;