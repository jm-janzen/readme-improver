import { validateToken } from "./validate-token"

jest.mock('@octokit/core', () => ({
    Octokit: jest.fn().mockImplementation((params: any) => {
        if (params.auth == 'TOKEN_BAD') {
            throw new Error('Bad credentials - https://docs.github.com/rest')
        }

        return {
            request: jest.fn().mockReturnValue({ status: 200 })
        }
    })
}))

describe('validate-token', () => {
    it('should fail on bad token', async () => {
        try {
            await validateToken({ token: 'TOKEN_BAD' })
        } catch (e: any) {
            expect(e.message).toBe('Bad credentials - https://docs.github.com/rest')
        }
    })

    it('should return success response', async () => {

        const success = await validateToken({ token: 'TOKEN_GOOD' })
        expect(success).toBe(true)
    })
})