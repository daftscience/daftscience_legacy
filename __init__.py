from app import app


#from wtforms.validators import Required
#from flask.ext.assets import Environment, Bundle
from counterVariables import diffCells, diffKeys, ueoCells, ueoKeys, paraCells, paraKeys
import pushover

#assets = Environment(app)
app.config.from_object(__name__)

from counter import counter
from testSite import testSite

app.register_blueprint(counter)
app.register_blueprint(testSite)

# Load default config and override config from an environment variable
app.config.update(dict(
    DATABASE=os.path.join(app.root_path, 'Gallery.db'),
    DEBUG=True,
    SECRET_KEY='development key',
    USERNAME='admin',
    PASSWORD='default'
))
app.config.from_envvar('FLASKR_SETTINGS', silent=True)

