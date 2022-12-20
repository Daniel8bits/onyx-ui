import { useMemo } from "react"

function useNew<T>(Constructor: Class<T>, params: ConstructorParameters<Class<T>>, dependencies: any[] = []) {
  const object = useMemo<T>(() => {
    return new Constructor(...params)
  }, dependencies)
  return object
}

export default useNew