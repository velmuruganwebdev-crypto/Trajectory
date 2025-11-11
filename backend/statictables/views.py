import csv
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import StaticTable
from .serializers import StaticTableSerializer

class UploadFileView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        uploaded_file = request.FILES.get("file")
        if not uploaded_file:
            return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)

        file_name = uploaded_file.name
        file_size = f"{round(uploaded_file.size / 1024,2)} KB"

        obj = StaticTable.objects.create(
            uploaded_file=uploaded_file,
            file_name=file_name,
            file_size=file_size,
            uploaded_by=request.user,
            modified_by=request.user
        )
        return Response({"message": f"{file_name} uploaded successfully"}, status=status.HTTP_201_CREATED)


class FileListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # Admin sees all files
        if user.is_superuser or user.username == "admin":
            qs = StaticTable.objects.all().order_by('-uploaded_at')
        else:
            qs = StaticTable.objects.filter(uploaded_by=user).order_by('-uploaded_at')

        files = []
        for f in qs:
            files.append({
                "id": f.id,
                "file_name": f.file_name,
                "file_size": f.file_size,
                "uploaded_by": f.uploaded_by.username,
                "modified_by": f.modified_by.username,
                "uploaded_at": f.uploaded_at,
                "modified_at": f.modified_at,
                "file_url": f.uploaded_file.url,
                "is_owner": user == f.uploaded_by or user.is_superuser or user.username == "admin"
            })

        return Response(files)



class UpdateFileView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            obj = StaticTable.objects.get(pk=pk)
        except StaticTable.DoesNotExist:
            return Response({"error": "File not found"}, status=status.HTTP_404_NOT_FOUND)

        if request.user != obj.uploaded_by and request.user.username != "admin":
            return Response({"error": "Not allowed"}, status=status.HTTP_403_FORBIDDEN)

        new_file = request.FILES.get("file")
        if not new_file:
            return Response({"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST)

        obj.uploaded_file = new_file
        obj.file_name = new_file.name
        obj.file_size = f"{round(new_file.size/1024,2)} KB"
        obj.modified_by = request.user
        obj.save()

        return Response({"message": "File updated successfully"})


class DeleteFileView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        try:
            obj = StaticTable.objects.get(pk=pk)
        except StaticTable.DoesNotExist:
            return Response({"error": "File not found"}, status=status.HTTP_404_NOT_FOUND)

        if request.user != obj.uploaded_by and request.user.username != "admin":
            return Response({"error": "Not allowed"}, status=status.HTTP_403_FORBIDDEN)

        obj.uploaded_file.delete()
        obj.delete()
        return Response({"message": "File deleted successfully"})

class FileDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            file_qs = StaticTable.objects.filter(id=pk)
            if not file_qs.exists():
                return Response({"error": "File not found"}, status=status.HTTP_404_NOT_FOUND)

            serializer = StaticTableSerializer(file_qs, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class FileDataView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        """
        Return CSV rows for the file with id=pk
        """
        file_obj = get_object_or_404(StaticTable, pk=pk)

        try:
            # Read the uploaded file from path
            csv_path = file_obj.uploaded_file.path
            with open(csv_path, "r") as f:
                reader = csv.DictReader(f)
                rows = []
                for row in reader:
                    # convert all values to float if possible
                    clean_row = {}
                    for key, val in row.items():
                        try:
                            clean_row[key] = float(val)
                        except:
                            clean_row[key] = val
                    rows.append(clean_row)

            return Response(rows)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
