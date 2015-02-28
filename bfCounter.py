from flask import Blueprint
from pprint import pprint
from flask import Flask, render_template, url_for, jsonify, flash, request, session, abort
import os, sys, time, json
from modules.functions import make_timestamps
#from daftscience import make_timestamps

from collections import OrderedDict
fluidCounter = Blueprint('fluidCounter', __name__)

files = ["static/css/counter.css", "static/css/webcytometer.css", "static/css/main.css", "static/js/counter.js","static/js/webcytometer.js", "static/img/header.png"]
fileVersions = make_timestamps(files)


@fluidCounter.route("/webcytometer/")
def bfCounter():
	jsonFile=open("static/json/differential.json")
	differentialJson = json.load(jsonFile, object_pairs_hook=OrderedDict)
	jsonFile.close()
 	links = ['Counter', 'Tips', 'References']
 	return render_template('fluidCounter.html', fileVersions = fileVersions, links=links,countType = "Diff", cells = differentialJson, bodyfluid="true")