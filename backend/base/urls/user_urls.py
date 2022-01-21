from django.urls import path
from base.views import user_views as views

# Here after customizing our jwt claims, we have to change the view to our custom view
# which is MyTokenObtainPairView
urlpatterns = [
    path('login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('register/', views.registerUser, name='register'),
    path('profile/',views.getUserProfile,name='user-profile'),
    path('profile/update/',views.updateUserProfile,name='user-profile-update'),
    path('',views.getUsers,name='users'),

    path('<str:pk>/',views.getUserByID,name='user'), 
    # This url pattern should be down in the hierarchy
    # coz 'login/' 'register/' 'profile/' can get in conflict with this url pattern.

    path('update/<str:pk>/',views.updateUser,name='user-update'),
    path('delete/<str:pk>/',views.deleteUser,name='user-delete'),
]