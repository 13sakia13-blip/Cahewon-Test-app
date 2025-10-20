import React, { useState, useEffect } from 'react';
import { LearningLog, Question, Category } from '../types';
import { getTodaysLearningData } from '../services/api';
import Card from './ui/Card';
import Spinner from './ui/Spinner';
import Button from './ui/Button';

interface TodayData {
    logs: LearningLog[];
    questions: Record<string, Question>;
    categories: Record<string, Category>;
}

const TodaySummary: React.FC<{ navigate: (view: string) => void }> = ({ navigate }) => {
    const [data, setData] = useState<TodayData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const summaryData = await getTodaysLearningData();
                setData(summaryData);
            } catch (err) {
                console.error(err);
                setError('학습 데이터를 불러오는 데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <Spinner />;
    if (error) return <p className="text-red-500 text-center">{error}</p>;
    if (!data || data.logs.length === 0) {
        return (
            <Card className="text-center max-w-md mx-auto">
                <h1 className="text-2xl font-bold mb-4">오늘의 학습 기록</h1>
                <p className="text-slate-600">오늘 학습한 기록이 없습니다.</p>
                <Button onClick={() => navigate('setup')} className="mt-6">퀴즈 풀러 가기</Button>
            </Card>
        );
    }
    
    const { logs, questions, categories } = data;
    const totalQuestions = logs.length;
    const correctAnswers = logs.filter(l => l.is_correct).length;
    const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
    const estimatedMinutes = Math.ceil((totalQuestions * 30) / 60);

    const studiedCategoryIds = new Set(Object.values(questions).map(q => q.category_id));
    const studiedCategories = Array.from(studiedCategoryIds).map(id => categories[id]?.name).filter(Boolean);

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-center text-slate-900">오늘의 학습 요약</h1>
            
            <Card>
                <h2 className="text-2xl font-bold mb-6 text-center">종합 통계</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                    <div>
                        <p className="text-sm text-slate-500">총 학습 문제</p>
                        <p className="text-4xl font-bold text-primary-600">{totalQuestions}</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">정답률</p>
                        <p className={`text-4xl font-bold ${accuracy > 70 ? 'text-green-500' : accuracy > 40 ? 'text-yellow-500' : 'text-red-500'}`}>{accuracy.toFixed(0)}%</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">예상 학습 시간</p>
                        <p className="text-4xl font-bold text-blue-600">≈ {estimatedMinutes}분</p>
                    </div>
                </div>
            </Card>

            <Card>
                <h2 className="text-2xl font-bold mb-4">학습한 카테고리</h2>
                {studiedCategories.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {studiedCategories.map(name => (
                            <span key={name} className="bg-primary-100 text-primary-800 text-sm font-medium px-3 py-1 rounded-full">{name}</span>
                        ))}
                    </div>
                ) : (
                    <p className="text-slate-500">카테고리 정보가 없습니다.</p>
                )}
            </Card>

            <Card>
                <h2 className="text-2xl font-bold mb-4">학습 상세 내역</h2>
                <div className="max-h-96 overflow-y-auto">
                    <ul className="divide-y divide-slate-200">
                        {logs.map(log => {
                            const question = questions[log.question_id];
                            if (!question) return null;
                            const category = categories[question.category_id];
                            return (
                                <li key={log.id} className="py-4 flex items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <p className="font-medium text-slate-800">{question.question_text}</p>
                                        <p className="text-sm text-slate-500">{category?.name || '알 수 없음'}</p>
                                    </div>
                                    {log.is_correct ? (
                                        <span className="flex-shrink-0 text-sm font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full">정답</span>
                                    ) : (
                                        <span className="flex-shrink-0 text-sm font-semibold text-red-600 bg-red-100 px-3 py-1 rounded-full">오답</span>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </Card>

             <div className="text-center mt-8">
                <Button onClick={() => navigate('home')} variant="secondary">홈으로 돌아가기</Button>
            </div>
        </div>
    );
};

export default TodaySummary;