import GitUrlParse from 'git-url-parse'
import { Octokit } from '@octokit/core'


type GithubData = {
    url: string,
    token: string,
    path: string,
}
type Strategy = (data: GithubData) => {}

export const supportedSources = [ 'github.com' ]
export const supportedProtocols = [ 'https' ]

/**
 * @throws Error if unable to find strategy for given gitUrl
 * @param url to git resource
 * @returns string used as key by execStrategy fn
 */
export const getStrategy = (url: string) => {
    const parsedUrl = GitUrlParse(url)
    const strategy = repoStrategies[parsedUrl.resource]
    if (!strategy) {
        throw new Error(`Unsupported git resource '${parsedUrl.resource}'`)
    }

    return strategy
}

export const execStrategy = (strategy: Strategy, data: GithubData) => {
    return strategy(data)
}

const githubStrategy: Strategy = (data) => {
    return githubUsingToken(data)
}

const githubUsingToken = async (data: { url: string, token: string }) => {
    const headers = { 'X-GitHub-Api-Version': '2022-11-28' }
    const octokit = new Octokit({ auth: data.token })
    const { owner, name: repo } = GitUrlParse(data.url)

    const { path, sha, content: ogContent } = (await octokit.request(`GET /repos/${owner}/${repo}/readme`)).data
    console.log({ path, sha, content: ogContent })

    const content = btoa(atob(ogContent) + '\nquack\n')

    await octokit.request(`PUT /repos/${owner}/${repo}/contents/${path}`, {
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