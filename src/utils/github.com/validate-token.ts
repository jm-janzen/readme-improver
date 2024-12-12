import { Octokit } from '@octokit/core'


export const validateToken = async (data: { token: string }) => {
    const headers = { 'X-GitHub-Api-Version': '2022-11-28' }
    const octokit = new Octokit({ auth: data.token })

    const resp = await octokit.request(`GET /octocat`, { headers })

    return resp
}
