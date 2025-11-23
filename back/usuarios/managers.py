from django.contrib.auth.base_user import BaseUserManager

class UsuarioManager(BaseUserManager):

    def create_user(self, email, nombre, password=None, rol="usuario"):
        if not email:
            raise ValueError('El usuario debe tener un email')

        if not password:
            raise ValueError("El usuario debe tener una contraseña")

        email = self.normalize_email(email)

        user = self.model(
            email=email,
            nombre=nombre,
            rol=rol,
        )

        user.set_password(password)  # 🔥 esto guarda el hash en user.password
        user.save(using=self._db)
        return user

    def create_superuser(self, email, nombre, password):
        user = self.create_user(email, nombre, password, rol="admin")
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user
