from django.urls import path
from .views import ExecutePipelineView, SignupView, LoginView, NewProjectView, AllUsersView, AllProjectsView, DeleteProjectView, OpenWhiteboardView, UploadWhiteboardView

urlpatterns = [
    path('execute-pipeline/', ExecutePipelineView.as_view(), name='execute-pipeline'),
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('new-project/', NewProjectView.as_view(), name='new-project'),
    path('all-users/', AllUsersView.as_view(), name='all-users'),
    path('all-projects/', AllProjectsView.as_view(), name='all-projects'),
    path('delete-project/', DeleteProjectView.as_view(), name='delete-project'),
    path('Whiteboard/<str:project_id>/', OpenWhiteboardView.as_view(), name='open-Whiteboard'),
    path('upload-Whiteboard/', UploadWhiteboardView.as_view(), name='upload-Whiteboard'),
] 

#as_view() is a method that converts class-based view into a function based view that takes request and return response
#class ExecutePipelineView(View):
#    def get(self, request):
#        return HttpResponse("This handles GET requests")
#    
#    def post(self, request):
#        return HttpResponse("This handles POST requests")#

## When you use as_view() in urls.py, it's equivalent to something like this:
#def view_function(request, *args, **kwargs):
#    view_instance = ExecutePipelineView()
#    if request.method == 'GET':
#        return view_instance.get(request)
#    elif request.method == 'POST':
#        return view_instance.post(request)