#
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


#!/usr/bin/python
# -*- coding: utf-8 -*-
import os, sys, Image, pprint, sqlite3
#from flask import Flask, request, session, abort, flash, redirect, g
#from collections import namedtuple


pp = pprint.PrettyPrinter(indent=4)
#app = Flask(__name__)
#app.config.from_object(__name__)

# Load default config and override config from an environment variable
db_Settings = dict(
    DATABASE=os.path.join('Gallery.db'),
    DEBUG=True,
    SECRET_KEY='development key',
    USERNAME='admin',
    PASSWORD='default')
#app.config.from_envvar('FLASKR_SETTINGS', silent=True)

def connect_db():
    rv = sqlite3.connect(db_Settings['DATABASE'])
    rv.row_factory = sqlite3.Row
    return rv

def get_db():
#    db = getattr(g, '_database', None)
#    if db is None:
    db = connect_db()
    return db

def init_db():
	db = get_db()
	with open('schema.sql', 'r') as f:
		db.cursor().executescript(f.read())
	db.commit()

def build_db():
    conn = get_db()
    db = conn.cursor()
    for root, dirs, files in os.walk("static/images", topdown=False):
        for name in files:
            #create a list with location of the primary pictures
#            print("root")
#            pp.pprint(root)
            
            splitPath = root.split(os.sep)
            splitPath.remove('static')
#            print("Category")
#            pp.pprint(splitPath)
			#check to make sure we aren't looking at the thumbnails
            if splitPath[1] != 'thumbs':
#                pp.pprint(root)
				#create a variable containing the full path to each image
                splitPath.append(name)
                location = os.path.join('', *splitPath)
				#set up a list to build the path of the thumbnail images
                splitPath.insert(1, 'thumbs/')
                
                #pp.pprint(splitPath)
				#Create variable containing the full path to each thumbnail
                thumbLocation = os.path.join('', *splitPath)
				#Adds all the required variables to build the gallery
				# splitPath[3] contains the direct folder the full image is in.
                image = [name, splitPath[2], location, thumbLocation]
#                print("Location")
#                pp.pprint(location)
#                print("ThumbLocation")
#                pp.pprint(thumbLocation) 
#                print("\nsplitPath")
#                pp.pprint(splitPath)
                print("\nImage")
                pp.pprint(image)
                db.execute('insert into Gallery (image, catagory, location, thumbLocation) values (?, ?, ?, ?)', image)
                conn.commit()
    conn.close()
    return

init_db()
build_db()
#pp.pprint()
#    pp.pprint(gallery[1][1])
    
    
#if __name__ == '__main__':
#    pass
#    app.run(host='daftscience.com', port=5001, debug=True)
