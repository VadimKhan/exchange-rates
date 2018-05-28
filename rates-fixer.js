var com = require("commander")
var config = require("./fixer.json");

var url = 'http://data.fixer.io/api/';

com
    .version('0.0.1', '-v, --version')
    .option('-d, --date <date>', 'date in the format YYYY-DD-MM')
    .option('-c, --curr <curr>', 'currency codes, e.g. -c usd,eur')
    .option('-b, --base <baseCurr>', 'base currency')
    .parse(process.argv);

if (com.date) {
    url += com.date + '?';
} else {
    url += 'latest?';
}

if (com.curr) {
    com.curr = com.curr.toUpperCase();
    url += '&symbols=' + com.curr;
} else {
    url += '&symbols=usd';
}

if (com.base) {
    com.curr = com.curr.toUpperCase();
    url += '&base=' + com.base;
}

url += '&access_key=' + config.apikey;

var http = require("http");

http.get(url, function (res) {
    res.on('data', function (data) {
        var str = data.toString('utf8');
        var json = JSON.parse(str);

        console.log('Date \t' + json.date);
        console.log('Base currency \t' + json.base);

        var i = 0;
        for (var key in json.rates) {
            i++;
            var rate = json.rates[key].toFixed(2);
            console.log(i + '\t' + key + '\t' + rate);
        }
    });
}).on('error', function (e) {
    console.error(e.message);
});