# backend/statictables/models.py
from django.db import models
from django.contrib.auth.models import User

class StaticTable(models.Model):
    id = models.AutoField(primary_key=True)
    file_name = models.CharField(max_length=255)
    uploaded_file = models.FileField(upload_to='uploads/%Y/%m/%d/')
    file_size = models.CharField(max_length=50, blank=True)

    uploaded_by = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        related_name='statictable_uploaded'
    )
    modified_by = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        related_name='statictable_modified'
    )

    uploaded_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.file_name} ({self.uploaded_by})"
