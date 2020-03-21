const express = require('express');
const hbs = require('express-handlebars');
const app = express();
const path = require('path');
const port = 3000;

// Serve static files
app.use(express.static('public'));

// Setup handlebars
app.set('view engine', 'hbs'); // Set template 
app.set('views', path.join(__dirname, '/src/views'));  // Set views path
app.engine('hbs', hbs({ // HBS Config
  extname: 'hbs',
  defaultView: 'default',
  layoutsDir: __dirname + '/src/views/layouts/',
  partialsDir: __dirname + '/src/views/partials/',
}));

// Route Handlers
app.get('/', (req, res) => {
  res.sendFile('../public/landing.html')
});


app.listen(port, () => console.log(`Listening to ${port}`));

