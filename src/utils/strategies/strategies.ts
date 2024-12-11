import GitUrlParse from 'git-url-parse'
import { Octokit } from '@octokit/core'


type Operations = 'clone' | 'modify' | 'push'
type GithubData = {
    url: string,
    token: string,
    path: string,
}
type Strategy = (op: string, data: GithubData) => {
}

/**
 * @throws Error if unable to find strategy for given gitUrl
 * @param gitUrl url to git resource
 * @returns string used as key by execStrategy fn
 */
export const getStrategy = (gitUrl: string) => {
    const parsedUrl = GitUrlParse(gitUrl)
    const strategy = repoStrategies[parsedUrl.resource]
    if (!strategy) {
        throw new Error(`Unsupported git resource '${parsedUrl.resource}'`)
    }

    return strategy
}

export const execStrategy = (strategy: Strategy, op: Operations, data: GithubData) => {
    return strategy(op, data)
}

const githubStrategy: Strategy = (op, data) => {
    return githubPull(data)
}

const githubPull = async (data: { url: string, token: string }) => {
    const headers = { 'X-GitHub-Api-Version': '2022-11-28' }
    const octokit = new Octokit({ auth: data.token })
    const { owner, name: repo } = GitUrlParse(data.gitUrl)

    const { path, sha, content: ogContent } = (await octokit.request(`GET /repos/${owner}/${repo}/readme`)).data
    console.log({ path, sha, content: ogContent })

    const content = btoa(atob(ogContent) + '\nquack\n')

    const pushResp = await octokit.request(`PUT /repos/${owner}/${repo}/contents/${path}`, {
        headers,
        content,
        owner,
        repo,
        path,
        sha,
        message: 'docs: added missing quack',
        committer: {
            name: 'Duck',
            email: 'jmjanzen@duck.com',
        },
    })

    return { repo, path, content: atob(content) }
}

const repoStrategies: { [key: string]: Strategy } = {
    'github.com': githubStrategy,
}