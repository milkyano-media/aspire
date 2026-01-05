"use client";

import { useState, useActionState, useEffect, startTransition } from "react";
import { createTeacherAccount } from "@/app/admin/user-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface CreateTeacherDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateTeacherDialog({
  open,
  onClose,
  onSuccess,
}: CreateTeacherDialogProps) {
  const [state, formAction, isPending] = useActionState(createTeacherAccount, {});
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [hasHandledState, setHasHandledState] = useState(false);

  // Reset handled state when dialog opens
  useEffect(() => {
    if (open) {
      setHasHandledState(false);
    }
  }, [open]);

  // Handle success/error from server action
  useEffect(() => {
    if (!open || hasHandledState) return;

    if ('success' in state && state.success) {
      toast.success(state.success);
      setHasHandledState(true);
      onSuccess();
      onClose();
    } else if ('error' in state && state.error) {
      toast.error(state.error);
      setHasHandledState(true);
    }
  }, [state, onSuccess, onClose, open, hasHandledState]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate password match
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }

    setPasswordError("");

    // Submit form in a transition
    const formData = new FormData(e.currentTarget);
    startTransition(() => {
      formAction(formData);
    });
  };

  const handleClose = () => {
    if (!isPending) {
      setPassword("");
      setConfirmPassword("");
      setPasswordError("");
      setHasHandledState(false);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Teacher Account</DialogTitle>
          <DialogDescription>
            Create a new teacher account. The teacher will use these credentials to sign in.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="John Doe"
              required
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="teacher@aspireacademics.com.au"
              required
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isPending}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isPending}
            />
            {passwordError && (
              <p className="text-sm text-red-500">{passwordError}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="wiseLmsTeacherId">
              WiseLMS Teacher ID
              <span className="text-xs text-gray-500 ml-2">
                (Optional - can be synced later)
              </span>
            </Label>
            <Input
              id="wiseLmsTeacherId"
              name="wiseLmsTeacherId"
              placeholder="e.g., 507f1f77bcf86cd799439011"
              disabled={isPending}
            />
            <p className="text-xs text-gray-500">
              Leave empty to sync automatically later using the Synchronize button.
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Teacher Account"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
