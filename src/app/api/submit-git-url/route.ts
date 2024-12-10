import { NextRequest, NextResponse as res } from 'next/server';

export async function POST(req: NextRequest) {
    const data = await req.json()

    // TODO Actually fetch repo and do something

    return res.json({
        gitUrl: data.gitUrl,
        success: true,
        repo: {},
    })
}