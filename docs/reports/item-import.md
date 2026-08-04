# Item import — EQL Wiki cross-check report

Source: `https://eqlwiki.com/api.php` (`{{Itempage}}` statsblock + dropsfrom)  ·  generated 2026-08-04

The EQL Wiki is authoritative for Legends itemization. This validates the curated notable-gear
list against the wiki and surfaces the stats curated data does not yet carry (haste %, AC, damage/delay,
attributes, click/worn effects). Curated prose (notable/farm) is never touched — a human folds the
harvested numbers into gear.ts after reviewing the mismatches below.

## Summary

`farmable now?` = does the wiki drop zone (or a quest) exist in the live classic Atlas.
**no** ⇒ Legends currently sources it from a not-yet-live (e.g. Kunark) zone — do NOT relocate
the curated entry into a zone players cannot visit; correct stats only and leave a review flag.

| item | era | farmable now? | slot | drop zone | drop mob | flags | curated is missing |
|---|---|---|---|---|---|---|---|
| Screaming Mace | — | yes | weapon → PRIMARY SECONDARY | crushbone → — | — | MAGIC ITEM | 8/35 1H Blunt; Effect: Screaming Mace |
| Guise of the Deceiver | Classic | ? | face → FACE | lower-guk → — | — | MAGIC ITEM NO DROP | AC 4; Effect: Illusion: Dark Elf; CHA+13 |
| Polished Granite Tomahawk | — | yes | weapon → PRIMARY SECONDARY | **highpass → Highpass Hold** | Grenix Mucktail | MAGIC ITEM LORE ITEM | 6/26 1H Slashing; Effect: Berserker Strength |
| Flowing Black Silk Sash | Classic | yes | waist → WAIST | lower-guk → Lower Guk | a frenzied ghoul | MAGIC ITEM LORE ITEM | Haste 21% |
| Short Sword of the Ykesha | Classic | yes | weapon → PRIMARY SECONDARY | lower-guk → Lower Guk | the ghoul lord | MAGIC ITEM | 9/24 1H Slashing; Effect: Ykesha |
| Fungus Covered Great Staff | Kunark | **no** | weapon → PRIMARY | **old-sebilis → Used to drop in Old Sebilis off myconid spore king.** | — | **NO LONGER DROPS** | 18/35 2H Blunt; Effect: Fungal Regrowth; WIS+8 INT+8 CHA-10 |
| Deepwater Helm | Kunark | **no** | head → HEAD | old-sebilis → Old Sebilis | crypt caretaker | MAGIC ITEM LORE ITEM | AC 21; Effect: Daring |
| Lamentation | Kunark | **no** | weapon → PRIMARY SECONDARY | old-sebilis → Old Sebilis | sebilite guardian | MAGIC ITEM | 9/19 1H Slashing; STR+6 STA+6 HP+20 |
| Fungus Covered Scale Tunic | Kunark | **no** | chest → CHEST | old-sebilis → Old Sebilis | Myconid Spore King | LORE ITEM | AC 21; Effect: Fungal Regrowth; STR+2 AGI-10 DEX-10 INT+2 |
| Cloak of Flames | Classic | yes | back → BACK | nagafens-lair → Nagafen's Lair | Lord Nagafen | MAGIC ITEM | Haste 36%; AC 10; AGI+9 DEX+9 HP+50 |
| Golden Efreeti Boots | Classic | yes | feet → FEET | nagafens-lair → Nagafen's Lair | Efreeti Lord Djarn | MAGIC ITEM | AC 5; WIS+9 INT+9 |
| Rubicite Breastplate | Classic | yes | chest → CHEST | cazic-thule → Cazic Thule | **Avatar of Fear Classic Phase 1** | MAGIC ITEM LORE ITEM | AC 19 |
| White Dragonscale Armor (Vox) | — | — | — | — | — | — | ⚠ missingtitle: The page you specified doesn't exist. |
| Black Dragonscale Armor (Nagafen) | — | — | — | — | — | — | ⚠ missingtitle: The page you specified doesn't exist. |
| Plane of Fear Class Armor | — | — | — | — | — | — | ⚠ missingtitle: The page you specified doesn't exist. |
| Plane of Hate Class Armor | — | — | — | — | — | — | ⚠ missingtitle: The page you specified doesn't exist. |

## Mismatches to reconcile (3)

### Screaming Mace
- classes (wiki): `ALL except NEC WIZ MAG ENC`

### Guise of the Deceiver
- classes (wiki): `BRD ROG`

### Polished Granite Tomahawk
- drop zone: curated `highpass` vs wiki **Highpass Hold**
- classes (wiki): `WAR PAL RNG SHD BRD ROG`

### Flowing Black Silk Sash
- classes (wiki): `ALL`

### Short Sword of the Ykesha
- classes (wiki): `WAR PAL RNG SHD BRD ROG`

### Fungus Covered Great Staff
- drop zone: curated `old-sebilis` vs wiki **Used to drop in Old Sebilis off myconid spore king.**
- wiki says **No Longer Drops** (source may need re-homing)
- classes (wiki): `ALL`

### Deepwater Helm
- classes (wiki): `PAL`

### Lamentation
- classes (wiki): `WAR RNG SHD`

### Fungus Covered Scale Tunic
- classes (wiki): `WAR CLR PAL RNG SHD DRU MNK BRD ROG SHM`

### Cloak of Flames
- classes (wiki): `ALL`

### Golden Efreeti Boots
- classes (wiki): `ALL`

### Rubicite Breastplate
- drop mob: curated `Drops from the Avatar of Fear in Cazic-Thule.` vs wiki **Avatar of Fear Classic Phase 1**
- classes (wiki): `WAR CLR PAL RNG SHD BRD ROG SHM`
