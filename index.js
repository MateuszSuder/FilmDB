import express from 'express'
import 'dotenv/config'
import home from './routes/home.js'
import login from './routes/login.js'
import register from './routes/register.js'
import movie from './routes/movie.js'

const app = express()

app.set('view engine', 'ejs')

app.use(express.json()) // Used to parse JSON bodies
app.use(express.urlencoded({ extended: true })) // Parse URL-encoded bodies using qs library

app.use('/public', express.static('public'))
app.use('/src/js', express.static('src/js'))

app.use('/', home)
app.use('/login', login)
app.use('/register', register)
app.use('/movie', movie)

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`)
})
