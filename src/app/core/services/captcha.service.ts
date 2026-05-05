import { Injectable } from '@angular/core';
import { CaptchaChallenge } from '../models/captcha.model';

const CHALLENGE_COUNT = 4;

@Injectable({ providedIn: 'root' })
export class CaptchaService {
  private readonly challenges: CaptchaChallenge[] = [
    {
      id: 'image-cats',
      type: 'image-select',
      title: 'Pattern Check',
      prompt: 'Select every tile that represents a cat.',
      hint: 'There may be more than one correct tile.',
      answer: ['cat-sphinx', 'cat-tabby', 'cat-moon'],
      options: [
        { id: 'cat-sphinx', label: 'Sphinx cat', symbol: '𓃠' },
        { id: 'dog-alert', label: 'Alert dog', symbol: '𓃡' },
        { id: 'cat-tabby', label: 'Tabby cat', symbol: '😺' },
        { id: 'fox-curl', label: 'Curled fox', symbol: '🦊' },
        { id: 'owl-night', label: 'Night owl', symbol: '🦉' },
        { id: 'cat-moon', label: 'Moon cat', symbol: '🐈' },
      ],
    },
    {
      id: 'image-leaves',
      type: 'image-select',
      title: 'Visual Filter',
      prompt: 'Select every tile that shows a leaf or plant.',
      hint: 'Ignore objects that are not living plants.',
      answer: ['leaf-green', 'sprout', 'herb'],
      options: [
        { id: 'leaf-green', label: 'Green leaf', symbol: '🍃' },
        { id: 'stone', label: 'Stone', symbol: '◆' },
        { id: 'sprout', label: 'Sprout', symbol: '🌱' },
        { id: 'drop', label: 'Water drop', symbol: '💧' },
        { id: 'herb', label: 'Herb', symbol: '🌿' },
        { id: 'spark', label: 'Spark', symbol: '✦' },
      ],
    },
    {
      id: 'math-signal',
      type: 'math',
      title: 'Signal Sum',
      prompt: 'What is 9 + 6 - 4?',
      hint: 'Enter digits only.',
      answer: 11,
    },
    {
      id: 'math-grid',
      type: 'math',
      title: 'Grid Count',
      prompt: 'A grid has 3 rows and 5 columns. How many cells are there?',
      hint: 'Multiply rows by columns.',
      answer: 15,
    },
    {
      id: 'text-checkpoint',
      type: 'text',
      title: 'Text Lock',
      prompt: 'Type the verification code: ANGUL7',
      hint: 'The code is case-sensitive.',
      answer: 'ANGUL7',
    },
    {
      id: 'text-orbit',
      type: 'text',
      title: 'Sequence Echo',
      prompt: 'Type the verification code: ORBIT42',
      hint: 'Use uppercase letters and digits exactly as shown.',
      answer: 'ORBIT42',
    },
    {
      id: 'logic-outlier',
      type: 'single-choice',
      title: 'Outlier Scan',
      prompt: 'Which item does not belong with the others?',
      hint: 'Three are directions.',
      answer: 'violet',
      options: [
        { id: 'north', label: 'North' },
        { id: 'east', label: 'East' },
        { id: 'violet', label: 'Violet' },
        { id: 'south', label: 'South' },
      ],
    },
    {
      id: 'logic-cycle',
      type: 'single-choice',
      title: 'Sequence Check',
      prompt: 'Choose the next value: 2, 4, 8, 16, ...',
      hint: 'Each value doubles.',
      answer: '32',
      options: [
        { id: '18', label: '18' },
        { id: '24', label: '24' },
        { id: '32', label: '32' },
        { id: '64', label: '64' },
      ],
    },
  ];

  createChallengeIds(): string[] {
    const grouped = new Map<CaptchaChallenge['type'], CaptchaChallenge[]>();

    for (const challenge of this.challenges) {
      grouped.set(challenge.type, [...(grouped.get(challenge.type) ?? []), challenge]);
    }

    const ids = Array.from(grouped.values()).map((group) => this.pickOne(group).id);
    return this.shuffle(ids).slice(0, CHALLENGE_COUNT);
  }

  getChallenges(ids: string[]): CaptchaChallenge[] {
    return ids.map((id) => this.getChallenge(id)).filter((challenge): challenge is CaptchaChallenge => Boolean(challenge));
  }

  getChallenge(id: string): CaptchaChallenge | undefined {
    return this.challenges.find((challenge) => challenge.id === id);
  }

  validateAnswer(challenge: CaptchaChallenge, answer: unknown): boolean {
    if (Array.isArray(challenge.answer)) {
      if (!Array.isArray(answer)) {
        return false;
      }

      const expected = [...challenge.answer].sort();
      const actual = [...answer].map(String).sort();
      return expected.length === actual.length && expected.every((value, index) => value === actual[index]);
    }

    if (typeof challenge.answer === 'number') {
      return Number(answer) === challenge.answer;
    }

    return String(answer) === challenge.answer;
  }

  private pickOne<T>(items: T[]): T {
    return items[Math.floor(Math.random() * items.length)];
  }

  private shuffle<T>(items: T[]): T[] {
    return [...items].sort(() => Math.random() - 0.5);
  }
}
