import { validateToken } from "./validate-token"


describe('validate-token', () => {
    it('should fail on bad token', async () => {
        try {
            await validateToken({ token: 'TOKEN_BAD' })
        } catch (e) {
            expect(e.message).toBe('Bad credentials - https://docs.github.com/rest')
        }
    })

    it('should return success response', async () => {

        const success = await validateToken({ token: 'TOKEN_GOOD' })
        expect(success).toBe(true)
    })
})
