from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin
from .models import Tarefa

class TarefaInline(admin.TabularInline):
    model = Tarefa
    extra = 0

class CustomUserAdmin(UserAdmin):
    inlines = [TarefaInline]

admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)

@admin.register(Tarefa)
class TarefaAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'usuario', 'concluida', 'criada_em')
    search_fields = ('titulo', 'usuario__username')
    list_filter = ('concluida', 'criada_em', 'usuario')
