/*
    AJAX Loader element
*/
var loader;

/*
    JSON fields to extract 
*/
var headerArray = ["action", "background", "state", "signature_count", "created_at", "government_response_at", "creator_name", "government_response" ];  

/*
    Dictionary of DOM elements for each element in the header array
*/
var dataDictionary; 

/*
    Run when all elements on the page have been loaded
*/
$(document).ready(function()
{
    init(function()
    {
        GetData('https://petition.parliament.uk/petitions/131215.json', null, ApplyPetitionToDOM); 
    }); 
});

/*
    Sets resuable elements into global variables so we do not have to keep finding them in the DOM 
*/
function init(callback)
{
    loader = document.getElementById("loader"); 
    dataDictionary = new Array(); 

    var headerArray = ["action", "background", "state", "signature_count", "created_at", "government_response_at", "creator_name", "government_response" ]; 

    for (var i=0; i<headerArray.length; i++)
    {
        dataDictionary[headerArray[i]] = document.getElementById(headerArray[i]); 
    }

    callback(); 
}

/*
    Makes an ajax call and calls a callback when complete
*/
function GetData(url, data, callback)
{
     $.ajax(
        {
            url: url, 
            data: data,
            type: "GET", 
            dataType: "json", 
            success: callback,
            error: function(err)
            {
                console.log("err");
            }
        }); 
}

/*
    Applies the pertition data recieved into the page
*/
function ApplyPetitionToDOM(data, status, xhr)
{
    loader.style.display = "none"; 

    if (status == "success")
    {
        setPageHeaders(data); 
        setPetitionState(); 
       
        dataDictionary["signature_count"].innerHTML += " Signatures"; 
        dataDictionary["created_at"].innerHTML = dataDictionary["created_at"].innerHTML.replace("T", " ").replace("Z", " "); 


        GenerateWithoutUKChart("signaturesByCountry", data.data.attributes.signatures_by_country); 
        GenerateWithUKChart("signaturesByCountryWithUK", data.data.attributes.signatures_by_country);
    }
    else
    {
        console.warn("ajax call was successful however status was not successful"); 
    }
}

/*
    Extracts the header fields from the return data and sets them to thier relevant DOM elements
    @param JSON data to parse
*/
function setPageHeaders(data)
{
    for (var i=0; i < headerArray.length; i++)
    {
        var currentElement = dataDictionary[headerArray[i]];  
        if (currentElement != null)
        {
                currentElement.innerHTML = data.data.attributes[headerArray[i]]; 
        }
    }
}

/*
    Sets the Petition state to upper case and adds appropiate styling
*/
function setPetitionState()
{
        var state = dataDictionary["state"]; 
        state.innerHTML = state.innerHTML.toUpperCase(); 
        if(state.innerHTML == "OPEN")
        {
            state.className += "openState"; 
        }
        else
        {
            state.className += "closedState"; 
        }
}

/*
    Generates a chart without UK data
    @param data to be applied to chart
*/
function GenerateWithoutUKChart(currentChartID, data)
{
    var countries = []; 
    var plots = []; 
    var color = []; 

    for(var i=0; i<data.length; i++)
    {
        if(data[i].name != "United Kingdom")
        {
            countries.push(data[i].name);  
            plots.push(data[i].signature_count); 
            color.push('rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')'); 
        }
    }

    GenerateChart(currentChartID, countries, plots, color, "Signatures without UK"); 
}

/*
    Generates a chart with UK data
    @param data to be applied to chart
*/
function GenerateWithUKChart(currentChartID, data)
{
    var countries = []; 
    var plots = []; 
    var color = []; 

    for(var i=0; i<data.length; i++)
    {
        countries.push(data[i].name);  
        plots.push(data[i].signature_count); 
        color.push('rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')'); 
    }

    GenerateChart(currentChartID, countries, plots, color, "Signatures with UK"); 
}

/*
    Generates a chart 
*/
function GenerateChart(currentChartID, countries, plots, color, title)
{
    var canvas = document.getElementById(currentChartID); 

    var chart = new Chart(canvas, 
    {
        type: 'pie', 
        data: 
        {
            labels: countries,
            datasets: [
            {
                label: '# of Signatures',
                data: plots,
                backgroundColor: color,
                borderColor: color,
                borderWidth: 1
            }]
        },
        options: 
        {
            legend: 
            {
                display: false,
            },
            title:
            {
                text: title,
                display: true,
            }
        }
    }); 
}