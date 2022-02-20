export interface Lesson {
  name: string;
  count: number;
  repeat: boolean;
  exercises: Exercise[];
  items: { [key: string]: number };
}

export interface Exercise {
  name: string;
  confidence: number;
  tempo: number;
  time: string;
  youtubeId?: string;
}