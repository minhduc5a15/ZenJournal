import { JWTPayload } from 'jose';

export enum Mood {
  Happy = 'happy',
  Sad = 'sad',
  Neutral = 'neutral',
  Anxious = 'anxious',
  Excited = 'excited',
}

export enum Visibility {
  Private = 'private',
  Draft = 'draft',
  Public = 'public',
}

export interface User {
  _id: string;
  email: string;
  name?: string;
}

export interface Entry {
  _id: string;
  userId: string;
  title: string;
  content: string;
  tags: string[];
  mood: Mood;
  visibility: Visibility;
  pinned: boolean;
  createdAt: string; // ISO Date string
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface FilterState {
  search: string;
  tag: string | null;
  mood: Mood | null;
  startDate: string | null;
  endDate: string | null;
}

export interface JWTUserPayload extends JWTPayload {
  sub: string;
  email: string;
  name?: string;
}