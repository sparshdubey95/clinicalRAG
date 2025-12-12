
export interface PatientVitals {
  bp: string;
  heartRate: string;
  temperature: string;
  spo2: string;
}

export interface Finding {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  modalitySource: ('report' | 'image' | 'video')[];
  confidence: number;
}

export interface Annotation {
  label: string;
  description: string;
  box2d?: [number, number, number, number]; // [ymin, xmin, ymax, xmax] normalized 0-1000
}

export interface AnalysisResult {
  patientName: string;
  patientId: string;
  age: number;
  vitals: PatientVitals;
  riskLevel: 'low' | 'medium' | 'high';
  riskScore: number; // 0-100
  summary: string;
  findings: Finding[];
  annotations: Annotation[];
  recommendations: string[];
  historicalComparison?: {
    metric: string;
    previous: number;
    current: number;
    unit: string;
    trend: 'improving' | 'stable' | 'worsening';
  }[];
}

export interface FileAttachment {
  file?: File;
  name: string;
  type: 'report' | 'image' | 'video';
  previewUrl?: string;
  isDemo?: boolean;
}

// Medicine Ordering Types
export interface PharmacyPrice {
  name: string;
  price: number;
  url: string;
  isCheapest?: boolean;
}

export interface MedicineDetails {
  name: string;
  strength: string;
  quantity: string;
  prices: PharmacyPrice[];
  savings: number;
}

export interface SavedMedicine extends MedicineDetails {
  id: string;
  dateAdded: Date;
  isFavorite: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  type: 'text' | 'analysis';
  text?: string;
  
  // Rich Response Structure for "Layman" Mode
  simpleExplanation?: string;
  visualData?: AnalysisResult; // For graphs/charts
  medicineData?: MedicineDetails; // For medicine price comparison
  actionItems?: string[];
  technicalDetails?: string; // Collapsible
  
  attachments?: FileAttachment[];
  timestamp: Date;
  isThinking?: boolean;
}

export interface DemoScenario {
  id: string;
  title: string;
  description: string;
  icon: any; // Lucide icon component
  prompt: string;
  mockAttachment: FileAttachment;
  mockAnalysis: AnalysisResult;
  mockResponse: {
    simple: string;
    actions: string[];
    technical: string;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export enum AppState {
  LANDING = 'LANDING',
  DASHBOARD = 'DASHBOARD',
}

export type View = 'dashboard' | 'history' | 'medicines' | 'settings';

export interface ChatSession {
  id: string;
  title: string;
  date: Date;
  preview: string;
  messages: ChatMessage[];
}
