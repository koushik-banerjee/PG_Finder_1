const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});

let db;
async function connectToDb(){
    try{
        await client.connect();
        db = client.db('data3');
        console.log('Connected to MongoDB');
        
    }
    catch(err){
        console.error(err);
    }
}
connectToDb();

app.use(bodyParser.urlencoded({extended: true}));


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/login.html');
  });

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/register.html');
  });



app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    

    console.log('Received login request:', { username, password });

    try {
        // Query the database for the provided username and password
        const user = await db.collection('userData').findOne({ Username: username, Password: password });
        console.log(user);
        if (user) {
            // Authentication successful
            console.log('Login successful for user:', username);
            res.redirect('/index.html'); // Redirect to home page after successful login
        } else {
            // Authentication failed
            console.log('Invalid credentials for user:', username);
            res.send('Invalid credentials');
        }
    } catch (err) {
        console.error('Error during login:', err);
        res.send('Error during login');
    }
});

app.post('/register', async(req, res) => {
    const {email,username,password} = req.body;
    console.log("received",{username,password,email})
    try{
        const result = await db.collection('userData').insertOne({Username:username,Password:password,Email:email});
        // ,{w:'majority'}
        console.log('User Inserted',result);
        res.redirect('http://localhost:3025/');
    }
    catch(err){
        console.error('Error during signup!',err);
        res.send('Error during signup!');
    }
});

app.use(express.static(__dirname));


const PORT = process.env.PORT || 3025;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

