import prismadb from '@/lib/prismadb';
import {NextResponse} from 'next/server'


export async function POST(
    req: Request
) {
    try {
        const body = await req.json();
        const { rest, run, speed } = body;

        console.log(rest, run ,speed)
    
    
        if (!rest || !run || !speed) {
          return new NextResponse("Workout prompts are required", { status: 400 });
        }

        const getData = await prismadb.workout.findMany()

        const response = await prismadb.workout.create({
            data: {
                workout_name: `Workout ${getData.length + 1}`,
                running: Number(run),
                rest: Number(rest),
                speed: Number(speed)
            }
        })

        return NextResponse.json(response)

    } catch (error) {
        console.log("[WORKOUT_ERROR]", error)
        return new NextResponse("Internal error", {status: 500})
    }
}

export async function GET() {

    try {

        const response = await prismadb.workout.findMany()

        return NextResponse.json(response)
        
        
    } catch (error) {
        console.log("[STRIPE_ERROR]", error)
        return new NextResponse("Internal error", {status:500})
    }
    
}