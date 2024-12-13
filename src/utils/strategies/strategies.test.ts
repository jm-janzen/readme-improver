import { getStrategy, execStrategy } from './strategies'


jest.mock('@octokit/core', () => ({
    Octokit: jest.fn().mockImplementation((params: any) => {
        if (params.auth == 'TOKEN_BAD') {
            throw new Error('Bad credentials - https://docs.github.com/rest')
        }

        return {
            request: jest.fn().mockImplementation((uri: any) => {
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
}))

describe('utils/strategies', () => {
    it('fail to get strategy (unsupported resource/host)', () => {
        expect(() => getStrategy('https://goosehub.honk/waddle/honk'))
            .toThrow(Error("Unsupported git resource 'goosehub.honk'"))
    })
    it('fail to get strategy (unsupported protocol)', () => {
        expect(() => getStrategy('git@github.com:honk/honk'))
            .toThrow(Error("Unsupported git protocol 'ssh'"))
    })
    it('successfully get strategy', () => {
        const strategy = getStrategy('https://github.com/jm-goose/quack-private')
        expect(strategy.name).toEqual('githubStrategy')
    })
    it('github fail: could not find repo or readme', async () => {
        // expect().toThrow won't watch this, unforunately
        try {
            const githubStrategy = getStrategy('https://github.com/jm-goose/quack-private')
            await execStrategy(githubStrategy, {
                url: 'https://github.com/GOOSE/HONK',
                token: 'TOKEN_GOOD',
                path: 'README.md',
            })
        } catch (e: any) {
            expect(e.message).toEqual('Failed to get readme data for GOOSE/HONK')
        }
    })
    it('github success: quack the readme', async () => {
        const githubStrategy = getStrategy('https://github.com/GOOSE/QUACK')
        const result = await execStrategy(githubStrategy, {
            url: 'https://github.com/DUCK/QUACK',
            token: 'TOKEN_GOOD',
            path: 'README.md',
        })
        expect(result).toEqual({
            repo: 'QUACK',
            path: 'README.md',
            content: "I may have gone overboard with the ducks lol\nquack\n",
        })
    })

    it.todo('github fail: could not modify readme') // Rare
    it.todo('github fail: readme sha has changed between requests') // Rare
})