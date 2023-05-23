import { GameId } from "./game";
import { UserId } from "./user";

export abstract class ResponseData {
    name!: string;
    data!: responseData;
}

export type responseData = newGameResp | beginResp | endResp;

export class newGameData implements ResponseData {
    name = "endQuestion";
    data: newGameResp;
    constructor(data: newGameResp) {
        this.data = data;
    };
};

export class beginQuestionData implements ResponseData {
    name = "beginQuestion";
    data: beginResp;
    constructor(data: beginResp) {
        this.data = data;
    };

}

export interface newGameResp {
    gameId: GameId;
    hostId: UserId
}


export type beginResp = {
    question: string, // question.questionText,
    answers: string[], // question.answerTexts,
    time: number, // game.timer.endTimestamp - Date.now(),
    index: number // game.activeQuestion,
};


export type endResp = {
    correct: boolean;
    correctAnswers: Array<number>;
    score: number;
    scoreChange: number;
    time: number;
};

export type createResp = {
    id: number
    index: number
}