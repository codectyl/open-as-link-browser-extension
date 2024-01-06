type AsyncFn<T> = () => Promise<T>

export async function handleError<T>(cb: AsyncFn<T>): Promise<T | undefined> {
  try {
    return await cb()
  } catch (e) {
    console.error(e)
  }
}

export const copyToClipboard = (text: string) => {
  return navigator.clipboard.writeText(text)
}

export const readClipboardText = async (): Promise<string> => {
  try {
    return await navigator.clipboard.readText()
  } catch {
    const dummyInput = document.createElement("input")
    document.body.appendChild(dummyInput)
    dummyInput.focus()
    document.execCommand("paste")
    const clipboardContent = dummyInput.value
    document.body.removeChild(dummyInput)
    return clipboardContent
  }
}
