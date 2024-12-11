import { NextRequest, NextResponse as res } from 'next/server';
import { getStrategy, execStrategy } from '../../../utils/strategies/strategies' // FIXME make nicer import path

export async function POST(req: NextRequest) {
    const data = await req.json()

    const strategy = getStrategy(data.gitUrl)
    const result = await execStrategy(strategy, 'clone', data)

    return res.json({
        success: true,
        result,
    })
}