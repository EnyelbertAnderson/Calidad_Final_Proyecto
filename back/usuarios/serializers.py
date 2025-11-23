from rest_framework import serializers
from .models import Usuario

class UsuarioSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Usuario
        fields = [
            'id_usuario',
            'nombre',
            'email',
            'rol',
            'password'
        ]
        read_only_fields = ['id_usuario']

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = Usuario.objects.create_user(
            password=password,
            **validated_data
        )
        return user

