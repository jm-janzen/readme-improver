import GitUrlParse from 'git-url-parse'
import { Octokit } from '@octokit/core'


export type GithubData = {
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
    if (!supportedProtocols.includes(parsedUrl.protocol)) {
        throw new Error(`Unsupported git protocol '${parsedUrl.protocol}'`)
    }

    return strategy
}

export const execStrategy = (strategy: Strategy, data: GithubData) => {
    return strategy(data)
}

const githubStrategy: Strategy = (data) => {
    return githubUsingToken(data)
}

/**
 * Pulls content of README file and push it back up with a 'quack' at the end
 *
 * Note that this has not been tested on very, very large README files, and is likely
 * to fail in this case due to memory limitations.
 *
 * @param data.url URL to the GitHub repo
 * @param data.token GitHub Personal Access Token with write permission to repo
 * @throws if token is not valid GitHub PAT token
 * @throws if cannot read or write to repo's README file
 * @returns object with repo, readme path, updated content
 */
const githubUsingToken = async (data: { url: string, token: string }): Promise<any> => {
    const headers = { 'X-GitHub-Api-Version': '2022-11-28' }
    const octokit = new Octokit({ auth: data.token })
    const { owner, name: repo } = GitUrlParse(data.url)

    try {
        // Hoist outside of our try
        var { path, sha, content: ogContent } = (await octokit.request(`GET /repos/${owner}/${repo}/readme`)).data
    } catch (_e: any) {
        throw new Error(`Failed to get readme data for ${owner}/${repo}`)
    }

    // FIXME To be extra friendly, we could check the encoding before concatenating
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