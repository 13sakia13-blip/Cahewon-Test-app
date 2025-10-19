
import React from 'react';
import Button from './ui/Button';

interface HeaderProps {
  navigate: (view: string) => void;
}

const Header: React.FC<HeaderProps> = ({ navigate }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <nav className="container mx-auto px-4 md:px-8 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('home')}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.494m-9-5.747h18" />
          </svg>
          <span className="text-2xl font-bold text-primary-600">스마트런</span>
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
