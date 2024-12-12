import { createMocks } from 'node-mocks-http'
import { POST } from './route'

describe('/api/goose', () => {
  test('should honk', async () => {
    const { req } = createMocks({
      method: 'POST',
      body: ({ goose: 'honk' })
    })

    const response = await POST(req)

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ data: { goose: 'honk' }, honked: true })
  })
})