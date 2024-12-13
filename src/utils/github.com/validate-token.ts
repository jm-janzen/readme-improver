import { Octokit } from '@octokit/core'


/**
 * Note that this does nothing to check whether the token is
 * valid for any specific operations (like pulling or pushing changes to READMEs).
 *
 * @param data.token Checks that token can access GitHub
 * @returns boolean
 */
export const validateToken = async (data: { token: string }): Promise<boolean> => {
    const headers = { 'X-GitHub-Api-Version': '2022-11-28' }
    const octokit = new Octokit({ auth: data.token })

    const resp = await octokit.request(`GET /octocat`, { headers })

    return resp.status == 200
}
