# Component Library Project Guide

This project is a visual component library and dashboard prototype. The app lives in `src/main.tsx` and is organized as a single-page shell with multiple preview pages.

## 1. Page Structure

The app currently exposes these main areas:

1. `功能中心 / 组件库`
   - Main component showcase area.
   - This is where most reusable UI patterns are presented.

2. `功能中心 / 表单`
   - Form showcase page.
   - Includes input, dropdown, radio, checkbox, switch, upload, and step components.

3. `功能中心 / 代码/日志容器`
   - Code and log container showcase page.
   - Includes code blocks with line numbers and log streams with level tags.

4. `流量监控 / 搜索`
   - Traffic search page based on the backend search design reference.
   - Includes a search toolbar, time range selector, display mode tabs, field tags, and traffic event results.

5. Other navigation entries
   - They currently render blank placeholder content on the right side.

## 2. Global Shell

The app shell is fixed and shared across pages:

- `header` at the top.
- `sidebar` on the left.
- `page toolbar` under the header.
- `content area` on the right.

The content area scrolls independently of the shell.

## 3. Sidebar Rules

### 3.1 Primary sidebar behavior

- The sidebar has an expanded and collapsed state.
- In collapsed state:
  - Hovering the far-left edge shows a floating preview of the sidebar.
  - Hovering the expand/collapse button also shows the sidebar preview.
  - Preview mode does not resize the content area.
- In expanded state:
  - Sidebar content is fixed in layout.
  - The brand button area stays in place.

### 3.2 Navigation behavior

- Primary items use active and hover states.
- Items with children can expand/collapse their secondary menu.
- Active primary navigation uses the blue selected background.
- Secondary navigation uses:
  - selected row highlight,
  - a vertical guide line on the left,
  - nested hover states that preserve path context.

### 3.3 Theme behavior

- Day mode and dark mode are both supported.
- Day mode changes sidebar background, borders, text colors, and selected states.
- User menu contains `个人中心`, `代金券`, `系统设置`, and `退出登录`.
- `系统设置` is not kept in the bottom of the sidebar anymore.

## 4. Header Rules

- The top header is fixed.
- It contains:
  - `Copilot` button,
  - day/night mode toggle,
  - search icon,
  - notification icon,
  - user avatar menu.
- The user menu closes when clicking outside.
- The page toolbar under the header can hide on downward scroll and reappear on upward scroll.
- The toolbar uses a small lock window so layout shifts do not cause it to flicker.

## 5. Component Rules

### 5.1 Buttons

- Buttons follow the component library sizing and color system.
- Main variants:
  - gray
  - primary
  - ghost
  - icon
- Default button sizes include `32px` and `28px`.
- Text and icon spacing should remain consistent with the library patterns.

### 5.2 Inputs

- Text inputs use:
  - height `32px`,
  - `14px` text,
  - 6px radius,
  - hover and focus border states.
- Search inputs keep the icon on the left and clear button on the right.
- Suffix inputs keep the suffix area visually separated and aligned.

### 5.3 Dropdowns

- There are now two distinct dropdown patterns:
  - `下拉选择框`: select-like field, minimum width `240px`, trigger and menu keep the same width, and the menu uses `4px` outer padding with full-width hover rows.
  - `下拉按钮`: compact adaptive trigger, width follows content, trigger spacing is `8px / text / 4px icon / 4px`, and menu width follows the longest option.
- Clicking opens a floating menu.
- Clicking outside closes it.
- Dropdown hover states use `rgba(255,255,255,0.08)`.
- The suffix dropdown in numeric input uses the same visual language as `下拉按钮`.

### 5.4 Modal and Dialog

- Modals use a consistent dark surface, border, and shadow style.
- Global dialogs must be mounted with a portal to `document.body`.
- Global dialogs use a full-screen dark overlay.
- Current delete confirmation dialog copy:
  - Title: `确认删除？`
  - Body: `删除后无法恢复，请确认`

### 5.5 Global Toast

- Global toast is mounted with a portal to `document.body`.
- It is displayed at the top center of the viewport.
- Each toast stays visible for `3s`.
- When multiple toasts are queued, they stack in order and move up when earlier items disappear.
- Current component library demo cycles through:
  - success
  - info
  - error
  - warning

### 5.6 Upload

#### Image upload

- Clicking `上传图片` shows an uploaded preview state on the left.
- The button text changes to `重新上传` after upload.
- Clicking the preview image opens a `600px × 600px` modal preview.
- The preview modal is global and uses a full-screen overlay.
- Closing the preview uses a bottom action button.

#### File upload

- Clicking `上传文件` switches to the uploaded file row state immediately.
- The file row uses:
  - document icon on the left,
  - file name text in the middle,
  - delete icon on the right.
- Clicking delete opens the global confirmation dialog.
- Confirm deletes the file row.
- Delete icon hover background is `rgba(255,255,255,0.08)`.

### 5.7 Radio, Checkbox, Switch

- Labels are `14px`.
- Icon and text spacing is `6px`.
- Hover state only affects the icon region, not the text color.
- Selected text uses the brighter library text color.

### 5.8 Segmented / Tabs

- Segmented tabs use a compact bordered container with inner padding.
- Active tab uses the selected background.
- Hover state uses a softer filled background.

### 5.9 Tags

- Tags are compact, rounded, and color-coded.
- Tag color tones are:
  - neutral
  - blue
  - green
  - yellow
  - red
- Tags can optionally include an icon.

### 5.10 Table

- Table headers support sorting.
- Some headers support filtering dropdowns.
- Row hover uses a subtle translucent highlight.
- Status tags keep the same tone rules as the rest of the system.

### 5.11 Form Stepper

- Stepper is adaptive and compact.
- First and last steps have outer corner rounding.
- Active step uses solid blue.
- Completed step uses blue at 0.32 opacity.
- Inactive step uses muted colors.
- Icons and labels remain aligned as a single flexible group.

### 5.12 Time Range Picker

- The trigger shows the preset or the selected range.
- Default state is collapsed.
- Default preset is `最近24小时`.
- Opening the picker reveals:
  - preset list on the left,
  - start/end date fields,
  - start/end time fields,
  - calendar grid,
  - confirm button.
- Clicking outside cancels the current draft.
- The picker is a global floating panel.
- Time rules:
  - `HH` can be `00` to `24`.
  - `MM` can be `00` to `59`.
  - When `HH = 24`, `MM` must be `00`.
  - End time cannot exceed current time when the selected end date is today.
  - If the end date is earlier than today, the end time becomes `24:00`.
  - The start time cannot be later than the end time.

### 5.13 Multi-level Cascade Selectors

- Multi-select cascade:
  - hover shows the next level,
  - selected paths remain visible,
  - the component shows path context,
  - scrolling uses a real scrollbar when content exceeds the height.
- Single-select cascade:
  - uses the same hover and path display model,
  - once a child is selected, the component keeps the selected path visible when the pointer leaves.

## 6. Layout and Scroll Rules

- Content area is built on a 24-column grid.
- Content stage width is constrained to `960px` minimum and `1920px` maximum.
- Content stage uses `16px` left/right gutters and `16px` column gaps.
- The shared layout helpers are `DashboardContentGrid` and `DashboardContentGridItem`.
- When placing new sections, use grid spans instead of hard-coded widths where possible.
- Content area uses `16px` padding as the base content inset.
- The page toolbar is positioned below the header and can hide/reveal.
- Content area bottom spacing is kept at `48px`.
- Sidebar and nested scroll areas use thin custom scrollbars.
- Global page scrollbars should stay visually restrained and not dominate the UI.

## 7. Implementation Notes

- This project is intentionally presentation-heavy and component-focused.
- Reusable controls are implemented directly in `src/main.tsx` for now.
- Global overlays should be rendered with `createPortal`.
- If a new component or rule is added, update this guide so the next change has a stable reference.
