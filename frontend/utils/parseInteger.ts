const parseInteger = (integer: string): number | undefined => {
  try {
    const parsedInteger = parseInt(integer)
    if (Number.isNaN(parsedInteger)) {
      return undefined
    }
    return parsedInteger
  } catch (e) {
    return undefined
  }
}