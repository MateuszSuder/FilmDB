import express from 'express';
import 'dotenv/config';
import home from './routes/home.js'
import database from "./src/database/database.js";
const app = express();

app.set('view engine', 'ejs');
app.use('/public', express.static('public'));
app.use('/src/js', express.static('src/js'));
app.use('/', home);

app.listen(process.env.PORT, () => {
    console.log('xd');
})