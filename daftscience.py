
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
from wtforms import TextField, TextAreaField, SubmitField, HiddenField
from flask import Flask, render_template, url_for, request, abort
import os, sys, time, json, random
from collections import OrderedDict
from modules.functions import *
from flask.ext.wtf import Form
from counter import counter
from bfCounter import fluidCounter
import pushover

#from daftscience import app


app = Flask(__name__)
#assets = Environment(app)
app.config.from_object(__name__)


app.register_blueprint(counter)
app.register_blueprint(fluidCounter)


# Load default config and override config from an environment variable
app.config.update(dict(
#	DATABASE=os.path.join(app.root_path, 'Gallery.db'),
	DEBUG=True,
	SECRET_KEY='development key',
	USERNAME='admin',
	PASSWORD='default'
))
app.config.from_envvar('FLASKR_SETTINGS', silent=True)  
	
files = ["static/css/main.css"]
fileVersions = make_timestamps(files)

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
	gallery = []
	
	with open("static/json/images.json") as json_file:
		json_images = json.load(json_file)
	for images in json_images:
		for image in images:
			gallery.append({
											'cat': images[image]["Folder"],
											'loc': images[image]["SmallLoc"],
											'thumbLoc': images[image]["ThumbLoc"]
										})
	random.shuffle(gallery)
	pprint(gallery)
	return gallery

#@app.teardown_appcontext
#def close_db(error):
#	"""Closes the database again at the end of the request."""
#	if hasattr(g, 'sqlite_db'):
#		g.sqlite_db.close()


@app.route('/', methods=['POST', 'GET'])
def index():
	form = ContactForm()
	links = ['Diff-Counter', 'Builds', 'Prints', 'About', 'Contact Me']
	if request.method == 'POST':
		notify(request)
		return render_template('index.html', fileVersions = fileVersions, sent = True, links=links, gallery = get_gallery(), name=request.form['name'])
	elif request.method == 'GET':
		return render_template('index.html', fileVersions = fileVersions, form=form, links=links, gallery=get_gallery())
	return render_template('index.html', fileVersions = fileVersions, sent = False, links=links, gallery = get_gallery(), form=form)
	
if __name__ == '__main__':
	app.run(host='daftscience.com', debug=True)

    
    
    
    
    
