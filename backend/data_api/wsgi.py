"""
WSGI config for data_api project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "data_api.settings")

application = get_wsgi_application()

#synchronous web server gateway interface that transfers request from http server to django application
#used for api requests and website requests