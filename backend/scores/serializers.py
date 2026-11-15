from rest_framework import serializers
from .models import Score

#Inicializamos el serializador para el modelo Score
class ScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Score
        fields = '__all__'

    # Validación personalizada de la puntuación
    # Mayor a 0 (no negativa)
    def validate_score(self, value):
        if value < 0:
            raise serializers.ValidationError("La puntuación no puede ser negativa.")
        return value

    # Validación personalizada para el nombre del jugador
    # Mayor a 3 caracteres
    def validate_player_name(self, value):
        if len(value.strip()) < 3:
            raise serializers.ValidationError("El nombre debe tener al menos 3 caracteres.")
        return value