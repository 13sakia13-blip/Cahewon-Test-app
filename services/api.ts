import { supabase } from './supabase';
import { Category, Question, QuestionType } from '../types';

export const DUMMY_USER_ID = '00000000-0000-0000-0000-000000000000';

export const getCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase.from('categories').select('*').order('name');
  if (error) throw error;
  return data || [];
};

export const getQuestions = async (categoryId: string, limit: number): Promise<Question[]> => {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('category_id', categoryId)
    .limit(limit);
  if (error) throw error;
  return data || [];
};

export const getShortAnswerQuestions = async (categoryId: string, limit: number): Promise<Question[]> => {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('category_id', categoryId)
    .eq('type', QuestionType.ShortAnswer)
    .limit(limit);
  if (error) throw error;
  return data || [];
};

export const getAllQuestions = async (): Promise<Question[]> => {
    const { data, error } = await supabase.from('questions').select('*').order('created_at', { ascending: false });
    if (error) {
        console.error("Error fetching questions:", error);
        throw error;
    }
    return data || [];
}


export const getIncorrectlyAnsweredQuestions = async (): Promise<Question[]> => {
    const { data: logData, error: logError } = await supabase
        .from('learning_log')
        .select('question_id')
        .eq('user_id', DUMMY_USER_ID)
        .eq('is_correct', false);

    if (logError) throw logError;
    if (!logData || logData.length === 0) return [];

    const questionIds = logData.map(log => log.question_id);

    const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .in('id', questionIds);

    if (questionsError) throw questionsError;
    return questionsData || [];
};

export const saveQuizResult = async (questionId: string, isCorrect: boolean): Promise<void> => {
    const { error } = await supabase.from('learning_log').upsert(
        {
            user_id: DUMMY_USER_ID,
            question_id: questionId,
            is_correct: isCorrect,
        },
        { onConflict: 'user_id,question_id' }
    );
    if (error) throw error;
};

export const deleteQuestion = async (id: string) => {
    const { error } = await supabase.from('questions').delete().eq('id', id);
    if (error) throw error;
};

export const updateQuestion = async (id: string, updates: Partial<Question>) => {
    const { data, error } = await supabase.from('questions').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
};

export const addQuestion = async (question: Omit<Question, 'id' | 'created_at'>) => {
    const { data, error } = await supabase.from('questions').insert([question]).select().single();
    if (error) throw error;
    return data;
};


export const uploadQuestionImage = async (file: File): Promise<string> => {
    // Encode the filename to handle special characters (like Korean) which can cause "Invalid key" errors.
    const safeFileName = encodeURIComponent(file.name);
    const fileName = `${Date.now()}-${safeFileName}`;
    
    const { error: uploadError } = await supabase.storage.from('question-images').upload(fileName, file);
    if (uploadError) {
        throw uploadError;
    }
    
    const { data } = supabase.storage.from('question-images').getPublicUrl(fileName);
    return data.publicUrl;
};

export const bulkInsertQuestions = async (questions: Omit<Question, 'id' | 'created_at'>[]) => {
    const { error } = await supabase.from('questions').insert(questions);
    if (error) throw error;
}

export const findOrCreateCategory = async (name: string): Promise<string> => {
    let { data: existingCategory, error: selectError } = await supabase
        .from('categories')
        .select('id')
        .eq('name', name)
        .single();
    
    if (selectError && selectError.code !== 'PGRST116') { // PGRST116: no rows found
        throw selectError;
    }

    if (existingCategory) {
        return existingCategory.id;
    }

    const { data: newCategory, error: insertError } = await supabase
        .from('categories')
        .insert({ name })
        .select('id')
        .single();
    
    if (insertError) throw insertError;

    return newCategory!.id;
}