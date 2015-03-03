from flask import Blueprint
from pprint import pprint
from flask import Flask, render_template, url_for, jsonify, flash, request, session, abort
import os, sys, time, json
from modules.functions import make_timestamps
#from daftscience import make_timestamps

from collections import OrderedDict
counter = Blueprint('counter', __name__)

files = ["static/css/counter.css", "static/css/main.css", "static/js/counter.js", "static/img/header.png"]
beta_files = ["static/css/beta/counter.css", "static/css/beta/main.css", "static/js/beta/counter.js", "static/img/header.png"]

fileVersions = make_timestamps(files)
beta_fileVersions = make_timestamps(beta_files)

@counter.route("/beta/counter/")
def beta_diffCounter():
	jsonFile=open("static/json/differential.json")
	differentialJson = json.load(jsonFile, object_pairs_hook=OrderedDict)
	jsonFile.close()
 	links = ['Tips', 'References']
 	return render_template('beta/counter.html', fileVersions = beta_fileVersions, links=links,countType = "Diff", cells = differentialJson, mapping="json/differential.json", beta=True)

@counter.route("/beta/bfcounter/")
def beta_bfCounter():
	jsonFile=open("static/json/bf.differential.json")
	differentialJson = json.load(jsonFile, object_pairs_hook=OrderedDict)
	jsonFile.close()
 	links = ['Tips', 'References']
 	return render_template('beta/counter.html', fileVersions = beta_fileVersions, links=links,countType = "Diff", cells = differentialJson, mapping="json/seton.differential.json", beta=True)

@counter.route("/beta/smcadiffs/")
def beta_smcaCounter():
	jsonFile=open("static/json/seton.differential.json")
	differentialJson = json.load(jsonFile, object_pairs_hook=OrderedDict)
	jsonFile.close()
 	links = ['Tips', 'References']
 	return render_template('beta/counter.html', fileVersions = beta_fileVersions, links=links,countType = "Diff", cells = differentialJson, mapping="json/seton.differential.json", beta=True)

@counter.route("/counter/")
def diffCounter():
	jsonFile=open("static/json/differential.json")
	differentialJson = json.load(jsonFile, object_pairs_hook=OrderedDict)
	jsonFile.close()
 	links = ['Tips', 'References']
 	return render_template('counter.html', fileVersions = fileVersions, links=links,countType = "Diff", cells = differentialJson, mapping="json/differential.json")

@counter.route("/bfcounter/")
def bfCounter():
	jsonFile=open("static/json/bf.differential.json")
	differentialJson = json.load(jsonFile, object_pairs_hook=OrderedDict)
	jsonFile.close()
 	links = ['Tips', 'References']
 	return render_template('counter.html', fileVersions = fileVersions, links=links,countType = "Diff", cells = differentialJson, mapping="json/seton.differential.json")

@counter.route("/smcadiffs/")
def smcaCounter():
	jsonFile=open("static/json/seton.differential.json")
	differentialJson = json.load(jsonFile, object_pairs_hook=OrderedDict)
	jsonFile.close()
 	links = ['Tips', 'References']
 	return render_template('counter.html', fileVersions = fileVersions, links=links,countType = "Diff", cells = differentialJson, mapping="json/seton.differential.json")