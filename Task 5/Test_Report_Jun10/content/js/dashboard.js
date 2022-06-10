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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9773509174311926, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "/blog/api/posts/50451529-51db-4e09-b02b-343b625a373f-240"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "Open Home Page"], "isController": true}, {"data": [0.9958847736625515, 500, 1500, "/blog/api/posts/update/foo-214"], "isController": false}, {"data": [0.9506172839506173, 500, 1500, "/blog/2022/04/01/default-285"], "isController": false}, {"data": [0.9876543209876543, 500, 1500, "Click Edit Button"], "isController": true}, {"data": [0.6428571428571429, 500, 1500, "Login"], "isController": true}, {"data": [0.9958847736625515, 500, 1500, "Submit Changes"], "isController": true}, {"data": [0.9506172839506173, 500, 1500, "Open Predefined Date"], "isController": true}, {"data": [1.0, 500, 1500, "/blog/Account/login.aspx-284"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "/blog-29"], "isController": false}, {"data": [0.9876543209876543, 500, 1500, "/blog/admin/app/editor/editpost.cshtml-237"], "isController": false}, {"data": [1.0, 500, 1500, "Logout"], "isController": true}, {"data": [1.0, 500, 1500, "/blog/Account/login.aspx-93"], "isController": false}, {"data": [1.0, 500, 1500, "/blog/Account/login.aspx-65"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 997, 0, 0.0, 166.16248746238725, 1, 1331, 234.0, 445.0, 462.0, 901.9799999999991, 1.6452172363320732, 28.358168057001745, 16.565376448641004], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/blog/api/posts/50451529-51db-4e09-b02b-343b625a373f-240", 243, 0, 0.0, 3.633744855967078, 1, 21, 3.0, 6.0, 9.799999999999983, 18.24000000000001, 0.41214312730134445, 0.30925475713660594, 0.5047143375350449], "isController": false}, {"data": ["Open Home Page", 7, 0, 0.0, 818.7142857142857, 245, 1331, 979.0, 1331.0, 1331.0, 1331.0, 0.013429926480745322, 1.0799793041235628, 0.11518485214610225], "isController": true}, {"data": ["/blog/api/posts/update/foo-214", 243, 0, 0.0, 11.7119341563786, 3, 675, 6.0, 11.0, 14.799999999999983, 300.8000000000011, 0.41216270080210593, 0.0732554800253743, 0.7486035576807283], "isController": false}, {"data": ["/blog/2022/04/01/default-285", 243, 0, 0.0, 346.3703703703702, 242, 1175, 256.0, 542.1999999999995, 699.8, 896.8000000000006, 0.41183090189272736, 13.775757901793583, 9.87147410835644], "isController": false}, {"data": ["Click Edit Button", 243, 0, 0.0, 277.2592592592592, 234, 1018, 242.0, 447.79999999999995, 457.79999999999995, 987.6000000000001, 0.4119677478418315, 12.665615895491582, 5.867096746302463], "isController": true}, {"data": ["Login", 7, 0, 0.0, 645.1428571428572, 488, 940, 654.0, 940.0, 940.0, 940.0, 0.01343758338500404, 1.6391058482042589, 0.39944191436612037], "isController": true}, {"data": ["Submit Changes", 243, 0, 0.0, 11.7119341563786, 3, 675, 6.0, 11.0, 14.799999999999983, 300.8000000000011, 0.4121620017164936, 0.07325535577382992, 0.7486022879443464], "isController": true}, {"data": ["Open Predefined Date", 243, 0, 0.0, 346.3703703703702, 242, 1175, 256.0, 542.1999999999995, 699.8, 896.8000000000006, 0.4118302039322158, 13.775734554990349, 9.871457378433826], "isController": true}, {"data": ["/blog/Account/login.aspx-284", 7, 0, 0.0, 332.8571428571429, 236, 478, 240.0, 478.0, 478.0, 478.0, 0.013499883322437, 1.1353970647155478, 0.03641088787286195], "isController": false}, {"data": ["/blog-29", 7, 0, 0.0, 818.7142857142857, 245, 1331, 979.0, 1331.0, 1331.0, 1331.0, 0.013477374376430767, 1.083794868224972, 0.11559179993222805], "isController": false}, {"data": ["/blog/admin/app/editor/editpost.cshtml-237", 243, 0, 0.0, 273.6255144032923, 232, 1011, 238.0, 444.6, 452.79999999999995, 982.4800000000001, 0.4119705415632502, 12.356576530097586, 5.362633546057629], "isController": false}, {"data": ["Logout", 4, 0, 0.0, 257.25, 249, 271, 254.5, 271.0, 271.0, 271.0, 0.014646059660724029, 0.4608717357594531, 0.16024848870971878], "isController": true}, {"data": ["/blog/Account/login.aspx-93", 7, 0, 0.0, 312.2857142857143, 250, 462, 263.0, 462.0, 462.0, 462.0, 0.013562658513571376, 0.5136856912015159, 0.3665796628177779], "isController": false}, {"data": ["/blog/Account/login.aspx-65", 4, 0, 0.0, 257.25, 249, 271, 254.5, 271.0, 271.0, 271.0, 0.014646059660724029, 0.4608717357594531, 0.16024848870971878], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 997, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
