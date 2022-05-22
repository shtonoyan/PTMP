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

    var data = {"OkPercent": 81.76388847825444, "KoPercent": 18.236111521745556};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8135583185316756, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.91671048480387, 500, 1500, "Add Comment"], "isController": true}, {"data": [0.7946003176283748, 500, 1500, "Complete Search Field and Search"], "isController": true}, {"data": [0.7710980036297641, 500, 1500, "Open Home Page"], "isController": true}, {"data": [0.7613278791692889, 500, 1500, "Open Post"], "isController": true}, {"data": [0.7697144354204873, 500, 1500, "/blog/2022/04/01/default-285"], "isController": false}, {"data": [0.8020226259856017, 500, 1500, "/blog/2022/04/02/default-12"], "isController": false}, {"data": [0.8021545827633378, 500, 1500, "Open Random Page"], "isController": true}, {"data": [0.7772251308900524, 500, 1500, "Open Predefined Date"], "isController": true}, {"data": [0.7711442786069652, 500, 1500, "Open Contacts"], "isController": true}, {"data": [0.7715909090909091, 500, 1500, "/blog-29"], "isController": false}, {"data": [0.7607255520504732, 500, 1500, "/blog/post/post-12-25"], "isController": false}, {"data": [0.7630344108446299, 500, 1500, "Open Random Date"], "isController": true}, {"data": [0.9165349351881126, 500, 1500, "/blog/post/post-22-53"], "isController": false}, {"data": [0.770802192326856, 500, 1500, "/blog/contact-30"], "isController": false}, {"data": [0.7951296982530439, 500, 1500, "/blog/search-149"], "isController": false}, {"data": [0.7800937988535696, 500, 1500, "Open Large Calendar"], "isController": true}, {"data": [0.7795193312434692, 500, 1500, "/blog/calendar/default.aspx-40"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 67646, 12336, 18.236111521745556, 136.9992017266329, 0, 2387, 145.0, 210.0, 258.0, 888.0, 37.57843886656949, 842.5726043422329, 298.1784815267303], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Add Comment", 19018, 1568, 8.244820696182565, 87.78073404143471, 0, 1166, 78.0, 137.0, 152.0, 246.62000000000262, 10.614174370937992, 28.422727690518514, 26.91661335534155], "isController": true}, {"data": ["Complete Search Field and Search", 3778, 754, 19.95764955002647, 159.23769190047636, 2, 2235, 147.0, 194.0, 220.04999999999973, 585.0, 2.120618156263401, 54.42749532396119, 22.405761671608975], "isController": true}, {"data": ["Open Home Page", 4408, 982, 22.277676950998185, 160.353448275862, 0, 2230, 147.0, 193.0, 225.0, 655.8299999999981, 2.4485406519961606, 89.23841291530204, 21.69487891583197], "isController": true}, {"data": ["Open Post", 19068, 4448, 23.327040067128173, 153.4729389553173, 0, 2387, 147.0, 193.0, 220.0, 547.9300000000039, 10.629094330703746, 327.8099023279852, 107.18094286945413], "isController": true}, {"data": ["/blog/2022/04/01/default-285", 7634, 1732, 22.687974849358135, 154.3107152213776, 0, 1241, 146.0, 193.0, 215.0, 396.8499999999967, 4.248536608984369, 114.84193454400024, 40.52043986496677], "isController": false}, {"data": ["/blog/2022/04/02/default-12", 5834, 1122, 19.2320877613987, 158.51422694549166, 2, 1232, 146.0, 191.0, 218.0, 522.0, 3.2517642521081567, 98.96205574247966, 33.2991241828089], "isController": false}, {"data": ["Open Random Page", 5848, 1122, 19.186046511627907, 158.78488372093005, 0, 2057, 146.0, 191.0, 218.55000000000018, 527.1000000000022, 3.2546840346283243, 98.81378849214852, 33.24923466157797], "isController": true}, {"data": ["Open Predefined Date", 3820, 838, 21.93717277486911, 158.15863874345547, 0, 2135, 147.0, 194.0, 215.0, 446.4299999999994, 2.123504583045428, 63.21606284774472, 20.478612466250453], "isController": true}, {"data": ["Open Contacts", 4020, 902, 22.437810945273633, 161.12786069651762, 0, 1175, 149.0, 202.9000000000001, 231.0, 479.21999999999935, 2.299650132830538, 73.73959812326811, 26.960044821368097], "isController": true}, {"data": ["/blog-29", 4400, 982, 22.318181818181817, 158.82590909090902, 2, 1220, 147.0, 193.0, 225.0, 638.2299999999832, 2.444270629644114, 89.24475830677041, 21.696421553078448], "isController": false}, {"data": ["/blog/post/post-12-25", 19020, 4448, 23.38590956887487, 153.63080967402686, 0, 1197, 147.0, 193.0, 220.0, 547.0, 10.614342756213325, 328.18108415961416, 107.30230472706575], "isController": false}, {"data": ["Open Random Date", 3836, 894, 23.305526590198124, 150.59019812304467, 0, 1200, 145.0, 191.0, 215.0, 348.3000000000011, 2.161196162355636, 52.18984056811965, 20.265480224224103], "isController": true}, {"data": ["/blog/post/post-22-53", 18978, 1568, 8.26219833491411, 87.96574981557617, 0, 1166, 78.0, 137.0, 152.0, 247.0, 10.60276773692532, 28.45202521530412, 26.94435841047874], "isController": false}, {"data": ["/blog/contact-30", 4014, 902, 22.47135027404086, 161.36870951669178, 2, 1175, 149.0, 203.0, 231.0, 480.29999999999836, 2.299613121888089, 73.84863318678599, 26.999909294112154], "isController": false}, {"data": ["/blog/search-149", 3778, 754, 19.95764955002647, 158.1445209105346, 2, 1250, 147.0, 194.0, 220.0, 578.0, 2.1230873668996177, 54.49086974615956, 22.431850548038085], "isController": false}, {"data": ["Open Large Calendar", 3838, 826, 21.521625846795207, 157.07087024491926, 0, 1152, 146.0, 190.0, 219.0, 509.45000000000573, 2.1594845145042187, 60.17996321160866, 21.083053108732127], "isController": true}, {"data": ["/blog/calendar/default.aspx-40", 3828, 826, 21.577847439916404, 157.48119122257063, 2, 1152, 146.0, 190.0, 219.0, 513.9500000000016, 2.1567703884665748, 60.26133898755462, 21.111561763680957], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in path at index 22: http://192.168.2.178/${SELECTED_POST_g1}", 1842, 14.931906614785992, 2.7229991425952753], "isController": false}, {"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in path at index 22: http://192.168.2.178/${RANDOM_DATE_HREF}", 98, 0.7944228274967574, 0.14487183277651303], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 2232, 18.09338521400778, 3.29952990568548], "isController": false}, {"data": ["Assertion failed", 8164, 66.18028534370947, 12.06871064068829], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 67646, 12336, "Assertion failed", 8164, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 2232, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in path at index 22: http://192.168.2.178/${SELECTED_POST_g1}", 1842, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in path at index 22: http://192.168.2.178/${RANDOM_DATE_HREF}", 98, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Open Post", 50, 2, "Assertion failed", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["/blog/2022/04/01/default-285", 7634, 1732, "Assertion failed", 1300, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 334, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in path at index 22: http://192.168.2.178/${RANDOM_DATE_HREF}", 98, null, null, null, null], "isController": false}, {"data": ["/blog/2022/04/02/default-12", 5834, 1122, "Assertion failed", 968, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 154, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["/blog-29", 4400, 982, "Assertion failed", 760, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 222, null, null, null, null, null, null], "isController": false}, {"data": ["/blog/post/post-12-25", 19020, 4448, "Assertion failed", 3042, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in path at index 22: http://192.168.2.178/${SELECTED_POST_g1}", 924, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 482, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["/blog/post/post-22-53", 18978, 1568, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in path at index 22: http://192.168.2.178/${SELECTED_POST_g1}", 918, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 560, "Assertion failed", 90, null, null, null, null], "isController": false}, {"data": ["/blog/contact-30", 4014, 902, "Assertion failed", 742, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 160, null, null, null, null, null, null], "isController": false}, {"data": ["/blog/search-149", 3778, 754, "Assertion failed", 594, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 160, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["/blog/calendar/default.aspx-40", 3828, 826, "Assertion failed", 666, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 160, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
