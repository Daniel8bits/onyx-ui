import { useCallback, useState } from "react";

function useUpdater() {
  const [, setUpdater] = useState<boolean>(false);
  const update = useCallback(() => {
    setUpdater(v => !v)
  }, [])
  return update
}

export default useUpdater