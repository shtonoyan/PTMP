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

    var data = {"OkPercent": 99.30626499726783, "KoPercent": 0.6937350027321755};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6657856742276899, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6307351407716372, 500, 1500, "Complete Search Field and Search"], "isController": true}, {"data": [0.8873406783322532, 500, 1500, "Add Comment"], "isController": true}, {"data": [0.6492271105826397, 500, 1500, "Open Home Page"], "isController": true}, {"data": [0.6293243682897733, 500, 1500, "Open Post"], "isController": true}, {"data": [0.6481331168831169, 500, 1500, "/blog/2022/04/01/default-285"], "isController": false}, {"data": [0.6481625510402489, 500, 1500, "/blog/2022/04/02/default-12"], "isController": false}, {"data": [0.648367664205208, 500, 1500, "Open Random Page"], "isController": true}, {"data": [0.6480280929227444, 500, 1500, "Open Predefined Date"], "isController": true}, {"data": [0.6147518878101402, 500, 1500, "Open Contacts"], "isController": true}, {"data": [0.648893120685551, 500, 1500, "/blog-29"], "isController": false}, {"data": [0.6292841648590022, 500, 1500, "/blog/post/post-12-25"], "isController": false}, {"data": [0.648918918918919, 500, 1500, "Open Random Date"], "isController": true}, {"data": [0.8878080415045395, 500, 1500, "/blog/post/post-22-53"], "isController": false}, {"data": [0.614543982730707, 500, 1500, "/blog/contact-30"], "isController": false}, {"data": [0.6303496868475992, 500, 1500, "/blog/search-149"], "isController": false}, {"data": [0.6459437963944857, 500, 1500, "Open Large Calendar"], "isController": true}, {"data": [0.6455679405520169, 500, 1500, "/blog/calendar/default.aspx-40"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 42091, 292, 0.6937350027321755, 932.0538594949061, 0, 21678, 1332.0, 3521.9000000000015, 3968.0, 5031.960000000006, 34.200500035345364, 1037.3572726173263, 354.9212840696816], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Complete Search Field and Search", 3836, 13, 0.33889468196037537, 1014.418143899894, 0, 6363, 485.5, 2802.3, 3507.449999999999, 4590.85000000001, 3.1297193614262904, 98.88376600987908, 36.849442019011654], "isController": true}, {"data": ["Add Comment", 4629, 8, 0.17282350399654353, 331.05271116871864, 0, 4695, 220.0, 730.0, 944.0, 1267.6999999999998, 3.887789117046053, 10.951654710584798, 10.704416835306903], "isController": true}, {"data": ["Open Home Page", 4205, 14, 0.3329369797859691, 949.3248513674195, 0, 21012, 472.0, 2599.4, 3378.0999999999995, 4396.679999999991, 3.4112858803591872, 129.2568053518147, 34.12090708439099], "isController": true}, {"data": ["Open Post", 9221, 44, 0.47717167335429994, 1030.8522936774755, 0, 6438, 481.0, 2909.600000000002, 3641.7999999999993, 4602.120000000003, 7.700208768267223, 241.3393748368998, 89.6228364757307], "isController": true}, {"data": ["/blog/2022/04/01/default-285", 7392, 27, 0.3652597402597403, 953.7019751082247, 80, 5755, 437.5, 2669.7999999999993, 3462.0, 4229.209999999999, 6.020279350083479, 191.08076442689458, 65.25544126292911], "isController": false}, {"data": ["/blog/2022/04/02/default-12", 5143, 19, 0.3694341823838227, 954.8086719813325, 79, 21678, 452.0, 2723.6000000000004, 3469.0, 4238.320000000009, 4.314966549151018, 129.84889125500882, 48.37769533996408], "isController": false}, {"data": ["Open Random Page", 5146, 19, 0.3692188107267781, 962.7666148464814, 0, 21678, 450.5, 2723.3, 3488.5999999999985, 4401.53, 4.309752804773056, 129.61638827394023, 48.29107189424146], "isController": true}, {"data": ["Open Predefined Date", 3702, 11, 0.2971366828741221, 962.8352242031345, 0, 6282, 453.0, 2721.4000000000005, 3497.3999999999996, 4401.459999999996, 3.0102553594254657, 95.79719071547233, 32.59827446101833], "isController": true}, {"data": ["Open Contacts", 3708, 18, 0.4854368932038835, 1071.113538295577, 0, 5996, 484.0, 2938.1, 3771.0, 4678.189999999999, 3.02979296414745, 94.29998717924886, 39.75321764850316], "isController": true}, {"data": ["/blog-29", 4201, 14, 0.33325398714591764, 942.0040466555578, 78, 21012, 473.0, 2599.8, 3362.8999999999996, 4186.959999999999, 3.4138457000252727, 129.47696407736981, 34.17902406630182], "isController": false}, {"data": ["/blog/post/post-12-25", 9220, 44, 0.4772234273318872, 1019.9438177874184, 87, 6419, 481.0, 2899.699999999999, 3620.0, 4337.579999999998, 7.712312346977099, 241.74494108879742, 89.77344595625354], "isController": false}, {"data": ["Open Random Date", 3700, 16, 0.43243243243243246, 959.7399999999994, 0, 6277, 421.5, 2616.6000000000004, 3487.499999999998, 4515.679999999993, 3.0137312110149432, 95.14228448029223, 32.60911418752657], "isController": true}, {"data": ["/blog/post/post-22-53", 4626, 8, 0.17293558149589278, 328.2083873757023, 41, 2692, 220.0, 730.9000000000005, 944.5999999999985, 1261.7299999999996, 3.8918395041059495, 10.97017403304488, 10.722518076841535], "isController": false}, {"data": ["/blog/contact-30", 3706, 18, 0.48569886670264434, 1062.5723151645968, 81, 5580, 484.0, 2920.9000000000005, 3726.5499999999975, 4434.579999999999, 3.032929297393203, 94.44854627211988, 39.81584440094736], "isController": false}, {"data": ["/blog/search-149", 3832, 13, 0.33924843423799583, 1006.044885177451, 80, 5592, 488.0, 2794.4000000000005, 3496.35, 4320.67, 3.1311154598825834, 99.03114087287402, 36.904361867720176], "isController": false}, {"data": ["Open Large Calendar", 3772, 9, 0.23860021208907742, 973.4954931071051, 0, 21043, 452.5, 2676.0, 3461.0999999999995, 4287.54, 3.0877840974207342, 149.88877118860862, 33.91800359194344], "isController": true}, {"data": ["/blog/calendar/default.aspx-40", 3768, 9, 0.23885350318471338, 970.1552547770709, 83, 21043, 454.0, 2676.2999999999997, 3458.0999999999995, 4231.339999999999, 3.089676887691721, 150.13986709695007, 33.97482353818432], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["404/Not Found", 8, 2.73972602739726, 0.019006438431018506], "isController": false}, {"data": ["Assertion failed", 284, 97.26027397260275, 0.674728564301157], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 42091, 292, "Assertion failed", 284, "404/Not Found", 8, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Complete Search Field and Search", 22, 13, "Assertion failed", 13, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Open Home Page", 21, 13, "Assertion failed", 13, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Open Post", 52, 44, "Assertion failed", 44, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["/blog/2022/04/01/default-285", 7392, 27, "Assertion failed", 27, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["/blog/2022/04/02/default-12", 5143, 19, "Assertion failed", 19, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Open Random Page", 25, 18, "Assertion failed", 18, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Open Predefined Date", 19, 11, "Assertion failed", 11, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Open Contacts", 19, 17, "Assertion failed", 17, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["/blog-29", 4201, 14, "Assertion failed", 14, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["/blog/post/post-12-25", 9220, 44, "Assertion failed", 44, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Open Random Date", 23, 16, "Assertion failed", 16, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["/blog/post/post-22-53", 4626, 8, "404/Not Found", 8, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["/blog/contact-30", 3706, 18, "Assertion failed", 18, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["/blog/search-149", 3832, 13, "Assertion failed", 13, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Open Large Calendar", 12, 8, "Assertion failed", 8, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["/blog/calendar/default.aspx-40", 3768, 9, "Assertion failed", 9, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
