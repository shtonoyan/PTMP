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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9268953068592057, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Add User"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "Open Home Page"], "isController": true}, {"data": [0.9878048780487805, 500, 1500, "/blog/api/packages-372"], "isController": false}, {"data": [1.0, 500, 1500, "/blog/api/users/processchecked/delete-120"], "isController": false}, {"data": [0.9878048780487805, 500, 1500, "/blog/admin/-371"], "isController": false}, {"data": [1.0, 500, 1500, "/blog/api/customfields-396"], "isController": false}, {"data": [1.0, 500, 1500, "Delete User"], "isController": true}, {"data": [1.0, 500, 1500, "Open Users Tab"], "isController": true}, {"data": [1.0, 500, 1500, "/blog/api/users/admin-395"], "isController": false}, {"data": [0.75, 500, 1500, "Login"], "isController": true}, {"data": [1.0, 500, 1500, "/blog/Account/login.aspx-284"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "/blog-29"], "isController": false}, {"data": [1.0, 500, 1500, "/blog/api/setup-375"], "isController": false}, {"data": [1.0, 500, 1500, "Logout"], "isController": true}, {"data": [0.9, 500, 1500, "/blog/Account/login.aspx-93"], "isController": false}, {"data": [1.0, 500, 1500, "/blog/api/users-397"], "isController": false}, {"data": [1.0, 500, 1500, "/blog/api/users-111"], "isController": false}, {"data": [0.6875, 500, 1500, "/blog/api/newsfeed-373"], "isController": false}, {"data": [0.45121951219512196, 500, 1500, "Open Admin Page"], "isController": true}, {"data": [0.9878048780487805, 500, 1500, "/blog/api/dashboard-374"], "isController": false}, {"data": [1.0, 500, 1500, "/blog/Account/login.aspx-65"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 407, 0, 0.0, 148.57739557739558, 2, 11734, 9.0, 433.2, 574.1999999999999, 1918.1200000000074, 0.5005306608849431, 10.109293064237638, 1.347680197571258], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Add User", 23, 0, 0.0, 8.000000000000002, 4, 48, 5.0, 14.800000000000011, 41.999999999999915, 48.0, 0.04182107127401529, 0.022625853013480933, 0.062044414545914084], "isController": true}, {"data": ["Open Home Page", 6, 0, 0.0, 767.8333333333334, 87, 3739, 195.0, 3739.0, 3739.0, 3739.0, 0.007416416980628319, 1.0561525803414271, 0.06289831373854164], "isController": true}, {"data": ["/blog/api/packages-372", 41, 0, 0.0, 47.73170731707317, 2, 1208, 3.0, 36.60000000000005, 428.99999999999943, 1208.0, 0.051930023659825415, 0.011714683071698897, 0.059131257409527765], "isController": false}, {"data": ["/blog/api/users/processchecked/delete-120", 25, 0, 0.0, 30.999999999999993, 2, 426, 6.0, 90.00000000000011, 335.0999999999998, 426.0, 0.033040375338663844, 0.005872410460582832, 0.05554784039846693], "isController": false}, {"data": ["/blog/admin/-371", 41, 0, 0.0, 129.51219512195118, 73, 1227, 92.0, 154.2000000000001, 277.1999999999999, 1227.0, 0.052009864114716, 3.1173598124061286, 0.5308588755150245], "isController": false}, {"data": ["/blog/api/customfields-396", 44, 0, 0.0, 4.727272727272726, 2, 39, 3.0, 7.5, 21.25, 39.0, 0.058003722784389616, 0.013084824182806641, 0.06768989133529843], "isController": false}, {"data": ["Delete User", 25, 0, 0.0, 30.999999999999993, 2, 426, 6.0, 90.00000000000011, 335.0999999999998, 426.0, 0.03303448139167663, 0.005871362903598776, 0.05553793143032698], "isController": true}, {"data": ["Open Users Tab", 44, 0, 0.0, 14.72727272727273, 8, 73, 11.0, 26.0, 43.25, 73.0, 0.058014276786114545, 0.2935504893965724, 0.2008970951987912], "isController": true}, {"data": ["/blog/api/users/admin-395", 44, 0, 0.0, 5.25, 2, 46, 3.5, 5.5, 21.25, 46.0, 0.05800249938042785, 0.040613078179459736, 0.06542274100038493], "isController": false}, {"data": ["Login", 6, 0, 0.0, 855.8333333333333, 190, 3126, 301.0, 3126.0, 3126.0, 3126.0, 0.007422766118536627, 0.9139208295497846, 0.18690172311783396], "isController": true}, {"data": ["/blog/Account/login.aspx-284", 6, 0, 0.0, 143.83333333333334, 73, 270, 107.5, 270.0, 270.0, 270.0, 0.0074510373706779326, 0.41608659176511353, 0.019915516878462405], "isController": false}, {"data": ["/blog-29", 6, 0, 0.0, 767.8333333333334, 87, 3739, 195.0, 3739.0, 3739.0, 3739.0, 0.007417022065640645, 1.056238748918351, 0.06290344543853142], "isController": false}, {"data": ["/blog/api/setup-375", 41, 0, 0.0, 61.14634146341465, 20, 292, 35.0, 122.20000000000002, 196.7999999999999, 292.0, 0.05215342775223814, 0.011765079893327158, 0.06132102247431125], "isController": false}, {"data": ["Logout", 4, 0, 0.0, 304.0, 199, 429, 294.0, 429.0, 429.0, 429.0, 0.005612569911573962, 1.1666787139602854, 0.06140940750905728], "isController": true}, {"data": ["/blog/Account/login.aspx-93", 5, 0, 0.0, 243.8, 85, 750, 130.0, 750.0, 750.0, 750.0, 0.009334383762652757, 0.753634809037177, 0.2521031095865988], "isController": false}, {"data": ["/blog/api/users-397", 44, 0, 0.0, 4.749999999999999, 3, 14, 4.0, 8.5, 12.75, 14.0, 0.05799875302680992, 0.23977778156746904, 0.06774073107428191], "isController": false}, {"data": ["/blog/api/users-111", 23, 0, 0.0, 8.000000000000002, 4, 48, 5.0, 14.800000000000011, 41.999999999999915, 48.0, 0.041818866126900264, 0.022624659994436275, 0.0620411430596137], "isController": false}, {"data": ["/blog/api/newsfeed-373", 40, 0, 0.0, 625.8, 417, 1955, 521.5, 1158.0, 1488.2499999999995, 1955.0, 0.0526455715861321, 0.020153382872816195, 0.059946031708427765], "isController": false}, {"data": ["Open Admin Page", 41, 0, 0.0, 1163.5365853658536, 540, 11734, 721.0, 1573.000000000001, 4368.7999999999965, 11734.0, 0.05117675327187962, 6.819540070383638, 0.7552776514395022], "isController": true}, {"data": ["/blog/api/dashboard-374", 41, 0, 0.0, 31.536585365853664, 7, 753, 9.0, 23.0, 80.69999999999996, 753.0, 0.05209875382322258, 3.7767501488308914, 0.05866197574040589], "isController": false}, {"data": ["/blog/Account/login.aspx-65", 4, 0, 0.0, 304.0, 199, 429, 294.0, 429.0, 429.0, 429.0, 0.005611286541750075, 1.166411941291213, 0.061395365638445165], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 407, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
