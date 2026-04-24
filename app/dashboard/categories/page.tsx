"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/store/slices/categoriesSlice";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Tag, X, Loader2 } from "lucide-react";
import type { Category } from "@/lib/api";

const ICONS = [
  "🍔",
  "🍕",
  "🍜",
  "☕",
  "🍺",
  "🛒",
  "🏠",
  "💡",
  "📱",
  "🚗",
  "✈️",
  "🚌",
  "💊",
  "🏥",
  "💪",
  "🎮",
  "🎬",
  "🎵",
  "📚",
  "🎓",
  "👔",
  "👗",
  "💄",
  "💈",
  "🐶",
  "🌱",
  "⛽",
  "🔧",
  "💰",
  "🎁",
  "🏖️",
  "🏋️",
  "📝",
];

const COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#10b981",
  "#06b6d4",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#f43f5e",
  "#84cc16",
  "#14b8a6",
  "#0ea5e9",
  "#a855f7",
];

interface CategoryModalProps {
  open: boolean;
  onClose: () => void;
  editingCategory: Category | null;
}

function CategoryModal({ open, onClose, editingCategory }: CategoryModalProps) {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((s) => s.auth);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", icon: "📁", color: "#6366f1" });

  useEffect(() => {
    if (editingCategory) {
      setForm({
        name: editingCategory.name,
        icon: editingCategory.icon,
        color: editingCategory.color,
      });
    } else {
      setForm({ name: "", icon: "📁", color: "#6366f1" });
    }
  }, [editingCategory, open]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    try {
      if (editingCategory) {
        await dispatch(
          updateCategory({ token, id: editingCategory._id, data: form }),
        ).unwrap();
        toast.success("Category updated");
      } else {
        await dispatch(createCategory({ token, data: form })).unwrap();
        toast.success("Category created");
      }
      onClose();
    } catch (err: any) {
      toast.error(err || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-3 sm:items-center sm:p-4"
      style={{ background: "rgba(0,0,0,0.8)" }}
    >
      <div
        className="max-h-[calc(100dvh-1.5rem)] w-full max-w-md overflow-y-auto rounded-2xl p-4 space-y-5 sm:max-h-[calc(100dvh-2rem)] sm:p-6"
        style={{
          background: "rgb(15,15,18)",
          border: "1px solid rgb(38,38,50)",
        }}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-syne text-xl font-bold text-white">
            {editingCategory ? "Edit Category" : "New Category"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div
          className="flex items-center gap-4 p-4 rounded-xl"
          style={{ background: "rgb(22,22,26)" }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
            style={{ background: `${form.color}22` }}
          >
            {form.icon}
          </div>
          <div>
            <div className="font-syne font-bold text-white">
              {form.name || "Category Name"}
            </div>
            <div className="text-xs mt-0.5" style={{ color: form.color }}>
              Preview
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400">Name</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Food & Dining"
              className="w-full px-3 py-2.5 rounded-xl text-sm text-white placeholder-zinc-600 outline-none bg-zinc-900 border border-zinc-800 focus:border-indigo-500 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-400">Icon</label>
            <div className="grid grid-cols-6 gap-1.5 min-[420px]:grid-cols-8 sm:grid-cols-9">
              {ICONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setForm({ ...form, icon })}
                  className="flex aspect-square w-full items-center justify-center rounded-lg text-lg transition-all"
                  style={{
                    background:
                      form.icon === icon ? `${form.color}25` : "rgb(25,25,30)",
                    border: `1px solid ${form.icon === icon ? form.color : "rgb(38,38,50)"}`,
                    transform: form.icon === icon ? "scale(1.1)" : "scale(1)",
                  }}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-400">Color</label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setForm({ ...form, color })}
                  className="w-8 h-8 rounded-lg transition-all"
                  style={{
                    background: color,
                    border:
                      form.color === color
                        ? "2px solid white"
                        : "2px solid transparent",
                    transform:
                      form.color === color ? "scale(1.15)" : "scale(1)",
                  }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium text-zinc-400 border border-zinc-800 hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-50"
              style={{
                background:
                  "linear-gradient(135deg, rgb(99,102,241), rgb(139,92,246))",
              }}
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : editingCategory ? (
                "Update"
              ) : (
                "Create"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CategoriesPage() {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((s) => s.auth);
  const { items: categories, loading } = useAppSelector((s) => s.categories);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (token) dispatch(fetchCategories(token));
  }, [token, dispatch]);

  const handleDelete = async (cat: Category) => {
    if (
      !token ||
      !confirm(`Delete "${cat.name}"? This will fail if expenses use it.`)
    )
      return;
    setDeletingId(cat._id);
    try {
      await dispatch(deleteCategory({ token, id: cat._id })).unwrap();
      toast.success("Category deleted");
    } catch (err: any) {
      toast.error(err || "Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 pb-6 sm:px-6 lg:p-8">
      <CategoryModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        editingCategory={editing}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-syne text-2xl font-bold text-white sm:text-3xl">
            Categories
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            {categories.length} categories created
          </p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
          className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 sm:w-auto"
          style={{
            background:
              "linear-gradient(135deg, rgb(99,102,241), rgb(139,92,246))",
          }}
        >
          <Plus className="w-4 h-4" />
          New Category
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
        </div>
      ) : categories.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-24 space-y-4 text-zinc-600 rounded-2xl"
          style={{ border: "2px dashed rgb(38,38,50)" }}
        >
          <Tag className="w-12 h-12" />
          <div className="text-center">
            <p className="font-medium text-zinc-500">No categories yet</p>
            <p className="text-sm text-zinc-700 mt-1">
              Create categories to organize your expenses
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 rounded-xl text-sm font-medium text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/10 transition-colors"
          >
            Create your first category
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="group rounded-2xl p-4 flex flex-col gap-4 card-hover transition-all sm:p-5"
              style={{
                background: "rgb(15,15,18)",
                border: "1px solid rgb(28,28,35)",
              }}
            >
              <div className="flex items-start justify-between">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{ background: `${cat.color}18` }}
                >
                  {cat.icon}
                </div>
                <div className="flex gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                  <button
                    onClick={() => {
                      setEditing(cat);
                      setModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg text-zinc-600 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat)}
                    disabled={deletingId === cat._id}
                    className="p-1.5 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    {deletingId === cat._id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <div className="font-syne font-bold text-white">{cat.name}</div>
                <div className="flex items-center gap-1.5 mt-1">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: cat.color }}
                  />
                  <span className="text-xs text-zinc-600">{cat.color}</span>
                </div>
              </div>

              <div
                className="h-1 rounded-full mt-auto"
                style={{
                  background: `linear-gradient(90deg, ${cat.color}, ${cat.color}66)`,
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
