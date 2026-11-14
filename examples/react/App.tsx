import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  UiTheme,
  UiInput,
  UiTextarea,
  UiButton,
  UiAuthLayout,
  UiBackdrop,
  UiAuthCharacters,
  UiCommandDock,
  themeAttributes,
  type UiThemeOptions,
} from "@ai-design-system/react";
import TaskExample from "./TaskExample";
import { defaults, readSettings, saveSettings } from "../shared/settings";
export default function App() {
  const key = "ai-design-system-integration-react-v1",
    [draft, setDraft] = useState({ ...defaults }),
    [status, setStatus] = useState("idle"),
    [message, setMessage] = useState(""),
    [dark, setDark] = useState(false),
    [open, setOpen] = useState(false),
    [focus, setFocus] = useState(false),
    [view, setView] = useState("profile"),
    dialog = useRef<HTMLDialogElement>(null),
    returnFocus = useRef<HTMLElement | null>(null);
  const theme: UiThemeOptions = {
    skin: "console",
    design: "geist",
    palette: "cobalt",
    mode: dark ? "dark" : "light",
  };
  function load() {
    try {
      setDraft(readSettings(key));
      setStatus("idle");
      setMessage("");
    } catch (error) {
      setStatus("read-error");
      setMessage(
        "无法读取本机设置，当前输入已保留。" + (error as Error).message,
      );
    }
  }
  async function save() {
    if (status === "saving") return;
    setStatus("saving");
    try {
      const receipt = await saveSettings(key, draft);
      setStatus("saved");
      setMessage("已保存到本机：" + receipt.name);
    } catch (error) {
      setStatus("error");
      setMessage("保存失败，草稿已保留。" + (error as Error).message);
    }
  }
  useEffect(load, []);
  useEffect(() => {
    if (open && !dialog.current?.open) {
      returnFocus.current = document.activeElement as HTMLElement;
      dialog.current?.showModal();
    } else if (!open && dialog.current?.open) {
      dialog.current.close();
      returnFocus.current?.focus();
    }
  }, [open]);
  return (
    <UiTheme theme={theme} className="integration-page">
      <header className="integration-header">
        <h1>React · 真实包接入</h1>
        <UiButton type="button" onClick={() => setDark(!dark)}>
          {dark ? "切换浅色" : "切换深色"}
        </UiButton>
      </header>
      <UiAuthLayout
        label="React 设置示例"
        visual={
          <>
            <UiBackdrop kind="rays" />
            <strong>AI Design System / REACT</strong>
            <UiAuthCharacters mode={focus ? "typing" : "idle"} />
            <h2 className="integration-visual-title">
              同一个视觉资产，
              <br />
              两种框架使用。
            </h2>
          </>
        }
        footer="本地演示 · 保存结果来自实际写入回执"
      >
        <UiCommandDock
          value={view}
          onValueChange={setView}
          items={[
            { id: "profile", label: "资料", symbol: "◇" },
            { id: "about", label: "说明", symbol: "◎" },
          ]}
        />
        <form
          hidden={view !== "profile"}
          className={view === "profile" ? "integration-stack" : undefined}
          onSubmit={(event) => {
            event.preventDefault();
            void save();
          }}
        >
          <label htmlFor="react-name">
            工作室名称
            <UiInput
              id="react-name"
              required
              value={draft.name}
              onChange={(event) =>
                setDraft({ ...draft, name: event.target.value })
              }
              onFocus={() => setFocus(true)}
              onBlur={() => setFocus(false)}
            />
          </label>
          <label htmlFor="react-note">
            介绍
            <UiTextarea
              id="react-note"
              rows={3}
              value={draft.note}
              onChange={(event) =>
                setDraft({ ...draft, note: event.target.value })
              }
            />
          </label>
          <div className="integration-actions">
            <UiButton
              type="submit"
              disabled={status === "saving"}
              aria-busy={status === "saving"}
            >
              {status === "saving" ? "保存中" : "保存到本机"}
            </UiButton>
            <UiButton
              type="button"
              variant="secondary"
              onClick={() => setOpen(true)}
            >
              查看预览
            </UiButton>
          </div>
        </form>
        <p hidden={view !== "about"} className="integration-muted">
          React 使用原生 input 标签关联，受控 value/onChange。弹层为宿主原生
          dialog；通过 themeAttributes 传播到 body portal。
        </p>
        {message && (
          <div
            className="integration-message"
            data-error={status === "error" || status === "read-error"}
            role="status"
          >
            {message}
            <div className="integration-actions">
              {status === "error" && (
                <UiButton type="button" onClick={save}>
                  重试保存
                </UiButton>
              )}
              {status === "read-error" && (
                <UiButton type="button" onClick={load}>
                  重试读取
                </UiButton>
              )}
            </div>
          </div>
        )}
        {createPortal(
          <dialog
            {...themeAttributes(theme)}
            ref={dialog}
            className="ui-theme integration-native-dialog"
            aria-labelledby="react-preview-title"
            aria-describedby="react-preview-description"
            onClose={() => setOpen(false)}
          >
            <h2 id="react-preview-title">工作室预览</h2>
            <p id="react-preview-description">查看当前草稿，关闭后继续编辑。</p>
            <strong>{draft.name}</strong>
            <p>{draft.note}</p>
            <UiButton type="button" onClick={() => setOpen(false)}>
              继续编辑
            </UiButton>
          </dialog>,
          document.body,
        )}
      </UiAuthLayout>
      <TaskExample />
    </UiTheme>
  );
}
