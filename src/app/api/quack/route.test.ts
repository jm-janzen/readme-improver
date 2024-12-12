import { createMocks } from 'node-mocks-http'
import { POST } from './route'

describe('/api/goose', () => {
    test('should honk', async () => {
        const { req } = createMocks({
          method: 'POST',
          body: ({ url: 'https://github.com:jm-duck/quack-public', token: 'github_pat_XYZ' })
        })

        const response = await POST(req)

        expect(response.status).toBe(200)
        expect(await response.json()).toEqual({ success: true })

        expect(true).toBe(true)
    })
})
