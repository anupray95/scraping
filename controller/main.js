const https = require("https");

const extractStories = (dataArr) => {
    let count = 0;
    let storyDataList = []
    let storyData = {};
    for (let line of dataArr) {
        if (line.includes(`<a href="`)) {
            let link = "https://time.com" + line.trim().replace('<a href="', "").replace('">', "")
            storyData["link"] = link
        }
        if (line.includes(`<h3 class="latest-stories__item-headline">`)) {
            count++;
            let title = line.trim().replace('<h3 class="latest-stories__item-headline">', "").replace('</h3>', "")
            storyData["title"] = title
            storyDataList.push(storyData)
            storyData = {}
        }
        if (count == 6)
            break;
    }
    return storyDataList
}

const extractDivArr = (data) => {
    dataArr = data.split("\n")
    let indicator = false
    let divArr = []
    for (let line of dataArr) {
        if (line.includes(`<div class="partial latest-stories"`)) {
            indicator = true
        }
        if (indicator) {
            divArr.push(line)
            if (line.includes("</div>"))
                return divArr
        }
    }
}


const getTimeStories = (response) => {
    https.get("https://time.com/", (res) => {
        var data = "";
        res.on('data', function (chunk) {
            data += chunk;
        });
        res.on("end", function () {
            // extract div tags, where latest stories are present
            let divArr = extractDivArr(data)

            // extract the result form that div tag
            let result = extractStories(divArr)
            response.end(JSON.stringify(result))
        });
    }).on("error", (err) => {
        response.send(err.message)
    });

};

module.exports = {
    getTimeStories
}