
/ posts	100 posts
/ comments	500 comments
/ albums	100 albums
/ photos	5000 photos
/ todos	200 todos
/ users

from django.contrib import admin
from django.conf.urls import include, url
from rest_framework import routers
from django.conf.urls.static import static
from django.conf import settings
from . import views as responseapp_views

urlpatterns = [
 url(r'^project/$', responseapp_views.ProjectViewSet.as_view({'get': 'list'}), name='project'),
 url(r'^category/', responseapp_views.CategoryViewSet.as_view({'get': 'list'}), name='cata'),
 url(r'^projectview/', responseapp_views.ProjectCategoryMapViewSet.as_view({'get': 'list'}), name='cata'),
 url(r'^upload/', responseapp_views.FileUploadView.as_view(), name="upload"),
 url(r'^netstorage/', responseapp_views.uploadtoNetstorage.as_view({'get': 'list'}), name="uploadtonetstorage"),
 url(r'^post/', responseapp_views.CreateView.as_view(), name="postdetails"),
 url(r'^list/', responseapp_views.PostList.as_view(), name="post"),

 url(r'^recent/', responseapp_views.Toprequests.as_view(), name="post"),

 url(r'^visitor/', responseapp_views.VisitorList.as_view(), name="Visitor List"),
 url(r'^allvisitor/', responseapp_views.AllvisitorList.as_view(), name="All Visitor List"),
 
 url(r'^lists/', responseapp_views.CreateViewList.as_view(), name="list"),
 url(r'^submitrequest', responseapp_views.RequestToProcess.as_view(), name="submitrequest"),
]
router = routers.DefaultRouter()
router.register('addproject', responseapp_views.ProjectViewSet)
router.register('addcategory', responseapp_views.CategoryViewSet)
router.register('map', responseapp_views.ProjectCategoryMapViewSet)
router.register(r'cpcode', responseapp_views.edgercsearchCPCode, base_name="cpcode Search")
router.register(r'rg', responseapp_views.edgercsearchreportinggroup, base_name="rg Search")       
urlpatterns += router.urls

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)