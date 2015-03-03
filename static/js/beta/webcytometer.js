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
var editing = false;
var adding = true;
var countTo = 100;
var KeyID;
var diffName;
var nag = false;
var hasIE_ughhh = false;
var total;
var debugVariable;
var focusedColor = "#fdf8e5";
var subtractFocusColor = "#f2dedf";
var countSide = 1;
var rbcArea = 10;
var wbcArea=10;

function toggleSide(){
	if($("#bottomBTN").hasClass("btn-primary")){
		countSide = 1;
	} else{ 
		countSide = 2;
	}
	$("#bottomBTN").toggleClass("btn-primary");
	$("#topBTN").toggleClass("btn-primary");
}
$(document).ready(function() {
	//console.log("ready!");
	$(".countSide").click(function() { toggleSide(); });
	
	$("#crystalViolet").click(function(){renderMath();});
	$(".rbcSelect").click(function() {
		if ($(this).hasClass("04mm")) {
			$('#rbcImage').attr("src", 'http://daftscience.com/static/img/webcytometer/0.4mm.png');
			rbcArea = "0.4";
		} else {
			if ($(this).hasClass("02mm")) {
				$('#rbcImage').attr("src", 'http://daftscience.com/static/img/webcytometer/2mm.png');
				rbcArea = "2";
			} else {
				$('#rbcImage').attr("src", 'http://daftscience.com/static/img/webcytometer/10mm.png');
				rbcArea = "10";
			}
		}
		renderMath();
	});
	
	
	$(".wbcSelect").click(function() {
		if ($(this).hasClass("04mm")) {
			$('#wbcImage').attr("src", 'http://daftscience.com/static/img/webcytometer/0.4mm.png');
			wbcArea = "0.4";
		} else {
			if ($(this).hasClass("02mm")) {
				$('#wbcImage').attr("src", 'http://daftscience.com/static/img/webcytometer/2mm.png');
				wbcArea = "2";
			} else {
				$('#wbcImage').attr("src", 'http://daftscience.com/static/img/webcytometer/10mm.png');
				wbcArea = "10";
			}
		}
		renderMath();
	});
	
	
});

//prevent backspace from navigating back
/* $(document).unbind('keydown').bind('keydown', function(event) {
	var doPrevent = false;
	if (event.keyCode === 8) {
		var d = event.srcElement || event.target;
		if ((d.tagName.toUpperCase() === 'INPUT' && (d.type.toUpperCase() === 'TEXT' || d.type.toUpperCase() === 'PASSWORD' || d.type.toUpperCase() === 'FILE' || d.type.toUpperCase() === 'EMAIL')) || d.tagName.toUpperCase() === 'TEXTAREA') {
			doPrevent = d.readOnly || d.disabled;
		} else {
			doPrevent = true;
		}
	}
	if (doPrevent) {
		event.preventDefault();
	}
}); */
jQuery(document).keydown(function(e) {
	KeyCheck(e);
	$('#debug').html("Internet Explorer: " + hasIE_ughhh +
		"<br />Key pressed: " + e.keyCode +
		"<br />Editing =" + editing +
		"<br />Adding = " + adding +
		"<br />Nagging = " + nag +
		"<br />Total = " + total +
		"<br />Debug Variable = " + debugVariable);
});

jQuery(document).keyup(function(e) {
	renderMath();
});


function KeyCheck(evt) {
	KeyID = evt.keyCode;
	var selectedCell = null;
	//Picks the Key
	
	switch (KeyID) {
		case 69: //edit mode
			//For some reason internet explorer will display the page properly if I do this times three. #whatTheFuck!
			toggleSide();
			evt.preventDefault();
			return;
		case 87:
			evt.preventDefault();
			selectedCell= "wbcs";
			break;
		case 82: //reset
			evt.preventDefault();
			selectedCell = "rbcs";
			break;
		case 189:
		case 109: //-
			break;
		case 187:
		case 107: //+
			evt.preventDefault();
			break;
		default:
			break;
	} //end of switch

	increment(selectedCell);
}


function increment(cell) {
	var thisCell = $('#' + cell + countSide);
	var currentVal = $(thisCell).val();
	//window.alert(cell);
	//window.alert($('#' + cell + countSide).val());
	//window.alert(currentVal);

	if (!currentVal && adding) {
		currentVal = 1;
	} else {
		if (adding) {
			currentVal++;
		} else {
			if (currentVal > 0)
				currentVal--;
		}

		//			window.alert(currentVal);
	}
	$(thisCell).val(currentVal);


};


function renderMath() {
	rbcTotal = (parseInt($("#rbcs1").val()) || 0 ) + (parseInt($("#rbcs2").val()) || 0);
	wbcTotal = (parseInt($("#wbcs1").val()) || 0 ) + (parseInt($("#wbcs2").val()) || 0);
	
	var rbcDelta =  (((parseFloat($("#rbcs1").val()) || 0 ) - (parseFloat($("#rbcs2").val()) || 0))/(parseFloat($("#rbcs1").val()) || 0 ));
	if($("#rbcs2").val() && $("#rbcs1").val()){
		$("#rbcSTD").val((rbcDelta*100).toFixed(1)+'%');
	}else{
		$("#rbcSTD").val('');
	}
	
	var wbcDelta =  (((parseFloat($("#wbcs1").val()) || 0 ) - (parseFloat($("#wbcs2").val()) || 0))/(parseFloat($("#wbcs1").val()) || 0 ));
	if($("#wbcs2").val() && $("#wbcs1").val()){
		$("#wbcSTD").val((wbcDelta*100).toFixed(1)+'%');
	}else{
		$("#wbcSTD").val('');
	}

	
	
	var rbcDF = parseFloat($("#rbcDilution").val()) || parseFloat(1);
	var wbcDF = parseFloat($("#wbcDilution").val()) || parseFloat(1);
	if($('#crystalViolet').prop('checked')){
		rbcDF = (parseFloat(rbcDF)*parseFloat(1.11));
		wbcDF = (parseFloat(wbcDF)*parseFloat(1.11));
	}
	rbcCalculated = (rbcTotal*(1/.1)*rbcDF)/rbcArea;
	wbcCalculated = (wbcTotal*(1/.1)*wbcDF)/wbcArea;
	
	$(".rbcCalculations").html("$${" + rbcCalculated.toFixed(2) + "_{rbcs} \\over \\mu L} = {" + rbcTotal + "_{rbcs} \\ast {1 \\over 0.1_{mm} } \\ast " + rbcDF.toFixed(2) + " \\over " + rbcArea + "_{mm^2} }$$");
	$(".wbcCalculations").html("$${" + wbcCalculated.toFixed(2) + "_{wbcs} \\over \\mu L} = {" + wbcTotal + "_{wbcs} \\ast {1 \\over 0.1_{mm} } \\ast " + wbcDF.toFixed(2) + " \\over " + wbcArea + "_{mm^2} }$$");

	MathJax.Hub.Queue(["Typeset", MathJax.Hub]);


}