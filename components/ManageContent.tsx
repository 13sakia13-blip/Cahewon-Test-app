import React, { useState, useEffect, useCallback } from 'react';
import { Question, QuestionType, Category } from '../types';
import { getAllQuestions, deleteQuestion, updateQuestion, uploadQuestionImage, bulkInsertQuestions, findOrCreateCategory, getCategories, addQuestion } from '../services/api';
import Button from './ui/Button';
import Spinner from './ui/Spinner';
import Modal from './ui/Modal';

// Edit Question Modal
const EditQuestionModal: React.FC<{ question: Question; onClose: () => void; onSave: () => void; categories: Category[] }> = ({ question, onClose, onSave, categories }) => {
    const [formData, setFormData] = useState({
        ...question,
        options: question.options?.join(', ') || ''
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSave = async () => {
        const { options, ...rest } = formData;
        let updatedData: Partial<Question> = rest;

        if (formData.type === QuestionType.MultipleChoice) {
            updatedData.options = options.split(',').map(s => s.trim()).filter(Boolean);
        } else {
            updatedData.options = [];
        }

        if (imageFile) {
            setIsUploading(true);
            try {
                const imageUrl = await uploadQuestionImage(imageFile);
                updatedData.image_url = imageUrl;
            } catch (error) {
                console.error("Image upload failed:", error);
                alert("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
                setIsUploading(false);
                return;
            }
            setIsUploading(false);
        }
        await updateQuestion(question.id, updatedData);
        onSave();
        onClose();
    };

    return (
        <Modal isOpen={true} onClose={onClose} title="질문 수정">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">질문 내용</label>
                    <textarea name="question_text" value={formData.question_text} onChange={handleChange} className="w-full p-2 border rounded" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">카테고리</label>
                     <select name="category_id" value={formData.category_id} onChange={handleChange} className="w-full p-2 border rounded">
                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                </div>
                {formData.type === QuestionType.MultipleChoice && (
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">오답 선택지 (쉼표로 구분)</label>
                        <input
                            type="text"
                            name="options"
                            placeholder="예: 오답1, 오답2, 오답3"
                            value={formData.options}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                )}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">정답</label>
                    <input type="text" name="correct_answer" value={formData.correct_answer} onChange={handleChange} className="w-full p-2 border rounded" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">이미지</label>
                    <input type="file" onChange={handleFileChange} accept="image/*" className="w-full text-sm"/>
                    {formData.image_url && !imageFile && <img src={formData.image_url} alt="current" className="mt-2 h-24 w-auto"/>}
                </div>
                <Button onClick={handleSave} disabled={isUploading}>{isUploading ? '업로드 중...' : '변경사항 저장'}</Button>
            </div>
        </Modal>
    );
};

// Add Question Modal
const AddQuestionModal: React.FC<{ onClose: () => void; onSave: () => void; categories: Category[] }> = ({ onClose, onSave, categories }) => {
    const [formData, setFormData] = useState({
        question_text: '',
        category_name: '',
        type: QuestionType.MultipleChoice,
        correct_answer: '',
        options: '',
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSave = async () => {
        if (!formData.question_text || !formData.correct_answer || !formData.category_name) {
            alert('질문 내용, 정답, 카테고리는 필수 항목입니다.');
            return;
        }

        setIsSaving(true);
        try {
            const categoryId = await findOrCreateCategory(formData.category_name.trim());
            
            let finalImageUrl: string | null = null;
            if (imageFile) {
                finalImageUrl = await uploadQuestionImage(imageFile);
            }

            const questionToInsert: Omit<Question, 'id' | 'created_at'> = {
                category_id: categoryId,
                type: formData.type as QuestionType,
                question_text: formData.question_text.trim(),
                correct_answer: formData.correct_answer.trim(),
                options: formData.type === QuestionType.MultipleChoice 
                    ? formData.options.split(',').map(s => s.trim()).filter(Boolean)
                    : [],
                image_url: finalImageUrl,
            };
            
            await addQuestion(questionToInsert);
            onSave();
            onClose();
        } catch(error) {
            console.error("Failed to add question:", error);
            alert("문제 추가에 실패했습니다. 다시 시도해주세요.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Modal isOpen={true} onClose={onClose} title="새 문제 추가">
             <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">카테고리</label>
                    <input
                        type="text"
                        name="category_name"
                        value={formData.category_name}
                        onChange={handleChange}
                        list="category-list"
                        className="w-full p-2 border rounded"
                        placeholder="기존 카테고리를 선택하거나 새 이름을 입력하세요"
                        required
                    />
                    <datalist id="category-list">
                        {categories.map(cat => <option key={cat.id} value={cat.name} />)}
                    </datalist>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">문제 유형</label>
                     <select name="type" value={formData.type} onChange={handleChange} className="w-full p-2 border rounded">
                        <option value={QuestionType.MultipleChoice}>객관식</option>
                        <option value={QuestionType.ShortAnswer}>단답형</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">질문 내용</label>
                    <textarea name="question_text" value={formData.question_text} onChange={handleChange} className="w-full p-2 border rounded" required />
                </div>
                {formData.type === QuestionType.MultipleChoice && (
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">오답 선택지 (쉼표로 구분)</label>
                         <input
                            type="text"
                            name="options"
                            placeholder="예: 오답1, 오답2, 오답3"
                            value={formData.options}
                            onChange={handleChange}
                            className="w-full p-2 border rounded mt-2"
                        />
                    </div>
                )}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">정답</label>
                    <input type="text" name="correct_answer" value={formData.correct_answer} onChange={handleChange} className="w-full p-2 border rounded" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">이미지 (선택 사항)</label>
                    <input type="file" onChange={handleFileChange} accept="image/*" className="w-full text-sm"/>
                </div>
                <Button onClick={handleSave} disabled={isSaving}>{isSaving ? '저장 중...' : '문제 저장'}</Button>
            </div>
        </Modal>
    );
};


// Bulk Upload Modal
const BulkUploadModal: React.FC<{ onClose: () => void; onUpload: () => void; }> = ({ onClose, onUpload }) => {
    const [csvData, setCsvData] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    const sampleCSV = `category_name,type,question_text,correct_answer,options\nScience,multiple_choice,"What is the chemical symbol for water?","H2O","O2,CO2,H2,NaCl"\nHistory,short_answer,"In what year did the Titanic sink?","1912",`;

    const handleUpload = async () => {
        setIsUploading(true);
        const rows = csvData.trim().split('\n').slice(1); // Skip header
        try {
            const questionsToInsert: Omit<Question, 'id' | 'created_at'>[] = [];
            for (const row of rows) {
                // Warning: This is a naive CSV parser and will not handle commas within quoted fields correctly.
                const [categoryName, type, questionText, correctAnswer, optionsStr] = row.split(',').map(item => item.trim().replace(/"/g, ''));
                if (!categoryName || !type || !questionText || !correctAnswer) continue;
                
                const categoryId = await findOrCreateCategory(categoryName);
                
                const question: Omit<Question, 'id' | 'created_at'> = {
                    category_id: categoryId,
                    type: type as QuestionType,
                    question_text: questionText,
                    correct_answer: correctAnswer,
                    options: type === 'multiple_choice' && optionsStr ? optionsStr.split(';').map(s => s.trim()).filter(Boolean) : undefined,
                };
                questionsToInsert.push(question);
            }
            if(questionsToInsert.length > 0) {
                await bulkInsertQuestions(questionsToInsert);
            }
            alert('업로드 성공!');
            onUpload();
            onClose();
        } catch (error) {
            console.error("Bulk upload failed:", error);
            alert("대량 업로드에 실패했습니다. 데이터 형식을 확인하고 다시 시도해주세요.");
        } finally {
            setIsUploading(false);
        }
    };
    
    return (
        <Modal isOpen={true} onClose={onClose} title="질문 대량 업로드">
            <div className="space-y-4">
                <p>아래에 CSV 형식으로 데이터를 붙여넣으세요. 첫 줄은 반드시 헤더여야 합니다.</p>
                <p className="font-mono text-sm bg-slate-100 p-2 rounded">category_name,type,question_text,correct_answer,options</p>
                <p className="text-xs text-slate-500">참고: `type`은 `short_answer` 또는 `multiple_choice`여야 합니다. 객관식 문제의 경우, `options` 열에 오답들을 세미콜론(;)으로 구분하여 입력하세요. `short_answer`의 경우 `options` 열을 비워두세요.</p>
                <a href={`data:text/csv;charset=utf-8,${encodeURIComponent(sampleCSV)}`} download="sample.csv" className="text-primary-600 hover:underline">샘플 CSV 다운로드</a>
                <textarea value={csvData} onChange={(e) => setCsvData(e.target.value)} rows={10} className="w-full p-2 border rounded font-mono text-sm" placeholder="이곳에 CSV 데이터를 붙여넣으세요..."></textarea>
                <Button onClick={handleUpload} disabled={isUploading}>{isUploading ? '업로드 중...' : '업로드'}</Button>
            </div>
        </Modal>
    );
};


// Main Component
const ManageContent: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
        const [qData, cData] = await Promise.all([getAllQuestions(), getCategories()]);
        setQuestions(qData);
        setCategories(cData);
    } catch (error) {
        console.error("Failed to fetch data:", error);
    } finally {
        setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleDelete = async (id: string) => {
    if (window.confirm('이 질문을 정말 삭제하시겠습니까?')) {
      await deleteQuestion(id);
      fetchAllData();
    }
  };

  const translateQuestionType = (type: QuestionType) => {
      switch(type) {
          case QuestionType.ShortAnswer: return '단답형';
          case QuestionType.MultipleChoice: return '객관식';
          default: return type;
      }
  }

  if (loading) return <Spinner />;

  const categoryMap = new Map(categories.map(c => [c.id, c.name]));

  return (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">콘텐츠 관리</h1>
            <div className="flex items-center space-x-2">
                <Button onClick={() => setIsAddModalOpen(true)}>새 문제 추가</Button>
                <Button onClick={() => setIsBulkUploadOpen(true)} variant="secondary">대량 업로드</Button>
            </div>
        </div>
      
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">질문</th>
                        <th scope="col" className="px-6 py-3">카테고리</th>
                        <th scope="col" className="px-6 py-3">유형</th>
                        <th scope="col" className="px-6 py-3">작업</th>
                    </tr>
                </thead>
                <tbody>
                    {questions.map(q => (
                        <tr key={q.id} className="bg-white border-b hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-900 w-1/2">{q.question_text}</td>
                            <td className="px-6 py-4">{categoryMap.get(q.category_id) ?? 'N/A'}</td>
                            <td className="px-6 py-4">{translateQuestionType(q.type)}</td>
                            <td className="px-6 py-4 flex space-x-2">
                                <Button variant="ghost" onClick={() => setEditingQuestion(q)}>수정</Button>
                                <Button variant="danger" onClick={() => handleDelete(q.id)}>삭제</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {editingQuestion && <EditQuestionModal question={editingQuestion} onClose={() => setEditingQuestion(null)} onSave={fetchAllData} categories={categories} />}
        {isAddModalOpen && <AddQuestionModal onClose={() => setIsAddModalOpen(false)} onSave={fetchAllData} categories={categories} />}
        {isBulkUploadOpen && <BulkUploadModal onClose={() => setIsBulkUploadOpen(false)} onUpload={fetchAllData} />}
    </div>
  );
};

export default ManageContent;