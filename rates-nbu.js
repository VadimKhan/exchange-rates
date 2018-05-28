var com = require("commander")

var url = 'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?';


com
    .version('0.0.1', '-v, --version')
    .option('-d, --date <date>', 'date in the format YYYYDDMM')
    .option('-c, --curr <curr>', 'currency codes, e.g. -c usd,eur', function (val) {
        return val.split(',');
    })
    .parse(process.argv);

if (com.date) {
    url += 'date=' + com.date;
}

if (com.curr) {
    for (var i = 0; i < com.curr.length; i++) {
        com.curr[i] = com.curr[i].toUpperCase();
    }
} else {
    com.curr = Array();
}

var https = require("https");

https.get(url+'&json', function (res) {
    res.on('data', function (data) {
        var str = data.toString('utf8');
        var json = JSON.parse(str);
        for (var i = 0, j = 0; i < json.length; i++) {
            //console.log(json[i]);
            var idR030 = json[i].r030;
            var curName = json[i].txt;
            var curCode = json[i].cc;
            var rate = json[i].rate.toFixed(2);
            var genDate = json[i].exchangedate;
            if (com.curr.length > 0) {
                if (com.curr.indexOf(curCode) != -1) {
                    j++;
                    console.log(j + '\t' + curCode + '\t' + rate + '\t' + genDate + '\t' + curName);
                }
            } else {
                j++
                console.log(j + '\t' + curCode + '\t' + rate + '\t' + genDate + '\t' + curName);
            }
        }
    });
}).on('error', function (e) {
    console.error(e.message);
});