import React, { useState, useEffect } from 'react';
import { Question } from '../types';
import { getIncorrectlyAnsweredQuestions } from '../services/api';
import Button from './ui/Button';
import Spinner from './ui/Spinner';
import Card from './ui/Card';
import { shuffleArray } from '../utils/helpers';

interface IncorrectNotesProps {
  onStartQuiz: (questions: Question[]) => void;
}

const IncorrectNotes: React.FC<IncorrectNotesProps> = ({ onStartQuiz }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await getIncorrectlyAnsweredQuestions();
        setQuestions(data);
      } catch (err) {
        setError('틀린 문제를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <h1 className="text-2xl font-bold mb-4 text-center">오답 노트</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {questions.length > 0 ? (
          <>
            <p className="text-center text-slate-600 mb-6">복습할 문제가 {questions.length}개 있습니다. 다시 풀어볼까요?</p>
            <Button onClick={() => onStartQuiz(shuffleArray(questions))} className="w-full">
              복습 세션 시작
            </Button>
          </>
        ) : (
          <p className="text-center text-slate-600">기록된 오답이 없습니다. 잘하셨어요!</p>
        )}
      </Card>
    </div>
  );
};

export default IncorrectNotes;