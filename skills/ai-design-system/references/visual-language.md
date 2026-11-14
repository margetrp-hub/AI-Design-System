# Visual language and composition

The six independent decisions are layout, language, palette, type, material and motion. A language coordinates navigation, geometry, typography hierarchy, surfaces and feedback. Compare the same content and palette across directions: changing only accent or radius is not a new language.

| Direction | Distinguishing relationships | Useful contexts |
| --- | --- | --- |
| 静序 / base | Quiet boundaries, continuous working surfaces, concise navigation | Admin, forms, everyday tools |
| 硬线 / brutalist | Heavy rules, offset solid shadows, assertive geometry | Independent brand, experimental products |
| 工造 / industrial | Square segmentation, instrument labels, dense aligned readings | Technical editors, monitoring |
| 流璃 / glass | Visible backdrop, floating controls, thin rims, edge refraction | Rich-background entry, media navigation |
| 书页 / editorial | Reading measure, serif hierarchy, open rhythm | Wiki, publishing, long content |
| 云塑 / soft | Rounded volumes, contact shadows, inset controls | Personal tools, light creation |
| 光域 / kinetic | Light fields, precise frames, explicit relationships | AI tools, resource visualization |
| 墨界 / geist | Fine grids, exact spacing, restrained developer typography | Developer tools |
| 格构 / carbon | Squared sections, functional header, underlined fields | Dense operational systems |
| 声场 / spectrum | Strong titles, separate panels, rounded action groups | Media and content |
| 织光 / atelier | Large type, gentle color fields, lightweight panels | Brand/product introduction |
| 彩阶 / material | Tonal containers, shaped groups, stateful feedback | Consumer and collaboration apps |
| 栖间 / original scene | Warm space, original geometric companions, selectable stations | Playful studio/agent overview, not dense tables |

The first twelve are theme recipes. 栖间 is a separately composed scene in the Vue package, not a fake thirteenth global CSS theme. Brand-inspired names describe independent implementations, not official kits.

Choose a skeleton by task: sidebar/topbar for navigation; master-detail for review; workbench/studio for resource + task + properties; editorial for reading; bento/showcase for uneven emphasis; settings for grouped decisions; split/focused for short entry flows; conversation for independent messages and composer; board for stage work; command-center for relationships. Current skeleton implementations are Vue-specific.

Color has different roles: neutral surfaces, brand/action, semantic result/risk, category/identity. Keep success/error meanings stable across palettes. Category colors should follow object identity, not sorted row index. More color can come from objects, images and purposeful group accents; do not add a colored stripe to every card as generic decoration.

Use a shared inset and stronger gaps between groups than within them. Tables compare records on a continuous surface; unequal importance does not need equal metric cards. Plan the narrow-screen reading order and scroll owner. Avoid stranded toolbar buttons, chopped sidebar backgrounds and artificial equal heights with empty filler.

Available type choices include system, Geist, Noto Sans/Serif SC, IBM Plex Mono, Manrope, Space Grotesk, Fraunces and LXGW WenKai. Confirm the actual font is loaded, preserve CJK fallback, use tabular numbers for changing counts, and distinguish text scaling from density. Production imports only chosen families/weights and retains font licenses.

Glass must reveal an actual backdrop. Test transparent center, edge highlights and readable text at different transparency settings; a white card with blur is not clear glass. Keep long reading surfaces sufficiently stable. CSS/SVG refraction is a browser-dependent approximation, not native Apple optics. Verify fallback and reduced transparency rather than claiming universal support.
