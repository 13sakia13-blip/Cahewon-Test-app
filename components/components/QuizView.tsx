import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Question, QuestionType, QuizAnswer } from '../types';
import { saveQuizResult } from '../services/api';
import { shuffleArray } from '../utils/helpers';
import Button from './ui/Button';
import Card from './ui/Card';

// Icons
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;


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
  const shortAnswerInputRef = useRef<HTMLInputElement>(null);
  
  const currentQuestion = questions[currentIndex];
  
  const shuffledOptions = useMemo(() => {
    if (currentQuestion && currentQuestion.type === QuestionType.MultipleChoice) {
      const options = [...(currentQuestion.options || []), currentQuestion.correct_answer];
      return shuffleArray(options);
    }
    return [];
  }, [currentQuestion]);

  useEffect(() => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    setShortAnswerInput('');
  }, [currentIndex]);

  // Automatically focus the input for short-answer questions
  useEffect(() => {
    if (currentQuestion?.type === QuestionType.ShortAnswer) {
      // Use a short timeout to ensure the input is rendered and ready to be focused,
      // which can help with reliability after state changes.
      const timer = setTimeout(() => {
        shortAnswerInputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [currentQuestion]);

  const finishQuiz = useCallback(() => {
    const score = answers.filter(a => a.isCorrect).length;
    onQuizFinish({ score, total: questions.length, answers });
  }, [answers, onQuizFinish, questions.length]);

  const goToNextQuestion = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      finishQuiz();
    }
  }, [currentIndex, questions.length, finishQuiz]);
  
  useEffect(() => {
    if (isAnswered) {
        const handleEnter = (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                goToNextQuestion();
            }
        };
        document.addEventListener('keydown', handleEnter);
        return () => {
            document.removeEventListener('keydown', handleEnter);
        };
    }
  }, [isAnswered, goToNextQuestion]);


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


  if (!currentQuestion) {
    return <p>이용 가능한 질문이 없습니다.</p>;
  }

  const progressPercentage = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-4">
        <div className="flex justify-between mb-2">
            <span className="text-base font-semibold text-primary-700">질문 {currentIndex + 1} / {questions.length}</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-3">
            <div className="bg-primary-600 h-3 rounded-full transition-all duration-500 ease-out" style={{ width: `${progressPercentage}%` }}></div>
        </div>
      </div>

      <Card>
        <div className="min-h-[400px] flex flex-col justify-between">
            <div>
                <p className="text-xl font-semibold mb-4 text-center">{currentQuestion.question_text}</p>
                {currentQuestion.image_url && <img src={currentQuestion.image_url} alt="질문 이미지" className="my-4 rounded-lg max-h-64 mx-auto"/>}
            </div>
            
            {currentQuestion.type === QuestionType.ShortAnswer ? (
                <div className="mt-6 flex flex-col items-center">
                <input
                    ref={shortAnswerInputRef}
                    type="text"
                    value={shortAnswerInput}
                    onChange={(e) => setShortAnswerInput(e.target.value)}
                    disabled={isAnswered}
                    placeholder="답을 입력하세요"
                    className={`w-full max-w-sm p-3 border-2 rounded-lg shadow-sm text-center text-lg transition-colors focus:ring-primary-500 focus:border-primary-500 ${isAnswered ? (selectedAnswer && currentQuestion.correct_answer.toLowerCase() === selectedAnswer.toLowerCase() ? 'border-green-500 bg-green-50 text-green-800' : 'border-red-500 bg-red-50 text-red-800') : 'border-slate-300'}`}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !isAnswered) {
                            e.preventDefault();
                            e.stopPropagation();
                            handleShortAnswerSubmit();
                        }
                    }}
                />
                
                {!isAnswered && (
                    <Button onClick={handleShortAnswerSubmit} className="mt-4">
                    정답 확인
                    </Button>
                )}

                {isAnswered && (
                    <div className="mt-4 text-center w-full max-w-sm p-4 rounded-lg animate-fade-in">
                    {selectedAnswer && currentQuestion.correct_answer.toLowerCase() === selectedAnswer.toLowerCase() ? (
                        <p className="text-green-600 font-bold text-lg">정답입니다!</p>
                    ) : (
                        <div>
                        <p className="text-red-600 font-bold text-lg">오답입니다.</p>
                        <p className="text-slate-700 mt-1">정답: <span className="font-semibold">{currentQuestion.correct_answer}</span></p>
                        </div>
                    )}
                    </div>
                )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {shuffledOptions.map((option, index) => {
                    const isCorrect = option === currentQuestion.correct_answer;
                    const isSelected = option === selectedAnswer;

                    let buttonClass = 'bg-white hover:bg-slate-100 border-2 border-slate-300 text-slate-800';
                    let icon = null;

                    if (isAnswered) {
                        if (isCorrect) {
                            buttonClass = 'bg-green-100 border-green-400 text-green-900 ring-2 ring-green-300';
                            icon = <CheckIcon />;
                        } else if (isSelected) {
                            buttonClass = 'bg-red-100 border-red-400 text-red-900 ring-2 ring-red-300';
                            icon = <XIcon />;
                        } else {
                            buttonClass = 'bg-slate-50 border-slate-200 text-slate-500 opacity-70';
                        }
                    }
                    
                    return (
                    <button
                        key={index}
                        onClick={() => handleMultipleChoiceAnswer(option)}
                        disabled={isAnswered}
                        className={`p-4 rounded-lg text-left transition-all duration-200 text-base font-medium flex items-center justify-between ${buttonClass}`}
                    >
                        <span>{option}</span>
                        {icon}
                    </button>
                    );
                })}
                </div>
            )}
            
            {isAnswered && (
                <div className="mt-8 text-center animate-fade-in">
                    <Button onClick={goToNextQuestion}>
                    {currentIndex === questions.length - 1 ? '결과 보기' : '다음 문제 (Enter)'}
                    </Button>
                </div>
            )}
        </div>
      </Card>
    </div>
  );
};

export default QuizView;