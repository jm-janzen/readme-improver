/**
 * Exports a basic mock which is automatically used by jest
 * This mock is designed to:
 *  1. Fail if instantiated with a bad token
 *  2.
 *
 * 'Good' and 'bad' parameters are determined by the magic strings
 * defined within this mock (the word 'BAD' or references to geese)
 */
export const Octokit = jest.fn().mockImplementation((params: any) => {
    if (params.auth == 'TOKEN_BAD') {
        throw new Error('Bad credentials - https://docs.github.com/rest')
    }

    return {
        request: jest.fn().mockImplementation((uri: any) => {
            // For validating token
            if (uri == 'GET /octocat') {
                return { status: 200 }
            }
            // For pulling down readme details
            if (uri == 'GET /repos/DUCK/QUACK/readme') {
                return {
                    data: {
                        path: 'README.md',
                        sha: 'good_sha',
                        content: 'SSBtYXkgaGF2ZSBnb25lIG92ZXJib' +
                            '2FyZCB3aXRoIHRoZSBkdWNrcyBsb2w='
                    },
                }
            } else if (uri == 'GET /repos/GOOSE/HONK/readme') {
                throw new Error('Failed to get readme data for GOOSE/HONK')
            }

            // For pushing updated readme back up
            if (uri == 'PUT /repos/DUCK/QUACK/contents/README.md') {
                return { success: 200 }
            }

            throw new Error('Oops! This uri has not been mocked: ' + uri)
        })
    }
})