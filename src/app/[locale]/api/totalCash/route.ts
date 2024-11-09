import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';


export async function GET(req: NextRequest) {
    try {
        const client = await clientPromise;
        const db = client.db('menu');
        const totalCash = await db.collection('totalCash').find({}).toArray();
        return NextResponse.json({ success: true, data: totalCash?.[0]});
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Database connection error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const acceptLanguage = req.headers.get('accept-language') || 'en';
    const language = acceptLanguage?.split(',')?.[0]?.split('-')?.[0];

    const messages = await import(`../../../../../messages/${language}.json`).catch(() => import('../../../../../messages/en.json'));

    try {
        const client = await clientPromise;
        const db = client.db('menu');

        const resultTotalCash = await db.collection('totalCash').updateOne(
            { isTotal: true },
            { $set: { totalCash: 0, billCount: 1 } }
        );


        return NextResponse.json({ success: true, message: messages.apiMessages.successClearCash });
    } catch (error) {
        return NextResponse.json({ success: false, message: messages.apiMessages.error }, { status: 500 });
    }
}
