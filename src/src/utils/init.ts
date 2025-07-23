import { User } from '../models/user';
import bcrypt from 'bcryptjs';

export const createDefaultUser = async () => {
  const exists = await User.findOne({ username: 'admin' });
  if (!exists) {
    const hashedPassword = await bcrypt.hash('1234', 10);
    await User.create({
      name: 'Administrador',
      username: 'admin',
      email: 'admin@nexstock.com',
      password: hashedPassword,
      role: 'admin',
      phone: '0000000000',
      status: true,
      roles: ['admin']
    });
    console.log('✅ Usuario admin creado correctamente');
  } else {
    console.log('');
  }
};
