const express = require('express')
const path = require('path')
const expHbs = require('express-handlebars')
const mongoose = require('mongoose')
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const session = require('express-session')
//Routes
const courses = require('./routes/courses')
const home = require('./routes/home')
const add = require('./routes/add')
const card = require('./routes/card')
const orders = require('./routes/orders')
const auth = require('./routes/auth')
//model
const User = require('./models/user')


const app = express()

const hbs = expHbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(async (req, res, next) => {
    try {
        req.user = await User.findById('5ffc648a23577b0300bffcc1')
        next()
    } catch (e) {
        console.error(e)
    }
})

app.use(session({

}))

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))

app.use('/courses', courses)
app.use('/', home)
app.use('/add', add)
app.use('/card', card)
app.use('/orders', orders)
app.use('/auth', auth)

const PORT = process.env.PORT || 3000
const password = 'AcSHuk6NagJSTfow'

async function start() {
    try {
        const url = `mongodb+srv://ashot:${password}@cluster1.ucmvu.mongodb.net/test`
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
        const candidate = await User.findOne()
        if (!candidate) {
            const user = new User({
                email: 'ash1999_2011@mail.ru',
                name: 'Ashot',
                bag: {items: []}
            })
            await user.save()
        }
        app.listen(PORT, () => {
            console.log(`server is running on Port ${PORT} `)
        })
    } catch (e) {
        console.error(e)
    }
}

start().catch()


