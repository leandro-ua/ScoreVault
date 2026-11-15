from django.db import models

# Create your models here.

#Puntaje model : Recibe nombre de jugador, puntuacion y su fecha de creacion
#player_name= charfiel , 100 caracteres maximos
#score      = integerfield, sin limite
#created_at = datetimefield, se genera automaticamente al crear el registro
class Score(models.Model):
    player_name = models.CharField(max_length=100, verbose_name="Nombre del Jugador")
    score = models.IntegerField(verbose_name="Puntuación")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de creación")

    def __str__(self):
        return f"{self.player_name} - {self.score}"