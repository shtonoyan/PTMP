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

    var data = {"OkPercent": 99.52023466242419, "KoPercent": 0.47976533757581785};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6773549843479129, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6292289535798584, 500, 1500, "Complete Search Field and Search"], "isController": true}, {"data": [0.8695179584120983, 500, 1500, "Add Comment"], "isController": true}, {"data": [0.6419513913349771, 500, 1500, "Open Home Page"], "isController": true}, {"data": [0.586474292696682, 500, 1500, "Open Post"], "isController": true}, {"data": [0.6389340927583401, 500, 1500, "/blog/2022/04/01/default-285"], "isController": false}, {"data": [0.5860611020185488, 500, 1500, "/blog/2022/04/02/default-12"], "isController": false}, {"data": [0.5876358695652174, 500, 1500, "Open Random Page"], "isController": true}, {"data": [0.6343762535098275, 500, 1500, "Open Predefined Date"], "isController": true}, {"data": [0.6024390243902439, 500, 1500, "Open Contacts"], "isController": true}, {"data": [0.6418752203031372, 500, 1500, "/blog-29"], "isController": false}, {"data": [0.5847809667673716, 500, 1500, "/blog/post/post-12-25"], "isController": false}, {"data": [0.6442980650473445, 500, 1500, "Open Random Date"], "isController": true}, {"data": [0.8689311163895487, 500, 1500, "/blog/post/post-22-53"], "isController": false}, {"data": [0.6021155410903173, 500, 1500, "/blog/contact-30"], "isController": false}, {"data": [0.6284982262514781, 500, 1500, "/blog/search-149"], "isController": false}, {"data": [0.628307939053729, 500, 1500, "Open Large Calendar"], "isController": true}, {"data": [0.6285084202085004, 500, 1500, "/blog/calendar/default.aspx-40"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 40228, 193, 0.47976533757581785, 1058.4382768221149, 0, 9247, 1186.5, 4702.0, 5351.0, 6645.0, 32.689133877718845, 727.9927897483124, 296.5479298899825], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Complete Search Field and Search", 2542, 12, 0.47206923682140045, 1163.347757671125, 0, 8477, 394.0, 3467.1000000000035, 4420.25, 5795.380000000006, 2.0671994326993217, 48.98628075665639, 24.226650759535183], "isController": true}, {"data": ["Add Comment", 10580, 4, 0.03780718336483932, 361.9717391304354, 0, 3347, 173.0, 926.8999999999996, 1375.8999999999978, 2081.5700000000015, 8.846590258215079, 24.450916488041635, 24.247966827220154], "isController": true}, {"data": ["Open Home Page", 2839, 14, 0.49313138429024306, 1133.0119760479026, 0, 7801, 356.0, 3443.0, 4486.0, 6056.599999999999, 2.306950348155293, 91.03750722953465, 22.862225714451718], "isController": true}, {"data": ["Open Post", 10639, 28, 0.26318262994642355, 1452.8984866998755, 0, 9247, 551.0, 4657.0, 5315.0, 6798.800000000003, 8.878937164765667, 268.8342773741497, 103.13775450060047], "isController": true}, {"data": ["/blog/2022/04/01/default-285", 4916, 35, 0.7119609438567941, 1133.8348250610247, 74, 8787, 374.0, 3359.4000000000015, 4442.0, 5837.709999999997, 3.996942940306031, 100.28569260746458, 43.151574594085886], "isController": false}, {"data": ["/blog/2022/04/02/default-12", 3666, 12, 0.32733224222585927, 1460.524004364428, 77, 8997, 556.0, 4670.6, 5353.65, 6441.629999999999, 3.1127413520811045, 88.17916591045137, 34.95831810952545], "isController": false}, {"data": ["Open Random Page", 3680, 12, 0.32608695652173914, 1456.5817934782592, 0, 8997, 544.5, 4668.4000000000015, 5353.95, 6477.710000000001, 3.1191330844242526, 88.02408077484606, 34.89683515662413], "isController": true}, {"data": ["Open Predefined Date", 2493, 18, 0.7220216606498195, 1154.2819895707985, 0, 8787, 390.0, 3413.7999999999993, 4518.099999999995, 5809.2199999999975, 2.026923198879948, 55.75611532404347, 21.859781433977023], "isController": true}, {"data": ["Open Contacts", 2460, 15, 0.6097560975609756, 1257.3361788617885, 0, 8483, 430.5, 3677.7000000000003, 4706.95, 6051.119999999999, 2.0008442586750017, 63.45800315717567, 26.150450023475354], "isController": true}, {"data": ["/blog-29", 2837, 14, 0.4934790271413465, 1128.976735988719, 73, 7801, 358.0, 3415.2000000000057, 4459.299999999999, 6056.719999999999, 2.3054094641243505, 91.04083628941623, 22.863061740401303], "isController": false}, {"data": ["/blog/post/post-12-25", 10592, 28, 0.26435045317220546, 1457.0929947129882, 77, 9247, 562.5, 4659.700000000001, 5316.35, 6692.559999999998, 8.85489903642781, 269.2961286098427, 103.31494284067368], "isController": false}, {"data": ["Open Random Date", 2429, 17, 0.699876492383697, 1128.0028818443795, 0, 8648, 352.0, 3377.0, 4424.0, 5894.799999999992, 1.9751885739935404, 44.53610392274971, 21.29492557873269], "isController": true}, {"data": ["/blog/post/post-22-53", 10525, 4, 0.03800475059382423, 363.6719239904992, 28, 3347, 175.0, 929.0, 1376.0, 2080.74, 8.81555759553468, 24.4924697260979, 24.28917516141265], "isController": false}, {"data": ["/blog/contact-30", 2458, 15, 0.6102522375915378, 1250.1916192026026, 73, 8483, 432.0, 3651.0, 4683.049999999999, 6024.689999999999, 1.9992175560256726, 63.45800315717567, 26.150450023475354], "isController": false}, {"data": ["/blog/search-149", 2537, 12, 0.4729996058336618, 1158.4142688214426, 73, 8477, 399.0, 3403.2000000000016, 4406.5, 5797.079999999996, 2.0631350218999707, 48.98632059320011, 24.226670461092787], "isController": false}, {"data": ["Open Large Calendar", 2494, 12, 0.48115477145148355, 1143.965517241378, 75, 8273, 428.0, 3333.5, 4397.5, 5652.200000000015, 2.0284668564457093, 52.60217965255185, 22.22980314660431], "isController": true}, {"data": ["/blog/calendar/default.aspx-40", 2494, 12, 0.48115477145148355, 1140.085404971931, 75, 8273, 428.0, 3323.0, 4365.75, 5609.0500000000075, 2.0284668564457093, 52.60217965255185, 22.22980314660431], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["404/Not Found", 3, 1.5544041450777202, 0.00745749229392463], "isController": false}, {"data": ["Assertion failed", 190, 98.44559585492227, 0.47230784528189323], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 40228, 193, "Assertion failed", 190, "404/Not Found", 3, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Complete Search Field and Search", 14, 9, "Assertion failed", 9, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Open Home Page", 10, 7, "Assertion failed", 7, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Open Post", 59, 7, "Assertion failed", 7, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["/blog/2022/04/01/default-285", 4916, 35, "Assertion failed", 35, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["/blog/2022/04/02/default-12", 3666, 12, "Assertion failed", 12, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Open Random Page", 17, 3, "Assertion failed", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Open Predefined Date", 16, 12, "Assertion failed", 12, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Open Contacts", 13, 10, "Assertion failed", 10, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["/blog-29", 2837, 14, "Assertion failed", 14, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["/blog/post/post-12-25", 10592, 28, "Assertion failed", 28, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Open Random Date", 12, 9, "Assertion failed", 9, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["/blog/post/post-22-53", 10525, 4, "404/Not Found", 3, "Assertion failed", 1, null, null, null, null, null, null], "isController": false}, {"data": ["/blog/contact-30", 2458, 15, "Assertion failed", 15, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["/blog/search-149", 2537, 12, "Assertion failed", 12, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Open Large Calendar", 6, 4, "Assertion failed", 4, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["/blog/calendar/default.aspx-40", 2494, 12, "Assertion failed", 12, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
