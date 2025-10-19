
import React, { useState, useEffect } from 'react';
import { Category } from '../types';
import { getCategories, getQuestions } from '../services/api';
import Card from './ui/Card';
import Button from './ui/Button';
import Spinner from './ui/Spinner';

interface QuizSetupProps {
  onStartQuiz: (questions: any[]) => void;
}

const QuizSetup: React.FC<QuizSetupProps> = ({ onStartQuiz }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [numQuestions, setNumQuestions] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
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
      const questions = await getQuestions(selectedCategory, numQuestions);
      if (questions.length === 0) {
        setError('이 카테고리에는 문제가 없습니다. 먼저 질문을 추가해주세요.');
        setLoading(false);
        return;
      }
      onStartQuiz(questions);
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
        <h1 className="text-2xl font-bold mb-6 text-center">퀴즈 설정</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        
        <div className="space-y-6">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-2">카테고리</label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              disabled={categories.length === 0}
            >
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))
              ) : (
                <option>카테고리 없음</option>
              )}
            </select>
          </div>

          <div>
            <label htmlFor="numQuestions" className="block text-sm font-medium text-slate-700 mb-2">
              문제 수: <span className="font-bold text-primary-600">{numQuestions}</span>
            </label>
            <input
              id="numQuestions"
              type="range"
              min="1"
              max="20"
              value={numQuestions}
              onChange={(e) => setNumQuestions(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
            />
          </div>
          
          <Button onClick={handleStart} disabled={loading || !selectedCategory} className="w-full">
            {loading ? <Spinner /> : '퀴즈 시작'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default QuizSetup;
