import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('menu');
    const menuItems = await db.collection('menu').find({}).toArray();
    let types = menuItems.map((item) => {
      return { type: item.type, id: item._id }
    })
    return NextResponse.json({ success: true, data: types });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Database connection error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('menu');
    const newItem = await req.json();
    const { newType } = newItem;
    const dataWithId = { type: newType, data: [], _id: new ObjectId() };
    const result = await db.collection('menu').insertOne(
      dataWithId
    );

    return NextResponse.json({ success: true, message: 'Type has been added successfuly' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to add item' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { itemId } = await req.json();
  let objId = new ObjectId(itemId)


  try {
    const client = await clientPromise;
    const db = client.db('menu');

    if (!objId) {
      return NextResponse.json({ success: false, message: 'Id is not exist' }, { status: 400 });
    }

    const result: any = await db.collection('menu').findOneAndDelete(
      { _id: objId }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({
        success: false,
        error: 'Item not found or already deleted',
      }, { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete item' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const newItem = await req.json();
  const { updatedType, itemId } = newItem;
  try {
    const client = await clientPromise;
    const db = client.db('menu');

    const result: any = await db.collection('menu').findOneAndUpdate(
      { _id: new ObjectId(itemId) },
      { $set: { type: updatedType } },
      { returnDocument: 'after' } // returns the updated document

    );

    return NextResponse.json({ success: true, message: 'Update type success' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to update item' }, { status: 500 });
  }
}