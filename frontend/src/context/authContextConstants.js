export const safeParse = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

