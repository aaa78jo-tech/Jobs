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

export interface TopicNode {
  id: string;
  label: string;
  answer: string;
  children?: TopicNode[];
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
  topics?: TopicNode[];
  isFeatured?: boolean;
}

export interface ChatSuggestion {
  id: string;
  label: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  professionId?: string;
  suggestions?: ChatSuggestion[];
}
