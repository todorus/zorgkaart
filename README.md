#zorgkaart

tests can be run with "npm test"

##db config

a config file for your database is required for the test environment. For example

**nodejscomponent/lib/config/db.json**
```javascript
{
  "test": {
    "dialect": "postgres",
    "host": "localhost",
    "port": "5432",

    "username" : "openkaart",
    "password" : "secret",
    "database" : "openkaart_test",

    "pool": {
      "min": 0,
      "max": 5,
      "idle": 10000
    },

    "logging": false
  }
}
```