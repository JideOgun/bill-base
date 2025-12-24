# Hot Reloading / Fast Refresh Guide

## ✅ Fast Refresh is Already Enabled!

Expo comes with **Fast Refresh** (React Native's hot reloading) enabled by default. You don't need to install anything extra.

## How It Works

When you save a file, Expo automatically:
1. Detects the change
2. Recompiles only the changed modules
3. Updates your app without losing state (for most changes)

## Usage Tips

### For UI Changes
- **Save your file** (Cmd+S / Ctrl+S)
- Changes appear **instantly** in your app
- **No manual restart needed!**

### What Triggers a Full Reload
Some changes require a full app reload:
- Changes to native code
- Changes to `app.json` or `app.config.js`
- Changes to `babel.config.js` or `metro.config.js`
- Adding/removing dependencies

### Keyboard Shortcuts
- **`r`** - Reload the app
- **`m`** - Toggle menu (dev tools)
- **`j`** - Open debugger
- **`Shift+r`** - Clear cache and reload

## Troubleshooting

If Fast Refresh isn't working:

1. **Check your terminal** - Look for "Fast Refresh" messages
2. **Restart the dev server:**
   ```bash
   npm start
   ```
   Then press `r` in the terminal to reload

3. **Clear cache:**
   ```bash
   npm start -- --clear
   ```

4. **Check for syntax errors** - Fast Refresh pauses on errors

5. **Ensure you're using default exports** for components:
   ```tsx
   // ✅ Good
   export default function MyComponent() { ... }
   
   // ❌ May not work with Fast Refresh
   export const MyComponent = () => { ... }
   ```

## Platform-Specific Notes

### iOS Simulator
- Fast Refresh works automatically
- Shake device or Cmd+D for dev menu

### Android Emulator
- Fast Refresh works automatically
- Shake device or Cmd+M for dev menu

### Web Browser
- Uses webpack's hot module replacement
- Works automatically when you save files

## Current Configuration

- ✅ `babel-preset-expo` includes Fast Refresh
- ✅ `metro.config.js` configured for optimal performance
- ✅ File watching enabled by default

No additional setup needed! Just save your files and see changes instantly.

