var lastCallingId = '0';
var globalJsonData = [];
var collectivJsonArray = new Array();

var templateDef = {
    Z1 : '<tr class="red"><td class="spc">{{spc}}</td>',
    Z2 : '<td class="qrg">{{qrg}}</td>',
    Z3 : '<td class="dxc">{{dxc}}</td>',
    Z4 : '<td class="tim">{{tim}}</td><td class="com">{{com}}</td><td class="inf">{{inf}}</td>',
    Z5 : '<td class="bea" style="width:80px">{{bea}}°</td>',
    Z6 : '<td class="lop">({{lop}}°)</td>',
    Z7 : '<td class="dis">{{dis}}</td><td class="map">{{{map}}}</td></tr>'
}

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
var isExpanded = false;

var switchSet = {
    IP : "192.168.97.209",
    Port: "59",
    Bank: 0,
    Def : [
            {   
                n : 1600, mf : 1800, MF : 2000, V : [1]
            },
            {   
                n : 800, mf : 3500, MF : 3570, V : [2,11]
            },
            {   
                n : 801, mf : 3570, MF : 3800, V : [2,-11]
            },
            {   
                n : 600, mf : 5000, MF : 5500, V : [3]
            },
            {   
                n : 400, mf : 7000, MF : 7300, V : [4]
            },
            {   
                n : 300, mf : 10000, MF : 11000, V : [5]
            },
            {   
                n : 200, mf : 14000, MF : 15000, V : [12]
            },
            {   
                n : 170, mf : 18000, MF : 19000, V : [7]
            },
            {   
                n : 150, mf : 21000, MF : 22000, V : [8]
            },
            {   
                n : 120, mf : 24000, MF : 25000, V : [9]
            },
            {   
                n : 100, mf : 28000, MF : 30000, V : [10]
            }
        ]
}
