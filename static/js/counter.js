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

//	window.alert(cells);
	$('.countType').click(function() {
		$(".countType").removeClass("btn-primary");
		$(this).addClass("btn-primary");
		countType = $(this).html();
		if (countType == "UEO"){
			$("#otherLabel").html("Other (2)");
			$("#eosLabel").html("Eosinophils (3)");	
			var animateDelay = 0;
			$('.notUEO').each(function(){
				var elem = this;
				$(elem).slideUp(1000);
				animateDelay += 50;
				setTimeout(function(){
					$(elem).removeClass("slideInRight");
					$(elem).addClass("slideOutLeft");
				}, animateDelay);
			});
			$(".changeCount").each(function(){
				$(this).attr("disabled", "disabled");
				if($(this).val() == 200){
					$(this).click();
				}
			});
		}else {
			if (countType == "Diff"){
				$("#otherLabel").html("Other (o-letter)");
				$("#eosLabel").html("Eosinophils (5)");
				var animateDelay = 0;
				$('.notUEO').each(function(){
					var elem = this;
					animateDelay += 50;
//				This will make the element slide in after its back to it's normal size
					setTimeout(function(){
						$(elem).removeClass("slideOutLeft");
						$(elem).slideDown(1000);
						$(elem).addClass("slideInRight");
					}, animateDelay);
				});
				$(".changeCount").each(function(){
					$(this).removeAttr("disabled");
					if($(this).val() == 100){
						$(this).click();
					}
				});
				
			}		
		}		
		resetForm();
	});
$(".countInput").each(function(){
		$(this).click(function(){
			if(editing){
				$(this).select();
			}
			increment(this);
		});
		$(this).focus(function(){
			if(!adding){
				$(this).parent().parent(".cellRow").css("background", subtractFocusColor);
			}else {
				$(this).parent().parent(".cellRow").css("background", focusedColor);
			}
		});
		$(this).blur(function(){
			$(this).parent().parent(".cellRow").css("background", "");
			this.style.backgroundColor = '';
		});
	});
	
	diffName = document.getElementById('diffName');
	resetForm();
	$("#printButton").click(function() {
		var d = new Date();
		var now = d.toString();
		if(tracking){
			ga('send', 'event', "print", countType, now);
		}
		window.print();
	});
	
	$('.changeCount').click(function(){
		$('.changeCount').each(function(){
			$(this).removeClass("btn-primary");
		});
		$(this).addClass("btn-primary");
		countTo = $(this).html();
		recalc();
		return false;
	});
	
	$("#fixMeBtn").click(function(){
		$('#wylajb').hide();
		$(".ee").each(function(){
			$(this).removeClass("animated");
			$(this).removeClass("hinge");
			if(hasIE_ughhh){
				$(this).slideDown(150);
				$('#numLock').hide();
				$('#debug').hide();
			}
			$(this).unbind("click");
		});
		$("#fixMe").hide();
	});
});

$(document).on("scroll", function() {
	if ($(document).scrollTop() > 100) {
		$("header").addClass("shrink");
	} else {
		$("header").removeClass("shrink");
	}
});

function changeCount(newCount) {
	countTo = newCount;
	$("#changeCountTo").html(newCount);
	recalc();
	return false;
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
	if(!hasIE_ughhh){
	$('#wylajb').show();
	//Cool Easteregg
	$(".ee").each(function(){
		$(this).click(function(){
			$(this).addClass("animated");
			$(this).addClass("hinge");
			if(hasIE_ughhh){
				$(this).slideUp(100);
			}
		});
	});
	setTimeout(function() {
		$("#fixMe").show();
	}, 20000);
	}
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
	var selectedCell = null;
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

	//Picks the Key
	switch (KeyID) {
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
		//this block will loop through the json files looking for a matching
		// keycode
			switch(countType){
				case 'UEO':
					for (var cell in ueoJson) {
					// this will loop through the keys (usually there are two, sometimes one)
						for (var key in ueoJson[cell].keyMap){
							if (KeyID == ueoJson[cell].keyMap[key]){
								selectedCell = ueoJson[cell].abrev;
							}
						}
					}
					break;
				case 'Diff':
					for (var cell in differentialJson) {
						for (var key in differentialJson[cell].keyMap){
							if (KeyID == differentialJson[cell].keyMap[key]){
								selectedCell = differentialJson[cell].abrev;
							}
						} //end of for
					}
					break;
				case 'Para':
					for (var cell in parasiteJson) {
						for (var key in parasiteJson[cell].keyMap){
							if (KeyID == parasiteJson[cell].keyMap[key]){
								selectedCell = parasiteJson[cell].abrev;
							}
						} //end of for
					}
					break;
				default:
					return;// end of for
			}
	} //end of switch
	var cellElem = document.getElementById(selectedCell);
	if (!editing && cellElem) {
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