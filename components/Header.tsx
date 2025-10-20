import React from 'react';
import Button from './ui/Button';

interface HeaderProps {
  navigate: (view: string) => void;
}

const Header: React.FC<HeaderProps> = ({ navigate }) => {
  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
      <nav className="container mx-auto px-4 md:px-8 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('home')}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 12l4.109 1.591a2.25 2.25 0 01.659 1.591v5.714m8.25-14.138v5.714a2.25 2.25 0 00.659 1.591L19 12l-4.109 1.591a2.25 2.25 0 00-.659 1.591v5.714" />
          </svg>
          <span className="text-2xl font-extrabold text-primary-600">스마트런</span>
        </div>
        <div className="flex items-center space-x-2">
           <Button variant="ghost" onClick={() => navigate('home')}>홈</Button>
           <Button variant="ghost" onClick={() => navigate('incorrect')}>오답 노트</Button>
           <Button variant="ghost" onClick={() => navigate('manage')}>콘텐츠 관리</Button>
        </div>
      </nav>
    </header>
  );
};

export default Header;