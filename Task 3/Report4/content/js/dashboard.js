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

    var data = {"OkPercent": 97.36955881523626, "KoPercent": 2.630441184763743};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9616796269390913, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.44047619047619047, 500, 1500, "Open Home Page"], "isController": true}, {"data": [0.5264008620689655, 500, 1500, "/blog/2022/04/01/default-285"], "isController": false}, {"data": [0.125, 500, 1500, "/blog/calendar/default.aspx-67"], "isController": false}, {"data": [1.0, 500, 1500, "Navigate to a Random Page"], "isController": true}, {"data": [0.23040254237288135, 500, 1500, "Open Predefined Date"], "isController": true}, {"data": [0.44047619047619047, 500, 1500, "/blog-29"], "isController": false}, {"data": [0.31897491821155943, 500, 1500, "Open Random Date"], "isController": true}, {"data": [0.5049778761061947, 500, 1500, "/blog/search-112"], "isController": false}, {"data": [0.858659217877095, 500, 1500, "/blog/post/post-22-53"], "isController": false}, {"data": [0.48770053475935826, 500, 1500, "/blog/contact-30"], "isController": false}, {"data": [0.25177304964539005, 500, 1500, "Open Large Calendar"], "isController": true}, {"data": [0.48104265402843605, 500, 1500, "/blog/calendar/default.aspx-40"], "isController": false}, {"data": [0.38650963597430404, 500, 1500, "Open Main Page"], "isController": true}, {"data": [0.5066152149944874, 500, 1500, "Click Search Button"], "isController": true}, {"data": [0.5082964601769911, 500, 1500, "Complete Search Field and Search"], "isController": true}, {"data": [0.8604960141718335, 500, 1500, "Add Comment"], "isController": true}, {"data": [0.44302120141342755, 500, 1500, "Open Post"], "isController": true}, {"data": [0.5524764150943396, 500, 1500, "/blog/2022/04/02/default-12"], "isController": false}, {"data": [0.5540540540540541, 500, 1500, "Open Random Page"], "isController": true}, {"data": [0.5540540540540541, 500, 1500, "Select Random page"], "isController": true}, {"data": [0.9972812965106664, 500, 1500, "/blog-21"], "isController": false}, {"data": [0.48772678762006405, 500, 1500, "Open Contacts"], "isController": true}, {"data": [0.4727474972191324, 500, 1500, "/blog/post/post-12-25"], "isController": false}, {"data": [0.5055617352614016, 500, 1500, "/blog/search-149"], "isController": false}, {"data": [0.9972812965106664, 500, 1500, "Go to Previous Month"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 159593, 4198, 2.630441184763743, 82.79757884117686, 0, 360233, 30.0, 75.0, 95.0, 140.0, 265.82795046988315, 544.5847118852876, 867.227776806431], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Open Home Page", 168, 92, 54.76190476190476, 34042.6011904762, 96, 360233, 275.5, 166759.59999999992, 281011.89999999985, 354992.45, 0.27980273906895636, 74.78009578767802, 375.8429815443654], "isController": true}, {"data": ["/blog/2022/04/01/default-285", 1856, 861, 46.390086206896555, 229.40517241379348, 2, 2052, 208.0, 396.29999999999995, 455.14999999999986, 649.0200000000009, 3.1359297119202503, 101.35663399193207, 28.09768562030075], "isController": false}, {"data": ["/blog/calendar/default.aspx-67", 72, 63, 87.5, 147.58333333333334, 2, 521, 58.5, 354.20000000000005, 442.7999999999997, 521.0, 0.19906219587720073, 4.401337833601975, 1.101300366882686], "isController": false}, {"data": ["Navigate to a Random Page", 338, 0, 0.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, 0.5867658266193783, 0.0, 0.0], "isController": true}, {"data": ["Open Predefined Date", 944, 674, 71.39830508474576, 695.9480932203386, 0, 4361, 605.0, 1206.0, 1399.75, 2154.399999999987, 1.5922680542787986, 145.5370567472148, 40.66624733550218], "isController": true}, {"data": ["/blog-29", 168, 92, 54.76190476190476, 235.10714285714283, 2, 1285, 201.0, 445.4999999999999, 571.7499999999995, 1052.4700000000007, 0.27984095705607315, 30.31739851809222, 1.7311840791316935], "isController": false}, {"data": ["Open Random Date", 917, 569, 62.05016357688113, 574.845147219193, 0, 3880, 527.0, 981.8000000000002, 1130.1999999999998, 1735.0999999999933, 1.5475069443741287, 104.02714172872726, 32.06560502068546], "isController": true}, {"data": ["/blog/search-112", 904, 433, 47.89823008849557, 244.34070796460196, 2, 1950, 219.0, 413.5, 493.75, 1124.9500000000164, 1.5130694723170215, 46.53071922529253, 13.466358512835985], "isController": false}, {"data": ["/blog/post/post-22-53", 895, 126, 14.078212290502794, 99.90614525139678, 0, 587, 92.0, 176.39999999999998, 206.19999999999993, 271.5199999999995, 1.5054617141742164, 4.010203866008862, 3.591682946924485], "isController": false}, {"data": ["/blog/contact-30", 935, 456, 48.77005347593583, 259.0320855614976, 2, 2082, 236.0, 452.19999999999993, 526.1999999999999, 695.28, 1.5761092184689658, 69.55625763032822, 16.713711138793695], "isController": false}, {"data": ["Open Large Calendar", 846, 581, 68.67612293144208, 633.7494089834512, 0, 6277, 564.0, 1066.900000000001, 1202.3, 1998.1299999999994, 1.4352118888474197, 106.59889752114222, 30.538749183574794], "isController": true}, {"data": ["/blog/calendar/default.aspx-40", 844, 422, 50.0, 249.94668246445488, 2, 2036, 223.0, 410.0, 505.75, 1138.6999999999975, 1.4339523907418326, 47.47492799974685, 12.959219297660653], "isController": false}, {"data": ["Open Main Page", 934, 538, 57.601713062098504, 424.10278372591034, 0, 4444, 368.5, 786.0, 954.0, 1449.5999999999985, 1.6094984533995054, 83.92010720655519, 23.832944663797488], "isController": true}, {"data": ["Click Search Button", 907, 433, 47.739801543550165, 243.53252480705635, 0, 1950, 218.0, 413.20000000000005, 492.99999999999955, 1114.1199999999853, 1.5162660068875589, 46.47479026223294, 13.45017222815457], "isController": true}, {"data": ["Complete Search Field and Search", 904, 436, 48.230088495575224, 232.6349557522122, 0, 2057, 216.0, 392.5, 467.5, 645.7500000000002, 1.5134469088181721, 46.097998525582106, 14.67742641984005], "isController": true}, {"data": ["Add Comment", 4516, 623, 13.79539415411869, 109.19884853852983, 0, 5770, 97.0, 187.0, 219.0, 300.8299999999999, 7.587161635439908, 20.164704060689733, 18.12499514356973], "isController": true}, {"data": ["Open Post", 4528, 2350, 51.899293286219084, 341.8339222614837, 0, 5932, 312.0, 588.0999999999999, 676.5500000000002, 1018.2400000000016, 7.589611216801737, 291.12962617644837, 87.67228343082944], "isController": true}, {"data": ["/blog/2022/04/02/default-12", 848, 368, 43.39622641509434, 242.11674528301904, 2, 1715, 208.0, 404.1, 485.0, 726.2099999999994, 1.4358595769971234, 53.35046622576352, 14.068601913752758], "isController": false}, {"data": ["Open Random Page", 851, 368, 43.24324324324324, 241.26321974148075, 0, 1715, 208.0, 404.0, 485.0, 724.0800000000013, 1.4381218905472637, 53.246153398893775, 14.041094457125885], "isController": true}, {"data": ["Select Random page", 851, 368, 43.24324324324324, 241.26321974148075, 0, 1715, 208.0, 404.0, 485.0, 724.0800000000013, 1.4381413332972812, 53.246873262527544, 14.041284286299128], "isController": true}, {"data": ["/blog-21", 151175, 411, 0.2718703489333554, 36.988298329750464, 1, 430, 30.0, 75.0, 95.0, 139.0, 419.58556298154855, 74.10271584856618, 623.4470261300778], "isController": false}, {"data": ["Open Contacts", 937, 456, 48.66595517609392, 261.6990394877271, 0, 2082, 235.0, 455.0000000000002, 529.6999999999994, 735.9400000000002, 1.5773428254469, 69.462116640567, 16.691089948942572], "isController": true}, {"data": ["/blog/post/post-12-25", 899, 463, 51.50166852057842, 235.82202447163542, 0, 2042, 215.0, 405.0, 495.0, 735.0, 1.509645611112604, 55.20432357769637, 13.757070691380745], "isController": false}, {"data": ["/blog/search-149", 899, 436, 48.49833147942158, 233.92880978865387, 2, 2057, 216.0, 393.0, 468.0, 646.0, 1.510084306041513, 46.25139241079752, 14.726266446208076], "isController": false}, {"data": ["Go to Previous Month", 151175, 411, 0.2718703489333554, 36.98831817430136, 1, 430, 75.0, 126.0, 146.0, 206.0, 419.58556298154855, 74.10271584856618, 623.4470261300778], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in path at index 22: http://192.168.2.178/${SELECTED_POST_g1}", 161, 3.835159599809433, 0.10088161761480767], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1076, 25.631252977608384, 0.6742150344939941], "isController": false}, {"data": ["Non HTTP response code: java.net.URISyntaxException", 4, 0.09528346831824679, 0.002506375592914476], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException", 33, 0.786088613625536, 0.020677598641544427], "isController": false}, {"data": ["Assertion failed", 2924, 69.65221534063839, 1.832160558420482], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 159593, 4198, "Assertion failed", 2924, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1076, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in path at index 22: http://192.168.2.178/${SELECTED_POST_g1}", 161, "Non HTTP response code: java.net.BindException", 33, "Non HTTP response code: java.net.URISyntaxException", 4], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Open Home Page", 31, 31, "Non HTTP response code: java.net.BindException", 30, "Assertion failed", 1, null, null, null, null, null, null], "isController": false}, {"data": ["/blog/2022/04/01/default-285", 1856, 861, "Assertion failed", 688, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 173, null, null, null, null, null, null], "isController": false}, {"data": ["/blog/calendar/default.aspx-67", 72, 63, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 37, "Assertion failed", 26, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Open Predefined Date", 10, 7, "Assertion failed", 6, "Non HTTP response code: java.net.BindException", 1, null, null, null, null, null, null], "isController": false}, {"data": ["/blog-29", 168, 92, "Assertion failed", 62, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 30, null, null, null, null, null, null], "isController": false}, {"data": ["Open Random Date", 9, 7, "Assertion failed", 7, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["/blog/search-112", 904, 433, "Assertion failed", 351, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 82, null, null, null, null, null, null], "isController": false}, {"data": ["/blog/post/post-22-53", 895, 126, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in path at index 22: http://192.168.2.178/${SELECTED_POST_g1}", 80, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 40, "Assertion failed", 6, null, null, null, null], "isController": false}, {"data": ["/blog/contact-30", 935, 456, "Assertion failed", 377, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 79, null, null, null, null, null, null], "isController": false}, {"data": ["Open Large Calendar", 7, 3, "Assertion failed", 2, "Non HTTP response code: java.net.BindException", 1, null, null, null, null, null, null], "isController": false}, {"data": ["/blog/calendar/default.aspx-40", 844, 422, "Assertion failed", 350, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 72, null, null, null, null, null, null], "isController": false}, {"data": ["Open Main Page", 4, 2, "Non HTTP response code: java.net.BindException", 1, "Assertion failed", 1, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Open Post", 24, 15, "Assertion failed", 11, "Non HTTP response code: java.net.URISyntaxException", 4, null, null, null, null, null, null], "isController": false}, {"data": ["/blog/2022/04/02/default-12", 848, 368, "Assertion failed", 327, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 41, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["/blog-21", 151175, 411, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 411, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Open Contacts", 5, 2, "Assertion failed", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["/blog/post/post-12-25", 899, 463, "Assertion failed", 352, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in path at index 22: http://192.168.2.178/${SELECTED_POST_g1}", 81, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 30, null, null, null, null], "isController": false}, {"data": ["/blog/search-149", 899, 436, "Assertion failed", 355, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 81, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
