from rest_framework import serializers
from .models import StaticTable

class StaticTableSerializer(serializers.ModelSerializer):
    class Meta:
        model = StaticTable
        fields = '__all__'
