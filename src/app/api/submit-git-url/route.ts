import { NextRequest, NextResponse as res } from 'next/server';
import GitUrlParse from 'git-url-parse'

export async function POST(req: NextRequest) {
    const data = await req.json()

    // TODO Actually fetch repo and do something
    const parsedUrl = GitUrlParse(data.gitUrl)
    const strategy = repoStrategies[parsedUrl.resource]
    if (!strategy) {
        throw new Error(`Unsupported git resource '${parsedUrl.resource}'`)
    }

    const result = execStrategy(strategy, 'pull', data.gitUrl)
    console.debug(result)

    return res.json({
        gitUrl: data.gitUrl,
        gitUrlParsed: parsedUrl,
        success: true,
        repo: {},
    })
}

type Strategy = (op: string, url: string) => {
    success: boolean,
    message: string,
    result: object,
}

const githubStrategy: Strategy = (data) => {
    const result = {}

    return {
        success: true,
        message: `ran github strategy on ${data}`,
        result,
    }
}

const repoStrategies: { [key: string]: Strategy } = {
    'github.com': githubStrategy,
}

const execStrategy = (strategy: Strategy, op: string, url: string) => {
    return strategy(op, url)
}