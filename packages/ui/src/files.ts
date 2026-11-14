export type PickableFile = {
  name: string;
  size: number;
  type: string;
  lastModified: number;
};
export function fileKey(file: PickableFile) {
  return `${file.name}/${file.size}/${file.lastModified}`;
}
export function acceptFile(file: PickableFile, accept: string) {
  const rules = accept
    .toLowerCase()
    .split(",")
    .map((rule) => rule.trim())
    .filter(Boolean);
  return (
    !rules.length ||
    rules.some((rule) =>
      rule.startsWith(".")
        ? file.name.toLowerCase().endsWith(rule)
        : rule.endsWith("/*")
          ? file.type.toLowerCase().startsWith(rule.slice(0, -1))
          : file.type.toLowerCase() === rule,
    )
  );
}
export function validateFileBatch<T extends PickableFile>(
  current: readonly T[],
  incoming: readonly T[],
  options: {
    accept: string;
    maxBytes: number;
    maxFiles: number;
    multiple: boolean;
  },
): { files: T[]; errors: string[] } {
  const errors: string[] = [];
  for (const file of incoming) {
    if (!acceptFile(file, options.accept))
      errors.push(file.name + "：文件类型不支持");
    else if (file.size > options.maxBytes)
      errors.push(file.name + "：文件大小超出限制");
  }
  const combined = options.multiple ? [...current, ...incoming] : [...incoming];
  const files = [
    ...new Map(combined.map((file) => [fileKey(file), file])).values(),
  ];
  if (files.length > (options.multiple ? options.maxFiles : 1))
    errors.push("文件数量超出限制");
  return errors.length
    ? { files: [...current], errors }
    : { files, errors: [] };
}
