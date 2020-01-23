from django.db import models

# Create your models here.


class Posts(models.Model):
    UserId = models.IntegerField(null=True, blank=True)
    Title = models.CharField(max_length=100, null=True, blank=True)
    #email = models.CharField(max_length=100, null=True, blank=True)
    Body = models.CharField(null=True, blank=True)

    class Meta:
        db_table = "post" 

    def __unicode__(self):
        return self.userId


class Comments(models.Model):
    postId = models.IntegerField(null=True, blank=True)
    Name = models.CharField(max_length=100, null=True, blank=True)
    Email = models.CharField(max_length=100, null=True, blank=True)
    Body = models.CharField(null=True, blank=True)
   
    def __unicode__(self):
        return self.postId

    class Meta:
        db_table = "comments" 


class Albums(models.Model):
    userId = models.IntegerField(null=True, blank=True)
    title = models.CharField(null=True, blank=True)
   
    def __unicode__(self):
        return self.userId

    class Meta:
        db_table = "albums" 

        
class Photos(models.Model):
    albumId = models.IntegerField(null=True, blank=True)
    title = models.CharField(null=True, blank=True)
    url = models.CharField(null=True, blank=True)
    thumbnailUrl = models.CharField(null=True, blank=True)
   
    def __unicode__(self):
        return self.albumId

    class Meta:
        db_table = "photos" 
    
       
class Todos(models.Model):
    userId = models.IntegerField(null=True, blank=True)
    title = models.CharField(null=True, blank=True)
    completed = models.CharField(null=True, blank=True)
   
    def __unicode__(self):
        return self.userId

    class Meta:
        db_table = "todos" 