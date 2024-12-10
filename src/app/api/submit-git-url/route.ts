import { NextRequest, NextResponse as res } from 'next/server';
import { getStrategy, execStrategy } from '../../../utils/strategies/strategies' // FIXME make nicer import path

export async function POST(req: NextRequest) {
    const data = await req.json()
    const url = data.gitUrl

    const strategy = getStrategy(url)
    const result = execStrategy(strategy, 'clone', url)

    return res.json({
        success: true,
        result,
        url,
    })
}