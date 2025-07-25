import { POST } from './route'

/**
 * This Request builder exists to pass NextRequest-like payloads
 * the endpoints to our api routes while using the fancy app router
 *
 * @param method the usual
 * @param body
 * @returns
 */
const mockRequest = (method: string, body: object): Request => {
    const params: RequestInit = {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        method,
    }

    // Positional URL parameter is required
    // but we don't actually need it
    return new Request('', params)
}

describe('/api/quack', () => {
    it('should fail on bad token', async () => {
        const req = mockRequest('POST', {
            url: 'https://github.com/jm-duck/quack-public',
            token: 'TOKEN_BAD',
        })

        try {
            await POST(req)
        } catch (e) {
            expect(e.message).toBe('Bad credentials - https://docs.github.com/rest')
        }

    })

    it('should succeed', async () => {
        // FIXME Find a more elegant way fix Next/Response
        // in the global jest environment
        Response.json = async () => Response

        const req = mockRequest('POST', {
            url: 'https://github.com/DUCK/QUACK',
            token: 'TOKEN_GOOD',
        })

        await POST(req)

    })

})
