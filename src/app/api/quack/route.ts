import { NextRequest, NextResponse as res } from 'next/server'
import { getStrategy, execStrategy } from '@/utils/strategies'

export async function POST(req: NextRequest) {
    const data = await req.json()

    const strategy = getStrategy(data.url)

    await execStrategy(strategy, data)

    return res.json({ success: true })
}