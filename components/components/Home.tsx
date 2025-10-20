import React from 'react';
import Card from './ui/Card';
import Button from './ui/Button';

interface HomeProps {
  navigate: (view: string) => void;
}

const MenuCard: React.FC<{ icon: React.ReactNode, title: string, description: string, buttonText: string, onClick: () => void, variant?: 'primary' | 'secondary' }> = 
({ icon, title, description, buttonText, onClick, variant = 'primary' }) => (
    <Card className="hover:shadow-2xl hover:-translate-y-2 flex flex-col text-center items-center">
        <div className="mb-4 text-primary-500">{icon}</div>
        <h2 className="text-2xl font-bold mb-3 text-slate-900">{title}</h2>
        <p className="text-slate-600 mb-6 flex-grow">{description}</p>
        <Button onClick={onClick} variant={variant} className="w-full mt-auto">{buttonText}</Button>
    </Card>
);


const Home: React.FC<HomeProps> = ({ navigate }) => {
  const menuItems = [
    { 
        icon: <PencilIcon />, 
        title: "새로운 퀴즈", 
        description: "카테고리를 선택하여 새로운 퀴즈 세션을 시작하세요.", 
        buttonText: "퀴즈 시작",
        onClick: () => navigate('setup'),
    },
    { 
        icon: <CardsIcon />, 
        title: "플래시카드 학습", 
        description: "단답형 문제로 빠르고 효과적인 암기를 진행하세요.", 
        buttonText: "암기 시작",
        onClick: () => navigate('flashcard-setup'),
    },
    { 
        icon: <RedoIcon />, 
        title: "오답 복습", 
        description: "틀렸던 문제들을 다시 풀어보며 학습 내용을 강화하세요.", 
        buttonText: "오답 다시 풀기",
        onClick: () => navigate('incorrect'),
        variant: 'secondary' as const,
    },
    { 
        icon: <ChartIcon />, 
        title: "오늘의 학습 현황", 
        description: "오늘 학습한 내용과 성과를 확인하고 동기를 부여받으세요.", 
        buttonText: "결과 보러가기",
        onClick: () => navigate('summary'),
        variant: 'secondary' as const,
    },
  ];

  return (
    <div className="text-center">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-slate-900 animate-fade-in">
        스마트런에 오신 것을 환영합니다
      </h1>
      <p className="text-lg text-slate-600 mb-12 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
        당신을 위한 맞춤형 학습 도우미입니다. 아래 옵션 중 하나를 선택하여 시작하세요.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {menuItems.map((item, index) => (
             <div key={item.title} className="animate-fade-in" style={{ animationDelay: `${0.4 + index * 0.1}s` }}>
                <MenuCard {...item} />
             </div>
        ))}
      </div>
      <div className="mt-8 animate-fade-in" style={{ animationDelay: '1s' }}>
        <Card className="hover:shadow-2xl hover:-translate-y-2 max-w-7xl mx-auto">
            <div className="md:flex md:items-center md:justify-between text-center md:text-left">
                <div>
                    <h2 className="text-2xl font-bold mb-2 text-slate-900">콘텐츠 관리</h2>
                    <p className="text-slate-600 mb-4 md:mb-0">질문과 카테고리를 추가, 수정하거나 대량으로 업로드하세요.</p>
                </div>
                <Button onClick={() => navigate('manage')} variant="secondary" className="w-full md:w-auto flex-shrink-0">
                    질문 관리하기
                </Button>
            </div>
        </Card>
      </div>
    </div>
  );
};

// SVG Icons
const PencilIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L16.732 3.732z" /></svg>;
const CardsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>;
const RedoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>;
const ChartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;

export default Home;