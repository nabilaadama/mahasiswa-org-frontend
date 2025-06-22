export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export const getToken = () => {
  return typeof window !== 'undefined' ? localStorage.getItem('token') : null;
};

export const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();
  if (!token) throw new Error('Token tidak ditemukan. Silakan login.');

  return fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};

export async function getUsers(token: string) {
  const res = await fetch(`${API_BASE_URL}/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('Failed to fetch users');
  return await res.json();
}

export async function createUser(data: { studentId: string; password: string; role: string }, token: string) {
  const res = await fetch(`${API_BASE_URL}/user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error('Failed to create user');
  return await res.json();
}

export async function deleteUser(userId: number, token: string) {
  const res = await fetch(`${API_BASE_URL}/user/${userId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('Failed to delete user');
  return await res.json();
}
