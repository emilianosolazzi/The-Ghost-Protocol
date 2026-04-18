import { useCallback, useState } from "react";
import { uploadFile, validateFile } from "@/lib/pinata";

type UploadState =
  | { status: "idle" }
  | { status: "uploading"; file: File }
  | { status: "success"; cid: string; file: File }
  | { status: "error"; message: string };

export function usePinataUpload() {
  const [state, setState] = useState<UploadState>({ status: "idle" });

  const upload = useCallback(async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setState({ status: "error", message: validationError });
      return null;
    }

    setState({ status: "uploading", file });

    try {
      const cid = await uploadFile(file);
      setState({ status: "success", cid, file });
      return cid;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setState({ status: "error", message });
      return null;
    }
  }, []);

  const reset = useCallback(() => setState({ status: "idle" }), []);

  return {
    upload,
    reset,
    state,
    isPending: state.status === "uploading",
    cid: state.status === "success" ? state.cid : null,
    error: state.status === "error" ? state.message : null,
  } as const;
}
