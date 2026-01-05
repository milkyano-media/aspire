"use client";

import { useState, useActionState, useEffect, startTransition } from "react";
import { deleteUser, updateTeacherWiseLmsId } from "@/app/admin/user-actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2, Edit, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface User {
  id: number;
  name: string | null;
  email: string;
  role: string;
  wiseLmsTeacherId: string | null;
  createdAt: Date;
}

interface UserTableProps {
  users: User[];
  onRefresh: () => void;
}

export function UserTable({ users, onRefresh }: UserTableProps) {
  const [deleteState, deleteAction, isDeleting] = useActionState(deleteUser, {});
  const [updateState, updateAction, isUpdating] = useActionState(updateTeacherWiseLmsId, {});

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editedTeacherId, setEditedTeacherId] = useState("");

  // Handle delete success/error
  useEffect(() => {
    if ('success' in deleteState && deleteState.success) {
      toast.success(deleteState.success);
      setDeleteDialogOpen(false);
      setSelectedUser(null);
      onRefresh();
    } else if ('error' in deleteState && deleteState.error) {
      toast.error(deleteState.error);
    }
  }, [deleteState, onRefresh]);

  // Handle update success/error
  useEffect(() => {
    if ('success' in updateState && updateState.success) {
      toast.success(updateState.success);
      setEditDialogOpen(false);
      setSelectedUser(null);
      onRefresh();
    } else if ('error' in updateState && updateState.error) {
      toast.error(updateState.error);
    }
  }, [updateState, onRefresh]);

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setEditedTeacherId(user.wiseLmsTeacherId || "");
    setEditDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedUser) return;
    const formData = new FormData();
    formData.append("userId", selectedUser.id.toString());
    startTransition(() => {
      deleteAction(formData);
    });
  };

  const handleUpdateConfirm = () => {
    if (!selectedUser) return;
    const formData = new FormData();
    formData.append("userId", selectedUser.id.toString());
    formData.append("wiseLmsTeacherId", editedTeacherId);
    startTransition(() => {
      updateAction(formData);
    });
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "teacher":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "owner":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>WiseLMS Teacher ID</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.name || "—"}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge className={getRoleBadgeColor(user.role)}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.role === "teacher" || user.role === "admin" ? (
                      <span className="font-mono text-sm">
                        {user.wiseLmsTeacherId || (
                          <span className="text-gray-400 italic">Not set</span>
                        )}
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {(user.role === "teacher" || user.role === "admin") && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditClick(user)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(user)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User Account</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedUser?.name || selectedUser?.email}?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete User"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit WiseLMS ID Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit WiseLMS Teacher ID</DialogTitle>
            <DialogDescription>
              Update the WiseLMS Teacher ID for {selectedUser?.name || selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">WiseLMS Teacher ID</label>
              <Input
                value={editedTeacherId}
                onChange={(e) => setEditedTeacherId(e.target.value)}
                placeholder="e.g., 507f1f77bcf86cd799439011"
                disabled={isUpdating}
              />
              <p className="text-xs text-gray-500">
                This ID must match the user's ID in WiseLMS coTeachers data
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateConfirm}
              disabled={isUpdating || !editedTeacherId}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
