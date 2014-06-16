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
import os, sys, pprint, io
import json


def make_json():
	pp = pprint.PrettyPrinter(indent=4)
	images = []
	for root, dirs, files in os.walk("static/images", topdown=False):
		for name in files:
			splitPath = root.split(os.sep)
			splitPath.remove('static')
			if splitPath[1] != 'thumbs' and splitPath[1] != 'smaller':
				splitPath.append(name)
				location = os.path.join('', *splitPath)
				splitPath.insert(1, 'thumbs/')
				thumbLocation = os.path.join('', *splitPath)
				splitPath[1] = 'smaller'
				smallLocation = os.path.join('', *splitPath)
				images.append({name: {'Folder': splitPath[2],  'SmallLoc': smallLocation, 'ThumbLoc': thumbLocation}})
	with io.open('static/json/images.json', 'w', encoding='utf-8') as f:
		f.write(unicode(json.dumps(images, ensure_ascii=False, indent=2, separators=(',', ': '))))
	for img in images:
		pp.pprint(img)

make_json()
	