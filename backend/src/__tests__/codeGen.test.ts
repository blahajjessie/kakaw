import { fin } from '../code';

const used = ['0', '1'];
// const allTaken = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

test('Fin Test', async () => {
	fin('1', used);
	expect(used).toStrictEqual(['0']);
});

// Test when all possible codes are taken
// test('Duplicate Code', async () => {
//    const result = gen(1, allTaken);
//    expect(result).toStrictEqual(-1);
// });
