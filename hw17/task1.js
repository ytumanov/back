use ytumanov

const cursor = db.customers.find({}, { name: true })
const result = []

while (cursor.hasNext()) {
  const { _id, name: { first, last } } = cursor.next();

  const cursorByCustomerId = db.orders.find({ 'customerId': _id.valueOf() })
  const orders = []
  while (cursorByCustomerId.hasNext()) {
    const { _id, count, price, discount, product } = cursorByCustomerId.next()

    orders.push({
        _id : _id.valueOf(),
        count : count,
        price : price,
        discount : discount,
        product : product,
    })
  }
  result.push({
    fName: first,
    lName: last,
    orders: orders
  })
}

print(tojson(result))