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

        if (!newBill) return NextResponse.json({ success: false, message: messages.apiMessages.billIsEmpty }, { status: 404 });
        const result = await db.collection('bills').insertOne(dataWithId);
        const resultTotalCash = await db.collection('totalCash').updateOne(
            { isTotal: true },
            { $inc: { totalCash: newBill?.details?.total || 0 } } // Increment totalCash by newBill's totalPrice
        );


        return NextResponse.json({ success: true, message: messages.apiMessages.successAdd });
    } catch (error) {
        return NextResponse.json({ success: false, message: messages.apiMessages.error }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const acceptLanguage = req.headers.get('accept-language') || 'en';
    const language = acceptLanguage?.split(',')?.[0]?.split('-')?.[0];

    const messages = await import(`../../../../../messages/${language}.json`).catch(() =>
        import('../../../../../messages/en.json')
    );

    const { billsIDs } = await req.json();

    try {
        const client = await clientPromise;
        const db = client.db('menu');

        if (!billsIDs?.length) {
            return NextResponse.json(
                { success: false, message: messages.apiMessages.errorDeleteId },
                { status: 400 }
            );
        }

        const deletionPromises = billsIDs.map(async (id: any) => {
            const result: any = await db.collection('bills').findOneAndDelete({ _id: new ObjectId(id) });
            if (!result.value) {
                return {
                    success: false,
                    message: messages.apiMessages.errorDeleteNotFound,
                    id: result,
                };
            }
            return { success: true };
        });

        const results = await Promise.allSettled(deletionPromises);

        return NextResponse.json({ success: true, message: messages.apiMessages.successDelete,results:results });
    } catch (error) {
        console.error('Error deleting items:', error);
        return NextResponse.json({ success: false, message: messages.apiMessages.error }, { status: 500 });
    }
}

