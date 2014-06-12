
# The MIT License (MIT)
# 
# Copyright (c) 2014 Thomas J. Perry
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.
# 
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.



import os, sys, Image, sqlite3, random, time, json
from flask import Flask, render_template, url_for, jsonify, flash, request, session, g, abort
from flask.ext.wtf import Form
from wtforms import TextField, TextAreaField, SubmitField, HiddenField
from pprint import pprint
from collections import OrderedDict
#from wtforms.validators import Required
#from flask.ext.assets import Environment, Bundle
from counterVariables import diffCells, diffKeys, ueoCells, ueoKeys, paraCells, paraKeys
import pushover

app = Flask(__name__)
#assets = Environment(app)
app.config.from_object(__name__)

# Load default config and override config from an environment variable
app.config.update(dict(
    DATABASE=os.path.join(app.root_path, 'Gallery.db'),
    DEBUG=True,
    SECRET_KEY='development key',
    USERNAME='admin',
    PASSWORD='default'
))
app.config.from_envvar('FLASKR_SETTINGS', silent=True)

fileVersions = {}
folderPath = os.path.dirname(os.path.realpath(__file__))
fileVersions["counterCss"] = os.path.getmtime(folderPath + "/static/css/counter.css")
fileVersions["mainCss"] = os.path.getmtime(folderPath + "/static/css/main.css")
fileVersions["counterJs"] = os.path.getmtime(folderPath + "/static/js/counter.js")
fileVersions["diffHeader"] = os.path.getmtime(folderPath + "/static/img/header.png")


def connect_db():
	"""Connects to the specific database."""
	rv = sqlite3.connect(app.config['DATABASE'])
	rv.row_factory = sqlite3.Row
	rv.text_factory = str
	return rv

def get_db():
    if not hasattr(g, 'sqlite_db'): 
        g.sqlite_db = connect_db()
    return g.sqlite_db

@app.teardown_appcontext
def close_db(error):
    """Closes the database again at the end of the request."""
    if hasattr(g, 'sqlite_db'):
        g.sqlite_db.close()
        
#Contact form stuff
class ContactForm(Form):
  name = TextField("Name")
  email = TextField("Email")
  subject = TextField("Subject")
  message = TextAreaField("Message")
  submit = SubmitField("Send")


def notify(request):
    pushover.init("ajXLegLrmdRJvvWCHHy8Gavmkws9Ti")
    client = pushover.Client("uZ58dxNBaZhMp4epGW8a8RRWzsMavr")
    client.send_message("From: " + request.form['name'] +\
                        "\nE-mail: " + request.form['email'] + "\n\n" +\
                        request.form['message'], 
                        title = "New Daftscience.com comment",
                        priority=1)

def get_gallery():
    gallery = [{}]
    conn = get_db()
    cur = conn.execute('select image, catagory, location, thumbLocation from Gallery order by image desc')
    entries = cur.fetchall()
    type(entries)
    for entry in entries:
        type(entry[2])
#        pp.pprint(entry[2])
        gallery.append({'cat': entry[1], 'loc': entry[2], 'thumbLoc': entry[3]})
    random.shuffle(gallery)
#    pp.pprint(gallery)
    return gallery

@app.route('/', methods=['POST', 'GET'])
def index():
	global fileVersions
	form = ContactForm()
	links = ['Builds', 'Prints', 'About', 'Contact Me']
	if request.method == 'POST':
		notify(request)
		return render_template('index.html', fileVersions = fileVersions, sent = True, links=links, gallery = get_gallery(), name=request.form['name'])
	elif request.method == 'GET':
		return render_template('index.html', fileVersions = fileVersions, form=form, links=links, gallery=get_gallery())
	return render_template('index.html', fileVersions = fileVersions, sent = False, links=links, gallery = get_gallery(), form=form)

@app.route('/counter/')
def counter():
	jsonFile=open(folderPath+  "/static/json/differential.json")
	differentialJson = json.load(jsonFile, object_pairs_hook=OrderedDict)
	jsonFile.close()
#	global fileVersions
#	pprint(fileVersions)
	links = ['Counter', 'Tips', 'References']
	return render_template('counter.html', fileVersions = fileVersions, links=links, cells = differentialJson)

@app.route('/oap/')
def oap():
	global fileVersions
	pprint(fileVersions)
	links = ['Counter', 'Tips', 'References']
	return render_template('counter.html', fileVersions = fileVersions, links=links, cells = ueoJson)
 
	
if __name__ == '__main__':
	app.run(host='daftscience.com', debug=True)

    
    
    
    
    
