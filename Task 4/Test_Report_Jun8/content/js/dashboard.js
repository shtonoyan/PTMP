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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9243697478991597, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Add User"], "isController": true}, {"data": [0.9090909090909091, 500, 1500, "Open Home Page"], "isController": true}, {"data": [1.0, 500, 1500, "/blog/api/packages-372"], "isController": false}, {"data": [1.0, 500, 1500, "/blog/api/users/processchecked/delete-120"], "isController": false}, {"data": [0.973404255319149, 500, 1500, "/blog/admin/-371"], "isController": false}, {"data": [1.0, 500, 1500, "/blog/api/customfields-396"], "isController": false}, {"data": [1.0, 500, 1500, "Delete User"], "isController": true}, {"data": [1.0, 500, 1500, "Open Users Tab"], "isController": true}, {"data": [1.0, 500, 1500, "/blog/api/users/admin-395"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "Login"], "isController": true}, {"data": [1.0, 500, 1500, "/blog/Account/login.aspx-284"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "/blog-29"], "isController": false}, {"data": [0.9574468085106383, 500, 1500, "/blog/api/setup-375"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "Logout"], "isController": true}, {"data": [1.0, 500, 1500, "/blog/Account/login.aspx-93"], "isController": false}, {"data": [1.0, 500, 1500, "/blog/api/users-397"], "isController": false}, {"data": [1.0, 500, 1500, "/blog/api/users-111"], "isController": false}, {"data": [0.6117021276595744, 500, 1500, "/blog/api/newsfeed-373"], "isController": false}, {"data": [0.4521276595744681, 500, 1500, "Open Admin Page"], "isController": true}, {"data": [1.0, 500, 1500, "/blog/api/dashboard-374"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "/blog/Account/login.aspx-65"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 949, 0, 0.0, 184.91359325605933, 1, 18933, 5.0, 489.0, 605.0, 1066.0, 1.1120016498401717, 19.966346552414063, 2.913921357667304], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Add User", 58, 0, 0.0, 5.362068965517241, 3, 21, 5.0, 8.100000000000001, 12.099999999999994, 21.0, 0.10135766849401727, 0.05483608236883357, 0.1509937775347718], "isController": true}, {"data": ["Open Home Page", 11, 0, 0.0, 293.8181818181818, 113, 684, 228.0, 652.4000000000001, 684.0, 684.0, 0.013651622991815231, 1.253049072542863, 0.12039218941006373], "isController": true}, {"data": ["/blog/api/packages-372", 94, 0, 0.0, 6.468085106382979, 1, 335, 2.0, 5.0, 9.0, 335.0, 0.1118097236396682, 0.02522270132887046, 0.12775134439298025], "isController": false}, {"data": ["/blog/api/users/processchecked/delete-120", 76, 0, 0.0, 5.197368421052633, 1, 39, 4.0, 7.299999999999997, 11.149999999999991, 39.0, 0.09383978831719329, 0.016678556126688653, 0.15831364575603385], "isController": false}, {"data": ["/blog/admin/-371", 94, 0, 0.0, 188.2021276595745, 99, 1744, 119.0, 266.0, 457.0, 1744.0, 0.11225797360026846, 3.6476808969322523, 1.1511655404295897], "isController": false}, {"data": ["/blog/api/customfields-396", 101, 0, 0.0, 2.5049504950495054, 1, 21, 2.0, 3.0, 4.0, 20.720000000000056, 0.12281501747986016, 0.027705340857273143, 0.14380391206870344], "isController": false}, {"data": ["Delete User", 76, 0, 0.0, 5.197368421052633, 1, 39, 4.0, 7.299999999999997, 11.149999999999991, 39.0, 0.09348346449719426, 0.01661522513524351, 0.15771250498168463], "isController": true}, {"data": ["Open Users Tab", 101, 0, 0.0, 9.36633663366337, 5, 53, 8.0, 12.0, 13.899999999999991, 52.80000000000004, 0.12192854745676365, 0.6841209627013329, 0.4236540740734034], "isController": true}, {"data": ["/blog/api/users/admin-395", 101, 0, 0.0, 3.6534653465346523, 2, 33, 3.0, 5.0, 7.0, 32.5000000000001, 0.12237380958150582, 0.08568556784173795, 0.1385070754931301], "isController": false}, {"data": ["Login", 11, 0, 0.0, 341.45454545454544, 235, 664, 308.0, 616.8000000000002, 664.0, 664.0, 0.013659234387495096, 1.2723884843806654, 0.40881419141678543], "isController": true}, {"data": ["/blog/Account/login.aspx-284", 11, 0, 0.0, 162.90909090909088, 100, 361, 154.0, 330.0000000000001, 361.0, 361.0, 0.01371314592033909, 0.4573317120395188, 0.03798263845602443], "isController": false}, {"data": ["/blog-29", 11, 0, 0.0, 293.8181818181818, 113, 684, 228.0, 652.4000000000001, 684.0, 684.0, 0.013703766916365911, 1.2578352357951113, 0.1208520410515025], "isController": false}, {"data": ["/blog/api/setup-375", 94, 0, 0.0, 920.2978723404252, 84, 18933, 109.5, 281.5, 4903.25, 18933.0, 0.1130599927593494, 0.025504744460361044, 0.133375460208295], "isController": false}, {"data": ["Logout", 9, 0, 0.0, 494.0, 294, 1377, 364.0, 1377.0, 1377.0, 1377.0, 0.013480036066585387, 2.187185582839315, 0.1485173504914222], "isController": true}, {"data": ["/blog/Account/login.aspx-93", 11, 0, 0.0, 178.54545454545456, 124, 303, 147.0, 294.0, 303.0, 303.0, 0.013775812428537974, 0.8238263594848347, 0.3741471030562266], "isController": false}, {"data": ["/blog/api/users-397", 101, 0, 0.0, 3.2079207920792077, 2, 24, 3.0, 4.799999999999997, 6.0, 23.64000000000007, 0.12328650073849834, 0.5776038837536467, 0.14447636805292774], "isController": false}, {"data": ["/blog/api/users-111", 58, 0, 0.0, 5.362068965517241, 3, 21, 5.0, 8.100000000000001, 12.099999999999994, 21.0, 0.10135766849401727, 0.05483608236883357, 0.1509937775347718], "isController": false}, {"data": ["/blog/api/newsfeed-373", 94, 0, 0.0, 602.2021276595744, 471, 1657, 567.5, 712.5, 803.25, 1657.0, 0.11344395325626386, 0.04342776335591351, 0.1296185794041296], "isController": false}, {"data": ["Open Admin Page", 94, 0, 0.0, 1727.627659574469, 679, 19815, 854.5, 1440.5, 6583.25, 19815.0, 0.11128435164434468, 15.311539904245143, 1.6525025605019872], "isController": true}, {"data": ["/blog/api/dashboard-374", 94, 0, 0.0, 10.457446808510634, 7, 36, 9.0, 14.5, 20.25, 36.0, 0.11267416549197856, 11.747590447238524, 0.12730860300216718], "isController": false}, {"data": ["/blog/Account/login.aspx-65", 9, 0, 0.0, 494.0, 294, 1377, 364.0, 1377.0, 1377.0, 1377.0, 0.013537865409550513, 2.196568607081507, 0.1491544897954579], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 949, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
