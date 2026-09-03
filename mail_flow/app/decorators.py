from django.shortcuts import redirect
from django.contrib.auth.decorators import login_required
from django.views.decorators.cache import never_cache, cache_control
from functools  import wraps



def custom_login_required(view_func):
    @wraps(view_func)
    @login_required
    @never_cache
    @cache_control(no_cache=True, must_revalidate=True, no_store=True)
    def wrapped_view(request, *args, **kwargs):
        return view_func(request, *args, **kwargs)
    
    return wrapped_view