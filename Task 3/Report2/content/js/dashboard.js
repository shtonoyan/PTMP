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

    var data = {"OkPercent": 95.91596898160856, "KoPercent": 4.0840310183914355};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9419138345206746, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4666666666666667, 500, 1500, "Open Home Page"], "isController": true}, {"data": [0.4702038682697334, 500, 1500, "/blog/2022/04/01/default-285"], "isController": false}, {"data": [0.052941176470588235, 500, 1500, "/blog/calendar/default.aspx-67"], "isController": false}, {"data": [1.0, 500, 1500, "Navigate to a Random Page"], "isController": true}, {"data": [0.2008238928939238, 500, 1500, "Open Predefined Date"], "isController": true}, {"data": [0.4666666666666667, 500, 1500, "/blog-29"], "isController": false}, {"data": [0.2537154989384289, 500, 1500, "Open Random Date"], "isController": true}, {"data": [0.45274725274725275, 500, 1500, "/blog/search-112"], "isController": false}, {"data": [0.8338870431893688, 500, 1500, "/blog/post/post-22-53"], "isController": false}, {"data": [0.4269911504424779, 500, 1500, "/blog/contact-30"], "isController": false}, {"data": [0.2357293868921776, 500, 1500, "Open Large Calendar"], "isController": true}, {"data": [0.46881606765327694, 500, 1500, "/blog/calendar/default.aspx-40"], "isController": false}, {"data": [0.3583617747440273, 500, 1500, "Open Main Page"], "isController": true}, {"data": [0.8553315994798439, 500, 1500, "Add Comment"], "isController": true}, {"data": [0.45454545454545453, 500, 1500, "Click Search Button"], "isController": true}, {"data": [0.42015418502202645, 500, 1500, "Complete Search Field and Search"], "isController": true}, {"data": [0.3910837651122625, 500, 1500, "Open Post"], "isController": true}, {"data": [0.4732587064676617, 500, 1500, "/blog/2022/04/02/default-12"], "isController": false}, {"data": [0.4765142150803461, 500, 1500, "Open Random Page"], "isController": true}, {"data": [0.4765142150803461, 500, 1500, "Select Random page"], "isController": true}, {"data": [0.9951587073841284, 500, 1500, "/blog-21"], "isController": false}, {"data": [0.4288864388092613, 500, 1500, "Open Contacts"], "isController": true}, {"data": [0.4524336283185841, 500, 1500, "/blog/post/post-12-25"], "isController": false}, {"data": [0.41823204419889504, 500, 1500, "/blog/search-149"], "isController": false}, {"data": [0.9951587073841284, 500, 1500, "Go to Previous Month"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 116576, 4761, 4.0840310183914355, -4.252737368650481E7, -1652561149468, 368686, 50.0, 113.0, 139.0, 190.0, 194.1412560161207, 539.5653759372866, 660.2191694630873], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Open Home Page", 165, 86, 52.121212121212125, 30959.775757575757, 103, 368686, 287.0, 124066.60000000003, 280017.6999999997, 368073.52, 0.274786124799531, 63.54771480208321, 273.1643759929771], "isController": true}, {"data": ["/blog/2022/04/01/default-285", 1913, 979, 51.17616309461579, 261.04756926293777, 2, 2447, 235.0, 456.0, 546.0, 713.8799999999992, 3.23425982281734, 107.30434507242425, 28.306159707428822], "isController": false}, {"data": ["/blog/calendar/default.aspx-67", 85, 79, 92.94117647058823, 154.75294117647059, 2, 578, 32.0, 484.2000000000001, 541.6000000000001, 578.0, 0.23894190900529888, 4.649984143744641, 1.1014909052735884], "isController": false}, {"data": ["Navigate to a Random Page", 286, 0, 0.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, 0.4998470747585965, 0.0, 0.0], "isController": true}, {"data": ["Open Predefined Date", 971, 711, 73.22348094747683, 797.069001029866, 2, 5175, 695.0, 1388.6000000000008, 1625.6, 2811.799999999997, 1.682294157189685, 158.26468254006926, 41.360494760805835], "isController": true}, {"data": ["/blog-29", 165, 86, 52.121212121212125, 253.21212121212125, 3, 986, 237.0, 447.00000000000006, 502.0, 956.9600000000002, 0.27483372559601443, 30.861250818254952, 1.7481985247883363], "isController": false}, {"data": ["Open Random Date", 942, 653, 69.32059447983015, 651.5976645435242, 3, 3075, 602.5, 1121.0, 1308.6499999999992, 2096.239999999998, 1.5889267659942683, 112.24262004820336, 31.696615507975842], "isController": true}, {"data": ["/blog/search-112", 910, 484, 53.18681318681319, 258.7263736263738, 2, 868, 241.5, 449.9, 535.4499999999999, 681.78, 1.551304715454916, 48.57108527562509, 13.610436447755127], "isController": false}, {"data": ["/blog/post/post-22-53", 903, 146, 16.168327796234774, 120.58582502768552, 0, 1655, 107.0, 214.0, 249.5999999999999, 367.0400000000009, 1.5505260284039883, 4.171178816710824, 3.664235187582742], "isController": false}, {"data": ["/blog/contact-30", 904, 493, 54.5353982300885, 293.83517699115066, 2, 2583, 265.5, 512.5, 617.75, 818.8500000000001, 1.553699747523791, 69.91485218637264, 15.929118276467465], "isController": false}, {"data": ["Open Large Calendar", 946, 675, 71.35306553911205, 687.154334038055, 5, 3170, 647.0, 1165.6000000000001, 1291.5499999999997, 1797.6599999999967, 1.5802881603675087, 122.2284923783671, 32.63726769680518], "isController": true}, {"data": ["/blog/calendar/default.aspx-40", 946, 485, 51.268498942917546, 269.3678646934459, 2, 2508, 243.0, 476.30000000000007, 565.3, 812.6199999999985, 1.5824214058459265, 53.57984716136433, 13.998286659777726], "isController": false}, {"data": ["Open Main Page", 879, 524, 59.613196814562, -5.640139967427759E9, -1652561149468, 2929, 410.0, 873.0, 1066.0, 1710.2000000000069, 1.49280092930679, 78.69892239759707, 21.558448174312105], "isController": true}, {"data": ["Add Comment", 4614, 654, 14.174252275682704, 121.2986562635458, 0, 2160, 107.0, 216.0, 251.0, 345.7000000000007, 7.742468125664923, 20.71146471861817, 18.513473964818253], "isController": true}, {"data": ["Click Search Button", 913, 484, 53.01204819277108, 259.98904709748103, 0, 1630, 241.0, 449.6, 535.3, 691.86, 1.553616796078011, 48.483639948775746, 13.58593279384288], "isController": true}, {"data": ["Complete Search Field and Search", 908, 514, 56.607929515418505, 263.22907488986806, 0, 1886, 240.0, 444.30000000000007, 535.55, 808.9199999999996, 1.5498689097662224, 50.633174403671724, 14.19273911539269], "isController": true}, {"data": ["Open Post", 4632, 2610, 56.347150259067355, 382.5455526770308, 0, 2710, 352.0, 669.0, 788.3499999999995, 1205.4100000000017, 7.749331218662638, 309.68882585168194, 87.26791648577365], "isController": true}, {"data": ["/blog/2022/04/02/default-12", 804, 411, 51.11940298507463, 271.2748756218905, 3, 2320, 243.0, 450.5, 533.5, 696.4000000000005, 1.3993535821885263, 53.476377640975294, 13.142803576183837], "isController": false}, {"data": ["Open Random Page", 809, 411, 50.80346106304079, 269.59826946847954, 0, 2320, 240.0, 448.0, 533.0, 695.7999999999997, 1.4061006343964544, 53.402113930650906, 13.124551903189362], "isController": true}, {"data": ["Select Random page", 809, 411, 50.80346106304079, 269.59826946847954, 0, 2320, 240.0, 448.0, 533.0, 695.7999999999997, 1.406117741938287, 53.40276365576708, 13.124711585089244], "isController": true}, {"data": ["/blog-21", 108029, 521, 0.4822779068583436, 46.71939016375251, 1, 1271, 50.0, 112.0, 138.0, 185.0, 292.80039896896875, 53.20585264455849, 441.72976804084414], "isController": false}, {"data": ["Open Contacts", 907, 493, 54.35501653803749, 293.78390297684695, 0, 2583, 264.0, 512.2, 617.5999999999999, 832.7999999999994, 1.5563921902402027, 69.80435764341716, 15.903943644917787], "isController": true}, {"data": ["/blog/post/post-12-25", 904, 482, 53.31858407079646, 256.70243362831866, 0, 1805, 243.0, 452.5, 535.5, 736.6000000000004, 1.5490857994756413, 56.81984246748461, 14.02866328161146], "isController": false}, {"data": ["/blog/search-149", 905, 514, 56.79558011049724, 264.10165745856375, 2, 1886, 240.0, 445.19999999999993, 535.6999999999999, 809.2799999999993, 1.5480617582560443, 50.74178504937975, 14.22318323780538], "isController": false}, {"data": ["Go to Previous Month", 108029, 521, 0.4822779068583436, 46.719436447620396, 1, 1271, 85.0, 150.0, 171.0, 210.0, 292.80039896896875, 53.20585264455849, 441.72976804084414], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in path at index 22: http://192.168.2.178/${SELECTED_POST_g1}", 158, 3.3186305398025624, 0.1355339006313478], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1214, 25.498844780508296, 1.0413807301674445], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException", 28, 0.5881117412308339, 0.02401866593466923], "isController": false}, {"data": ["Assertion failed", 3361, 70.5944129384583, 2.883097721657974], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 116576, 4761, "Assertion failed", 3361, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1214, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in path at index 22: http://192.168.2.178/${SELECTED_POST_g1}", 158, "Non HTTP response code: java.net.BindException", 28, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Open Home Page", 27, 27, "Non HTTP response code: java.net.BindException", 26, "Assertion failed", 1, null, null, null, null, null, null], "isController": false}, {"data": ["/blog/2022/04/01/default-285", 1913, 979, "Assertion failed", 808, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 171, null, null, null, null, null, null], "isController": false}, {"data": ["/blog/calendar/default.aspx-67", 85, 79, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 50, "Assertion failed", 29, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Open Predefined Date", 16, 16, "Assertion failed", 15, "Non HTTP response code: java.net.BindException", 1, null, null, null, null, null, null], "isController": false}, {"data": ["/blog-29", 165, 86, "Assertion failed", 60, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 26, null, null, null, null, null, null], "isController": false}, {"data": ["Open Random Date", 9, 9, "Assertion failed", 8, "Non HTTP response code: java.net.BindException", 1, null, null, null, null, null, null], "isController": false}, {"data": ["/blog/search-112", 910, 484, "Assertion failed", 407, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 77, null, null, null, null, null, null], "isController": false}, {"data": ["/blog/post/post-22-53", 903, 146, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in path at index 22: http://192.168.2.178/${SELECTED_POST_g1}", 79, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 47, "Assertion failed", 20, null, null, null, null], "isController": false}, {"data": ["/blog/contact-30", 904, 493, "Assertion failed", 408, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 85, null, null, null, null, null, null], "isController": false}, {"data": ["Open Large Calendar", 5, 5, "Assertion failed", 5, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["/blog/calendar/default.aspx-40", 946, 485, "Assertion failed", 400, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 85, null, null, null, null, null, null], "isController": false}, {"data": ["Open Main Page", 9, 4, "Assertion failed", 4, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Click Search Button", 5, 2, "Assertion failed", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Open Post", 30, 17, "Assertion failed", 17, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["/blog/2022/04/02/default-12", 804, 411, "Assertion failed", 370, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 41, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["/blog-21", 108029, 521, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 521, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Open Contacts", 4, 1, "Assertion failed", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["/blog/post/post-12-25", 904, 482, "Assertion failed", 371, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in path at index 22: http://192.168.2.178/${SELECTED_POST_g1}", 79, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 32, null, null, null, null], "isController": false}, {"data": ["/blog/search-149", 905, 514, "Assertion failed", 435, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 79, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
