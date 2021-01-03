function updateSwitchControl(myJsonData)
{
    let cmd = getCommand(myJsonData.qrg);
    //console.log("I detected the following command: ", cmd);

    if(cmd == null)
    {
        //console.log("Frequency <-> bandnumber could not be determined; because no relay defined for this frequency: ", myJsonData.qrg);        
        templateDef.Z2 = '<td class="qrg">{{qrg}}</td>';
        return;
    }

    let str = cmd.join(",");
    templateDef.Z2 = '<td class="qrg"><a onclick="switchRelay(&quot;'+str+'&quot;)">{{qrg}}</a></td>';
}

function getCommand(qrg) {
    let wert = parseFloat(qrg);
//    console.log("I parsed this frequency: ", wert);

    for(let a = 0; a < switchSet.Def.length; a++)
    {
        if(switchSet.Def[a].MF < qrg)
            continue;
        
        if(switchSet.Def[a].MF > qrg &&  qrg > switchSet.Def[a].mf)
        {
            return switchSet.Def[a].V;
        }        
    }

    return null;
}

async function switchRelay(cmd)
{
    console.log("Clicked and got cmd " + cmd);

    
    if(cmd == null || cmd == "")
    {
        console.log("Frequency <-> bandnumber could not be determined; because no relay defined for this frequency!");        
        return;
    }

    let owncmd = cmd.split(",");

    const status = await GetStatus(switchSet.IP+":"+switchSet.Port);

    // switch on requested pin, other pins switch off
    let statusArray = GetOrderedArraybyValue(status["B"+switchSet.Bank]);

    for(let a = 0; a < switchSet.Def.length; a++)
    {
        // switch the stuff off in the array...
        for(let f=0; f < switchSet.Def[a].V.length; f++)
        {
            if(switchSet.Def[a].V[f] > 0)
                statusArray[(switchSet.Def[a].V[f])-1] = 0;
            else
                statusArray[((switchSet.Def[a].V[f])*(-1))-1] = 0;
        }    
    }

    // than handle the requestes command...
    for(let b=0; b < owncmd.length; b++)
    {
        if(owncmd[b]>0)
            statusArray[owncmd[b]-1] = 1;
        else
            statusArray[(owncmd[b]*-1)-1] = 0;
    }

    // convert into array...
    let value = GetValueByOrderedArray(statusArray);

    // fire switch!
    let url = 'http://'+switchSet.IP+":"+switchSet.Port+"/Set"+switchSet.Bank+"/"+value;
    fetch(url, { timeout : 2000})
        .then((response) => { return response.json()})
        .then((data) => {            
            console.log(data);
        })
        .catch((err) => {
            console.log("Client Error: "+err);
        });

}

async function GetStatus(url)
{
    console.log("GetStatus is requested");

    const response = await fetch('http://'+url+'/Get/', { timeout : 2000});
    const result = await response.json();  
    return result;
}

function GetOrderedArraybyValue(value)
{
    var i;
    var feld = [];

    for (i = 0; i < 16; i++)
    {
        feld[i] = value % 2;
        value = float2int(value/2);
    }

    return feld;
}

function GetValueByOrderedArray(arr)
{
    var result = 0;
    for(var a = 0; a < 16; a++)
    {
            result = result + (arr[a] * 1<<a);
    }
    return parseInt(result);
}

function float2int(value) {
    return  Math.trunc(value);
}

function isKInNSet(n, k) 
{ 
    if (n & (1 << (k))) 
        return true; 
    else
        return false;
} 