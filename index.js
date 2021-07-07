let pageStats, maxDisplay = 6;

function createStats(data) {
    let stats = [];
    data.forEach(element => {
        if (Object.keys(stats).includes(element.toLowerCase())) {
            stats[element.toLowerCase()]++;
        } else {
            stats[element.toLowerCase()] = 1;
        }
    });

    var sortedStats = [];
    for (var stat in stats) {
        if (stat)
            sortedStats.push([stat, stats[stat]]);
    }

    sortedStats.sort(function (a, b) {
        return b[1] - a[1];
    });

    return sortedStats;
}

function formatAndDisplay(data) {
    let formated = formatData(data);

    presentData(formated);
}

function generateRandomChartColor() {
    let color = {
        r: Math.floor(Math.random() * 255),
        g: Math.floor(Math.random() * 255),
        b: Math.floor(Math.random() * 255)
    }
    return { borderColor: "rgba(" + color.r + "," + color.g + "," + color.b + ", 1)", backgroundColor: "rgba(" + color.r + "," + color.g + "," + color.b + ", 0.2)" };
}

function formatData(results) {
    let data = ("" + results)
        .replace('•', " ")
        .replace(/\n/ig, ' ') // new line
        .replace("\n", " ")
        .replace(".", " ")
        .replace("  ", " ")
        .replace(/\u00a0/g, " ") //&nbsp;
        .trim()
        .split(' ');
    console.log(data);
    return createStats(data);
}

function presentData(stats = undefined) {
    let backgroundColor = [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
    ],
        borderColor = [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
        ],
        data = { labels: [], data: [], backgroundColor: [], borderColor: [] },
        chartDataCount = 5,
        pstats = {};

    if (stats) {
        pstats = stats;
    } else if (pageStats) {
        pstats = pageStats;
    } else {
        return;
    }


    if (pstats.length > maxDisplay) {

        chartDataCount = maxDisplay;
    } else {
        chartDataCount = pstats.length;
    }


    for (let i = 0; i < chartDataCount; i++) {
        data.labels.push(pstats[i][0]);
        data.data.push(pstats[i][1]);
        let color = generateRandomChartColor();
        data.backgroundColor.push(color.backgroundColor);
        data.borderColor.push(color.borderColor);
    }

    displayData(data);
}

function displayData(data) {
    var ctx = document.getElementById('chart').getContext('2d');
    var chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Count',
                data: data.data,
                backgroundColor: data.backgroundColor,
                borderColor: data.borderColor,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

function analyze() {
    try {
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            var tab = tabs[0];
            if (tab.url.startsWith("edge://") || tab.url.startsWith("chrome://") || tab.url.startsWith("opera://") || tab.url.startsWith("vivaldi://")) {
                return;
            }
            chrome.tabs.executeScript(tab.id, {
                code: 'document.body.innerText'
            }, formatAndDisplay);
        });
    } catch (err) {

    }
}

document.getElementById("count").onclick = analyze;