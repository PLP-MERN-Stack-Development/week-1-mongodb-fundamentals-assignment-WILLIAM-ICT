import { MongoClient } from 'mongodb';

const uri = 'your_mongodb_connection_string';
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db('booksDB');
    const collection = db.collection('books');

    // 1. Create
    await collection.insertOne({ title: 'New Book', author: 'Jane Doe', price: 19.99 });

    // 2. Read - find books by author
    const booksByAuthor = await collection.find({ author: 'Jane Doe' }).toArray();
    console.log('Books by Jane Doe:', booksByAuthor);

    // 3. Update - increase price by 10%
    await collection.updateMany({}, { $mul: { price: 1.10 } });

    // 4. Delete - remove books priced below $10
    await collection.deleteMany({ price: { $lt: 10 } });

    // 5. Advanced query - find books, only return title and price, sorted by price desc
    const books = await collection.find({}, { projection: { title: 1, price: 1 } }).sort({ price: -1 }).toArray();
    console.log('Books sorted by price:', books);

    // 6. Aggregation - average price by author
    const avgPriceByAuthor = await collection.aggregate([
      { $group: { _id: "$author", avgPrice: { $avg: "$price" } } }
    ]).toArray();
    console.log('Average price by author:', avgPriceByAuthor);

    // 7. Create Index
    await collection.createIndex({ author: 1 });
    
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
