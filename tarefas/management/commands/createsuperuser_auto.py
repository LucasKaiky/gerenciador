from django.core.management.base import BaseCommand
from django.contrib.auth.models import User

class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser('admin', 'admin@example.com', 'AdminPassword123')
            self.stdout.write(self.style.SUCCESS('Superuser "admin" created successfully'))
        else:
            self.stdout.write(self.style.WARNING('Superuser "admin" already exists'))
