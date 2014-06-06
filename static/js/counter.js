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
var total;
var debugVariable;
var focusedColor = "#FFD387";

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

//Forces IE to redraw the elements.
function toggleDisableX3() {
	toggleDisable();
	toggleDisable();
	toggleDisable();
}

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
		switch (countTo) {
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
		if (countType == "UEO") {
			$(this).html("UEO");
			$("#otherMap").html("Other (o-letter)");
			$("#eosMap").html("Eosinophils (5)");
			countType = 'differential';
			$("#changeCountTo").show();
		} else {
			$("#changeCountTo").hide();
			$("#otherMap").html("Other (2)");
			$("#eosMap").html("Eosinophils (3)");
			countType = 'UEO';
			$(this).html("Diff");
		}
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
	$(".countInput").each(function(){
		$(this).click(function(){
			increment(this);
		});
		$(this).focus(function(){
			this.style.backgroundColor = focusedColor;
		});
		$(this).blur(function(){
			this.style.backgroundColor = '';
		});
	});

	diffName = document.getElementById('diffName');
	initScripts();
	$("#printButton").click(function() {
		var d = new Date();
		var now = d.toString();
		if(tracking){
			ga('send', 'event', "print", countType, now);
		}
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


// Prevent the backspace key from navigating back.
$(document).unbind('keydown').bind('keydown', function(event) {
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
});

//Build debug information and call KeyCheck
jQuery(document).keydown(function(e) {
	KeyCheck(e);
	$('#debug').html("Internet Explorer: " + hasIE_ughhh +
		"<br />Key pressed: " + e.keyCode +
		"<br />Editing =" + editing +
		"<br />Adding = " + adding +
		"<br />Nagging = " + nag +
		"<br />countType = " + countType +
		"<br />Total = " + total + 
		"<br />Debug Variable = " +debugVariable);
});

(function($) {
	$.konami = function(callback) {
		konami = "38,38,40,40,37,39,37,39,66,65";
		var k = [];
		$(document).keydown(function(e) {
			k.push(e.keyCode);
			if (k.toString().indexOf(konami) >= 0) {
				k = [];
				callback(e);
			}
		});
	};
})(jQuery);

$.konami(function() {
	$('#wylajb').show();

	//Cool Easteregg
	document.getElementsByTagName("body")[0].className = 'transform';
	setTimeout(function() {
		document.getElementsByTagName("body")[0].className = '';
	}, 10000);

	/* 	IE8 easter egg */
	if (hasIE_ughhh) {
		var hideDelay = 0;
		window.alert("Oh no, you just activated annoying mode");
		$('div *:not(script, style, noscript)').each(function() {
			/* 		$("div").each(function(index) { */
			var thisDiv = this;
			if ($(this).is(":visible")) {
				hideDelay = hideDelay + 50;
				setTimeout(function() {
					$(thisDiv).hide();
				}, hideDelay);
				setTimeout(function() {
					$(thisDiv).show();
				}, (hideDelay + 10500));
			}
		});
		setTimeout(function() {
			window.alert("All done, I'd avoid doing that again.");
		}, (hideDelay + 11000));


	}


	setTimeout(function() {
		$('#wylajb').hide();
	}, 20000);
});

(function($) {
	$.debugCode = function(callback) {
		var debug = "68,69,66,85,71";
		var k = [];
		$(document).keydown(function(e) {
			k.push(e.keyCode);
			if (k.toString().indexOf(debug) >= 0) {
				k = [];
				callback(e);
			}
		});
	};
})(jQuery);


$.debugCode(function() {
	if ($("#countTitle").hasClass("debugging")) {
		$('#countTitle').removeClass("debugging");
	} else {
		$('#countTitle').addClass("debugging");
	}
	$('#debug').toggle();
});


(function($) {
	$.kitty = function(callback) {
		kitty = "75,73,84,84,89";
		var k = [];
		$(document).keydown(function(e) {
			k.push(e.keyCode);
			if (k.toString().indexOf(kitty) >= 0) {
				k = [];
				callback(e);
			}
		});
	};
})(jQuery);

$.kitty(function() {
	window.location.href = "https://www.youtube.com/watch?v=Dt4zvJNXbdI";
});

function resetForm() {
	//Returns counter to addition mode. 
	$('#wylajb').hide();
	toggleSubtract('add');
	//Returns max counter to 100
	// Loops through inputs and reselts all inputs in cellForm
	$(".countInput").each(function() {
		$(this).val('');
		$(this).attr('readonly', true);
	});
	$(".progress-bar").each(function() {
		$(this).css({
			"width": "0"
		});
	});
	$('.progressPercent').each(function() {
		$(this).html('');
	});
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
}

//Changes the status on the top.
function changeAlert(activateAlert) {
	$('.changeable').each(function() {
		$(this).hide();
	});
	$('#' + activateAlert).show();
}

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
	$('.countInput').each(function() {
		$(this).attr('readonly', !this.readOnly);
	});
	recalc();
}

function increment(cell) {
	if (editing) {
		return;
	}
	var tot = parseInt($('#total').html());
	if (adding && tot < countTo) {
		cell.value++;
	} else {
		if (!adding && cell.value > 0 && cell.value !== '') {
			cell.value--;
		}
	}
	cell.focus();
	recalc();
}


//scrolls to the cell that was last updated
function setfocus(cell) {
	if (cell.style.display === "block") {
		var x = window.scrollX,
			y = window.scrollY;
		cell.focus();
		window.scrollTo(x, y);
	}
}

function KeyCheck(evt) {
	KeyID = evt.keyCode;
	//This will put the page in diff mode when the enter key 
	//is pressed on the diffname box. 
	if ($(diffName).is(":focus")) {
		if (KeyID == "13") {
			$(diffName).blur();
			KeyID = 69;
		} else {
			return;
		}
	}
	var cell = '';
	//Picks the Key
	switch (KeyID) {
		case 98: // 2
		case 50:
			if (countType == 'UEO') {
				cell = 'other';
			} else {
				cell = 'neut';
			}
			break;
		case 97: //1
		case 49:
			cell = 'band';
			break;
		case 99: //3
		case 51:
			if (countType == 'UEO') {
				cell = 'eos';
			} else {
				cell = 'lymph';
			}
			break;
		case 102: //6
		case 54:
			cell = 'mono';
			break;
		case 101: //5
		case 53:
			cell = 'eos';
			break;
		case 100: //4
		case 52:
			cell = 'baso';
			break;
		case 103: //7
		case 55:
			cell = 'meta';
			break;
		case 104: //8
		case 56:
			cell = 'myelo';
			break;
		case 105: //9
		case 57:
			cell = 'pro';
			break;
		case 110: //0
		case 190:
			cell = 'blast';
			break;
		case 96: //.
		case 48:
			cell = 'nrbc';
			break;
		case 79: //o
			cell = 'other';
			break;
		case 106: //*
			cell = 'mega';
			break;
		case 111: // /
		case 191:
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
		case 109: //-
			toggleSubtract('toggle');
			evt.preventDefault();
			return;
		case 187:
		case 107: //+
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
	if (editing) {
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
	$(".countInput").each(function() {
		//This will remove any non digit characters
		$(this).val($(this).val().replace(/\D/g, ''));

		//if it's zero change it to an empty string
		if (parseInt($(this).val()) === 0) {
			$(this).val('');
			// if it's not an empty string add it to the total.	
		} else if ($(this).val() !== '') {
			if ($(this).attr('id') !== 'nrbc' && $(this).attr('id') !== 'mega') {
				tot += parseInt($(this).val());
			}
		}
	});
	if (tot < countTo) {
		nag = false;
	}
	if (tot > countTo && !nag) {
		window.alert("someone's an overachiever, you've somehow counted more than " + countTo + " cells!");
		nag = true;
	}

	$('#total').html(tot);
	$('#toGo').html(countTo - tot);

	normalize();

	if (tot == countTo && !nag) {
		if (!editing && !nag) {
			changeAlert('done');
			window.alert('way to go!');
			var d = new Date();
			var now = d.toString();
			//catagory, action, label, value
			if(tracking){
				ga('send', 'event', countType, 'Finished Diff', now, tot);
			}
			
			nag = true;
		}
	}
}

function normalize() {
	//this gets the total that was last calculated in the recalc function
	var runningTotal = $('#total').html();
	total = runningTotal;
	debugVariable = Math.round($("#neut").val()/runningTotal*100);
	$('.countInput').each(function() {
		var currentCell = '';
		cellProg = $('#' + $(this).attr('id') + 'Prog');
		cellProgText = $('#' + $(this).attr('id') + 'ProgText');
		if ($(this).attr('id') !== 'nrbc' && $(this).attr('id') !== 'mega') {
			if ($(this).val() !== '' && $(this).val() !== 0) {
				currentCell = Math.round($(this).val()/runningTotal*100);
				cellProg.css({"width": (currentCell) + '%'});
				cellProgText.html(currentCell + '%');
			} else {
				currentCell = '';
				cellProg.css({"width" : "0%"});
				cellProgText.html('');
			}
		}
		if(runningTotal > 0 && countType != 'UEO'){
			var nrbcPercent = Math.round(($('#nrbc').val()/runningTotal)*100) + "%";
			var megaPercent = Math.round(($('#mega').val()/runningTotal)*100) + "%";
			$('#nrbcProg').css({"width": nrbcPercent});
			$('#megaProg').css({"width": megaPercent});
			if($('#nrbc').val() > 0){
				$("#nrbcProgText").html(nrbcPercent);
			}
			if($('#mega').val() > 0){
				$("#megaProgText").html(megaPercent);
			}
		}
	});
}