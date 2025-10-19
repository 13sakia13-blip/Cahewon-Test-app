import React from 'react';
import Card from './ui/Card';
import Button from './ui/Button';

interface HomeProps {
  navigate: (view: string) => void;
}

const Home: React.FC<HomeProps> = ({ navigate }) => {
  return (
    <div className="text-center">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-slate-900">스마트런에 오신 것을 환영합니다</h1>
      <p className="text-lg text-slate-600 mb-12 max-w-2xl mx-auto">당신을 위한 맞춤형 학습 도우미입니다. 아래 옵션 중 하나를 선택하여 시작하세요.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card className="hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-bold mb-4">새로운 퀴즈</h2>
          <p className="text-slate-600 mb-6">카테고리와 문제 수를 선택하여 새로운 퀴즈 세션을 시작하세요.</p>
          <Button onClick={() => navigate('setup')} className="w-full">퀴즈 시작</Button>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-bold mb-4">플래시카드 학습</h2>
          <p className="text-slate-600 mb-6">단답형 문제로 빠르고 효과적인 암기를 진행하세요.</p>
          <Button onClick={() => navigate('flashcard-setup')} className="w-full">암기 시작</Button>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-bold mb-4">오답 복습</h2>
          <p className="text-slate-600 mb-6">틀렸던 문제들을 다시 풀어보며 학습 내용을 강화하세요.</p>
          <Button onClick={() => navigate('incorrect')} variant="secondary" className="w-full">오답 다시 풀기</Button>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-bold mb-4">콘텐츠 관리</h2>
          <p className="text-slate-600 mb-6">질문과 카테고리를 추가, 수정하거나 대량으로 업로드하세요.</p>
          <Button onClick={() => navigate('manage')} variant="secondary" className="w-full">질문 관리하기</Button>
        </Card>
      </div>
    </div>
  );
};

export default Home;