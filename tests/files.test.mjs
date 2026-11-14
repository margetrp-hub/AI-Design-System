import test from "node:test";
import assert from "node:assert/strict";
import { validateFileBatch } from "../packages/ui/src/files.ts";
const file = (name, type, size = 10) => ({ name, type, size, lastModified: 1 });
const options = {
  accept: ".txt,image/*",
  maxBytes: 100,
  maxFiles: 2,
  multiple: true,
};
test("invalid batches retain the original files and a corrected retry can succeed", () => {
  const prior = [file("draft.txt", "text/plain")];
  const failed = validateFileBatch(
    prior,
    [file("other.exe", "application/octet-stream")],
    options,
  );
  assert.deepEqual(failed.files, prior);
  assert.equal(failed.errors.length, 1);
  assert.equal(
    validateFileBatch(prior, [file("large.png", "image/png", 120)], options)
      .errors.length,
    1,
  );
  const retried = validateFileBatch(
    prior,
    [file("image.png", "image/png")],
    options,
  );
  assert.equal(retried.errors.length, 0);
  assert.equal(retried.files.length, 2);
  assert.equal(
    validateFileBatch(retried.files, [prior[0]], options).files.length,
    2,
  );
  assert.equal(
    validateFileBatch(retried.files, [file("third.txt", "text/plain")], options)
      .errors.length,
    1,
  );
});
test("single file replacement and case insensitive extension handling", () => {
  const result = validateFileBatch(
    [file("old.txt", "text/plain")],
    [file("NEW.TXT", "")],
    { ...options, multiple: false },
  );
  assert.equal(result.files[0].name, "NEW.TXT");
  assert.equal(result.files.length, 1);
  assert.equal(result.errors.length, 0);
});
