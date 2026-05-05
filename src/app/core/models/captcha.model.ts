export type CaptchaType = 'image-select' | 'math' | 'text' | 'single-choice';

export interface CaptchaOption {
  id: string;
  label: string;
  description?: string;
  symbol?: string;
}

export interface CaptchaChallenge {
  id: string;
  type: CaptchaType;
  title: string;
  prompt: string;
  hint: string;
  answer: string | number | string[];
  options?: CaptchaOption[];
}
