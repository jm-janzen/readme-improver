import { POST } from './route'

const mockRequest = (method: string, body: object): Request => {
    const params: RequestInit = {
        headers: {
            'Content-Type': 'application/json',
        },
        method: method,
        body: JSON.stringify(body)
    }

    // Positional URL parameter is required
    // but we don't actually need it
    return new Request('', params)
}

describe('/api/quack', () => {
    it('should fail on bad token', async () => {
        const req = mockRequest('POST', {
            url: 'https://github.com:jm-duck/quack-public',
            token: 'github_pat_XYZ',
        })

        try {
            // @ts-ignore Request has everything we need
            await POST(req)
        } catch (e: any) {
            expect(e.message).toBe('Bad credentials - https://docs.github.com/rest')
        }

    })

    it.todo('should fail on bad url')
    it.todo('should fail on unsupported git provider')
})
