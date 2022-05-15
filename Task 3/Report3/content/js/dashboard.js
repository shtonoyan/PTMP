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

    var data = {"OkPercent": 95.42375449075878, "KoPercent": 4.576245509241224};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9332169369649, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4620253164556962, 500, 1500, "Open Home Page"], "isController": true}, {"data": [0.45124167171411267, 500, 1500, "/blog/2022/04/01/default-285"], "isController": false}, {"data": [0.07547169811320754, 500, 1500, "/blog/calendar/default.aspx-67"], "isController": false}, {"data": [0.9965635738831615, 500, 1500, "Navigate to a Random Page"], "isController": true}, {"data": [0.20479041916167665, 500, 1500, "Open Predefined Date"], "isController": true}, {"data": [0.4620253164556962, 500, 1500, "/blog-29"], "isController": false}, {"data": [0.2673992673992674, 500, 1500, "Open Random Date"], "isController": true}, {"data": [0.45069605568445475, 500, 1500, "/blog/search-112"], "isController": false}, {"data": [0.8529411764705882, 500, 1500, "/blog/post/post-22-53"], "isController": false}, {"data": [0.4361111111111111, 500, 1500, "/blog/contact-30"], "isController": false}, {"data": [0.28688524590163933, 500, 1500, "Open Large Calendar"], "isController": true}, {"data": [0.4935370152761457, 500, 1500, "/blog/calendar/default.aspx-40"], "isController": false}, {"data": [0.3584905660377358, 500, 1500, "Open Main Page"], "isController": true}, {"data": [0.8705757432751298, 500, 1500, "Add Comment"], "isController": true}, {"data": [0.4519675925925926, 500, 1500, "Click Search Button"], "isController": true}, {"data": [0.4517441860465116, 500, 1500, "Complete Search Field and Search"], "isController": true}, {"data": [0.39757761053621826, 500, 1500, "Open Post"], "isController": true}, {"data": [0.4858490566037736, 500, 1500, "/blog/2022/04/02/default-12"], "isController": false}, {"data": [0.48654104979811574, 500, 1500, "Open Random Page"], "isController": true}, {"data": [0.48654104979811574, 500, 1500, "Select Random page"], "isController": true}, {"data": [0.9932985544278042, 500, 1500, "/blog-21"], "isController": false}, {"data": [0.437984496124031, 500, 1500, "Open Contacts"], "isController": true}, {"data": [0.43259085580304807, 500, 1500, "/blog/post/post-12-25"], "isController": false}, {"data": [0.4491822429906542, 500, 1500, "/blog/search-149"], "isController": false}, {"data": [0.9932985544278042, 500, 1500, "Go to Previous Month"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 92412, 4229, 4.576245509241224, -3.576468072102106E7, -1652549753888, 360118, 64.0, 187.90000000000146, 246.0, 365.0, 153.93866906984144, 473.09611363402587, 403.58708561736967], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Open Home Page", 158, 81, 51.265822784810126, 35909.72784810127, 75, 360118, 361.5, 184971.09999999998, 278466.29999999976, 355688.27999999997, 0.26321971015844825, 54.803925979764564, 146.84057540682437], "isController": true}, {"data": ["/blog/2022/04/01/default-285", 1651, 835, 50.57540884312538, 333.0775287704417, 2, 1982, 250.0, 695.5999999999999, 860.7999999999997, 1294.2400000000002, 2.762130537854238, 89.52795568409576, 24.696017684494763], "isController": false}, {"data": ["/blog/calendar/default.aspx-67", 53, 48, 90.56603773584905, 277.60377358490575, 2, 1290, 32.0, 1013.8, 1083.3999999999996, 1290.0, 0.14679773211352726, 2.317354971457535, 0.7713778308765487], "isController": false}, {"data": ["Navigate to a Random Page", 291, 1, 0.3436426116838488, 4.810996563573883, 0, 1400, 0.0, 0.0, 0.0, 0.0, 0.5050250863835865, 0.10206969443812923, 0.009451933347969227], "isController": true}, {"data": ["Open Predefined Date", 835, 606, 72.57485029940119, 1054.2455089820355, 0, 6163, 770.0, 2204.2, 2541.6, 3279.159999999999, 1.4074844460326639, 129.08785309054508, 36.5428437448905], "isController": true}, {"data": ["/blog-29", 158, 81, 51.265822784810126, 309.0379746835443, 2, 1200, 210.0, 714.4, 854.5999999999988, 1178.1699999999998, 0.2666702672778704, 29.185876665845278, 1.6882035036970964], "isController": false}, {"data": ["Open Random Date", 819, 556, 67.88766788766789, 882.3809523809529, 0, 4421, 679.0, 1728.0, 2070.0, 2691.1999999999944, 1.3679136560874663, 94.41056879538834, 28.082845432124593], "isController": true}, {"data": ["/blog/search-112", 862, 436, 50.580046403712295, 321.64037122969813, 2, 1816, 238.5, 684.4000000000001, 859.5499999999997, 1169.37, 1.4565042546145164, 45.140361858724155, 12.952414489513846], "isController": false}, {"data": ["/blog/post/post-22-53", 850, 118, 13.882352941176471, 141.9600000000001, 0, 718, 107.0, 303.79999999999995, 383.89999999999986, 565.98, 1.4455511886682393, 3.8897268051745635, 3.475412967933423], "isController": false}, {"data": ["/blog/contact-30", 900, 472, 52.44444444444444, 361.90333333333365, 2, 1975, 273.5, 777.6999999999999, 947.6499999999995, 1436.7900000000002, 1.517458358413548, 65.87540631528232, 15.961760167919413], "isController": false}, {"data": ["Open Large Calendar", 854, 549, 64.28571428571429, 904.5070257611244, 0, 3471, 696.0, 1827.0, 2105.5, 2636.050000000002, 1.4540872792903237, 105.10582677802184, 32.508112996117895], "isController": true}, {"data": ["/blog/calendar/default.aspx-40", 851, 386, 45.35840188014101, 343.6639247943592, 2, 1852, 247.0, 726.4000000000002, 901.5999999999998, 1293.9200000000014, 1.45288288841996, 47.184795318080624, 14.037779996867169], "isController": false}, {"data": ["Open Main Page", 901, 522, 57.93562708102109, -3.668256327255272E9, -1652549753888, 3316, 473.0, 1273.4000000000005, 1601.6, 2348.7200000000003, 1.5636687382529604, 78.98934261212078, 23.48589010237605], "isController": true}, {"data": ["Add Comment", 4238, 510, 12.033978291647003, 160.3928739971687, 0, 972, 125.0, 339.0, 410.0, 559.6099999999997, 7.110213339954768, 18.854089945540935, 17.240087285397554], "isController": true}, {"data": ["Click Search Button", 864, 436, 50.46296296296296, 323.1469907407405, 0, 1816, 237.0, 687.0, 870.0, 1196.3000000000009, 1.4578095736244452, 45.07623142410617, 12.934013131253481], "isController": true}, {"data": ["Complete Search Field and Search", 860, 434, 50.46511627906977, 358.93604651162764, 0, 2303, 244.0, 794.9, 979.9499999999999, 1385.0399999999995, 1.4534416992423513, 43.17744458119754, 14.602750075946554], "isController": true}, {"data": ["Open Post", 4252, 2288, 53.80997177798683, 517.7577610536217, 0, 3956, 385.0, 1098.7000000000003, 1288.6999999999998, 1687.4700000000003, 7.115793983371936, 273.0664744327405, 84.71160472335511], "isController": true}, {"data": ["/blog/2022/04/02/default-12", 742, 350, 47.16981132075472, 355.4487870619945, 3, 1772, 262.0, 748.4000000000001, 893.1000000000001, 1187.8500000000004, 1.2553759529521638, 46.612280898723135, 12.479353099653503], "isController": false}, {"data": ["Open Random Page", 743, 350, 47.10632570659489, 354.97039030955585, 0, 1772, 261.0, 748.2, 892.7999999999997, 1187.7999999999997, 1.255466262934851, 46.55289437091086, 12.463453739320933], "isController": true}, {"data": ["Select Random page", 743, 350, 47.10632570659489, 354.97039030955585, 0, 1772, 261.0, 748.2, 892.7999999999997, 1187.7999999999997, 1.2554789914262445, 46.553366345453576, 12.463580099517408], "isController": true}, {"data": ["/blog-21", 84534, 551, 0.6518087396787091, 66.36677549861622, 1, 604, 64.0, 187.0, 244.0, 358.0, 234.65371269951424, 43.31478519691186, 241.89349030621096], "isController": false}, {"data": ["Open Contacts", 903, 472, 52.270210409745296, 360.7009966777411, 0, 1975, 271.0, 776.8000000000001, 946.5999999999997, 1436.1600000000008, 1.5215545131025556, 65.83378130623686, 15.951674333940776], "isController": true}, {"data": ["/blog/post/post-12-25", 853, 446, 52.28604923798359, 348.5533411488862, 0, 1663, 234.0, 821.6, 990.0999999999992, 1287.6000000000004, 1.4486846351114961, 51.06595260727145, 13.748862576106895], "isController": false}, {"data": ["/blog/search-149", 856, 434, 50.700934579439256, 359.273364485981, 2, 1754, 245.5, 796.5000000000003, 983.7499999999994, 1365.8699999999994, 1.4487774247981275, 43.239999088167245, 14.623906210596555], "isController": false}, {"data": ["Go to Previous Month", 84534, 551, 0.6518087396787091, 66.36682281685482, 1, 604, 120.0, 249.0, 297.0, 393.0, 234.6530613377895, 43.31466496189463, 241.8928188480046], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in path at index 22: http://192.168.2.178/${SELECTED_POST_g1}", 133, 3.1449515251832585, 0.14392070293901224], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1141, 26.980373610782692, 1.2346881357399473], "isController": false}, {"data": ["Non HTTP response code: java.net.URISyntaxException", 2, 0.04729250413809411, 0.002164221096827252], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException", 33, 0.7803263182785528, 0.035709648097649656], "isController": false}, {"data": ["Assertion failed", 2920, 69.04705604161741, 3.159762801367788], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 92412, 4229, "Assertion failed", 2920, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1141, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in path at index 22: http://192.168.2.178/${SELECTED_POST_g1}", 133, "Non HTTP response code: java.net.BindException", 33, "Non HTTP response code: java.net.URISyntaxException", 2], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Open Home Page", 29, 29, "Non HTTP response code: java.net.BindException", 29, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["/blog/2022/04/01/default-285", 1651, 835, "Assertion failed", 691, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 144, null, null, null, null, null, null], "isController": false}, {"data": ["/blog/calendar/default.aspx-67", 53, 48, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 32, "Assertion failed", 16, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Open Predefined Date", 11, 10, "Assertion failed", 9, "Non HTTP response code: java.net.BindException", 1, null, null, null, null, null, null], "isController": false}, {"data": ["/blog-29", 158, 81, "Assertion failed", 52, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 29, null, null, null, null, null, null], "isController": false}, {"data": ["Open Random Date", 10, 8, "Assertion failed", 7, "Non HTTP response code: java.net.BindException", 1, null, null, null, null, null, null], "isController": false}, {"data": ["/blog/search-112", 862, 436, "Assertion failed", 356, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 80, null, null, null, null, null, null], "isController": false}, {"data": ["/blog/post/post-22-53", 850, 118, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in path at index 22: http://192.168.2.178/${SELECTED_POST_g1}", 66, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 41, "Assertion failed", 11, null, null, null, null], "isController": false}, {"data": ["/blog/contact-30", 900, 472, "Assertion failed", 386, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 86, null, null, null, null, null, null], "isController": false}, {"data": ["Open Large Calendar", 8, 5, "Assertion failed", 3, "Non HTTP response code: java.net.BindException", 2, null, null, null, null, null, null], "isController": false}, {"data": ["/blog/calendar/default.aspx-40", 851, 386, "Assertion failed", 332, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 54, null, null, null, null, null, null], "isController": false}, {"data": ["Open Main Page", 5, 3, "Assertion failed", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Click Search Button", 4, 2, "Assertion failed", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Complete Search Field and Search", 5, 1, "Assertion failed", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Open Post", 27, 14, "Assertion failed", 12, "Non HTTP response code: java.net.URISyntaxException", 2, null, null, null, null, null, null], "isController": false}, {"data": ["/blog/2022/04/02/default-12", 742, 350, "Assertion failed", 327, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 23, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["/blog-21", 84534, 551, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 551, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["/blog/post/post-12-25", 853, 446, "Assertion failed", 345, "Non HTTP response code: java.net.URISyntaxException/Non HTTP response message: Illegal character in path at index 22: http://192.168.2.178/${SELECTED_POST_g1}", 67, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 34, null, null, null, null], "isController": false}, {"data": ["/blog/search-149", 856, 434, "Assertion failed", 367, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 67, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
