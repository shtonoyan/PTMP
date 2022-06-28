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

    var data = {"OkPercent": 99.35223330442324, "KoPercent": 0.6477666955767563};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5589371980676329, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5378862428655776, 500, 1500, "Complete Search Field and Search"], "isController": true}, {"data": [0.8374443995147594, 500, 1500, "Add Comment"], "isController": true}, {"data": [0.5504950495049505, 500, 1500, "Open Home Page"], "isController": true}, {"data": [0.5347407587155221, 500, 1500, "Open Post"], "isController": true}, {"data": [0.5466181818181818, 500, 1500, "/blog/2022/04/01/default-285"], "isController": false}, {"data": [0.5335099032703823, 500, 1500, "/blog/2022/04/02/default-12"], "isController": false}, {"data": [0.5350091827364555, 500, 1500, "Open Random Page"], "isController": true}, {"data": [0.5478099335158388, 500, 1500, "Open Predefined Date"], "isController": true}, {"data": [0.530796048808832, 500, 1500, "Open Contacts"], "isController": true}, {"data": [0.5496031746031746, 500, 1500, "/blog-29"], "isController": false}, {"data": [0.5330789836837405, 500, 1500, "/blog/post/post-12-25"], "isController": false}, {"data": [0.5459932279909706, 500, 1500, "Open Random Date"], "isController": true}, {"data": [0.8378487666801455, 500, 1500, "/blog/post/post-22-53"], "isController": false}, {"data": [0.5299941758881771, 500, 1500, "/blog/contact-30"], "isController": false}, {"data": [0.5367153572838531, 500, 1500, "/blog/search-149"], "isController": false}, {"data": [0.553409090909091, 500, 1500, "Open Large Calendar"], "isController": true}, {"data": [0.552901023890785, 500, 1500, "/blog/calendar/default.aspx-40"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 36896, 239, 0.6477666955767563, 1320.746341066786, 0, 21092, 1882.0, 4201.9000000000015, 4977.0, 5886.990000000002, 27.385892732154, 836.2336414874082, 293.1104159762237], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Complete Search Field and Search", 5081, 21, 0.41330446762448336, 1366.8004329856342, 0, 7661, 741.0, 3522.6000000000004, 4280.199999999997, 5540.080000000002, 3.7863883771812157, 119.28506893871393, 44.330300574618526], "isController": true}, {"data": ["Add Comment", 2473, 2, 0.08087343307723413, 424.6583097452488, 71, 3036, 279.0, 969.5999999999999, 1205.0, 1758.9399999999955, 2.169937806230608, 6.247767296984024, 5.974151496076914], "isController": true}, {"data": ["Open Home Page", 3030, 12, 0.39603960396039606, 1321.9042904290436, 0, 7760, 682.0, 3494.8, 4225.049999999995, 5511.6900000000005, 2.2457003731716627, 89.7707143624768, 22.278223191488575], "isController": true}, {"data": ["Open Post", 12363, 54, 0.4367871875758311, 1408.4366254145475, 0, 21092, 738.0, 3654.0, 4464.199999999997, 5742.360000000001, 10.323404894912198, 321.8205138517477, 119.24775192551375], "isController": true}, {"data": ["/blog/2022/04/01/default-285", 6875, 32, 0.46545454545454545, 1340.985454545454, 78, 7123, 714.0, 3510.800000000001, 4248.5999999999985, 5457.919999999998, 5.115205590343087, 162.3299130201141, 55.18583509939682], "isController": false}, {"data": ["/blog/2022/04/02/default-12", 4342, 19, 0.4375863657300783, 1398.1598341777994, 80, 6902, 730.5, 3602.4000000000005, 4463.699999999999, 5585.57, 3.6606072460127033, 108.11064704020471, 40.879142441155864], "isController": false}, {"data": ["Open Random Page", 4356, 19, 0.4361799816345271, 1397.7571166207542, 0, 7904, 726.0, 3605.0, 4467.799999999996, 5624.1500000000015, 3.6660371451366935, 107.92303266237322, 40.80820109462475], "isController": true}, {"data": ["Open Predefined Date", 5114, 22, 0.4301916308173641, 1331.4956980836917, 0, 8037, 716.0, 3477.0, 4157.0, 5454.350000000004, 3.799575018202892, 120.28315973641098, 40.93248143490794], "isController": true}, {"data": ["Open Contacts", 1721, 8, 0.46484601975595585, 1411.5148169668782, 0, 8145, 774.0, 3580.0, 4505.799999999999, 5978.179999999998, 1.284476935764958, 44.28077064184663, 16.73931018490012], "isController": true}, {"data": ["/blog-29", 3024, 12, 0.3968253968253968, 1320.4398148148148, 80, 6706, 685.5, 3494.0, 4233.75, 5499.25, 2.2446372542979534, 89.90624890978474, 22.311858535893784], "isController": false}, {"data": ["/blog/post/post-12-25", 12319, 54, 0.4383472684471142, 1405.6666125497245, 84, 21092, 747.0, 3654.0, 4451.0, 5635.0, 10.304147588784296, 322.3674971213274, 119.45043174992138], "isController": false}, {"data": ["Open Random Date", 1772, 10, 0.5643340857787811, 1378.2246049661392, 0, 6647, 704.5, 3666.0, 4472.0, 5624.049999999999, 1.3186260392923772, 41.882511045446456, 14.19745327904977], "isController": true}, {"data": ["/blog/post/post-22-53", 2473, 2, 0.08087343307723413, 423.0832996360696, 71, 2904, 279.0, 968.1999999999998, 1196.5999999999967, 1733.6799999999957, 2.17364935774946, 6.258453736998096, 5.9843699322898996], "isController": false}, {"data": ["/blog/contact-30", 1717, 8, 0.46592894583576006, 1403.9778683750715, 86, 6857, 778.0, 3580.8, 4504.2, 5772.059999999998, 1.2833986369215176, 44.34666947262183, 16.764221697350756], "isController": false}, {"data": ["/blog/search-149", 5066, 21, 0.4145282273983419, 1364.534938807738, 81, 6868, 744.0, 3518.6000000000004, 4260.65, 5463.949999999999, 3.7805321251948665, 119.45322239221828, 44.39279199288931], "isController": false}, {"data": ["Open Large Calendar", 880, 0, 0.0, 1263.3386363636373, 0, 6070, 646.0, 3334.699999999999, 3922.599999999998, 5166.0, 0.6584307948082733, 32.32580936833853, 7.206466302465898], "isController": true}, {"data": ["/blog/calendar/default.aspx-40", 879, 0, 0.0, 1264.7758816837325, 89, 6070, 650.0, 3339.0, 3924.0, 5166.0, 0.6625691401073679, 32.56598917629427, 7.2600101340477625], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Assertion failed", 239, 100.0, 0.6477666955767563], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 36896, 239, "Assertion failed", 239, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Complete Search Field and Search", 31, 14, "Assertion failed", 14, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Open Home Page", 12, 4, "Assertion failed", 4, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Open Post", 92, 44, "Assertion failed", 44, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["/blog/2022/04/01/default-285", 6875, 32, "Assertion failed", 32, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["/blog/2022/04/02/default-12", 4342, 19, "Assertion failed", 19, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Open Random Page", 23, 9, "Assertion failed", 9, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Open Predefined Date", 19, 6, "Assertion failed", 6, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Open Contacts", 13, 8, "Assertion failed", 8, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["/blog-29", 3024, 12, "Assertion failed", 12, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["/blog/post/post-12-25", 12319, 54, "Assertion failed", 54, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Open Random Date", 8, 6, "Assertion failed", 6, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["/blog/post/post-22-53", 2473, 2, "Assertion failed", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["/blog/contact-30", 1717, 8, "Assertion failed", 8, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["/blog/search-149", 5066, 21, "Assertion failed", 21, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
