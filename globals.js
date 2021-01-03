var lastCallingId = '0';
var globalJsonData = [];
var collectivJsonArray = new Array();
var templating = '<tr class="red">' +
    '<td class="spc">{{spc}}</td>' +
    '<td class="qrg">{{qrg}}</td>' +
    '<td class="dxc">{{dxc}}</td>' +
    '<td class="tim">{{tim}}</td>' +
    '<td class="com">{{com}}</td>' +
    //'<td class="ide">{{ide}}</td>' +
    //'<td class="con">{{con}}</td>' +
    '<td class="inf">{{inf}}</td>' +
    '<td class="bea" style="width:80px">{{bea}}°</td>' +
    '<td class="lop">({{lop}}°)</td>' +
    '<td class="dis">{{dis}}</td>' +
    '<td class="map">{{{map}}}</td>' +
    '</tr>';

var bigmap;
var markers = [];
var spotmarkers = [];
var dxPath = [];
var isInit = false;
var isCleanup = false;
var showOnly;
var autoClean = 0;
var infoWindow;

var ownLocator;
var ownSwitchIp;
var ownSwitchType;

var colorSet = {};

// "all_geometry_color": "#1a4d2e",
// "all_labels_color": "#4acd4c",
// "landscape_geometry_color": "#00ff3e",
// "poi_geometry_color": "#005727",
// "poi_park_geometry_color": "#003f02",
// "road_all_color": "#005f20",
// "water_all_color": "#000000",
// "water_fill_color": "#4acd4c"

var switchSet = {
    "IP" : "192.168.97.209",
    "Port": "59",
    "B160" : { "Bank" : 0, "Pin" : 0},
    "B80" : { "Bank" : 0, "Pin" : 1},
    "B60" : { "Bank" : 0, "Pin" : 2},
    "B40" : { "Bank" : 0, "Pin" : 3},
    "B30" : { "Bank" : 0, "Pin" : 4},
    "B20" : { "Bank" : 0, "Pin" : 5},
    "B17" : { "Bank" : 0, "Pin" : 6},
    "B15" : { "Bank" : 0, "Pin" : 7},
    "B12" : { "Bank" : 0, "Pin" : 8},
    "B10" : { "Bank" : 0, "Pin" : 9},
    "B6" : { "Bank" : 0, "Pin" : 10},
}