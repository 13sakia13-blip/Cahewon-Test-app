import React, { useState, useCallback } from 'react';
import { HashRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Home from './components/Home';
import QuizSetup from './components/QuizSetup';
import QuizView from './components/QuizView';
import QuizResults from './components/QuizResults';
import IncorrectNotes from './components/IncorrectNotes';
import ManageContent from './components/ManageContent';
import Header from './components/Header';
import FlashcardSetup from './components/FlashcardSetup';
import FlashcardView from './components/FlashcardView';
import TodaySummary from './components/TodaySummary';
import { QuizResult, Question } from './types';

// Mock react-router-dom functionality for hash-based navigation
const AppContent: React.FC = () => {
    const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
    const [flashcardQuestions, setFlashcardQuestions] = useState<Question[]>([]);
    const [quizResults, setQuizResults] = useState<QuizResult | null>(null);

    const navigateTo = (newView: string) => {
        window.location.hash = newView;
    };

    const handleStartQuiz = (questions: Question[]) => {
        setQuizQuestions(questions);
        navigateTo('quiz');
    };

    const handleStartFlashcards = (questions: Question[]) => {
        setFlashcardQuestions(questions);
        navigateTo('flashcards');
    };

    const handleQuizFinish = (results: QuizResult) => {
        setQuizResults(results);
        navigateTo('results');
    };

    const renderView = () => {
        const hash = window.location.hash.replace('#', '') || 'home';

        switch (hash) {
            case 'home':
                return <Home navigate={navigateTo} />;
            case 'setup':
                return <QuizSetup onStartQuiz={handleStartQuiz} />;
            case 'flashcard-setup':
                return <FlashcardSetup onStart={handleStartFlashcards} />;
            case 'quiz':
                return <QuizView questions={quizQuestions} onQuizFinish={handleQuizFinish} />;
            case 'flashcards':
                return <FlashcardView questions={flashcardQuestions} navigate={navigateTo} />;
            case 'results':
                return <QuizResults results={quizResults} navigate={navigateTo} />;
            case 'incorrect':
                return <IncorrectNotes onStartQuiz={handleStartQuiz} />;
            case 'manage':
                return <ManageContent />;
            case 'summary':
                return <TodaySummary navigate={navigateTo} />;
            default:
                return <Home navigate={navigateTo} />;
        }
    };
    
    const [currentView, setCurrentView] = useState(window.location.hash.replace('#', '') || 'home');

    React.useEffect(() => {
        const handleHashChange = () => {
            setCurrentView(window.location.hash.replace('#', '') || 'home');
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);


    return (
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen text-slate-800">
            <Header navigate={navigateTo} />
            <main className="container mx-auto p-4 md:p-8">
                {renderView()}
            </main>
        </div>
    );
};


const App: React.FC = () => (
    // Although we're not using Routes, HashRouter is needed to manage history and listen to hash changes.
    // The actual view rendering is handled by our custom logic in AppContent.
    <HashRouter>
        <AppContent />
    </HashRouter>
);

export default App;