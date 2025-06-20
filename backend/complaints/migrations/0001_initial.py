# Generated by Django 5.2.1 on 2025-05-27 10:38

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Complaint',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('failure_date', models.DateField()),
                ('operating_hours', models.PositiveIntegerField()),
                ('failure_description', models.TextField()),
                ('spare_parts', models.TextField(blank=True)),
                ('recovery_date', models.DateField()),
                ('downtime', models.PositiveIntegerField(editable=False)),
            ],
        ),
    ]
