export const getUsers = async (token) => {
  try {
    const response = await fetch('https://auth.nexusutd.online/auth/users', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    return {
      status: response.status,
      data,
    };
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return {
      status: 500,
      data: { message: 'Error de red' },
    };
  }
};
