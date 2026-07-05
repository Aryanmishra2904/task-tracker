import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const EMPTY_FORM = {
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
  dueDate: "",
};

/**
 * Shared create/edit form rendered inside a Dialog.
 * `initialTask` is null when creating, or a task object when editing.
 * `open` controls dialog visibility so it can be dismissed via the
 * overlay, the Escape key, or the close button, in addition to Cancel.
 */
export default function TaskForm({ open, initialTask, onSubmit, onClose }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = Boolean(initialTask);

  useEffect(() => {
    if (initialTask) {
      setForm({
        title: initialTask.title || "",
        description: initialTask.description || "",
        status: initialTask.status || "todo",
        priority: initialTask.priority || "medium",
        dueDate: initialTask.dueDate ? initialTask.dueDate.slice(0, 10) : "",
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [initialTask, open]);

  const validate = () => {
    const nextErrors = {};
    const trimmedTitle = form.title.trim();

    if (!trimmedTitle) {
      nextErrors.title = "Title is required";
    } else if (trimmedTitle.length < 3) {
      nextErrors.title = "Title must be at least 3 characters";
    } else if (trimmedTitle.length > 100) {
      nextErrors.title = "Title cannot exceed 100 characters";
    }

    if (form.description.length > 500) {
      nextErrors.description = "Description cannot exceed 500 characters";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: form.title.trim(),
        description: form.description.trim(),
        status: form.status,
        priority: form.priority,
        dueDate: form.dueDate || null,
      });
    } catch (err) {
      // Surface server-side field errors (e.g. from express-validator) too
      if (err.errors) {
        const serverErrors = {};
        err.errors.forEach((fieldErr) => {
          serverErrors[fieldErr.field] = fieldErr.message;
        });
        setErrors(serverErrors);
      }
      setIsSubmitting(false);
      return;
    }
    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit task" : "New task"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              type="text"
              value={form.title}
              onChange={handleChange("title")}
              placeholder="e.g. Write project proposal"
              aria-invalid={Boolean(errors.title)}
              autoFocus
            />
            {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={3}
              value={form.description}
              onChange={handleChange("description")}
              placeholder="Optional details about this task"
              aria-invalid={Boolean(errors.description)}
            />
            {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="status">Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm((p) => ({ ...p, status: v }))}>
                <SelectTrigger id="status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To do</SelectItem>
                  <SelectItem value="in-progress">In progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="priority">Priority</Label>
              <Select value={form.priority} onValueChange={(v) => setForm((p) => ({ ...p, priority: v }))}>
                <SelectTrigger id="priority" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="dueDate">Due date</Label>
              <Input id="dueDate" type="date" value={form.dueDate} onChange={handleChange("dueDate")} />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : isEditing ? "Save changes" : "Create task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}