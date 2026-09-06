import { useEffect, useRef, useState } from 'react';
import { searchResidents, residentFullName } from '../../api/certificates';
import type { ResidentOption } from '../../api/types';

export function ResidentPicker({
  value,
  onChange,
  initialLabel,
}: {
  value: number | null;
  onChange: (id: number, label: string) => void;
  initialLabel?: string;
}) {
  const [query, setQuery] = useState(initialLabel ?? '');
  const [options, setOptions] = useState<ResidentOption[]>([]);
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(initialLabel ?? '');
  }, [initialLabel]);

  useEffect(() => {
    if (!open) return;
    const handle = setTimeout(() => {
      searchResidents(query).then(setOptions);
    }, 250);
    return () => clearTimeout(handle);
  }, [query, open]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  return (
    <div style={{ position: 'relative' }} ref={boxRef}>
      <input
        className="form-control"
        placeholder="Search resident by name…"
        value={query}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
      />
      {open && options.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'white',
            border: '1px solid var(--border)',
            borderRadius: 8,
            marginTop: 4,
            maxHeight: 220,
            overflowY: 'auto',
            zIndex: 20,
            boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
          }}
        >
          {options.map((o) => (
            <div
              key={o.id}
              style={{ padding: '8px 12px', cursor: 'pointer', fontSize: 14 }}
              onMouseDown={() => {
                onChange(o.id, residentFullName(o));
                setQuery(residentFullName(o));
                setOpen(false);
              }}
            >
              {residentFullName(o)}
            </div>
          ))}
        </div>
      )}
      {value == null && <div style={{ fontSize: 12, color: '#c00', marginTop: 4 }}>Select a resident from the list</div>}
    </div>
  );
}
