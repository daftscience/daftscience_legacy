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
var countType = "differential"; //UEO or differential

var seedCells = {
	Neutrophils: "neut",
	"Bands Cells": "band",
	Lymphocytes: "lymph",
	Monocytes: "mono",
	Eosinophils: "eos",
	Basophils: "baso",
	Metamyelocytes: "meta",
	Myelocytes: "myelo",
	Promyelocytes: "pro",
	Blasts: "blast",
	NRBCs: "nrbc",
	Others: "other",
	Megakaryocytes: "mega",
	"Plasma Cells": "plasma"
};

var cellKeys = {
	Neutrophils: "2",
	"Bands Cells": "1",
	Lymphocytes: "3",
	Monocytes: "6",
	Eosinophils: "5",
	Basophils: "4",
	Metamyelocytes: "7",
	Myelocytes: "8",
	Promyelocytes: "9",
	Blasts: " . ",
	NRBCs: "0 -zero",
	Others: "o -letter",
	Megakaryocytes: "*",
	"Plasma Cells": "/"
};


function toggleDisableX3() {
	//window.alert("in toggleDisableX3");
	toggleDisable();
	toggleDisable();
	toggleDisable();
}

jQuery(document).keydown(function(e) {
	KeyCheck(e);
	$('#debug').html("Internet Explorer: " + hasIE_ughhh + "<br />Key pressed: " + e.keyCode + "<br /> Editing =" + editing + "<br /> Adding = " + adding + "<br /> Nagging = " + nag + "<br /> countType = " + countType);

});

$(document).ready(function() {
	var top = $('#floatingStatus').offset().top - parseFloat($('#floatingStatus').css('marginTop').replace(/auto/, 0));
	$(window).scroll(function(event) {
		// what the y position of the scroll is
		var y = $(this).scrollTop();

		// whether that's below the form
		//IE8 for some reason will trigger when the top bar hits the
		//      status bar. Other browsers need to subtract the navbar height.
		if (hasIE_ughhh) {
			scrollSwitch = top - 20;
		} else {
			scrollSwitch = top - 50;
		}
		if (y >= (scrollSwitch)) {
			// if so, ad the fixed class
			$('#floatingStatus').addClass('fixed');
		} else {
			// otherwise remove it
			$('#floatingStatus').removeClass('fixed');
		}
	});

	$('#changeCountTo').click(function() {
		switch (countTo){
			case 100:
				changeCount(200);
				break;
			case 200:
				changeCount(300);
				break;
			case 300:
				changeCount(100);
				break;
			default:
				changeCount(100);
		}
	});
	
	$('#toggleCountType').click(function() {
		if(countType=="UEO"){
			$(this).html("UEO");
			$("#otherMap").html("Other (o-letter)");
			$("#eosMap").html("Eosinophils (5)");
			countType='differential';
			$("#changeCountTo").show();
		}else{
			$("#changeCountTo").hide();
			$("#otherMap").html("Other (2)");
			$("#eosMap").html("Eosinophils (3)");
			countType='UEO';
			$(this).html("Diff");
		}
//		window.alert("test");
		$(".notUEO").slideToggle(0);
		resetForm();
		
	});

});



$(document).on("scroll", function() {
	if ($(document).scrollTop() > 100) {
		$("header").addClass("shrink");
	} else {
		$("header").removeClass("shrink");
	}
});


//This adds the onclick function to all of the buttons
window.onload = function() {
	//    document.getElementsByClassName('count')
	var anchors = document.querySelectorAll('.count');
	for (var i = 0; i < anchors.length; i++) {
		var anchor = anchors[i];
		anchor.onclick = function() {
			increment(this);
		};
		anchor.onfocus = function() {
			this.style.backgroundColor = window.focused;
		};
		anchor.onblur = function() {
			this.style.backgroundColor = '';
		};
	}

	diffName = document.getElementById('diffName');
	initScripts();
	$("#printButton").click(function(){
		var d = new Date(); 
		var now = d.toString();
		ga('send', 'event', "print", countType, now);
		window.print();
	});


};

function changeCount(newCount) {
	countTo = newCount;
	$("#changeCountTo").html(newCount);
	recalc();
	return false;
}





function initScripts() {
	resetForm();
}


if (window.addEventListener) {
	// create the keys and konami variables
	var keys = [],
		konami = "38,38,40,40,37,39,37,39,66,65";
	debug = "68,69,66,85,71";
	jillian = "74,73,76,76,73,65,78";
	kitty = "75,73,84,84,89";

	// bind the keydown event to the Konami function
	window.addEventListener("keydown", function(e) {
		// push the keycode to the 'keys' array

		keys.push(e.keyCode);

		// and check to see if the user has entered the Konami code
		if (keys.toString().indexOf(konami) >= 0) {
			// do something such as:
			document.getElementById('tardis').play();
			$('#wylajb').show();
			// and finally clean up the keys array
			keys = [];
		}
		if (keys.toString().indexOf(debug) >= 0) {
			// do something such as:
			$('#debug').toggle();
			// and finally clean up the keys array
			keys = [];
		}

		if (keys.toString().indexOf(kitty) >= 0) {
			// do something such as:
			window.location.href = "https://www.youtube.com/watch?v=Dt4zvJNXbdI";
			// and finally clean up the keys array
			keys = [];
		}

	}, true);
} //cleaned

function resetForm() {
	//Returns counter to addition mode. 
	toggleSubtract('add');
	//Returns max counter to 100
	// Loops through inputs and reselts all inputs in cellForm
	var inputs = document.getElementsByTagName("INPUT");
	for (var i = 0; i < inputs.length; i++) {
		if (inputs[i].className == 'count') {
			inputs[i].value = "";
		}
	}
	var elements = document.querySelectorAll('.progress-bar');
	for (var j = 0, len = elements.length; j < len; j++) {
		elements[j].style.width = 0 + '%';
	}

	var percentages = document.querySelectorAll('.progressPercent');
	for (var j = 0, len = percentages.length; j < len; j++) {
		percentages[j].innerHTML = '';
	}
	var inputs = document.querySelectorAll('.count');
	for (var i = 0; i < inputs.length; i++) {
		inputs[i].readOnly = "readonly";
	}
	$("#lockButton").removeClass("fa-unlock");
	$("#lockButton").addClass("fa-lock");
	recalc();
	editing = false;
	changeAlert('ready');
	disabled = true;
	diffName.value = '';
	diffName.disabled = true;

	if (countType == 'UEO') {
		changeCount(200);
	} else {
		changeCount(100);
	}
} //CLeaned..kinda?

//Changes the status on the top.
function changeAlert(activateAlert) {
	//    document.getElementsByClassName('changeable')
	var list = $(document.querySelectorAll('.changeable'));
	$.each(list, function(index, data) {
		jQuery(this).hide();
	});
	jQuery('#' + activateAlert).show();
} //cleaned

function toggleDisable(option) {
	//window.alert("in toggleDisable");
	//switch back to addition mode.
	document.getElementById('safeFocus').focus();
	$("#lockButton").removeClass("fa-lock");
	$("#lockButton").removeClass("fa-unlock");


	var ae = document.activeElement.nodeName.toLowerCase();
	try {
		// Support: IE9+
		// If the <body> is blurred, IE will switch windows, see #9520
		if (document.activeElement && ae !== "body" && ae !== "html") {
			// Blur any element that currently has focus, see #4261
			$(document.activeElement).blur();
		}
	} catch (error) {}

	toggleSubtract('addEdit');
	$("#subtractButton").removeClass("fa-plus");
	$("#subtractButton").addClass("fa-minus");
	//check if the disabled flag is set and toggle it. Change content to refect the new mode.
	if ($('#edit').is(':visible')) {
		changeAlert('ready');
		$("#lockButton").addClass("fa-lock");

	} else {
		changeAlert('edit');
		$("#lockButton").addClass("fa-unlock");
	}
	diffName.disabled = editing;
	editing = !editing;

	//Runs through all the variables and toggles whether or not they are 
	//enabled. This will also change the appearence of them to reflect the
	//current mode. 
	var tot = 0;
	var inputs = document.querySelectorAll('.count');
	for (var i = 0; i < inputs.length; i++) {
		inputs[i].readOnly = !inputs[i].readOnly;
	}
	recalc();
} //kinda cleaned

function increment(cell) {
	var tot = parseInt(document.getElementById('total').innerHTML);
	//    var max = parseInt(document.getElementById('maxNum').value);
	if (editing) {
		return;
	}
	if (adding && tot < countTo) {
		cell.value++;
	} else {
		if (!adding && cell.value > 0 && cell.value != '') {
			cell.value--;
		}
	}

	//    if (!hasIE_ughhh) {
	cell.focus();
	//    }
	recalc();
} //inda cleaned

function setfocus(cell) {
	if (cell.style.display === "block") {
		var x = window.scrollX,
			y = window.scrollY;
		cell.focus();
		window.scrollTo(x, y);
	}
}

function KeyCheck(evt) {
	//Reads the key presses
	//    window.alert(diffName.id);
	KeyID = evt.keyCode;
	if ($(diffName).is(":focus")) {
		if (KeyID == "13") {
			//            window.alert("test");
			$(diffName).blur();
			KeyID = 69;
		} else {
			return;
		}
	}

	//document.get(Element
	var cell = '';
	//Picks the Key
	switch (KeyID) {
		case 98:
		case 50:
			// 2
			if (countType == 'UEO') {
				cell = 'other';
			} else {
				cell = 'neut';
			}
			break;
		case 97:
		case 49:
			//1
			cell = 'band';
			break;
		case 99:
		case 51:
			//3
			if (countType == 'UEO') {
				cell = 'eos';
			} else {
				cell = 'lymph';
			}
			break;
		case 102:
		case 54:
			//6
			cell = 'mono';
			break;
		case 101:
		case 53:
			//5
			cell = 'eos';
			break;
		case 100:
		case 52:

			//4
			cell = 'baso';
			break;
		case 103:
		case 55:
			//7
			cell = 'meta';
			break;
		case 104:
		case 56:
			//8
			cell = 'myelo';
			break;
		case 105:
		case 57:
			//9
			cell = 'pro';
			break;
		case 110:
		case 190:
			//0 or . I forget
			cell = 'blast';
			break;
		case 96:
		case 48:
			//0 or . I forget
			cell = 'nrbc';
			break;
		case 79:
			//o
			cell = 'other';
			break;
		case 106:
			//* or / i forget
			cell = 'mega';
			break;
		case 111:
		case 191:
			//* or / i forget
			cell = 'plasma';
			break;
			// Modes
		case 36:
		case 38:
		case 33:
		case 37:
		case 12:
		case 39:
		case 35:
		case 40:
		case 34:
			//$('#numlock').show();
			return;
		case 144: //dismiss numlock
			// $('#numlock').hide();
			return;
		case 68: //debug mode:
			//        $('#debug').toggle();
			//        evt.preventDefault();
			return;
		case 69: //edit mode
			//For some reason internet explorer will display the page properly if I do this times three. #whatTheFuck!
			toggleDisableX3();
			evt.preventDefault();
			return;
		case 82: //reset
			resetForm();
			evt.preventDefault();
			return;
		case 78:
			//n
			return;
		case 189:
		case 109:
			//-
			toggleSubtract('toggle');
			evt.preventDefault();
			return;
		case 187:
		case 107:
			//+
			toggleSubtract('add');
			evt.preventDefault();
			return;
		default:
			return;
	}
	var cellElem = document.getElementById(cell);
	//increments

	if (countType == 'UEO') {
		if (cell != 'other' && cell != 'eos') {
			return;
		}
	}

	if (!editing) {
		increment(cellElem);
		evt.preventDefault();
	}
}

function toggleSubtract(mode) {
	if(editing){
		return;
	}
	switch (mode) {
		case 'toggle':
			if (!adding) {
				changeAlert('ready');
				$("#subtractButton").removeClass("fa-plus");
				$("#subtractButton").addClass("fa-minus");
			} else {
				changeAlert('subtract');
				$("#subtractButton").removeClass("fa-minus");
				$("#subtractButton").addClass("fa-plus");
			}
			adding = !adding;
			break;
		case 'subtract':
			adding = false;
			changeAlert('subtract');
			$("#subtractButton").removeClass("fa-minus");
			$("#subtractButton").addClass("fa-plus");
			recalc(); //just incase, to make sure nothing funny happened.
			//Also this is a quick way to clean up the zeros
			break;
		case 'add':
			adding = true;
			changeAlert('ready');
			$("#subtractButton").removeClass("fa-plus");
			$("#subtractButton").addClass("fa-minus");
			recalc(); //just incase, to make sure nothing funny happened.
			//Also this is a quick way to clean up the zeros
			break;
		default:
			adding = "true";
			return;
	}
}




function recalc() {
	var tot = 0;
	var inputs = document.getElementsByTagName("INPUT");
	for (var i = 0; i < inputs.length; i++) {
		if (inputs[i].className == 'count') {
			var unNormalized = [inputs[i].id, "Norm"];
			var cellNorm = unNormalized.join('');
			//window.alert(cellNorm);
			if (inputs[i].value === '0') {
				inputs[i].value = '';
			}
			var intRegex = /^\d+$/;
			intCheck = parseInt(inputs[i].value);
			if (intRegex.test(intCheck) && inputs[i].id != 'nrbc' && inputs[i].id != 'mega') {
				tot += intCheck;
			}
		}
	}

	document.getElementById('total').innerHTML = tot;
	document.getElementById('toGo').innerHTML = countTo - tot;
	normalize();


	//Check if finished with diff
	//    document.getElementById('maxNum').value

	if (tot < countTo) {
		nag = false;
	}
	if (tot > countTo && !nag) {
		window.alert("someone's an overachiever, you've somehow counted more than " + countTo + " cells!");
		nag = true;
	}
	if (tot == countTo && !nag) {
		if (!editing && !nag) {
			changeAlert('done');
			window.alert('way to go!');
			var d = new Date();
			var now = d.toString(); 

			//catagory, action, label, value
			ga('send', 'event', countType, 'Finished Diff', now, tot);
			nag = true;
		}
	}
}

function normalize() {
	var runningTotal = document.getElementById('total').innerHTML;
	var inputs = document.getElementsByTagName("INPUT");
	var tot = 0;
	for (var i = 0; i < inputs.length; i++) {
		var currentCell = '';
		if (inputs[i].className == 'count') {
			var unNormalized = [inputs[i].id, 'Prog'];
			var cellProg = unNormalized.join('');
			var cellProgText = cellProg + 'Text';
			if (inputs[i].value === '0' || inputs[i].value === '') {
				currentCell = '';
			}
			var intRegex = /^\d+$/;
			intCheck = parseInt(inputs[i].value);
			if (intRegex.test(intCheck) && inputs[i].id != 'nrbc' && inputs[i].id != 'mega') {
				currentCell = ((intCheck / runningTotal) * 100);

				document.getElementById(cellProg).style.width = parseInt(currentCell) + '%';
				if (parseInt(currentCell) > 0) {
					document.getElementById(cellProgText).innerHTML = parseInt(currentCell) + '%';
					//document.getElementById(cellProg).style.width = parseInt(currentCell) + '%';
				} else {

					document.getElementById(cellProgText).innerHTML = '';

				}
				//IEFIX
				//                document.getElementById(cellProg).firstElementChild.innerHTML = parseInt(currentCell) + '%';
				//}
				//to here. Except up there
				tot += currentCell;
			}
		}
	}
	document.getElementById('totalNorm').value = tot;
	if (tot > 0 && countType != 'UEO') {
		document.getElementById('nrbcProg').style.width = parseInt((document.getElementById('nrbc').value / tot) * 100) + '%';
		if (parseInt(document.getElementById('nrbc').value) > 0) {
			document.getElementById('nrbcProgText').innerHTML = parseInt((document.getElementById('nrbc').value / tot) * 100) + '%';
		}
		document.getElementById('megaProg').style.width = parseInt((document.getElementById('mega').value / tot) * 100) + '%';
		if (parseInt(document.getElementById('mega').value) > 0) {
			document.getElementById('megaProgText').innerHTML = parseInt((document.getElementById('mega').value / tot) * 100) + '%';
		}
	}

	//fixRoundingError();
}


