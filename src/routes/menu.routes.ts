import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  const menu = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: 'home', // puedes usar el nombre del ícono aquí si quieres mapearlo
    },
    {
      path: '/users',
      label: 'Usuarios',
      icon: 'user',
    },
    {
      path: '/products',
      label: 'Productos',
      icon: 'box',
    },
    {
      path: '/orders',
      label: 'Órdenes',
      icon: 'shopping-cart',
    },
  ];

  res.json(menu);
});

export default router;
