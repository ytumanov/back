use ytumanov

const cursor = db.customers.find({}, { name: true })
const result = []

while (cursor.hasNext()) {
  const { _id, name: { first, last } } = cursor.next();
  const customerOrders = db.orders.aggregate([
    { $match: { customerId: _id.valueOf() } },
    { $group : { _id : '$product', total: {$sum : '$count'} } }
  ]).toArray();

  result.push({
    fName: first,
    lName: last,
    orders: customerOrders
  })
}

print(tojson(result))