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
    Number of elements to display in the top x countries in terms of signatures
*/  
var limit = 10; 

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

    for (var i=0; i < headerArray.length; i++)
    {
        dataDictionary[headerArray[i]] = document.getElementById(headerArray[i]); 
    }

    registerURLButton(); 
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

        var orderedArray = sort(data.data.attributes.signatures_by_country, function(a, b)
        {
            if (a.signature_count > b.signature_count)
            {
                return -1; 
            }
            else if (a.signature_count == b.signature_count)
            {
                return 0; 
            }
            else
            {
                return 1; 
            } 
        }); 

        setLargestSignatureCounts(orderedArray); 
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
            state.className += " openState"; 
        }
        else
        {
            state.className += " closedState"; 
        }
}

/*
    Generates a chart without UK data
    @currentChartID: DOM element ID
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
    @currentChartID: DOM element ID
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
    @currentChartID: DOM element ID
    @countries: Labels of countries to plot 
    @plots: data to plot 
    @color: colors to plot 
    @title: title of the chart 
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

/*
    Performs a sort on the data array in desc if orderDesc is true, else ascending
    @data: data array to sort 
    @swapCriteria: comparison function
*/
function sort(data, swapCriteria)
{
    return data.sort(swapCriteria); 
}

/*
    Sets the Largest Signature Counts to the DOM unordered list
*/
function setLargestSignatureCounts(orderedArray)
{
    var list = document.getElementById("signatureList"); 

    for (var i=0; i < orderedArray.length && i < limit; i++)
    {
        var newNode = document.createElement("li"); 
        var textNode = document.createTextNode(orderedArray[i].name + " (" + orderedArray[i].signature_count + ")"); 
        newNode.appendChild(textNode); 
        list.appendChild(newNode); 
    } 
}

/*
    Registers the URL Button with a click event
*/
function registerURLButton()
{
    var urlButton = document.getElementById("currentURLButton"); 
    urlButton.addEventListener('click', function()
    {
        var urlLink = document.getElementById("currentURL").value; 
        if (urlLink)
        {
            GetData(urlLink, null, ApplyPetitionToDOM); 
        }
    }); 
}