export async function POST(request: Request) {
    const res = await request.json()
    
    return Response.json({ res })
}

export async function GET() {

    return Response.json({ "aboba": 'boba' })
}