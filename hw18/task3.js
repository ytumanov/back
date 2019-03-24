use ytumanov
db.customersLast.dropIndex('name.first_text_name.last_text_nickname_text_email_text');
db.customersLast.dropIndex('nickname_text');


db.customersLast.createIndex({ 'name.first': 'text', 'name.last': 'text', nickname: 'text', email: 'text' })

db.customersLast.find( { $text: { $search: 'cartman__1553452216003 Shevchenko -Yaroslav -Vitaliy -Igor' } })

db.customersLast.getIndexes()