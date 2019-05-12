const express = require('express');
const router = express.Router();
const request = require('request');

/* GET home page. */
router.get('/', (req, res) => {
    const {search_query} = req.query;
    let url = "https://www.youtube.com/results?search_query=";
    url += search_query;
    url = encodeURI(url);

    if (!search_query) {
        res.render('index', {title: "Enter a search query", link: null, ids: []});
        return;
    }

    request(url, (error, response, body) => {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received

        const regex = new RegExp('href="/watch\\?v=([A-Za-z0-9_\\-]*?)"', 'g');
        let array;
        const ids = [];
        let lastId = null;
        while (array = regex.exec(body)) {
            let id = array[1]; //get captured group
            if (id !== lastId) { //avoid duplicate adding
                ids.push(id);
            }
            lastId = id;
        }
        res.render('index', {title: search_query, link: url, ids: body ? ids : []});
    });

});

module.exports = router;
