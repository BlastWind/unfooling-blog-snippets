// Note that failiure of these tests are indicated by the test suite failing to complete
// If the expect statement expects a .rejects.toThrow, you can use promise's .catch to catch
// If the expect statement expects a .toThrow, you can use try/catch to catch

describe("Catch throw", () => {
	const ERROR = new Error("NOOO!");
	const asyncThrower = async () => {
		throw ERROR;
	};
	const thrower = () => {
		throw ERROR;
	};
	test("in async func by using await + try/catch", () => {
		expect(async () => {
			// Note that though it is a bad practice, there is no need to return "await asyncThrower" since async/await functions,
			// without the return keyword, automatically returns a Promise<void>
			// This Promise<void> is in fact a rejected Promise that .rejects.toThrow catches
			// With the return keyword, we can see better that the outer async/await function returns a Promise<never>
			await asyncThrower();
		}).rejects.toThrow(ERROR); // Use .rejects.toThrow to anticipate Promise rejects in jest
	});
	test("in async func by using .catch", () => {
		expect(() => {
			return asyncThrower();
		}).rejects.toThrow(ERROR);
	});
	test("in normal func by using try/catch", () => {
		expect(() => {
			thrower();
		}).toThrow(ERROR); // Use .toThrow to anticipate normal throws in jest
	});
	test("in asyncified normal func with .catch", () => {
		const promiseWrappedThrower = () =>
			new Promise((resolve, reject) => {
				try {
					resolve(thrower());
				} catch (e) {
					reject(e);
				}
			});
		expect(() => {
			return promiseWrappedThrower();
		}).rejects.toThrow(ERROR);
	});
	test("in a purposefully ostentatious exam with async/await", () => {
		// No need to try/catch since the error thrown will propagate upwards as Promise reject
		const promiseWrappedThrower = async () => thrower();
		expect(() => {
			return promiseWrappedThrower();
		}).rejects.toThrow(ERROR);
	});
});
