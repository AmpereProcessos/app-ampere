# AudioPlayer Component

A beautiful, WhatsApp-style audio player component with waveform visualization, playback controls, and smooth animations.

## 🎨 Overview

The `AudioPlayer` component provides a modern, interactive audio playback experience similar to WhatsApp's audio messages. It features a visual waveform, playback speed controls, and adaptive theming for sent/received messages.

## ✨ Features

- 🎵 **Playback Controls** - Play, pause, and seek functionality
- 📊 **Waveform Visualization** - Animated waveform that responds to progress
- ⚡ **Playback Speed** - Adjustable speed (1x, 1.25x, 1.5x, 2x)
- ⏱️ **Time Display** - Current time and total duration
- 📥 **Download Option** - Optional download button
- 🎨 **Theme Variants** - Adapts styling for sent/received messages
- 💫 **Smooth Animations** - Hover effects and transitions
- ♿ **Accessible** - Keyboard navigation and ARIA labels

## 📦 Installation

The component is already part of your project. Import it:

```tsx
import { AudioPlayer } from "@/components/identificador/chats/AudioPlayer";
```

## 🚀 Basic Usage

```tsx
<AudioPlayer audioUrl="https://example.com/audio.mp3" />
```

## 📋 Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `audioUrl` | `string` | **required** | URL of the audio file to play |
| `className` | `string` | `undefined` | Additional CSS classes |
| `variant` | `"sent" \| "received"` | `"received"` | Visual theme variant |
| `onDownload` | `() => void` | `undefined` | Custom download handler |
| `showDownload` | `boolean` | `false` | Show download button |

## 🎨 Variants

### Received Messages (Default)

```tsx
<AudioPlayer 
  audioUrl={audioUrl} 
  variant="received" 
/>
```

**Styling:**
- Light background with white/gray tones
- White/gray waveform and controls
- Suitable for messages received from others

### Sent Messages

```tsx
<AudioPlayer 
  audioUrl={audioUrl} 
  variant="sent" 
/>
```

**Styling:**
- Green-tinted background
- Green waveform and controls
- Matches WhatsApp's sent message style

## 💡 Usage Examples

### Basic Audio Player

```tsx
function MessageBubble({ audioUrl }) {
  return (
    <div className="p-4 bg-white rounded-lg">
      <AudioPlayer audioUrl={audioUrl} />
    </div>
  );
}
```

### With Download Button

```tsx
<AudioPlayer 
  audioUrl={audioUrl} 
  showDownload={true}
  onDownload={() => {
    console.log("Downloading audio...");
    // Custom download logic
  }}
/>
```

### In Chat Messages

```tsx
function ChatMessage({ message, isUserMessage }) {
  return (
    <div className={isUserMessage ? "bg-blue-500" : "bg-white"}>
      <AudioPlayer 
        audioUrl={message.audioUrl}
        variant={isUserMessage ? "sent" : "received"}
        showDownload={true}
      />
    </div>
  );
}
```

### Custom Styling

```tsx
<AudioPlayer 
  audioUrl={audioUrl}
  className="shadow-lg border-2 border-primary"
/>
```

## 🎯 Features Breakdown

### Playback Controls

**Play/Pause Button:**
- Click to toggle playback
- Visual feedback with hover effects
- Loading spinner during audio load
- Scale animation on interaction

**Seek Bar:**
- Click anywhere to jump to position
- Drag handle for precise control
- Visual progress indicator
- Hover effects

### Waveform Visualization

- **40 bars** that animate based on playback
- Bars change color as audio plays
- Visual representation using sine wave pattern
- Smooth transitions (100ms duration)

### Playback Speed

**Cycle through speeds:**
1. **1x** - Normal speed
2. **1.25x** - Slightly faster
3. **1.5x** - 50% faster
4. **2x** - Double speed

**Visual Feedback:**
- Active speed highlighted with ring
- Hover scale effect
- One-click cycling

### Time Display

- **Current Time** - Updates in real-time
- **Total Duration** - Shows on load
- **Format** - MM:SS (e.g., "2:35")
- **Small, readable font** - 10px with good contrast

## 🎨 Styling System

### Color Scheme

**Received Variant (Light Mode):**
```css
Background: bg-white/20 dark:bg-gray-800/50
Buttons: bg-white/20 hover:bg-white/30
Progress: bg-white/20 → bg-white/80
Waveform: bg-white/20 → bg-white/60
Text: text-white/70 dark:text-gray-300
```

**Sent Variant (Green Theme):**
```css
Background: bg-green-500/20 dark:bg-green-500/30
Buttons: bg-green-600/30 hover:bg-green-600/40
Progress: bg-green-600/30 → bg-green-100
Waveform: bg-green-600/30 → bg-green-100/80
Text: text-green-100/80
```

### Animations

```tsx
// Hover Effects
hover:scale-105      // Slight grow on hover
active:scale-95      // Press down effect

// Transitions
transition-all duration-200  // Smooth state changes
transition-opacity          // Fade effects

// Ring Effect (Active State)
ring-2 ring-white/30        // Subtle ring
```

## ⚙️ Advanced Usage

### Custom Download Handler

```tsx
const handleCustomDownload = async () => {
  // Track analytics
  analytics.track('audio_download');
  
  // Show loading toast
  toast.loading('Downloading...');
  
  // Custom download logic
  const blob = await fetchAudioBlob(audioUrl);
  saveAs(blob, 'audio.mp3');
  
  toast.success('Downloaded!');
};

<AudioPlayer 
  audioUrl={audioUrl}
  showDownload={true}
  onDownload={handleCustomDownload}
/>
```

### With Caption

```tsx
<div className="flex flex-col gap-2">
  <AudioPlayer audioUrl={audioUrl} variant="received" />
  <p className="text-sm text-gray-600">
    Voice message from John
  </p>
</div>
```

### In Message Bubble

```tsx
<div className={cn(
  "max-w-sm p-3 rounded-2xl",
  isUser ? "bg-blue-500" : "bg-white"
)}>
  <AudioPlayer 
    audioUrl={audioUrl}
    variant={isUser ? "sent" : "received"}
  />
</div>
```

## 🔧 Technical Details

### Audio Element

```tsx
<audio ref={audioRef} src={audioUrl} preload="metadata">
  <track kind="captions" />
</audio>
```

- **Preload metadata** - Loads duration immediately
- **Track element** - Required for accessibility
- **Ref** - Direct DOM access for controls

### Event Listeners

```typescript
audio.addEventListener("loadedmetadata", handleLoadedMetadata);
audio.addEventListener("timeupdate", handleTimeUpdate);
audio.addEventListener("ended", handleEnded);
audio.addEventListener("error", handleError);
```

### State Management

```typescript
const [isPlaying, setIsPlaying] = useState(false);
const [currentTime, setCurrentTime] = useState(0);
const [duration, setDuration] = useState(0);
const [isLoading, setIsLoading] = useState(true);
const [playbackRate, setPlaybackRate] = useState(1);
const [isDragging, setIsDragging] = useState(false);
```

## ♿ Accessibility

### Keyboard Navigation

- **Space/Enter** - Play/pause (when button focused)
- **Tab** - Navigate between controls
- **Click** - All interactions

### ARIA Attributes

```tsx
<Button aria-label="Play audio">
<Button title="Download audio">
<time aria-label={formatTime(currentTime)}>
```

### Screen Reader Support

- Announces current time
- Announces playback state
- Button labels describe actions

## 🎯 Best Practices

### DO ✅

```tsx
// Use appropriate variant
<AudioPlayer variant={isUserMessage ? "sent" : "received"} />

// Show download for important audio
<AudioPlayer showDownload={true} />

// Provide custom download handler
<AudioPlayer onDownload={trackAndDownload} />
```

### DON'T ❌

```tsx
// Don't use without variant consideration
<AudioPlayer audioUrl={url} /> // Always in wrong context

// Don't forget error handling
<AudioPlayer audioUrl={maybeUndefined} /> // Check URL first

// Don't skip accessibility
<AudioPlayer /> // Always provide proper context
```

## 📱 Responsive Design

- **Min Width:** 280px
- **Max Width:** 320px
- **Adapts to:** Mobile and desktop
- **Touch-friendly:** Large hit areas
- **Mobile-optimized:** Proper spacing

## 🐛 Troubleshooting

### Audio Won't Play

**Problem:** Audio doesn't start playing

**Solutions:**
1. Check if `audioUrl` is valid
2. Verify CORS headers on audio file
3. Ensure audio format is supported
4. Check browser console for errors

### Waveform Not Showing

**Problem:** Waveform bars not visible

**Solutions:**
1. Check z-index of parent elements
2. Verify background colors have contrast
3. Ensure component has proper dimensions

### Time Display Shows "0:00"

**Problem:** Duration not loading

**Solutions:**
1. Wait for `loadedmetadata` event
2. Check if audio file is valid
3. Verify file has proper metadata

## 🔄 Updates & Roadmap

### Current Version: 1.0.0

**Planned Features:**
- [ ] Volume control
- [ ] Seek preview on hover
- [ ] Custom waveform data (real audio analysis)
- [ ] Skip forward/backward buttons
- [ ] Loop toggle
- [ ] Playlist support

## 📚 Related Components

- **MediaMessageDisplay** - Parent component that uses AudioPlayer
- **ChatHub.Messages** - Renders messages with audio
- **FileUploadComponent** - For uploading audio files

## 🤝 Contributing

When modifying this component:

1. Maintain accessibility features
2. Test on mobile and desktop
3. Verify both variants look good
4. Check audio playback on different formats
5. Update this documentation

---

**Built with ❤️ for a WhatsApp-like experience**