function GetStatus()
{
    console.log("GetStatus is requested");

    fetch('http://www.dxsummit.fi/api/v1/spots', { timeout : 2000})
        .then((response) => { return response.json()})
        .then((data) => {            
            console.log(data);
        })
        .catch((err) => {
            console.log("Client Error: "+err);
        });
}