"use client";

import { useState, useEffect } from "react";
import { fetchUsers, synchronizeTeachers } from "@/app/admin/user-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus, RefreshCw, Loader2 } from "lucide-react";
import { UserTable } from "./UserTable";
import { CreateTeacherDialog } from "./CreateTeacherDialog";
import { toast } from "sonner";

interface User {
  id: number;
  name: string | null;
  email: string;
  role: string;
  wiseLmsTeacherId: string | null;
  createdAt: Date;
}

export function UserManagementTab() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  // Load users on mount
  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Apply filters whenever users or filters change
  useEffect(() => {
    let filtered = users;

    // Role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    // Search filter (name or email)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.email.toLowerCase().includes(query) ||
          user.name?.toLowerCase().includes(query)
      );
    }

    setFilteredUsers(filtered);
  }, [users, searchQuery, roleFilter]);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const allUsers = await fetchUsers();
      setUsers(allUsers);
    } catch (error) {
      console.error("Error loading users:", error);
      toast.error("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSynchronize = async () => {
    setIsSyncing(true);
    try {
      const formData = new FormData();
      const result = await synchronizeTeachers({}, formData);

      if ('success' in result && result.success) {
        toast.success(result.success, {
          duration: 5000,
          position: 'top-right',
        });
        // Refresh the user list to show updated IDs
        loadUsers();
      } else if ('error' in result && result.error) {
        toast.error(result.error, {
          duration: 5000,
          position: 'top-right',
        });
      }
    } catch (error) {
      console.error('Error synchronizing teachers:', error);
      toast.error('Failed to synchronize teachers');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#002366]">User Management</h2>
          <p className="text-gray-600 mt-1">
            Manage teacher accounts and their WiseLMS integration
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadUsers}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSynchronize}
            disabled={isSyncing || isLoading}
            title="Sync teacher accounts with WiseLMS"
          >
            {isSyncing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Synchronize
              </>
            )}
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Create Teacher Account
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Filter by Role</Label>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger id="role">
              <SelectValue placeholder="All roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="teacher">Teacher</SelectItem>
              <SelectItem value="owner">Owner</SelectItem>
              <SelectItem value="member">Member</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white border rounded-lg">
          <div className="text-sm text-gray-600">Total Users</div>
          <div className="text-2xl font-bold">{users.length}</div>
        </div>
        <div className="p-4 bg-white border rounded-lg">
          <div className="text-sm text-gray-600">Teachers</div>
          <div className="text-2xl font-bold">
            {users.filter((u) => u.role === "teacher").length}
          </div>
        </div>
        <div className="p-4 bg-white border rounded-lg">
          <div className="text-sm text-gray-600">Admins</div>
          <div className="text-2xl font-bold">
            {users.filter((u) => u.role === "admin").length}
          </div>
        </div>
        <div className="p-4 bg-white border rounded-lg">
          <div className="text-sm text-gray-600">Others</div>
          <div className="text-2xl font-bold">
            {users.filter((u) => u.role !== "teacher" && u.role !== "admin").length}
          </div>
        </div>
      </div>

      {/* User Table */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : (
        <UserTable users={filteredUsers} onRefresh={loadUsers} />
      )}

      {/* Create Teacher Dialog */}
      <CreateTeacherDialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={loadUsers}
      />
    </div>
  );
}
