// JavaScript Document
// Wait for PhoneGap to load
document.addEventListener("deviceready", onDeviceReady, false);

// PhoneGap is ready
function onDeviceReady() {
    getLocation();
    navigator.splashscreen.hide();

    //disable unused links til needed
    //$('a#mpActivityMenuLink').addClass('ui-disabled');
    $('a#aboutAppMenuLink').addClass('ui-disabled');
    
    //add local storage
    localStorageApp = new localStorageApp();
	localStorageApp.run();
    
    //test
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        // Great success! All the File APIs are supported.
    
        //alert("all ok");
    } else {
        alert('The File APIs are not fully supported in this browser.');
    }

    mpSet = check4MP();
    
    if (!mpSet) {
        noMP();        
    }
    else
    {
        okMP();
    }
    
}

function noMP() {
        $("h1#nomp").show();
        $("h1#mpName").hide();
        $("div.mpDetails").hide();
        $("li#mpActivity").hide();
}

function okMP() {
    $("h1#nomp").hide();
        $("h1#mpName").show();
        $("div.mpDetails").show();
        $("li#mpActivity").show();
    
    //set name & details
    $("h1#mpName").text(localStorage.getItem("mpName"));
    $("div#mpConstituency").text("Constituency: " + localStorage.getItem("mpConstituency"));
    $("div#mpParty").text("Party: " + localStorage.getItem("mpParty"));
    $("div#enteredHouse").text("Entered House: " + localStorage.getItem("enteredHouse"));
    
    portrait = $("#mpPortrait");
    mpImg = document.createElement("IMG");
    if (localStorage.getItem("portrait")) {
        mpImg.setAttribute("src", localStorage.getItem("portrait"));
    }
    else {
        mpImg.setAttribute("src", localStorage.getItem("mpImage"));
    }
    
    portrait.html(mpImg);
    //set activity
    
     
}

function getLocation() {
    myNewFunction();
}
  
function myNewFunction(){
    navigator.geolocation.getCurrentPosition(onGeolocationSuccess, onGeolocationError);
}


function localStorageApp() {
}


localStorageApp.prototype = {

    run:function() {
		var that = this;
		
        document.getElementById("saveMP").addEventListener("click", function() {
			that._insertVariable.apply(that, arguments);
		});

		document.getElementById("clearMP").addEventListener("click", function() {
			that._clearLocalStorage.apply(that, arguments);
		});
        
	},
    
    
	_insertVariable:function() {
		
		valueInputName = $("#mpNameValue").val();
        valueInputConst = $("#mpConstValue").val();
        valueInputParty = $("#mpPartyValue").val();
        valueInputId = $("#mpIdValue").val();
        valueInputMemberId = $("#member_id").val();
        valueInputImage = $("#mpImage").val();
        valueInputEntered = $("#enteredHouse").val();
        fullImgUrl = "http://www.theyworkforyou.com" + valueInputImage;
        //alert(valueInput);

        //TODO : need to clear storage if already existant
        
        localStorage.setItem("mpName", valueInputName);
        localStorage.setItem("mpConstituency", valueInputConst);
        localStorage.setItem("mpParty", valueInputParty);
        localStorage.setItem("mpId", valueInputId);
        localStorage.setItem("member_id", valueInputMemberId);
        localStorage.setItem("mpImage", fullImgUrl);
        localStorage.setItem("enteredHouse", valueInputEntered);
        
        var xhr = new XMLHttpRequest(),
        fileReader = new FileReader();
 
        xhr.open("GET", fullImgUrl, true);
        // Set the responseType to blob
        xhr.responseType = "blob";
 
        xhr.addEventListener("load", function () {
            if (xhr.status === 200) {
            // onload needed since Google Chrome doesn't support addEventListener for FileReader
                fileReader.onload = function (evt) {
                    // Read out file contents as a Data URL
                    var result = evt.target.result;
                    try {
                        localStorage.setItem("portrait", result);
                    }
                    catch (e) {
                        console.log("Storage failed: " + e);
                    }
                };
                // Load blob as Data URL
                fileReader.readAsDataURL(xhr.response);
                //return result
            }
        }, false);
        // Send XHR
        xhr.send();
        
        //set content on home page
        $("h1#mpName").text(valueInputName);
        $("div#mpConstituency").text("Constituency: " + valueInputConst);
        $("div#mpParty").text("Party: " + valueInputParty);
        //$("div#enteredHouse").text("Entered House: " + localStorage.getItem("enteredHouse"));
        portrait = $("#mpPortrait");
        mpImg = document.createElement("IMG");
        mpImg.setAttribute("src", fullImgUrl);
        portrait.html(mpImg);
        
        $("h1#nomp").hide();
        $("h1#mpName").show();
        $("div.mpDetails").show();
        $("li#mpActivity").show();
        //setTimeout($.mobile.changePage('#home'),1000);
        
        setTimeout("goHome()",1000);
        $.mobile.showPageLoadingMsg();
    },
    
	_getVariable:function() {
		var getRemoveVariableNameInput = document.getElementById("getRemoveVariableNameInput"),
		result = document.getElementById("result");
		if (localStorage.getItem(getRemoveVariableNameInput.value) != undefined) {
			result.value = localStorage.getItem(getRemoveVariableNameInput.value);
		}
		else {
			result.value = "No such record!"
		}
	},
    
	_removeVariable:function() {
		var searchRemoveNameInput = document.getElementById("getRemoveVariableNameInput"),
		result = document.getElementById("result");
		if (localStorage.getItem(searchRemoveNameInput.value) != undefined) {
			localStorage.removeItem(searchRemoveNameInput.value);
			result.value = "Deleted";
		}
		else {
			result.value = "No such record!";
		}
	},

    
	_clearLocalStorage:function() {
		localStorage.clear();
        noMP();
	}
}

function goHome(){
    $.mobile.hidePageLoadingMsg();
    $.mobile.changePage('#home');
}

function check4MP() {
    //alter
    if (localStorage.getItem("mpName")=== null) {
        return false;
    }
    else {
        if (localStorage.getItem("mpName").length > 1) {
            return true;
        }
        else {
            return false;
        }
    }
}

//MP Work //

function findMPFromPostCode() {
    var inputText = document.getElementById('postCode');
    
     $.getJSON('http://www.theyworkforyou.com/api/getMP?key=GAbXxUAuN3ggAwJjTnEEje9K&postcode=' + inputText.value,function(result){
        
        if (result.person_id !=null) {
            $('#foundMP').html("<span class='mp' id='" + result.person_id + "'>You have selected:<br/> " + result.full_name + ", " + result.party + " MP for the " + result.constituency + " constituency. </span> ");
            setHiddenFields(result); 
        }
        else {
            $('#foundMP').html("Postcode provided cannot be resolved to a <strong>full</strong> UK postcode - please check the input.");
        }

     });
}

function findMPFromGeo() {
    var geoText = document.getElementById('geoPostCode').innerHTML.replace(" ","");
  
    $.getJSON('http://www.theyworkforyou.com/api/getMP?key=GAbXxUAuN3ggAwJjTnEEje9K&postcode=' + geoText,function(result){
    
        if (result.person_id !=null) {
            $('#foundMP').html("<span class='mp' id='" + result.person_id + "'>You have selected:<br/> " + result.full_name + ", " + result.party + " MP for the " + result.constituency + " constituency. </span> ");
            setHiddenFields(result); 
        }
        else {
            $('#foundMP').html("Geolocation cannot be resolved to a <strong>full</strong> UK postcode at this time.");
        }
        
    });
    
}

function setHiddenFields(result) {
           
//        imgAsDataURL = getImgAsData("http://www.theyworkforyou.com" + result.image);
//        alert(imgAsDataURL);
//        $('#mp_portrait').val(imgAsDataURL);

        $('#mpNameValue').val(result.full_name);
        $('#mpConstValue').val(result.constituency);
        $('#mpPartyValue').val(result.party);
        $('#mpIdValue').val(result.person_id);
        //secondary fields
        $('#enteredHouse').val(result.entered_house);
        $('#mpImage').val(result.image);
        $('#member_id').val(result.member_id);
}



    
    
    
    



//=======================Geolocation Operations=======================//
// onGeolocationSuccess Geolocation
function onGeolocationSuccess(position) {
    // Use Google API to get the location data for the current coordinates
    var geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    geocoder.geocode({ "latLng": latlng }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if ((results.length > 1) && results[1]) {
                
                places_postal = results[1].address_components;
                postCode = "";
                for (var i = 0; i < places_postal.length; i++ ) {
                        if (places_postal[i].types == "postal_code"){
                            postCode = places_postal[i].long_name;
                        }
                }
                
                $("#myLocation").html(results[1].formatted_address);
                $("#geoPostCode").html(postCode);
            }
        }
    });
    
    // Use Google API to get a map of the current location
    // http://maps.googleapis.com/maps/api/staticmap?size=280x300&maptype=hybrid&zoom=16&markers=size:mid%7Ccolor:red%7C42.375022,-71.273729&sensor=true
    var googleApis_map_Url = 'http://maps.googleapis.com/maps/api/staticmap?size=300x300&maptype=hybrid&zoom=16&sensor=true&markers=size:mid%7Ccolor:red%7C' + latlng;
    var mapImg = '<img src="' + googleApis_map_Url + '" />';
    $("#map_canvas").html(mapImg);
}

// onGeolocationError Callback receives a PositionError object
function onGeolocationError(error) {
    $("#myLocation").html("<span class='err'>" + error.message + "</span>");
}


var activities;


$('#activityListPage').live('pageshow', function(event) {
	getActivityList();
});

function getActivityList() {

    
    //id = 0;
	
    id = localStorage.getItem("mpId");
    //alert(id);
    moreUrlPrefix = "http://www.theyworkforyou.com";
    url = 'http://www.theyworkforyou.com/api/getHansard?key=GAbXxUAuN3ggAwJjTnEEje9K&person=' + id + '&num=10&order=d';
 
    
     $.getJSON(url,function(result){
        $('#activityList li').remove();
		activities = result.rows;
        $.each(activities, function(index, activity){
            activHeader =  activity.parent.body;
            activExtract = activity.extract;
            activUrl = activity.listurl;
            if (activity.htime != null) {
                activDateStr = activity.hdate + " " + activity.htime;  
            }
            else {
                activDateStr = activity.hdate;
            }
            $('#activityList').append("<li data-role='list-divider'>" + activHeader + "</li>");
            $('#activityList').append("<li class='activityExtract'><span clas='datestr'>"+ activDateStr + "</span><br/>" + activExtract + "</li>");
            $('#activityList').append("<li><a rel='external' href='" + moreUrlPrefix + activUrl + "' data-role='button' data-icon='arrow-r'>Read more...</a></li>");
        });
        $('#activityList').listview('refresh');
     });
//}
}

function openHansardURL(url) {

    navigator.app.loadUrl(url, { openExternal:true } );
    
}