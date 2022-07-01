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

    var data = {"OkPercent": 98.7801431801055, "KoPercent": 1.2198568198944988};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.28418077754292637, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.24502369668246446, 500, 1500, "Complete Search Field and Search"], "isController": true}, {"data": [0.5389221556886228, 500, 1500, "Add Comment"], "isController": true}, {"data": [0.2763102725366876, 500, 1500, "Open Home Page"], "isController": true}, {"data": [0.24328326634228897, 500, 1500, "Open Post"], "isController": true}, {"data": [0.2523879500367377, 500, 1500, "/blog/2022/04/01/default-285"], "isController": false}, {"data": [0.28275570583262893, 500, 1500, "/blog/2022/04/02/default-12"], "isController": false}, {"data": [0.2839662447257384, 500, 1500, "Open Random Page"], "isController": true}, {"data": [0.2580409356725146, 500, 1500, "Open Predefined Date"], "isController": true}, {"data": [0.2369172216936251, 500, 1500, "Open Contacts"], "isController": true}, {"data": [0.276006711409396, 500, 1500, "/blog-29"], "isController": false}, {"data": [0.24216101694915254, 500, 1500, "/blog/post/post-12-25"], "isController": false}, {"data": [0.25329428989751096, 500, 1500, "Open Random Date"], "isController": true}, {"data": [0.5383297644539614, 500, 1500, "/blog/post/post-22-53"], "isController": false}, {"data": [0.23436754176610977, 500, 1500, "/blog/contact-30"], "isController": false}, {"data": [0.24358974358974358, 500, 1500, "/blog/search-149"], "isController": false}, {"data": [0.2528169014084507, 500, 1500, "Open Large Calendar"], "isController": true}, {"data": [0.25035327366933585, 500, 1500, "/blog/calendar/default.aspx-40"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 21232, 259, 1.2198568198944988, 3826.008807460428, 0, 18798, 3587.5, 8653.0, 9807.95, 12417.970000000005, 17.227445774764455, 479.9179623539598, 177.51197314631727], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Complete Search Field and Search", 2110, 9, 0.4265402843601896, 4151.905687203791, 0, 16621, 3818.0, 8716.0, 9915.849999999999, 12664.779999999973, 1.7335436590094975, 41.45575609282058, 20.32610348449464], "isController": true}, {"data": ["Add Comment", 2338, 4, 0.1710863986313088, 1027.6950384944382, 0, 8159, 881.0, 2137.2, 2432.4999999999973, 3633.61, 1.974266975276064, 5.6865786459446035, 5.423738818749963], "isController": true}, {"data": ["Open Home Page", 2385, 17, 0.7127882599580713, 3896.6054507337453, 0, 14216, 3555.0, 8479.4, 9572.499999999996, 11870.599999999977, 1.9322317317009148, 80.14543236950954, 19.085767986667197], "isController": true}, {"data": ["Open Post", 4727, 44, 0.9308229320922361, 4254.951766448064, 0, 18761, 3956.0, 8875.8, 9947.8, 12285.920000000016, 3.938290397053322, 121.20494352116029, 45.57867791734047], "isController": true}, {"data": ["/blog/2022/04/01/default-285", 4083, 27, 0.6612784717119765, 4072.5775165319637, 98, 17832, 3792.0, 8564.199999999999, 9697.4, 12129.519999999993, 3.347678967179956, 93.88528860535719, 36.11918155147456], "isController": false}, {"data": ["/blog/2022/04/02/default-12", 1183, 8, 0.6762468300929839, 3823.1073541842766, 151, 14207, 3344.0, 8350.6, 9602.599999999999, 11680.12000000001, 1.0038984865996947, 30.396860482242538, 11.197756061737211], "isController": false}, {"data": ["Open Random Page", 1185, 8, 0.6751054852320675, 3828.561181434598, 0, 14207, 3325.0, 8368.600000000004, 9658.300000000001, 11843.360000000037, 1.003948865537782, 30.34708060433274, 11.179417887308222], "isController": true}, {"data": ["Open Predefined Date", 2052, 11, 0.5360623781676414, 4085.5292397660814, 0, 17832, 3788.5, 8687.5, 9878.0, 12238.880000000001, 1.6796762448594704, 45.26810486557679, 18.060152772417375], "isController": true}, {"data": ["Open Contacts", 2102, 14, 0.6660323501427212, 4578.785442435775, 0, 17911, 4384.0, 9412.1, 10606.199999999997, 14079.679999999991, 1.73002121786251, 56.6579810885924, 22.53653301525744], "isController": true}, {"data": ["/blog-29", 2384, 17, 0.7130872483221476, 3884.6933724832143, 109, 14216, 3555.5, 8413.0, 9552.25, 11778.550000000007, 1.9346597871549627, 80.27980395668966, 19.117767126993698], "isController": false}, {"data": ["/blog/post/post-12-25", 4720, 44, 0.9322033898305084, 4240.062076271185, 102, 18691, 3961.5, 8822.200000000004, 9920.8, 12139.329999999998, 3.938824711451882, 121.40116507874103, 45.65246631997151], "isController": false}, {"data": ["Open Random Date", 2049, 16, 0.7808687164470474, 4053.877013177157, 0, 18798, 3744.0, 8542.0, 9512.0, 12197.5, 1.6806171285151268, 48.56062571640509, 18.035964240236385], "isController": true}, {"data": ["/blog/post/post-22-53", 2335, 4, 0.17130620985010706, 1024.6638115631677, 77, 8159, 884.0, 2137.8, 2420.2, 3449.9199999999964, 1.9751144043782405, 5.696328770639311, 5.433038282115699], "isController": false}, {"data": ["/blog/contact-30", 2095, 14, 0.6682577565632458, 4577.76181384248, 108, 17911, 4394.0, 9399.4, 10579.0, 13880.839999999998, 1.7273079555104833, 56.75813585493499, 22.576371024924356], "isController": false}, {"data": ["/blog/search-149", 2106, 9, 0.42735042735042733, 4147.415954415954, 107, 16621, 3828.5, 8697.199999999999, 9873.849999999993, 12349.179999999997, 1.7331450410325793, 41.52494386283753, 20.360026826046468], "isController": false}, {"data": ["Open Large Calendar", 2130, 12, 0.5633802816901409, 4060.6000000000026, 0, 15521, 3788.0, 8445.7, 9580.349999999999, 12482.620000000006, 1.7575025970607625, 53.835822905209554, 19.18286704291731], "isController": true}, {"data": ["/blog/calendar/default.aspx-40", 2123, 12, 0.5652378709373528, 4060.765426283564, 103, 15521, 3809.0, 8437.0, 9520.8, 12399.639999999996, 1.7543598693691906, 53.91674604876509, 19.211701707639605], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Assertion failed", 259, 100.0, 1.2198568198944988], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 21232, 259, "Assertion failed", 259, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Complete Search Field and Search", 17, 8, "Assertion failed", 8, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Open Home Page", 18, 16, "Assertion failed", 16, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Open Post", 57, 42, "Assertion failed", 42, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["/blog/2022/04/01/default-285", 4083, 27, "Assertion failed", 27, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["/blog/2022/04/02/default-12", 1183, 8, "Assertion failed", 8, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Open Random Page", 9, 7, "Assertion failed", 7, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Open Predefined Date", 20, 10, "Assertion failed", 10, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Open Contacts", 24, 14, "Assertion failed", 14, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["/blog-29", 2384, 17, "Assertion failed", 17, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["/blog/post/post-12-25", 4720, 44, "Assertion failed", 44, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Open Random Date", 29, 15, "Assertion failed", 15, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["/blog/post/post-22-53", 2335, 4, "Assertion failed", 4, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["/blog/contact-30", 2095, 14, "Assertion failed", 14, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["/blog/search-149", 2106, 9, "Assertion failed", 9, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Open Large Calendar", 21, 12, "Assertion failed", 12, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["/blog/calendar/default.aspx-40", 2123, 12, "Assertion failed", 12, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
