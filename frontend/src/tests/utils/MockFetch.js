
// Mocking fetch for testing purposes
// This utility function mocks the global fetch API for testing purposes.
export const mockFetch = (response = {}, success = true) => {
    global.fetch = vitest.fn(() =>
        Promise.resolve({
            ok: success,
            json: () => Promise.resolve(response),
        })
    );
};

export const restoreFetch = () => {
    global.fetch.mockRestore();
};