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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9380453752181501, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Add User"], "isController": true}, {"data": [0.9, 500, 1500, "Open Home Page"], "isController": true}, {"data": [1.0, 500, 1500, "/blog/api/packages-372"], "isController": false}, {"data": [1.0, 500, 1500, "/blog/api/users/processchecked/delete-120"], "isController": false}, {"data": [1.0, 500, 1500, "/blog/admin/-371"], "isController": false}, {"data": [1.0, 500, 1500, "/blog/api/customfields-396"], "isController": false}, {"data": [1.0, 500, 1500, "Delete User"], "isController": true}, {"data": [1.0, 500, 1500, "Open Users Tab"], "isController": true}, {"data": [1.0, 500, 1500, "/blog/api/users/admin-395"], "isController": false}, {"data": [1.0, 500, 1500, "Login"], "isController": true}, {"data": [1.0, 500, 1500, "/blog/Account/login.aspx-284"], "isController": false}, {"data": [0.9, 500, 1500, "/blog-29"], "isController": false}, {"data": [1.0, 500, 1500, "/blog/api/setup-375"], "isController": false}, {"data": [1.0, 500, 1500, "Logout"], "isController": true}, {"data": [1.0, 500, 1500, "/blog/Account/login.aspx-93"], "isController": false}, {"data": [1.0, 500, 1500, "/blog/api/users-397"], "isController": false}, {"data": [1.0, 500, 1500, "/blog/api/users-111"], "isController": false}, {"data": [0.675, 500, 1500, "/blog/api/newsfeed-373"], "isController": false}, {"data": [0.4625, 500, 1500, "Open Admin Page"], "isController": true}, {"data": [1.0, 500, 1500, "/blog/api/dashboard-374"], "isController": false}, {"data": [1.0, 500, 1500, "/blog/Account/login.aspx-65"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 416, 0, 0.0, 89.91826923076927, 0, 1349, 6.0, 421.0, 564.1999999999998, 1094.3699999999994, 0.5021449798779885, 9.597750213577589, 1.2864270592923377], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Add User", 27, 0, 0.0, 5.814814814814816, 4, 15, 5.0, 9.599999999999998, 13.799999999999994, 15.0, 0.04835148304743281, 0.026158907820583766, 0.07175074676179374], "isController": true}, {"data": ["Open Home Page", 5, 0, 0.0, 317.6, 94, 592, 239.0, 592.0, 592.0, 592.0, 0.008923121950523074, 1.4697671522480913, 0.07448018353077228], "isController": true}, {"data": ["/blog/api/packages-372", 40, 0, 0.0, 8.750000000000002, 2, 242, 3.0, 4.0, 4.0, 242.0, 0.050561037916986365, 0.011405859139476414, 0.05757243184688095], "isController": false}, {"data": ["/blog/api/users/processchecked/delete-120", 31, 0, 0.0, 6.387096774193547, 2, 32, 5.0, 13.400000000000002, 24.19999999999998, 32.0, 0.039164358917345515, 0.006960852854450083, 0.06584433817602738], "isController": false}, {"data": ["/blog/admin/-371", 40, 0, 0.0, 95.025, 72, 198, 78.5, 135.8, 154.95, 198.0, 0.05057913105052855, 3.0931472488904204, 0.5162207866003237], "isController": false}, {"data": ["/blog/api/customfields-396", 46, 0, 0.0, 4.760869565217393, 2, 46, 3.0, 7.6000000000000085, 25.09999999999998, 46.0, 0.058156440825821464, 0.013119275225356207, 0.06786811209653969], "isController": false}, {"data": ["Delete User", 32, 0, 0.0, 6.187499999999999, 0, 32, 5.0, 13.099999999999998, 23.549999999999972, 32.0, 0.040371417036737994, 0.006951157681923698, 0.06575262926738494], "isController": true}, {"data": ["Open Users Tab", 46, 0, 0.0, 12.326086956521738, 7, 52, 10.0, 19.800000000000026, 36.049999999999976, 52.0, 0.05816099976229852, 0.30467725663098616, 0.2014051808174908], "isController": true}, {"data": ["/blog/api/users/admin-395", 46, 0, 0.0, 3.8695652173913038, 2, 9, 3.0, 6.0, 7.0, 9.0, 0.0581579849016814, 0.04072194841260309, 0.06559811773578322], "isController": false}, {"data": ["Login", 5, 0, 0.0, 242.0, 162, 372, 240.0, 372.0, 372.0, 372.0, 0.008925335994273505, 1.3071416048066504, 0.2647024549582919], "isController": true}, {"data": ["/blog/Account/login.aspx-284", 5, 0, 0.0, 131.2, 73, 278, 109.0, 278.0, 278.0, 278.0, 0.008925208537497478, 0.5867400714864578, 0.02355941277036688], "isController": false}, {"data": ["/blog-29", 5, 0, 0.0, 317.6, 94, 592, 239.0, 592.0, 592.0, 592.0, 0.008919826812642605, 1.4692243954141386, 0.07445267942677625], "isController": false}, {"data": ["/blog/api/setup-375", 40, 0, 0.0, 64.925, 20, 421, 35.5, 127.79999999999998, 147.0, 421.0, 0.05054436278721834, 0.011402097464694762, 0.05942911405840907], "isController": false}, {"data": ["Logout", 4, 0, 0.0, 214.5, 0, 389, 234.5, 389.0, 389.0, 389.0, 0.005535251943911293, 0.7817975791229671, 0.045422580160826745], "isController": true}, {"data": ["/blog/Account/login.aspx-93", 5, 0, 0.0, 110.8, 88, 163, 94.0, 163.0, 163.0, 163.0, 0.008931426295190784, 0.7208847225273792, 0.2413072521171946], "isController": false}, {"data": ["/blog/api/users-397", 46, 0, 0.0, 3.695652173913044, 3, 21, 3.0, 4.0, 7.599999999999994, 21.0, 0.05814107806198091, 0.25074697658494477, 0.06790696226770428], "isController": false}, {"data": ["/blog/api/users-111", 27, 0, 0.0, 5.814814814814816, 4, 15, 5.0, 9.599999999999998, 13.799999999999994, 15.0, 0.04838666320194264, 0.026177940833863496, 0.07180295203447998], "isController": false}, {"data": ["/blog/api/newsfeed-373", 40, 0, 0.0, 641.5500000000002, 421, 1349, 562.5, 1097.1, 1283.1499999999999, 1349.0, 0.050496825643298, 0.019330816066575014, 0.05749931513680221], "isController": false}, {"data": ["Open Admin Page", 40, 0, 0.0, 820.6999999999997, 537, 1607, 716.5, 1377.5999999999997, 1591.8999999999999, 1607.0, 0.0505081116027234, 7.032412327783123, 0.746777720587864], "isController": true}, {"data": ["/blog/api/dashboard-374", 40, 0, 0.0, 10.45, 7, 44, 9.0, 12.899999999999999, 26.349999999999945, 44.0, 0.05056653481442713, 3.905998154953561, 0.05693673304788524], "isController": false}, {"data": ["/blog/Account/login.aspx-65", 3, 0, 0.0, 286.0, 225, 389, 244.0, 389.0, 389.0, 389.0, 0.006691544341518579, 1.260149365028205, 0.07321490508044351], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 416, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
