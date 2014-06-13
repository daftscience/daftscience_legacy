
import os
from pprint import pprint

def make_timestamps(files):
	fileVersions = {}
	pprint(fileVersions)
	for file in files:
		fileVersions[file] = os.path.getmtime(file)
	return fileVersions