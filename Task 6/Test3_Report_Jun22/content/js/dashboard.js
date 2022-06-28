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

    var data = {"OkPercent": 99.42269136935674, "KoPercent": 0.5773086306432522};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6344283566162204, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6059506531204645, 500, 1500, "Complete Search Field and Search"], "isController": true}, {"data": [0.8840364638541446, 500, 1500, "Add Comment"], "isController": true}, {"data": [0.6205970790378007, 500, 1500, "Open Home Page"], "isController": true}, {"data": [0.5947890025575447, 500, 1500, "Open Post"], "isController": true}, {"data": [0.6087412156330909, 500, 1500, "/blog/2022/04/01/default-285"], "isController": false}, {"data": [0.5974409448818898, 500, 1500, "/blog/2022/04/02/default-12"], "isController": false}, {"data": [0.5982318271119843, 500, 1500, "Open Random Page"], "isController": true}, {"data": [0.6060532096656089, 500, 1500, "Open Predefined Date"], "isController": true}, {"data": [0.5885505481120584, 500, 1500, "Open Contacts"], "isController": true}, {"data": [0.6200258120025812, 500, 1500, "/blog-29"], "isController": false}, {"data": [0.5944432593856656, 500, 1500, "/blog/post/post-12-25"], "isController": false}, {"data": [0.6130272952853598, 500, 1500, "Open Random Date"], "isController": true}, {"data": [0.8845581988105352, 500, 1500, "/blog/post/post-22-53"], "isController": false}, {"data": [0.5871425079442679, 500, 1500, "/blog/contact-30"], "isController": false}, {"data": [0.6054734802615646, 500, 1500, "/blog/search-149"], "isController": false}, {"data": [0.5985641275249453, 500, 1500, "Open Large Calendar"], "isController": true}, {"data": [0.5976829268292683, 500, 1500, "/blog/calendar/default.aspx-40"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 41399, 239, 0.5773086306432522, 969.8409140317358, 0, 7090, 1340.5, 3011.0, 3556.9500000000007, 4691.990000000002, 33.69980723895856, 907.9710087276673, 348.49547604518733], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Complete Search Field and Search", 4134, 13, 0.31446540880503143, 1035.4547653604245, 0, 6557, 572.5, 2603.5, 3271.25, 4683.950000000003, 3.378798082895795, 81.22204320942501, 39.805321944124785], "isController": true}, {"data": ["Add Comment", 4717, 3, 0.0635997456010176, 331.2431630273482, 0, 3314, 220.0, 732.1999999999998, 887.1999999999989, 1341.739999999998, 3.9634991723454136, 11.171945240355935, 10.90085275074363], "isController": true}, {"data": ["Open Home Page", 4656, 17, 0.3651202749140893, 983.4506013745716, 0, 6171, 534.5, 2537.0, 3195.2999999999993, 4609.730000000003, 3.7837539129671587, 138.82195397550151, 37.834751159617774], "isController": true}, {"data": ["Open Post", 9384, 37, 0.39428815004262574, 1067.7306052855915, 0, 6481, 608.5, 2710.0, 3343.75, 4767.299999999999, 7.844573125315049, 241.76047549678535, 91.23460996127662], "isController": true}, {"data": ["/blog/2022/04/01/default-285", 8111, 28, 0.3452102083590186, 1012.3645666378989, 77, 5584, 560.0, 2594.4000000000005, 3197.3999999999996, 4444.040000000004, 6.617507881287897, 182.36692148868633, 71.72641811043063], "isController": false}, {"data": ["/blog/2022/04/02/default-12", 2032, 11, 0.5413385826771654, 1037.9827755905505, 77, 5554, 581.0, 2665.8, 3282.7999999999993, 4490.080000000002, 1.6985649132661933, 53.934954294644164, 19.00328516387766], "isController": false}, {"data": ["Open Random Page", 2036, 11, 0.5402750491159135, 1043.7902750491153, 0, 6167, 580.5, 2667.3, 3311.0, 4738.889999999999, 1.698811416079467, 53.83680359996162, 18.968703033152273], "isController": true}, {"data": ["Open Predefined Date", 4097, 15, 0.36612155235538196, 1023.9206736636551, 0, 6919, 575.0, 2609.4000000000005, 3245.3999999999996, 4636.02, 3.3371834074296114, 90.22529904807394, 36.107843251550484], "isController": true}, {"data": ["Open Contacts", 4105, 15, 0.3654080389768575, 1128.2151035322775, 0, 7090, 594.0, 2942.2000000000003, 3574.0999999999995, 5070.160000000001, 3.361436746030966, 101.62684159956076, 44.00088889607101], "isController": true}, {"data": ["/blog-29", 4649, 17, 0.36567003656700364, 978.2826414282636, 75, 5511, 535.0, 2526.0, 3162.5, 4433.5, 3.7844468919751657, 139.05644116585222, 37.898658663027526], "isController": false}, {"data": ["/blog/post/post-12-25", 9376, 37, 0.3946245733788396, 1061.1074018771312, 77, 5793, 610.0, 2704.300000000001, 3306.2999999999993, 4594.149999999998, 7.851281192430078, 242.17366686380004, 91.39053848156715], "isController": false}, {"data": ["Open Random Date", 4030, 13, 0.3225806451612903, 1010.6205955335001, 0, 6123, 549.0, 2568.9, 3197.45, 4660.870000000001, 3.2888186693912993, 92.01916465612463, 35.569235543224295], "isController": true}, {"data": ["/blog/post/post-22-53", 4708, 3, 0.0637213254035684, 328.9373406966869, 38, 2006, 221.0, 733.1000000000004, 885.0, 1314.0199999999968, 3.962589385512477, 11.190732649783858, 10.919184274872654], "isController": false}, {"data": ["/blog/contact-30", 4091, 15, 0.36665851869958443, 1125.9618675140575, 80, 5771, 602.0, 2936.4000000000005, 3546.1999999999953, 4924.759999999998, 3.3552505857950945, 101.78695632494671, 44.070213005050924], "isController": false}, {"data": ["/blog/search-149", 4129, 13, 0.31484620973601357, 1029.907241462823, 79, 5663, 574.0, 2590.0, 3248.0, 4587.799999999999, 3.38077388526166, 81.36795210686324, 39.87682901791344], "isController": false}, {"data": ["Open Large Calendar", 4109, 11, 0.2677050377220735, 1041.1552689218772, 0, 7089, 604.0, 2612.0, 3282.0, 4650.600000000003, 3.370491588125764, 103.58962637831083, 36.99995459674476], "isController": true}, {"data": ["/blog/calendar/default.aspx-40", 4100, 11, 0.2682926829268293, 1038.1641463414628, 79, 5784, 606.0, 2604.8, 3223.8999999999996, 4502.98, 3.368333882399141, 103.75055714219256, 37.05743555468449], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Assertion failed", 239, 100.0, 0.5773086306432522], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 41399, 239, "Assertion failed", 239, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Complete Search Field and Search", 19, 13, "Assertion failed", 13, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Open Home Page", 23, 13, "Assertion failed", 13, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Open Post", 43, 28, "Assertion failed", 28, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["/blog/2022/04/01/default-285", 8111, 28, "Assertion failed", 28, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["/blog/2022/04/02/default-12", 2032, 11, "Assertion failed", 11, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Open Random Page", 12, 7, "Assertion failed", 7, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Open Predefined Date", 23, 14, "Assertion failed", 14, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Open Contacts", 26, 11, "Assertion failed", 11, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["/blog-29", 4649, 17, "Assertion failed", 17, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["/blog/post/post-12-25", 9376, 37, "Assertion failed", 37, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Open Random Date", 21, 10, "Assertion failed", 10, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["/blog/post/post-22-53", 4708, 3, "Assertion failed", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["/blog/contact-30", 4091, 15, "Assertion failed", 15, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["/blog/search-149", 4129, 13, "Assertion failed", 13, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Open Large Calendar", 20, 8, "Assertion failed", 8, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["/blog/calendar/default.aspx-40", 4100, 11, "Assertion failed", 11, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
