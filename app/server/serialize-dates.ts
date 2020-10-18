export function serializeDates(o: any) {
  for (const propName in o) {
    const prop = o[propName];

    if (prop instanceof Date) {
      o[propName] = prop.toLocaleString();
    } else if (Array.isArray(prop)) {
      prop.forEach(serializeDates);
    } else if (typeof prop === 'object') {
      serializeDates(prop);
    }
  }

  return o;
}
