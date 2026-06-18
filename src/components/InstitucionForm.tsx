"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createInstitucion, updateInstitucion } from "@/lib/actions";
import { PageHeader } from "@/components/PageHeader";

interface InstitucionFormProps {
  institucion?: {
    id: number;
    nombre: string;
    tipo: string | null;
    direccion: string | null;
  };
}

export default function InstitucionForm({ institucion }: InstitucionFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isEdit = !!institucion;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const data = {
      nombre: form.get("nombre") as string,
      tipo: (form.get("tipo") as string) || undefined,
      direccion: (form.get("direccion") as string) || undefined,
    };

    const result = isEdit
      ? await updateInstitucion(institucion!.id, data)
      : await createInstitucion(data);

    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      router.push("/instituciones");
      router.refresh();
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader
        title={isEdit ? "Editar Institución" : "Nueva Institución"}
      />

      <form onSubmit={handleSubmit} className="card space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        <div>
          <label className="label" htmlFor="nombre">Nombre *</label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            required
            defaultValue={institucion?.nombre ?? ""}
            className="input"
          />
        </div>

        <div>
          <label className="label" htmlFor="tipo">Tipo</label>
          <input
            id="tipo"
            name="tipo"
            type="text"
            placeholder="Gobierno, Salud, etc."
            defaultValue={institucion?.tipo ?? ""}
            className="input"
          />
        </div>

        <div>
          <label className="label" htmlFor="direccion">Dirección</label>
          <input
            id="direccion"
            name="direccion"
            type="text"
            defaultValue={institucion?.direccion ?? ""}
            className="input"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={() => router.back()} className="btn-secondary">
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Guardando..." : isEdit ? "Actualizar" : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}
