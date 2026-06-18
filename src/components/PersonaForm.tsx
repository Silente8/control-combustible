"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPersona, updatePersona } from "@/lib/actions";
import { PageHeader } from "@/components/PageHeader";

interface Institucion {
  id: number;
  nombre: string;
}

interface PersonaFormProps {
  instituciones: Institucion[];
  persona?: {
    id: number;
    nombreCompleto: string;
    documentoIdentidad: string;
    telefono: string | null;
    email: string | null;
    institucionId: number;
  };
}

export default function PersonaForm({ instituciones, persona }: PersonaFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isEdit = !!persona;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const data = {
      nombreCompleto: form.get("nombreCompleto") as string,
      documentoIdentidad: form.get("documentoIdentidad") as string,
      institucionId: Number(form.get("institucionId")),
      telefono: (form.get("telefono") as string) || undefined,
      email: (form.get("email") as string) || undefined,
    };

    const result = isEdit
      ? await updatePersona(persona!.id, data)
      : await createPersona(data);

    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      router.push("/personas");
      router.refresh();
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader title={isEdit ? "Editar Persona" : "Nueva Persona"} />

      <form onSubmit={handleSubmit} className="card space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        <div>
          <label className="label" htmlFor="nombreCompleto">Nombre completo *</label>
          <input
            id="nombreCompleto"
            name="nombreCompleto"
            type="text"
            required
            defaultValue={persona?.nombreCompleto ?? ""}
            className="input"
          />
        </div>

        <div>
          <label className="label" htmlFor="documentoIdentidad">Documento *</label>
          <input
            id="documentoIdentidad"
            name="documentoIdentidad"
            type="text"
            required
            defaultValue={persona?.documentoIdentidad ?? ""}
            className="input"
          />
        </div>

        <div>
          <label className="label" htmlFor="institucionId">Institución *</label>
          <select
            id="institucionId"
            name="institucionId"
            required
            defaultValue={persona?.institucionId ?? ""}
            className="input"
          >
            <option value="">Seleccionar institución...</option>
            {instituciones.map((i) => (
              <option key={i.id} value={i.id}>
                {i.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label" htmlFor="telefono">Teléfono</label>
          <input
            id="telefono"
            name="telefono"
            type="text"
            defaultValue={persona?.telefono ?? ""}
            className="input"
          />
        </div>

        <div>
          <label className="label" htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={persona?.email ?? ""}
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
