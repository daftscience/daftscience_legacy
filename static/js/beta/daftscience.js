/*
The MIT License (MIT)

Copyright (c) 2014 Thomas J. Perry

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
//Get my Google+ profile data
//GO here to build requests
//https://developers.google.com/+/api/latest/people/get#examples

// formated like this to allow easy addition of people with a simple loop through the html elements
var req1 = "https://www.googleapis.com/plus/v1/people/%2B";
var req2 = "?fields=aboutMe%2CbraggingRights%2CcurrentLocation%2CdisplayName%2Cemails%2Cimage%2Cname%2Fformatted%2Cnickname%2Coccupation%2Cskills%2Ctagline&key=";
var apiKey = "AIzaSyCKcv7erbLDPqMyF0cRU0BMlQWf4XfbX4o";
var user = "tomperrydaftscience";
$(document).ready(function() {
    request = req1 + user + req2 + apiKey;
    $.getJSON(request, function(json) {
        $("#myPicture").attr("src", json.image.url + "&sz=200");
        //    window.alert(json.tagline);
        $('#tagline').html(json.tagline);
        $('#occupation').html(json.occupation);
        $('#skills').html(json.skills);
    });


    /* <img src="https://img.youtube.com/vi/3f1wwZh_YOI/maxresdefault.jpg" class="img-responsive" > */

    blueimp.Gallery([{
            title: 'Timelapse snowman',
            type: 'text/html',
            youtube: '3f1wwZh_YOI'
        },

    ], {
        container: '#blueimp-video-carousel',
        carousel: true
    });




});