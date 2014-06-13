from flask.ext.wtf import Form
from wtforms import TextField, TextAreaField, SubmitField, HiddenField
from flask import g
import os, sqlite3, random
from daftscience import app
import pushover

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
