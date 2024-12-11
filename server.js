const PORT = 3000; 
var fs = require("fs")
var express = require('express')
var exphbs = require('express-handlebars')

var scoreData = require('./scores.json')
var app = express()
var port = process.env.PORT || 8000
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(express.json())
app.use(express.static('static'))

app.post('/wins/update', function (req, res, next) {
    if (req.body && req.body.name && req.body.wins) {
        scoreData.push({
            name: req.body.name,
            wins: req.body.wins,
        })

        fs.writeFile(
            __dirname + "/scores.json",
            JSON.stringify(scoreData, null, 2),
            function (err) {
                if (!err) {
                    res.status(200).send()
                
                } else {
                    res.status(500).send("Server error. Try again soon.")
                }
            }
        )
    } else {
        next()
    }
})

function getTopScores(data) {
    return data
        .sort((a, b) => b.wins - a.wins) // Sort scores in descending order
        .slice(0, 5); // Take the top 5 scores
}

app.get('/', function (req, res, next) {
    res.status(200).render('homepage',{
        allData: getTopScores(scoreData),
    })

  })
app.get('/leaderboard', (req, res,next) => {
    res.status(200).render('homepage',{
        allData: getTopScores(scoreData),
    })
    console.log(scoreData)
});
app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
})