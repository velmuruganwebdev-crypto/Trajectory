from django.urls import path
from .views import UploadFileView, FileListView, UpdateFileView, DeleteFileView,FileDetailView,FileDataView

urlpatterns = [
    path('uploadcsv/', UploadFileView.as_view(), name='uploadcsv'),
    path('files/', FileListView.as_view(), name='files'),
    path('update/<int:pk>/', UpdateFileView.as_view(), name='update_file'),
    path('delete/<int:pk>/', DeleteFileView.as_view(), name='delete_file'),
    path('files/<int:pk>/', FileDetailView.as_view()),
    path('file-data/<int:pk>/', FileDataView.as_view(), name='file-data'),
]
