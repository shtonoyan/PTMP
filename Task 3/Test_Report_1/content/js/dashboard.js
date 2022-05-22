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

    var data = {"OkPercent": 81.39980250755558, "KoPercent": 18.60019749244442};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8113792638533099, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9215342057665709, 500, 1500, "Add Comment"], "isController": true}, {"data": [0.7755555555555556, 500, 1500, "Complete Search Field and Search"], "isController": true}, {"data": [0.7626398210290828, 500, 1500, "Open Home Page"], "isController": true}, {"data": [0.7603481214179579, 500, 1500, "Open Post"], "isController": true}, {"data": [0.7964213369345037, 500, 1500, "/blog/2022/04/02/default-12"], "isController": false}, {"data": [0.7627476882430647, 500, 1500, "/blog/2022/04/01/default-285"], "isController": false}, {"data": [0.7969013135735938, 500, 1500, "Open Random Page"], "isController": true}, {"data": [0.7791363163371487, 500, 1500, "Open Predefined Date"], "isController": true}, {"data": [0.7663329820864068, 500, 1500, "Open Contacts"], "isController": true}, {"data": [0.7623429084380611, 500, 1500, "/blog-29"], "isController": false}, {"data": [0.7600255291990213, 500, 1500, "/blog/post/post-12-25"], "isController": false}, {"data": [0.7466631073144687, 500, 1500, "Open Random Date"], "isController": true}, {"data": [0.9213752665245203, 500, 1500, "/blog/post/post-22-53"], "isController": false}, {"data": [0.7662098049551924, 500, 1500, "/blog/contact-30"], "isController": false}, {"data": [0.7774261603375527, 500, 1500, "Open Large Calendar"], "isController": true}, {"data": [0.775180856983862, 500, 1500, "/blog/search-149"], "isController": false}, {"data": [0.7766013763896241, 500, 1500, "/blog/calendar/default.aspx-40"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 33419, 6216, 18.60019749244442, 137.4024357401475, 0, 2678, 144.0, 198.0, 224.0, 308.9900000000016, 18.564460936805617, 419.79414004345443, 146.78155670016832], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Add Comment", 9399, 728, 7.745504840940526, 89.97723162038496, 0, 2678, 79.0, 139.0, 155.0, 211.0, 5.246081346354674, 14.083318348956505, 13.387093168282334], "isController": true}, {"data": ["Complete Search Field and Search", 1800, 402, 22.333333333333332, 153.00833333333324, 0, 771, 147.0, 193.0, 222.0, 309.9100000000001, 1.012910671970567, 26.391307325468457, 10.549954288009614], "isController": true}, {"data": ["Open Home Page", 2235, 523, 23.400447427293066, 157.32751677852406, 0, 2087, 148.0, 198.0, 232.39999999999964, 366.87999999999784, 1.2415004435517245, 45.29068683981061, 10.901309533001415], "isController": true}, {"data": ["Open Post", 9422, 2226, 23.62555720653789, 155.13309276162164, 0, 2226, 148.0, 203.0, 237.0, 398.5400000000009, 5.251883615761893, 163.61867164258766, 52.990538103817514], "isController": true}, {"data": ["/blog/2022/04/02/default-12", 2962, 593, 20.020256583389603, 160.10398379473304, 2, 1204, 147.0, 198.0, 229.0, 373.38999999999487, 1.651487146891474, 51.50120399884167, 16.95562715095468], "isController": false}, {"data": ["/blog/2022/04/01/default-285", 3785, 887, 23.43461030383091, 153.4018494055483, 0, 1859, 147.0, 198.0, 224.0, 360.5599999999995, 2.1174611947963604, 56.937956468305494, 20.111690505529175], "isController": false}, {"data": ["Open Random Page", 2969, 593, 19.973054900639948, 159.7265072414952, 0, 1204, 147.0, 198.0, 229.0, 370.10000000000855, 1.6524454690212391, 51.40959437671109, 16.925466718271963], "isController": true}, {"data": ["Open Predefined Date", 1922, 419, 21.800208116545264, 156.4635796045787, 0, 1859, 148.0, 201.0, 225.0, 342.30999999999995, 1.0741426698425223, 31.553252014785947, 10.37847468230498], "isController": true}, {"data": ["Open Contacts", 1898, 439, 23.129610115911486, 159.0447839831405, 0, 1225, 149.0, 203.10000000000014, 234.04999999999995, 356.06999999999994, 1.0749551866021392, 34.74802518842158, 12.434408747214206], "isController": true}, {"data": ["/blog-29", 2228, 523, 23.473967684021545, 156.94793536804363, 2, 1164, 148.0, 198.0, 232.0, 353.97000000000025, 1.237686326510319, 45.29340408024713, 10.901963563247827], "isController": false}, {"data": ["/blog/post/post-12-25", 9401, 2226, 23.678332092330603, 155.05616423784693, 0, 2053, 148.0, 203.0, 237.0, 395.97999999999956, 5.2461435181025715, 163.80493573669506, 53.05086272616705], "isController": false}, {"data": ["Open Random Date", 1873, 468, 24.986652429257877, 151.64922584089763, 0, 2396, 146.0, 195.0, 224.29999999999995, 411.1199999999999, 1.0663554328332716, 25.801084818632752, 9.89464611681232], "isController": true}, {"data": ["/blog/post/post-22-53", 9380, 728, 7.7611940298507465, 90.15948827292088, 0, 2678, 79.0, 139.0, 155.0, 211.0, 5.241210216672077, 14.09874209295968, 13.401754421607588], "isController": false}, {"data": ["/blog/contact-30", 1897, 439, 23.141802846599894, 159.12862414338463, 2, 1225, 149.0, 203.20000000000005, 234.0999999999999, 356.1399999999999, 1.0755760880781717, 34.78642382237317, 12.448149508230113], "isController": false}, {"data": ["Open Large Calendar", 1896, 417, 21.99367088607595, 156.014240506329, 0, 1199, 147.0, 198.0, 225.0, 378.17999999999984, 1.0645722592458045, 29.678265245358357, 10.351695632944637], "isController": true}, {"data": ["/blog/search-149", 1797, 402, 22.370617696160267, 153.2637729549248, 2, 771, 147.0, 193.20000000000005, 222.0, 310.03999999999996, 1.0125170091025109, 26.4250922911085, 10.563459865385102], "isController": false}, {"data": ["/blog/calendar/default.aspx-40", 1889, 417, 22.075172048703017, 156.59237691900464, 2, 1199, 147.0, 198.0, 225.0, 378.59999999999945, 1.0619077011637699, 29.71368481814198, 10.364049880535383], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in path at index 22: http://192.168.2.178/${SELECTED_POST_g1}", 851, 13.69047619047619, 2.5464556090846524], "isController": false}, {"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in path at index 22: http://192.168.2.178/${RANDOM_DATE_HREF}", 62, 0.9974259974259975, 0.18552320536221908], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1027, 16.521879021879023, 3.073102127532242], "isController": false}, {"data": ["Assertion failed", 4276, 68.79021879021879, 12.795116550465304], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 33419, 6216, "Assertion failed", 4276, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1027, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in path at index 22: http://192.168.2.178/${SELECTED_POST_g1}", 851, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in path at index 22: http://192.168.2.178/${RANDOM_DATE_HREF}", 62, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["/blog/2022/04/02/default-12", 2962, 593, "Assertion failed", 550, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 43, null, null, null, null, null, null], "isController": false}, {"data": ["/blog/2022/04/01/default-285", 3785, 887, "Assertion failed", 671, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 154, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in path at index 22: http://192.168.2.178/${RANDOM_DATE_HREF}", 62, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["/blog-29", 2228, 523, "Assertion failed", 410, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 113, null, null, null, null, null, null], "isController": false}, {"data": ["/blog/post/post-12-25", 9401, 2226, "Assertion failed", 1579, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in path at index 22: http://192.168.2.178/${SELECTED_POST_g1}", 426, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 221, null, null, null, null], "isController": false}, {"data": ["Open Random Date", 9, 1, "Assertion failed", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["/blog/post/post-22-53", 9380, 728, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in path at index 22: http://192.168.2.178/${SELECTED_POST_g1}", 425, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 249, "Assertion failed", 54, null, null, null, null], "isController": false}, {"data": ["/blog/contact-30", 1897, 439, "Assertion failed", 349, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 90, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["/blog/search-149", 1797, 402, "Assertion failed", 324, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 78, null, null, null, null, null, null], "isController": false}, {"data": ["/blog/calendar/default.aspx-40", 1889, 417, "Assertion failed", 338, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 79, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
