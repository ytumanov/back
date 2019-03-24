use ytumanov
db.customersLast.dropIndex('email_1');
print('-----------------------1Start---------------------------')
db.customersLast.createIndex({ email: 1 })
db.customersLast.getIndexes()
db.customersLast.find({ email: 'mail_8@gmail.com' })
print('-----------------------1END---------------------------')

print('-----------------------2Start---------------------------')
db.customersLast.dropIndex('name.first_1');
db.customersLast.dropIndex('name.last_1');

db.customersLast.createIndex({ 'name.first': 1 })
db.customersLast.createIndex({ 'name.last': 1 })
db.customersLast.find({ 'name.first': 'Yaroslav', 'name.last': 'Kapkanov' })

db.customersLast.getIndexes()
print('-----------------------2End---------------------------')

print('-----------------------3Start---------------------------')
db.customersLast.find({}).sort({ email: 1, created: -1 })
print('-----------------------3End---------------------------')