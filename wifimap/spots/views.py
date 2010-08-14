# -*- coding: utf-8 -*-

from django.shortcuts import render_to_response
from django.views.generic.simple import direct_to_template

def index(request):
    return direct_to_template(request, 'index.html', extra_context={})

