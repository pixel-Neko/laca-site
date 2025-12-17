const express = require("express");
const path = require("path");

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    return res.status(200).render("home");
})  

const PORT = 3000
app.listen(PORT, () => console.log(`Server started on - http://localhost:${PORT}`));