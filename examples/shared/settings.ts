export interface Settings {
  name: string;
  note: string;
}
export const defaults: Settings = {
  name: "春日工作室",
  note: "把好的设计，留在可复用的组件里。",
};
export function readSettings(key: string): Settings {
  const raw = localStorage.getItem(key);
  if (!raw) return { ...defaults };
  const value = JSON.parse(raw);
  if (typeof value.name !== "string" || typeof value.note !== "string")
    throw Error("本机记录格式不正确");
  return { name: value.name, note: value.note };
}
export async function saveSettings(
  key: string,
  value: Settings,
): Promise<Settings> {
  const snapshot = { ...value };
  localStorage.setItem(key, JSON.stringify(snapshot));
  const receipt = readSettings(key);
  if (receipt.name !== snapshot.name || receipt.note !== snapshot.note)
    throw Error("保存回执不一致");
  return receipt;
}
