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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9983748645720477, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "/blog/api/posts/50451529-51db-4e09-b02b-343b625a373f-240"], "isController": false}, {"data": [0.9, 500, 1500, "Open Home Page"], "isController": true}, {"data": [1.0, 500, 1500, "/blog/api/posts/update/foo-214"], "isController": false}, {"data": [0.9972375690607734, 500, 1500, "Open Post"], "isController": true}, {"data": [0.9972677595628415, 500, 1500, "/blog/2022/04/01/default-285"], "isController": false}, {"data": [1.0, 500, 1500, "Click Edit Button"], "isController": true}, {"data": [1.0, 500, 1500, "Login"], "isController": true}, {"data": [1.0, 500, 1500, "Submit Changes"], "isController": true}, {"data": [0.9972677595628415, 500, 1500, "Open Predefined Date"], "isController": true}, {"data": [1.0, 500, 1500, "/blog/Account/login.aspx-284"], "isController": false}, {"data": [0.9, 500, 1500, "/blog-29"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [0.9972375690607734, 500, 1500, "/blog/post/post-12-25"], "isController": false}, {"data": [1.0, 500, 1500, "/blog/admin/app/editor/editpost.cshtml-237"], "isController": false}, {"data": [1.0, 500, 1500, "Logout"], "isController": true}, {"data": [1.0, 500, 1500, "/blog/Account/login.aspx-93"], "isController": false}, {"data": [1.0, 500, 1500, "/blog/Account/login.aspx-65"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1108, 0, 0.0, 60.34747292418777, 0, 645, 72.5, 144.0, 185.0, 283.31000000000336, 1.4972629007171456, 48.84504817541353, 16.538363202298054], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/blog/api/posts/50451529-51db-4e09-b02b-343b625a373f-240", 181, 0, 0.0, 4.839779005524862, 2, 39, 3.0, 7.600000000000023, 16.0, 36.54000000000002, 0.25057729686626096, 0.18979732268195235, 0.3068593069045813], "isController": false}, {"data": ["Open Home Page", 5, 0, 0.0, 322.4, 122, 636, 205.0, 636.0, 636.0, 636.0, 0.010064776904155144, 1.6584334432658592, 0.08400943472186996], "isController": true}, {"data": ["/blog/api/posts/update/foo-214", 181, 0, 0.0, 3.6906077348066337, 1, 61, 2.0, 6.800000000000011, 11.800000000000011, 33.12000000000023, 0.25134036623485184, 0.0446718229050225, 0.45254392728348275], "isController": false}, {"data": ["Open Post", 181, 0, 0.0, 142.36464088397796, 87, 582, 121.0, 205.80000000000007, 223.40000000000003, 473.7600000000009, 0.24911090802990435, 29.046222470922153, 6.472176758812471], "isController": true}, {"data": ["/blog/2022/04/01/default-285", 183, 0, 0.0, 113.67213114754095, 80, 645, 95.0, 187.39999999999998, 198.39999999999995, 382.91999999999894, 0.2496899342210288, 8.251845130159406, 5.98500211358095], "isController": false}, {"data": ["Click Edit Button", 181, 0, 0.0, 88.2817679558011, 74, 252, 79.0, 112.0, 126.70000000000002, 233.14000000000016, 0.2490910241907294, 9.675659037565953, 3.5463377684609476], "isController": true}, {"data": ["Login", 5, 0, 0.0, 235.4, 182, 284, 251.0, 284.0, 284.0, 284.0, 0.010067046529889061, 1.376391375938752, 0.2985626459721747], "isController": true}, {"data": ["Submit Changes", 181, 0, 0.0, 3.6906077348066337, 1, 61, 2.0, 6.800000000000011, 11.800000000000011, 33.12000000000023, 0.25059707175244883, 0.04453971392475165, 0.4512056090131875], "isController": true}, {"data": ["Open Predefined Date", 183, 0, 0.0, 113.75409836065579, 80, 645, 95.0, 187.39999999999998, 198.39999999999995, 382.91999999999894, 0.24893725556878082, 8.629049056282945, 5.966960604063935], "isController": true}, {"data": ["/blog/Account/login.aspx-284", 5, 0, 0.0, 96.6, 72, 117, 104.0, 117.0, 117.0, 117.0, 0.010113125420958845, 0.6648333097781788, 0.02669509571567555], "isController": false}, {"data": ["/blog-29", 5, 0, 0.0, 322.4, 122, 636, 205.0, 636.0, 636.0, 636.0, 0.010103194023758671, 1.664763661665249, 0.08433009761706066], "isController": false}, {"data": ["Debug Sampler", 182, 0, 0.0, 0.08241758241758244, 0, 1, 0.0, 0.0, 1.0, 1.0, 0.2491379416551794, 0.40461387725712816, 0.0], "isController": false}, {"data": ["/blog/post/post-12-25", 181, 0, 0.0, 142.36464088397796, 87, 582, 121.0, 205.80000000000007, 223.40000000000003, 473.7600000000009, 0.24976541369983996, 29.12253754458865, 6.489181539610587], "isController": false}, {"data": ["/blog/admin/app/editor/editpost.cshtml-237", 181, 0, 0.0, 83.44198895027618, 72, 246, 75.0, 107.80000000000001, 112.9, 228.78000000000014, 0.24979574712389868, 9.513827857176867, 3.2504687767391856], "isController": false}, {"data": ["Logout", 3, 0, 0.0, 205.33333333333331, 92, 429, 95.0, 429.0, 429.0, 429.0, 0.006317757954057264, 0.19894562213594974, 0.06912515636450936], "isController": true}, {"data": ["/blog/Account/login.aspx-93", 5, 0, 0.0, 138.8, 90, 194, 134.0, 194.0, 194.0, 194.0, 0.010153789292626114, 0.7207445215229872, 0.27433277864028577], "isController": false}, {"data": ["/blog/Account/login.aspx-65", 3, 0, 0.0, 205.33333333333331, 92, 429, 95.0, 429.0, 429.0, 429.0, 0.00634578164165371, 0.19982808550411948, 0.06943177491512517], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1108, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
