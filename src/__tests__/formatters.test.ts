import { cardNumberFormatter } from '../helpers/formatters';

describe('cardNumberFormatter', () => {
	test.each([
		{
			// pasting the number
			oldValue: '',
			newValue: '5555555555554444',
			output: '5555 5555 5555 4444',
		},
		{
			// trims extra characters
			oldValue: '',
			newValue: '55555555555544443333',
			output: '5555 5555 5555 4444',
		},
		{
			oldValue: '',
			newValue: '5555555555',
			output: '5555 5555 55',
		},
		{
			oldValue: '555',
			newValue: '5555',
			output: '5555 ',
		},
		{
			// deleting a character
			oldValue: '5555 5',
			newValue: '5555 ',
			output: '5555 ',
		},
		{
			oldValue: '',
			newValue: '5',
			output: '5',
		},
	])('%j', ({ oldValue, newValue, output }) => {
		expect(cardNumberFormatter(oldValue, newValue)).toEqual(output);
	});
});
