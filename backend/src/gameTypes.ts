// Type definitions for [~THE LIBRARY NAME~] [~OPTIONAL VERSION NUMBER~]
// Project: [Kakaw]
// Definitions by: [Jess Srinivas] <[~A URL FOR YOU~]>
/*~ This is the module template file for class modules.
 *~ You should rename it to index.d.ts and place it in a folder with the same name as the module.
 *~ For example, if you were writing a file for "super-greeter", this
 *~ file should be 'super-greeter/index.d.ts'
 */
// Note that ES6 modules cannot directly export class objects.
// This file should be imported using the CommonJS-style:
//   import x = require('[~THE MODULE~]');
//
// Alternatively, if --allowSyntheticDefaultImports or
// --esModuleInterop is turned on, this file can also be
// imported as a default import:
//   import x from '[~THE MODULE~]';
//
// Refer to the TypeScript documentation at
// https://www.typescriptlang.org/docs/handbook/modules.html#export--and-import--require
// to understand common workarounds for this limitation of ES6 modules.
/*~ If this module is a UMD module that exposes a global variable 'myClassLib' when
 *~ loaded outside a module loader environment, declare that global here.
 *~ Otherwise, delete this declaration.
 */
// export as namespace "game";
/*~ This declaration specifies that the class constructor function
 *~ is the exported object from the file
 */
export = Game;

/*~ If you want to expose types from your module as well, you can
 *~ place them in this block.
 *~
 *~ Note that if you decide to include this namespace, the module can be
 *~ incorrectly imported as a namespace object, unless
 *~ --esModuleInterop is turned on:
 *~   import * as x from '[~THE MODULE~]'; // WRONG! DO NOT DO THIS!
 */

// // for clarity, a gameID is just a string
type UserId = string;
// // used ids for both players and host
type GameId = string;

interface User {
	name: string;
}

// // define a quiz and question type
interface QuizQuestion {
	questionText: string;
	answerTexts: string[];
	correctAnswers: number[];
	note?: string;
	time?: number;
	points?: number;
}

interface Quiz {
	meta: {
		title: string;
		author: string;
		pointDefault: number;
		timeDefault: number;
		note?: string;
	};
	questions: QuizQuestion[];
}

class answerObj {
	Map()<UserId,new Array()<{ time=-1; answer: number; correct: boolean; score: number }>>;
}
export class Game {
	hostId: UserId;
	quizData: Quiz;
	users = new Map<UserId, User>();
	userAnswers = new Map<UserId, answerObj>();
	quizOpen = false;
	activeQuestion = -1;

	constructor(hostId: UserId, quiz:Quiz) {
		this.hostId = hostId;
		this.quizData = quiz;
	}
}

// // interface for user, mostly blank rn but will keep score or smth later.
// // Userid is stored in the map for now
