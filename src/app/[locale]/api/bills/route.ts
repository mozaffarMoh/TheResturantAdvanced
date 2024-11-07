import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';


export async function GET(req: NextRequest) {
    try {
        const client = await clientPromise;
        const db = client.db('menu');
        const bills = await db.collection('bills').find({}).toArray();
        return NextResponse.json({ success: true, data: bills });
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
        const newBill = await req.json();
        const dataWithId = { ...newBill, _id: new ObjectId() };

        const result = await db.collection('bills').insertOne(dataWithId);
        const resultTotalCash = await db.collection('totalCash').updateOne(
            { isTotal: true },
            { $inc: { totalCash: newBill?.details?.total ||0 } } // Increment totalCash by newBill's totalPrice
        );


        return NextResponse.json({ success: true, message: messages.apiMessages.successAdd });
    } catch (error) {
        return NextResponse.json({ success: false, message: messages.apiMessages.error }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const acceptLanguage = req.headers.get('accept-language') || 'en';
    const language = acceptLanguage?.split(',')?.[0]?.split('-')?.[0];

    const messages = await import(`../../../../../messages/${language}.json`).catch(() => import('../../../../../messages/en.json'));

    const { itemId } = await req.json();
    let objId = new ObjectId(itemId)

    try {
        const client = await clientPromise;
        const db = client.db('menu');

        if (!objId) {
            return NextResponse.json({ success: false, message: messages.apiMessages.errorDeleteId }, { status: 400 });
        }

        const result: any = await db.collection('bills').findOneAndDelete(
            { _id: objId },
        );

        if (result.modifiedCount === 0) {
            return NextResponse.json({
                success: false,
                message: messages.apiMessages.errorDeleteNotFound,
            }, { status: 404 }
            );
        }

        return NextResponse.json({ success: true, message: messages.apiMessages.successDelete });
    } catch (error) {
        console.error('Error deleting item:', error);
        return NextResponse.json({ success: false, message: messages.apiMessages.error }, { status: 500 });
    }
}
