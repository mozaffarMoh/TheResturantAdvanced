import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';


export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('menu');
    const menuItems = await db.collection('menu').find({}).toArray();
    return NextResponse.json({ success: true, data: menuItems });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Database connection error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {

  try {
    const client = await clientPromise;
    const db = client.db('menu');
    const newItem = await req.json();
    const { type, data } = newItem;
    const dataWithId = { ...data, _id: new ObjectId() };
    const result = await db.collection('menu').updateOne(
      { 'type': type }, // Match the object with the given type
      {
        $push: { 'data': dataWithId } // Push new data to the data array of the matched object
      },
      { upsert: true } // If type doesn't exist, create a new object
    );

    return NextResponse.json({ success: true, message: 'Item has been added successfuly' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to add item' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { itemId, type } = await req.json();

  try {
    const client = await clientPromise;
    const db = client.db('menu');

    if (!itemId) {
      return NextResponse.json({ success: false, message: 'Item is not eixt' }, { status: 400 });
    }

    const result: any = await db.collection('menu').updateOne(
      { type: type }, // Find the document with the specified item in the data array
      { $pull: { data: { _id: new ObjectId(itemId) } } as any }, // Remove the matching object from the data array
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({
        success: false,
        message: 'Item not found or already deleted',
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
  try {
    const client = await clientPromise;
    const db = client.db('menu');
    const newItem = await req.json();
    const { type, data } = newItem;

    // Prepare the update object
    const updateFields: any = {};
    if (data.name) updateFields['data.$.name'] = data.name;
    if (data.price) updateFields['data.$.price'] = data.price;
    if (data.image) updateFields['data.$.image'] = data.image;

    const result = await db.collection('menu').updateOne(
      { type: type, 'data._id': new ObjectId(data._id) }, // Match the object with the given type and specific item ID
      {
        $set: updateFields // Update only the fields present in updateFields
      }
    );

    return NextResponse.json({ success: true, message: 'Update type success' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to update item' }, { status: 500 });
  }
}
