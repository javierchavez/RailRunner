/**
 * Created by javierAle on 4/4/14.
 */




// Station data from server
var sData;
var day;
var trainNum;
var directionArray = [];
var allTrips = [];
var selected = null;
var current_trip = {}
var direction = "Northbound";


// Helper to find unique stations
var unique = function(origArr) {
    var newArr = [],
        origLen = origArr.length,
        found,
        x, y;

    for ( x = 0; x < origLen; x++ ) {
        found = undefined;
        for ( y = 0; y < newArr.length; y++ ) {
            if ( origArr[x] === newArr[y] ) {
                found = true;
                break;
            }
        }
        if ( !found) newArr.push( origArr[x] );
    }
    return newArr;
};
// Helper to remove a given elem from array
Array.prototype.removeByIndex = function(index) {
    this.splice(index, 1);
};
// Helper to get the current day with respect to train sch.
getDay = function(){
    var d=new Date();
    var weekday = new Array(7);
    weekday[0]="Sunday";
    weekday[1]="Weekday";
    weekday[2]="Weekday";
    weekday[3]="Weekday";
    weekday[4]="Weekday";
    weekday[5]="Weekday";
    weekday[6]="Saturday";

    return weekday[d.getDay()];
}
calcPrice = function(duration, from, destination){
    //var from = $("#stationListFrom").val();
    //var destination =  $("#stationListTo").val();
    var zoneFrom = 0;
    var zoneTo = 0;

    from = from.substr(3);
    destination = destination.substr(3);

    switch (from) {
        case 'Santa Fe Depot':
        case 'South Capitol':
        case 'Zia Road':
            zoneFrom = 1;
            break;
        case 'SF County / NM 599':
            zoneFrom = 2;
            break;
        case 'Kewa':
            zoneFrom = 3;
            break;
        case 'Sandoval/ US 550':
        case 'Downtown Bernalillo':
            zoneFrom = 4;
            break;
        case 'Sandia Pueblo':
        case 'Los Ranchos / JC':
        case 'Downtown ABQ':
        case 'Bernalillo County':
        case 'Isleta Pueblo':
            zoneFrom = 5;
            break;
        case 'Los Lunas':
        case 'Belen':
            zoneFrom = 6;
            break;
    }

    switch (destination) {
        case 'Santa Fe Depot':
        case 'South Capitol':
        case 'Zia Road':
            zoneTo = 1;
            break;
        case 'SF County / NM 599':
            zoneTo = 2;
            break;
        case 'Kewa':
            zoneTo = 3;
            break;
        case 'Sandoval/ US 550':
        case 'Downtown Bernalillo':
            zoneTo = 4;
            break;
        case 'Sandia Pueblo':
        case 'Los Ranchos / JC':
        case 'Downtown ABQ':
        case 'Bernalillo County':
        case 'Isleta Pueblo':
            zoneTo = 5;
            break;
        case 'Los Lunas':
        case 'Belen':
            zoneTo = 6;
            break;
    }

    var zones = Math.abs(zoneFrom - zoneTo) + 1;
    //var duration = $('input[name=radio-duration]:checked').val();
    var type = 'Regular';
    var price = '$';
    var discountPrice = '$';

    switch(zones) {
        case 1:
            if (duration == 'One-Trip') {
                discountPrice = '1';
                price = '1';}
            else if (duration == 'Day') {
                discountPrice = '2';
                price = '3';}
            else if (duration == 'Month') {
                discountPrice = '19';
                price = '39';}
            else if (duration == 'Annual') {
                discountPrice = '187';
                price = '385';}
            break;
        case 2:
            if (duration == 'One-Trip') {
                discountPrice = '1';
                price = '3';}
            else if (duration == 'Day') {
                discountPrice = '2';
                price = '4';}
            else if (duration == 'month') {
                discountPrice = '28';
                price = '55';}
            else if (duration == 'annual') {
                discountPrice = '275';
                price = '550';}
            break;
        case 3:
            if (duration == 'One-Trip') {
                discountPrice = '2';
                price = '5';}
            else if (duration == 'Day') {
                discountPrice = '3';
                price = '6';}
            else if (duration == 'Month') {
                discountPrice = '36';
                price = '72';}
            else if (duration == 'Annual') {
                discountPrice = '352';
                price = '715';}
            break;
        case 4:
            if (duration == 'One-Trip') {
                discountPrice = '4';
                price = '8';}
            else if (duration == 'Day') {
                discountPrice = '6';
                price = '9';}
            else if (duration == 'Month') {
                discountPrice = '52';
                price = '105';}
            else if (duration == 'Annual') {
                discountPrice = '517';
                price = '1045';}
            break;
        case 5:
            if (duration == 'One-Trip') {
                discountPrice = '4';
                price = '9';}
            else if (duration == 'Day') {
                discountPrice = '7';
                price = '10';}
            else if (duration == 'Month') {
                discountPrice = '55';
                price = '110';}
            else if (duration == 'Annual') {
                discountPrice = '550';
                price = '1100';}
            break;
        case 6:
            if (duration == 'One-Trip') {
                discountPrice = '5';
                price = '10';}
            else if (duration == 'Day') {
                discountPrice = '8';
                price = '11';}
            else if (duration == 'Month') {
                discountPrice = '121';
                price = '61';}
            else if (duration == 'Annual') {
                discountPrice = '605';
                price = '1210';}
            break;
    }

    //$('#price').text(price);
    //$('#discountPrice').text(discountPrice);


    if(duration == 'Month'){
        price = Number(parseFloat(price) / 30.0).toFixed(2);
        discountPrice = Number(parseFloat(discountPrice) / 30.0).toFixed(2);
    }
    else if(duration == 'Annual'){
        price = Number(parseFloat(price) / 365.0).toFixed(2);
        discountPrice = Number(parseFloat(discountPrice) / 365.0).toFixed(2);
    }

    var foo =[];
    foo.push(price);
    foo.push(discountPrice);

    return [price, discountPrice]
}

//call to get data from server with callback
var ajax = {
    parseJSONP: function(result){
        sData = result;

        day = getDay();

        setDirectionArray(direction, day);
        $("#dir").text(direction)
        swExample();
        return false;
    }
};

// get data from server and handle return
$.ajax({
    type       : "GET",
    url        : "http://dev.appliciti.com/nmrx/config/work/json-all-schedules/",
    dataType   : 'jsonp',
    success    : function(response) {
        console.log("Data loaded successfully");
        ajax.parseJSONP(response);
    },
    error      : function() {
        alert('Not working!');
        console.log("Something went wrong trying to download data");
    }
});

/*
 *
 * Get the row the user clicked
 * */
$(document).ready(function () {
    $('#schedule').on('click', 'tr', function() {

        var id = $(this).attr('id');

        // adjust views
        $("#change-trp-btn").fadeOut();
        $("#set-dir-btn").fadeOut();
        $("#entire-sch").fadeOut();
        $("#dir").fadeOut();
        $("#change-day").fadeOut();
        $("#trip").fadeOut();
        $("#data-entry").delay(500).fadeIn();
        $("#trips-btn").fadeIn();

        detailedSch(parseInt(id));

        return false;
    });
});


// this sets an array that holds all the object associated with direction "Northbound Weekday"
function setDirectionArray(dir, day){

    var dirday = dir + " " + day;

    for(var x =0; x < sData.length; x++){
        if (sData[x]["name"] == dirday){
            directionArray  = sData[x]["data"]
        }
    }
}

function updateFrom(){

    var stations = []
    //getting all the unique station names
    for(var x =0; x < directionArray.length; x++){
        if(stations.indexOf(directionArray[x]["station"]) == -1){
            stations.push(directionArray[x])
        }
    }

    return stations;

}

function updateTo (id, time, userDes){
    // get unique stations
    var stops = [];

    // find the train number associated with time and location
    for(var x =0; x < directionArray.length; x++){
        if(directionArray[x]["id"] == id && directionArray[x]["time"] == time){
            trainNum =  directionArray[x]["train"];
            break;
        }
    }

    // get all the stops of that train
    for(var x =0; x < directionArray.length; x++){
        //console.log(directionArray[x]["train"] );
        if(directionArray[x]["train"].indexOf(trainNum) > -1){
            stops.push(directionArray[x]);
        }
    }


//            removing zero element while not the user's location
    while(stops[0]["id"] != id){
        stops.removeByIndex(0);
    }
    // also remove the object that is the same as the user location
//            stops.removeByIndex(0);


    // remove trailing elements while its ont
    for(var i = stops.length - 1; i >= 0; i--) {
        if(stops[i]["station"] != userDes) {
            stops.removeByIndex(i);
        } else if (stops[i]["station"] == userDes){
            break;
        }

    }
    if(stops.length > 0){
        return stops;
    } else{
        return "Train arrives but does not continue";
    }
}


function updateTimeSelector(arr) {

    // getting the key of the first spinner to get users location
    var id = parseInt(arr.keys[0]);
    var destid = arr.keys[1];



    //console.log(id + " " + destid)

    var destinationStation = arr.values[1];


    destinationStation = (destid.length <= 1)?'0'+destid+" "+destinationStation:destid+" "+destinationStation;

    // get times from given station
    var times = [];
    //getting all the unique station names
    for(var x =0; x < directionArray.length; x++){
        if(directionArray[x]["id"] == id){
            times.push(directionArray[x])
        }
    }

    allTrips = [];

    for(var c=0; c < times.length; c++){
        var t = updateTo(id,times[c]["time"],destinationStation)
        allTrips.push(t)
    }

    $('#trip').text(arr.values[0] + " to "+ arr.values[1]);



    var schl = "";


    for (var c =0; c < times.length; c++){



        if (allTrips[c][allTrips[c].length-1].hasOwnProperty("time") && allTrips[c][0].hasOwnProperty("time")){
            var t1 = new Date();
            var t2 = new Date();

            // setting time
            var pt = allTrips[c][allTrips[c].length-1]["time"].match(/(\d+)(?::(\d\d))?\s*(p?)/i);
            t1.setHours( parseInt(pt[1]) + (pt[3] ? 12 : 0) );
            t1.setMinutes( parseInt(pt[2]) || 0 );

            // setting time time 2
            var pt2 = times[c]["time"].match(/(\d+)(?::(\d\d))?\s*(p?)/i);
            t2.setHours( parseInt(pt2[1]) + (pt2[3] ? 12 : 0) );
            t2.setMinutes( parseInt(pt2[2]) || 0 );

            // estimate time
            var ms = t1 - t2;

            var minutes = parseInt((ms / (1000*60)) % 60);
            var hours   = parseInt((ms / (1000*60*60)) % 24);

            // truncate decimal
            // var truncate = function(t){ return Math.floor(hours * 10) / 10;}
            var time = 0;

            if(hours >= 1){

                time =  ((hours>1)? hours.toString() +" hours ": hours.toString()+" hour ") + minutes.toString() + " minutes";
            } else {
                time = ((minutes==1)?minutes.toString() + " minute":minutes.toString() + " minutes");
            }
            // var busAvil = (times[c]["rtd"]=="1")?'<span class="glyphicon glyphicon-ok-sign"></span>':'';
            // var lastTrain = (times[c]["final"]=="1")?'<span class="glyphicon glyphicon-remove-circle"></span>':'';

            //check the time to see if its with in the 30min threshold
            var bli = (checkTime(t2))?' class="blink" ':'';

            var today = getDay();


            var ct = new Date(), // current time
                hours = ct.getHours(),
                mins = ct.getMinutes();

            var fade = (day==today)? ' class="gone" ' : '';

            // console.log(today + " " + day)

            if(ct < t2){

                schl += '<tr id="'+c+'" '+ bli +'>' +
                    '<td>'+ "#"+times[c]["train"].replace(/_/g, ' ') +'</td>' +
                    '<td>'+ times[c]["time"] + " - " + allTrips[c][allTrips[c].length-1]["time"]+'</td>' +
                    '<td>'+ time + '</td>'+
                    '</tr>';
            } else{
                schl += '<tr id="'+c+'" ' + fade +'>' +
                    '<td>'+ "#"+times[c]["train"].replace(/_/g, ' ') +'</td>' +
                    '<td>'+ times[c]["time"] + " - " + allTrips[c][allTrips[c].length-1]["time"]+'</td>' +
                    '<td>'+ time + '</td>'+
                    '</tr>';
            }
        }
    }

    // display schedule to user
    document.getElementById("schedule-table").innerHTML = schl
    return false;
}

function detailedSch(id){
    // getting trip from array (2d)
    var trip = allTrips[id];

    // setting data to UI
    $('#depart').text("Depart: " + trip[0]["station"].substr(3));
    $('#arrive').text("Arrive: " +trip[trip.length-1]["station"].substr(3));
    $('#depart-time').text("Departing at: " +trip[0]["time"]);
    $('#arrive-time').text("Arriving at: " +trip[trip.length-1]["time"]);

    // Calculating price of trip
    var price = calcPrice("One-Trip", trip[0]["station"], allTrips[parseInt(id)][allTrips[parseInt(id)].length-1]["station"])

    // setting the price to UI
    $('#fare').text("$"+price[0]);

    // console.log(trip)

    var schl = "";
    for(var x = 0; x < trip.length; x++){
        schl += '<tr>' +
            '<td>'+ "#"+trip[x]["train"].replace(/_/g, ' ') +'</td>' +
            '<td>'+ trip[x]["time"] +'</td>' +
            '</tr>';

    }
    document.getElementById("detail-table").innerHTML = schl;
    return false;

}

function checkTime(time) {
    var d = new Date(), // current time
        hours = d.getHours(),
        mins = d.getMinutes();
    // adding 30min to current time
    d.setMinutes(d.getMinutes() +30);
    //console.log(d + " " + time)
    // if the hours match and the mins of the arg give are less then current time
    return (d.getHours() == time.getHours() && time < d.getMinutes()) || (d.getHours() == time.getHours()-1 && time < d.getMinutes());
}

function swExample() {

    var fromArr = updateFrom();
    var left = {};

    for (var i=0; i < fromArr.length; i++){
        left[fromArr[i]["id"]] = fromArr[i]["station"].substr(3);
    }

    SpinningWheel.addSlot(left, 'left');
    SpinningWheel.addSlot(left, 'right', 2);
    SpinningWheel.setCancelAction(cancel);
    SpinningWheel.setDoneAction(done);

    SpinningWheel.open();
    return false;

}


function done() {
    var results = SpinningWheel.getSelectedValues();
    selected = results;
    //console.log(results)
    updateTimeSelector(results);
}

function cancel() {
    setDir();

}

function setDir(){
    //SpinningWheel.destroy();
    if(direction == "Northbound"){
        direction = "Southbound";

        $("#dir").text("Going South")
        // console.log(allTrips)
    } else {
        direction = "Northbound";
        $("#dir").text("Going North")
    }
    var day = getDay();


    var  sel = {};
    // check to see if selected is not null
    if (selected != null) {
        console.log("======HERE++++++++")
        console.log(selected)

        var k1 = selected.keys[0]
        var k2 = selected.keys[1]
        var v1 = selected.values[0]
        var v2 = selected.values[1]
        //console.log(selected)

        sel.keys = [k2,k1]
        sel.values = [v2,v1]
        selected = sel
        //console.log(sel)


        updateTimeSelector(sel);

        setDirectionArray(direction, day);
    }

    return false;
}

function showTrips() {
    // adjust views
    $("#trips-btn").fadeOut();
    $("#data-entry").fadeOut();
    $("#entire-sch").delay(500).fadeIn();
    $("#set-dir-btn").fadeIn();
    $("#change-trp-btn").fadeIn();
    $("#dir").fadeIn();
    $("#change-day").fadeIn();
    $("#trip").fadeIn();

    return false;
}

function swDay(){
    var left = {}
    left["weekday"] = "Weekday";
    left["saturday"] = "Saturday";
    left["sunday"] = "Sunday";

    SpinningWheel.addSlot(left, 'left');
    SpinningWheel.setDoneAction(doneDay);
    SpinningWheel.setCancelAction(cancel)
    SpinningWheel.open();
    return false;
}

function doneDay(){
    var res = SpinningWheel.getSelectedValues();

    day = res.values[0];

    setDirectionArray(direction, day);
    //        check to see if selected is not null
    if (selected != null) {
        updateTimeSelector(selected);
    }
}
