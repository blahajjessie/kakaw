export interface QuizMeta {
    title: string;
    author: string;
    pointDefault: number;
    timeDefault: number;
}

export interface QuizQuestion {
    questionText: string;
    answerTexts: string[];
    correctAnswers: number[];
    time?: number;
    points?: number;
    explanations?: string[];
}
