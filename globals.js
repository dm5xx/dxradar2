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