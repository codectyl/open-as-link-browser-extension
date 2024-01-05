type AsyncFn<T> = () => Promise<T>;

export async function handleError<T>(cb: AsyncFn<T>): Promise<T | undefined> {
  try {
    return await cb();
  } catch (e) {
    console.error(e);
  }
}