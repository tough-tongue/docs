"use client";

import { useState, useEffect } from "react";
import { Wallet } from "lucide-react";
import { OUR_SCENARIOS } from "../constants";

// account-tab ------------------------------------------------------------------

export function AccountTab() {
  const [balance, setBalance] = useState<Record<string, unknown> | null>(null);
  const [scenarios, setScenarios] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [balRes, ...scRes] = await Promise.all([
          fetch("/api/ttai/balance").then((r) => r.json()),
          ...OUR_SCENARIOS.map((s) =>
            fetch(`/api/ttai/scenarios/${s.id}`).then((r) => r.json()),
          ),
        ]);
        setBalance(balRes as Record<string, unknown>);
        setScenarios(scRes as Record<string, unknown>[]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading)
    return <p className="text-[#59615D] font-body text-sm mt-8">Loading…</p>;

  return (
    <div className="space-y-8 mt-6">
      {balance && (
        <div className="border border-[#E5E0D5] p-6">
          <div className="flex items-center gap-2 mb-4">
            <Wallet size={16} className="text-[#1A362D]" />
            <span className="overline">Balance</span>
          </div>
          <pre className="font-mono text-xs text-[#59615D] whitespace-pre-wrap">
            {JSON.stringify(balance, null, 2)}
          </pre>
        </div>
      )}
      {OUR_SCENARIOS.map((sc, i) => (
        <ScenarioCard key={sc.id} label={sc.label} data={scenarios[i]} />
      ))}
    </div>
  );
}

// scenario-card ----------------------------------------------------------------

function ScenarioCard({
  label,
  data,
}: {
  label: string;
  data: Record<string, unknown> | undefined;
}) {
  const [instructions, setInstructions] = useState("");
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!data?.ai_instructions) return;
    const frame = requestAnimationFrame(() => {
      setInstructions(data.ai_instructions as string);
    });
    return () => cancelAnimationFrame(frame);
  }, [data]);

  const save = async () => {
    if (!data?.id) return;
    setSaving(true);
    await fetch(`/api/ttai/scenarios/${data.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ai_instructions: instructions }),
    });
    setSaving(false);
    setDirty(false);
  };

  return (
    <div className="border border-[#E5E0D5] p-6 space-y-4">
      <span className="overline">{label}</span>
      {!data ? (
        <p className="text-xs text-[#59615D]">Failed to load.</p>
      ) : (
        <>
          <pre className="font-mono text-xs text-[#59615D] whitespace-pre-wrap">
            {JSON.stringify(
              { id: data.id, voice: data.voice, model: data.model },
              null,
              2,
            )}
          </pre>
          <textarea
            value={instructions}
            onChange={(e) => {
              setInstructions(e.target.value);
              setDirty(true);
            }}
            rows={8}
            className="w-full border border-[#E5E0D5] p-3 font-mono text-xs bg-white focus:outline-none focus:border-[#1A362D]"
          />
          <button
            onClick={save}
            disabled={!dirty || saving}
            className="btn-hairline disabled:opacity-40"
          >
            {saving ? "Saving…" : "Save instructions"}
          </button>
        </>
      )}
    </div>
  );
}
