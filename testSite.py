from flask import Blueprint
from pprint import pprint
from flask import Flask, render_template, url_for, jsonify, flash, request, session, abort
import os, sys, time, json

from collections import OrderedDict
testSite = Blueprint('testSite', __name__)

@testSite.route("/testSite")
def test():
 	return "test"