import type { NextRequest } from 'next/server'
import { getStrategy, execStrategy } from '@/utils/strategies'

export async function POST(req: NextRequest) {
    const data = await req.json()

    const strategy = getStrategy(data.url)

    await execStrategy(strategy, data)

    return Response.json({ success: true })
}