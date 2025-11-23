import json
from datetime import datetime, timedelta
import jwt

from django.conf import settings
from django.contrib.auth import authenticate
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
def login_view(request):
    if request.method != 'POST':
        return JsonResponse({'detail': 'Method not allowed'}, status=405)

    try:
        data = json.loads(request.body.decode('utf-8'))
    except Exception:
        return JsonResponse({'detail': 'Invalid JSON body'}, status=400)

    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return JsonResponse({'detail': 'email and password required'}, status=400)

    # SE DEFINIO AUTH_USER_MODEL = usuarios.Usuario
    # authenticate DEBE RECIBIR email=<email>
    user = authenticate(request, email=email, password=password)

    if user is None:
        return JsonResponse({'detail': 'Invalid credentials'}, status=401)

    payload = {
        'user_id': user.id_usuario,  # CAMBIO
        'email': user.email,         # CAMBIO
        'rol': user.rol,             # OPCIONAL
        'exp': datetime.utcnow() + timedelta(hours=1),
    }

    token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')

    return JsonResponse({'token': token})


def jwt_required(view_func):
    def _wrapped(*args, **kwargs):
        # detecta si es método de clase (self, request, ...)
        if len(args) == 1:
            request = args[0]
        else:
            request = args[1]

        auth = request.META.get('HTTP_AUTHORIZATION', '')
        if not auth.startswith('Bearer '):
            return JsonResponse({'detail': 'Authentication credentials were not provided.'}, status=401)

        token = auth.split(' ', 1)[1]

        try:
            decoded = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            return JsonResponse({'detail': 'Token has expired.'}, status=401)
        except jwt.InvalidTokenError:
            return JsonResponse({'detail': 'Invalid token.'}, status=401)

        request.jwt_payload = decoded
        return view_func(*args, **kwargs)

    return _wrapped


@jwt_required
def protected_view(request):
    payload = request.jwt_payload
    return JsonResponse({
        'detail': 'Access granted',
        'user_id': payload.get('user_id'),
        'email': payload.get('email'),
        'rol': payload.get('rol'),
    })