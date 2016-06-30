$(document).ready(function()
{
    GetData('https://petition.parliament.uk/petitions/131215.json', null, ApplyPetitionToDOM); 
});

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
    document.getElementById("loader").style.display = "none"; 

    if (status == "success")
    {
        var headerArray = ["action", "background", "state", "signature_count", "created_at", "government_response_at", "creator_name", "government_response" ]; 

        for (var i=0; i<headerArray.length; i++)
        {
            var currentElement = document.getElementById(headerArray[i]); 
            if (currentElement != null)
            {
                 currentElement.innerHTML = data.data.attributes[headerArray[i]]; 
            }
        }

        var state = document.getElementById('state'); 
        state.innerHTML = state.innerHTML.toUpperCase(); 
        if(state.innerHTML == "OPEN")
        {
            state.className += " openState"; 
        }
        else
        {
            state.className += " closedState"; 
        }

        //// JSON of signatures_by_country
        //var signatures_by_country = data.data.attributes.signatures_by_country; 
    }
    else
    {
        console.warn("ajax call was successful however status was not successful"); 
    }
}