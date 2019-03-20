use ytumanov

function getPage(size, page) {
  const pages = Math.ceil(db.customers.countDocuments({}) / size);

  if (page > pages) {
    throw new Error('Not valid page provided')
  }

  const cursor = db.customers.find({}, { name: true })
  .limit(size)
  .skip((page - 1) * size)

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
}

//if size === 10, last valid page is 300
getPage(10, 1)