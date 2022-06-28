/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = true;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.45831145897962, "KoPercent": 0.5416885410203789};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6401825499496909, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.62472647702407, 500, 1500, "Complete Search Field and Search"], "isController": true}, {"data": [0.898815931108719, 500, 1500, "Add Comment"], "isController": true}, {"data": [0.6514453824507547, 500, 1500, "Open Home Page"], "isController": true}, {"data": [0.6165020956169639, 500, 1500, "Open Post"], "isController": true}, {"data": [0.6236131345959879, 500, 1500, "/blog/2022/04/01/default-285"], "isController": false}, {"data": [0.6340023612750886, 500, 1500, "/blog/2022/04/02/default-12"], "isController": false}, {"data": [0.6346493812610489, 500, 1500, "Open Random Page"], "isController": true}, {"data": [0.6246632744687219, 500, 1500, "Open Predefined Date"], "isController": true}, {"data": [0.585509138381201, 500, 1500, "Open Contacts"], "isController": true}, {"data": [0.6511776753712237, 500, 1500, "/blog-29"], "isController": false}, {"data": [0.6159018143009605, 500, 1500, "/blog/post/post-12-25"], "isController": false}, {"data": [0.6230053191489362, 500, 1500, "Open Random Date"], "isController": true}, {"data": [0.8996041741633681, 500, 1500, "/blog/post/post-22-53"], "isController": false}, {"data": [0.5842426887821912, 500, 1500, "/blog/contact-30"], "isController": false}, {"data": [0.6238485158648925, 500, 1500, "/blog/search-149"], "isController": false}, {"data": [0.6104269293924466, 500, 1500, "Open Large Calendar"], "isController": true}, {"data": [0.6104269293924466, 500, 1500, "/blog/calendar/default.aspx-40"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 41906, 227, 0.5416885410203789, 932.8480408533351, 0, 21015, 1259.5, 3194.0, 3641.9500000000007, 5423.870000000021, 31.02316632328914, 859.1431685504465, 333.33736981991], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Complete Search Field and Search", 6855, 23, 0.33552151714077316, 951.7353756382215, 0, 6856, 559.0, 2465.600000000002, 3115.3999999999996, 4088.479999999993, 5.0945482759543275, 120.66675701810254, 59.78442879746365], "isController": true}, {"data": ["Add Comment", 2787, 5, 0.17940437746681018, 331.38894869034806, 0, 3648, 243.0, 690.2000000000003, 871.0, 1275.4799999999996, 2.3463447283013625, 6.714569823645295, 6.440016162953936], "isController": true}, {"data": ["Open Home Page", 3909, 11, 0.28140189306728064, 874.1609107188541, 0, 6816, 516.0, 2276.0, 2967.0, 3853.2000000000007, 2.890414899131249, 107.57354174515362, 28.816064187646635], "isController": true}, {"data": ["Open Post", 14077, 58, 0.412019606450238, 991.5454997513679, 0, 21015, 595.0, 2590.2000000000007, 3258.199999999997, 4440.219999999999, 11.733629848447212, 356.27040753306625, 136.02955416613878], "isController": true}, {"data": ["/blog/2022/04/01/default-285", 8923, 21, 0.23534685643841757, 948.9342149501276, 77, 7312, 573.0, 2472.6000000000004, 3108.0, 3933.5200000000004, 6.618655514668522, 184.9583894650501, 71.55357396758282], "isController": false}, {"data": ["/blog/2022/04/02/default-12", 1694, 4, 0.2361275088547816, 937.1027154663512, 77, 7621, 536.0, 2470.0, 3101.0, 3954.949999999997, 1.428818441373319, 44.769481680348264, 15.966454837813503], "isController": false}, {"data": ["Open Random Page", 1697, 4, 0.2357100766057749, 939.0170889805534, 0, 7621, 535.0, 2469.4, 3125.5999999999995, 4088.159999999999, 1.4288865799174497, 44.69246827131879, 15.938989004593573], "isController": true}, {"data": ["Open Predefined Date", 6682, 12, 0.17958695001496558, 946.5116731517514, 0, 7312, 573.0, 2461.0, 3094.0, 3948.17, 4.950480378850291, 133.6547975281678, 53.44307896801524], "isController": true}, {"data": ["Open Contacts", 2298, 9, 0.391644908616188, 1091.3107049608348, 0, 6978, 667.0, 2810.3999999999987, 3505.6499999999965, 4372.239999999994, 1.7105163258287965, 54.65449999823217, 22.32847590869319], "isController": true}, {"data": ["/blog-29", 3906, 11, 0.2816180235535074, 870.9126984126982, 78, 6816, 516.0, 2276.3, 2967.2999999999993, 3758.0, 2.892589830613909, 107.73717083807902, 28.859896029270626], "isController": false}, {"data": ["/blog/post/post-12-25", 14055, 58, 0.4126645321949484, 985.7105656350058, 79, 21015, 597.0, 2591.3999999999996, 3248.0, 4039.880000000001, 11.735423193304255, 356.8826071118293, 136.26330143787115], "isController": false}, {"data": ["Open Random Date", 2256, 9, 0.39893617021276595, 968.4392730496447, 0, 6853, 567.0, 2521.3999999999996, 3179.2500000000014, 4670.179999999996, 1.6735482932923058, 51.14882015795781, 18.048385214365883], "isController": true}, {"data": ["/blog/post/post-22-53", 2779, 5, 0.17992083483267363, 327.3573227779775, 38, 2213, 244.0, 691.0, 871.0, 1204.9999999999936, 2.343994473604969, 6.72715415907195, 6.452085934462201], "isController": false}, {"data": ["/blog/contact-30", 2291, 9, 0.39284155390659103, 1088.5277171540806, 83, 6978, 668.0, 2820.2000000000025, 3489.2000000000003, 4249.48, 1.7077592350192765, 54.733129366768694, 22.360599045143807], "isController": false}, {"data": ["/blog/search-149", 6839, 23, 0.3363064775551981, 947.5578300921197, 77, 6856, 560.0, 2471.0, 3107.0, 3925.0000000000036, 5.09024220144974, 120.84682971189781, 59.8736459390079], "isController": false}, {"data": ["Open Large Calendar", 1218, 1, 0.08210180623973727, 997.9367816091952, 88, 6998, 579.0, 2499.500000000002, 3112.6999999999994, 5097.309999999965, 0.908240154206949, 27.86981524107885, 9.965914778849488], "isController": true}, {"data": ["/blog/calendar/default.aspx-40", 1218, 1, 0.08210180623973727, 992.9162561576352, 88, 6998, 579.0, 2499.500000000002, 3112.6999999999994, 4333.639999999992, 0.9095756359188283, 27.910795182777655, 9.980568719074055], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Assertion failed", 227, 100.0, 0.5416885410203789], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 41906, 227, "Assertion failed", 227, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Complete Search Field and Search", 38, 19, "Assertion failed", 19, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Open Home Page", 15, 9, "Assertion failed", 9, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Open Post", 74, 43, "Assertion failed", 43, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["/blog/2022/04/01/default-285", 8923, 21, "Assertion failed", 21, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["/blog/2022/04/02/default-12", 1694, 4, "Assertion failed", 4, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Open Random Page", 6, 3, "Assertion failed", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Open Predefined Date", 24, 6, "Assertion failed", 6, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Open Contacts", 14, 7, "Assertion failed", 7, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["/blog-29", 3906, 11, "Assertion failed", 11, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["/blog/post/post-12-25", 14055, 58, "Assertion failed", 58, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Open Random Date", 12, 7, "Assertion failed", 7, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["/blog/post/post-22-53", 2779, 5, "Assertion failed", 5, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["/blog/contact-30", 2291, 9, "Assertion failed", 9, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["/blog/search-149", 6839, 23, "Assertion failed", 23, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Open Large Calendar", 3, 1, "Assertion failed", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["/blog/calendar/default.aspx-40", 1218, 1, "Assertion failed", 1, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
