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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9907759088442757, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9972375690607734, 500, 1500, "/blog/api/posts/50451529-51db-4e09-b02b-343b625a373f-240"], "isController": false}, {"data": [0.8, 500, 1500, "Open Home Page"], "isController": true}, {"data": [1.0, 500, 1500, "/blog/api/posts/update/foo-214"], "isController": false}, {"data": [0.9861878453038674, 500, 1500, "Open Post"], "isController": true}, {"data": [0.9917582417582418, 500, 1500, "/blog/2022/04/01/default-285"], "isController": false}, {"data": [0.9861878453038674, 500, 1500, "Click Edit Button"], "isController": true}, {"data": [0.8, 500, 1500, "Login"], "isController": true}, {"data": [1.0, 500, 1500, "Submit Changes"], "isController": true}, {"data": [0.9917582417582418, 500, 1500, "Open Predefined Date"], "isController": true}, {"data": [0.9, 500, 1500, "/blog/Account/login.aspx-284"], "isController": false}, {"data": [0.8, 500, 1500, "/blog-29"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [0.9861878453038674, 500, 1500, "/blog/post/post-12-25"], "isController": false}, {"data": [0.988950276243094, 500, 1500, "/blog/admin/app/editor/editpost.cshtml-237"], "isController": false}, {"data": [1.0, 500, 1500, "Logout"], "isController": true}, {"data": [0.9, 500, 1500, "/blog/Account/login.aspx-93"], "isController": false}, {"data": [1.0, 500, 1500, "/blog/Account/login.aspx-65"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1106, 0, 0.0, 92.63833634719711, 0, 23408, 73.0, 147.30000000000007, 189.0, 707.0400000000018, 1.434111894441066, 46.7364784039573, 15.837930434146257], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/blog/api/posts/50451529-51db-4e09-b02b-343b625a373f-240", 181, 0, 0.0, 14.05524861878452, 2, 1413, 3.0, 7.0, 17.200000000000045, 479.02000000000777, 0.2495264511824245, 0.1885153598350644, 0.3055724314284769], "isController": false}, {"data": ["Open Home Page", 5, 0, 0.0, 4844.2, 84, 23408, 257.0, 23408.0, 23408.0, 23408.0, 0.009441961208646571, 1.5561366345026257, 0.07881086996342183], "isController": true}, {"data": ["/blog/api/posts/update/foo-214", 181, 0, 0.0, 6.486187845303864, 1, 355, 2.0, 6.0, 10.0, 171.32000000000153, 0.25071960682733035, 0.0445614926197013, 0.4509162585258518], "isController": false}, {"data": ["Open Post", 181, 0, 0.0, 154.67403314917132, 85, 2334, 114.0, 189.8, 263.9000000000002, 1249.9600000000091, 0.24646875634044282, 28.637813364683204, 6.403534726647766], "isController": true}, {"data": ["/blog/2022/04/01/default-285", 182, 0, 0.0, 128.98901098901106, 80, 1119, 94.0, 191.40000000000003, 213.74999999999991, 1047.619999999999, 0.2461252182332807, 8.140580235553328, 5.899556822469339], "isController": false}, {"data": ["Click Edit Button", 181, 0, 0.0, 122.76795580110493, 74, 4112, 79.0, 110.0, 120.0, 2255.5200000000154, 0.24718570201422208, 9.601340877874557, 3.5192114759034907], "isController": true}, {"data": ["Login", 5, 0, 0.0, 580.8, 167, 1986, 235.0, 1986.0, 1986.0, 1986.0, 0.009871453926963087, 1.3502259514107293, 0.2928004339984719], "isController": true}, {"data": ["Submit Changes", 181, 0, 0.0, 6.486187845303864, 1, 355, 2.0, 6.0, 10.0, 171.32000000000153, 0.2500272819824263, 0.04443844269609529, 0.4496711204502977], "isController": true}, {"data": ["Open Predefined Date", 182, 0, 0.0, 129.0714285714286, 80, 1119, 94.0, 191.40000000000003, 213.74999999999991, 1047.619999999999, 0.245471588686727, 8.51528307207019, 5.883889493950879], "isController": true}, {"data": ["/blog/Account/login.aspx-284", 5, 0, 0.0, 322.2, 74, 1236, 107.0, 1236.0, 1236.0, 1236.0, 0.009911863707909271, 0.6516024355183706, 0.02616383554929566], "isController": false}, {"data": ["/blog-29", 5, 0, 0.0, 4844.2, 84, 23408, 257.0, 23408.0, 23408.0, 23408.0, 0.009475780851721087, 1.5617104749782533, 0.07909315829670945], "isController": false}, {"data": ["Debug Sampler", 181, 0, 0.0, 0.08287292817679562, 0, 1, 0.0, 0.0, 1.0, 1.0, 0.24716072411264517, 0.40125345521474987, 0.0], "isController": false}, {"data": ["/blog/post/post-12-25", 181, 0, 0.0, 154.67403314917132, 85, 2334, 114.0, 189.8, 263.9000000000002, 1249.9600000000091, 0.2471371010135352, 28.715469982485356, 6.420899070863492], "isController": false}, {"data": ["/blog/admin/app/editor/editpost.cshtml-237", 181, 0, 0.0, 108.71270718232047, 71, 2699, 75.0, 106.0, 115.70000000000002, 1776.5000000000077, 0.24782672393609084, 9.439008621648691, 3.224846849759498], "isController": false}, {"data": ["Logout", 3, 0, 0.0, 95.0, 87, 110, 88.0, 110.0, 110.0, 110.0, 0.0062988687231773175, 0.19853123832084757, 0.06891848161570181], "isController": true}, {"data": ["/blog/Account/login.aspx-93", 5, 0, 0.0, 258.6, 92, 750, 128.0, 750.0, 750.0, 750.0, 0.009980956335312223, 0.7090592243748927, 0.26970220506773074], "isController": false}, {"data": ["/blog/Account/login.aspx-65", 3, 0, 0.0, 95.0, 87, 110, 88.0, 110.0, 110.0, 110.0, 0.006323070989117994, 0.19929405876346024, 0.06918328843952931], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1106, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
