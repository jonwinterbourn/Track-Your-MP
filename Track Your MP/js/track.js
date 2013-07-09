// JavaScript Document
// Wait for PhoneGap to load
document.addEventListener("deviceready", onDeviceReady, false);

// PhoneGap is ready
function onDeviceReady() {
    getLocation();
    navigator.splashscreen.hide();

    //add local storage
    localStorageApp = new localStorageApp();
	localStorageApp.run();

    mpSet = check4MP();
    if (!mpSet) {
        noMP();        
    }

    
}

function noMP() {
        $("h1#nomp").show();
        $("h1#mpName").hide();
        $("div.mpDetails").hide();
        $("li#mpActivity").hide();
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
		/*
        document.getElementById("insertVariable").addEventListener("click", function() {
			that._insertVariable.apply(that, arguments);
		});
		document.getElementById("searchVariable").addEventListener("click", function() {
			that._getVariable.apply(that, arguments);
		});
		document.getElementById("clearLocalStorage").addEventListener("click", function() {
			that._clearLocalStorage.apply(that, arguments);
		});
		document.getElementById("removeVariable").addEventListener("click", function() {
			that._removeVariable.apply(that, arguments);
		});
        */
	},
    
    
	_insertVariable:function() {
		var variableNameInput = document.getElementById("variableNameInput"),
		valueInput = document.getElementById("valueInput");
        
		localStorage.setItem(variableNameInput.value, valueInput.value);
		variableNameInput.value = "";
		valueInput.value = "";
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
	}
}

function check4MP() {
    return false;
}

//MP Work //

function findMPFromPostCode() {
    var inputText = document.getElementById('postCode');

//    sayInputElem.style.display = 'none';
//    sayTextElem.innerHTML = '';
//    sayTextElem.style.display = 'block';
    //sayTextElem.innerHTML = "Test me 2";
    
  //need a try in here...
    
    $.getJSON('http://www.theyworkforyou.com/api/getMP?key=GAbXxUAuN3ggAwJjTnEEje9K&postcode=' + inputText.value,function(result){
        
        //$.each(result, function(i, field){
            //$('#yourMP').append(field + ' ');
        $('#foundMP').html("<span class='mp' id='" + result.member_id + "'>You have selected:<br/> " + result.full_name + ", " + result.party + " MP for the " + result.constituency + " constituency. </span> ");
        
        /*
        $('#helloWorldText').append("<div class='fullname'>Constituency: " + result.constituency + "</div> ");
        $('#helloWorldText').append("<div class='fullname'>Party: " + result.party + "</div> ");
        $('#helloWorldText').append("<div class='fullname'>Image: http://www.theyworkforyou.com" + result.img + "</div> ");
        $('#helloWorldText').append("<div class='fullname'>URL: http://www.theyworkforyou.com" + result.url + "</div> ");
        */
        //});
     });
}


  
//=======================Say Hello (Page 1) Operations=======================//
function sayHello() {
    var sayHelloInputElem = document.getElementById('helloWorldInput');
    var sayHelloTextElem = document.getElementById('helloWorldText');
    var inputText = document.getElementById('txtName');
    
    sayHelloTextElem.innerHTML = 'Hello, ' + inputText.value + '!';
    sayHelloTextElem.style.display = 'block';
    sayHelloInputElem.style.display = 'none';
}

function sayHelloReset() {
    var sayHelloInputElem = document.getElementById('helloWorldInput');
    var sayHelloTextElem = document.getElementById('helloWorldText');
    var inputText = document.getElementById('txtName');
    
    inputText.value = '';
    sayHelloTextElem.style.display = 'none';
    sayHelloInputElem.style.display = 'block';
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
                $("#myLocation").html(results[1].formatted_address);
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