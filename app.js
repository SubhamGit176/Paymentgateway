const express = require('express')

const bodyParser = require('body-parser')

const path = require('path')

const app = express()


const publish_key = "_publish_key_"


const secret_key = "_secret_key_"


const stripe = require('stripe')(secret_key)

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.set('view engine', 'ejs')

const port = process.env.PORT || 5000

app.get('/', (req, res) => {
    res.render('home', {
        key: publish_key
    })
})

app.post('/payment', (req, res) => {
    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken,
        name: 'Rajesh Kumar',
        address: {
            line1: 'Hn 5, Park Street',
            postal_code: '158822',
            city: 'Kolkata',
            country: 'India'
        }
    })

    .then((customer) => {
        return stripe.charges.create({
            amount: 5000,
            description: 'Consultation Service Prime Membership',
            currency: 'INR',
            customer: customer.id
        });
    })

    .then((charge) => {
        res.send('Payment Success....')
    })
    .catch((err) => {
        res.send(err)
    });
})

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})