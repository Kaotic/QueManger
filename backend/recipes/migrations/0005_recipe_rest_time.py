# Generated by Django 4.2.6 on 2023-10-25 13:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('recipes', '0004_alter_profile_first_name_alter_profile_last_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='recipe',
            name='rest_time',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
    ]
