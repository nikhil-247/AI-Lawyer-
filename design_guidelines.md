# Memory Reconstruction Assistant - Design Guidelines

## Design Approach
**Reference-Based with Therapeutic Focus**: Drawing inspiration from healthcare apps like Headspace (calming), Calm (warmth), and Apple Health (simplicity), while prioritizing emotional safety and cognitive accessibility for dementia care contexts.

## Core Design Principles
1. **Therapeutic Simplicity**: Every screen focuses on one primary action; minimal cognitive load
2. **Emotional Warmth**: Soft, nurturing visual language that feels like a gentle companion
3. **Touch-First Design**: Large touch targets (minimum 48px), generous spacing for accessibility
4. **Calm Consistency**: Predictable patterns reduce caregiver stress

## Typography
- **Primary Font**: Inter or Nunito Sans (warm, readable sans-serif)
- **Headings**: 24-32px, font-weight 600-700, generous letter-spacing
- **Body**: 16-18px, font-weight 400-500, line-height 1.6
- **Labels**: 14px, font-weight 500
- **Emotional Taglines**: 20px, font-weight 300, italic for softness

## Layout System
**Tailwind Spacing**: Use units of 4, 6, 8, 12, 16 for consistent rhythm (p-4, m-6, gap-8, py-12, etc.)

**Container Strategy**:
- Main content: max-w-2xl (centered, never overwhelming)
- Cards: p-6 to p-8 with rounded-2xl
- Bottom nav: fixed, h-20, safe-area-inset-bottom

## Component Library

### Navigation
**Bottom Tab Bar** (Fixed):
- 5 icons with labels, active state with gentle highlight
- Icons: Heroicons (outline when inactive, solid when active)
- Height: 80px with padding, centered icons above text
- Active indicator: Soft glow or subtle background lift

### Cards & Containers
**Patient Card** (Home Dashboard):
- Large photo thumbnail (rounded-full, 80px)
- Name, age, relationship in soft hierarchy
- Subtle border, elevated shadow (shadow-sm)

**Memory Cards**:
- Image preview (aspect-ratio 16:9 or 4:3, rounded-xl)
- Title, date, category tag
- Quick action buttons (edit/delete) in top-right corner

**Session Cards**:
- Icon representing type (reassurance, orientation, calm)
- Duration, scheduled time
- Play button prominently displayed

### Forms & Inputs
**Input Fields**:
- Large touch targets (h-12 to h-14)
- Rounded-xl borders
- Soft focus states (no harsh outlines)
- Helper text below in muted tone

**Wizard Steps**:
- Progress indicator at top (dots or simple bar)
- One question per screen
- Large "Next" button at bottom
- Optional "Skip" in subtle text

### Buttons
**Primary Actions**: 
- Large (h-12 to h-14), rounded-xl, soft shadows
- Icon + text combination when appropriate

**Secondary Actions**: 
- Outline style or ghost buttons
- Same size as primary for consistency

**Emergency Button**: 
- Extra large (h-16), distinctive but calm presence
- Centered on Emergency tab

### Feedback & Reactions
**Emoji Response System**:
- Three large emoji buttons (80px touch target)
- 😊 😐 ☹️ with labels underneath
- Selected state with gentle scale animation

### Media Components
**Audio Player**:
- Waveform visualization or simple progress bar
- Large play/pause button (56px)
- Time display, volume control
- Soft, rounded container (p-6, rounded-2xl)

**Photo/Video Upload**:
- Large dropzone with dashed border
- Camera icon, "Add Photo" text
- Grid display of uploaded media (3 columns on mobile, 4 on tablet)

### Calendar
**Schedule View**:
- Monthly calendar with large date cells
- Scheduled sessions as small dots or badges
- List view toggle for detailed schedule
- Today indicator with subtle highlight

## Screen-Specific Guidance

### Onboarding Flow
**Splash Screen**: 
- Centered logo (120px), tagline below
- Full-screen soft gradient background (no image needed)

**Welcome Screen**:
- Centered content with illustration or abstract shapes
- Two large buttons stacked vertically (h-14, mb-4)

**Login/Signup**:
- Centered form (max-w-sm)
- Social login button with provider logos
- Minimal decoration, focus on form

### Home Dashboard
- Patient card at top (dominant element)
- Quick actions in 2-column grid below
- Upcoming sessions list with time indicators
- Generous vertical spacing between sections (space-y-8)

### Memory Builder
- Tab navigation for memory sections (horizontal scroll on mobile)
- Guided questions in conversational tone
- "Add Memory" floating action button (bottom-right when scrolling)

### Session Generator
- Template cards in vertical list
- Preview shows sample content before saving
- Generated session displays as expandable accordion

## Images & Media Strategy

**No Large Hero Images**: This application is utility-focused and therapeutic, not marketing-oriented. Images serve functional purposes:

**Where Images Appear**:
1. **Patient Profile**: Circular patient photo (80-120px) on cards
2. **Memory Cards**: Photo/video thumbnails in 16:9 or square aspect ratios
3. **Empty States**: Simple illustrations (not photos) - comforting, minimal line drawings
4. **Media Library**: Grid of uploaded photos/videos with overlay controls
5. **Onboarding**: Abstract shapes or simple illustrations, not photographic

**Image Treatment**:
- Rounded corners (rounded-xl to rounded-2xl)
- Soft shadows for depth
- Thumbnails with subtle borders
- Loading states with skeleton screens

## Animations
**Minimal, Purposeful Motion**:
- Tab transitions: Gentle fade (150ms)
- Card interactions: Subtle scale on press (transform scale-95)
- Loading: Gentle pulse on skeleton screens
- NO aggressive scroll animations or parallax effects

## Empty States
- Centered icon (48px, muted tone)
- Encouraging message ("Add your first memory")
- Primary action button below
- Generous padding (py-16)

## Accessibility & Safety
- High contrast text (WCAG AA minimum)
- Focus indicators on all interactive elements
- No time-pressured interactions
- Clear error messages in gentle language
- Confirmation dialogs for destructive actions

This design system prioritizes emotional safety, cognitive simplicity, and caregiver well-being while maintaining professional functionality.