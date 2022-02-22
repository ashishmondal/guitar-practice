export interface Lesson {
  id: string;
  name: string;
  count: number;
  repeat: boolean;
  exercises: Exercise[];
}

export interface Exercise {
  id: string;
  name: string;
  confidence: number;
  tempo: number;
  time: string;
  youtubeId?: string;
}