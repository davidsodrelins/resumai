import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface UseAutoSaveOptions<T> {
  data: T;
  onSave: (data: T) => Promise<void>;
  delay?: number; // milliseconds
  enabled?: boolean;
}

interface AutoSaveState {
  isSaving: boolean;
  lastSaved: Date | null;
  error: Error | null;
}

export function useAutoSave<T>({
  data,
  onSave,
  delay = 30000, // 30 seconds default
  enabled = true,
}: UseAutoSaveOptions<T>) {
  const [state, setState] = useState<AutoSaveState>({
    isSaving: false,
    lastSaved: null,
    error: null,
  });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousDataRef = useRef<T>(data);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    // Check if data has actually changed
    const dataChanged = JSON.stringify(data) !== JSON.stringify(previousDataRef.current);
    
    if (!dataChanged) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for auto-save
    timeoutRef.current = setTimeout(async () => {
      if (!isMountedRef.current) return;

      setState((prev) => ({ ...prev, isSaving: true, error: null }));

      try {
        await onSave(data);
        
        if (!isMountedRef.current) return;

        setState({
          isSaving: false,
          lastSaved: new Date(),
          error: null,
        });

        toast.success("Salvo automaticamente", {
          duration: 2000,
        });

        previousDataRef.current = data;
      } catch (error) {
        if (!isMountedRef.current) return;

        const err = error as Error;
        setState((prev) => ({
          ...prev,
          isSaving: false,
          error: err,
        }));

        toast.error("Erro ao salvar automaticamente", {
          description: err.message,
          duration: 3000,
        });
      }
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, onSave, delay, enabled]);

  const saveNow = async () => {
    if (state.isSaving) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setState((prev) => ({ ...prev, isSaving: true, error: null }));

    try {
      await onSave(data);
      
      if (!isMountedRef.current) return;

      setState({
        isSaving: false,
        lastSaved: new Date(),
        error: null,
      });

      toast.success("Salvo com sucesso");
      previousDataRef.current = data;
    } catch (error) {
      if (!isMountedRef.current) return;

      const err = error as Error;
      setState((prev) => ({
        ...prev,
        isSaving: false,
        error: err,
      }));

      toast.error("Erro ao salvar", {
        description: err.message,
      });
    }
  };

  return {
    ...state,
    saveNow,
  };
}
