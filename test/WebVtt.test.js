import '@meisterplayer/meister-mock';
import WebVtt from '../src/js/WebVtt';

const PLUGIN_NAME = 'WebVtt';

describe('WebVtt class', () => {
    test(`pluginName should be ${PLUGIN_NAME}`, () => {
        expect(WebVtt.pluginName).toBe(PLUGIN_NAME);
    });

    test('pluginVersion should return a version string', () => {
        // Version should match the SemVer pattern (e.g. 2.11.9)
        expect(WebVtt.pluginVersion).toMatch(/\d+\.\d+\.\d+/);
    });
});

describe('The rest of the test suite', () => {
    test('It should be written', () => {
        const test = { testsWritten: false };

        expect(test).toEqual({ testsWritten: true });
    });
});
