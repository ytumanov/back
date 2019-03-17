use ytumanov
db.customers.drop()
db.orders.drop()

db.createCollection('customers')
db.createCollection('orders')
const availableNames = ['Vitaliy', 'Andrey', 'Yaroslav', 'Igor']
const availableSurnames = ['Tumanov', 'Romanov', 'Kapkanov', 'Shevchenko']
const availableProducts = ['Car', 'Plane', 'Window', 'Door']


  for (let i = 0; i < 3000; i++) {

    const { insertedId } = db.customers.insertOne({
    name: {
            first: availableNames[Math.floor(Math.random() * availableNames.length)],
            last:  availableSurnames[Math.floor(Math.random() * availableSurnames.length)]
        },
        balance: 15000,
        created: new Date().toString()
    })

    print(i)
    const ordersCount = Math.floor(Math.random() * (10 - 1) + 1)

    for (let j = 0; j < ordersCount; j++) {
      const doc = {
        customerId: insertedId.valueOf(),
        count: 2,
        price: Math.floor(Math.random() * (100 - 20) + 20),
        discount: Math.floor(Math.random() * (30 - 5) + 5),
        title: `some title ${Math.floor(Math.random() * (3000 - 1) + 1)}`,
        product: availableProducts[Math.floor(Math.random() * availableProducts.length)]
      }

      db.orders.bulkWrite( [
        { insertOne : { "document" : doc } }
      ] )
    }

}
print('----------------------------------------------------------------------------')
print('customers total documents is', db.customers.count())
print('orders total documents is', db.orders.count())
print('----------------------------------------------------------------------------')
print('customers collection size is ', db.customers.dataSize())
print('customers orders size is ', db.orders.dataSize())
print('all collections size is ', db.orders.dataSize() + db.customers.dataSize())
