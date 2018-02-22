/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var My_ARRAY = [];

var map;

var app = 
{
    // constructor for the app
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // fucntion that will handle my events eg . click of buttons 
    onDeviceReady: function() {

        /*1*/document.getElementById('startup_with_map').addEventListener('click', startup_with_map, false);
        /*2*/document.getElementById('find_my_location').addEventListener('click', find_my_location, false);
        /*3*/document.getElementById('calculate_distance_between_points').addEventListener('click', calculate_distance_between_points, false);
        /*4*/document.getElementById('reset_points_already_made').addEventListener('click', reset_points_already_made, false);

        var div = document.getElementById("map_canvas1");
        map = plugin.google.maps.Map.getMap(div);
        map.one(plugin.google.maps.event.MAP_READY, function() {



            // runs through entire code when the map is displayed on the screen
            console.log("--> map_canvas1 : ready.");
        });
        this.receivedEvent('deviceready');
    },

    // when this event occurs the DOM is updated 
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, false);
    xmlHttp.send(null);
    return xmlHttp.responseText;
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function startup_with_map(event) {

    var address = document.getElementById('address').value.split(' ').join('+');

    var response = JSON.parse(httpGet('https://maps.googleapis.com/maps/api/geocode/json?address='+address+'&key=AIzaSyCrRaoUly0HstBe7ztiDINeq--p_D6Lhmg'));



    var longitude = response.results[0].geometry.location.lng;
    var latitude = response.results[0].geometry.location.lat;

    map.addMarker({
        'position':{lat:latitude, lng:longitude},
        'title': address.split('+').join(' '),
        'snippet': 'Lat: '+latitude+' Lng:'+longitude
    }, function(marker) {

        // when the marker is created then do an INFO click and when its clicked add the long and lat to the points array.
        marker.on(plugin.google.maps.event.INFO_CLICK, function() {
            obj = {
                'lat': latitude,
                'lng': longitude
            }

            if(My_ARRAY.length < 2) {


                My_ARRAY.push(obj);
                alert('point has been added to distance calculation.');
            } else {
                alert('reset distance calculation to start again.');
            }
        })
    });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//when this button is pressed your location is pinned onto the map
function find_my_location(event){

    map.getMyLocation(function onSucces(location) {
         map.addMarker({
        'position':{lat:location.latLng.lat, lng:location.latLng.lng},
        'title': 'your location',
        'snippet': 'Lat: '+location.latLng.lat+' Lng:'+location.latLng.lng
    }, function(marker) {
        

        // when the marker is created then do an INFO click and when its clicked add the long and lat to the points array.
        marker.on(plugin.google.maps.event.INFO_CLICK, function() {
            obj = {
                'lat': location.latLng.lat,
                'lng': location.latLng.lng
            }

           // alert(points.length);

            if(My_ARRAY.length < 2) {
                My_ARRAY.push(obj);
                alert('Marker added to distance calculation');
            } else {
                alert('Markers in distance calculation, reset it.');
            }
        })
    });
    }, function onFail(){});

}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function calculate_distance_between_points(event)
 {

    if(My_ARRAY.length != 2) {
        alert("you need to choose at least two different marker points");
    } else {
        var distance = plugin.google.maps.geometry.spherical.computeDistanceBetween(My_ARRAY[0], My_ARRAY[1]);

        alert('Distance: '+Math.round(distance/1000)+'km');
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function reset_points_already_made(event)
{
    My_ARRAY = [];
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.initialize();