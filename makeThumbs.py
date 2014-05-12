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


# !/usr/bin/python

import os, sys
import Image
import pprint
from random import shuffle

#from images2gif import readGif as readGif
#from images2gif import writeGif as writeGif

#quesion 9988517/resize-gif-animation-pil-imagemagick-python
#            go there for gifs
basewidth = 200


def shrink(imageLoc):
    im = Image.open(imageLoc)
    wpercent = (basewidth / float(im.size[0]))
    hsize = int((float(im.size[1])*float(wpercent)))
    im = im.resize((basewidth, hsize), Image.ANTIALIAS)
    im.save(tempLoc)
    print (imageLoc)

def shrinkCrop(imageLoc, tempLoc):
    thumbSize = 75,75
    img = Image.open(imageLoc)
    width, height = img.size
    
    if width > height:
        delta = width - height
        left = int(delta/2)
        upper = 0
        right = height + left
        lower = height
    else:
        delta = height - width
        left = 0 
        upper = int(delta/2)
        right = width
        lower =width + upper
        
    img = img.crop((left, upper, right, lower))
    img.thumbnail(thumbSize, Image.ANTIALIAS)
    img.save(tempLoc)

for root, dirs, files in os.walk("static/images/", topdown=False):
    for name in files:
        print(name)
        splitPath = root.split(os.sep)
        splitPath.append(name)
        imageLoc = os.path.join('', *splitPath)
        print(splitPath[2])
        if splitPath[2] != 'thumbs':
            splitPath.insert(2, 'thumbs/')
            thumbLoc = os.path.join('', *splitPath)
            print ("ThumbLocation: " + thumbLoc)
#        imageLoc = os.path.join(root, name)
            print("Image Location: " + imageLoc)

#    Put the try catch thing in here 
#it will catch shitty errors
            shrinkCrop(imageLoc, thumbLoc) 


        