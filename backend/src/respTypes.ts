import { GameId } from "./game";
import { UserId } from "./user";

export abstract class socketData {
    name!: string;
    data!: responseData;
}

export type responseData = string | BeginResp | EndResp | ActionResp;


export class closeConnection implements socketData {
    name = "end";
    data: string;
    constructor(data: string) {
        this.data = data;
    };
};


export class EndData implements socketData {
    name = "endQuestion";
    data: EndResp;
    constructor(data: EndResp) {
        this.data = data;
    };
};

export class BeginData implements socketData {
    name = "beginQuestion";
    data: BeginResp;
    constructor(data: BeginResp) {
        this.data = data;
    };

}


export class ActionData implements socketData {
    name = "playerAction";
    data: ActionResp;
    constructor(data: ActionResp) {
        this.data = data;
    };

}

// HTTP responses:

export type newGameResp = {
    gameId: GameId;
    hostId: UserId
}



// export type createResp = {
//     id: number
//     index: number
// }

// Socket data fields: 

export type BeginResp = {
    question: string, // question.questionText,
    answers: string[], // question.answerTexts,
    time: number, // game.timer.endTimestamp - Date.now(),
    index: number // game.activeQuestion,
};


export type EndResp = {
    correctAnswers: Array<number>;
    score: number;
    scoreChange: number;
    correct: boolean;
    leaderboard: LeaderBoard[];
    time: number;
};



export type ActionResp = {
    player: {id:UserId, username:string}
}

export type LeaderBoard = {
    name: string;
    score: number;
    correctAnswers: number[];
}