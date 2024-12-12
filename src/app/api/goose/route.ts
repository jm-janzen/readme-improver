import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    //const data = await req.json()
    const data = req.body

    return NextResponse.json({
        honked: true,
        data,
    })
}
