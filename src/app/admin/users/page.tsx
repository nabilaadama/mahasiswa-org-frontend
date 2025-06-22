'use client';

import { useEffect, useState } from 'react';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { useRouter } from 'next/navigation';
import { Plus, Trash2 } from 'lucide-react';
import { createUser, deleteUser, getUsers } from '@/lib/api';

type User = {
  id: number;
  studentId: string;
  role: string;
  createdAt: string;
};

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    if (!token) return router.push('/login');

    try {
        const data = await getUsers(token);
        setUsers(data);
    } catch (error) {
        console.error(error);
        alert('Gagal mengambil data user');
    } finally {
        setLoading(false);
    }
    };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) return router.push('/login');

    try {
        await createUser({ studentId, password, role }, token);
        setShowAddModal(false);
        setStudentId('');
        setPassword('');
        setRole('student');
        fetchUsers();
    } catch (error) {
        console.error(error);
        alert('Gagal menambahkan user');
    }
    };


  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    const token = localStorage.getItem('token');
    if (!token) return router.push('/login');

    try {
        await deleteUser(selectedUser.id, token);
        setShowDeleteModal(false);
        setSelectedUser(null);
        fetchUsers();
    } catch (error) {
        console.error(error);
        alert('Gagal menghapus user');
    }
    };

  const columns: MRT_ColumnDef<User>[] = [
    { accessorKey: 'studentId', header: 'Student ID' },
    { accessorKey: 'role', header: 'Role' },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      Cell: ({ cell }) => new Date(cell.getValue<string>()).toLocaleString(),
    },
    {
      header: 'Actions',
      Cell: ({ row }) => (
        <button
          className="text-red-600 hover:text-red-800"
          onClick={() => {
            setSelectedUser(row.original);
            setShowDeleteModal(true);
          }}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">List Users</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </div>

      <MaterialReactTable
        columns={columns}
        data={users}
        state={{ isLoading: loading }}
        enableColumnActions
        enableSorting
        enableGlobalFilter
      />

      {/* Modal Tambah User */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white p-6 rounded-lg w-[400px] shadow-lg">
            <h2 className="text-xl font-bold text-center mb-4">Add User</h2>
            <label className="block mb-2">
              <span className="text-sm">Student ID</span>
              <input
                type="text"
                className="w-full border rounded-full px-3 py-2 mt-1"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
              />
            </label>
            <label className="block mb-2">
              <span className="text-sm">Password</span>
              <input
                type="password"
                className="w-full border rounded-full px-3 py-2 mt-1"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <label className="block mb-4">
              <span className="text-sm">Role</span>
              <select
                className="w-full border rounded-full px-3 py-2 mt-1 "
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
            </label>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-500"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                onClick={handleAddUser}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Hapus */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white p-6 rounded-lg w-[400px] shadow-lg">
            <h2 className="text-xl font-bold text-center mb-2 text-red-600">Delete User</h2>
            <p className="text-center text-gray-700">
              Are you sure delete user <strong>{selectedUser.studentId}</strong>?
            </p>
            <div className="flex justify-center gap-4 mt-6">
              <button
                className="bg-gray-300 text-gray-800 py-2 px-6 rounded-md hover:bg-gray-400"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedUser(null);
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="bg-red-500 text-white py-2 px-6 rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
