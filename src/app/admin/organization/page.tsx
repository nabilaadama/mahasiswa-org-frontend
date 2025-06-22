'use client';

import { useEffect, useState } from 'react';
import { MaterialReactTable, MRT_ColumnDef } from 'material-react-table';
import { Plus, Trash2, Eye, Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL, fetchWithAuth } from '@/lib/api';

type Organization = {
  id: number;
  name: string;
  fullname: string;
  description: string;
  logo_URL: string;
  vision: string;
  mission: string;
  createdAt: string;
  updatedAt: string;
};

export default function OrganizationPage() {
  const [data, setData] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const router = useRouter();

  const columns: MRT_ColumnDef<Organization>[] = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'fullname', header: 'Full Name' },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      Cell: ({ cell }) => new Date(cell.getValue<string>()).toLocaleString(),
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      Cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setSelectedOrg(row.original);
              setShowDetailModal(true);
            }}
            className="text-blue-600 hover:underline"
            title="Lihat Detail"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => {
              router.push(`/admin/organization/edit/${row.original.id}`);
            }}
            className="text-yellow-600 hover:underline"
            title="Edit"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => {
              setDeleteId(row.original.id);
              setShowDeleteModal(true);
            }}
            className="text-red-600 hover:underline"
            title="Hapus"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  const fetchOrganizations = async () => {
  try {
    const res = await fetchWithAuth('/organization');
    if (!res.ok) throw new Error('Failed to fetch organizations');
    const orgs = await res.json();
    setData(orgs);
  } catch (err) {
    alert('Gagal mengambil data organisasi');
    router.push('/login');
  } finally {
    setLoading(false);
  }
};

const handleDelete = async () => {
  if (!deleteId) return;
  try {
    await fetchWithAuth(`/organization/${deleteId}`, {
      method: 'DELETE',
    });
    setData((prev) => prev.filter((org) => org.id !== deleteId));
    setShowDeleteModal(false);
    setDeleteId(null);
  } catch (error) {
    alert('Gagal menghapus organisasi');
  }
};


  useEffect(() => {
    fetchOrganizations();
  }, []);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">List Organization</h1>
        <button
          onClick={() => router.push('/admin/organization/add')}
          className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Organization
        </button>
      </div>

      <MaterialReactTable
        columns={columns}
        data={data}
        state={{ isLoading: loading }}
        enableColumnActions
        enableSorting
        enableGlobalFilter
      />

      {/* Detail Modal */}
      {showDetailModal && selectedOrg && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[9999]">
          <div className="bg-white p-6 rounded-lg w-[500px] shadow-xl">
            <h2 className="text-xl font-bold mb-4">Detail Organization</h2>
            <p><strong>Name:</strong> {selectedOrg.name}</p>
            <p><strong>Fullname:</strong> {selectedOrg.fullname}</p>
            <p><strong>Description:</strong> {selectedOrg.description}</p>
            <p><strong>Vision:</strong> {selectedOrg.vision}</p>
            <p><strong>Mission:</strong> {selectedOrg.mission}</p>
            <p><strong>Logo URL:</strong></p>
            <img src={selectedOrg.logo_URL} alt="Logo" className="h-32 mt-2" />
            <div className="text-right mt-6">
              <button
                onClick={() => setShowDetailModal(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <div className="flex flex-col items-center">
              <Trash2 className="h-12 w-12 text-red-600" />
              <h2 className="text-xl font-bold text-black mt-3">Delete Organization</h2>
              <p className="text-gray-600 mt-1 text-center">
                Are you sure you want to delete this organization?
              </p>
            </div>
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-300 text-gray-800 py-2 px-6 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white py-2 px-6 rounded-md hover:bg-red-600 transition-colors"
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
