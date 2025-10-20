import React, { useState, useEffect } from 'react';
import { Category } from '../types';
import { getCategories, getQuestions } from '../services/api';
import Card from './ui/Card';
import Button from './ui/Button';
import Spinner from './ui/Spinner';
import { shuffleArray } from '../utils/helpers';

interface QuizSetupProps {
  onStartQuiz: (questions: any[]) => void;
}

const QUIZ_LENGTH = 20;

const QuizSetup: React.FC<QuizSetupProps> = ({ onStartQuiz }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories({ populatedOnly: true });
        setCategories(data);
        if (data.length > 0) {
          setSelectedCategory(data[0].id);
        }
      } catch (err: any) {
        setError('카테고리를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleStart = async () => {
    if (!selectedCategory) {
      setError('카테고리를 선택해주세요.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const questions = await getQuestions(selectedCategory, QUIZ_LENGTH);
      if (questions.length === 0) {
        setError('이 카테고리에는 문제가 없습니다. 먼저 질문을 추가해주세요.');
        setLoading(false);
        return;
      }
      onStartQuiz(shuffleArray(questions));
    } catch (err: any) {
      setError('퀴즈를 시작하는데 실패했습니다.');
      setLoading(false);
    }
  };

  if (loading && categories.length === 0) {
    return <Spinner />;
  }

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <h1 className="text-3xl font-bold mb-6 text-center">퀴즈 설정</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        
        <div className="space-y-6">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-2">카테고리 선택</label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500"
              disabled={categories.length === 0}
            >
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))
              ) : (
                <option>학습할 카테고리가 없습니다.</option>
              )}
            </select>
          </div>

          <p className="text-sm text-center text-slate-500">
            총 <span className="font-bold text-primary-600">{QUIZ_LENGTH}개</span>의 문제로 퀴즈가 시작됩니다.
          </p>
          
          <Button onClick={handleStart} disabled={loading || !selectedCategory} className="w-full text-lg py-3">
            {loading ? <Spinner /> : '퀴즈 시작'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default QuizSetup;