import { Octokit } from '@octokit/core'

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

export const validateToken = async (data: { token: string }): Promise<boolean> => {
    const headers = { 'X-GitHub-Api-Version': '2022-11-28' }
    const octokit = new Octokit({ auth: data.token })

    const resp = await octokit.request(`GET /octocat`, { headers })

    return resp.status == 200
}
