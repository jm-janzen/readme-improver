import GitUrlParse from 'git-url-parse'


type Strategy = (op: string, url: string) => {
    success: boolean,
    message: string,
    result: object,
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

export const execStrategy = (strategy: Strategy, op: 'clone', url: string) => {
    return strategy(op, url)
}

const githubStrategy: Strategy = (data) => {
    const result = {
        repo: {
            name: 'todo',
            localPath: 'todo',
        }
    }

    return {
        success: true,
        message: `ran github strategy on ${data}`,
        result,
    }
}

const repoStrategies: { [key: string]: Strategy } = {
    'github.com': githubStrategy,
}