use ytumanov
db.customersLast.drop()

db.createCollection('customersLast')
const availableNames = ['Vitaliy', 'Andrey', 'Yaroslav', 'Igor']
const availableSurnames = ['Tumanov', 'Romanov', 'Kapkanov', 'Shevchenko']
const availableNickNames = ['jdoe_star', 'kenny', 'cartman', 'iron_man', 'post_man']

  const customers = [];
  for (let i = 0; i < 1000; i++) {

    const timestamp = new Date().getTime();
    customers.push({
    name: {
            first: availableNames[Math.floor(Math.random() * availableNames.length)],
            last:  availableSurnames[Math.floor(Math.random() * availableSurnames.length)]
        },
    nickname: `${availableNickNames[Math.floor(Math.random() * availableNickNames.length)]}__${timestamp}`,
    email: `mail_${Math.floor(Math.random() * 20)}@gmail.com`,
    password: `ab123456cd_${timestamp}`,
    created: new Date().toString()
    })
}

const cursor = db.customersLast.insert(customers)
print('----------------------------------------------------------------------------')
print('customers total documents is', db.customersLast.count())
