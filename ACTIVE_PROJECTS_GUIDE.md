# Marking Projects as Active

## How to Mark a Project as Active

In your `project.json` file, set:

```json
{
  "size": "active"
}
```

## What Happens

When a project has `"size": "active"`:

1. **"Active" Badge** - Shows with pulsing animation
2. **Visual Indicator** - Stands out from other projects
3. **Sorting Priority** - Can be filtered/sorted by active status

## Example: Sao House

```json
{
  "id": "sao-2025",
  "title": "Sao House",
  "year": 2025,
  "type": "PROJECT",
  "size": "active",  ← Marks as active
  "categories": ["Design", "Development", "Leadership", "Operations"],
  "description": "Your description...",
  "status": "In Active Development",
  "launchDate": "End of 2026"
}
```

## Size Options

| Value | Display | Use For |
|-------|---------|---------|
| `"active"` | **Active** badge (pulsing) | Ongoing projects |
| `"large"` | Standard display | Main portfolio projects |
| `"small"` | Compact display | Experiments, small projects |

## Active Projects in Archives

Active projects will display:
- Pulsing "Active" badge in the card
- Prominent positioning
- Clear indication of ongoing work
- Launch date/timeline information

## Updated: Sao House (2025)

### New Information:
- **Description**: Vietnamese coffee house with narrative universe
- **Categories**: Design, Development, Leadership, Operations
- **Key Contributions**:
  - Integrated Content Pipeline
  - Operations Development
  - Creative Direction
  - Audio Engineering
  - Project Management
  - Art Direction
- **Technologies**: Blender, Unreal Engine 5, Ableton, Adobe Creative Suite
- **Launch**: End of 2026
- **Status**: Active (with pulsing badge)

---

**Note**: The only project currently marked as Active is Sao House. Other projects use `"large"` or `"small"` for size.
