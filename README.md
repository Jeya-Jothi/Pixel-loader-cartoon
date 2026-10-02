# Pixel Loader

A reusable React/Next.js component that reveals an image as a pixelated portrait using a staged animation. The screen starts dark, the pixel portrait builds in a structured reveal, and then your content appears.

Not just a spinner. It is a visual brand moment.

- Premium, cinematic motion
- Great for portfolios, brand launches, hero sections, and splash screens
- Change the image by changing one data file

## Usage

**1. Copy these into your project**

```
src/components/PixelLoader.tsx
src/components/PixelLoaderOverlay.tsx
src/data/pixelPortraitData.ts
src/styles.css
```

**2. Import the styles once** (e.g. in `app/layout.tsx` or your entry file)

```tsx
import "./styles.css";
```

**3. Render the loader**

```tsx
import PixelLoaderOverlay from "./components/PixelLoaderOverlay";

export default function Page() {
  return (
    <>
      <PixelLoaderOverlay />
      {/* your page content */}
    </>
  );
}
```

In Next.js App Router, add `"use client";` at the top of the file that renders it.

**Requirements:** React 18+, TypeScript (optional), Next.js or any React setup.

## Change the image

The portrait is controlled by one file: `src/data/pixelPortraitData.ts`.

Each row is a string. `#` is a filled pixel, `.` is empty.

```ts
export const PIXEL_GRID: string[] = [
  "................##############................",
  "..............####################............",
  "...........########################.........",
  // ... more rows
];
```

To use your own image:

1. Pick any reference image (cartoon, portrait, illustration).
2. Upload it to an image-aware AI tool such as ChatGPT or Claude.
3. Paste this prompt:

```text
Convert this image into a black-and-white pixel-art portrait using a 2D string array.
Use '#' for filled pixels and '.' for empty pixels.
Keep the output in a format like:

export const PIXEL_GRID: string[] = [
  "................",
  "....###.........",
  ...
];
```

4. Paste the result into `pixelPortraitData.ts`.
5. Adjust the row count or density if the shape looks off.

The animation logic stays the same. Only the data changes.

## How it works

The 2D string grid is turned into a canvas animation. Each filled pixel appears in a timed sequence, which creates the reveal effect.

## License

Use in personal, client, or commercial projects. Redistribution or resale of the source code is not allowed. See `LICENSE` for full terms.
