import type { NextRequest } from 'next/server'
import { getStrategy, execStrategy } from '@/utils/strategies'

/**
 *
 * @param req Request with body satisfying {@link GithubData}
 * @param req.url URL to git repository used to determine approach
 * @returns
 */
export async function POST(req: NextRequest | Request): Promise<Response> {
    const data = await req.json()

    const strategy = getStrategy(data.url)

    await execStrategy(strategy, data)

    return Response.json({ success: true })
}
