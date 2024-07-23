// authMiddleware.js

export const isAdmin = (req, res, next) => {
  if (req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'No autorizado' });
};

export const isPropietario = (req, res, next) => {
  if (req.user.role === 'propietario') {
    return next();
  }
  return res.status(403).json({ message: 'No autorizado' });
};

export const isAdminOrPropietario = (req, res, next) => {
  if (req.user.role === 'admin' || req.user.role === 'propietario') {
    return next();
  }
  return res.status(403).json({ message: 'No autorizado' });
};
