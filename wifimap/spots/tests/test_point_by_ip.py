from django.test import TestCase
from django.core.urlresolvers import reverse
from django.utils import simplejson
from django.conf import settings

from spots.lib import point_by_ip

class PointByIpTest(TestCase):
    
    def setUp(self):
        settings.DEBUG = True

    def test_point_by_ip(self):
        point = point_by_ip('201.7.176.59')
        assert point == ["Brazil", [-14.235004, -51.925280000000001]]

    def test_point_by_ip_with_city(self):
        point = point_by_ip('200.147.67.142')
        assert point == [u'Sao Paulo - S\xe3o Paulo, Brazil', [-23.548943300000001, -46.638818200000003]]

    def test_point_by_ip_with_another_city(self):
        point = point_by_ip('208.113.199.25')
        assert point == ['Brea, CA, USA', [33.916680499999998, -117.9000604]]
        
    def test_view_point_by_ip(self):
        response = self.client.get(reverse('point_by_ip'))
        assert simplejson.loads(response.content) == [u'Sao Paulo - S\xe3o Paulo, Brazil', [-23.548943300000001, -46.638818200000003]]