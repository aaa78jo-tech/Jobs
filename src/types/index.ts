export interface PracticalProblem {
  id: string;
  question: string;
  keywords: string[];
  answer: string;
}

export interface DailyTask {
  id: string;
  title: string;
  description: string;
}

export interface Profession {
  id: string;
  name: string;
  icon: string;
  category: string;
  shortDescription: string;
  overview: string;
  requiredSkills: string[];
  dailyTasks: DailyTask[];
  problems: PracticalProblem[];
  isFeatured?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  professionId?: string;
}
